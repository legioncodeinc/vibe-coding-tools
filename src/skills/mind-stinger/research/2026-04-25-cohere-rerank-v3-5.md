# Cohere `rerank-v3.5`: Two-Stage Retrieval

**Source:** Cohere docs: https://docs.cohere.com/docs/rerank-overview, https://docs.cohere.com/reference/rerank
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING.** Cited in `guides/00-principles.md §7` and `guides/10-cohere-embedding-and-rerank.md`.
**Numbers tag:** vendor-directional on lift percentage (Cohere claims 15-30% precision lift); benchmarked on calling latency (~200ms typical).

---

## TL;DR

Cohere `rerank-v3.5` is a cross-encoder reranker. In the deploying product's two-stage pipeline:

1. **Qdrant ANN** retrieves top-K=20 candidates.
2. **Cohere rerank-v3.5** scores query-document pairs jointly and returns top-N=5.

Cross-encoder rerank lifts retrieval precision over single-stage ANN by ~15-30% on realistic retrieval tasks (vendor-directional; reproducible on the deploying product's golden set as `evaluateRetrievalPrecision` mean).

---

## API shape (per Cohere docs)

```typescript
const result = await cohere.rerank({
  model:    "rerank-v3.5",
  query:    userMessage,
  documents: candidateTexts,
  top_n:    KNOWLEDGE_TOP_N,            // 5
});

// result.results: [{ index: number, relevance_score: number }, ...]
```

Use `result.results[i].index` to map back to the original Qdrant candidate (with payload + score).

---

## Latency

- **Typical:** ~200ms for 20 candidates.
- **Alert threshold:** > 800ms sustained.

Latency scales roughly linearly with candidate count. The cost of running `top_K=50` instead of `top_K=20` is 2.5× the rerank latency for marginal precision lift on realistic corpora.

---

## Pricing

Per Cohere docs (current tier): priced per 1K queries. For the deploying product's scale (~100K coaching turns/month with rerank), well within reasonable AI-cost envelope.

---

## Fallback discipline

```typescript
try {
  const reranked = await rerank(query, candidateTexts, KNOWLEDGE_TOP_N);
  return reranked.map(r => candidates[r.index]);
} catch (err) {
  console.error("rerank failed; using top-K ANN", err);
  return candidates.slice(0, KNOWLEDGE_TOP_N);
}
```

The fallback is a **degradation, not a design**. Sustained rerank failures must alert. The audit pattern: count traces with `knowledgeChunks.length > KNOWLEDGE_TOP_N` (a signal that fallback fired).

See `guides/10-cohere-embedding-and-rerank.md §4`.

---

## Why `rerank-v3.5` not `rerank-3` or `rerank-v3-multilingual`

- `rerank-v3.5` is the latest English reranker (calibrated for English).
- `rerank-v3-multilingual` is the multilingual variant (lower English quality).
- `rerank-3` is a previous generation; `v3.5` improves on it.

A push to substitute (e.g., `bge-reranker-v2-m3`, `voyage-rerank-2`) requires `guides/01-stack-enforcement.md §2`.

---

## Implications

- Skipping rerank in the canonical two-stage path is **must-fix**.
- Drift from top-K=20 → top-N=5 without doc update is **should-refactor**.
- Sustained rerank failures (silent fallback) is **should-refactor (observability)**.
