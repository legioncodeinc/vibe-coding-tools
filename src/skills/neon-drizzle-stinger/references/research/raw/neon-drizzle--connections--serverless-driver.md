# Neon serverless driver - Neon Docs

- URL: https://neon.com/docs/serverless/serverless-driver
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon connection patterns (@neondatabase/serverless HTTP driver vs node-postgres)

## Summary (as stated on the page)

The Neon serverless driver (`@neondatabase/serverless`) is a JavaScript and TypeScript Postgres driver that replaces TCP with HTTP or WebSockets, enabling Postgres queries from serverless and edge runtimes such as Vercel Edge Functions and Cloudflare Workers. Use the `neon()` function over HTTP for single or non-interactive batched queries, or the `Pool`/`Client` constructors over WebSockets when sessions, interactive transactions, or node-postgres drop-in compatibility are required. TypeScript types are bundled; install with `npm install @neondatabase/serverless`.

## HTTP vs WebSockets, when to use each

- **HTTP** (`neon()` function, carried by an `https` `fetch` request): faster for single, non-interactive transactions ("one-shot queries"). Multiple queries can be issued within one non-interactive transaction via the `transaction()` function exposed on the query function. Sessions and interactive transactions are **not supported** over HTTP, only one query at a time in this mode.
- **WebSockets** (`Pool`/`Client` constructors): use when you need persistent sessions, interactive (multi-statement) transactions, or drop-in `node-postgres` (`pg`) API compatibility.

## `neon()` function usage

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL, { fetchOptions: { priority: 'high' } });
const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
```

The query function returned by `neon()` can only be used as a template function (tagged template literal) for improved safety against SQL injection. `fetchOptions` merges into the underlying `fetch()` call, e.g. to implement a fetch timeout with `AbortController`.

## Drop-in node-postgres compatibility

`@neondatabase/serverless` is a drop-in replacement for `node-postgres` (`pg`), on which it is based. Queries using `Pool`/`Client` are carried over WebSockets instead of TCP.

## Related integrations referenced on this page

- node-postgres
- Drizzle-ORM (https://orm.drizzle.team/docs/quick-postgresql/neon)
- Schema migration with Lakebase Postgres and Drizzle ORM (https://neon.com/docs/guides/drizzle-migrations)
- kysely
- Zapatos
- Vercel Edge Functions
- Cloudflare Workers ("Use Neon with Cloudflare Workers")

## `neonConfig` options (from JSR reference cited on the same doc cluster)

- `fetchEndpoint`: override the server endpoint for http fetch queries (useful in local dev).
- `fetchFunction`: supply an alternative function for making http requests (must accept the same args as native `fetch`).
- `poolQueryViaFetch` (experimental): when `true` and no listeners are set on `connect`/`acquire`/`release`/`remove` events on a `Pool`, `Pool.query()` sends queries via low-latency HTTP fetch instead of WebSocket.
- `fetchConnectionCache`: deprecated, all queries now use the connection pool/cache by default; this flag is ignored.
