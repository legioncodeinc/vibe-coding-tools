# Migrations / drizzle-kit generate / drizzle-kit migrate / drizzle-kit push - Drizzle ORM

- URL: https://orm.drizzle.team/docs/migrations (primary); supplementary from https://orm.drizzle.team/docs/drizzle-kit-generate, https://orm.drizzle.team/docs/drizzle-kit-migrate, and https://orm.drizzle.team/docs/drizzle-kit-push
- Fetched: 2026-08-14
- Source type: Official docs (Drizzle Team)
- Component: Drizzle-kit migrations (generate/migrate/push, when push is dangerous)

## The five drizzle-kit commands

```
drizzle-kit migrate
drizzle-kit generate
drizzle-kit push
drizzle-kit pull
drizzle-kit export
```

Drizzle Kit is the CLI for managing migrations. It fits both a **codebase-first** approach (TypeScript schema is the source of truth) and a **database-first** approach (introspect an existing DB with `pull`). All configuration options are available via `drizzle.config.ts` or CLI flags (useful for CI/CD).

## `drizzle-kit generate` (codebase-first, file-based)

Generates SQL migration files from schema changes, without applying them.

1. Reads Drizzle schema file(s) and composes a JSON snapshot of the schema.
2. Reads previous migration folders and compares the current snapshot to the most recent one.
3. Based on the diff, generates SQL migrations.
4. Saves `migration.sql` and `snapshot.json` in a timestamped folder under the migrations directory (default `./drizzle`).

`generate` does **not** execute migrations, only creates files. Apply with `drizzle-kit migrate`, `drizzle-orm`'s `migrate()` function at runtime, or an external tool. Options: `--custom` (empty SQL for a custom migration), `--name` (custom migration name), `--ignore-conflicts` (skip commutativity conflict checks, flagged as usually indicating a Drizzle Kit bug if needed; report it).

Required config: `dialect`, `schema` path. Optional: `driver` (`aws-data-api`, `pglite`), `out` (default `./drizzle`), `config` (default `drizzle.config.ts`), `breakpoints` (SQL statement breakpoints, default `true`).

## `drizzle-kit migrate` (apply generated SQL files)

1. Reads `.sql` migration files in the migrations folder.
2. Connects to the database and fetches the applied-migrations history from the `__drizzle_migrations` table (in the `drizzle` schema).
3. Determines which migrations are new (not yet applied).
4. Runs the new SQL migrations and logs them as applied.

Requires `dialect` and database connection credentials via config file or CLI flags. Example flow: `npx drizzle-kit generate --name=init` then `npx drizzle-kit migrate`.

## `drizzle-kit push` (database-first / rapid prototyping, schema diffing applied directly)

Pushes the schema and subsequent changes **directly to the database**, skipping SQL file generation. Designed for the "code first" *rapid iteration* approach.

1. Reads Drizzle schema file(s), composes a JSON snapshot.
2. Introspects (pulls) the current database schema.
3. Diffs the two, generating SQL migrations in memory.
4. **Applies the SQL migrations to the database immediately.**

`push` manages all tables/schemas by default; scope with `tablesFilter`, `schemaFilter`, `extensionFilters`.

### Why `push` is dangerous in production

- `push` skips the migration-file history entirely, there is no `migration.sql`/`snapshot.json` audit trail of what changed or when, unlike `generate` + `migrate`.
- `push` has a **`--force`** flag: *"auto-accept all data-loss statements without confirmation."* Official docs warning: **"Use with caution! This flag will automatically approve statements that may truncate tables or delete data."**
- CLI-only flags: `--verbose` (print SQL before executing), `--explain` (print planned SQL changes without applying, dry run).
- Official guidance (per Drizzle's own CLI reference docs): **"The `push` command is ideal for prototyping and development. For production, use `generate` and `migrate` to maintain a history of schema changes."**

### Recommended split

- **Prototyping / local dev / rapid iteration**: `drizzle-kit push` (with `--verbose`/`--explain` to review before committing to a change).
- **Any environment with real or shared data, staging or production**: `drizzle-kit generate` then `drizzle-kit migrate` (or apply the generated `.sql` via CI/CD or an external migration runner), this preserves a reviewable, revertible migration history and never silently drops data via an unattended `--force`.

## Three deployment shapes for `generate` + `migrate` (per the `migrations` overview page)

1. **Runtime migration via `drizzle-orm`'s `migrate()`**: generate SQL files, then call `migrate()` during application runtime/startup. Common for zero-downtime deploys with rollback if something fails, and for serverless deployments running migrations once in a custom resource during deployment.
2. **`drizzle-kit migrate` applied directly**: generate SQL files, then run `drizzle-kit migrate` to apply them to the database (interactively or from CI).
3. **External migration tools**: generate SQL files, then apply them via external tools like Bytebase or by running the SQL directly against the database.

All three keep the TypeScript schema as the single source of truth and produce a persisted, auditable SQL migration history, this is the structural difference from `push`.
