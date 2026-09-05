# Schema - Drizzle ORM

- URL: https://orm.drizzle.team/docs/sql-schema-declaration
- Fetched: 2026-08-14
- Source type: Official docs (Drizzle Team)
- Component: Drizzle ORM schema definition

## Overview

Drizzle lets you define a schema in TypeScript with the models and properties supported by the underlying database. The schema serves as the single source of truth for both queries (Drizzle ORM) and migrations (Drizzle Kit).

## Organizing schema files

- **Single file**: the most common approach, put all tables into one `schema.ts` file. In `drizzle.config.ts`, set `schema` to the path of that file; Drizzle Kit reads it for migration generation.
- **Multiple files**: Drizzle models (tables, enums, sequences, etc.) can live in any file, as long as every model is exported so Drizzle Kit can import them. In `drizzle.config.ts`, point `schema` at the containing folder; Drizzle Kit recursively finds all files and gathers the Drizzle tables/models from there.

## What a schema can declare

- Tables with columns, constraints, etc.
- Schemas (Postgres `pgSchema`)
- Enums
- Sequences
- Views
- Materialized Views

## Tables and columns

A table needs at least one column, same as in the database. There is no dialect-agnostic "common table" object, you must import from the dialect-specific module, e.g. `drizzle-orm/pg-core` for Postgres.

By default Drizzle uses the TypeScript key names for columns unless an explicit DB column name is given.

### Camel/snake casing

Database conventions often use `snake_case` while TypeScript uses `camelCase`, which can produce many manual alias definitions. Drizzle provides `snakeCase`/`camelCase` builders from `drizzle-orm/pg-core` to declare a table whose column keys automatically map to the chosen DB naming convention.

### Postgres schemas (`pgSchema`)

```typescript
import { pgSchema, integer } from "drizzle-orm/pg-core";

export const customSchema = pgSchema('custom');

export const users = customSchema.table('users', {
  id: integer()
});
```

### Worked table example (from the docs)

```typescript
export const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: t.varchar("first_name", { length: 256 }),
    lastName: t.varchar("last_name", { length: 256 }),
    email: t.varchar().notNull(),
    invitee: t.integer().references((): AnyPgColumn => users.id),
    role: t.text().$type<'guest' | 'user' | 'admin'>().default('guest'),
  },
  (table) => [
    t.uniqueIndex("email_idx").on(table.email),
  ]
);

export const posts = table(
  "posts",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: t.varchar().$default(() => generateUniqueString(16)),
    title: t.varchar({ length: 256 }),
    ownerId: t.integer("owner_id").references(() => users.id),
  },
  (table) => [
    t.uniqueIndex("slug_idx").on(table.slug),
    t.index("title_idx").on(table.title),
  ]
);

export const comments = table("comments", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  text: t.varchar({ length: 256 }),
  postId: t.integer("post_id").references(() => posts.id),
  ownerId: t.integer("owner_id").references(() => users.id),
});
```

Note: `generatedAlwaysAsIdentity()` (modern identity column) is used in place of `serial` in the current docs' worked examples; foreign keys are declared inline via `.references(() => otherTable.column)`; composite/table-level constructs (unique indexes, plain indexes) are returned from a callback as an array of builder calls, the modern Drizzle table-config shape.
