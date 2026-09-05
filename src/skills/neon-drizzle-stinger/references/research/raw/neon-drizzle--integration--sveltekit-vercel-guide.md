# Neon for Vercel, SvelteKit integration - Vercel Marketplace

- URL: https://vercel.com/marketplace/neon/neon
- Fetched: 2026-08-14
- Source type: Official docs (Vercel Marketplace / Neon partner integration)
- Component: SvelteKit/Vercel integration (where the client lives, server-side query pattern)

## Provisioning via the Vercel CLI

```bash
vc i neon/neon
```

This installs the Neon integration and provisions a Neon Postgres resource, connected to the Vercel project.

## SvelteKit-specific walkthrough (as documented on the page)

> In this guide, you will learn how to connect SvelteKit with Neon over a secure server-side request using the `@neondatabase/serverless` driver.

Steps documented:

1. **Connect to a project**, start from an existing SvelteKit project (or create one).
2. **Pull environment variables**: `vercel env pull .env.development.local`, makes the latest Neon connection environment variables available locally.
3. **Install the Neon serverless driver**: `npm install @neondatabase/serverless`.
4. **Load data on the server**, in `+server.js`/route server files, connect and query directly:

```javascript
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
const sql = neon(connectionString);

export async function load() {
    const response = await sql`SELECT version()`;
    const { version } = response[0];
    return { version };
}
```

5. **Load data on the client**, in `+page.svelte`, consume the data returned by the SvelteKit `load` function:

```svelte
<script>
    export let data;
</script>

<h1>Database Version</h1>
<p>{data.version}</p>
```

6. **Run locally**: `npm run dev`.

## Architectural implication

The database client (and the raw `DATABASE_URL`) lives strictly in **server-only SvelteKit code**, `+page.server.ts`/`+server.ts` files and other code that runs exclusively on the server, never in `+page.svelte` or any client-loaded module. The Svelte component only ever receives the already-fetched `data` prop from a `load` function; the query itself, the connection string, and the driver import never reach client-shipped JavaScript. This is the same boundary SvelteKit enforces generally for any server secret, and it is the pattern the official Neon-for-Vercel SvelteKit guide demonstrates end to end.
