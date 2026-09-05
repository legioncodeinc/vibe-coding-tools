# Special-Purpose Postgres: `pgvector`, FTS, Logical Replication, Time-Series

**Sources:**
- https://github.com/pgvector/pgvector
- https://www.postgresql.org/docs/current/textsearch.html
- https://www.postgresql.org/docs/current/logical-replication.html
- https://docs.tigerdata.com/
- https://qdrant.tech/benchmarks/: vector DB benchmarks (for comparison context)

**Retrieved:** 2026-04-25

## pgvector: storage decision (db-worker-bee's territory)

`pgvector` adds a `vector` type and two index types:

| Index | Build cost | Query speed | Tuning | When |
|---|---|---|---|---|
| `ivfflat` | Fast | Slower at scale | `lists` (default 100); rule of thumb `rows / 1000` | < 1M vectors, build time matters |
| `hnsw` | Slower | Fast | `m` (default 16), `ef_construction` (default 64) | > 1M vectors, query latency matters; **2026 default** |

**Column shape:**
```sql
CREATE EXTENSION vector;
ALTER TABLE documents ADD COLUMN embedding vector(1536);  -- match model dim
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

**Distance ops:** `vector_l2_ops` (Euclidean), `vector_ip_ops` (inner product), `vector_cosine_ops` (cosine: most common for embeddings).

**Hard handoff:** db-worker-bee picks column type, dimension (matches model), index family, and distance op. **Retrieval strategy** (top-k, hybrid dense+sparse, reranking, query expansion) is `mind-worker-bee`'s.

## Postgres FTS

Built-in full-text search with `tsvector` + `tsquery` + GIN index.

```sql
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

CREATE INDEX ON articles USING gin (search_vector);
```

**Use when:** moderate FTS needs (a few million rows, simple ranking). **Don't use when:** typo-tolerance, faceted search, vector hybrid, multi-language ranking: reach for OpenSearch / Meilisearch / Typesense.

## Logical replication / CDC

`CREATE PUBLICATION` + `CREATE SUBSCRIPTION` ships row-level changes to a downstream Postgres or to a CDC consumer (Debezium, Estuary, Fivetran).

**Use cases:**
- Cross-region read replicas with selective tables.
- CDC into a data warehouse (Snowflake / BigQuery / ClickHouse).
- Event-sourcing tail: `replication_slot` + `wal2json` decoder.
- Zero-downtime major version upgrades (logical replication from old to new cluster).

**Gotchas:**
- Replication slots must be consumed; an idle slot pins WAL and fills the disk.
- Schema changes (DDL) are NOT replicated: requires manual coordination.
- Large transactions can stall the apply worker.

## TimescaleDB / Tiger Data: time-series

Tiger Data (formerly TimescaleDB) is a Postgres extension purpose-built for time-series:

- **Hypertables**: automatic range partitioning by time; transparent to queries.
- **Chunks**: physical partitions; pruning by time.
- **Continuous aggregates**: materialized views that refresh incrementally; query at any granularity.
- **Compression**: columnar compression on older chunks; 90%+ reduction common.
- **Retention policies**: drop old chunks automatically.

**When to reach for Tiger Data:**
- Tables with explicit time dimension and append-only writes.
- Need rollups across raw data at multiple time grains.
- Need automatic data lifecycle (retention, compression).

For non-time-series Postgres, stay with vanilla Postgres + manual partitioning per `guides/04-partitioning.md`.

## Relevance to this stinger

Spine of `guides/06-special-purpose.md`. Drives hard rule #10 (handoff to `mind-worker-bee`).
