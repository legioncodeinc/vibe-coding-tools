# Postgres 02 - pgvector as the recall arm

The semantic half of retrieval on this repo's stack: pgvector similarity search. This guide owns *recall tuning* over the vector arm - which distance operator to query with, when to weight the arm up or down, when it's worth running at all. It does NOT own the column shape, dimension, or index type - that is `vector-store-worker-bee`'s (`vector-store-stinger/guides/pgvector-01-schema-and-drizzle.md` and `pgvector-02-indexing.md`).

> Ground truth: `vector-store-stinger/references/research/raw/neon--pgvector--extension-official-docs.md` and `neon--pgvector--optimize-vector-search-hnsw-ivfflat.md` (the storage/index side); this Stinger's own `references/research/raw/supabase--hybrid-search--reciprocal-rank-fusion-official-docs.md` for the recall-query shape.

---

## The boundary with vector-store-stinger

| Question | Owner |
|---|---|
| What dimension should the `vector` column be? | vector-store-worker-bee |
| HNSW or IVFFlat, and what parameters? | vector-store-worker-bee |
| Which operator class does the index need? | vector-store-worker-bee |
| Which distance operator should *this query* use, and does it match the index? | retrieval-worker-bee (this guide) |
| Should this query run vector-only, lexical-only, or hybrid? | retrieval-worker-bee (`postgres-03-rrf-fusion.md`) |
| Is recall good enough at the chosen k? | retrieval-worker-bee (`postgres-06-recall-quality-eval.md`) |

If a finding is about the column definition or the index build, hand it to vector-store-worker-bee. If it's about whether a *query* is using the right operator, weighting the vector arm correctly, or getting good recall, it's this Stinger's.

## The operator-index match is load-bearing

pgvector exposes `<->` (L2), `<#>` (negative inner product), `<=>` (cosine distance), and a few others. An index is built for exactly one operator class (`vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`). If a query's `ORDER BY` uses an operator that doesn't match the index's operator class, Postgres does not error - it silently falls back to a sequential scan, or in some cases returns a technically-valid but meaningless ordering. This is the single most common recall bug on a pgvector table: the index exists, the query runs, the results even look plausible, and nothing in the query plan looked wrong at a glance. **Always confirm the query operator matches the index operator class** before treating a pgvector recall finding as anything other than "check the operator first."

## Query shape

A plain top-k similarity query:

```sql
select id, content, embedding <=> $1::vector as distance
from documents
order by embedding <=> $1::vector
limit 20;
```

Inside a hybrid-fusion CTE (the common case - see `postgres-03-rrf-fusion.md`), the same ordering becomes a `row_number()` window instead of a raw `LIMIT`, so the rank position is what feeds fusion, not the distance value itself.

## When vector-only is the wrong call

Pure vector search is not strictly better than lexical, and recommending it as the default for every query is a should-refactor, not a neutral choice:

- **Exact identifiers, error codes, SKUs, rare proper nouns** - an embedding model trained on general text blurs near-identical tokens together (`retryCount` vs `retryDelay`); full-text search nails them instantly. See `postgres-01-full-text-search.md`.
- **Cost** - every vector query needs an embedding of the query text first (a model call), plus the ANN traversal itself. A workload that's mostly exact-keyword lookups pays that cost for little benefit.
- **Approximate indexes trade recall for speed on purpose.** HNSW and IVFFlat are both approximate - "it found different results after a schema change" is not automatically a bug, it's the index doing what it's built to do. The finding worth raising is recall dropping below what the product actually needs, not that an approximate index is approximate (cross-reference `vector-store-stinger/guides/00-principles.md`).

For most real product search, the answer is hybrid (`postgres-03-rrf-fusion.md`), not a debate between pure vector and pure lexical.

## What to check on a pgvector-recall finding

1. **Does the query's distance operator match the index's operator class?** Mismatch is a must-fix - the index is either silently unused or the ordering is wrong.
2. **Is the query vector produced by the same embedding model, at the same dimension, as the stored vectors?** A cross-model or cross-dimension query is nonsense output, not degraded output.
3. **Is this query actually a vector-recall candidate**, or would lexical alone already serve it (an exact identifier, an error string)? Recommending vector-only for a keyword-shaped query is a should-refactor.
4. **Is recall measured at the chosen k**, or assumed? See `postgres-06-recall-quality-eval.md`.
5. **Column/index questions** (dimension, HNSW vs IVFFlat, build parameters) get handed to vector-store-worker-bee, not answered here.
