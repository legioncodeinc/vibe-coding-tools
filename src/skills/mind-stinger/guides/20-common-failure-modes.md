# 20: Common Failure Modes

Recurring product-specific issues. The recurring gap patterns, the high-frequency bugs, the canonical fixes.

> **Doc references:** `library/knowledge/private/ai/README.md` (open issues), `library/knowledge/private/ai/context-continuity.md §1` (the seven loss vectors), `library/knowledge/private/ai/observability-evaluation.md` (eval thresholds).

---

## 1. The recurring gap patterns

mind-worker-bee flags these on every applicable invocation until they're fixed:

### 1.1 Routing-call tracing gap

**Symptom:** `runOrchestrator()` does NOT wrap `routeToCoach()` in `traceAICall()`. Routing accuracy can only be evaluated indirectly. Router token spend is invisible.

**Fix:**
```typescript
const coachType = await traceAICall({
  tenantId, userId, sessionId,
  traceType: "routing",
  model:     fastModel,
  userQuery: message,
  call:      () => routeToCoach({ message, memberContext }),
});
```

**Doc to update:** `library/knowledge/private/ai/agent-orchestration.md §1`.

### 1.2 Auxiliary-collection retrieval gap

**Symptom:** `buildKnowledgeContext()` only searches `knowledge-{tenantId}`, NOT `academy-{tenantId}`. Academy content is indexed but not retrieved during coaching.

**Fix:** extend `buildVectorContext()` to query both collections; merge via separate top-3 from each, then rerank both together. See `examples/02-rag-audit-walkthrough.md` for the audit pattern.

**Doc to update:** `library/knowledge/private/ai/knowledge-base.md §8`.

### 1.3 Vector-backup automation gap

**Symptom:** Qdrant supports daily snapshots via REST. Snapshots should land in DO Spaces. Not yet automated.

**Fix:** scheduled job (cron / k8s CronJob) calling Qdrant snapshot API + DO Spaces upload. Retain 30 daily snapshots.

**Doc to update:** `library/knowledge/private/ai/rag-vector-strategy.md §15`.

### 1.4 Module path RAG gap

**Symptom:** `buildCoachingPrompt` (module coaching) uses Postgres `CoachKnowledgeDocument` only; does not query Qdrant. Module sessions get text-budget knowledge only.

**Fix:** migrate `buildCoachingPrompt()` to call `buildKnowledgeContextWithMeta()` for module sessions. Update the RAG status table in `library/knowledge/private/ai/README.md`.

**Doc to update:** `library/knowledge/private/ai/coach-architecture.md decision log` + `library/knowledge/private/ai/knowledge-base.md §4`.

### 1.5 `PUT /api/admin/knowledge/:id` chunk leak

**Symptom:** Re-indexing a document does NOT call `removeKnowledgeDocument()` first. Old chunks accumulate in Qdrant. Workaround: `DELETE` + re-`POST`.

**Fix:** in `PUT` handler, call `removeKnowledgeDocument(id, tenantId)` before `indexKnowledgeDocument()`.

**Doc to update:** `library/knowledge/private/ai/knowledge-base.md §3` (status: closed once fixed).

---

## 2. High-frequency bugs

### 2.1 Cached coach persona drift

**Symptom:** Admin edits `AiCoachConfig.systemPrompt`. The Valkey cache `coach:persona:{tenantId}:{coachType}` (TTL 600s) doesn't reflect the new value. Members get the old prompt for up to 10 minutes.

**Fix:** admin route `PUT /api/admin/ai-coaches/:coachId` MUST invalidate the cache:
```typescript
await prisma.aiCoachConfig.update({ ... });
await valkey.del(`coach:persona:${tenantId}:${coachType}`);
```

Plus call `recordPromptVersion()`. See `guides/05-prompt-versioning.md`.

### 2.2 Drifted top-K / top-N

**Symptom:** `KNOWLEDGE_CANDIDATES` and `KNOWLEDGE_TOP_N` constants edited without doc update or eval pass.

**Fix:** restore to `20 / 5` per `guides/08-rag-strategy.md §5`. If the change was intentional, update the doc and run a measured eval pass.

### 2.3 Missing `tenant_id` filter

**Symptom:** Qdrant query missing the mandatory `tenant_id` filter. **Security issue.**

**Fix:** add the filter; hand to `security-worker-bee` for audit.
```typescript
filter: {
  must: [
    { key: "tenant_id", match: { value: tenantId } },
    { key: "user_id",   match: { value: userId   } },  // when user-scoped
  ],
}
```

### 2.4 Wrong Cohere `inputType`

**Symptom:** `embed()` called with `"search_query"` at index time, or `"search_document"` at retrieval time. Retrieval quality drops 5-15%.

**Fix:** index = `"search_document"`; retrieval = `embedQuery()` (which uses `"search_query"` internally).

### 2.5 Untraced LLM call

**Symptom:** `await openai.chat.completions.create(...)` not wrapped in `traceAICall()`.

**Fix:** wrap. See `guides/16-observability.md §3`.

### 2.6 Hardcoded model name

**Symptom:** Literal `"meta-llama/Llama-3.3-70B-Instruct"` in code instead of `(await getAIModels()).chat`.

**Fix:** use `getAIModels()`.

### 2.7 Filter on unindexed payload field

**Symptom:** Qdrant query rejected by `strict_mode_config: { enabled: true }` because filter references an unindexed field.

**Fix:** add the index in `COMMON_INDEXES` first, run `ensureCollection()` to backfill the index, THEN add the filter to the query. See `guides/09-vector-payload-schema.md §8`.

### 2.8 `temperature` / `max_tokens` drift

**Symptom:** Routing call running at `temperature: 0.5` (drifted from `0`); coaching call at `max_tokens: 800` (drifted from `500`).

**Fix:** restore per `guides/04-prompt-engineering.md §12`.

### 2.9 Sycophancy creep without prompt change

**Symptom:** `AiTrace.agreementScore` trending upward; no `PromptVersion` write in the last week.

**Fix:** sycophancy can creep from upstream model updates (OpenRouter → Llama 3.3 70B → underlying provider changes). The lever is still the prompt cascade: strengthen `[COACHING_QUALITY]` or `[COACH_PERSONALITY]`. See `guides/17-evaluation-discipline.md §9`.

### 2.10 Compaction job stuck in `COMPACTING`

**Symptom:** `AiChatSession.status = "compacting"` for > 10 minutes. Lock `compact:lock:{sessionId}` not released.

**Fix:** the watchdog TTL (600s) should auto-release the lock. If a session is stuck > 10 min, the worker process likely crashed. Manual recovery: `DEL compact:lock:{sessionId}`, set `status = "active"`. Investigate worker crash via `AiTrace.error` rows.

---

## 3. Symptom → likely cause table

| Symptom | Likely cause | Investigation |
|---|---|---|
| User says "the coach doesn't remember what we discussed" | Episodic memory not retrieved on resume | `reconstructSession()` query, `applyDecay()` weights, `EPISODIC_TOP_N` |
| User says "the coach is too agreeable" | Sycophancy creep | `agreementScore` trend, recent `PromptVersion`, model slot change |
| User says "the coach gave me wrong info" | Retrieval failure or hallucination | `retrievalScore`, `faithfulnessScore`, sample 5 traces |
| User says "the coach asked me to repeat what I just said" | Sub-agent blank slate (handoff bug) | `assembleContextPacket()` not built before routing |
| Latency spike on coach response | Qdrant slow / Cohere slow / LLM slow | `retrievalLatencyMs`, `llmLatencyMs` per-trace breakdown |
| "Locked: complete level X to unlock" returned | Level gate, not a bug | Verify `AiCoachConfig.levelAccess` |
| Onboarding stuck: agent calls `complete_onboarding` immediately after `generate_welcome_post` | Critical safety rule violated | Sample the system prompt: is the rule still there? |
| Knowledge doc edits not appearing in coaching | `PUT` chunk leak | Issue 1.5 above |
| Routing wrong on a phrase that should clearly map | Router prompt missing the rule | Update router prompt + eval |
| All AI features silently failing | OpenRouter $0 balance | Check OpenRouter dashboard balance |
| Cohere errors throughout day | Cohere rate limit (10K texts/min) or batch > 96 | Reduce batch; backoff |
| Qdrant query rejected with "strict_mode" error | Filter on unindexed field | Issue 2.7 above |

---

## 4. Failure-mode triage workflow

When invoked for a failure investigation:

1. **Gather symptom**: what is the observed behavior?
2. **Pull `AiTrace`**: last 24h, narrowed by `tenantId` + `coachType` + symptom-relevant filter.
3. **Aggregate**: error rate, latency P50/P95, retrieval/routing/agreement scores.
4. **Find inflection**: when did it start? Correlate with `PromptVersion`, deploys, model slot edits.
5. **Sample worst traces**: read 5-10 in detail.
6. **Match against §3 table**: is this a known pattern?
7. **Hypothesize**: propose 1-2 falsifiable causes.
8. **Test**: A/B if possible; otherwise targeted change with before/after measurement.
9. **Report**: `library/requirements/reports/ai/<date>-failure-investigation.md` per `templates/audit-template.md`.
10. **Update this guide** if the failure mode is new, add to §3 table.

---

## 5. Operational degradation modes

### Valkey outage

- All sessions fall to `RESUMED` on next message.
- `reconstructSession()` runs every turn (Qdrant fallback).
- Performance degrades; functionality maintained.

### Qdrant outage

- Session resume fails (no episodic).
- Knowledge base context unavailable.
- Fallback: serve raw last-10 turns from Postgres.
- **Critical alert**: severe degradation.

### Cohere outage

- Embedding fails on index attempts (queue and retry).
- Rerank falls back to top-K-by-ANN (degradation, not failure).
- New knowledge documents won't index until Cohere recovers.

### OpenRouter outage / $0 balance

- All AI features silently fail.
- Onboarding broken. Coaching broken. Matching broken.
- **Critical alert**: must be alerted within 1 minute.

### Deepgram outage

- Image processing unaffected.
- Video processing fails at Stage 3 (transcription). Job retries 3× then DLQ.
- Manual replay after recovery.

---

## 6. Common findings: the master list (cross-references)

| Finding | Severity | Source |
|---|---|---|
| Untraced LLM call | must-fix | `guides/16-observability.md §3` |
| Missing `tenant_id` filter on Qdrant query | must-fix | `guides/09-vector-payload-schema.md §2` |
| Hardcoded model name in code | must-fix | `guides/19-llm-provider-config.md §3` |
| Filter on unindexed payload field | must-fix | `guides/09-vector-payload-schema.md §8` |
| Direct provider-API call bypassing OpenRouter | must-fix | `guides/01-stack-enforcement.md` |
| Per-user / global Qdrant collection | must-fix | `guides/08-rag-strategy.md §1` |
| Raw turns indexed to Qdrant | must-fix | `guides/12-three-tier-memory.md §2` |
| Two-stage retrieval skipping rerank | must-fix | `guides/10-cohere-embedding-and-rerank.md §4` |
| `[INSTRUCTION_HIERARCHY]` missing or not last | must-fix | `guides/03-prompt-cascade.md §4` |
| Prompt change without `recordPromptVersion()` | must-fix | `guides/05-prompt-versioning.md §3` |
| `temperature` / `max_tokens` drift | must-fix | `guides/04-prompt-engineering.md §12` |
| Wrong Cohere `inputType` | must-fix | `guides/10-cohere-embedding-and-rerank.md §2` |
| Routing call uses `modelChat` | should-refactor (cost) | `guides/02-coach-architecture.md §3` |
| Cached coach persona drift | should-refactor | `guides/04-prompt-engineering.md §8` |
| Drifted top-K / top-N | should-refactor | `guides/08-rag-strategy.md §5` |
| New context source added without doc update | must-fix | `guides/15-agent-orchestration.md §3` |
| RAG-active feature with no eval signal | must-fix | `guides/17-evaluation-discipline.md §1` |
| `KnowledgeDocument` PUT leaking chunks | must-fix | this guide §1.5 |
| Sycophancy mitigation reaching for `temperature` | must-fix | `guides/17-evaluation-discipline.md §9` |
| Substitution proposed without policy compliance | must-fix | `guides/01-stack-enforcement.md §2` |
