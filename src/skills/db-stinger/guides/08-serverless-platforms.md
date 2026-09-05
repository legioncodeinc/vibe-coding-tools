# 08: Serverless DB Platforms

Workload-to-platform matching across Supabase, Neon, Turso, PlanetScale, CockroachDB Serverless, and Tiger Data.

Source: `research/2026-04-25-serverless-platforms-comparison.md`.

## The choice tree

Ask, in order:

1. **Need geographic distribution and 5-9s availability?** → CockroachDB Serverless.
2. **Time-series workload?** → Tiger Data.
3. **Read-heavy edge data, mostly-static, multi-tenant where each tenant is small?** → Turso.
4. **Committed to MySQL?** → PlanetScale (db-worker-bee flags this is non-Postgres).
5. **Want integrated auth + RLS + storage + realtime + edge functions in one platform?** → Supabase.
6. **Want world-class branching for dev workflow + serverless Postgres?** → Neon.
7. **Otherwise:** Supabase (full-stack monolith) or Neon (BYO services).

## The six platforms

### Supabase

| | |
|---|---|
| Engine | Postgres 15 / 16 |
| Killer feature | Integrated auth + RLS + Storage + Realtime + Edge Functions |
| Pooler | Supavisor (PG-compatible, transaction-mode-with-prepared-statements) |
| Branching | Preview branches per PR (Pro+ tier) |
| Default for | SaaS app needing Postgres + auth + RLS + storage + realtime in one deploy |
| Caveats | Auth UI is opinionated; heavy customization is friction; vendor lock-in on integrated services |

### Neon

| | |
|---|---|
| Engine | Postgres 16 / 17: bottomless storage; separated compute and storage |
| Killer feature | Branching as first-class; copy-on-write Postgres |
| Pooler | Built-in pooler + serverless driver (HTTP / WebSocket) |
| Branching | Per-branch DBs at zero compute cost when idle (scale-to-zero) |
| Default for | Dev workflow that lives or dies on per-PR DB branching; serverless app where idle cost matters |
| Caveats | No auth / storage / realtime: pair with another service |

### Turso

| | |
|---|---|
| Engine | libSQL (SQLite fork), distributed |
| Killer feature | Edge replicas: read latency at the edge |
| Pooler | N/A (SQLite is embedded; HTTP API for serverless) |
| Branching | Database forking via `turso db create --from-db` |
| Default for | Read-heavy edge workloads, mostly-static, multi-tenant with small per-tenant DBs |
| Caveats | **SQLite, not Postgres.** Limited concurrent writes. Different mental model. db-worker-bee flags this. |

### PlanetScale

| | |
|---|---|
| Engine | MySQL 8 (Vitess underneath) |
| Killer feature | Branching + online schema changes via Vitess |
| Pooler | Built-in |
| Branching | Per-branch deploy requests with schema diff review |
| Default for | MySQL workload needing branching + zero-downtime schema changes |
| Caveats | **MySQL, not Postgres.** No FK constraints by default (Vitess limitation, partly relaxed in 2025+). db-worker-bee flags this. |

### CockroachDB Serverless

| | |
|---|---|
| Engine | Distributed SQL (Postgres-wire compatible) |
| Killer feature | Horizontal scale + geo-replication; consensus-based 5-9s |
| Pooler | Postgres-compatible: use any pooler |
| Branching | N/A |
| Default for | Workloads that genuinely need geographic distribution and resilience to a regional outage; financial / regulated |
| Caveats | Not 100% Postgres-compatible (some features / extensions missing); higher per-query latency than single-region Postgres; expensive at scale |

### Tiger Data

| | |
|---|---|
| Engine | Postgres + TimescaleDB |
| Killer feature | Hypertables + continuous aggregates + columnar compression |
| Pooler | Postgres-compatible |
| Branching | N/A; HA via Tiger Cloud |
| Default for | Time-series: IoT, observability, financial ticks, analytics events |
| Caveats | Specialty platform; overkill for general SaaS schemas |

## Decision matrix

| Workload | First choice | Second choice |
|---|---|---|
| Full-stack SaaS, Postgres + auth + storage + realtime in one | Supabase | Neon + Clerk + R2 |
| Branching-driven dev workflow | Neon | Supabase (Pro+) |
| Edge / read-heavy / multi-tenant CMS | Turso | Neon with read replicas |
| MySQL committed | PlanetScale | (no second choice: switch to Postgres if open) |
| Distributed / geo / regulatory | CockroachDB Serverless | (specialty; rarely a second choice) |
| Time-series / IoT / observability | Tiger Data | Self-hosted Postgres + TimescaleDB |
| Greenfield, no integrated services needed | Neon | Supabase |
| Want one platform for the whole product | Supabase | Neon + bolted-on services |

## Pricing model awareness

- **Scale-to-zero** (Neon, Turso, CockroachDB Serverless): pay only for active queries. Wins on idle/dev workloads.
- **Always-on minimum** (Supabase, Tiger Data, PlanetScale free tier): predictable; minimum monthly cost.
- **Per-row / per-query** vs **per-compute / per-time**: read the pricing carefully; surprises hit teams that misjudge query patterns.

## Feature gaps to surface to the user

- **Supabase:** RLS is the auth boundary: security-worker-bee audits the policies. Surface this.
- **Neon:** no auth / storage / realtime; need to pick external services.
- **Turso:** no Postgres extensions (`pgvector`, FTS work differently in libSQL with extensions like `sqlite-vec`).
- **PlanetScale:** FK constraints disabled by default (relational-mode flag in app code instead).
- **CockroachDB:** missing extensions like `pgvector`, `pg_trgm`; some Postgres features differ.
- **Tiger Data:** time-series specialty; general Postgres workloads work but you're paying for TimescaleDB you don't use.

## Output

For platform-choice invocations, fill in `examples/serverless-platform-choice-walkthrough.md` with the user's workload mapped to the matrix above. Recommend a primary platform with 2-3 cited reasons, plus a backup with the trade-off stated.

## Cross-references

- `06-special-purpose.md`: Tiger Data hypertables (technical depth).
- `05-performance-pooling.md`: pooler config per platform.
- `examples/serverless-platform-choice-walkthrough.md`: fill-in template.
