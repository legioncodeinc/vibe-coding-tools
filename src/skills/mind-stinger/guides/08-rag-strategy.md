# 08: RAG Strategy

> **Alternative stack.** This guide documents the Qdrant plus Cohere `rerank-v3.5` implementation of two-stage retrieval, one fully supported option for a project that already runs it. For this repo's default retrieval substrate (Neon Postgres plus pgvector), see `guides/00-selection-and-defaults.md`, and hand schema and query work to `vector-store-stinger` and `retrieval-stinger`.

Qdrant per-tenant collections, two-stage retrieval (vector + Cohere `rerank-v3.5`), HNSW tuning, top-K / top-N defaults, the GDPR vector deletion procedure, the cold-start handling, and the sharding plan.

> **Doc reference:** `library/knowledge/private/ai/rag-vector-strategy.md` is canonical.

---

## 1. Per-tenant collections, not per-user

Collections are named `{type}-{tenantId}`. Per-user collections were rejected at design time because:

- 10K users × 4 collection types per user = 40K collections. Each maintains its own HNSW index, memory overhead, metadata.
- Per-collection architectures consume ~10× more memory than shared collections with equivalent vector counts.
- Operational complexity compounds linearly with collection count.

**User isolation is via indexed payload fields** (`user_id`, `session_id`, `thread_id`). Every user-specific query MUST include `user_id` filter. See `guides/09-vector-payload-schema.md`.

---

## 2. The four collections

| Collection | Pattern | Owner | Content |
|---|---|---|---|
| Knowledge documents | `knowledge-{tenantId}` | `knowledge-indexer.ts` | Org KB, methodology docs, coach docs, member `business_profile` docs |
| Academy lessons | `academy-{tenantId}` | `knowledge-indexer.ts` | Course and lesson content |
| Conversation memory | `conversations-{tenantId}` | `conversation-indexer.ts` | Episodic session summaries, semantic facts |
| Media attachments | `media-{tenantId}` | `image-processor.ts`, `video-processor.ts` | Image descriptions and video transcripts |

```typescript
// qdrant-client.ts
export const COLLECTION_NAMES = {
  knowledge:     (tenantId) => `knowledge-${tenantId}`,
  academy:       (tenantId) => `academy-${tenantId}`,
  conversations: (tenantId) => `conversations-${tenantId}`,
  media:         (tenantId) => `media-${tenantId}`,
} as const;
```

`ensureAllCollectionsForTenant()` creates all four in parallel at server startup and on new-tenant creation.

### Collection naming rules

- Always lowercase kebab-case.
- Always suffixed with `-{tenantId}`.
- Never a global collection shared across tenants.
- New collection types extend `COLLECTION_NAMES`, NOT a literal string in code.

---

## 3. Vector configuration (canonical)

```
Vector size:     1024  (Cohere embed-english-v3.0)
Distance metric: Cosine
```

`VECTOR_SIZE = 1024` in `qdrant-client.ts` is the single source of truth. **Never hardcode 1024 elsewhere.**

**Why cosine:** measures angle, not magnitude: optimal for semantic text embeddings where direction (not length) carries meaning.

---

## 4. HNSW tuning

```typescript
await client.createCollection(collectionName, {
  vectors: {
    size:        VECTOR_SIZE,           // 1024
    distance:    "Cosine",
    hnsw_config: { m: 16, ef_construct: 200 },
    on_disk:     false,                 // RAM-resident — minimal latency
  },
  strict_mode_config: { enabled: true },
  optimizers_config:  { default_segment_number: 4 },
});
```

| Parameter | Value | Why |
|---|---|---|
| `m` | 16 | Edges per node: standard for 1024-dim vectors |
| `ef_construct` | 200 | Search width during index build: higher = better quality, build cost amortized once |
| `on_disk` | `false` | Vectors in RAM for minimum latency |
| `strict_mode_config.enabled` | `true` | Reject filters on unindexed fields: prevents silent full-scans |
| `optimizers_config.default_segment_number` | `4` | Match Qdrant node CPU count |

Adjusting any of these requires `library/knowledge/private/ai/rag-vector-strategy.md §4` update + measured eval pass.

---

## 5. Two-stage retrieval pipeline

```
Stage 1 — Qdrant ANN search
  Input:  query vector (Cohere "search_query")
  Output: top KNOWLEDGE_CANDIDATES = 20 approximate nearest neighbors
  Cost:   fast, O(log n)

Stage 2 — Cohere rerank-v3.5
  Input:  query string + 20 candidate text passages
  Output: top KNOWLEDGE_TOP_N = 5 passages re-scored by cross-encoder
  Cost:   ~200ms, priced per 1K queries
  Fallback: on Cohere error, use top-5 ANN results without rerank
```

Constants in `knowledge-context.ts`:

```typescript
const KNOWLEDGE_CANDIDATES = 20;
const KNOWLEDGE_TOP_N      = 5;
const EPISODIC_CANDIDATES  = 10;
const EPISODIC_TOP_N       = 3;
```

**Skipping rerank in the canonical two-stage path is a finding.** The fallback (top-K-by-ANN) is a degradation, not a design.

### Why two stages

ANN recall is wide (cheap, slightly noisy). Cross-encoder rerank narrows to high-precision passages by scoring query-document pairs jointly. Vendor benchmarks consistently show rerank lifting precision by 15-30% on realistic retrieval tasks; for the deploying product, the lift shows up in `evaluateRetrievalPrecision()` scores.

---

## 6. Embedding input types (Cohere discipline)

```typescript
embed(texts, "search_document")  // for indexing
embedQuery(text)                 // for retrieval — calls embed([text], "search_query") internally
```

**Mixing types degrades retrieval quality.** Always use the correct type. Wrong input type is a **must-fix** finding. See `guides/10-cohere-embedding-and-rerank.md`.

---

## 7. Cold-start handling

A new user has zero vectors in `conversations-{tenantId}`. Retrieval degrades gracefully:

```
1. Query conversations-{tenantId} with user_id filter
   → 0 results

2. Continue with knowledge-{tenantId} query (no user_id filter)
   → Returns relevant tenant knowledge docs

3. Append member's business_profile doc from Postgres if it exists

4. Return grounded coaching response from KB context alone
```

If both `conversations-*` and `knowledge-*` return 0 results, text-budget fallback activates.

---

## 8. GDPR vector deletion

`deleteUserVectors()` in `qdrant-client.ts` scrubs all user vectors across all four collections:

```typescript
export async function deleteUserVectors(userId: string, tenantId: string): Promise<void> {
  const collections = [
    COLLECTION_NAMES.conversations(tenantId),
    COLLECTION_NAMES.knowledge(tenantId),
    COLLECTION_NAMES.academy(tenantId),
    COLLECTION_NAMES.media(tenantId),
  ];
  const filter = { must: [{ key: "user_id", match: { value: userId } }] };
  for (const collection of collections) {
    await client.delete(collection, { wait: true, filter }).catch(() => {});
  }
}
```

Called from the account deletion API. Idempotent. Does not throw if a collection doesn't exist.

Adding a new collection requires extending this function. See `guides/08-rag-strategy.md §14`.

---

## 9. Embedding model versioning

Every vector point stores `embedding_model_version: "cohere-embed-english-v3.0"` (stored, not indexed). Enables migration planning when Cohere releases a new model.

**Migration strategy:**

1. Create parallel collections: `knowledge-{tenantId}-v2`, etc.
2. Re-embed all existing data into v2.
3. Dual-write to both collections during transition.
4. Cut reads to v2.
5. Drop v1 collections.

---

## 10. Sharding strategy

Single Qdrant instance is sufficient for current scale. Plan ahead:

**Trigger for sharding:** A single collection exceeds ~10GB (~10M vectors × 1024 × 4 bytes).

**Strategy:** Hash shard by `user_id` so all vectors for a user land on the same shard, optimizing the most common query pattern (user-scoped retrieval).

---

## 11. Cohere rate limits and batching

`embed-english-v3.0`:

- **Batch size:** 96 texts/request (hard limit).
- **Rate limit:** 10,000 texts/minute on paid plans.
- **Max input tokens:** 512 tokens/text (longer silently truncated).

Current 500-char chunks (~125 tokens) are well within the token limit. The 500-char target is a deliberate design choice for precise retrieval.

---

## 12. Operational notes

**Backup:** Qdrant supports snapshots via REST API. Snapshots should be taken daily and stored in DO Spaces. Not yet automated: tracked as [the host repo's tracker](host repo issue tracker). mind-worker-bee flags this as a reliability gap on every RAG audit until closed.

**Monitoring:** Use Qdrant's `/metrics` endpoint to track collection sizes, query latency, index build status.

**Strict mode:** All collections run with `strict_mode_config: { enabled: true }`. Queries on unindexed fields fail with an error. Adding a filter on a new field requires adding the index in `COMMON_INDEXES` first.

---

## 13. OpenRouter as gateway (must-fix on substitution)

All LLM inference routes through OpenRouter (`https://openrouter.ai/api/v1`). OpenRouter:

- Fully OpenAI API-compatible: same SDK.
- Aggregates 450+ models: model swaps without infrastructure changes.
- Uses prepaid credit balance: at $0, all AI features silently fail.

**Production safeguards:**

1. Configure auto-reload in OpenRouter dashboard (min balance + auto-reload amount).
2. Enable low-balance webhook → Slack/PagerDuty alert.
3. Monitor `OPENROUTER_BALANCE` in observability dashboard.

Direct provider calls (Anthropic, OpenAI, Meta, Cohere chat) bypass OpenRouter and break the gateway pattern. **Must-fix.**

---

## 14. Collection creation checklist

Every new Qdrant collection must complete:

- [ ] Create with HNSW (`m: 16, ef_construct: 200, strict_mode: true`).
- [ ] Add to `COLLECTION_NAMES` in `qdrant-client.ts`.
- [ ] Add payload indexes via `ensureCollection()` (or extend `COMMON_INDEXES`).
- [ ] Add to `ensureAllCollectionsForTenant()` parallel call.
- [ ] Add to `deleteUserVectors()` GDPR procedure.
- [ ] Document in collection inventory (§2).
- [ ] Update `library/knowledge/private/ai/rag-vector-strategy.md`.

---

## 15. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Per-user or global Qdrant collection | must-fix | this guide §1 |
| `tenant_id` filter missing on a Qdrant query | must-fix | `guides/09-vector-payload-schema.md` |
| Filter on unindexed payload field (`strict_mode` rejection) | must-fix | this guide §4 |
| HNSW parameter drift (`m`, `ef_construct`, `on_disk`) | must-fix | this guide §4 |
| Cohere `embed()` using wrong `inputType` | must-fix | this guide §6 |
| Two-stage retrieval skipping Cohere rerank | must-fix | this guide §5 |
| New collection added without extending `deleteUserVectors()` | must-fix (GDPR) | this guide §8 |
| Hardcoded `VECTOR_SIZE = 1024` outside `qdrant-client.ts` | should-refactor | this guide §3 |
| Direct provider-API call bypassing OpenRouter | must-fix | this guide §13 |
| Top-K / top-N drift from `KNOWLEDGE_CANDIDATES = 20` / `KNOWLEDGE_TOP_N = 5` | should-refactor | this guide §5 |
