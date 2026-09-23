# 05 - SvelteKit/Vercel integration

## Where the client lives

Official guidance (both Neon's SvelteKit-specific guide and its general Drizzle+Neon guide) is unambiguous: instantiate the database client **only in server-only code**, and query it from server `load` functions, form actions, or API routes, never from a `.svelte` file [raw/neon-drizzle--integration--sveltekit-vercel-guide.md, raw/neon-drizzle--integration--neon-drizzle-connect-guide.md].

```javascript
// +server.js (or +page.server.ts), the connection string and driver import
// never reach client-shipped code
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function load() {
  const response = await sql`SELECT version()`;
  return { version: response[0].version };
}
```
[raw/neon-drizzle--integration--sveltekit-vercel-guide.md]

```svelte
<!-- +page.svelte, only ever receives the resolved data prop -->
<script>
  export let data;
</script>
<p>{data.version}</p>
```
[raw/neon-drizzle--integration--sveltekit-vercel-guide.md]

This stinger's convention hardens that boundary further by placing the client under `src/lib/server/db/`, see `references/sveltekit-db-singleton.md` for the full singleton pattern, including the module-scope `Pool` + `attachDatabasePool` shape for Vercel Fluid compute.

## Edge vs Node runtime

SvelteKit routes default to the Node runtime on Vercel (Fluid compute) unless a route explicitly opts into `export const config = { runtime: 'edge' }`. The driver choice is runtime-dependent, not project-wide:

- **Node runtime (default)**: `pg` (node-postgres) + `attachDatabasePool`, see guide 01 for why this is now the recommended default under Fluid compute, reversing the "always use the HTTP driver on serverless" advice from the pre-Fluid era [raw/neon-drizzle--connections--vercel-fluid-compute.md].
- **Edge runtime**: `@neondatabase/serverless`, since Edge runtimes cannot open raw TCP sockets [raw/neon-drizzle--connections--serverless-driver.md].

Mixing both in one app is normal and expected, a marketing page might run on Edge for latency, while the authenticated app runs on Node/Fluid. Keep two separate client modules (see `references/sveltekit-db-singleton.md`) rather than trying to make one client work for both.

## Provisioning

```bash
vc i neon/neon        # provisions and links a Neon resource to the Vercel project
vercel env pull .env.development.local   # syncs connection-string env vars locally
```
[raw/neon-drizzle--integration--sveltekit-vercel-guide.md]

## Connection reuse in serverless, the Fluid compute story

Classic serverless functions could not safely hold a connection pool: a function could be suspended mid-hold, leaking connections until `max_connections` was exhausted, this is *why* the HTTP/WebSocket serverless driver exists at all [raw/neon-drizzle--connections--vercel-fluid-compute.md]. Vercel Fluid compute changes this by reusing warm function instances across invocations and draining idle connections **before** suspending an instance, which is what makes a real TCP pool (`pg` + `attachDatabasePool`) safe and, once warm, the lowest-latency option, skipping the ~8-roundtrip TCP setup cost on every request after the first [raw/neon-drizzle--connections--vercel-fluid-compute.md].

**Practical implication for this stack**: create the `Pool` once, at module scope, in `src/lib/server/db/index.ts`, not inside the `load` function. See `references/sveltekit-db-singleton.md` for the exact shape and the gotchas around getting this wrong.

## Environment variables in SvelteKit

Use `$env/dynamic/private` (not `$env/static/private`) for `DATABASE_URL`/`DIRECT_URL` when the value needs to be read at runtime rather than baked in at build time, this matters for a value pulled from Vercel's environment-variable system rather than a `.env` file committed at build time. WorkOS's own SvelteKit SDK documents the same `$env/dynamic/private` pattern for its own secrets [raw/neon-drizzle--auth--workos-authkit-sveltekit.md], so this stack applies one consistent convention across both the auth secrets and the database connection string.

## Load next

- `references/sveltekit-db-singleton.md`, the full client module, both runtime variants
- `guides/01-connection-and-drivers.md`, the underlying driver decision this guide applies
- `guides/07-authorization-without-rls.md`, enforcing authorization at the server-code boundary this pattern creates
