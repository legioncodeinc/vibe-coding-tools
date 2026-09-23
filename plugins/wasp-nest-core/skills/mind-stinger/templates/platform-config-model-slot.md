# Template: PlatformConfig Model Slot

The shape for `PlatformConfig` model slots and the procedure for swapping a slot value.

> **Source-of-truth:** `library/knowledge/private/ai/coach-architecture.md §3` + `library/knowledge/private/ai/README.md` (model slot table).
> **Code:** `lib/ai-client.ts` (`getAIModels`, `invalidateAIModelsCache`).

---

## 1. The three slots

```typescript
interface AIModels {
  chat:   string;   // "meta-llama/Llama-3.3-70B-Instruct"
  fast:   string;   // "meta-llama/Llama-3.1-8B-Instruct"
  vision: string;   // "meta-llama/llama-3.2-11b-vision-instruct"
}
```

Stored on `PlatformConfig`:

```prisma
model PlatformConfig {
  id           String  @id @default(cuid())
  modelChat    String  @default("meta-llama/Llama-3.3-70B-Instruct")
  modelFast    String  @default("meta-llama/Llama-3.1-8B-Instruct")
  modelVision  String  @default("meta-llama/llama-3.2-11b-vision-instruct")
  systemPromptBlocks Json?
  // ... other fields
}
```

---

## 2. Reader: `getAIModels()`

```typescript
export async function getAIModels(): Promise<AIModels> {
  const cached = await valkey.get("platform:ai-models");
  if (cached) return JSON.parse(cached);

  const cfg = await prisma.platformConfig.findFirst();
  const models: AIModels = {
    chat:   cfg?.modelChat   ?? "meta-llama/Llama-3.3-70B-Instruct",
    fast:   cfg?.modelFast   ?? "meta-llama/Llama-3.1-8B-Instruct",
    vision: cfg?.modelVision ?? "meta-llama/llama-3.2-11b-vision-instruct",
  };
  await valkey.set("platform:ai-models", JSON.stringify(models), "EX", 3600);  // 1h TTL
  return models;
}
```

**Cache key:** `platform:ai-models`. **TTL:** 3600s (1 hour).

---

## 3. Invalidation: `invalidateAIModelsCache()`

```typescript
export async function invalidateAIModelsCache(): Promise<void> {
  await valkey.del("platform:ai-models");
}
```

**Must be called from the SA route after a slot edit:**

```typescript
// api/src/routes/super-admin/platform-config.ts
await prisma.platformConfig.update({
  where: { id },
  data:  { modelChat, modelFast, modelVision },
});
await invalidateAIModelsCache();   // ← REQUIRED
```

Without this call, the new slot values won't take effect for up to 1 hour.

---

## 4. Slot swap procedure (for SA)

When swapping a slot (e.g., `modelChat` from Llama 3.3 70B to a different model):

1. **Read current eval baseline**: pull last 7 days of `AiTrace.retrievalScore`, `routingCorrect`, `agreementScore` for the affected slot. Document baseline numbers.
2. **Pre-prod test if possible**: point staging to the new model slot, run the golden eval suite, verify no > 5% regression.
3. **Edit the slot** in SA AI Configuration screen.
4. **Confirm `invalidateAIModelsCache()` was called** (handled by the route automatically).
5. **Watch the metrics for 48 hours**: alert if any metric drops > 10% from baseline.
6. **Rollback path:** revert the slot edit + re-invalidate. Document the regression in `library/requirements/reports/ai/<date>-slot-rollback.md`.

---

## 5. Slot usage table

Per-call slot mapping (the canonical table, drift is a finding):

| Use case | Slot | File |
|---|---|---|
| Coaching response | `chat` | `agent-orchestrator.ts`, `coaching-llm.ts` |
| Routing classification | `fast` | `ai-coach-router.ts` |
| Matching | `chat` | `ai-matching.ts` |
| Onboarding agent | `chat` | `onboarding-ai.ts` |
| Session summary: extract | `fast` | `coaching-llm.ts` |
| Session summary: narrative | `chat` | `coaching-llm.ts` |
| Module opening message | `chat` | `coaching-llm.ts` |
| Recursive summarization | `fast` | `media-summarizer.ts` |
| Image / video frame description | `vision` | `image-processor.ts`, `video-processor.ts` |
| Retrieval-precision eval | `fast` | `ai-eval.ts` |
| Routing eval | `fast` | `ai-eval.ts` |
| Referral intro | `chat` (or `getReferralAiConfig().model`) | `referral-ai.ts` |

---

## 6. Per-feature override pattern (when allowed)

Any per-feature override (e.g., a single experimental coach using a different model) MUST:

- Read from `PlatformConfig` (separate field) or a feature-flag table.
- Never hardcode a model literal.
- Document in `library/knowledge/private/ai/coach-architecture.md`.

The current `getReferralAiConfig()` is the precedent: separate config, separate cache key, same pattern (DB-stored, Valkey-cached).

---

## 7. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Hardcoded model literal in code | must-fix | this template §2 |
| `getAIModels()` not awaited | must-fix | this template §2 |
| Slot edit without `invalidateAIModelsCache()` call | must-fix | this template §3 |
| TTL drift from 3600s | should-refactor | this template §2 |
| Per-feature override hardcoding model (instead of separate `PlatformConfig` field) | must-fix | this template §6 |
| Slot swap without 48h post-swap monitoring | should-refactor | this template §4 |
