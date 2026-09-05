# Drizzle ORM type inference: $inferSelect / $inferInsert, InferSelectModel / InferInsertModel

- URL: https://orm.drizzle.team/docs/goodies
- Fetched: 2026-08-14
- Source type: Official docs (orm.drizzle.team)
- Component: Drizzle Type API

## Content

### `$inferSelect` / `$inferInsert` on the table object

Drizzle's type helpers infer `select` and `insert` models directly from a table schema definition - one schema, two derived static types, no hand-written duplicate interfaces:

```ts
import { serial, text, pgTable } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;

// equivalent, function-style forms:
type SelectUserAlt = InferSelectModel<typeof users>;
type InsertUserAlt = InferInsertModel<typeof users>;
```

Both forms are current and documented side by side; `$inferSelect`/`$inferInsert` (property access on the table) is the terser modern idiom, `InferSelectModel`/`InferInsertModel` (standalone generics imported from `drizzle-orm`) are equivalent and useful when you need the type without a value-level table reference in scope.

### History: `InferModel` is deprecated

Per the Drizzle v0.28.3 release notes: `table.$inferSelect`/`table._.inferSelect` and `table.$inferInsert`/`table._.inferInsert` were added specifically "for more convenient table model type inference," and the older single `InferModel<TTable, 'select' | 'insert'>` type was deprecated in favor of the more explicit `InferSelectModel`/`InferInsertModel` pair (and by extension the `$infer*` property shortcuts). Any guidance or code sample using bare `InferModel` is out of date; prefer `$inferSelect`/`$inferInsert` or `InferSelectModel`/`InferInsertModel`.

### Other type-relevant goodies

- **`getColumns(table)`** returns a typed column map, useful for excluding fields from a selection while keeping the rest typed (e.g. destructure off `password`/`role` then spread the rest into a `.select({ ...rest })`).
- **`getTableConfig(table)`** inspects table metadata (columns, indexes, foreign keys, checks, primary keys, name, schema) - useful for generic/introspective tooling rather than everyday app code.
- **`is(value, Column)`** - use Drizzle's own `is()` helper instead of `instanceof` to check Drizzle object types; `is()` correctly narrows the TypeScript type in the branch.
- **`drizzle.mock({ relations })`** - produces a typed database object with no real database connection, for type-level testing/tooling without a live Postgres instance.
- **Standalone `QueryBuilder`** (`drizzle-orm/pg-core`) - lets you build and inspect a query's SQL/params via `.toSQL()` without ever constructing a live `db` instance, useful for unit-testing query-building logic in isolation from a database connection.
- **`sql` template tag** for raw parametrized queries via `db.execute(sql\`...\`)` when the query builder or relational API doesn't cover a shape - still goes through the driver's parameterization, not string interpolation.

### `.$type<T>()` for column-level type overrides

Referenced in the `getColumns` example: a column can be given an application-level literal-union type via `.$type<"admin" | "customer">()` (seen on a `role: text().$type<"admin" | "customer">()` column) - this narrows the TypeScript type of that column beyond what the underlying SQL column type (`text`) would otherwise produce, without changing the runtime SQL type. Useful for enum-like columns stored as `text`/`varchar` where a real SQL enum isn't in play.
