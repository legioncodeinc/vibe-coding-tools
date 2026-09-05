# Connect from Drizzle to Neon - Neon Docs

- URL: https://neon.com/docs/guides/drizzle
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon + Drizzle integration (driver selection, drizzle.config.ts, client init, branch-per-environment)

## Summary (as stated on the page)

Drizzle ORM connection guide for Lakebase Postgres walks through initializing a TypeScript/Node.js project with supported drivers: Neon serverless HTTP, Neon WebSocket, node-postgres, and postgres.js. The guide also shows how to point Drizzle at different Neon branches per environment by selecting a connection string based on `NODE_ENV`.

## Pooled vs direct for migrations (explicit warning)

> Neon supports both direct and pooled connection strings, found via the **Connect** button on the Project Dashboard. A pooled connection string (hostname includes `-pooler`) routes through a PgBouncer connection pool, ideal for your application at runtime. **However, using a pooled connection string for migrations can lead to errors. Use a direct (non-pooled) connection when running Drizzle Kit migrations.**

## Install Drizzle and a driver

**Neon Serverless (HTTP)**, for serverless environments (Vercel, Netlify):

```bash
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit
```

**Neon WebSocket**, for long-running applications needing a persistent connection (standard Node.js server):

```bash
npm install drizzle-orm @neondatabase/serverless ws dotenv
npm install -D drizzle-kit @types/ws
```

## `drizzle.config.ts`

```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

## Initialize the Drizzle client

**Neon Serverless (HTTP)**:

```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**Neon WebSocket**:

```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// For Node.js environments older than v22, provide a WebSocket constructor
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
```

## Using Neon branches with Drizzle (per-environment connection strings)

The guide demonstrates pointing Drizzle at different Neon branches per environment by selecting the connection string based on `NODE_ENV` (or any other environment variable), i.e. `DATABASE_URL_DEV`, `DATABASE_URL_STAGING`, `DATABASE_URL_PROD` style variables resolved at startup, so the same application code and Drizzle client construction logic runs against an isolated Neon branch per environment without code changes.
