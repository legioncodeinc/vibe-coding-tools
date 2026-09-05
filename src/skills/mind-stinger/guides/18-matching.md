# 18: Matching

`runLLMMatching()`, complementarity scoring, `AiMatchResult` caching, the 200-candidate cap, the referral intro generation.

> **Doc reference:** `library/knowledge/private/ai/matching.md` is canonical.

---

## 1. The `runLLMMatching()` flow

```
POST /api/ai/matching/run
  → Cache hit (Valkey 12h)? → return { cached: true }
  → Profile complete? (productOffering + idealClient + aiWhoYouHelp)
      No → { blocked: true, message }
  → Candidates ≥ 10?
      No → { blocked: true, message }
  → Build LLM prompt (up to 200 candidates)
  → Llama 3.3 70B (chat model, temperature 0.3, max_tokens 1000)
  → Parse JSON, validate scores 0–100, slice to 10
  → Cache in Valkey 12h
  → Persist to AiMatchResult
  → return { results, cached: false }
```

---

## 2. Profile completeness gate

Three fields required (must be non-null):

```typescript
if (!requester?.productOffering || !requester?.idealClient || !requester?.aiWhoYouHelp) {
  return {
    blocked: true,
    message: "Please complete your business profile before running matching. Required: product offering, ideal client, and business description.",
  };
}
```

---

## 3. Minimum candidates

```typescript
const MIN_CANDIDATES = 10;
const MAX_CANDIDATES = 200;
```

Candidates fetched as a single `findMany` with `take: 200` and `approvalStatus: "approved"`. **Level and membership tier are intentionally excluded** from matching criteria.

---

## 4. Profile signals used

**Requester fields sent to LLM:**
- `name`, `company`, `productOffering`, `idealClient`, `expertise[]`, `aiWhoYouHelp`, `aiCoreOutcome`, `aiNiche`

**Candidate fields (compact one-line format):**
```
ID:{id} | {name} | {company} | Offer: {productOffering} | Ideal Client: {idealClient || aiWhoYouHelp} | Expertise: {expertise.join(", ")}
```

`aiCoreOutcome` and `aiNiche` are only sent for the requester.

---

## 5. The matching prompt

```
You are a referral partnership matching engine.
Your job is to find the 10 best referral partners for the requesting member.

A great referral match means:
- Their ideal clients overlap (my clients could need their service, or vice versa)
- Their services are COMPLEMENTARY, not competing
- There is a natural opportunity to refer each other's clients

Do NOT match based on:
- Journey level or membership tier (these are internal progression metrics)
- Join date or seniority
- Geographic proximity (unless explicitly mentioned in their offering)
- Generic similarity (e.g. "both are entrepreneurs")

For each match, write a one-sentence reason that explains the SPECIFIC referral opportunity.

REQUESTING MEMBER:
{requesterProfile}

CANDIDATE PROFILES:
{candidateProfiles}

Return ONLY a JSON array of exactly 10 objects (or fewer if not enough good matches):
[{"userId":"<ID>","score":<0-100>,"reason":"<one sentence referral opportunity>"}]
No markdown, just JSON.
```

System: `"You are a referral matching algorithm. Return only valid JSON arrays."`

| Parameter | Value | Why |
|---|---|---|
| `model` | `getAIModels().chat` (Llama 3.3 70B) | Quality of complementarity reasoning matters |
| `temperature` | `0.3` | Low randomness for consistent scoring; slight diversity in reasoning |
| `max_tokens` | `1000` | Sufficient for 10 scored results |

---

## 6. Score validation

```typescript
results = results
  .filter((r) => r.userId && typeof r.score === "number" && r.reason && r.score >= 0 && r.score <= 100)
  .slice(0, 10);
```

Invalid scores filtered. Malformed JSON → empty `results: []`.

**Gap:** `userId` values are NOT cross-validated against the candidate list. Invalid IDs filtered indirectly by missing-profile lookups but not by explicit ID allowlist. Tracked as a should-refactor.

---

## 7. Caching: Valkey

```typescript
const MATCH_CACHE_TTL = 43200;  // 12 hours
const cacheKey = `ai:match:${tenantId}:${requesterId}`;
```

`cached: boolean` field tells the client whether seeing live or cached results. **Cache is NOT invalidated when new members join**: 12-hour TTL is the only expiry. By design (acceptable trade-off for cost reduction).

---

## 8. Persistence: `AiMatchResult`

```prisma
model AiMatchResult {
  id          String   @id @default(cuid())
  tenantId    String   @map("tenant_id")
  requesterId String   @map("requester_id")
  results     Json     // Array of { userId, score, reason }
  createdAt   DateTime @default(now())

  @@index([tenantId, requesterId, createdAt])
  @@map("ai_match_results")
}
```

`GET /api/ai/matching/results` falls back to the latest DB record if Valkey has expired.

---

## 9. Referral AI: `generateIntroMessage()` (separate path)

`referral-ai.ts` generates a personalized intro message when a member sends a referral. **Separate config** from matching:

```typescript
interface ReferralAiConfig {
  model:           string;          // defaults to "meta-llama/Llama-3.3-70B-Instruct"
  promptTemplate:  string | null;   // SA-configurable system prompt override
  toneWeight:      number;          // 0=casual, 50=professional, 100=formal
  contextDepth:    string;          // "brief" | "standard" | "rich"
}
```

Loaded via `getReferralAiConfig()` from `PlatformConfig`. Cached in Valkey under `platform:referral-ai-config` for 1 hour.

Context depth controls profile information in the intro:

- `brief`: recipient expertise only (2-3 sentences).
- `standard`: sender bio snippet + recipient expertise (2 short paragraphs).
- `rich`: full sender + recipient context (2-3 paragraphs).

Channel (SMS, WhatsApp, Instagram DM) shortens output to 3-4 sentences.

**On any LLM error,** `templateFallback()` silently generates a template-based message so referral creation never fails due to AI unavailability.

---

## 10. API endpoints

### `POST /api/ai/matching/run`

| Field | Value |
|---|---|
| Auth | Required |
| RBAC | `advancedMatching` tier access |
| Feature flag | `enableAdvancedMatching` must be enabled |

```typescript
// 200
{
  results: Array<{ userId: string; score: number; reason: string }>;
  cached: boolean;
}

// 400
{ error: string }  // profile incomplete or not enough candidates
```

### `GET /api/ai/matching/results`

Most recent matching results without triggering a new LLM run. Lookup order: Valkey → latest `AiMatchResult` → `[]`.

---

## 11. Open risks (per the doc)

| # | Risk | Severity | Status |
|---|---|---|---|
| 1 | 200-candidate cap: large communities may have better matches outside the first 200 | Medium | Candidates fetched without scoring order |
| 2 | Cache per-requester: adding a new member doesn't invalidate existing caches | Low | 12h TTL acceptable |
| 3 | LLM returns `userId` not cross-validated against candidate list | Medium | Filtered by missing-profile lookup |

mind-worker-bee flags these on every matching audit.

---

## 12. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Matching call not wrapped in `traceAICall()` | must-fix | `guides/16-observability.md` |
| Matching path using `modelFast` instead of `modelChat` | must-fix | this guide §5 |
| `temperature` drift from 0.3 / `max_tokens` drift from 1000 | must-fix | this guide §5 |
| Profile completeness gate bypassed | must-fix | this guide §2 |
| Level / membership tier added as matching criteria | must-fix | this guide §3 |
| `MIN_CANDIDATES` lowered below 10 | must-fix | this guide §3 |
| `AiMatchResult` not persisted on non-cached run | must-fix | this guide §8 |
| Cache TTL drifted from 43200s | should-refactor | this guide §7 |
| Referral intro `templateFallback()` removed (LLM error → user-visible failure) | must-fix | this guide §9 |
| Hardcoded model in `generateIntroMessage()` (instead of `getReferralAiConfig().model`) | must-fix | this guide §9 |
