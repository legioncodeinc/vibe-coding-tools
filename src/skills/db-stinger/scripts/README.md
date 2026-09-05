# Scripts: db-stinger

Deterministic helpers for db-worker-bee. Run by the Bee during audits; humans can run them too.

## `analyze-query-plan.sh`

Wraps `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` with a reading checklist.

```bash
DATABASE_URL=postgres://user:pass@host:5432/db ./analyze-query-plan.sh "SELECT ..."
cat slow_query.sql | DATABASE_URL=... ./analyze-query-plan.sh -
```

Reads `$DATABASE_URL` or defaults to local socket. Output: the plan + a checklist of red flags. Source: `guides/05-performance-pooling.md`.

## `audit-missing-indexes.sql`

Three audits in one file:

1. **FK columns without an index**: must-fix. Postgres does not auto-create FK indexes.
2. **Redundant indexes**: should-refactor. `(a)` is redundant when `(a, b)` exists.
3. **Unused indexes**: should-refactor (verify the stats window covers a full quarter before dropping).

```bash
psql "$DATABASE_URL" -f audit-missing-indexes.sql
```

Source: `guides/02-indexing.md`.

## `bloat-check.sql`

Reports per-table dead-tuple percentage and per-index size. Highlights candidates for autovacuum tuning, `pg_repack`, or `REINDEX CONCURRENTLY`.

```bash
psql "$DATABASE_URL" -f bloat-check.sql
```

Thresholds:
- < 20%: healthy.
- 20-50%: investigate; tune autovacuum.
- > 50%: fire.

Source: `guides/05-performance-pooling.md`.

## Conventions

- All scripts are read-only: they never mutate data or schema.
- All scripts read connection from `$DATABASE_URL` (Postgres URI format).
- All scripts cite their source guide in a comment header.
