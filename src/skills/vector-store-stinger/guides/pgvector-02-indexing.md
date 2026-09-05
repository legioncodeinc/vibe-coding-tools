# pgvector: indexing (HNSW vs IVFFlat, distance operators)

Sourced from `references/research/raw/neon--pgvector--optimize-vector-search-hnsw-ivfflat.md`, `references/research/raw/pgvector-github--readme-distance-operators-types.md`, and `references/research/raw/deepwiki--pgvector-operator-classes.md`.

## Distance operators

| Operator | Metric | Operator class | Use for |
|---|---|---|---|
| `<=>` | Cosine distance | `vector_cosine_ops` | Normalized text-embedding models (OpenAI, Cohere, nomic-embed, most open-weight models). Default choice absent a specific reason otherwise. |
| `<->` | L2 (Euclidean) | `vector_l2_ops` | Models where magnitude carries meaning, not just direction. |
| `<#>` | Negative inner product | `vector_ip_ops` | Maximum inner product search; returns the *negative* inner product (multiply by -1 for the true value), since Postgres index scans only support ascending order. |
| `<+>` | L1 (Manhattan) | `vector_l1_ops` (HNSW only) | Rare; only when a specific model or research result calls for it. |

The index's operator class must match the operator used in the query's `ORDER BY`, or the planner does not use the index at all and silently falls back to a sequential scan. This is the single most common "why is my vector search slow" root cause worth checking first with `EXPLAIN`.

## HNSW: the default index for this stack

```sql
CREATE INDEX documents_embedding_hnsw
  ON documents USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

- No training step: can be created on an empty table, before data lands. This is why it fits a normal "migrate, then insert" workflow.
- Better speed/recall tradeoff than IVFFlat at essentially every operating point.
- Costs: slower build, higher memory (the index is close to a full copy of the vectors plus graph edges).

Build-time parameters (require a rebuild to change):

- `m` (default 16): max graph edges per node. Higher m raises recall and memory; typical range 12-48.
- `ef_construction` (default 64): candidate-list width during build; should be at least 2x `m`. Raise this before raising `m` if recall is short of target and build time budget allows it.

Query-time parameter (session-scoped, no rebuild needed):

- `hnsw.ef_search` (default 40): candidate-list width during search. Must be >= the query's `LIMIT`. This is the first and usually only knob to tune after launch: `SET hnsw.ef_search = 100;` inside the transaction that runs the query, or `ALTER DATABASE ... SET hnsw.ef_search = 100;` to apply it to every connection. A bare `SET` on a session-pooled connection (PgBouncer transaction-pooling mode) can be silently dropped when the pooler hands the next query to a different server connection; scope the setting with `SET LOCAL` inside the transaction, or set it at the database level, to avoid tuning that silently does nothing.

## IVFFlat: only when build time or memory is the binding constraint

```sql
-- lists = rows / 1000 for < 1M rows; lists = sqrt(rows) for >= 1M rows
CREATE INDEX documents_embedding_ivf
  ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

SET ivfflat.probes = 10;  -- start at sqrt(lists)
```

- Must be built on a populated table. Building on an empty or partially loaded table trains the k-means centroids on the wrong data and every subsequent insert misfiles.
- Faster build, lower memory than HNSW.
- Recall decays as inserted data drifts from the centroids computed at build time. No `VACUUM` fixes this; the only repair is `REINDEX`.

Use IVFFlat only when the corpus is static or rebuilt on a schedule anyway (a nightly batch pipeline, for example) and build time/memory is the actual binding constraint, and someone owns the `REINDEX` cadence.

## Decision rule

Default to HNSW. Reach for IVFFlat only when all of: the corpus is static or rebuilt wholesale on a schedule, build time or memory is the binding constraint, and moderate recall is acceptable with someone verifying it after each rebuild. Both index types can coexist on the same column during a migration between them; build the new one with `CREATE INDEX CONCURRENTLY`, compare recall and latency, then drop the old one.

## Verifying the index is actually used

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id FROM documents ORDER BY embedding <=> $1 LIMIT 10;
```

A `Seq Scan` where an `Index Scan` was expected almost always means the query's operator does not match the index's operator class, or `enable_seqscan` needs checking. Confirm the operator class and the query operator agree before assuming the index itself is broken.
