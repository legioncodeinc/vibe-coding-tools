# 03: Migrations

The expand-backfill-contract pattern is the discipline that keeps migrations from blocking production.

Source: `research/2026-04-25-expand-backfill-contract-pgroll.md`.

## The pattern

Split a single logical change into three deployments:

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ EXPAND   │  →   │ BACKFILL │  →   │ CONTRACT │
└──────────┘      └──────────┘      └──────────┘
   add new        populate new       remove old
   alongside        from old           shape
   old
```

App code reads/writes both shapes during expand+backfill, then only the new shape after contract.

### Phase 1: Expand
- Add new column / table / index: non-destructive.
- `CREATE INDEX CONCURRENTLY` (no lock; slower).
- Add as `NULL`able with no default (metadata-only).
- App code dual-writes to old and new.

### Phase 2: Backfill
- Populate the new column from the old one.
- **Always batch:** `UPDATE ... WHERE id BETWEEN x AND y` in 10k-100k chunks.
- Throttle by autovacuum lag: heavy backfill creates bloat fast.
- For NOT NULL transitions: add `CHECK (col IS NOT NULL) NOT VALID`, then `VALIDATE CONSTRAINT` separately (cheap lock), then `SET NOT NULL` (now metadata-only, since the constraint already proves it).

### Phase 3: Contract
- App code reads/writes only the new shape.
- Drop old column / index / constraint.
- Do this after observing zero traffic to the old path for a full deploy cycle.

## DDL lock-class table (Postgres 16+)

| DDL | Lock class | Blocks reads? | Blocks writes? | Safe on large table? |
|---|---|---|---|---|
| `CREATE INDEX` | `SHARE` | no | yes | no: use `CONCURRENTLY` |
| `CREATE INDEX CONCURRENTLY` | `SHARE UPDATE EXCLUSIVE` | no | no | yes (slower; can fail invalid) |
| `ADD COLUMN` (nullable, no default) | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `ADD COLUMN ... DEFAULT <const>` (PG 11+) | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `ADD COLUMN ... DEFAULT <expr>` | `ACCESS EXCLUSIVE` | yes | yes | **NO: table rewrite** |
| `ADD COLUMN ... NOT NULL` | `ACCESS EXCLUSIVE` | yes | yes | **NO**: use expand-backfill-contract |
| `ALTER COLUMN ... TYPE` (compatible) | `ACCESS EXCLUSIVE` | brief | brief | maybe |
| `ALTER COLUMN ... TYPE` (incompatible) | `ACCESS EXCLUSIVE` | yes | yes | **NO: table rewrite** |
| `ALTER COLUMN ... SET NOT NULL` | `ACCESS EXCLUSIVE` | brief | brief | maybe: full scan unless `CHECK NOT NULL` validated first |
| `DROP COLUMN` | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `ADD CONSTRAINT ... CHECK NOT VALID` | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `VALIDATE CONSTRAINT` | `SHARE UPDATE EXCLUSIVE` | no | no | yes |
| `ADD FOREIGN KEY ... NOT VALID` | `SHARE ROW EXCLUSIVE` (brief) | brief | brief | yes |

**The 2-minute rule:** any DDL holding `ACCESS EXCLUSIVE` for more than the time of one slow request will pile up the lock queue and stall ALL writes. For a hot table, that is seconds.

## Common patterns

### Add a NOT NULL column on a large table

```sql
-- Phase 1 — Expand (one deploy)
ALTER TABLE users ADD COLUMN preferred_name text;  -- nullable, metadata-only

-- App: dual-write preferred_name when name is set.

-- Phase 2 — Backfill (background, batched)
DO $$
DECLARE batch_id bigint := 0;
BEGIN
  LOOP
    UPDATE users SET preferred_name = name
    WHERE id > batch_id AND id <= batch_id + 10000 AND preferred_name IS NULL;
    EXIT WHEN NOT FOUND;
    batch_id := batch_id + 10000;
    PERFORM pg_sleep(0.1);  -- throttle
  END LOOP;
END $$;

ALTER TABLE users ADD CONSTRAINT preferred_name_nn CHECK (preferred_name IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT preferred_name_nn;
ALTER TABLE users ALTER COLUMN preferred_name SET NOT NULL;  -- now metadata-only
ALTER TABLE users DROP CONSTRAINT preferred_name_nn;

-- Phase 3 — Contract (later deploy)
-- App: stop dual-writing; preferred_name is the source of truth.
```

See `examples/zero-downtime-not-null.md` for the full worked example.

### Change a column type

Don't `ALTER COLUMN ... TYPE` on a large table. Instead:

1. Add a new column with the target type.
2. Backfill (with conversion).
3. Swap reads/writes incrementally.
4. Drop the old column.

### Rename a column

Single-step `ALTER TABLE ... RENAME COLUMN` is metadata-only and fast, but it requires every reader to pick up the new name simultaneously. In a multi-deploy world, instead:

1. Add a new column; trigger to keep it synced.
2. App code reads new, writes old.
3. App code reads new, writes both.
4. App code reads new, writes new.
5. Drop trigger and old column.

Or use `pgroll`, which automates this with views.

## `pgroll`

`pgroll` (Xata) automates expand-backfill-contract using virtual schemas:

```yaml
operations:
  - add_column:
      table: users
      column:
        name: preferred_name
        type: text
        nullable: false
      up: name              # how to compute new from old
      down: preferred_name  # how to compute old from new
```

During the migration, `pgroll` exposes both `migration_<n>_old` and `migration_<n>_new` schemas; app instances on either version read and write through views that hide the change. `pgroll complete` removes the old schema.

**Strengths:** codifies the pattern, rollback is one command.
**Weaknesses:** not every Postgres feature is supported; partitioned tables and exotic constraints sometimes need manual work.

## Migration tooling per ORM

| ORM | Tool | Diff or declarative? | Plays nice with `pgroll`? |
|---|---|---|---|
| Drizzle | `drizzle-kit` | Diff-based | Yes: `drizzle-kit` writes raw SQL files |
| Prisma | `prisma migrate` | Declarative + shadow DB | Partial: Prisma owns the migration history |
| Raw SQL | hand-rolled | n/a | Yes: `pgroll` IS the migration tool |

For zero-downtime requirements at scale, raw SQL + `pgroll` is the most flexible. Prisma + `pgroll` requires extra coordination because Prisma wants to own the migration history.

## Checklist

Use `templates/migration-plan.md` and `templates/expand-backfill-contract-checklist.md`. Every migration plan must:

- [ ] State the Postgres major version.
- [ ] State the lock class of every DDL.
- [ ] Identify any DDL that takes `ACCESS EXCLUSIVE`: these need expand-backfill-contract on tables > 1M rows.
- [ ] Specify the rollback path.
- [ ] Specify verification queries (handed to `quality-worker-bee`).

## Cross-references

- `04-partitioning.md`: partition `ATTACH` / `DETACH` lock behavior.
- `05-performance-pooling.md`: bloat after backfill; autovacuum tuning.
- `templates/migration-plan.md`, `templates/expand-backfill-contract-checklist.md`.
