# RAG with Postgres and pgvector in production: from PoC to SLO

**Title:** RAG with Postgres and pgvector in production: from PoC to SLO
**URL:** https://jacar.es/en/rag-with-postgres-and-pgvector-in-production-from-poc-to-slo/
**Published:** 2026-06-09 (updated 2026-07-12)
**Fetched:** 2026-08-14
**Source type:** Third-party engineering blog post (practitioner write-up, not vendor marketing; cites ANN-Benchmarks 2025 and a Timescale April 2026 benchmark by name)
**Covers:** pgvector schema design, HNSW tuning, filtering-at-scale tradeoffs, two-stage reranking, hybrid search, and production SLOs for a Postgres-native RAG pipeline

## What the article says

**Why pgvector is the reasonable production default in 2026:** one database and one backup plan (PITR, logical replication, `pg_dump` already cover embeddings the same way they cover every other table); relational joins/filters against embeddings are ordinary `WHERE` clauses instead of vendor-specific payload filtering; and per ANN-Benchmarks 2025, pgvector with HNSW is competitive at the top of the field, with `pgvectorscale` (StreamingDiskANN plus statistical binary quantization) raising the practical ceiling to roughly 50M vectors while holding p95 under 50ms with reranking, per Timescale's own April 2026 benchmark (471 QPS at 99% recall).

**Schema pattern (directly cited, load-bearing for this repo):** separate a `documents` table (business unit: permissions, deletion, metadata) from a `chunks` table (retrieval unit). Carry `tenant_id` on **both** tables deliberately, even though it could be derived via a join, because the hot retrieval query needs it directly for filtering, for partial indexes or partitioning, and for Row-Level Security:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid NOT NULL,
    source      text NOT NULL,
    title       text,
    body        text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chunks (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id   uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tenant_id     uuid NOT NULL,
    chunk_index   int NOT NULL,
    text          text NOT NULL,
    embedding     vector(1024) NOT NULL,
    token_count   int,
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX chunks_tenant_idx ON chunks (tenant_id);
```

**HNSW index parameters that matter:**

```sql
CREATE INDEX chunks_embedding_hnsw
ON chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

`m` (default 16): edges per graph node; higher raises recall at the cost of size/build time. `ef_construction` (default 64): build-time search depth; 128-256 builds a better graph at higher build cost. `hnsw.ef_search` is a runtime, session-scoped GUC (default 40): raise it per-session until the recall target is hit and no further, since every increase costs latency. The chosen operator class must match the query's distance operator (`vector_cosine_ops` with `<=>`, `vector_l2_ops` with `<->`, `vector_ip_ops` with `<#>`) or Postgres silently falls back to a sequential scan instead of erroring.

**The filtering-at-scale "recall cliff":** pgvector's HNSW index does not know about a query's metadata filter; if `tenant_id = $1` matches only a small fraction of rows, the ANN index returns its top-k by vector distance first and then the filter is applied, which can leave far fewer results than requested (or none). Mitigations in order of applicability: a partial index or partition per tenant when tenant is the dominant filter; raising `ef_search` for low-selectivity filters; or pgvector 0.8's iterative scan (`SET hnsw.iterative_scan = strict_order|relaxed_order`, bounded by `hnsw.max_scan_tuples`), which keeps scanning until enough filter-passing candidates are gathered.

**Two-stage reranking is where retrieval quality actually comes from:** a wide, cheap cosine sweep over HNSW (recall candidates) followed by a cross-encoder reorder that narrows to the final top-N. The article states plainly that dropping the rerank stage is felt "the moment you leave the demo" (10-15% relevance drop cited from the author's own datasets). Options given: a local cross-encoder (`BAAI/bge-reranker-v2-m3`, ~80ms CPU / ~20ms GPU for 50 candidates) or a managed cross-encoder (Cohere Rerank v3, ~10ms p95 plus per-call cost).

**Hybrid search:** vector search alone misses exact terms (product codes, proper names, version numbers) that lexical (BM25) search catches; the two are fused with Reciprocal Rank Fusion (RRF, summing `1/(k + rank)` per list) because it avoids having to calibrate incompatible score scales between a cosine distance and a BM25 score. In Postgres this is native `tsvector`/`tsquery` full-text search, or ParadeDB (`pg_search`) for a true BM25 implementation.

**Operating it:** PgBouncer in transaction mode in front of the database, since each retrieval query is short and highly concurrent. Recall drifts as the corpus grows and changes, so recall@10 should be measured against a held-out eval set on a schedule (cron), not discovered from a user complaint. `REINDEX INDEX CONCURRENTLY` rebuilds a degraded HNSW graph without blocking after heavy deletes/updates.

**Cited production SLOs:** end-to-end p95 latency under 700ms for a short single-turn response (up to 1500ms when rerank plus a large model are in the pipeline); recall@10 at or above 0.85 stable, alert below 0.80; and a hard, monitored cost-per-thousand-queries budget.

## Why this matters for this stinger

This is the single most directly load-bearing production-shape source for making Neon + pgvector this repo's default retrieval substrate: it supplies the concrete `documents`/`chunks` schema split with `tenant_id` on both tables (which maps directly onto this stinger's existing per-tenant-isolation rule, previously stated only in Qdrant payload-filter terms), the HNSW parameter defaults, the filtering-at-scale failure mode pgvector has that Qdrant does not (the "recall cliff"), and concrete production SLO numbers that can replace the old stack's retrieval-precision targets when a project runs pgvector instead of Qdrant.

## Relevance to this stinger

Primary source for the pgvector-specific schema, indexing, and SLO guidance folded into `guides/00-selection-and-defaults.md` and the inverted `references/generic-vector-db-choice.md`.
