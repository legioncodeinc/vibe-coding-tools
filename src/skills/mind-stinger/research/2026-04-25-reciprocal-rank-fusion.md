# Reciprocal Rank Fusion (RRF): Hybrid Retrieval

**Source:** Cormack, Clarke, Buettcher 2009: *Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods*. Canonical formulation widely adopted (Elasticsearch, Qdrant, OpenSearch).
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING** for the GraphRAG hybrid path. Cited in `guides/11-graphrag.md §6`.
**Numbers tag:** benchmarked (canonical paper).

---

## TL;DR

RRF combines multiple ranked lists into a single fused ranking using `score(d) = SUM(1 / (k + rank_i(d)))`. The constant `k` (typically 60) softens the fusion so top items don't dominate.

In the deploying product: vector retrieval results + graph traversal results → RRF → top-20 → Cohere rerank → top-5.

---

## The formula

For document `d` appearing in list `i` at rank `rank_i(d)`:

```
score(d) = Σ_i  1 / (k + rank_i(d))
```

Items in BOTH lists get additive scoring: they're retrieved both semantically and relationally.

The `k=60` constant is the canonical default. It softens the contribution of top-ranked items so a single very-high-rank in one list doesn't dominate. Lower `k` gives more weight to top items; higher `k` evens out.

---

## implementation: `rrf.ts`

```typescript
export function reciprocalRankFusion(
  vectorResults: RankedResult[],
  graphResults:  RankedResult[],
  k: number = 60,
): FusedResult[]
```

Returns fused results sorted by score descending. Caller (e.g., `knowledge-context.ts` GraphRAG path) takes top-20 and feeds to Cohere rerank.

---

## Why RRF specifically (not weighted sum)

Weighted sum requires score normalization across lists with different scales. ANN scores (cosine similarity 0-1) are not comparable to graph traversal scores (depth + occurrence count). RRF works on **ranks**, not scores: sidesteps the normalization problem.

---

## When RRF underperforms

- **One list dominates** the other in quality. RRF assumes both lists contribute. If graph results are random noise, RRF degrades vector-only.
- **Very different list sizes** (e.g., vector=1000, graph=5). The smaller list's contribution diminishes.
- **Below-canonical `k`** (e.g., k=10). Top items dominate; tail items are crushed.

For the deploying product's coaching corpora, vector + graph at `top_k=20 each, k=60` is the canonical default.

---

## Implications

- RRF `k` constant drift from 60 is **should-refactor** (no doc update + no eval pass).
- RRF used to combine more than two lists requires the same caution about list quality.
- See `guides/11-graphrag.md §6`.
