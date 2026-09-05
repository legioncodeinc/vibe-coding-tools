# 02: Coach Architecture

The 7 coach types as canon, the `routeToCoach()` Llama 3.1 8B classifier, level gating, the draft-coach guard, and the `main_community` fallback.

> **Doc reference:** `library/knowledge/private/ai/coach-architecture.md` is the canonical doc. This guide is the playbook.

---

## 1. The 7 coach types: canonical lineup

| Coach Type | Display | Purpose | Level Gate | Notes |
|---|---|---|---|---|
| `main_community` | Community Coach | General Q&A: business, referrals, networking | None | **Default fallback.** Routing failures and unrecognised values fall here. |
| `onboarding` | Onboarding Strategist (display name from `Tenant.onboardingAgentName`, default `"AI Agent"`) | Profile setup via SSE streaming | None | Distinct path: `streamOnboardingChat()`, not `runOrchestrator()`. |
| `level_1` | Level 1 Coach | Foundations: ideal client, offer clarity | Level 1 |  |
| `level_2` | Level 2 Coach | Scaling: positioning, referral systems | Level 2 |  |
| `level_3` | Level 3 Coach | Mastery: leadership, high-value partnerships | Level 3 |  |
| `offer_doc` | Offer Doc Coach | One-sentence referrable offer | None |  |
| `special_gift_strategist` | Special Gift Strategist | Distinctive value, personal brand | None | Added April 2026. |

Adding / removing / renaming a coach requires updating `library/knowledge/private/ai/coach-architecture.md` **first**. The doc is the source of truth; the enum, router prompt, default prompt, and DB seed follow.

---

## 2. The full add-coach checklist

When a contributor proposes a new coach type:

- [ ] **Doc updated**: `library/knowledge/private/ai/coach-architecture.md` reflects the new lineup.
- [ ] **Enum updated**: `AiCoachType` Prisma enum includes the new value.
- [ ] **Routing prompt updated**: the classifier prompt in `routeToCoach()` lists the new type with a `keyword → coachType` rule.
- [ ] **Default prompt added**: `getDefaultGlobalPrompt(coachType)` in `ai-prompt-builder.ts` returns a default for the new type.
- [ ] **Level gate set**: if level-gated, `AiCoachConfig.levelAccess` populated; the route check returns `locked: true` for under-level members.
- [ ] **`AiCoachConfig` row**: DB seed creates an `AiCoachConfig` for each tenant (or a tenant migration script does it).
- [ ] **Admin endpoint validated**: the new coach appears in `GET /api/admin/ai-coaches`.
- [ ] **Eval cases added**: golden routing dataset extended with 5 to 10 cases for the new coach.
- [ ] **Trace dimensions confirmed**: `AiTrace.agentTypeRouted` accepts the new value (it's a string, so this is a documentation step, not a migration).
- [ ] **Asset registry entry**: handed to `asset-worker-bee`.

---

## 3. `routeToCoach()`: the classifier

```typescript
// lib/ai-coach-router.ts
const { fast: fastModel } = await getAIModels();
const response = await openai.chat.completions.create({
  model: fastModel,                                                  // "meta-llama/Llama-3.1-8B-Instruct"
  messages: [
    { role: "system", content: ROUTING_PROMPT },                     // see below
    { role: "user",   content: message },
  ],
  max_tokens: 20,                                                    // one-word response
  temperature: 0,                                                    // deterministic
});
```

### Required parameters (must-fix if drifted)

| Parameter | Value | Why |
|---|---|---|
| `model` | `getAIModels().fast` (Llama 3.1 8B) | ~10× cheaper than 70B; classification accuracy sufficient. Using 70B is should-refactor (cost). |
| `temperature` | `0` | Routing must be deterministic: same input → same coach. |
| `max_tokens` | `20` | One-word response. Higher wastes tokens. |

### The classifier prompt structure

Per `library/knowledge/private/ai/prompt-engineering.md §11`:

```
You are a routing classifier. Given a user message, determine which specialized
coach should handle it. Reply with ONLY one of these exact values:
main_community, onboarding, level_1, level_2, level_3, offer_doc, special_gift_strategist

Guidelines:
- ideal clients, target market → main_community (unless explicitly about offer doc)
- offers, pricing, packaging → offer_doc
- onboarding, getting started, profile setup → onboarding
- level-specific goals matching the member's current level → level_{n}
- unique strengths, distinctive qualities, personal brand, special gift → special_gift_strategist
- general questions, community topics → main_community
- if unsure → main_community

The member is currently at Level {memberContext.level}.
```

When you add a coach, add a `→ {coachType}` rule to the Guidelines list. When you remove one, remove its rule.

### Routing failures fall back to `main_community`

```typescript
const raw = response.choices[0]?.message?.content?.trim().toLowerCase() ?? "main_community";
if (!VALID_COACH_TYPES.has(raw)) return "main_community";
return raw;
```

This is intentional: an unrecognized value or a parse failure should not break the chat. The fallback is logged but not surfaced to the user.

### Explicit coach selection bypasses routing

If `coachId` (or `memberContext.explicitCoach`) is present in the request, routing is skipped:

```typescript
if (memberContext.explicitCoach) return memberContext.explicitCoach;
```

This is the path the Cursor IDE chat UI uses when the member picks a coach from a tab.

---

## 4. The routing-call tracing gap (always flag)

`runOrchestrator()` does NOT wrap the `routeToCoach()` call in `traceAICall()`. Only the main LLM call is traced. This is a documented gap:

- Routing accuracy can only be evaluated indirectly (sampling `AiTrace.agentTypeRouted` against `evaluateRouting()`).
- The router's token spend is invisible.
- Router failures don't appear in observability dashboards.

**Fix:** wrap the routing call in `traceAICall({ traceType: "routing", model: fastModel, ... })`. The `AiTrace` schema already supports `traceType: "routing"`. Until fixed, flag this on every observability audit.

See `guides/16-observability.md` and `guides/20-common-failure-modes.md`.

---

## 5. Level gating

After routing, the route checks `memberLevel < coachConfig.levelAccess`:

```typescript
if (coachConfig?.levelAccess && memberLevel < coachConfig.levelAccess) {
  return reply.send({
    locked: true,
    message: `Complete Level ${coachConfig.levelAccess - 1} to unlock the ${coachConfig.name} Coach`,
    requiredLevel: coachConfig.levelAccess,
  });
}
```

- Level gates apply to `level_1` / `level_2` / `level_3`.
- A member at Level 0 routed to `level_2` returns `locked: true`.
- The router itself does not enforce gating: it routes by message intent. The route is the gate.

---

## 6. Draft coach guard

Coaches in `draft` status are blocked at the route layer:

```typescript
if (coachConfig?.status === "draft") {
  return reply.code(400).send({ error: "This coach is currently in draft mode" });
}
```

- A draft coach is configured but not active. Useful for prompt iteration without exposing to members.
- If a routing call returns a draft coach, the route returns 400. The router does NOT know about draft status.

---

## 7. Module path divergence (`buildCoachingPrompt`)

When `moduleType` is provided in the request, the coaching path is different:

| Path | Used when | Function | RAG? |
|---|---|---|---|
| Global coach | `moduleType` absent | `composeSystemPrompt()` → `buildKnowledgeContextWithMeta()` | **Yes**: Qdrant + Cohere rerank |
| Module | `moduleType` present (`goals`, `ideal_client`, `offer`, `positioning`, `referral_strategy`) | `buildCoachingPrompt()` (in `coaching-llm.ts`) → Postgres `CoachKnowledgeDocument` | **No**: Postgres only |
| Checklist | `checklistItemId` present | `Step.promptText` if available, else falls back to `buildGlobalCoachPrompt()` | **Partial**: RAG-active in fallback |

**The module path RAG gap** is one of the recurring gap patterns. `buildCoachingPrompt` predates the Qdrant infrastructure. Migrating module coaching to use `buildKnowledgeContextWithMeta()` would close this gap. See `guides/07-knowledge-base.md` and `guides/20-common-failure-modes.md`.

---

## 8. Coach config caching (Valkey)

Coach personas (`AiCoachConfig.systemPrompt`) are cached in Valkey:

| Key | Value | TTL |
|---|---|---|
| `coach:persona:{tenantId}:{coachType}` | The full system prompt for the coach | 600 seconds (10 minutes) |

A drift between the cached value and the DB row is a **should-refactor** finding (10-minute eventual consistency is by design, but a 24-hour stale cache is not). The admin route `PUT /api/admin/ai-coaches/:coachId` MUST invalidate the cache after a write.

---

## 9. Session keying per coach

| Coach | Session Key | Lifecycle |
|---|---|---|
| Global (`main_community`, `level_*`, `offer_doc`, `special_gift_strategist`) | `coachType` (one session per coach per user) | Resumable across visits |
| Module (`module_goals`, etc.) | `module_{moduleType}` (one session per module per user) | Persistent across visits |
| Onboarding | `coachType: "onboarding"` (one per member) | Single onboarding session per member |

---

## 10. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Hardcoded coach list in code (instead of `AiCoachType` enum) | must-fix | `coach-architecture.md §1` |
| Routing call uses `modelChat` instead of `modelFast` | should-refactor (cost) | this guide §3 |
| Router prompt missing rule for a coach type that's in the enum | must-fix | this guide §3 |
| Default prompt missing in `getDefaultGlobalPrompt()` for a coach in the enum | must-fix | `coach-architecture.md §4` |
| Level gate applied at the router layer (instead of the route layer) | must-fix | this guide §5 |
| Draft coach exposed to members | must-fix | this guide §6 |
| Coach persona Valkey TTL drifted from 600s | should-refactor | this guide §8 |
| Module path adopts Qdrant without updating doc | must-fix | `coach-architecture.md decision log` |
