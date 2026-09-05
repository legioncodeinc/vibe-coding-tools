# Expand-Backfill-Contract Checklist

A gating checklist for any migration touching a table > 1M rows. Tick every box before advancing to the next phase.

---

## Pre-flight

- [ ] Postgres major version captured.
- [ ] Affected table sizes captured (`pg_relation_size`, `reltuples`).
- [ ] Lock-class table consulted for every DDL: `guides/03-migrations.md`.
- [ ] Worst-case lock duration estimated.
- [ ] Backup / PITR confirmed available for the affected window.
- [ ] Rollback plan documented.

## Phase 1: Expand

- [ ] All Phase 1 DDL is non-blocking (metadata-only or `CONCURRENTLY`).
- [ ] No `ADD COLUMN ... DEFAULT <expr>` on a large table.
- [ ] No `ADD COLUMN ... NOT NULL` on a large table.
- [ ] No `ALTER COLUMN ... TYPE` requiring rewrite.
- [ ] All new indexes built `CONCURRENTLY`.
- [ ] App code dual-writes (or reads from both shapes): verified in staging.
- [ ] Phase 1 PR merged, deployed, observed green for {{N}} hours.
- [ ] `\d <table>` confirms new shape.
- [ ] `pg_stat_user_indexes` confirms index `indisvalid = true`.

## Phase 2: Backfill

- [ ] Batched (`UPDATE ... WHERE id BETWEEN x AND y` in 10k-100k chunks).
- [ ] Throttled by autovacuum lag and replication slot lag.
- [ ] No single `UPDATE` covering the whole table.
- [ ] Backfill driver (script / job) is idempotent and resumable.
- [ ] For NOT NULL transitions: `CHECK ... NOT VALID`, `VALIDATE CONSTRAINT`, `SET NOT NULL`, `DROP CONSTRAINT` sequence followed.
- [ ] Backfill completion verified: row count of `<new_col> IS NULL` is 0.
- [ ] Bloat check after backfill (`scripts/bloat-check.sql`).
- [ ] Autovacuum tuning revised on the affected table if necessary.

## Phase 3: Contract

- [ ] Phase 1 + 2 deployed and observed for at least one full deploy cycle.
- [ ] Logs / metrics confirm zero traffic to the old shape.
- [ ] App code reads/writes only the new shape: verified in staging.
- [ ] Phase 3 PR can run without blocking writes (only metadata-only or `CONCURRENTLY`).
- [ ] Rollback plan revisited: Phase 3 is destructive; only proceed at high confidence.

## Post-deploy

- [ ] Verification queries run by `quality-worker-bee`: all green.
- [ ] `EXPLAIN (ANALYZE, BUFFERS)` on critical queries: no unexpected plan changes.
- [ ] Bloat check; reindex if necessary.
- [ ] Migration plan archived in the host repo's `library/requirements/reports/db/<date>-migration-plan.md` (standalone) or `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-migration-plan.md` (feature-tied).

## References

- `guides/03-migrations.md`