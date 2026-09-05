-- ─────────────────────────────────────────────────────────────────────────────
-- Universal Asset Registry — Migration Template (COPY / EDIT / RENAME)
-- Owner: asset-worker-bee
--
-- Copy this file to the deploying product's migrations folder
-- (e.g., `<prisma-migrations-dir>/<timestamp>_<descriptive_slug>/migration.sql`)
-- before editing. Replace every `<placeholder>`.
--
-- Invariants (hard constraints — asset-worker-bee will reject PRs that break these):
--   1. ADDITIVE ONLY. No DROP COLUMN, no DROP TABLE, no RENAME, no ALTER COLUMN TYPE.
--   2. Every new table has: id TEXT PRIMARY KEY, key TEXT UNIQUE, status "RegistryStatus"
--      NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--      updated_at TIMESTAMPTZ NOT NULL DEFAULT now().
--   3. Every FK column has an accompanying INDEX.
--   4. Every catalog table has an ON DELETE SET NULL or ON DELETE RESTRICT behavior —
--      never ON DELETE CASCADE unless the FK is into a tenant-scoped override table.
--   5. Every ALTER TABLE on an existing table is IF NOT EXISTS so re-runs are safe.
--   6. Grant updates (for `sync_generator` role) land in a separate migration file —
--      this template is schema-only.
--   7. Seed data is a SEPARATE file in the deploying product's seed folder — not in
--      migration SQL.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─── (1) Enums (if this migration adds any) ──────────────────────────────────
-- Wrap every CREATE TYPE in DO blocks so re-runs are idempotent.

-- DO $$ BEGIN
--   CREATE TYPE "<NewEnumName>" AS ENUM ('<value1>', '<value2>');
-- EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── (2) New catalog table(s) ────────────────────────────────────────────────
-- Template:

-- CREATE TABLE IF NOT EXISTS <table_name> (
--   id             TEXT PRIMARY KEY,
--   key            TEXT UNIQUE NOT NULL,
--   -- ... human-owned fields ...
--   status         "RegistryStatus" NOT NULL DEFAULT 'draft',
--   environments   "RegistryEnvironment"[] NOT NULL DEFAULT ARRAY['dev','staging','prod']::"RegistryEnvironment"[],
--   owner_team     TEXT NOT NULL,
--   prd_ref        TEXT,
--   deprecated_at  TIMESTAMPTZ,
--   sunset_at      TIMESTAMPTZ,
--   notes          TEXT,
--   created_by     TEXT NOT NULL,
--   created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
--   updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
--   -- ── Generator-owned ──
--   code_path      TEXT NOT NULL,
--   file_hash      TEXT NOT NULL,
--   detected_at    TIMESTAMPTZ NOT NULL,
--   last_seen_at   TIMESTAMPTZ NOT NULL
--   -- (add FK columns here; every FK gets a separate CREATE INDEX below)
-- );
-- CREATE INDEX IF NOT EXISTS <table_name>_<fk_column>_idx ON <table_name> (<fk_column>);
-- CREATE INDEX IF NOT EXISTS <table_name>_status_idx      ON <table_name> (status);

-- ─── (3) Additive columns on existing tables (soft FKs) ──────────────────────
-- NEVER edit or drop an existing column here. Only ADD COLUMN IF NOT EXISTS.

-- ALTER TABLE <existing_table>
--   ADD COLUMN IF NOT EXISTS <new_column> TEXT;
-- CREATE INDEX IF NOT EXISTS <existing_table>_<new_column>_idx
--   ON <existing_table> (<new_column>);

-- ─── (4) Audit trail for this migration ──────────────────────────────────────

INSERT INTO registry_audit_log (
  id, run_id, actor, table_name, row_key, action, before, after, justification, created_at
) VALUES (
  -- Replace placeholders
  '<cuid for this audit row>',
  '<migration id, e.g., 20260423130000_<feature-slug>_registry_addition>',
  'migration@ci',
  'schema',
  '<migration_name>',
  'apply',
  NULL,
  NULL,
  '<feature PRD ref + one-line justification>',
  now()
);

COMMIT;

-- ─── Post-migration verification (document in migration README) ──────────────
-- After applying, run:
--   pnpm registry:check
-- Expected result: zero `unregistered` drift for the new tables.
