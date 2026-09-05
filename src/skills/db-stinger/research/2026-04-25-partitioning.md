# Partitioning: Range, List, Hash

**Sources:**
- https://www.postgresql.org/docs/current/ddl-partitioning.html
- https://www.tigerdata.com/learn/guide-to-postgresql-database-design

**Retrieved:** 2026-04-25

## Summary

Declarative partitioning (PG 10+) splits a logical table into physical child tables routed by a partition key. The pivotal benefit is partition pruning: the planner skips entire partitions at plan time when the predicate filters by the key. Performance gains compound on tables > 100M rows or > 100 GB.

## When to reach for it

- Table is > 100M rows OR > 100 GB.
- Most queries filter on the partition-key column.
- Data has a natural disposal cadence (drop old months, drop old tenants).
- Bulk load patterns target one partition at a time.

**Do not partition** if the table is < 10M rows, or if queries don't filter on the partition key (you'll scan every partition every time and pay coordination overhead).

## Strategies

| Strategy | When | Example |
|---|---|---|
| **Range** | Time-series, monotonically increasing keys | One partition per month for events |
| **List** | Discrete, low-cardinality categorical key | One partition per region or per tenant tier |
| **Hash** | Even distribution needed; key is unordered | Sharding a multi-tenant `users` table by hash of `tenant_id` |

## Partition-pruning gotchas

- Predicate must reference the partition key directly. `WHERE created_at > now() - interval '7 days'` works; `WHERE date_trunc('day', created_at) = ...` may not (immutable wrapping required).
- Joins prune both sides only when the planner can match partitions across the join.
- `enable_partition_pruning = on` (default in PG 11+).

## Attach / detach lifecycle

- `CREATE TABLE next_partition (LIKE parent INCLUDING ALL); -- populate; ALTER TABLE parent ATTACH PARTITION next_partition FOR VALUES FROM (...) TO (...);`
- Pre-validate the partition's data with a `CHECK` constraint matching the bounds: `ATTACH` then runs metadata-only.
- `DETACH PARTITION ... CONCURRENTLY` (PG 14+) avoids the long lock.

## Sub-partitioning

Range-then-hash (per-month then 8-way hash) is common for very large multi-tenant time-series. Adds complexity; reach for it only when the read pattern justifies it.

## Tiger Data / TimescaleDB

Hypertables are partitioning + automation: chunks (range partitions on time), continuous aggregates (materialized rollups), retention policies. For time-series, prefer Tiger Data over rolling your own partitions: see `guides/06-special-purpose.md`.

## Relevance to this stinger

Spine of `guides/04-partitioning.md`. Cross-referenced from `06-special-purpose.md` for time-series workloads.
