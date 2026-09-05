# Drizzle relational query builder (db.query): type inference for nested relations

- URL: https://orm.drizzle.team/docs/rqb
- Fetched: 2026-08-14
- Source type: Official docs (orm.drizzle.team)
- Component: Relational Query Builder (`db.query`)

## Content

### What it is and how types flow

The relational query builder (`db.query.<table>.findMany()` / `.findFirst()`) is an opt-in extension on top of Drizzle's core query builder, built for nested relational reads (avoiding hand-written joins + manual result-shape mapping). It requires passing `relations` (built with `defineRelations(schema, (r) => ({...}))`) into `drizzle()` at initialization:

```ts
import { relations } from './relations';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle(process.env.DATABASE_URL, { relations });

const result = await db.query.users.findMany({
  with: { posts: true },
});
```

The result type is inferred automatically from the schema + relations definitions - a nested `with: { posts: { with: { comments: true } } }` produces a fully nested result type (`{ id, name, posts: { id, content, comments: {...}[] }[] }[]`) with no manual type annotation required. The docs state plainly: "For any nested `with` queries Drizzle will infer types using Core Type API" - i.e. the same `$inferSelect`-based inference from `docs/goodies` underlies the nested relational result types too.

### The callback-parameter rule (important correctness gotcha, not just a style note)

Inside relational queries, references to a table's columns in `where`, `orderBy`, `RAW`, `extras`, and subqueries inside `extras` **must** go through the callback parameter the query API provides, not the directly-imported table object:

```ts
// ❌ WRONG - direct table usage breaks in nested/self-referential queries
await db.query.posts.findMany({
  orderBy: sql`${posts.id} asc`,
  with: { comments: { orderBy: sql`${comments.id} desc` } },
});

// ✅ CORRECT - callback exposes the aliased table for the current query scope
await db.query.posts.findMany({
  orderBy: (t) => sql`${t.id} asc`,
  with: { comments: { orderBy: (t, { desc }) => desc(t.id) } },
});
```

The documented reason: the callback exposes the **aliased** table for the current query scope, which nested/self-referential relational queries require for correct SQL generation. Using the raw imported table object works for simple top-level queries but silently produces wrong SQL (or wrong results) once nesting or self-joins are involved - this is exactly the kind of thing worth flagging in a TypeScript/Node code review of Drizzle relational-query code even though it won't be caught by `tsc` alone.

### Partial selects (typed field subsetting)

`columns: { field: true | false }` typed subsetting works both at the top level and inside nested `with` relations. When both `true` and `false` entries are present in the same `columns` object, `false` entries are redundant/ignored (`true` entries define the full set). An empty `columns: {}` combined with `with` selects **only** the nested relation's fields, dropping the parent table's own columns from the result type entirely - the inferred result type reflects this (e.g. `{ posts: { id, text }[] }[]` with no top-level `name`/`id`).

### Filter operator typing (`where`)

The relational `where` API is object-shaped rather than the core query builder's `eq()`/`and()`/`or()` function calls, though the function-style operators remain available via a destructured callback:

```
where: {
  OR: [], AND: [], NOT: {},
  RAW: (table) => sql`${table.id} = 1`,
  [relation]: {},   // filter by an included relation
  [column]: { eq: 1, ne: 1, gt: 1, gte: 1, lt: 1, lte: 1, in: [1], notIn: [1],
              like: "", ilike: "", notLike: "", notIlike: "",
              isNull: true, isNotNull: true,
              arrayOverlaps: [1,2], arrayContained: [1,2], arrayContains: [1,2] },
}
```

Filtering by a relation's own columns is supported directly (`where: { posts: { content: { like: 'M%' } } }` filters `users` by a condition on their related `posts`), and `where: { posts: true }` (boolean) filters to only rows that have at least one related row, without pulling relation data unless also requested via `with`.

### Custom fields (`extras`) and subqueries

`extras` lets a query add computed/aggregated columns via a callback exposing `sql` - e.g. `extras: { fullName: (users, { sql }) => sql<string>\`concat(${users.name}, ' ', ${users.name})\` }`. Subqueries are supported the same way, e.g. `totalPostsCount: (table) => db.$count(posts, eq(posts.authorId, table.id))`. Note (explicitly called out): **aggregations are not currently supported inside `extras`**; use the core query builder's `.groupBy()`/aggregate functions for those instead of trying to force them through the relational API.

### Prepared statements with the relational API

`db.query.<table>.findMany({...}).prepare("query_name")` supports `sql.placeholder("name")` inside `where`, `limit`, and `offset` (including inside nested `with` clauses), and multiple placeholders can compose across a single prepared query. Prepared statements are the documented mechanism for "massively improving query performance" on repeated queries with only their parameter values changing.
