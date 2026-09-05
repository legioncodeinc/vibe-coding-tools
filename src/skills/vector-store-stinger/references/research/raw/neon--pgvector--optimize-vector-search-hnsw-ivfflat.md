# Optimize pgvector search - Neon Docs

- URL: https://neon.com/docs/ai/ai-vector-search-optimization
- Fetched: 2026-08-14
- Source type: official-docs
- Component: vector-store (pgvector on Neon)

## Summary

pgvector similarity search optimization in Postgres covers profiling with EXPLAIN ANALYZE, choosing between sequential scans and approximate nearest neighbor (ANN) indexes (HNSW or IVFFlat), and tuning build and query-time parameters to balance speed and recall. HNSW delivers better query speed than IVFFlat at the cost of higher build time and memory; IVFFlat requires existing data in the table before the index can be created (it has a k-means training step).

## Sequential scan (no index)

Without an index, pgvector does an exact search by computing the distance between the query vector and every row. This gives 100% recall but gets costly past roughly 50k rows.

## HNSW indexing

HNSW (Hierarchical Navigable Small World) is a graph-based ANN index. It builds a multi-layered graph where each layer is a subset of the layer below; search walks from the sparse top layer down to the dense bottom layer to find nearest neighbors quickly.

- HNSW performs better than IVFFlat on the speed/recall tradeoff.
- HNSW can be created on an empty table since there is no training step (unlike IVFFlat).
- HNSW indexes have slower build time and use more memory than IVFFlat.

Build-time tuning parameters:

- `m`: max number of links per node during graph construction. Default 16. Higher m increases recall but increases index size and build time. Typical range 12-48; acceptable range 2-100. Higher values suit high-dimensionality data or high accuracy needs.
- `ef_construction`: candidate list size during build. Default 64. Should be at least 2x `m`. Higher values build a higher-quality graph at the cost of build time. If recall is below 0.9, raising `ef_construction` is the first lever.

Query-time tuning parameter:

- `ef_search`: candidate list size during search. Default 40. Higher values increase recall (accuracy) at the cost of query speed. Must be >= `k` (the LIMIT of the query). Set per session: `SET hnsw.ef_search = 100;`

Rule of thumb: prioritize speed with lower `m`/`ef_search`; prioritize accuracy with higher `m`/`ef_search`. Higher `ef_construction` always improves accuracy at the cost of build time (with diminishing returns).

## IVFFlat indexing

IVFFlat partitions the vector space into `lists` k-means clusters. A query only searches the `probes` closest clusters to the query vector.

- `lists`: number of k-means clusters. Rule of thumb: `rows / 1000` for up to 1M rows, `sqrt(rows)` for larger datasets.
- `probes`: number of lists explored per search. Default 1 (only the single closest cluster, which underserves query vectors near a cluster edge). Must be set per connection: `SET ivfflat.probes = 100; SET enable_seqscan = off;`

IVFFlat must be built on populated data since the k-means training step needs real vectors to place centroids. There is a point of diminishing returns: increasing `probes` continues to raise recall but with growing execution-time cost.

## Bottom line

Sequential scan is fine for small tables or when 100% accuracy is required. For anything larger, add an HNSW or IVFFlat index and tune build/query parameters against a measured recall target, not intuition. HNSW has the better default speed/recall tradeoff; IVFFlat trades recall for lower build time and memory, and needs periodic rebuilds if the underlying data distribution shifts.
