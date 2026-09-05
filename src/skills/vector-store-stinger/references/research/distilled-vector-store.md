# Distilled: vector and embedding storage

Synthesis of the raw sources in `references/research/raw/` for the vector-store-stinger domain broadening (pgvector on Neon as the primary option for this stack, Deep Lake and other stores as alternatives). Deep Lake sourcing for the existing `deeplake-*` guides lives in `../../research/` (the original research trail, kept as-is).

## pgvector on Neon: the primary option for this stack

Neon Postgres ships pgvector on every plan, no add-on tier required. Enable per database with `CREATE EXTENSION IF NOT EXISTS vector;` (source: neon--pgvector--extension-official-docs.md). A vector column is declared with a fixed dimension count matching the embedding model's output width, for example `VECTOR(1536)` for OpenAI `text-embedding-3-small` or `VECTOR(768)` for nomic-embed-text-v1.5 (source: neon--pgvector--extension-official-docs.md).

Drizzle ORM has first-class support: a `vector({ dimensions: N })` column builder, an `.op('vector_cosine_ops')` index modifier, and query-time helpers (`cosineDistance`, `l2Distance`, `innerProduct`) that compile straight to pgvector's operators. Drizzle Kit does not scaffold `CREATE EXTENSION vector` itself; that has to be a hand-written custom migration (source: drizzle-orm--pgvector-similarity-search-guide.md, drizzle-orm--postgres-extensions-pgvector-operators.md). Older Drizzle Kit versions generated a quoted `"vector(1536)"` type in ALTER TABLE migrations, which Postgres rejects; the fix landed upstream in drizzle-orm PR #2360; pin a version at or after that fix and diff generated vector-column migrations either way (source: drizzle-orm--pgvector-similarity-search-guide.md).

## Distance operators and operator classes

pgvector exposes four operators on `vector`/`halfvec`: `<->` (L2/Euclidean), `<#>` (negative inner product), `<=>` (cosine distance), `<+>` (L1/Manhattan, added 0.7.0), plus `<~>` (Hamming) and `<%>` (Jaccard) on `bit` vectors (source: pgvector-github--readme-distance-operators-types.md). `<#>` returns the *negative* inner product because Postgres index scans only support ascending order; multiply by -1 to get the true inner product. For cosine similarity, compute `1 - cosine_distance`.

An index's operator class must match the operator used in the query's `ORDER BY`, or the planner silently falls back to a sequential scan instead of erroring (source: deepwiki--pgvector-operator-classes.md, neon--pgvector--extension-official-docs.md). `vector_cosine_ops` <-> `<=>`, `vector_l2_ops` <-> `<->`, `vector_ip_ops` <-> `<#>`. Cosine distance is internally computed via a normalized inner product as a storage optimization, not a behavior difference (source: deepwiki--pgvector-operator-classes.md).

## HNSW vs IVFFlat

HNSW (graph-based) has the better default speed/recall tradeoff, needs no training step so it can be created on an empty table before data lands, and is the default recommendation for production workloads. Costs: slower build, more memory (source: neon--pgvector--optimize-vector-search-hnsw-ivfflat.md).

IVFFlat (k-means cluster partitioning into `lists`, searching `probes` nearest lists) builds faster and uses less memory, but requires the table to already be populated before the index is built (the k-means training step needs real data), and recall degrades as the underlying data distribution drifts, requiring periodic `REINDEX` (source: neon--pgvector--optimize-vector-search-hnsw-ivfflat.md).

Build-time HNSW parameters: `m` (default 16, max links per graph node, higher = more recall/memory/build time), `ef_construction` (default 64, should be >= 2x `m`, higher = better graph quality at build-time cost). Query-time: `hnsw.ef_search` (default 40, session-scoped GUC, higher = more recall at latency cost, must be >= the query's `LIMIT`) (source: neon--pgvector--optimize-vector-search-hnsw-ivfflat.md).

IVFFlat sizing rule of thumb: `lists = rows / 1000` for tables up to 1M rows, `lists = sqrt(rows)` above that; start `probes` at `sqrt(lists)` (source: neon--pgvector--optimize-vector-search-hnsw-ivfflat.md).

Decision rule distilled from the sources: default to HNSW for anything with ongoing writes or a recall target above roughly 0.9 at single-digit-millisecond latency; reach for IVFFlat only when the corpus is static or rebuilt on a schedule anyway and build time/memory is the binding constraint.

## Scale ceiling and when to consider a dedicated vector database

Production benchmarking (source: kalviumlabs--vector-databases-compared-pgvector-pinecone-qdrant-weaviate-2026.md) puts pgvector's comfortable range at roughly 2M vectors on a single Postgres instance before index build times exceed 20 minutes and `VACUUM` starts competing with query traffic; at 5M vectors, p95 latency climbs into the 80-140ms range versus a dedicated vector database staying under 30ms. A second, structural limitation: pgvector applies metadata filters as a *post-filter* on the ANN candidate set rather than inside the graph traversal, so a selective filter (e.g., 10% selectivity) on a large collection forces scanning far more candidates than the final result count. Qdrant and Pinecone both filter inside the index traversal, which is materially faster for large, highly-filtered collections.

The selection framing from the sources (dev.to and Kalvium comparisons) converges on: start with pgvector when already running Postgres, the corpus is in the low millions of vectors, and vector search needs to share a transaction with relational data; move to a dedicated vector database only when a measured signal (not a hunch) shows scale past what one Postgres instance serves comfortably, query concurrency demanding isolation from the primary database, or a team that wants search ownership handed to someone else. "Everyone else uses a vector DB" is explicitly not a valid trigger (source: devto--pgvector-vs-pinecone-vs-qdrant-when-dedicated-vector-db-worth-it.md).

## Deep Lake and the legacy `deeplake-*` guides

The pre-existing `guides/deeplake-*.md` files (schema design, indexing, schema healing, versioning, querying via DeeplakeApi, embeddings/JSONB, no-ORM ColumnDef, storage backends) and their supporting `research/` trail describe the Hivemind product's Activeloop Deep Lake data layer in full depth. That material is unchanged by this pass and remains the canonical Deep Lake implementation guide for any project that is genuinely running on Deep Lake. It is not this repo's stack (this repo runs Neon Postgres), so it is filed as one clearly labeled implementation option, not the default.

## Open questions carried forward

- No first-party benchmark was archived for pgvector plus Drizzle specifically on Neon's serverless (scale-to-zero) compute; cost figures above are third-party estimates (Supabase, RDS), not Neon's own pricing model, and should be re-verified against current Neon pricing before quoting a number to a client.
- Qdrant and a Pinecone-style managed option are covered as alternatives at the selection-matrix level in `guides/alt-01-qdrant.md` and `guides/alt-02-managed-vector-services.md`; neither has the same depth of archived sourcing as pgvector in this pass, since they are secondary options for this stack, not the primary path.
