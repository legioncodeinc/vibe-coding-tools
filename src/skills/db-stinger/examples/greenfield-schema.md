# Worked Example: Greenfield Schema

A clean greenfield Postgres schema for a small SaaS app: users, organizations, projects, tasks, comments, with audit hooks, PII flags, and `pgvector`-ready document table. Source: `guides/01-schema-design.md`, `guides/02-indexing.md`.

---

## Context

- **Product:** lightweight project-tracking SaaS.
- **Postgres version:** 17 (latest stable at forge time).
- **ORM:** Drizzle.
- **Platform:** Supabase (auth + RLS + storage).
- **Workload:** mixed read/write, point lookups dominant; some search.
- **Expected at 12 mo:** ~50k organizations, ~500k users, ~5M tasks, ~20M comments. Below partitioning threshold.

## DDL

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
CREATE TYPE org_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE task_status AS ENUM ('open', 'in_progress', 'blocked', 'done', 'archived');

-- Domain
CREATE DOMAIN email AS text CHECK (VALUE ~* '^[^@]+@[^@]+\.[^@]+$');

-- updated_at trigger function (reused)
CREATE OR REPLACE FUNCTION trigger_set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ----- organizations -----
CREATE TABLE organizations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  tier org_tier NOT NULL DEFAULT 'free',
  metadata jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT organizations_name_not_empty CHECK (length(name) > 0),
  CONSTRAINT organizations_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE UNIQUE INDEX organizations_slug_active_unique
  ON organizations (slug) WHERE deleted_at IS NULL;

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ----- users -----
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email email NOT NULL,
  name text NOT NULL,
  organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX users_email_active_unique
  ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX users_email_lower_idx ON users (lower(email));
CREATE INDEX users_organization_id_idx ON users (organization_id);  -- FK index — MUST-FIX rule

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON COLUMN users.email IS 'PII';
COMMENT ON COLUMN users.name IS 'PII';

-- ----- projects -----
CREATE TABLE projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX projects_organization_id_idx ON projects (organization_id);

-- ----- tasks -----
CREATE TABLE tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'open',
  due_date DATE,
  metadata jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tasks_title_not_empty CHECK (length(title) > 0)
);

CREATE INDEX tasks_project_id_idx ON tasks (project_id);
CREATE INDEX tasks_assignee_id_idx ON tasks (assignee_id);  -- FK index
-- Partial index for the dashboard "my open tasks" query
CREATE INDEX tasks_assignee_open_idx
  ON tasks (assignee_id, due_date)
  WHERE status IN ('open', 'in_progress', 'blocked');
-- jsonb GIN for occasional metadata filters
CREATE INDEX tasks_metadata_gin ON tasks USING gin (metadata jsonb_path_ops);

CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ----- comments -----
CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body text NOT NULL,
  search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(body, ''))) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX comments_task_id_idx ON comments (task_id);
CREATE INDEX comments_author_id_idx ON comments (author_id);
CREATE INDEX comments_search_idx ON comments USING gin (search_vector);

-- ----- documents (pgvector-ready) -----
CREATE TABLE documents (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  embedding vector(1536),  -- matches OpenAI text-embedding-3-small
  metadata jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX documents_organization_id_idx ON documents (organization_id);
-- HNSW for retrieval; cosine similarity. Hand off retrieval strategy to mind-worker-bee.
CREATE INDEX documents_embedding_hnsw ON documents
  USING hnsw (embedding vector_cosine_ops);
```

## Decision rationale (citations)

| Decision | Source |
|---|---|
| `BIGINT GENERATED ALWAYS AS IDENTITY` over `BIGSERIAL` | `guides/01-schema-design.md` §default-scaffolding: modern syntax |
| `email` domain | `guides/01-schema-design.md` §custom-domains: centralized constraint |
| Partial unique index on `slug` and `email` | `guides/02-indexing.md` §partial: soft-delete coexistence |
| Expression index on `lower(email)` | `guides/02-indexing.md` §expression: case-insensitive lookup |
| Every FK has a B-tree index | `guides/02-indexing.md` §FK-indexes: must-fix rule |
| Partial index on `tasks (assignee_id, due_date) WHERE status IN ('open', ...)` | `guides/02-indexing.md` §partial: dashboard hot query |
| GIN on `metadata jsonb_path_ops` | `guides/02-indexing.md` §jsonb: `@>` containment fast |
| Stored generated `tsvector` for FTS | `guides/06-special-purpose.md` §postgres-fts |
| `vector(1536)` matches embedding model | `guides/06-special-purpose.md` §pgvector |
| `hnsw` index over `ivfflat` | `guides/02-indexing.md` §pgvector: 2026 default |
| `COMMENT ON COLUMN ... IS 'PII'` | `guides/01-schema-design.md` §pii-flags: surfaces to security-worker-bee |
| Partitioning skipped | `guides/04-partitioning.md` §when: under threshold |

## Pre-launch checklist

- [ ] All FK indexes present (`scripts/audit-missing-indexes.sql` clean).
- [ ] No `varchar(n)` without a CHECK reason (`text` is the default).
- [ ] All money columns are `NUMERIC(p, s)` (none in this schema).
- [ ] `updated_at` triggers wired on every table that needs them.
- [ ] PII columns commented for `security-worker-bee` audit.
- [ ] Supabase RLS policies designed (handed to `security-worker-bee`).
- [ ] PgBouncer / Supavisor in transaction mode if going serverless (`templates/pgbouncer.ini`).

## Handoffs from this schema

- `security-worker-bee`: audit RLS policies; verify PII flags map to retention + encryption-at-rest config.
- `react-worker-bee`: data-layer plan for the UI (TanStack Query / RSC / route loader).
- `mind-worker-bee`: retrieval over `documents.embedding` (chunking, top-k, reranking).
- `quality-worker-bee`: verification queries after first deploy.

---

*Source: `guides/01-schema-design.md`, `guides/02-indexing.md`, `guides/06-special-purpose.md`. Forged 2026-04-25.*
