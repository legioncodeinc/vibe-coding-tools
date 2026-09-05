# 01 - Connection and drivers

Every claim below cites its raw source. Load `references/connection-pattern-decision-matrix.md` alongside this guide for the printable decision tree.

## The two axes that decide a connection

There are two independent decisions to make for every place your code touches Neon: **pooled vs direct**, and **which driver/transport**. Conflating them is the most common mistake.

### Axis 1: pooled vs direct

Neon pools connections through PgBouncer in transaction mode, accepting up to 10,000 client connections, with `default_pool_size` set to 90% of `max_connections` [raw/neon-drizzle--connections--pooling.md]. Use the pooled connection string (hostname carries a `-pooler` suffix) by default for anything that runs at request time: SvelteKit `load` functions, form actions, API routes [raw/neon-drizzle--connections--pooling.md].

Use the **direct** (unpooled) connection string for:

- Drizzle Kit migrations (`generate`, `migrate`, `pull`), the official Neon+Drizzle guide states plainly that pooled connection strings can cause errors during migrations [raw/neon-drizzle--integration--neon-drizzle-connect-guide.md]
- `pg_dump`/`pg_restore`, these rely on `SET` statements, unsupported in PgBouncer transaction mode [raw/neon-drizzle--connections--pooling.md]
- Logical replication, requires a persistent connection [raw/neon-drizzle--connections--pooling.md]
- Anything needing `LISTEN`/`NOTIFY`, session-level `SET`, SQL-level `PREPARE`, or temp tables with `PRESERVE ROWS`, none of these work on Neon's transaction-mode pooler [raw/neon-drizzle--connections--pooling.md]

This stack's convention: `DATABASE_URL` = pooled, `DIRECT_URL` = direct. `drizzle.config.ts` reads `DIRECT_URL`. The application runtime client reads `DATABASE_URL`. Never invert this.

### Axis 2: which driver

Three real options exist for this stack, and the right one depends on **where the code runs**, not on personal preference:

| Runtime | Driver | Why |
|---|---|---|
| Vercel Fluid compute (Node runtime, the default for SvelteKit on Vercel today) | `pg` (node-postgres) + `@vercel/functions`'s `attachDatabasePool` | Fluid keeps a function instance warm across invocations long enough to safely drain idle pooled connections before suspension, this is what makes a real TCP connection pool safe again, after "classic serverless" made it unsafe [raw/neon-drizzle--connections--vercel-fluid-compute.md] |
| SvelteKit route explicitly on the Edge runtime | `@neondatabase/serverless` (`neon()` over HTTP, or `Pool`/`Client` over WebSockets) | Edge runtimes cannot open raw TCP sockets; the serverless driver speaks HTTP/WebSocket instead [raw/neon-drizzle--connections--serverless-driver.md] |
| A platform without warm-instance reuse (Netlify Functions, Deno Deploy, Cloudflare Workers without Hyperdrive) | `@neondatabase/serverless` HTTP | Avoids opening a fresh TCP connection per invocation, which exhausts `max_connections` fast [raw/neon-drizzle--connections--vercel-fluid-compute.md] |

**The mistake to avoid**: defaulting every Vercel route to `@neondatabase/serverless` out of habit from the pre-Fluid serverless era. Neon's own Vercel-specific guide states the short answer plainly: *"With Vercel Fluid, we recommend you use a standard Postgres TCP connection... and a connection pool. This is the new fastest and most robust method."* [raw/neon-drizzle--connections--vercel-fluid-compute.md] Reserve the serverless driver for routes that are genuinely on the Edge runtime.

## HTTP vs WebSocket, if using the serverless driver

- **HTTP** (`neon()` tagged-template function): lowest setup cost (~3 roundtrips vs ~8 for TCP), fastest for a single query or a non-interactive multi-query transaction via `sql.transaction()`. No sessions, no interactive transactions [raw/neon-drizzle--connections--serverless-driver.md, raw/neon-drizzle--connections--vercel-fluid-compute.md].
- **WebSocket** (`Pool`/`Client`): needed for interactive (multi-step) transactions, or a drop-in `node-postgres`-API-compatible client. In an edge runtime, a `Pool`/`Client` **cannot outlive a single request**, create it, use it, and close it inside the same handler, never at module scope [raw/neon-drizzle--connections--serverless-driver.md].

## Cold starts and driver choice

Scale-to-zero suspends an inactive compute after 5 minutes by default; reactivation takes a few hundred milliseconds, longer after 7+ days idle, and the first queries after wake pay a "cold buffer" tax regardless of which driver issues them [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md]. Driver choice does not eliminate this, it only affects connection **setup** latency, which is a separate cost from compute **activation** latency. Mitigations belong at the compute-configuration layer (suspend timeout tuning, disabling scale-to-zero on latency-sensitive production paths), see guide 08.

## Don't double-pool

If using a pooled Neon connection string, don't also layer client-side connection pooling in the driver on top of it. Let Neon's PgBouncer be the only pool; if client-side pooling can't be avoided, release connections back to the pool promptly [raw/neon-drizzle--connections--vercel-fluid-compute.md].

## Load next

- `references/connection-pattern-decision-matrix.md`, printable decision tree
- `references/sveltekit-db-singleton.md`, where the client actually lives in code
- `guides/05-sveltekit-vercel-integration.md`, the full SvelteKit wiring
