-- ─────────────────────────────────────────────────────────────────────────────
-- Universal Asset Registry — BLANK DB BOOTSTRAP
-- Owner: asset-worker-bee
-- PRD: <asset-registry foundation + migration-strategy feature PRDs in the deploying product>
--
-- Purpose: create every registry table on a fresh, empty database.
-- Idempotent: all CREATE statements use IF NOT EXISTS where PostgreSQL permits.
-- Non-idempotent bits (enum types, grants) are wrapped in DO blocks.
--
-- This file is a REFERENCE. Do not commit to the deploying product's live migrations folder.
-- The real migration is generated via the product's migration tool (e.g., `pnpm prisma migrate dev`).
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─── Enums ───────────────────────────────────────────────────────────────────

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

DO $$ BEGIN
  CREATE TYPE "RouteMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'WS', 'NA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RouteAuth" AS ENUM ('public', 'authed', 'admin', 'platform_admin', 'service');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SurfaceKind" AS ENUM ('card', 'modal', 'sheet', 'nav', 'popover', 'toast', 'panel', 'drawer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SurfaceDepthLevel" AS ENUM ('flat', 'raised', 'floating', 'glass');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ControlKind" AS ENUM (
    'button', 'input', 'toggle', 'select', 'slider',
    'checkbox', 'radio', 'link', 'menu_item'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DisplayKind" AS ENUM (
    'badge', 'avatar', 'icon_label', 'tag',
    'skeleton', 'divider', 'progress', 'empty_state'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DesignTokenCategory" AS ENUM (
    'color', 'radius', 'shadow', 'blur', 'space',
    'typography', 'motion', 'z_index', 'opacity', 'breakpoint'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "MotionKind" AS ENUM ('duration', 'easing', 'composite');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "MediaKind" AS ENUM ('image', 'logo', 'illustration', 'lottie', 'video');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "FontSource" AS ENUM ('google', 'self_hosted', 'system');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ContentKind" AS ENUM ('string', 'template', 'rich', 'markdown', 'html');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PiiLevel" AS ENUM ('none', 'low', 'high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TranslationStatus" AS ENUM ('draft', 'machine_translated', 'human_reviewed', 'approved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "FeaturePhase" AS ENUM ('proposed', 'in_dev', 'shipped', 'deprecated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Tables ──────────────────────────────────────────────────────────────────
-- NOTE: these are illustrative shapes. In production, use Prisma-generated DDL
-- so column types match Prisma client expectations exactly.

CREATE TABLE IF NOT EXISTS features (
  id                   TEXT PRIMARY KEY,
  key                  TEXT UNIQUE NOT NULL,
  display_name         TEXT NOT NULL,
  description          TEXT NOT NULL DEFAULT '',
  phase                "FeaturePhase" NOT NULL DEFAULT 'proposed',
  meterable            BOOLEAN NOT NULL DEFAULT false,
  default_flag_slug    TEXT,
  owner_team           TEXT NOT NULL,
  prd_ref              TEXT,
  plan_tiers           TEXT[] NOT NULL DEFAULT '{}',
  status               "RegistryStatus" NOT NULL DEFAULT 'draft',
  environments         "RegistryEnvironment"[] NOT NULL DEFAULT ARRAY['dev','staging','prod']::"RegistryEnvironment"[],
  deprecated_at        TIMESTAMPTZ,
  sunset_at            TIMESTAMPTZ,
  replacement_key      TEXT,
  deprecation_reason   TEXT,
  notes                TEXT,
  created_by           TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  code_path            TEXT NOT NULL,
  feature_files_hash   TEXT NOT NULL,
  detected_at          TIMESTAMPTZ NOT NULL,
  last_seen_at         TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS features_phase_idx       ON features (phase);
CREATE INDEX IF NOT EXISTS features_owner_team_idx  ON features (owner_team);
CREATE INDEX IF NOT EXISTS features_status_idx      ON features (status);

CREATE TABLE IF NOT EXISTS pages (
  id                  TEXT PRIMARY KEY,
  key                 TEXT UNIQUE NOT NULL,
  route_id            TEXT,
  layout_id           TEXT,
  feature_key         TEXT REFERENCES features(key) ON DELETE SET NULL ON UPDATE CASCADE,
  auth_requirement    "RouteAuth" NOT NULL DEFAULT 'authed',
  flag_gate           TEXT,
  plan_gate           TEXT[] NOT NULL DEFAULT '{}',
  file_type           TEXT NOT NULL,
  surfaces_used       TEXT[] NOT NULL DEFAULT '{}',
  controls_used       TEXT[] NOT NULL DEFAULT '{}',
  displays_used       TEXT[] NOT NULL DEFAULT '{}',
  content_keys_used   TEXT[] NOT NULL DEFAULT '{}',
  status              "RegistryStatus" NOT NULL DEFAULT 'draft',
  environments        "RegistryEnvironment"[] NOT NULL DEFAULT ARRAY['dev','staging','prod']::"RegistryEnvironment"[],
  owner_team          TEXT NOT NULL,
  prd_ref             TEXT,
  deprecated_at       TIMESTAMPTZ,
  sunset_at           TIMESTAMPTZ,
  notes               TEXT,
  created_by          TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  code_path           TEXT NOT NULL,
  file_hash           TEXT NOT NULL,
  detected_at         TIMESTAMPTZ NOT NULL,
  last_seen_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS pages_feature_key_idx ON pages (feature_key);
CREATE INDEX IF NOT EXISTS pages_route_id_idx    ON pages (route_id);
CREATE INDEX IF NOT EXISTS pages_layout_id_idx   ON pages (layout_id);
CREATE INDEX IF NOT EXISTS pages_status_idx      ON pages (status);

CREATE TABLE IF NOT EXISTS routes (
  id                    TEXT PRIMARY KEY,
  key                   TEXT UNIQUE NOT NULL,
  type                  "RouteType" NOT NULL,
  path                  TEXT NOT NULL,
  method                "RouteMethod" NOT NULL,
  feature_key           TEXT REFERENCES features(key) ON DELETE SET NULL ON UPDATE CASCADE,
  rendered_page_key     TEXT,
  auth                  "RouteAuth" NOT NULL DEFAULT 'authed',
  rate_limit            TEXT,
  permissions_required  TEXT[] NOT NULL DEFAULT '{}',
  version               TEXT,
  external_contract     BOOLEAN NOT NULL DEFAULT false,
  status                "RegistryStatus" NOT NULL DEFAULT 'draft',
  environments          "RegistryEnvironment"[] NOT NULL DEFAULT ARRAY['dev','staging','prod']::"RegistryEnvironment"[],
  owner_team            TEXT NOT NULL,
  prd_ref               TEXT,
  deprecated_at         TIMESTAMPTZ,
  sunset_at             TIMESTAMPTZ,
  notes                 TEXT,
  created_by            TEXT NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  handler_file_path     TEXT NOT NULL,
  handler_export        TEXT NOT NULL,
  file_hash             TEXT NOT NULL,
  openapi_ref           TEXT,
  detected_at           TIMESTAMPTZ NOT NULL,
  last_seen_at          TIMESTAMPTZ NOT NULL,
  UNIQUE (path, method, version)
);
CREATE INDEX IF NOT EXISTS routes_feature_key_idx ON routes (feature_key);
CREATE INDEX IF NOT EXISTS routes_type_idx        ON routes (type);
CREATE INDEX IF NOT EXISTS routes_auth_idx        ON routes (auth);
CREATE INDEX IF NOT EXISTS routes_status_idx      ON routes (status);

-- (Surface, Control, Display, Layout, NavEntry, DesignTokenDefinition, Icon,
-- MediaAsset, Font, Motion, Breakpoint, ContentEntry, ContentTranslation,
-- FeatureEntitlement tables follow the same shape. See registry-schema.prisma
-- for the full model list. For brevity this SQL file shows the first three
-- catalogs; the remaining tables are generated by Prisma from the .prisma file.)

CREATE TABLE IF NOT EXISTS registry_audit_log (
  id             TEXT PRIMARY KEY,
  run_id         TEXT,
  actor          TEXT NOT NULL,
  table_name     TEXT NOT NULL,
  row_key        TEXT NOT NULL,
  action         TEXT NOT NULL,
  before         JSONB,
  after          JSONB,
  justification  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS registry_audit_log_table_row_idx ON registry_audit_log (table_name, row_key);
CREATE INDEX IF NOT EXISTS registry_audit_log_actor_idx     ON registry_audit_log (actor);
CREATE INDEX IF NOT EXISTS registry_audit_log_created_at_idx ON registry_audit_log (created_at);

-- ─── Roles and grants (sync generator) ───────────────────────────────────────

DO $$ BEGIN
  CREATE ROLE sync_generator NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Generator can SELECT, INSERT, and UPDATE only generator-owned columns.
-- Human-owned columns are protected. See guides/03-sync-generator-spec.md.
--
-- Example (apply per-table):
--
--   REVOKE UPDATE ON features FROM sync_generator;
--   GRANT INSERT, SELECT ON features TO sync_generator;
--   GRANT UPDATE (code_path, feature_files_hash, detected_at, last_seen_at)
--     ON features TO sync_generator;
--
-- security-worker-bee owns the final grant matrix (cite the deploying product's
-- security-review feature PRD for the registry grants).

COMMIT;
