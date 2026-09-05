# Postgres + Tooling Version Log

**Forged:** 2026-04-25

What was current at the time each guide was authored. Lock behavior, `pgvector` index types, and `pgroll` capabilities differ across major versions: this log gates the assumptions baked into each guide.

## PostgreSQL

| Version | Status @ 2026-04-25 | Notable for db-stinger |
|---|---|---|
| 17 (latest stable) | GA Sept 2024; widely adopted by 2026 | `MERGE` improvements, incremental backups, statistics on top-N partitioning, parallel `VACUUM` indexes |
| 16 | LTS-class | `pg_stat_io`, parallel `FULL OUTER JOIN`, logical replication from standbys |
| 15 | Maintenance | `MERGE`, public schema permissions hardened |
| 14 | Eligible for `pgroll` baseline | Trigram + range operator improvements |
| ≤ 13 | Out of scope for new work | Lock behavior on `ADD COLUMN ... NOT NULL DEFAULT <expr>` differs; flag this in any audit |

**Default assumption in guides:** Postgres 16 or 17 unless stated otherwise. Notes flagged where 14/15 behavior diverges.

## Postgres extensions

| Extension | Version @ forge time | Notes |
|---|---|---|
| `pgvector` | 0.8+ | Both `ivfflat` and `hnsw` index types available; `hnsw` is the 2026 default for most workloads |
| TimescaleDB / Tiger Data | 2.16+ | Continuous aggregates and hypertables stable; Tiger Data is the new product name from Timescale |
| `pg_stat_statements` | bundled | Required for performance audits |
| `pgroll` | 0.13+ | Online migrations with virtual schemas; PG 14+ |

## ORMs / Migration tooling

| Tool | Version @ forge time | Notes |
|---|---|---|
| Drizzle ORM | 0.44+ | Full Postgres feature coverage; `drizzle-kit` for migrations |
| Prisma | 6.x | Strong DX; weaker raw-SQL story; built-in connection pool with `pgbouncer=true` flag |
| Kysely | 0.27+ | Mentioned as alternative in `07-orm-choice.md` but not first-class |
| `pgroll` | 0.13+ | Online migrations |

## Serverless DB platforms (snapshot)

| Platform | Postgres version | Notable feature |
|---|---|---|
| Supabase | 15 / 16 | Integrated auth + RLS + Storage + Realtime + Edge Functions; Supavisor pooler |
| Neon | 16 / 17 | Branching, autoscaling, scale-to-zero; bottomless storage |
| Turso | libSQL (SQLite fork) | Distributed edge SQLite; not Postgres: different mental model |
| PlanetScale | MySQL 8 | Branching, online schema changes via Vitess; not Postgres |
| CockroachDB Serverless | Postgres-wire compatible | Distributed SQL; some PG features missing |
| Tiger Data | Postgres + TimescaleDB | Time-series specialist |

**Versioning note:** This log is the single source of truth for "what version did the guide assume?": refresh it when refreshing any guide.
