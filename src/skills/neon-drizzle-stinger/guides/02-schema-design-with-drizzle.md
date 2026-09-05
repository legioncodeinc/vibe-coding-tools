# 02 - Schema design with Drizzle

## The schema is the single source of truth

Drizzle's schema (one `schema.ts` file, or a folder of schema files pointed at by `drizzle.config.ts`) feeds both the query builder (drizzle-orm) and the migration generator (drizzle-kit) [raw/neon-drizzle--drizzle--schema-declaration.md]. There is no dialect-agnostic table builder, import from `drizzle-orm/pg-core` for Postgres specifically [raw/neon-drizzle--drizzle--schema-declaration.md].

## Identity columns

Current Drizzle docs use `.primaryKey().generatedAlwaysAsIdentity()` in worked examples, not `serial` [raw/neon-drizzle--drizzle--schema-declaration.md]. Prefer this modern identity-column form for new tables. See `references/schema-example.ts` for a full worked table set using this convention.

## Postgres schemas

Use `pgSchema('name')` from `drizzle-orm/pg-core` to declare a Postgres schema and place tables inside it: `customSchema.table('users', {...})` [raw/neon-drizzle--drizzle--schema-declaration.md]. Most apps in this stack stay in `public`; reach for a named schema only when isolating a subsystem (e.g. a background-job queue) at the database level.

## camelCase vs snake_case

Drizzle provides `snakeCase`/`camelCase` table builders from `drizzle-orm/pg-core` so TypeScript-side `camelCase` keys map automatically to database-side `snake_case` columns, instead of hand-writing an alias per column [raw/neon-drizzle--drizzle--schema-declaration.md]. Adopt this at the start of a project, retrofitting it onto an existing schema means a full column-rename migration.

## Relations are not foreign keys

This is the single most important distinction in Drizzle's data model. `defineRelations()` declares how `db.query` should traverse and shape data at the **application** level. It does **not** create foreign-key constraints, and it does not require them to exist, relations and FKs are independent and can be used together or separately [raw/neon-drizzle--drizzle--relations.md].

**Convention for this stack**: declare both. The Postgres foreign key is the database-level integrity guarantee (referential integrity, cascade behavior); the Drizzle relation is what makes `db.query.users.findMany({ with: { posts: true } })` work. Skipping the FK because "the relation already expresses it" leaves the database unable to enforce integrity, see `references/schema-example.ts` for the paired pattern.

### One-to-one, one-to-many

```typescript
export const relations = defineRelations({ users, posts }, (r) => ({
  users: { posts: r.many.posts() },
  posts: { author: r.one.users({ from: r.posts.authorId, to: r.users.id, optional: false }) },
}));
```

`from`/`to` accept a single column or an array (composite keys); `optional: false` makes the relation required at the type level when you're certain the related row always exists [raw/neon-drizzle--drizzle--relations.md].

### Many-to-many needs an explicit junction table

Drizzle does not synthesize a hidden join table. Declare it, give it a composite primary key, and reference it in the relation via `.through()`:

```typescript
users: {
  groups: r.many.groups({
    from: r.users.id.through(r.usersToGroups.userId),
    to: r.groups.id.through(r.usersToGroups.groupId),
  }),
},
```
[raw/neon-drizzle--drizzle--relations.md]

### Disambiguating duplicate relations

When two relations exist between the same pair of tables (e.g. a `posts` table with both `author` and `reviewer` pointing at `users`), use `alias` on each relation to disambiguate which query field maps to which [raw/neon-drizzle--drizzle--relations.md].

## Indexing recommendations tied to relations

- **One-to-many**: index the foreign-key column on the "many" side (e.g. `posts.author_id`), without it, resolving "all posts by this user" is a sequential scan [raw/neon-drizzle--drizzle--relations.md].
- **Many-to-many**: index each FK column in the junction table individually, **and** add a composite index on `(colA, colB)`, the composite index is what Drizzle's relation resolution actually hits when looking up the exact junction row [raw/neon-drizzle--drizzle--relations.md].

## Type inference

Every column, relation, and query built through the schema is fully typed end to end, `db.select().from(posts)` and `db.query.posts.findMany({ with: { author: true } })` both infer their return shape from the schema and relations definitions, with no manual type annotations or codegen step. This is a structural property of the schema-as-source-of-truth design [raw/neon-drizzle--drizzle--schema-declaration.md, raw/neon-drizzle--drizzle--relations.md].

## Load next

- `references/schema-example.ts`, full worked schema (enums, audit columns, self-referencing FK, junction table)
- `guides/03-migrations-and-branching.md`, turning a schema change into a safe migration
- `guides/07-authorization-without-rls.md`, the optional `crudPolicy`/`enableRLS()` block referenced but not required in the schema example
