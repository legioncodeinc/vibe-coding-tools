# 06: Special-Purpose Postgres

`pgvector` (storage decision), Postgres FTS, logical replication / CDC, TimescaleDB / Tiger Data for time-series.

Source: `research/2026-04-25-pgvector-fts-timeseries.md`.

## `pgvector`: storage decision (db-worker-bee's territory)

`pgvector` is the de facto standard Postgres extension for vector search. db-worker-bee picks:

1. Column type and dimension (matches the embedding model: `vector(1536)` for OpenAI `text-embedding-3-small`, `vector(3072)` for `text-embedding-3-large`).
2. Index family: `ivfflat` or `hnsw`.
3. Distance operator class.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE documents
  ADD COLUMN embedding vector(1536);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

### Index choice

| Index | Build cost | Query speed | Tuning | When |
|---|---|---|---|---|
| `ivfflat` | Fast | Slower at scale | `lists` (default 100); rule of thumb `rows / 1000` | < 1M vectors, build time matters |
| `hnsw` | Slower | Fast | `m` (default 16), `ef_construction` (default 64) | > 1M vectors, query latency matters; **2026 default** |

### Distance operators

| Operator | Operator class | Use |
|---|---|---|
| `<->` | `vector_l2_ops` | Euclidean distance |
| `<#>` | `vector_ip_ops` | Negative inner product |
| `<=>` | `vector_cosine_ops` | Cosine distance: **most common for embeddings** |

### Hard handoff

db-worker-bee picks the column type, dimension, index family, and distance op. **Retrieval strategy** (top-k, hybrid dense+sparse, query expansion, reranking with cross-encoder or ColBERT, eval framework) is `mind-worker-bee`'s.

When the user asks "should this be `ivfflat` or `hnsw`?", db-worker-bee answers. When the user asks "how should I chunk these PDFs and rerank the top-k?", db-worker-bee hands off.

## Postgres FTS

Built-in full-text search via `tsvector` + `tsquery` + GIN.

```sql
ALTER TABLE articles
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

CREATE INDEX ON articles USING gin (search_vector);

-- Query
SELECT id, title, ts_rank(search_vector, plainto_tsquery('english', 'postgres'))
FROM articles
WHERE search_vector @@ plainto_tsquery('english', 'postgres')
ORDER BY ts_rank DESC
LIMIT 20;
```

### Use Postgres FTS when:
- A few million rows.
- English / monolingual stemming is fine.
- Simple ranking.
- One fewer service to operate.

### Don't use it when:
- Typo tolerance is critical (use OpenSearch / Meilisearch / Typesense).
- Faceted search with aggregations.
- Multi-language ranking with custom analyzers.
- Vector hybrid search (use `pgvector` + a hybrid retrieval layer; hand to mind-worker-bee).

For trigram-based fuzzy matching, `pg_trgm` extension + GIN index gives "similar to" results without leaving Postgres.

## Logical replication / CDC

`CREATE PUBLICATION` + `CREATE SUBSCRIPTION` ships row-level changes downstream.

```sql
-- On source
CREATE PUBLICATION reporting_pub FOR TABLE orders, payments;

-- On replica
CREATE SUBSCRIPTION reporting_sub
  CONNECTION 'host=primary dbname=app user=replicator'
  PUBLICATION reporting_pub;
```

### Use cases
- Cross-region read replicas with selective tables.
- CDC into a data warehouse (Snowflake / BigQuery / ClickHouse) via Debezium / Estuary / Fivetran.
- Event-sourcing tail: `replication_slot` + `wal2json` decoder.
- Zero-downtime major-version upgrades: replicate from old to new cluster.

### Gotchas
- Replication slots must be consumed; an idle slot pins WAL and fills the disk.
- DDL is **not** replicated: coordinate schema changes manually.
- Large transactions can stall the apply worker.
- Sequences are not replicated (the values are; not the sequence state).

## TimescaleDB / Tiger Data: time-series

Tiger Data (formerly TimescaleDB) is a Postgres extension purpose-built for time-series workloads.

### Hypertables
A hypertable is a regular Postgres table with automatic range partitioning by time:

```sql
CREATE EXTENSION timescaledb;

CREATE TABLE measurements (
  time TIMESTAMPTZ NOT NULL,
  device_id BIGINT NOT NULL,
  temperature NUMERIC,
  humidity NUMERIC
);

SELECT create_hypertable('measurements', 'time');
```

The table is now partitioned into chunks (default 1 week each). Pruning by time is automatic and transparent.

### Continuous aggregates
Materialized views that refresh incrementally:

```sql
CREATE MATERIALIZED VIEW measurements_hourly
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS hour,
  device_id,
  avg(temperature) AS avg_temp,
  max(temperature) AS max_temp
FROM measurements
GROUP BY hour, device_id;

SELECT add_continuous_aggregate_policy('measurements_hourly',
  start_offset => INTERVAL '7 days',
  end_offset   => INTERVAL '1 hour',
  schedule_interval => INTERVAL '15 minutes');
```

Reads from `measurements_hourly` are precomputed; reads at finer granularity fall through to the raw hypertable.

### Compression
Older chunks compress columnar; 90%+ reduction common:

```sql
ALTER TABLE measurements SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'device_id'
);

SELECT add_compression_policy('measurements', INTERVAL '30 days');
```

### Retention
Drop old chunks automatically:

```sql
SELECT add_retention_policy('measurements', INTERVAL '1 year');
```

### When to use Tiger Data
- Tables with explicit time dimension and append-only writes.
- Need rollups across multiple time grains.
- Need automatic data lifecycle (retention, compression).

### When not to
- General SaaS schemas: vanilla Postgres + manual partitioning per `04-partitioning.md` is simpler.
- Heavy update workloads on time-series rows: hypertable updates work but the design assumes append-mostly.

For the platform choice (Tiger Cloud vs self-hosted), see `08-serverless-platforms.md`.

## Cross-references

- `02-indexing.md`: GIN for `jsonb` and FTS; GiST for ranges.
- `04-partitioning.md`: Tiger hypertables vs. manual partitioning.
- `08-serverless-platforms.md`: Tiger Data as a managed platform.
- Hand off retrieval / RAG to `mind-worker-bee`.
