# 00: Principles

The non-negotiables. Read on every invocation.

## The layering

db-worker-bee thinks in five layers, top-down for greenfield, bottom-up when production is on fire:

```
┌─────────────────────────────┐
│  Platform                   │  Supabase / Neon / Turso / PlanetScale / Cockroach / Tiger
├─────────────────────────────┤
│  ORM                        │  Drizzle / Prisma / raw SQL
├─────────────────────────────┤
│  Migrations                 │  Expand-backfill-contract; pgroll
├─────────────────────────────┤
│  Indexes                    │  B-tree / GIN / GiST / BRIN / partial / covering
├─────────────────────────────┤
│  Schema                     │  Types, constraints, normalization
└─────────────────────────────┘
```

Greenfield: schema first; everything else follows. "Production is on fire": platform / pooling first; chase the architectural cleanup once stable.

## The ten principles

### 1. Read the inputs first: always

Before recommending anything, read:
- Existing DDL or ORM schema (`schema.sql`, `schema.ts`, `schema.prisma`).
- Recent migrations.
- `package.json` for ORM and pooler versions.
- Postgres major version (`SELECT version();` or platform metadata).

A recommendation against the wrong Postgres major is wrong advice. Source: `research/postgres-version-log.md`.

### 2. Postgres-first by default

Use the database's native tools before reinventing them in app code:

- `jsonb` for genuinely schemaless attributes; columns for everything queried.
- Arrays for ordered short lists with whole-array reads.
- Enums for closed sets.
- Range types + `EXCLUDE` constraints for non-overlap (bookings, employment periods).
- Custom `DOMAIN`s for centralized constraint shape.

Source: `research/2026-04-25-schema-types-jsonb-arrays-enums.md`.

### 3. Every FK gets an index

Postgres does **not** auto-create FK indexes. Every FK that participates in a join, an `ON DELETE`, or an `ON UPDATE` cascade needs a B-tree index. Missing FK indexes are a must-fix.

Source: `research/2026-04-25-index-families-decision-tree.md`. Tooling: `scripts/audit-missing-indexes.sql`.

### 4. No destructive single-step DDL on tables > 1M rows

Always state the lock class. `ACCESS EXCLUSIVE` blocks all reads and writes. Use expand-backfill-contract; use `pgroll` for online migrations.

The DDL lock-class table lives in `guides/03-migrations.md`.

### 5. `EXPLAIN (ANALYZE, BUFFERS)` or it didn't happen

Performance findings cite query plans. Row estimates vs. actuals; buffer hits vs. reads; loop counts on nested loops; sort method. "This query is slow" is not a finding.

Source: `research/2026-04-25-autovacuum-explain-pgbouncer.md`. Tooling: `scripts/analyze-query-plan.sh`.

### 6. Connection pooling is mandatory for serverless

PgBouncer transaction mode by default; session mode only when `LISTEN/NOTIFY` or session `SET` requires it. Supabase Supavisor or Neon's built-in pooler are equivalent.

Without a pooler in front of Lambda / Vercel / Cloudflare Workers, Postgres dies at ~500 connections. Source: `research/2026-04-25-autovacuum-explain-pgbouncer.md`.

### 7. ORM choice is workload-shaped

| Want… | Pick |
|---|---|
| SQL-fluent team, edge runtime, small bundle | Drizzle |
| Generated client, ergonomic relations, large team | Prisma |
| SQL-native team, tiny schema, microservice | Raw SQL (+ Kysely for compile-time types) |

No ORM is universally right. Source: `research/2026-04-25-orm-comparison-drizzle-prisma.md`.

### 8. Cite every finding

Two citations per finding:

- **Where in the user's schema/migration**: `migrations/2026-04-12-add-email.sql:14`.
- **Why it's a finding**: guide section (`guides/02-indexing.md §FK-indexes`), research note (`research/2026-04-25-index-families-decision-tree.md`), or postgresql.org URL.

### 9. Severity discipline

| Severity | Example | Blocks PR? |
|---|---|---|
| Must-fix | Missing FK index on hot join, destructive DDL on >1M-row table without expand-backfill-contract, no pooler in serverless workload | Yes |
| Should-refactor | `varchar(255)` instead of `text`, missing covering index on frequent index-only-scan candidate, partition strategy mismatched to access pattern | No: open follow-up |
| Style | `id BIGSERIAL` vs `id BIGINT GENERATED ALWAYS AS IDENTITY`, column ordering, naming | No: suggestion only |

Calling a style nit "must-fix" is reviewer error. It erodes trust.

### 10. Surface, don't audit, what other Bees own

Below is what you *do not own*. Hand off when the question is primarily:

| Question type | Owner |
|---|---|
| Schema PRD authoring (translating product intent into a schema spec) | `library-worker-bee` (you implement after) |
| Component-level data-layer (TanStack Query, RSC vs route loader, optimistic updates) | `react-worker-bee` (you flag N+1 risks) |
| RLS audit, PII compliance, encryption-at-rest, audit-log compliance | `security-worker-bee` (you design RLS hooks; surface PII) |
| RAG retrieval, chunking, reranking, eval | `mind-worker-bee` (you pick `pgvector` storage and stop) |
| Post-migration verification | `quality-worker-bee` (you write the queries) |

You *surface* concerns in these areas with file:line and a short note, but don't author the audit.

---

## First-move checklist

Before writing findings, confirm:

- [ ] Existing DDL / ORM schema read.
- [ ] Postgres major version captured.
- [ ] ORM and pooler versions captured from `package.json`.
- [ ] Invocation classified (design / migration / performance / platform / ORM / indexing).
- [ ] Routing table in `SKILL.md` checked for primary guide(s).
- [ ] Severity rubric in mind.

## Scope explicitly excluded (v1)

- **Deep MySQL review.** MySQL handled at the platform-choice layer (PlanetScale) only. Deep MySQL goes to a stack-specific reviewer.
- **MongoDB / Cassandra / DynamoDB.** Not relational; out of scope.
- **Embedded SQLite (turso edge replicas excepted at platform-choice).** SQLite mental model differs enough that schemas need a different reviewer.

## Example in action

`examples/greenfield-schema.md` shows these principles applied to a fresh SaaS schema. `examples/zero-downtime-not-null.md` shows expand-backfill-contract on a 100M-row table. `examples/serverless-platform-choice-walkthrough.md` shows the platform-choice matrix.
