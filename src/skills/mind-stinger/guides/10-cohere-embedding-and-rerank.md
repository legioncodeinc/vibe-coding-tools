# 10: Cohere Embedding and Rerank

> **Alternative stack.** Cohere embedding and rerank are documented here as the alternative stack's choice. The two-stage retrieval concept (cheap recall, then a reranker narrows it) applies regardless of vendor; see `guides/00-selection-and-defaults.md` for this repo's default embedding/rerank path.

`embed()` / `embedQuery()` / `rerank()` patterns, batch sizing, input-type discipline, latency targets, the cross-encoder-as-second-stage rule.

> **Doc reference:** `library/knowledge/private/ai/rag-vector-strategy.md §3, §6, §13`. Code: `lib/cohere-client.ts`.

---

## 1. The Cohere client

```typescript
// lib/cohere-client.ts
embed(texts: string[], inputType: "search_document" | "search_query"): Promise<number[][]>
embedQuery(text: string): Promise<number[]>   // wraps embed([text], "search_query")[0]
rerank(query: string, candidateTexts: string[], topN: number): Promise<RerankResult[]>
```

Single client instance. API key in `COHERE_API_KEY`. Rate limits documented in `library/knowledge/private/ai/rag-vector-strategy.md §13`.

---

## 2. The two embedding input types: disciplined use

`embed-english-v3.0` requires different input types for indexing vs retrieval:

| Operation | Input type | When |
|---|---|---|
| Indexing: storing content vectors | `"search_document"` | `indexKnowledgeDocument()`, `indexLessonContent()`, conversation indexing |
| Retrieval: querying | `"search_query"` | `buildVectorContext()`, `reconstructSession()`, any query path |

**Mixing input types degrades retrieval quality** measurably (typically 5-15% drop in precision). Wrong input type is a **must-fix**.

The convenience function `embedQuery(text)` is provided so retrieval paths can't accidentally use `search_document`.

---

## 3. Vector dimensions

```
embed-english-v3.0 → 1024-dim float vectors
```

`VECTOR_SIZE = 1024` in `qdrant-client.ts`. **Never hardcode 1024 outside that file.** Distance metric is `Cosine`.

---

## 4. Two-stage retrieval: the rerank step

The non-optional second stage:

```typescript
// Stage 1: Qdrant ANN
const candidates = await client.search(collection, {
  vector: await embedQuery(userMessage),
  filter: { must: [{ key: "tenant_id", match: { value: tenantId } }] },
  limit:  KNOWLEDGE_CANDIDATES,        // 20
  with_payload: true,
});

// Stage 2: Cohere rerank-v3.5
const candidateTexts = candidates.map(c => c.payload.text ?? c.payload.content);
const reranked = await rerank(userMessage, candidateTexts, KNOWLEDGE_TOP_N);  // top-5
const topN = reranked.map(r => candidates[r.index]);
```

### The rerank result shape

```typescript
interface RerankResult {
  index:           number;   // index into the candidate list
  relevance_score: number;   // 0.0–1.0 cross-encoder score
}
```

Use `index` to map back to the original Qdrant result (with payload + score). The `relevance_score` is the cross-encoder score, NOT the original ANN score.

### Fallback on Cohere error

```typescript
try {
  const reranked = await rerank(query, candidateTexts, KNOWLEDGE_TOP_N);
  return reranked.map(r => candidates[r.index]);
} catch (err) {
  console.error("rerank failed; using top-K ANN", err);
  return candidates.slice(0, KNOWLEDGE_TOP_N);
}
```

The fallback is a **degradation, not a design**. Sustained rerank failures must be alerted. See `guides/16-observability.md`.

---

## 5. Batching at index time

Cohere `embed-english-v3.0`:

- **Batch size limit:** 96 texts/request.
- **Rate limit:** 10,000 texts/minute (paid).
- **Token limit per text:** 512 tokens (longer silently truncated).

When indexing a large knowledge document:

```typescript
const chunks = chunkText(body, 500);  // current host size
for (let i = 0; i < chunks.length; i += 96) {
  const batch = chunks.slice(i, i + 96);
  const vectors = await embed(batch, "search_document");
  await client.upsert(collection, {
    wait: true,
    points: batch.map((text, j) => ({
      id:      randomUUID(),
      vector:  vectors[j],
      payload: { /* see guides/09-vector-payload-schema.md */ },
    })),
  });
}
```

Don't batch larger than 96. Don't index without `wait: true` if subsequent retrieval on the new content matters.

---

## 6. Latency targets

| Operation | Target | Alert |
|---|---|---|
| Single `embedQuery()` call | < 200ms | > 500ms sustained |
| Batch `embed()` (96 texts) | < 800ms | > 2s sustained |
| `rerank()` (20 candidates) | < 300ms | > 800ms sustained |
| Two-stage retrieval end-to-end (Qdrant + Cohere) | < 600ms | > 1.5s sustained |

These appear in `AiTrace.retrievalLatencyMs`. Sustained excursions are operational findings, not application bugs (unless the spike is correlated with a code change).

---

## 7. Episodic retrieval constants

Different from knowledge retrieval:

```typescript
const EPISODIC_CANDIDATES = 10;   // past session summaries retrieved
const EPISODIC_TOP_N      = 3;    // top 3 after Cohere rerank
```

Episodic context is shorter-form (200-300 word summaries) and the corpus per user is smaller (sessions, not documents). 10 → 3 is calibrated for that profile.

---

## 8. Reconstruction retrieval constants

For `reconstructSession()` (Valkey TTL expired, rebuild context):

```typescript
const RECONSTRUCT_RECENT             = 10;  // last 10 raw messages from Postgres
const RECONSTRUCT_EPISODIC_CANDIDATES = 20;
const RECONSTRUCT_EPISODIC_TOP        = 5;  // top 5 by finalScore (after applyDecay)
```

Reconstruction skips the Cohere rerank step and uses `applyDecay()` on the ANN score directly. The reasoning: reconstruction runs on every cold-resume; cost matters; the `applyDecay()` weighting (semantic age ladder) is a sufficient secondary signal at this lower-stakes path.

See `guides/13-context-continuity.md`.

---

## 9. Why Cohere over alternatives (the short answer)

- **`embed-english-v3.0`**: top-tier English retrieval quality, 1024 dims (manageable), reasonable batch size, good latency.
- **`rerank-v3.5`**: fast cross-encoder, ~200ms typical, calibrated quality scores, pairs with embed-v3.

Alternatives (Voyage rerank-2, BGE-reranker-v2-m3) are listed in `references/generic-embedding-model-choice.md` as demoted context. A switch requires the substitution policy in `guides/01-stack-enforcement.md §2`.

---

## 10. Common findings

| Finding | Severity | Reference |
|---|---|---|
| `embed()` called with wrong `inputType` (e.g., `search_document` at retrieval time) | must-fix | this guide §2 |
| Two-stage retrieval skipping Cohere rerank | must-fix | this guide §4 |
| Batch size > 96 in `embed()` | must-fix | this guide §5 |
| Rerank fallback masking sustained Cohere failure (no alert) | should-refactor (observability) | this guide §4 |
| Hardcoded `1024` outside `qdrant-client.ts` | should-refactor | this guide §3 |
| `KNOWLEDGE_CANDIDATES` / `KNOWLEDGE_TOP_N` drift from `20 / 5` without doc update | should-refactor | this guide §4 |
| Missing `wait: true` on upsert when retrieval immediately follows | must-fix | this guide §5 |
| Direct call to Cohere chat API (instead of via OpenRouter) | must-fix | `guides/01-stack-enforcement.md` |
