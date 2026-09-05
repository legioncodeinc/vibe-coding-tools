-- ─────────────────────────────────────────────────────────────────────────────
-- Universal Asset Registry — EXISTING DB OVERLAY
-- Owner: asset-worker-bee
-- PRD: <asset-registry migration-strategy feature PRD in the deploying product>
--
-- Purpose: apply the registry additively to an existing, live database.
-- NEVER drops a column. NEVER renames. NEVER deletes. Purely additive.
--
-- Run ORDER:
--   1. This file (creates new enums, tables, and adds soft-FK columns).
--   2. `bootstrap.sql` is NOT run on existing DBs — use this instead.
--   3. Backfill scripts (sync generator in --backfill mode).
--
-- This file is a REFERENCE. Do not commit to the deploying product's live migrations folder.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─── New enums (idempotent) ──────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "RegistryStatus" AS ENUM ('draft', 'active', 'deprecated', 'archived', 'orphaned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RegistryEnvironment" AS ENUM ('dev', 'staging', 'prod');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RouteType" AS ENUM (
    'page', 'api', 'webhook_inbound', 'webhook_outbound',
    'server_action', 'middleware', 'redirect', 'cron', 'rpc'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ... (remaining enums same as bootstrap.sql; idempotent via DO blocks) ...

-- ─── New tables (use bootstrap.sql definitions; IF NOT EXISTS guards) ────────

-- Pseudo-include: in practice, copy the CREATE TABLE IF NOT EXISTS statements
-- from bootstrap.sql verbatim. They are already idempotent.

-- ─── Additive columns on existing tables (soft FKs) ──────────────────────────

-- FeatureFlag gets a `feature_key` column (nullable) pointing at features(key).
-- Soft FK (no REFERENCES clause) because existing flags predate features.
-- The sync generator resolves the link over time.

ALTER TABLE feature_flags
  ADD COLUMN IF NOT EXISTS feature_key TEXT;
CREATE INDEX IF NOT EXISTS feature_flags_feature_key_idx
  ON feature_flags (feature_key);

-- Meter gets `feature_key` (soft FK).

ALTER TABLE meters
  ADD COLUMN IF NOT EXISTS feature_key TEXT;
CREATE INDEX IF NOT EXISTS meters_feature_key_idx
  ON meters (feature_key);

-- CustomFeature gets `feature_key` (soft FK) — the billing line-item can
-- optionally reference a real Feature, but the two remain distinct concepts.

ALTER TABLE custom_features
  ADD COLUMN IF NOT EXISTS feature_key TEXT;
CREATE INDEX IF NOT EXISTS custom_features_feature_key_idx
  ON custom_features (feature_key);

-- ─── Notes on string-keyed legacy bindings ───────────────────────────────────
--
-- If the deploying product has a table with a string-keyed reference to a
-- "static code registry id" (e.g., `MenuItemLabelBinding.target_key TEXT` that
-- is hardcoded in app code), elevating this to a real FK into the new
-- nav_entries table happens in a FOLLOW-UP migration, not this one.
--
-- This overlay intentionally leaves any such legacy column unchanged to avoid
-- breaking existing tenant bindings. The follow-up migration:
--   1. Backfills nav_entries from the code-side registry.
--   2. Adds a new nav_entry_id TEXT column alongside the legacy key.
--   3. Populates nav_entry_id for the relevant rows.
--   4. Leaves the legacy column in place for backwards-compat until all readers
--      are updated.
--
-- Do NOT attempt the FK-elevation work in this overlay. This overlay is pure
-- additive registry creation only.

-- ─── Roles and grants ────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE ROLE sync_generator NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- See guides/03-sync-generator-spec.md for the full grant matrix (cite the
-- deploying product's security-review feature PRD for the registry grants).
-- security-worker-bee reviews before grants land in production.

COMMIT;

-- ─── Post-migration: run the backfill ────────────────────────────────────────
--
-- After COMMIT, run:
--
--   pnpm registry:backfill --env <env>
--
-- This detects every existing asset in code and upserts `draft` rows into the
-- new catalogs. Backfill writes:
--   - draft rows for every detected Feature / Page / Route / Surface / etc.
--   - a backfill report at
--     library/qa/asset-registry/backfill-<YYYY-MM-DD>.md
--
-- Humans review the backfill report, fill required fields, flip rows to
-- `active` asset-by-asset. The backfill process is documented in
-- guides/03-sync-generator-spec.md §Backfill.
