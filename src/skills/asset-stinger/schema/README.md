# Schema: Canonical Registry Assets

This directory holds the canonical schema artifacts the `asset-worker-bee` agent references when implementing the asset-registry schema foundation in a deploying product, and when scaffolding a blank-DB bootstrap or an existing-DB overlay. The shapes here are the generic, product-agnostic reference: any deploying product mirrors these into its own Prisma/SQL layer.

## Files

| File | Use when |
|---|---|
| [`registry-schema.prisma`](./registry-schema.prisma) | You are writing a Prisma migration or adding the registry models to the deploying product's `schema.prisma`. Mirror the shapes here. |
| [`bootstrap.sql`](./bootstrap.sql) | Greenfield DB, no prior data. Runs the full `CREATE TABLE` set for every registry model. |
| [`overlay.sql`](./overlay.sql) | Existing DB with live data, additive only. `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE ADD COLUMN IF NOT EXISTS` for FK elevation on existing tables. |

## These files are EXAMPLES

They are not production artifacts. Use them as the starting point; the real migration goes through whatever migration flow the deploying product uses (Prisma `migrate dev`, raw SQL, etc.). Never commit `bootstrap.sql` or `overlay.sql` to the live migrations folder: they're reference material.

## Naming and map conventions (enforced)

- Every model uses `@@map("snake_case")` for the table name.
- Every FK column uses `@map("snake_case")`.
- Every model has at least one index on FK columns.
- Every catalog model has:
  - `id: String @id @default(cuid())`
  - `key: String @unique` (except join tables)
  - `status: RegistryStatus @default(draft)`
  - `createdAt: DateTime @default(now())`
  - `updatedAt: DateTime @updatedAt`
- Generator-owned columns are grouped at the bottom of the model with a `// ── Generator-owned ──` comment.

## Order of application

When applying to a blank DB:

1. Enums first (`bootstrap.sql` starts with `CREATE TYPE`).
2. Catalog tables (`Feature`, `Page`, `Route`, etc.).
3. Join tables (`FeatureEntitlement`).
4. Audit tables (`registry_audit_log`).

When applying to an existing DB (overlay):

1. Add new enums.
2. Create new catalog tables.
3. Add new columns to existing tables (soft FKs):
   - `FeatureFlag.featureKey: String?`
   - `Meter.featureKey: String?`
   - `CustomFeature.featureKey: String?`
4. Create join tables.
5. Create audit tables.
6. Do NOT drop or rename anything in the overlay run.

## Roles and grants

The sync generator runs as DB role `sync_generator`. See `guides/03-sync-generator-spec.md` §Human-only fields are protected. The role grant SQL is included in `bootstrap.sql` and `overlay.sql` at the bottom, but is Prisma-unfriendly and lives as a raw SQL migration in the deploying product.

## Related docs

- [`../guides/00-principles.md`](../guides/00-principles.md): the nine non-negotiables
- [`../guides/01-registration-workflow.md`](../guides/01-registration-workflow.md): registration flow
- [`../guides/03-sync-generator-spec.md`](../guides/03-sync-generator-spec.md): what writes what
- [`../guides/05-hand-offs.md`](../guides/05-hand-offs.md): scope boundaries
