# Zero-Downtime Migrations: Expand-Backfill-Contract & `pgroll`

**Sources:**
- https://github.com/xataio/pgroll: `pgroll` online migrations
- https://medium.com/@QuarkAndCode/database-schema-design-zero-downtime-migrations-postgres-8a02a5b52033
- https://www.postgresql.org/docs/current/sql-altertable.html: lock behavior reference
- https://orm.drizzle.team/docs/migrations
- https://www.prisma.io/docs/orm/prisma-migrate

**Retrieved:** 2026-04-25

## Summary

The expand-backfill-contract pattern (sometimes called expand-and-contract) is the discipline that keeps schema migrations from blocking production traffic. It splits a single logical change into three deployments: introduce the new shape *alongside* the old (expand), populate the new shape (backfill), then remove the old shape (contract).

`pgroll` from Xata automates this pattern using virtual schemas: old and new versions of the schema are exposed via Postgres views during the rollout, letting application code on both versions read and write safely.

## The three phases

### 1. Expand
- Add new column / table / index: **non-destructive**.
- Use `ADD COLUMN` (nullable, no default → metadata-only on PG 11+; with non-constant default → table rewrite).
- `CREATE INDEX CONCURRENTLY` (no lock; slower).
- Application code writes to **both** old and new shape.

### 2. Backfill
- Populate the new column from the old one.
- Batch (never `UPDATE table SET ...` without a `WHERE id BETWEEN x AND y` in 10k)100k chunks.
- Throttle by autovacuum lag: heavy backfill creates bloat fast.
- Add a `CHECK ... NOT VALID` constraint, then `VALIDATE CONSTRAINT` separately (cheap lock).

### 3. Contract
- Application code reads/writes **only** the new shape.
- Drop the old column / index / constraint.
- This phase is destructive; do it after observing zero traffic to the old path for a full deploy cycle.

## DDL lock-class table (Postgres 16+)

| DDL | Lock class | Blocks reads? | Blocks writes? | Safe on large table? |
|---|---|---|---|---|
| `CREATE INDEX` | `SHARE` | no | yes | no: use `CONCURRENTLY` |
| `CREATE INDEX CONCURRENTLY` | `SHARE UPDATE EXCLUSIVE` | no | no | yes (slower; can fail and leave invalid index) |
| `ADD COLUMN` (nullable, no default) | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `ADD COLUMN ... DEFAULT <const>` (PG 11+) | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `ADD COLUMN ... DEFAULT <expr>` | `ACCESS EXCLUSIVE` | yes | yes | **NO: table rewrite** |
| `ADD COLUMN ... NOT NULL` | `ACCESS EXCLUSIVE` | yes | yes | **NO**: use expand-backfill-contract |
| `ALTER COLUMN ... TYPE` (compatible) | `ACCESS EXCLUSIVE` | brief | brief | maybe: depends on whether rewrite is needed |
| `ALTER COLUMN ... TYPE` (incompatible) | `ACCESS EXCLUSIVE` | yes | yes | **NO: table rewrite** |
| `ALTER COLUMN ... SET NOT NULL` | `ACCESS EXCLUSIVE` | brief | brief | maybe: full table scan unless `CHECK ... NOT NULL` validated first |
| `DROP COLUMN` | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only (column logically dropped) |
| `ADD CONSTRAINT ... CHECK NOT VALID` | `ACCESS EXCLUSIVE` (brief) | brief | brief | yes: metadata-only |
| `VALIDATE CONSTRAINT` | `SHARE UPDATE EXCLUSIVE` | no | no | yes |
| `ADD FOREIGN KEY ... NOT VALID` | `SHARE ROW EXCLUSIVE` (brief) | brief | brief | yes |
| `CREATE TABLE ... PARTITION OF` | `ACCESS EXCLUSIVE` (parent) | brief | brief | yes if partition empty |
| `ATTACH PARTITION` | `ACCESS EXCLUSIVE` (parent) | brief | brief | yes if `CHECK` already validates the bound |

**The 2-minute rule:** any DDL that takes `ACCESS EXCLUSIVE` for more than the time of one slow request will pile up the lock queue and stall ALL writes. For a hot table, that is seconds.

## `pgroll` model

`pgroll` defines migrations in JSON / YAML; during a migration two virtual schemas exist (`migration_<n>_old` and `migration_<n>_new`). Application code reads and writes the schema it expects; `pgroll` mediates with views and triggers. Once both versions have caught up, `pgroll complete` removes the old schema.

Strengths: codifies expand-backfill-contract; rollback is one command. Weaknesses: not every Postgres feature is supported (partitioned tables and some constraint shapes still require manual handling).

## Relevance to this stinger

Spine of `guides/03-migrations.md`, `templates/migration-plan.md`, `templates/expand-backfill-contract-checklist.md`, `examples/zero-downtime-not-null.md`. Drives hard rule #3.
