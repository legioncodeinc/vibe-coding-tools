# SvelteKit db client singleton pattern

Load when: scaffolding or reviewing where the Drizzle/Neon client lives in a SvelteKit app. Grounded in `raw/neon-drizzle--integration--sveltekit-vercel-guide.md`, `raw/neon-drizzle--integration--neon-drizzle-connect-guide.md`, and `references/connection-pattern-decision-matrix.md`.

## The rule

The database client is instantiated **once, in server-only code**, and imported everywhere it's needed. It never crosses into a `.svelte` file, never gets exported from a module that also ships to the client, and its connection string never leaves the server.

SvelteKit enforces this boundary structurally: any file ending in `.server.ts` (or living under a path SvelteKit treats as server-only) is stripped from the client bundle at build time. This stinger's convention is to put the db client in `src/lib/server/db/index.ts`, the `server` segment in the path is what makes the boundary explicit and enforced, not just a naming convention.

## Standard runtime client (Vercel Fluid compute, the default for this stack)

```typescript
// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';
import { env } from '$env/dynamic/private';
import { relations } from './relations';

// Module-scope singleton: created once per warm compute instance, reused across
// invocations. Fluid compute keeps the instance alive long enough for this reuse
// to be safe (see references/connection-pattern-decision-matrix.md, Step 2).
const pool = new Pool({ connectionString: env.DATABASE_URL });

// Tells Vercel's runtime to drain this pool's idle connections before the function
// instance is suspended, instead of leaking them.
attachDatabasePool(pool);

export const db = drizzle(pool, { relations });
```

## Edge-runtime variant (only for routes explicitly on the Edge runtime)

```typescript
// src/lib/server/db/edge.ts, import only from routes with `export const config = { runtime: 'edge' }`
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import { relations } from './relations';

// No module-scope Pool here: HTTP is stateless per-query, which is what makes it
// safe in a runtime that cannot guarantee warm reuse across invocations.
const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { relations });
```

## Migrations client (separate from the runtime client, direct connection)

```typescript
// drizzle.config.ts, never imports the app's runtime db client
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL!, // NOT DATABASE_URL, see migration-workflow-commands.md
  },
});
```

## Using it in a route

```typescript
// src/routes/posts/+page.server.ts
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';

export const load = async () => {
  const allPosts = await db.select().from(posts).limit(20);
  return { posts: allPosts };
};
```

```svelte
<!-- src/routes/posts/+page.svelte, never imports db, never sees a connection string -->
<script lang="ts">
  let { data } = $props();
</script>

{#each data.posts as post}
  <article>{post.title}</article>
{/each}
```

## Gotchas specific to this pattern

- **Don't create the pool inside the `load` function.** Creating it at module scope (top of `src/lib/server/db/index.ts`) is what makes reuse across warm invocations possible. Creating it per-request defeats the purpose of Fluid compute's pooling story and re-introduces the connection-churn problem the pattern exists to avoid.
- **Don't share the Edge-runtime client and the Fluid-runtime client.** They use different drivers (`neon-http` vs `node-postgres`) and different transport assumptions. Keep them as two separate modules and import the one that matches the route's runtime.
- **Never import `drizzle.config.ts` or anything that reads `DIRECT_URL` from application route code.** The direct connection is for tooling (migrations, `pg_dump`) only; giving the app runtime a direct connection string reintroduces the exact connection-exhaustion problem pooling solves.
