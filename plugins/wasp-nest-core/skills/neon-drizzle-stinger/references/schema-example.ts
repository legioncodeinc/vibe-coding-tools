// Worked Drizzle schema example for Neon Postgres.
// Grounded in: raw/neon-drizzle--drizzle--schema-declaration.md, raw/neon-drizzle--drizzle--relations.md,
// raw/neon-drizzle--authorization--rls-data-api.md (crudPolicy/enableRLS block is optional, only needed if the
// app also uses the Neon Data API for client-side queries; a server-only SvelteKit app can omit it).
//
// Load this when: scaffolding a new table set, or checking the shape of identity columns,
// enums, indexes, relations, and audit columns this stinger expects.

import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
  uniqueIndex,
  index,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';
// Only import these if the app exposes tables through the Neon Data API and needs RLS
// declared alongside the schema. See references/supabase-to-neon-translation-table.md and
// guides/07-authorization-without-rls.md for when this is (and is not) the right call.
// import { crudPolicy, authenticatedRole, anonymousRole, authUid } from 'drizzle-orm/neon';

// ---------------------------------------------------------------------------
// Enums (closed sets belong in Postgres enums, not free-text columns)
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['guest', 'user', 'admin']);

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------

export const users = pgTable(
  'users',
  {
    // Identity: modern Drizzle worked examples use generatedAlwaysAsIdentity(), not serial.
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // WorkOS-issued user id. Text, not integer, auth providers issue string ids.
    workosUserId: text('workos_user_id').notNull().unique(),
    email: text().notNull(),
    role: userRoleEnum().notNull().default('user'),
    // Self-referencing FK: who invited this user. AnyPgColumn breaks the circular type reference.
    invitedBy: integer('invited_by').references((): AnyPgColumn => users.id),
    // Audit columns: every table in this stinger's convention carries these.
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('users_email_idx').on(table.email),
    // Uncomment if the Neon Data API queries this table directly from the client:
    // crudPolicy({ role: authenticatedRole, read: authUid(table.id), modify: authUid(table.id) }),
  ],
);

// ---------------------------------------------------------------------------
// posts (one-to-many: a user has many posts)
// ---------------------------------------------------------------------------

export const posts = pgTable(
  'posts',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    body: text().notNull(),
    published: boolean().notNull().default(false),
    // FK on the "many" side always gets an index (see guide 02 for why).
    authorId: integer('author_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('posts_author_id_idx').on(table.authorId),
  ],
);

// ---------------------------------------------------------------------------
// groups + usersToGroups (many-to-many via an explicit junction table)
// ---------------------------------------------------------------------------

export const groups = pgTable('groups', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    groupId: integer('group_id').notNull().references(() => groups.id),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.groupId] }),
    // Composite index for the junction table, in addition to the individual FK indexes
    // Drizzle's own docs recommend for relation resolution performance.
    index('users_to_groups_user_group_idx').on(table.userId, table.groupId),
  ],
);

// ---------------------------------------------------------------------------
// Relations (application-level query shape only, does NOT create foreign keys)
// ---------------------------------------------------------------------------

export const relations = defineRelations(
  { users, posts, groups, usersToGroups },
  (r) => ({
    users: {
      invitee: r.one.users({
        from: r.users.invitedBy,
        to: r.users.id,
      }),
      posts: r.many.posts(),
      groups: r.many.groups({
        from: r.users.id.through(r.usersToGroups.userId),
        to: r.groups.id.through(r.usersToGroups.groupId),
      }),
    },
    posts: {
      author: r.one.users({
        from: r.posts.authorId,
        to: r.users.id,
        optional: false,
      }),
    },
    groups: {
      members: r.many.users(),
    },
  }),
);
