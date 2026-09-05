# 05: Performance & Pooling

Autovacuum, bloat, `EXPLAIN (ANALYZE, BUFFERS)`, PgBouncer transaction vs session mode.

Source: `research/2026-04-25-autovacuum-explain-pgbouncer.md`.

## Reading `EXPLAIN (ANALYZE, BUFFERS)`

Always use `(ANALYZE, BUFFERS)`: never just `EXPLAIN`:

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 42 AND status = 'pending';
```

Reading order:

1. **Headline node.** Top of the tree. Is it `Seq Scan`, `Index Scan`, `Index Only Scan`, `Bitmap Heap Scan`?
2. **Rows estimated vs. actual.** Off by 10x at any node = stale statistics or planner missing context. Run `ANALYZE table_name` and re-check.
3. **Buffer hits and reads.** `shared hit` = cache; `shared read` = disk. High `read` on a hot query = working set doesn't fit memory or `effective_cache_size` is wrong.
4. **Loop counts on nested loops.** `Nested Loop ... loops=N` is the classic N+1 pattern.
5. **Sort method.** `external sort` = `work_mem` too small or query is over-sorting.

`auto_explain` extension logs slow queries' plans automatically:

```sql
LOAD 'auto_explain';
SET auto_explain.log_min_duration = 1000;  -- log queries > 1s
SET auto_explain.log_analyze = on;
SET auto_explain.log_buffers = on;
```

`scripts/analyze-query-plan.sh` wraps `EXPLAIN (ANALYZE, BUFFERS)` with a reading checklist.

## Common plan diagnoses

| Symptom | Likely cause | Fix |
|---|---|---|
| `Seq Scan` on a table > 10k rows for a selective predicate | Missing or unused index | Add index; check `pg_stat_user_indexes` to see if existing index is being used |
| Estimated rows off by 10x+ | Stale statistics | `ANALYZE`; consider `default_statistics_target` increase for the column |
| `Nested Loop ... loops=1000+` | Implicit N+1 | Rewrite as join with `IN (...)` or hash join |
| `external sort ... Disk: 50000kB` | `work_mem` too small | `SET work_mem = '64MB'` for the session; revisit global setting |
| High `shared read` on a frequent query | Working set > memory | Increase RAM, increase `shared_buffers`, or partition |
| `Index Scan` instead of `Index Only Scan` | Heap fetch needed | Add `INCLUDE` clause to index; cover the columns |

## Autovacuum tuning

Defaults assume a 10k-row table; they're wrong for a 100M-row hot table.

**Default:** autovacuum kicks in at `50 + 0.20 * reltuples` dead tuples. For 100M rows, that's 20M dead tuples: bloat by then is severe.

**Per-table fix:**
```sql
ALTER TABLE hot_table SET (
  autovacuum_vacuum_scale_factor = 0.01,        -- 1% instead of 20%
  autovacuum_vacuum_threshold = 1000,
  autovacuum_analyze_scale_factor = 0.005,
  autovacuum_vacuum_cost_limit = 2000           -- speed up on hot tables
);
```

For tables with frequent `UPDATE`s on indexed columns, also tune `autovacuum_vacuum_insert_scale_factor` (PG 13+).

## Bloat detection

Run `scripts/bloat-check.sql` periodically. Thresholds:

- < 20% bloat: healthy.
- 20-50% bloat: investigate; tune autovacuum.
- > 50% bloat: fire: consider `pg_repack` or `VACUUM FULL` (warning: `VACUUM FULL` takes `ACCESS EXCLUSIVE`).

`pg_repack` rewrites a bloated table without exclusive locks (extension required). `REINDEX INDEX CONCURRENTLY` rebuilds indexes online (PG 12+).

## PgBouncer modes

| Mode | When | Pitfalls |
|---|---|---|
| **Session** (default) | Long-lived clients; `LISTEN/NOTIFY`; session `SET`; prepared statements (PG < 14) | Pool exhaustion under spike; connection-per-client |
| **Transaction** | Stateless web/serverless; release after each transaction | No cross-transaction state: no `LISTEN/NOTIFY`, no session `SET`, prepared statements broken on PG < 14 |
| **Statement** | Pure read-only stateless | No multi-statement transactions; rarely the right choice |

**Default for serverless:** transaction mode. See `templates/pgbouncer.ini`.

**Sizing:**
```
pool_size = (max_connections - reserved) / num_pgbouncer_instances
```

For a Postgres with `max_connections=200`, reserve 20 for admin, run 4 PgBouncers, give each `pool_size=45`. Each app instance opens 1-2 PgBouncer connections, not N database connections.

**Supabase Supavisor** is PgBouncer-compatible with a shared-connection mode that handles transaction-mode prepared statements correctly on PG ≥ 14. **Neon** ships a built-in pooler plus an HTTP/WebSocket serverless driver.

## Serverless connection survival

Serverless functions cold-start, each opening a connection. A single Lambda app at 1000 RPS opens thousands of connections; Postgres dies at 500-1000.

Mandatory mitigations:

1. PgBouncer (or Supavisor / Neon's built-in) in front.
2. Transaction-mode pooling.
3. Short connection lifetime in app config (`statement_timeout`, `idle_in_transaction_session_timeout`).
4. For Neon: use the `@neondatabase/serverless` driver (HTTP-based, no persistent connection).
5. For Prisma: `pgbouncer=true` in the connection string AND PgBouncer in transaction mode AND `relationMode = "prisma"` if you hit prepared-statement issues.

## Other tunables worth knowing

| Parameter | Default | Common tuning |
|---|---|---|
| `shared_buffers` | 128MB | 25% of RAM (typical) |
| `effective_cache_size` | 4GB | 50-75% of RAM |
| `work_mem` | 4MB | 16-64MB for analytics; per-connection so be careful |
| `maintenance_work_mem` | 64MB | 1-2GB for `REINDEX` / large `VACUUM` |
| `random_page_cost` | 4.0 | 1.1 for SSDs (default 4 assumes spinning disk) |
| `effective_io_concurrency` | 1 | 200+ for SSDs |
| `max_wal_size` | 1GB | 4-16GB for write-heavy |

These belong in any new Postgres deployment's tuning baseline.

## Cross-references

- `02-indexing.md`: `EXPLAIN` confirms whether the index you added is actually used.
- `03-migrations.md`: backfills create bloat; tune autovacuum first.
- `08-serverless-platforms.md`: each managed platform has different default pooler config.
- `templates/pgbouncer.ini`: sane defaults.
