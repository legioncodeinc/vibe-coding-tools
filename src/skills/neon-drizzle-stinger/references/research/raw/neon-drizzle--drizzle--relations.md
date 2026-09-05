# Drizzle relations (and Relational Queries v1 → v2) - Drizzle ORM

- URL: https://orm.drizzle.team/docs/relations; supplementary from https://orm.drizzle.team/docs/relations-v1-v2
- Fetched: 2026-08-14
- Source type: Official docs (Drizzle Team)
- Component: Drizzle ORM relations

## Purpose

The sole purpose of Drizzle relations is to let you query relational data simply and concisely via the relational query API (`db.query`). Relations are defined with `defineRelations()` (current, v2 API) in one dedicated file, distinct from the physical foreign-key constraints in the schema.

## Current API: `defineRelations` (v2)

```typescript
// relations.ts
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    invitee: r.one.users({
      from: r.users.invitedBy,
      to: r.users.id,
    }),
    posts: r.many.posts(),
  },
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
    }),
  },
}));
```

```typescript
// index.ts
import { relations } from "./relations";
import { drizzle } from "drizzle-orm/...";

const db = drizzle(process.env.DATABASE_URL, { relations });
```

- `r.one.<table>({...})`: defines a single related object (not an array). Fields: `from` (source column(s)), `to` (target column(s)), `optional` (boolean, `optional: false` makes the relation required at the type level), `alias` (disambiguates multiple relations between the same two tables), `where` (SQL condition for polymorphic/filtered relations).
- `r.many.<table>({...})`: defines an array of related objects. Same field set as `.one()`.
- `from`/`to` accept a single column or an array (composite keys), replacing v1's `fields`/`references` naming.
- `relationName` (v1) is renamed `alias` (v2).

### One-to-one, one-to-many, many-to-many

Many-to-many relations require an explicit **junction table** (associative/bridging table) storing the association. Example:

```typescript
export const usersToGroups = p.pgTable(
  "users_to_groups",
  {
    userId: p.integer("user_id").notNull().references(() => users.id),
    groupId: p.integer("group_id").notNull().references(() => groups.id),
  },
  (t) => [p.primaryKey({ columns: [t.userId, t.groupId] })]
);

export const relations = defineRelations(schema, (r) => ({
  users: {
    groups: r.many.groups({
      from: r.users.id.through(r.usersToGroups.userId),
      to: r.groups.id.through(r.usersToGroups.groupId),
    }),
  },
  groups: {
    participants: r.many.users(),
  },
}));
```

The `.through()` helper expresses that the relation is mediated by a junction table.

### Predefined filters (polymorphic relations)

`where` on a relation lets you connect tables not just by column but by a custom filter condition, e.g. only fetching `verified: true` users through a junction table.

### Splitting relations across files: `defineRelationsPart`

```typescript
import { defineRelations, defineRelationsPart } from 'drizzle-orm';
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    invitee: r.one.users({ from: r.users.invitedBy, to: r.users.id }),
    posts: r.many.posts(),
  }
}));

export const part = defineRelationsPart(schema, (r) => ({
  posts: {
    author: r.one.users({ from: r.posts.authorId, to: r.users.id }),
  }
}));
```

Rule: keep enough relations in the base `defineRelations` call for Drizzle to infer all tables for autocomplete; if you want an "empty" base, one part must still be non-empty to seed inference.

## Foreign keys vs `relations`: not the same thing

Foreign keys are a **database-level constraint**, checked on every insert/update/delete, throwing an error on violation. `relations` are a **higher-level, application-level abstraction** used only for query construction; they do **not** affect the database schema and do **not** implicitly create foreign keys. The two can be used together or independently, `relations` work even with databases/tables that don't support FKs.

## Indexing recommendations for relations

- **One-to-many**: index the foreign-key column on the "many" side (e.g. `authorId` on `posts`) so the DB can quickly retrieve all rows for a given parent without a full scan.
- **Many-to-many**: index individual FK columns in the junction table (`userId`, `groupId`) for single-direction lookups, plus a **composite index on `(userId, groupId)`** for fast lookup of the exact junction row Drizzle resolves the many-to-many relation through.

## Disambiguating relations

Use `alias` when defining multiple relations between the same two tables (e.g. a `posts` table with both `author` and `reviewer` relations to `users`) so Drizzle knows which relation object maps to which query field.

## Migration note (v1 → v2)

`drizzle-kit pull` in the current version can generate a `relations.ts` file in the new v2 syntax directly from an introspected database, as one path to migrate. The v1 API (`relations()` called per-table, passed into `drizzle()` via a `schema` object) still appears in older code and third-party examples; the v2 `defineRelations` single-file API is the current documented standard.
