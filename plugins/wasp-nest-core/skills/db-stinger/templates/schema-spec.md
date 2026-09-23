# Schema Spec: {{project-name}}

**Date:** {{YYYY-MM-DD}}
**Author:** db-wasp-drone
**Postgres version assumed:** {{16 / 17}}
**ORM:** {{Drizzle / Prisma / raw SQL}}
**Platform:** {{Supabase / Neon / Tiger Data / self-hosted / etc.}}

---

## Context

{{One paragraph: what is this schema for, who consumes it, what's the workload shape (read/write ratio, expected row counts at 12 / 24 / 36 months), what are the constraints (RPO/RTO, latency targets, geographic distribution).}}

## Source PRD

{{Link to the `library-wasp-drone` PRD if it exists. db-wasp-drone implements; library-wasp-drone authored.}}

## Tables

### `{{table-name}}`

**Purpose:** {{one sentence}}
**Expected row count at 12mo:** {{N}}
**Read pattern:** {{e.g., point lookups by ID; range scans by created_at; full-text search}}
**Write pattern:** {{e.g., append-only; high-update on status; bulk insert nightly}}

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | PRIMARY KEY | |
| `created_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | maintained by trigger |
| ... | ... | ... | ... |

**Indexes:**

| Index | Columns | Type | Reason |
|---|---|---|---|
| `{{table}}_pkey` | `id` | B-tree (PK) | |
| `{{table}}_status_pending_idx` | `created_at` | B-tree, partial WHERE status='pending' | dashboard query |

**Constraints:**

- `CHECK ({{...}})`: {{reason}}
- `EXCLUDE USING gist ({{...}})`: {{reason}} (if applicable)

**FK targets:**

- `{{column}}` REFERENCES `{{other-table}}({{column}})` `ON DELETE {{RESTRICT|CASCADE|SET NULL}}` (FK index: ✓)

**PII columns:**

- `{{column}}`: {{type of PII; flagged for `security-wasp-drone` audit}}

---

(Repeat per table.)

## Relationships diagram

{{ASCII or Mermaid. Show FKs and cardinality.}}

## Migration tooling

- **Tool:** {{drizzle-kit / prisma migrate / raw SQL + pgroll}}
- **Initial migration:** {{description}}

## Partitioning

{{Either "N/A: no table large enough" or per-table partition strategy with key, type (range/list/hash), retention plan.}}

## Special-purpose

- **`pgvector`:** {{tables that hold embeddings + dimension + index family: `hnsw` or `ivfflat`}}
- **FTS:** {{tables with `tsvector` columns + GIN indexes}}
- **TimescaleDB / Tiger Data:** {{hypertables + chunk interval + continuous aggregates}}

## Open questions

- [ ] {{any user-judgment calls}}

## Handoffs

- **`library-wasp-drone`**: PRD update if scope changed during design.
- **`react-wasp-drone`**: N+1 risk callouts at the data-layer edge.
- **`security-wasp-drone`**: RLS design, PII columns, encryption-at-rest, audit-log compliance.
- **`mind-wasp-drone`**: embedding storage decisions and dimensions for retrieval.
- **`quality-wasp-drone`**: verification queries after migration runs.

## References

- `guides/01-schema-design.md`
- `guides/02-indexing.md`
- {{external URLs}}

---

*Template from `db-stinger/templates/schema-spec.md`. See `examples/greenfield-schema.md` for a filled example.*
