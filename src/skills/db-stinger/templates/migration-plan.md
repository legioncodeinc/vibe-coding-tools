# Migration Plan: {{slug}}

**Date:** {{YYYY-MM-DD}}
**Author:** db-worker-bee
**Postgres version:** {{16 / 17}}
**Tooling:** {{drizzle-kit / prisma migrate / raw SQL + pgroll}}
**Affected tables:** {{table-1 (~N rows), table-2 (~N rows)}}

---

## Goal

{{One paragraph: what is changing, why, and what's the user-visible behavior change.}}

## Risk classification

- **Largest affected table:** {{N}} rows
- **Expand-backfill-contract required?** {{yes / no, and why}}
- **Estimated worst-case lock duration:** {{seconds}}
- **Replication impact:** {{e.g., slot lag, downstream consumers, logical replication}}

## Phase 1: Expand

| DDL | Lock class | Duration estimate | Notes |
|---|---|---|---|
| `ALTER TABLE x ADD COLUMN y text;` | `ACCESS EXCLUSIVE` (brief) | < 10ms | metadata-only |
| `CREATE INDEX CONCURRENTLY ...` | `SHARE UPDATE EXCLUSIVE` | {{minutes}} | does not block writes |

**App code change:**
- {{Describe dual-write or read-from-both pattern.}}

**Verification:**
- [ ] `\d {{table}}` shows new column / index.
- [ ] `pg_stat_user_indexes` shows index built (`indisvalid = true`).

## Phase 2: Backfill

```sql
-- Batched backfill
DO $$
DECLARE batch_id bigint := 0;
BEGIN
  LOOP
    UPDATE {{table}} SET {{new_col}} = {{expr}}
    WHERE id > batch_id AND id <= batch_id + 10000 AND {{new_col}} IS NULL;
    EXIT WHEN NOT FOUND;
    batch_id := batch_id + 10000;
    PERFORM pg_sleep(0.1);  -- throttle
  END LOOP;
END $$;
```

**Throttle / pause criteria:**
- Autovacuum lag > {{threshold}}.
- Replication slot lag > {{threshold}}.

**For NOT NULL transitions:**
1. `ALTER TABLE x ADD CONSTRAINT y_nn CHECK (y IS NOT NULL) NOT VALID;`
2. `ALTER TABLE x VALIDATE CONSTRAINT y_nn;` (no exclusive lock; full table scan)
3. `ALTER TABLE x ALTER COLUMN y SET NOT NULL;` (now metadata-only)
4. `ALTER TABLE x DROP CONSTRAINT y_nn;`

**Verification:**
- [ ] Row count of `{{new_col}} IS NOT NULL` matches expected.
- [ ] Constraint validated.

## Phase 3: Contract

| DDL | Lock class | Notes |
|---|---|---|
| `ALTER TABLE x DROP COLUMN old_col;` | `ACCESS EXCLUSIVE` (brief) | metadata-only |
| `DROP INDEX ...` | `ACCESS EXCLUSIVE` (brief) | brief |

**App code change:**
- {{Stop dual-writing; new column / shape is source of truth.}}

**Pre-conditions:**
- [ ] Phase 1 + 2 fully deployed; observed for at least one full deploy cycle.
- [ ] No traffic to the old shape (logs / metrics).

## Rollback

- **Phase 1 rollback:** `DROP COLUMN`, `DROP INDEX CONCURRENTLY`.
- **Phase 2 rollback:** truncate the new column or drop and re-add; data loss limited to backfilled values.
- **Phase 3 rollback:** unrecoverable without backups; do not enter Phase 3 until confidence is high.

## Verification queries (handed to `quality-worker-bee`)

```sql
-- 1. Row counts match
SELECT count(*) FROM {{table}} WHERE {{new_col}} IS NULL;  -- expect 0 after Phase 2

-- 2. Indexes valid
SELECT indexname, indisvalid FROM pg_indexes JOIN pg_index ON ... WHERE tablename = '{{table}}';

-- 3. Plan check on critical query
EXPLAIN (ANALYZE, BUFFERS) {{representative query}};
```

## Handoffs

- **`quality-worker-bee`**: runs verification queries above; confirms green.
- **`security-worker-bee`**: review any new PII columns or RLS impact.
- **`react-worker-bee`**: flag any data-layer changes the UI must adopt.

## References

- `guides/03-migrations.md`
- `templates/expand-backfill-contract-checklist.md`
- {{external URLs}}

---

*Template from `db-stinger/templates/migration-plan.md`. See `examples/zero-downtime-not-null.md` for a filled example.*
