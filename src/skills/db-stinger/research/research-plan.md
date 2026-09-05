# Research Plan: db-stinger

**Bee:** db-worker-bee
**Forged:** 2026-04-25
**Source doc:** `cursor-subagent-research-combined.md` sections "Database Architecture (PostgreSQL)" (line ~422) and "Serverless Databases" (line ~1144).

## Open questions from the brief

1. Should db-worker-bee own MySQL deeply? **Resolved: NO.** MySQL is handled at the platform-choice layer (PlanetScale) only, with explicit caveats. Deep MySQL reviews go to a stack-specific reviewer. Noted in `guides/00-principles.md`.
2. Should db-worker-bee author DDL directly when invoked? **Resolved: YES for greenfield; for brownfield, db-worker-bee proposes the migration plan and `quality-worker-bee` verifies after.**
3. Where does TimescaleDB / Tiger Data live in the guides? **Resolved:** `guides/06-special-purpose.md` for time-series patterns + `guides/08-serverless-platforms.md` for the platform choice. Cross-referenced.

## Authoritative sources to consult

### Primary (must fetch directly)
- https://www.postgresql.org/docs/current/: current Postgres docs (v17 at forge time)
- https://www.postgresql.org/docs/current/indexes.html: definitive indexing reference
- https://www.postgresql.org/docs/current/ddl-partitioning.html: declarative partitioning
- https://www.postgresql.org/docs/current/datatype-json.html: JSON / JSONB
- https://www.postgresql.org/docs/current/textsearch.html: Postgres FTS
- https://www.postgresql.org/docs/current/routine-vacuuming.html: autovacuum
- https://www.postgresql.org/docs/current/using-explain.html: EXPLAIN
- https://github.com/dhamaniasad/awesome-postgres: curated ecosystem

### Migrations
- https://github.com/xataio/pgroll: online migrations with expand-contract model
- https://orm.drizzle.team/docs/migrations: Drizzle Kit migrations
- https://www.prisma.io/docs/orm/prisma-migrate: Prisma Migrate
- https://medium.com/@QuarkAndCode/database-schema-design-zero-downtime-migrations-postgres-8a02a5b52033: zero-downtime migration patterns

### Performance & pooling
- https://www.pgbouncer.org/: PgBouncer
- https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler: pooling in serverless
- https://github.com/PacktPublishing/PostgreSQL-16-Performance-Tuning-Guide: perf tuning depth

### Special-purpose
- https://github.com/pgvector/pgvector: vector search
- https://docs.tigerdata.com/: TimescaleDB / Tiger Data

### Serverless DB platforms
- https://supabase.com/docs: Postgres + Auth + RLS + Realtime
- https://neon.tech/docs: serverless Postgres + branching
- https://docs.turso.tech/: distributed libSQL/SQLite
- https://planetscale.com/docs: serverless MySQL with branching
- https://www.cockroachlabs.com/docs/: distributed SQL
- https://docs.tigerdata.com/: TimescaleDB managed

## Search queries executed (semantic, question-shaped)

1. "When to use jsonb vs separate columns in PostgreSQL 2026?"
2. "PostgreSQL index decision tree btree gin gist brin 2026"
3. "How to add NOT NULL column to large PostgreSQL table without locking?"
4. "pgroll expand backfill contract migration pattern production"
5. "PgBouncer transaction vs session mode serverless Postgres 2026"
6. "Drizzle vs Prisma vs Kysely 2026 production comparison"
7. "Supabase vs Neon serverless Postgres comparison 2026"
8. "PlanetScale vs Neon vs Supabase choice tree 2026"
9. "pgvector index choice ivfflat vs hnsw production embedding workload"
10. "PostgreSQL partitioning range vs list vs hash decision 2026"
11. "PostgreSQL autovacuum tuning hot tables 2026"
12. "EXPLAIN ANALYZE BUFFERS reading query plans Postgres"
13. "CockroachDB Serverless vs PlanetScale vs Neon distributed SQL 2026"
14. "Tiger Data TimescaleDB hypertables continuous aggregates 2026"

## Target output

- 7 dated research notes in `research/2026-04-25-<topic>.md`
- `postgres-version-log.md` capturing "what was current at author time"
- `open-questions.md` if any user-judgment calls remain
