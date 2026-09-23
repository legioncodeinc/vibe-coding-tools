# 04: Partitioning

Declarative partitioning splits a logical table into physical child tables routed by a partition key. Worth it on tables > 100M rows or > 100 GB, when queries filter by the partition key.

Source: `research/2026-04-25-partitioning.md`.

## When to partition

- Table is > 100M rows OR > 100 GB.
- Most queries filter on the partition-key column.
- Data has a natural disposal cadence (drop old months, drop old tenants).
- Bulk load patterns target one partition at a time.

**Don't partition** when the table is < 10M rows or queries don't filter on the partition key: you'll scan every partition every time.

## Strategy choice

| Strategy | When | Example |
|---|---|---|
| **Range** | Time-series, monotonic keys | One partition per month for events |
| **List** | Discrete, low-cardinality categorical key | One partition per region or per tenant tier |
| **Hash** | Even distribution; key is unordered | Sharding multi-tenant `users` by hash of `tenant_id` |

Sub-partitioning (range-then-hash) is sometimes worth it for very large multi-tenant time-series; reach for it only when the read pattern justifies the complexity.

## Range partitioning by time

```sql
CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  occurred_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  PRIMARY KEY (id, occurred_at)            -- partition key must be in PK
) PARTITION BY RANGE (occurred_at);

CREATE TABLE events_2026_04 PARTITION OF events
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE events_2026_05 PARTITION OF events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
```

**Indexes are per partition.** Define them on the parent and they propagate; or define per partition for partition-specific tuning.

## Partition pruning

The planner skips entire partitions at plan time when the predicate filters by the key:

```sql
EXPLAIN SELECT * FROM events WHERE occurred_at >= '2026-04-15' AND occurred_at < '2026-04-20';
-- Plan reads ONLY events_2026_04
```

**Pitfalls:**
- Predicate must reference the partition key directly. `WHERE date_trunc('day', occurred_at) = ...` may not prune (needs immutable wrapping).
- Joins prune both sides only when the planner can match partitions.
- `enable_partition_pruning = on` (default in PG 11+).

## Attach / detach lifecycle

### Attach a new partition with no lock

```sql
-- 1. Create as a regular table; populate or leave empty
CREATE TABLE events_2026_06 (LIKE events INCLUDING DEFAULTS INCLUDING CONSTRAINTS);
ALTER TABLE events_2026_06 ADD CONSTRAINT events_2026_06_check
  CHECK (occurred_at >= '2026-06-01' AND occurred_at < '2026-07-01');

-- 2. Attach: with the CHECK already validating the bound, this is metadata-only
ALTER TABLE events ATTACH PARTITION events_2026_06
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
```

### Detach with `CONCURRENTLY` (PG 14+)

```sql
ALTER TABLE events DETACH PARTITION events_2026_03 CONCURRENTLY;
DROP TABLE events_2026_03;  -- archive first if needed
```

`DETACH ... CONCURRENTLY` avoids the long `ACCESS EXCLUSIVE` lock that plain `DETACH` takes.

## Automation

Per-partition `CREATE TABLE` is repetitive. Options:

- **Manual:** scheduled job that creates the next month's partition a week ahead.
- **`pg_partman`:** mature extension that automates partition creation, retention, and rollover.
- **Tiger Data hypertables:** for time-series, use this instead of rolling your own: see `06-special-purpose.md`.

## Cross-references

- `01-schema-design.md`: partition key must be in the primary key.
- `03-migrations.md`: `ATTACH` / `DETACH` lock semantics.
- `06-special-purpose.md`: Tiger Data hypertables vs. manual partitioning.
