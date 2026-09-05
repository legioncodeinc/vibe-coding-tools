# 07: ORM Choice

Drizzle vs Prisma vs raw SQL. Workload-shaped, not religious.

Source: `research/2026-04-25-orm-comparison-drizzle-prisma.md`.

## The decision tree

Ask, in order:

1. **Edge / serverless runtime where bundle size matters?** → Drizzle or raw SQL. Prisma's generated client is heavy.
2. **Team is SQL-fluent?** → Drizzle (type-safe SQL builder) or raw SQL + Kysely.
3. **Team wants ergonomics over SQL fluency, large schema, many relations?** → Prisma.
4. **Schema is small (1-5 tables) or microservice-shaped?** → Raw SQL.
5. **Need full Postgres feature coverage** (advanced `jsonb` querying, `EXCLUDE`, range types, expression indexes, partial indexes)? → Drizzle or raw SQL. Prisma forces `$queryRaw` for many of these.
6. **Need the strongest migration tooling?** → Prisma (mature) or raw SQL + `pgroll` (most flexible for zero-downtime).

## Drizzle ORM

```ts
// schema.ts
import { pgTable, bigint, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  metadata: jsonb('metadata').$type<{ tenant?: string; flags?: string[] }>(),
});
```

```ts
// query
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

const u = await db.select().from(users).where(eq(users.email, 'a@b.com'));
```

**Strengths:**
- Type-safe SQL; types flow without codegen.
- Edge / serverless friendly; tiny bundle.
- Full Postgres feature coverage including `jsonb`, arrays, ranges, custom types.
- Migrations via `drizzle-kit`: generates SQL diffs.

**Weaknesses:**
- Smaller community than Prisma.
- Migration tooling younger; diff-based, not declarative-state.

**Wins when:** SQL-fluent team, edge runtime, full Postgres features, type safety without codegen.

## Prisma ORM

```prisma
// schema.prisma
model User {
  id        BigInt   @id @default(autoincrement())
  email     String   @unique
  createdAt DateTime @default(now())
  metadata  Json?
  posts     Post[]
}

model Post {
  id       BigInt @id @default(autoincrement())
  authorId BigInt
  author   User   @relation(fields: [authorId], references: [id])

  @@index([authorId])
}
```

```ts
const u = await prisma.user.findUnique({
  where: { email: 'a@b.com' },
  include: { posts: true },
});
```

**Strengths:**
- Industry-leading DX; generated client is autocomplete-perfect.
- Strong migration tooling: `prisma migrate dev` / `deploy` with shadow DB.
- Visual schema (Prisma Studio); ecosystem.
- Good for complex relational reads (`include` / `select`).

**Weaknesses:**
- Codegen step in build; client heavy in serverless.
- Postgres feature gaps: advanced `jsonb`, `EXCLUDE`, range types fall to `$queryRaw`.
- Connection pooling needs `pgbouncer=true` flag in connection string AND PgBouncer in transaction mode.
- Historical N+1 risks resolved in v5+ but still possible on large `include` graphs.

**Wins when:** team that wants ergonomics, large relational schema, willing to pay the client weight.

## Raw SQL (with `pg` / `postgres-js`, optionally Kysely)

```ts
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!);

const u = await sql`SELECT * FROM users WHERE email = ${'a@b.com'}`;
```

With Kysely for compile-time type safety:

```ts
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

interface Database { users: { id: string; email: string; created_at: Date } }
const db = new Kysely<Database>({ dialect: new PostgresDialect({ pool: new Pool({}) }) });

const u = await db.selectFrom('users').where('email', '=', 'a@b.com').selectAll().execute();
```

**Strengths:**
- Zero abstraction tax; full Postgres feature access.
- Easiest migration: SQL is SQL: pairs perfectly with `pgroll`.
- Tiny bundle; fastest cold start.
- Kysely adds compile-time type safety to raw SQL.

**Weaknesses:**
- Manual mapping; team must be SQL-fluent.
- No generated client; types are hand-written or inferred via Kysely.

**Wins when:** SQL-native team, small / focused schema, edge runtime, microservice with one or two tables.

## Decision table

| Concern | Drizzle | Prisma | Raw SQL / Kysely |
|---|---|---|---|
| Type safety | Inferred (excellent) | Generated (excellent) | Kysely: compile-time |
| Bundle size | Tiny | Heavy | Tiny |
| Edge / serverless cold start | Excellent | OK with care | Excellent |
| Postgres feature coverage | Full | Partial | Full |
| Migration tooling | `drizzle-kit` (good) | `prisma migrate` (mature) | Plain SQL + `pgroll` |
| N+1 ergonomics | Manual joins | `include` (footgun) | Manual joins |
| Team SQL fluency required | Medium | Low | High |

## N+1 patterns: flag and hand off

The most common N+1 in any ORM:

```ts
// Drizzle
const usersList = await db.select().from(users);
for (const u of usersList) {
  const posts = await db.select().from(posts).where(eq(posts.authorId, u.id));  // N+1!
}

// Prisma
const u = await prisma.user.findMany({ include: { posts: { include: { comments: true } } } });
// One query for users, one for posts, but comments may fan out per post.
```

**db-worker-bee's responsibility:** flag the risk in the schema/query layer with file:line, hand off to `react-worker-bee` for the data-layer remediation (RSC vs route loader vs TanStack Query batching vs `dataloader`-style coalesce).

The fix is always one of:
- (a) one bigger SQL with a join,
- (b) a batched IN-list pre-fetch,
- (c) a `dataloader`-style coalesce.

## Migration story per ORM

| ORM | Tool | Diff-based or declarative? | `pgroll` compatibility |
|---|---|---|---|
| Drizzle | `drizzle-kit` | Diff | Yes: emits raw SQL |
| Prisma | `prisma migrate` | Declarative + shadow DB | Partial: Prisma owns history |
| Raw SQL | hand-rolled SQL files | n/a | Yes: `pgroll` IS the migration tool |

For zero-downtime at scale, raw SQL + `pgroll` is the most flexible. Drizzle + `pgroll` works well. Prisma + `pgroll` requires extra coordination because Prisma wants to own the migration history.

## Output an ADR

Use `templates/ADR.md`. The ADR should:

- State the team's SQL fluency.
- State the runtime (edge / serverless / long-running).
- State expected schema size (tables, relations).
- State Postgres feature usage (jsonb depth, range types, `EXCLUDE`, partial indexes).
- State migration cadence and zero-downtime requirements.
- Recommend Drizzle / Prisma / raw SQL with reasoning.
- Capture trade-offs honestly; cite this guide.

## Cross-references

- `01-schema-design.md`: Postgres features that ORM choice affects.
- `03-migrations.md`: migration story per ORM.
- `templates/drizzle-schema-starter.ts`, `templates/prisma-schema-starter.prisma`.
- Hand off N+1 to `react-worker-bee`.
