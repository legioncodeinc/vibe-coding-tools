# 04 - Query patterns

## Core query builder: select/insert/update/delete

Drizzle's core query builder is a thin, near-zero-overhead TypeScript layer over SQL [raw/neon-drizzle--drizzle--query-patterns.md]. Standard shape:

```typescript
await db.select().from(posts).where(eq(posts.authorId, userId));
await db.insert(posts).values({ title, body, authorId: userId });
await db.update(posts).set({ published: true }).where(eq(posts.id, postId));
await db.delete(posts).where(eq(posts.id, postId));
```

## Relational queries (`db.query`)

The relational query API is an extension to the core builder, purpose-built for nested/complex data mappings without hand-writing joins. It requires passing both `tables` and `relations` to `drizzle()` at initialization [raw/neon-drizzle--drizzle--query-patterns.md]:

```typescript
const db = drizzle(sql, { relations });

const usersWithPosts = await db.query.users.findMany({
  with: { posts: { with: { comments: true } } },
});
```

`with` nests arbitrarily deep, following whatever relations were declared in `defineRelations()` (guide 02). Relation-scoped `where` filters and sub-selections are supported inline within each `with` level [raw/neon-drizzle--drizzle--query-patterns.md].

## Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.query.users.findMany({ with: { accounts: true } });
  await tx.insert(auditLog).values({ action: 'user_query' });
});
```

Transactions compose with both the core builder and relational queries, use `tx` in place of `db` for every statement that must commit or roll back together [raw/neon-drizzle--drizzle--query-patterns.md]. Dialect-specific isolation-level configuration exists but its exact API shape was not captured in this stinger's research archive, verify current Drizzle docs before relying on a specific isolation-level syntax in a worked example [raw/neon-drizzle--drizzle--query-patterns.md, flagged gap].

**Neon-specific transaction note**: transactions require session-level state across statements, so they only work over a **WebSocket** or **direct TCP** connection, the serverless driver's HTTP `neon()` path only supports a single non-interactive `sql.transaction()` batch, not an interactive `db.transaction()` callback with conditional logic between statements [raw/neon-drizzle--connections--serverless-driver.md]. If a route needs `db.transaction()` with branching logic inside it, it cannot run purely over the HTTP driver.

## Prepared statements

```typescript
const prepared = db.select().from(customers).where(eq(customers.id, sql.placeholder('id'))).prepare('getCustomer');

await prepared.execute({ id: 10 });
await prepared.execute({ id: 12 });
```

The SQL-string concatenation happens once, at `.prepare()` time; the driver then reuses the precompiled query plan on every `.execute()` instead of reparsing, this is where Drizzle's near-zero overhead becomes actually zero on hot-path queries [raw/neon-drizzle--drizzle--query-patterns.md]. Placeholders also work inside the relational query builder's `where`, `limit`, and `offset` [raw/neon-drizzle--drizzle--query-patterns.md].

**Neon pooling interaction**: protocol-level prepared statements (what `.prepare()`/`.execute()` produce) work fine over Neon's pooled connection. **SQL-level** `PREPARE`/`DEALLOCATE` statements do not, PgBouncer's transaction mode doesn't support them [raw/neon-drizzle--connections--pooling.md]. Drizzle's `.prepare()` API uses protocol-level prepared statements, so it is safe to use over a pooled connection; hand-written raw `PREPARE ... AS ...` SQL is not.

## Type inference

Every query, core builder or relational, infers its return type from the schema/relations, with no manual annotation or generated-client step required. This is a direct consequence of the schema-as-source-of-truth design covered in guide 02 [raw/neon-drizzle--drizzle--schema-declaration.md, raw/neon-drizzle--drizzle--relations.md].

## Load next

- `guides/02-schema-design-with-drizzle.md`, relations these query patterns depend on
- `guides/01-connection-and-drivers.md`, which transport supports interactive transactions
- `references/schema-example.ts`, the schema this guide's examples query against
