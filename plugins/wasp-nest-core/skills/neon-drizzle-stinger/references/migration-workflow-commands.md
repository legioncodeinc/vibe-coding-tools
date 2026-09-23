# Migration workflow: commands table

Load when: running or explaining any Drizzle Kit migration command, or deciding which command fits the moment. Grounded in `raw/neon-drizzle--drizzle--migrations-kit-commands.md`.

## Commands

| Command | What it does | Writes files? | Touches the database? | Use it when |
|---|---|---|---|---|
| `drizzle-kit generate` | Diffs the TypeScript schema against the last recorded snapshot; writes `migration.sql` + `snapshot.json` to `./drizzle` (or configured `out`) | Yes | No | Every schema change, in every environment above local prototyping |
| `drizzle-kit migrate` | Reads unapplied `.sql` files from the migrations folder, applies them, records them in `__drizzle_migrations` | No | Yes (applies) | After `generate`, in CI or at deploy time, against a **direct** (non-pooled) connection |
| `drizzle-kit push` | Diffs schema against the **live** database and applies changes immediately, no file trail | No | Yes (applies immediately) | Local prototyping only, never staging or production |
| `drizzle-kit pull` | Introspects an existing database and generates a schema file (and, in the current CLI, a `relations.ts` in the v2 relations syntax) | Yes | No (reads only) | Adopting Drizzle against an existing/legacy database, or migrating relations v1 → v2 |
| `drizzle-kit export` | Exports the current schema representation | Depends | No | Tooling integrations, external migration systems |

## Standard sequence for this stack (staging and production)

```bash
# 1. Edit schema.ts, then generate a migration file. Direct connection required.
npx drizzle-kit generate --name add_user_role

# 2. Review the generated SQL in ./drizzle/<timestamp>_add_user_role/migration.sql by hand.
#    Look specifically for: ACCESS EXCLUSIVE-taking statements, missing NOT VALID on new
#    constraints, and any statement that would rewrite a large table. See guide 03.

# 3. Apply it. In CI this runs against a Neon branch first (branch-per-PR), then against
#    production only after merge, per guide 03 and 06.
npx drizzle-kit migrate
```

## `push` danger, restated from the official docs (verbatim warning)

> "Use with caution! This flag will automatically approve statements that may truncate tables or delete data.", describing `push --force`

> "The `push` command is ideal for prototyping and development. For production, use `generate` and `migrate` to maintain a history of schema changes.", official CLI reference guidance

`push` skips the SQL-file audit trail entirely. There is no `migration.sql` to review in a PR, no `snapshot.json` history, and `--force` will silently accept a data-destroying statement with zero confirmation. Treat any `drizzle-kit push` invocation against a database that holds real user data as a Ship Gate finding, minimum severity **medium**, and escalate to **high** if `--force` is present.

## Neon-specific connection requirement

Every command above that touches the database (`migrate`, `push`) **must use the direct (non-pooled) Neon connection string**. The official Neon+Drizzle guide states plainly that pooled connection strings can cause errors during migrations, see `references/connection-pattern-decision-matrix.md`. `generate` and `pull` do not need a live connection for `generate` (schema-diff only) but `pull` does (introspection) and should also use the direct string.

## Environment variable convention used by this stinger's templates

| Variable | Points at | Used by |
|---|---|---|
| `DATABASE_URL` | Pooled Neon connection string (`-pooler` hostname) | Application runtime queries |
| `DIRECT_URL` | Direct Neon connection string | `drizzle-kit generate` / `migrate` / `pull`, `pg_dump` |

`drizzle.config.ts` should read `DIRECT_URL` for `dbCredentials.url`, never `DATABASE_URL`.
