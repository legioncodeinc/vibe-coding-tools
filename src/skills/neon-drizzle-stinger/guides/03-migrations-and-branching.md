# 03 - Migrations and branching

## Two commands you'll use in every real environment

`drizzle-kit generate` diffs the TypeScript schema against the last snapshot and writes a reviewable `migration.sql` + `snapshot.json`; it touches no database. `drizzle-kit migrate` applies unapplied `.sql` files and records them in a `__drizzle_migrations` table [raw/neon-drizzle--drizzle--migrations-kit-commands.md]. This pair is the only sanctioned path for staging and production in this stack.

## Why `drizzle-kit push` is dangerous

`push` diffs the schema against the **live** database and applies changes immediately, no SQL file, no history, no PR-reviewable artifact [raw/neon-drizzle--drizzle--migrations-kit-commands.md]. Its `--force` flag carries an explicit official warning: *"Use with caution! This flag will automatically approve statements that may truncate tables or delete data."* [raw/neon-drizzle--drizzle--migrations-kit-commands.md] The official recommendation is unambiguous: *"The `push` command is ideal for prototyping and development. For production, use `generate` and `migrate`."* [raw/neon-drizzle--drizzle--migrations-kit-commands.md]

**Rule for this stack**: `push` is allowed only against a local or throwaway Neon branch with no real user data. Any `push` invocation (especially with `--force`) against staging or production is a Ship Gate finding, see the Ship Gate block at the end of this skill's `SKILL.md`.

## Connection requirement

Every migration command runs against the **direct**, non-pooled Neon connection string, pooled strings can error during migrations per Neon's own Drizzle guide [raw/neon-drizzle--integration--neon-drizzle-connect-guide.md]. See `references/migration-workflow-commands.md` for the full command table and the `DATABASE_URL`/`DIRECT_URL` convention.

## Expand-backfill-contract: inherited from db-stinger, applied here

Generic Postgres migration-safety mechanics (lock classes, why a `NOT NULL` add with a volatile default rewrites a table, the `NOT VALID` → `VALIDATE CONSTRAINT` two-step) are **not re-derived in this stinger's own research archive**, they are already grounded in this Hive's [db-stinger](../db-stinger) skill, specifically `guides/03-migrations.md`. Read that guide for the full pattern and lock-class table. This guide adds only the Neon/Drizzle-specific layer on top:

1. **Expand**, write the new column/table/index as a `drizzle-kit generate` migration. Nullable columns and non-volatile-default columns are metadata-only adds; keep them that way at this phase (per db-stinger's guidance, not re-verified fresh in this archive, trust that skill's citations).
2. **Backfill**, a second, separate `generate`+`migrate` pass (or an application-level batch job) populates the new column in chunks. Never fold backfill into the same migration file as the schema change, they have different failure modes and should be separately revertible.
3. **Contract**, once application code reads only the new shape and has run in production for a full deploy cycle, a final migration drops the old column/constraint.

Each phase is its own `drizzle-kit generate` output, its own PR, and (per the branch-per-PR workflow below) its own Neon preview branch to test against before merge.

## Neon branch-per-PR workflow

The Neon GitHub integration auto-configures `NEON_API_KEY` and `NEON_PROJECT_ID` as repo secrets/variables [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md]. The reference workflow:

1. **PR opened/synced** → `neondatabase/create-branch-action` creates `preview/pr-<n>-<branch-name>`, inheriting the parent's schema and data [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].
2. **Migrations run against that branch**, using the branch's own connection string output by the create-branch step (`db_url` / `db_url_with_pooler`) [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].
3. **`neondatabase/schema-diff-action` posts the schema diff as a PR comment**, so reviewers see exactly what a migration changes before approving [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].
4. **PR merged** → migrations run against the real `DATABASE_URL` production secret (a separate, non-branch secret, never the ephemeral branch URL) → `neondatabase/delete-branch-action` removes the preview branch [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].
5. **PR closed without merge** → preview branch deleted, production untouched.

**Operational gotchas**:
- Branch-creation step outputs (`db_url`, `db_url_with_pooler`) are marked as secrets and are **only available within the same job**, run migrations, tests, and the schema-diff step inside that same job, not a downstream job [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].
- Never log the branch `DATABASE_URL` output, it contains live credentials for a real (if ephemeral) database [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].
- Keep `NEON_API_KEY` (manages the Neon project, create/delete branches) and the production `DATABASE_URL` secret (points at the real database) strictly separate; the workflow uses the production secret only after merge [raw/neon-drizzle--migrations--branch-per-pr-github-actions.md].

## CI migration gating for this stack

Wire the sequence above into `.github/workflows/`: every PR touching `src/lib/server/db/schema.ts` (or the migrations folder) creates a Neon branch, runs `drizzle-kit generate --name <n>` if not already generated, runs `drizzle-kit migrate` against the branch, and fails the check if `drizzle-kit generate` would still produce a non-empty diff after migration (schema and migration files out of sync). This gate belongs in `08-performance-and-cost.md`'s CI checklist too, since a stale migration file is a common source of a production incident, not just a dev annoyance.

## Load next

- `references/migration-workflow-commands.md`, command table, `DATABASE_URL`/`DIRECT_URL` convention
- [db-stinger](../db-stinger)`/guides/03-migrations.md`, the generic Postgres expand-backfill-contract mechanics this guide builds on
- `guides/06-supabase-migration.md`, a one-time, larger-scope migration, distinct from ongoing schema changes
