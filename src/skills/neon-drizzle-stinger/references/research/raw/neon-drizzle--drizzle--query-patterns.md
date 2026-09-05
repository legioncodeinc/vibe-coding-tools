# Query (Relational Queries v2) / Transactions / Query performance - Drizzle ORM

- URL: https://orm.drizzle.team/docs/rqb-v2 (primary); supplementary from https://orm.drizzle.team/docs/transactions and https://orm.drizzle.team/docs/perf-queries
- Fetched: 2026-08-14
- Source type: Official docs (Drizzle Team)
- Component: Drizzle query patterns (select/insert/update, relational queries, transactions, prepared statements)

## Relational queries (`db.query`)

Relational queries are an extension to Drizzle's original SQL-like query builder, meant to provide an ergonomic API for complex, nested data mappings without hand-writing joins. You must provide all `tables` and `relations` from your schema file(s) at `drizzle()` initialization, then use the `db.query` API.

```typescript
// relations.ts
import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    invitee: r.one.users({ from: r.users.invitedBy, to: r.users.id }),
    groups: r.many.groups({
      from: r.users.id.through(r.usersToGroups.userId),
      to: r.groups.id.through(r.usersToGroups.groupId),
    }),
    posts: r.many.posts(),
  },
  groups: { users: r.many.users() },
  posts: {
    author: r.one.users({ from: r.posts.authorId, to: r.users.id }),
    comments: r.many.comments(),
  },
  comments: {
    post: r.one.posts({ from: r.comments.postId, to: r.posts.id }),
    author: r.one.users({ from: r.comments.creator, to: r.users.id }),
    likes: r.many.commentLikes(),
  },
}));
```

```typescript
// index.ts
import { relations } from './relations';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle(process.env.DATABASE_URL, { relations });
```

Relational queries support `with` (include related data, nested arbitrarily deep), relation-scoped filters, and sub-selections, the query builder resolves them into efficient SQL joins/lateral subqueries under the hood.

## Prepared statements (relational query builder)

Prepared statements let you define placeholders for values determined at execution time, dramatically improving query performance by reusing a precompiled query plan instead of reparsing SQL on every call.

```typescript
const prepared = db.query.users.findMany({
    where: { id: { eq: sql.placeholder("id") } },
    with: { posts: { where: { id: 1 } } },
}).prepare("query_name");

const usersWithPosts = await prepared.execute({ id: 1 });
```

Placeholders also work in `limit`, `offset`, and combined together (multiple placeholders in one prepared query), e.g.:

```typescript
const prepared = db.query.users.findMany({
    limit: sql.placeholder("uLimit"),
    offset: sql.placeholder("uOffset"),
    where: { OR: [{ id: { eq: sql.placeholder("id") } }, { id: 3 }] },
    with: { posts: { where: { id: { eq: sql.placeholder("pid") } }, limit: sql.placeholder("pLimit") } },
}).prepare("query_name");

const usersWithPosts = await prepared.execute({ pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 });
```

## Prepared statements (core query builder), query performance rationale

Drizzle is a thin TypeScript layer over SQL with near-zero overhead; prepared statements make that overhead effectively zero. Normally, running a query: (1) concatenates the query-builder configuration into a SQL string, (2) sends that string and params to the driver, (3) the driver compiles the SQL to a binary executable format and sends it to the database. **With prepared statements, the SQL-string concatenation happens once** on the Drizzle ORM side; the database driver then reuses the precompiled binary SQL instead of re-parsing on every call, a large performance win on large/repeated queries.

```typescript
const db = drizzle(...);

const prepared = db.select().from(customers).prepare("statement_name");

const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

Dynamic runtime values use `sql.placeholder(...)`:

```typescript
import { sql } from "drizzle-orm";

const p1 = db.select().from(customers).where(eq(customers.id, sql.placeholder('id'))).prepare("p1");
await p1.execute({ id: 10 }); // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }); // SELECT * FROM customers WHERE id = 12
```

## Transactions

A SQL transaction groups one or more statements that commit as a single logical unit or roll back as one. Drizzle provides `db.transaction(async (tx) => { ... })`, and transactions compose with relational queries:

```typescript
const db = drizzle({ schema });

await db.transaction(async (tx) => {
  await tx.query.users.findMany({ with: { accounts: true } });
});
```

Dialect-specific transaction configuration APIs are available (e.g. isolation level), noted on the page as a further-reading pointer, not fully detailed in the fetched excerpt.
