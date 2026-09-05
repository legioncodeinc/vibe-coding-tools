# Performance & Pooling: Autovacuum, Bloat, EXPLAIN, PgBouncer

**Sources:**
- https://www.postgresql.org/docs/current/routine-vacuuming.html
- https://www.postgresql.org/docs/current/using-explain.html
- https://www.postgresql.org/docs/current/runtime-config-autovacuum.html
- https://www.pgbouncer.org/config.html
- https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- https://github.com/PacktPublishing/PostgreSQL-16-Performance-Tuning-Guide
- https://wiki.postgresql.org/wiki/Show_database_bloat

**Retrieved:** 2026-04-25

## Autovacuum: why hot tables need their own settings

Autovacuum kicks in when dead tuples exceed `autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor * reltuples`. The defaults (50 + 20% of rows) are wrong for hot tables.

For a table with 100M rows, the default scale factor means autovacuum waits for 20M dead tuples before running. The result: bloat balloons, indexes degrade, query plans flip.

**Fix per-table:**
```sql
ALTER TABLE hot_table SET (
  autovacuum_vacuum_scale_factor = 0.01,   -- 1% instead of 20%
  autovacuum_vacuum_threshold = 1000,
  autovacuum_analyze_scale_factor = 0.005,
  autovacuum_vacuum_cost_limit = 2000      -- speed it up on hot tables
);
```

## Bloat detection

Two flavors:
- **Table bloat**: dead tuples not yet reclaimed; live rows surrounded by tombstones; sequential scans waste I/O.
- **Index bloat**: historic versions of indexed values consume B-tree pages; index scans deepen.

`scripts/bloat-check.sql` reports per-table and per-index bloat ratios. > 30% bloat warrants attention; > 50% is a fire.

`pg_repack` rewrites a bloated table without taking exclusive locks. `REINDEX CONCURRENTLY` (PG 12+) rebuilds an index online.

## Reading `EXPLAIN (ANALYZE, BUFFERS)`

Order of operations when reading a plan:

1. **Headline node**: top of the tree. Is it `Seq Scan`, `Index Scan`, `Index Only Scan`, `Bitmap Heap Scan`?
2. **Rows estimated vs. actual**: the rule-of-thumb is "if the estimate is off by 10x at any node, statistics are stale or the planner is missing context".
3. **Buffer hits and reads**: `shared hit` means cache; `shared read` means disk. Lots of `read` on a hot query = working set doesn't fit memory or `effective_cache_size` is wrong.
4. **Loop counts on nested loops**: `Nested Loop` × N inner-loop calls is the classic N+1 plan.
5. **Sort method**: `external sort` = `work_mem` is too small (or the query is over-sorting).

`auto_explain` extension logs slow queries' plans automatically.

## PgBouncer modes

| Mode | When | Pitfalls |
|---|---|---|
| **Session** (default) | Long-lived clients, prepared statements (PG < 14), `LISTEN/NOTIFY`, session `SET` | Pool exhaustion easy under spike; connection-per-client |
| **Transaction** | Stateless web/serverless workloads: release after each transaction | No cross-transaction state: no `LISTEN/NOTIFY`, no session `SET`, prepared statements broken on PG < 14 |
| **Statement** | Pure read-only stateless | No multi-statement transactions; rarely the right choice |

**Default for serverless:** transaction mode. Sized at `pool_size = (max_connections - reserved) / num_pgbouncers`. Each app instance opens 1-2 PgBouncer connections, not N database connections.

**Supabase Supavisor** is a PgBouncer-compatible pooler with a shared-connection mode that handles transaction-mode prepared statements correctly on PG ≥ 14.

## Connection pooling and serverless

The fundamental problem: serverless functions cold-start, each opening a connection. A single Lambda app at 1000 RPS opens thousands of connections. Postgres dies at ~500-1000.

The fix: PgBouncer (or Neon's built-in pooler, or Supabase Supavisor) in front. App connects to pooler at near-zero cost; pooler maintains a small pool to Postgres.

For Neon serverless driver (HTTP / WebSocket-based), use the `@neondatabase/serverless` driver in transaction mode.

## Relevance to this stinger

Spine of `guides/05-performance-pooling.md`. Drives hard rules #4 (`EXPLAIN (ANALYZE, BUFFERS)` mandatory) and #6 (pooling mandatory for serverless). `templates/pgbouncer.ini` codifies the transaction-mode defaults.
