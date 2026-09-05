# Example 02: RAG Audit Walkthrough

Sample RAG audit against a hypothetical deployment. The output shape is the canonical RAG audit report.

> **Reference guides:** `guides/00-principles.md`, `guides/08-rag-strategy.md`, `guides/09-vector-payload-schema.md`, `guides/10-cohere-embedding-and-rerank.md`, `guides/07-knowledge-base.md`. Output template: `templates/audit-template.md`.

---

## Invocation

> "Run a RAG audit on tenant `clx9vy200012vu8kj0` over the last 7 days."

---

## Step 1: Stack confirmation

Read `library/knowledge/private/ai/rag-vector-strategy.md` to confirm the canonical stack:

| Layer | Required | Verify |
|---|---|---|
| Vector DB | Qdrant per-tenant | `COLLECTION_NAMES` shape; collections exist for tenant |
| Embedding | Cohere `embed-english-v3.0` (1024-dim cosine) | `cohere-client.ts` `embed()` |
| Rerank | Cohere `rerank-v3.5` (top-K 20 → top-N 5) | `cohere-client.ts` `rerank()` |
| HNSW | `m: 16, ef_construct: 200, on_disk: false` | `qdrant-client.ts` `ensureCollection()` |
| Strict mode | `strict_mode_config.enabled: true` | same |

**Finding:** `qdrant-client.ts:42` correctly sets `m: 16, ef_construct: 200, strict_mode: enabled`. ✓

---

## Step 2: Collection inventory

Run `client.getCollections()` for the tenant. Expected:

- `knowledge-clx9vy200012vu8kj0` ✓
- `academy-clx9vy200012vu8kj0` ✓
- `conversations-clx9vy200012vu8kj0` ✓
- `media-clx9vy200012vu8kj0` ✓

**Sample collection sizes:**

| Collection | Points | Size |
|---|---|---|
| knowledge | 4,712 | 47 MB |
| academy | 18,943 | 189 MB |
| conversations | 31,108 | 311 MB |
| media | 412 | 4 MB |

All within healthy limits (no collection > 10GB, no sharding needed yet).

---

## Step 3: Payload index coverage

For each collection, verify `COMMON_INDEXES` is present.

```typescript
// Expected: 8 indexes (9 for media)
const indexes = await client.getCollection("knowledge-clx9vy200012vu8kj0");
// Inspect indexes.payload_schema
```

**Finding:** `knowledge-clx9vy200012vu8kj0` has all 8 mandatory indexes. ✓
**Finding:** `media-clx9vy200012vu8kj0` has all 9 mandatory indexes (incl. `media_attachment_id`). ✓

---

## Step 4: Sample queries (`tenant_id` filter discipline)

Pull 50 random `AiTrace` rows of `traceType: "chat_turn"` with `knowledgeChunks` populated. Inspect the underlying Qdrant query (logs).

**Finding:** all 50 sampled queries include `tenant_id` filter. ✓

Run `scripts/audit-tenant-id-filters.ts` against `api/src` for static check.

**Finding:** static scan reports 0 missing-`tenant_id` findings. ✓

---

## Step 5: Two-stage retrieval discipline

Verify rerank is in the path. Sample 20 traces; for each, count `knowledgeChunks` array length.

| Trace | Chunks returned | Note |
|---|---|---|
| ai_t_001 | 5 | ✓: Cohere rerank top-5 |
| ai_t_002 | 5 | ✓ |
| ai_t_003 | 5 | ✓ |
| … | … | … |
| ai_t_018 | 20 | 🚨 Reranker fallback fired (top-K-by-ANN): investigate |
| ai_t_019 | 5 | ✓ |
| ai_t_020 | 5 | ✓ |

**Finding (must-fix):** trace `ai_t_018` shows the rerank fallback (20 chunks instead of 5). Cohere rerank failed for that call. Sustained rerank failures must be alerted; currently the fallback is silent. Hand to operations team. See `guides/10-cohere-embedding-and-rerank.md §4`.

---

## Step 6: Embedding input type discipline

Read `cohere-client.ts` and grep all `embed()` callers:

```typescript
// At index time (e.g., knowledge-indexer.ts:74)
const vectors = await embed(chunkTexts, "search_document");   // ✓

// At query time (e.g., knowledge-context.ts:118)
const queryVector = await embedQuery(userMessage);            // ✓ wraps embed(_, "search_query")
```

**Finding:** all `embed()` callers use the correct input type. ✓

---

## Step 7: Retrieval precision

Run `scripts/retrieval-precision-snapshot.ts --tenantId=clx9vy200012vu8kj0 --window=7d`.

```
Total traces: 1,847
Mean retrievalScore: 0.62
P25: 0.45
P05: 0.21

Per-coach mean:
- main_community:           0.71  ✓
- level_2:                  0.58  watch
- level_1:                  0.66  watch
- offer_doc:                0.72  ✓
- special_gift_strategist:  0.41  🚨
- module_*:                 0.38  🚨 (RAG gap — issue #46 territory)
```

**Finding (must-fix):** `special_gift_strategist` mean 0.41, barely above the alert threshold but trending down. Sample 10 worst traces to investigate.

**Finding (must-fix):** `module_*` paths mean 0.38, below alert threshold. **This is the recurring module-/sub-path RAG gap pattern** (`buildCoachingPrompt` uses Postgres only, not Qdrant). See `guides/20-common-failure-modes.md §1.4`.

---

## Step 8: The recurring gap patterns

Confirm each:

| Open | Status |
|---|---|
| 1.1 Routing-call tracing gap | Still open: `runOrchestrator()` doesn't trace `routeToCoach()`. |
| 1.2 Auxiliary-collection retrieval gap | Still open: `buildKnowledgeContext()` queries `knowledge-*` only, not `academy-*`. Confirmed: 18,943 academy points NOT being retrieved during coaching. |
| 1.3 Vector-backup automation gap | Still open: no scheduled snapshot job. Reliability gap. |
| 1.4 Module path RAG gap | Confirmed via Step 7: `module_*` paths show 0.38 mean retrieval (Postgres-only path). |
| 1.5 `PUT /api/admin/knowledge/:id` chunk leak | Tested by re-uploading a knowledge doc and checking point count for that `source_document_id`: confirmed leak (old + new chunks coexist). |

---

## Step 9: Pillar ratings

Ratings: 🟢 Solid · 🟡 Drifting · 🔴 Needs work

| Pillar | Rating | Headline |
|---|---|---|
| Stack discipline | 🟢 | Qdrant + Cohere + OpenRouter + Llama all confirmed |
| Collection design | 🟢 | 4 collections per tenant, naming convention clean, sizes healthy |
| Payload indexing | 🟢 | All `COMMON_INDEXES` present; strict mode active |
| Tenant isolation | 🟢 | Static + sample check both clean |
| Two-stage retrieval | 🟡 | Rerank in path, but silent fallback masking sustained Cohere failures |
| Embedding discipline | 🟢 | Input types correct |
| Retrieval precision | 🟡 | Overall 0.62 below 0.7 target; `special_gift_strategist` borderline; module path failing |
| Recurring gap patterns | 🔴 | All gap patterns still open in this audit |
| Backups | 🔴 | open: no automation |

---

## Step 10: Summary findings

### Must-fix (5)

1. **Module path RAG gap**: `buildCoachingPrompt` not using Qdrant. `coaching-llm.ts:142`. See `guides/20-common-failure-modes.md §1.4`.
2. **`PUT /api/admin/knowledge/:id` chunk leak**: `routes/admin-knowledge.ts:88`. See `guides/20-common-failure-modes.md §1.5`.
3. **Routing-call not traced**: `agent-orchestrator.ts:64`. See `guides/16-observability.md §4`.
4. **Auxiliary-collection retrieval gap**: `knowledge-context.ts:88` only queries `knowledge-{tenantId}`. See `guides/07-knowledge-base.md §10`.
5. **Cohere rerank silent fallback**: no alert on sustained rerank failures. `cohere-client.ts:54`.

### Should-refactor (3)

1. `special_gift_strategist` retrieval mean 0.41: sample 10 worst, refine pinned docs or default prompt.
2. Vector-backup automation gap. Reliability gap.
3. Chunk size 500 chars (~125 tokens) below Cohere's optimal 512-token window. Migration with re-indexing would lift precision but requires evaluation budget.

### Style (0)

---

## Step 11: Output report

Save the audit at `library/requirements/reports/ai/2026-04-25-rag-audit-clx9vy200012vu8kj0.md` per `templates/audit-template.md`.

Notify:
- Engineering lead: must-fixes 1-5.
- `db-worker-bee`: query plans for the `AiTrace` aggregations were slow: possible `(tenantId, traceType, createdAt)` index needed.
- `quality-worker-bee`: feed the eval signals into the next QA review.
