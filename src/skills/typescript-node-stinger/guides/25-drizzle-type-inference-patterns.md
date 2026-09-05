# 25 - Drizzle ORM type inference patterns

**Primary context: SvelteKit app on Vercel with Neon Postgres.** This guide covers the TypeScript patterns AROUND Drizzle - how its inference model plays with the rest of the app's type discipline. Drizzle's own schema design, migrations, connection pooling, and SvelteKit/Vercel wiring belong to [neon-drizzle-stinger](../../neon-drizzle-stinger/) - hand off there for anything beyond the inference mechanics below. Do not duplicate that skill's schema/migration guidance here.

## `$inferSelect` / `$inferInsert`: one schema, two derived types

Drizzle derives static TS types directly from a table's schema definition - never hand-write a parallel `interface User { ... }` next to a Drizzle table:

```ts
import { serial, text, pgTable } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
```

The equivalent generic forms `InferSelectModel<typeof users>` / `InferInsertModel<typeof users>` (imported from `drizzle-orm`) are current and interchangeable with the `$infer*` property shortcuts - use whichever reads better in context; both are correct, neither is deprecated.

**`InferModel` (the older single generic, deprecated since Drizzle v0.28.3) is stale.** If you see `InferModel<typeof table, 'select'>` in a PR or in older code, that's a **should-refactor** - migrate to `$inferSelect`/`$inferInsert` or the explicit `InferSelectModel`/`InferInsertModel` pair.

A hand-written type that duplicates a table's shape instead of using `$inferSelect`/`$inferInsert` is a **must-fix** - it's the Drizzle-specific instance of this skill's general "no duplicate source of truth for a data shape" principle (the same reasoning behind the Hivemind case's single-sourced Deep Lake schema, `guides/15-deeplake-schema-healing.md`).

## The relational query builder's callback-parameter rule (a real correctness gotcha)

Nested `db.query.<table>.findMany({ with: {...} })` queries infer their fully nested result type automatically - no manual annotation needed even several levels deep. But inside `where`, `orderBy`, `RAW`, and `extras` callbacks, **column references must go through the callback-provided aliased table, not the directly-imported table object**:

```ts
// WRONG - breaks in nested/self-referential queries, may still typecheck
await db.query.posts.findMany({
  orderBy: sql`${posts.id} asc`,
  with: { comments: { orderBy: sql`${comments.id} desc` } },
});

// CORRECT - the callback exposes the aliased table for the current query scope
await db.query.posts.findMany({
  orderBy: (t) => sql`${t.id} asc`,
  with: { comments: { orderBy: (t, { desc }) => desc(t.id) } },
});
```

This is not a style preference - using the imported table directly works for simple top-level queries and silently produces wrong SQL (or wrong results) the moment the query nests or self-joins. A relational query using the imported table object inside a `where`/`orderBy`/`extras` callback instead of the callback's own table parameter is a **must-fix**, not a should-refactor, precisely because TypeScript will not catch it - both forms typecheck.

## Typed partial selection

`columns: { field: true | false }` works at any nesting depth, including inside `with`. An empty `columns: {}` combined with `with` selects only the nested relation's fields and drops the parent row's own columns from the inferred result type entirely - a query written this way that still expects top-level fields in its result is a **must-fix** (the type will already show the mismatch; don't cast around it with `as`).

## `.$type<T>()` for enum-like columns

`.$type<"admin" | "customer">()` narrows a column's application-level TS type (e.g. a `text` column standing in for an enum) without changing the underlying SQL column type. Prefer this over a bare `text()` column left untyped at the application layer when the column's actual values are a closed set - an untyped `text` column carrying an implicit enum, discovered only by reading application logic elsewhere, is a **should-refactor**.

## `extras` cannot aggregate

Drizzle's relational-query `extras` (custom computed fields via a `sql` callback) explicitly does not support aggregation - use the core query builder's `.groupBy()`/aggregate functions for that instead. Code attempting a `COUNT`/`SUM`/`AVG` inside `extras` is a **must-fix**; route it through the core query builder.

## Where this guide stops and neon-drizzle-stinger starts

This guide covers: `$inferSelect`/`$inferInsert` usage, the relational-query callback rule, typed partial selection, and `.$type<T>()`. It does NOT cover: schema design (table shape, relations definition, index strategy), Drizzle Kit migrations (`generate`/`migrate`/`push`), connection pooling/driver choice on Neon, or RLS/authorization design. Hand those off to `neon-drizzle-stinger` explicitly rather than improvising an answer here - see its `guides/02-schema-design-with-drizzle.md`, `guides/03-migrations-and-branching.md`, and `guides/07-authorization-without-rls.md`.

## Common findings

- A hand-written interface duplicating a Drizzle table's shape instead of `$inferSelect`/`$inferInsert` - **must-fix**.
- `InferModel<...>` (deprecated generic) in new code - **should-refactor**.
- Direct table-object column references inside a relational query's `where`/`orderBy`/`extras` callback instead of the callback's own table parameter - **must-fix**.
- An untyped `text`/`varchar` column carrying an implicit enum, with no `.$type<T>()` - **should-refactor**.
- Aggregation attempted inside `extras` instead of the core query builder - **must-fix**.
- Schema design, migration, or RLS questions answered here instead of handed to `neon-drizzle-stinger` - process finding, not a code finding; redirect the invocation.

## Sources

- `references/research/raw/drizzle--type-inference--infer-select-insert-goodies.md`
- `references/research/raw/drizzle--relational-query-builder--db-query-types.md`
- `references/research/distilled-typescript-node.md` section 3
- [neon-drizzle-stinger](../../neon-drizzle-stinger/) for everything this guide explicitly does not cover
