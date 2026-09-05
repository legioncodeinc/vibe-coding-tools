# Serverless DB Platforms: Comparison

**Sources:**
- https://supabase.com/docs
- https://neon.tech/docs
- https://docs.turso.tech/
- https://planetscale.com/docs
- https://www.cockroachlabs.com/docs/
- https://docs.tigerdata.com/
- WebSearch: "Supabase vs Neon serverless Postgres comparison 2026"
- WebSearch: "PlanetScale vs Neon vs Supabase choice tree 2026"
- WebSearch: "CockroachDB Serverless vs PlanetScale vs Neon distributed SQL 2026"

**Retrieved:** 2026-04-25

## Summary

Six platforms dominate the 2026 serverless-DB conversation. They differ on engine (Postgres vs MySQL vs SQLite vs distributed SQL), pricing model (scale-to-zero vs always-on minimums), branching, replication topology, and integrated services (auth, storage, realtime). The right pick is workload-shaped: not feature-list shaped.

## The six platforms

### Supabase
- **Engine:** Postgres (15 / 16).
- **Killer feature:** integrated auth + RLS + Storage + Realtime + Edge Functions in one platform.
- **Pooler:** Supavisor (PgBouncer-compatible, transaction-mode-with-prepared-statements on PG ≥ 14).
- **Branching:** preview branches per PR (Pro+ tier).
- **When it wins:** SaaS app that needs Postgres + auth + RLS + storage + realtime in one deploy. Default for full-stack projects.
- **Caveats:** auth UI is opinionated: heavy customization is friction.

### Neon
- **Engine:** Postgres (16 / 17), bottomless storage, separated compute and storage.
- **Killer feature:** branching as first-class: every branch is a copy-on-write Postgres; ideal for preview environments and reset-on-PR.
- **Pooler:** built-in pooler + serverless driver (HTTP / WebSocket).
- **Branching:** per-branch databases at zero compute cost when idle (scale-to-zero).
- **When it wins:** dev workflow that lives or dies on per-PR DB branching; serverless app where idle cost matters.
- **Caveats:** no auth / storage / realtime: pair with another service.

### Turso
- **Engine:** libSQL (SQLite fork), distributed.
- **Killer feature:** edge replicas: read latency at the edge, write back to a primary.
- **Pooler:** N/A (SQLite is embedded; HTTP API for serverless).
- **Branching:** database forking via `turso db create --from-db`.
- **When it wins:** read-heavy edge workloads, mostly-static data with frequent reads (CMS, content sites, multi-tenant where each tenant is its own DB).
- **Caveats:** SQLite mental model: not Postgres. Limited concurrent writes (single-writer per database). Not the right choice for transactional SaaS with heavy writes.

### PlanetScale
- **Engine:** MySQL 8 (Vitess underneath).
- **Killer feature:** branching + online schema changes (Vitess); deploy requests with auto-revert.
- **Pooler:** built-in.
- **Branching:** per-branch deploy requests with schema diff review.
- **When it wins:** MySQL workload that needs branching + zero-downtime schema changes; teams committed to MySQL.
- **Caveats:** **MySQL, not Postgres.** No FK constraints (Vitess limitation, partly relaxed in 2025+). Different mental model. **db-worker-bee flags this as a non-Postgres choice.**

### CockroachDB Serverless
- **Engine:** distributed SQL (Postgres-wire compatible).
- **Killer feature:** horizontal scale and geo-replication; 5-9s availability with consensus replication.
- **Pooler:** Postgres-compatible: use any pooler.
- **Branching:** N/A in the same sense; clusters scale up/down.
- **When it wins:** workloads that genuinely need geographic distribution and resilience to a regional outage; financial / regulated workloads.
- **Caveats:** not 100% Postgres-compatible (some features / extensions missing); higher latency per query than single-region Postgres; not free at scale.

### Tiger Data
- **Engine:** Postgres + TimescaleDB.
- **Killer feature:** hypertables + continuous aggregates + compression for time-series.
- **Pooler:** Postgres-compatible.
- **Branching:** N/A; Tiger Cloud handles HA.
- **When it wins:** time-series workloads: IoT, observability, financial ticks, analytics events.
- **Caveats:** specialty platform: overkill for general SaaS schemas.

## The choice tree

1. **Need geographic distribution and 5-9s availability?** → CockroachDB Serverless.
2. **Time-series workload?** → Tiger Data.
3. **Read-heavy edge data, mostly-static, multi-tenant where each tenant is small?** → Turso.
4. **Committed to MySQL?** → PlanetScale (db-worker-bee flags this is non-Postgres).
5. **Want integrated auth + RLS + storage + realtime + edge functions in one platform?** → Supabase.
6. **Want world-class branching for dev workflow + serverless Postgres?** → Neon.
7. **Otherwise:** Supabase or Neon: Supabase wins for full-stack monoliths, Neon wins when other platform services are already chosen (Clerk for auth, R2 for storage).

## Relevance to this stinger

Spine of `guides/08-serverless-platforms.md` and `examples/serverless-platform-choice-walkthrough.md`.
