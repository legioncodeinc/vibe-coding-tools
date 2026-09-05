# Choosing your connection method (Vercel Fluid compute) - Neon Docs

- URL: https://neon.com/docs/guides/vercel-connection-methods; supplementary from https://neon.com/docs/connect/choose-connection and https://neon.com/docs/ai/skills/neon-postgres/references/connection-methods.md
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon connection patterns (which driver is correct on Vercel specifically)

## Summary (as stated on the page)

Vercel Fluid compute connection methods for Neon compares TCP, HTTP, and WebSocket protocols by setup roundtrip cost to explain why Fluid compute makes standard Postgres TCP with connection pooling the recommended approach. Classic serverless could not safely pool connections, requiring the `@neondatabase/serverless` HTTP driver; Vercel Fluid solves this by closing idle connections before function suspension, making TCP pooling (`node-postgres`, Drizzle ORM with `attachDatabasePool`) the lowest-latency option.

## The short answer

With **Vercel Fluid**, Neon recommends a **standard Postgres TCP connection** (e.g. `node-postgres`) with a connection pool. This is the new fastest and most robust method for that runtime model.

## Why: classic serverless vs Vercel Fluid compute

- **Classic serverless problem**: functions could not safely maintain a connection pool, functions would be suspended while holding idle connections, causing "leaks" that exhaust the database's connection limit. Because of this, you had to open a *new* connection on every request. A standard TCP connection takes the most roundtrips to establish (~8), adding latency to every call.
- **The HTTP/WebSocket workaround** (`@neondatabase/serverless`): fewer setup roundtrips (~3-4), much faster for the *first* query, this is why the serverless driver exists.
- **Vercel Fluid compute** (the "new way"): allows function *runs* to reuse compute instances and share resources. This makes connection pooling **possible and safe** again, Fluid keeps a function alive just long enough to safely close idle connections before suspension. You can establish a TCP connection once, place it in a pool, and subsequent function calls reuse the warm connection, skipping the ~8-roundtrip setup cost entirely. Once established, direct Postgres TCP is the lowest-latency, most performant option.

## Protocol comparison table

| Connection Method | Protocol | Setup Cost (Roundtrips) | Best For |
|---|---|---|---|
| Postgres (TCP) | `postgres://` | High (~8) | Fluid compute / long-running servers (Render, Railway). Fastest once established. |
| HTTP | `http://` | Lowest (~3) | Classic serverless, fastest for a single query where pooling isn't possible. |
| WebSocket | `ws://` | Low (~4) | Classic serverless, alternative to HTTP in environments without fetch. |

## Recommendation by scenario

- **If using Vercel Fluid compute**: use a standard Postgres TCP driver (`node-postgres`) with a connection pool. See Vercel's "Connection pooling with Vercel Functions" guide. `attachDatabasePool` (from `@vercel/functions`) handles the connection lifecycle: the first request establishes a TCP connection, subsequent requests reuse it instantly, and idle connections close gracefully before Vercel suspends the function.
- **If on "classic" serverless** (no connection pooling, e.g. Netlify Functions, Deno Deploy, Cloudflare Workers without Hyperdrive): continue using `@neondatabase/serverless`. Its HTTP-based connection is optimized for low-latency "first queries," the most important metric in that environment.
- Before migrating, benchmark both connection methods on your own app, some apps with very high cold-start rates might still see an advantage from the low initial connection time of the HTTP driver even under Fluid.

## Platform driver decision matrix (from `choose-connection` and the Neon AI skill reference)

| Platform | TCP Support | Pooling | Recommended Driver |
|---|---|---|---|
| Vercel (Fluid) | Yes | `@vercel/functions` `attachDatabasePool` | `pg` (node-postgres) |
| Cloudflare (Hyperdrive) | Yes | Hyperdrive | `pg` (node-postgres) |
| Cloudflare Workers (no Hyperdrive) | No | No | `@neondatabase/serverless` |
| Netlify Functions | No | No | `@neondatabase/serverless` |
| Deno Deploy | No | No | `@neondatabase/serverless` |
| Railway / Render / VPS / Docker | Yes | Built-in / client-side | `pg` or `postgres.js` |
| Client-side (browser) | No | N/A | `@neondatabase/neon-js` (Data API) |

Decision inputs: deployment platform, runtime type (serverless functions / edge functions / long-running server), transaction requirements, and ORM preference (Drizzle, Kysely, Prisma, or raw SQL), all popular JS/TS ORMs work across all Neon connection methods.

## Double pooling warning (from `choose-connection`)

Neon-side pooling (PgBouncer) and client-side pooling (inside your driver, before reaching PgBouncer) are two different layers. If using a pooled Neon connection string, avoid adding client-side pooling on top, let Neon handle it. If client-side pooling is unavoidable, release connections back to the pool promptly to avoid conflicts with PgBouncer.
