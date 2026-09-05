# Connection-pattern decision matrix

Load when: choosing a Neon driver and pooling strategy for a specific SvelteKit route, cron job, or migration step. Grounded in `raw/neon-drizzle--connections--pooling.md`, `raw/neon-drizzle--connections--serverless-driver.md`, `raw/neon-drizzle--connections--vercel-fluid-compute.md`, and `raw/neon-drizzle--integration--neon-drizzle-connect-guide.md`.

## Step 1: pooled or direct?

| Scenario | Connection | Why |
|---|---|---|
| SvelteKit `load` function, form action, or API route at runtime | **Pooled** (`-pooler` hostname) | Many short-lived requests; PgBouncer handles connection churn |
| `drizzle-kit generate` / `migrate` / `pull` | **Direct** | Official Neon+Drizzle guide: pooled strings can error during migrations |
| `pg_dump` / `pg_restore` (Supabase migration, backups) | **Direct** | `pg_dump` relies on `SET` statements, unsupported on pooled transaction-mode connections |
| Logical replication (Supabase migration, cross-region) | **Direct** | Requires a persistent connection; pooled mode is incompatible |
| A route that needs `LISTEN`/`NOTIFY`, session-level `SET`, or SQL-level `PREPARE` | **Direct** | Not supported on Neon's transaction-mode pooler |
| Long-running analytics/reporting query | **Direct** | Avoid contending with the app's transaction pool |

## Step 2: which driver, on Vercel specifically?

This is the question the mission cares about most and where teams get it wrong by defaulting to habits from "classic serverless."

| Vercel compute model | Driver | Reasoning |
|---|---|---|
| **Fluid compute** (Vercel's current default for Functions) | `pg` (node-postgres) + `@vercel/functions`'s `attachDatabasePool` | Fluid keeps a function instance warm across invocations and safely drains idle connections before suspension, so a real TCP connection pool works and is the lowest-latency option once warm |
| **Edge runtime routes** (`export const runtime = 'edge'`) | `@neondatabase/serverless` (`neon()` over HTTP, or `Pool`/`Client` over WebSockets) | Edge runtime cannot open raw TCP sockets; the serverless driver's HTTP/WebSocket transport is the only option |
| Classic Node serverless function on a platform **without** Fluid-style warm reuse (rare on Vercel today, common historically) | `@neondatabase/serverless` HTTP | Avoids the "new connection per invocation" problem that exhausts `max_connections` |

**Do not default to `@neondatabase/serverless` for every Vercel route by habit.** For a standard Node-runtime SvelteKit route on current Vercel (Fluid is the default compute model), `pg` + a connection pool is the recommended, lowest-latency path per Neon's own Vercel-specific guide. Reserve `@neondatabase/serverless` for routes explicitly running on the Edge runtime.

## Step 3: HTTP or WebSocket, if using the serverless driver?

| Need | Transport | API |
|---|---|---|
| Single query, or several independent queries that don't need to share a transaction | HTTP | `neon()` tagged-template function |
| Several queries in one non-interactive transaction (no mid-transaction branching logic) | HTTP | `sql.transaction()` |
| Interactive/multi-step transaction, or a straight `node-postgres`-compatible `Pool`/`Client` swap | WebSocket | `Pool`/`Client` from `@neondatabase/serverless`, `drizzle-orm/neon-serverless` |

**Edge-runtime WebSocket gotcha**: a `Pool`/`Client` cannot outlive a single request in an edge runtime. Create it, use it, and close it inside the same request handler, never at module scope, never reused across invocations.

## Step 4: don't double-pool

If using a pooled Neon connection string, do not also configure client-side connection pooling in the driver on top of it. Let Neon's PgBouncer be the only pool. If client-side pooling is unavoidable for some other reason, release connections back to the pool promptly.

## Quick reference: full decision path

```
Is this a migration / pg_dump / logical replication / LISTEN-NOTIFY / SET-dependent operation?
  └─ YES → direct connection, pg driver
  └─ NO  → pooled connection, then:
       Is this route running on the Edge runtime?
         └─ YES → @neondatabase/serverless (HTTP for one-shot, WebSocket for interactive tx)
         └─ NO  → pg (node-postgres) + attachDatabasePool (Vercel Fluid compute)
```
