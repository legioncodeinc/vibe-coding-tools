# Worked Example: Zero-Downtime NOT NULL Column Add

Add a NOT NULL `preferred_name` column to a 100M-row `users` table without blocking writes. Source: `guides/03-migrations.md`, `templates/migration-plan.md`, `templates/expand-backfill-contract-checklist.md`.

---

## Context

- **Postgres version:** 16.
- **Table:** `users`, ~100M rows, hot (writes ~500/s, reads ~5000/s).
- **Goal:** add `preferred_name text NOT NULL`, default to current `name`, remain editable independently going forward.
- **Tooling:** raw SQL + `pgroll` (could also do this manually).
- **Naive single-step that would fail:**
  ```sql
  -- 🚫 DO NOT DO THIS ON A 100M-ROW TABLE
  ALTER TABLE users ADD COLUMN preferred_name text NOT NULL DEFAULT name;
  ```
  This takes `ACCESS EXCLUSIVE` and rewrites the entire table: minutes-to-hours of blocked writes. Source: `guides/03-migrations.md` §DDL-lock-class-table.

## Plan

### Phase 1: Expand (Deploy 1)

```sql
-- Metadata-only: nullable column with no default
ALTER TABLE users ADD COLUMN preferred_name text;
```

| DDL | Lock | Duration | Notes |
|---|---|---|---|
| `ADD COLUMN ... text` (nullable, no default) | `ACCESS EXCLUSIVE` (brief) | < 10ms | metadata-only on PG 11+ |

**App code change:**
- Reads: prefer `preferred_name`, fall back to `name`.
- Writes: when writing `name`, also write `preferred_name`. Dual-write.

**Verification:**
- [ ] `\d users` shows the new column.
- [ ] App logs show dual-writes happening.
- [ ] No regression in p99 write latency.

**Observe** for at least one full deploy cycle: typically 24h.

### Phase 2: Backfill (Background job)

```sql
-- Batched backfill, throttled
DO $$
DECLARE batch_id bigint := 0;
DECLARE rows_updated int;
BEGIN
  LOOP
    UPDATE users
    SET preferred_name = name
    WHERE id > batch_id
      AND id <= batch_id + 10000
      AND preferred_name IS NULL;

    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;

    batch_id := batch_id + 10000;
    PERFORM pg_sleep(0.1);  -- throttle by 100ms between batches

    -- Optional: pause if autovacuum is behind
    -- IF (SELECT n_dead_tup FROM pg_stat_user_tables WHERE relname='users') > 5000000 THEN
    --   PERFORM pg_sleep(60);
    -- END IF;
  END LOOP;
END $$;
```

For 100M rows in 10k chunks at 100ms throttle = ~17 minutes minimum, longer in practice with autovacuum throttling. Run it as a background job that can resume.

**Then enforce NOT NULL via the safe path:**

```sql
-- Add CHECK constraint NOT VALID — metadata-only, brief lock
ALTER TABLE users
  ADD CONSTRAINT preferred_name_nn CHECK (preferred_name IS NOT NULL) NOT VALID;

-- Validate it — full table scan but no write block (SHARE UPDATE EXCLUSIVE only)
ALTER TABLE users VALIDATE CONSTRAINT preferred_name_nn;

-- Now SET NOT NULL is metadata-only (because the constraint already proves it)
ALTER TABLE users ALTER COLUMN preferred_name SET NOT NULL;

-- Drop the redundant CHECK constraint
ALTER TABLE users DROP CONSTRAINT preferred_name_nn;
```

| DDL | Lock | Duration | Notes |
|---|---|---|---|
| `ADD CONSTRAINT ... NOT VALID` | `ACCESS EXCLUSIVE` (brief) | < 10ms | metadata-only |
| `VALIDATE CONSTRAINT` | `SHARE UPDATE EXCLUSIVE` | minutes | no read or write block |
| `SET NOT NULL` (after VALIDATE) | `ACCESS EXCLUSIVE` (brief) | < 10ms | metadata-only because constraint validated |
| `DROP CONSTRAINT` | `ACCESS EXCLUSIVE` (brief) | < 10ms | metadata-only |

**Verification:**
- [ ] `SELECT count(*) FROM users WHERE preferred_name IS NULL;` returns 0.
- [ ] `\d users` shows `preferred_name text not null`.
- [ ] Bloat check after backfill: large `UPDATE`s create dead tuples.

**Tune autovacuum on `users`** before this phase if not already:
```sql
ALTER TABLE users SET (
  autovacuum_vacuum_scale_factor = 0.01,
  autovacuum_vacuum_threshold = 1000,
  autovacuum_vacuum_cost_limit = 2000
);
```

### Phase 3: Contract (Deploy 2)

**App code change:**
- Reads: only `preferred_name`.
- Writes: only `preferred_name`. Stop dual-writing.

There is no DDL change in Phase 3 for this migration: the column already has the right shape. The contract is purely an app-code change that retires the dual-write code path.

For migrations that add a *replacement* column (renaming `name` → `preferred_name`), Phase 3 would also `DROP COLUMN name` after observing no writes.

**Pre-conditions:**
- [ ] Phase 1 + 2 deployed and observed for at least one full deploy cycle.
- [ ] Logs / metrics confirm no writes touching the old code path.

## Rollback

- **Phase 1:** `ALTER TABLE users DROP COLUMN preferred_name;`: metadata-only.
- **Phase 2:** truncate the column or drop and re-add. Backfilled values are lost; recoverable from PITR.
- **Phase 3:** the app-code path is the rollback target. Re-deploy the dual-write code if reading-from-only-`preferred_name` causes regression.

## Verification queries (handed to `quality-worker-bee`)

```sql
-- 1. Backfill complete
SELECT count(*) AS null_rows FROM users WHERE preferred_name IS NULL;
-- expect 0

-- 2. Constraint enforced
SELECT conname, convalidated FROM pg_constraint
WHERE conrelid = 'users'::regclass AND contype = 'c';

-- 3. Plan check on critical query
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, preferred_name FROM users WHERE id = 12345;

-- 4. Bloat check
\i bloat-check.sql
```

## Why `pgroll` could replace most of this

The same migration in `pgroll`:

```yaml
operations:
  - add_column:
      table: users
      column:
        name: preferred_name
        type: text
        nullable: false
      up: name
      down: NULL
```

`pgroll start` runs Phase 1 + Phase 2; `pgroll complete` runs Phase 3. The virtual schemas mediate dual reads/writes during the migration. Trade-off: less control over throttling and ordering than the manual approach above.

## References

- `guides/03-migrations.md` §DDL-lock-class-table.
- `templates/migration-plan.md`.
- `templates/expand-backfill-contract-checklist.md`.
- `research/2026-04-25-expand-backfill-contract-pgroll.md`.
- https://github.com/xataio/pgroll

---

*Forged 2026-04-25.*
