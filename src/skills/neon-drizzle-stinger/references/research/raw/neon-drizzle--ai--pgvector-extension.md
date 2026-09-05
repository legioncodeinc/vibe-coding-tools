# The pgvector extension - Neon Docs

- URL: https://neon.com/docs/extensions/pgvector
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: pgvector on Neon for AI/RAG use cases

## Summary (as stated on the page)

The pgvector extension adds vector embedding storage and similarity search to Lakebase Postgres, supporting exact and approximate nearest-neighbor queries with L2, cosine, inner product, L1, Hamming, and Jaccard distance operators. Use it for AI or NLP applications that store embeddings from models such as OpenAI `text-embedding-3-small` and need to choose between HNSW and IVFFlat indexes, tune build performance, or pick a vector type (`vector`, `halfvec`, `bit`, `sparsevec`). HNSW supports up to 2,000 dimensions for `vector`, 4,000 for `halfvec`, and 64,000 for `bit`; IVFFlat shares the same limits.

## Enabling the extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

`pgvector` is available on **every Neon plan, no add-on or paid tier required**. The extension is installed **per database, not per project**, run the statement once in each database where vectors are needed. If a branch has multiple databases, enable it in each.

## Creating and querying a vector table

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  embedding vector(3)
);

INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');

SELECT id, embedding <-> '[3,1,2]' AS distance
FROM items
ORDER BY embedding <-> '[3,1,2]'
LIMIT 5;
```

For real embeddings, dimensionality must match the embedding model (e.g. OpenAI `text-embedding-3-small` = 1536 dimensions).

### Distance operators

- `<->`, L2 (Euclidean) distance
- `<#>`, negative inner product
- `<=>`, cosine distance
- `<+>`, L1 distance
- Also supported: Hamming distance and Jaccard distance (for `bit` vectors)

**Note:** to use an index with a query, include `ORDER BY` and `LIMIT` clauses.

## Indexing: HNSW vs IVFFlat

By default `pgvector` performs an **exact** nearest-neighbor search (sequential scan), giving perfect recall but costly at scale. Adding an index trades a small amount of recall for large speed gains.

### HNSW (default recommendation)

- Multilayer graph index. **Better query performance than IVFFlat** on the speed/recall tradeoff, but **slower build time and higher memory use**.
- Can be created **without any data in the table**, no training step (unlike IVFFlat).
- Vector-type dimension limits: `vector` up to 2,000, `halfvec` up to 4,000, `bit` up to 64,000, `sparsevec` up to 1,000 non-zero elements.
- Example (L2 distance): `CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);`, match the operator class to the distance function used in queries (`vector_cosine_ops`, `vector_ip_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`).
- Tuning (build): `m` (max links per node during graph construction; default 16, typical range 12-48; higher = more accurate/larger/slower to build), `ef_construction` (candidate-list size during build; default 64; should be ≥ 2×`m`).
- Tuning (query): `ef_search` (candidate-list size at query time; default 40; should be ≥ `k`, the `LIMIT` value; higher = more accurate, slower).

### IVFFlat

- Partitions the dataset into `lists` (k-means clusters) and searches a subset of lists nearest the query vector at query time.
- **Faster build time, lower memory** than HNSW, but **lower query performance** on the speed/recall tradeoff.
- **Requires existing data before the index can be created** (training step), unlike HNSW.
- Example: `CREATE INDEX items_embedding_cosine_idx ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 1000);`
- Tuning: `probes` (number of lists explored per query; default `1`, low recall near cluster edges). Set per-connection: `SET ivfflat.probes = 100; SET enable_seqscan = off;` before the query (`enable_seqscan=off` forces an index scan so the effect of `probes` is visible/enforced).

## When to skip indexing entirely

Use sequential (exact) scan rather than an approximate index when: the dataset is small and won't scale; 100% recall is required (indexes trade recall for speed); or query-per-second volume is low enough that index maintenance isn't worth it. Benchmarked on the GIST-960 dataset (10k-1M rows, 4 CU / 16 GB RAM compute): sequential scan performs reasonably at 10k rows (~36ms) but becomes costly starting around 50k rows.

## Related Neon docs referenced on this page

- Optimize pgvector search (`ai-vector-search-optimization`): covers `EXPLAIN ANALYZE` profiling for vector queries and choosing/tuning HNSW vs IVFFlat.
- AI concepts (`ai-concepts`): embeddings fundamentals, distance metrics, generating embeddings with OpenAI models.
