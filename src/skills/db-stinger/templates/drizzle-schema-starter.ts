/**
 * Drizzle Schema Starter — db-stinger template
 *
 * Opinionated starter for a Postgres schema using Drizzle ORM.
 * Replace `users` and `posts` with your own tables.
 *
 * Defaults baked in:
 * - `BIGINT GENERATED ALWAYS AS IDENTITY` for primary keys (modern; not BIGSERIAL).
 * - `TIMESTAMPTZ` for all timestamps.
 * - `text` (not `varchar(n)`) — add CHECK if length matters.
 * - `NUMERIC(p, s)` for money — never DOUBLE PRECISION.
 * - FK indexes explicit (Postgres does not auto-create them).
 *
 * Source: guides/01-schema-design.md, guides/07-orm-choice.md.
 */

import {
  pgTable,
  bigint,
  text,
  timestamp,
  jsonb,
  numeric,
  pgEnum,
  index,
  uniqueIndex,
  check,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ---------- Enums ----------
export const orderStatus = pgEnum('order_status', [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'refunded',
]);

// ---------- Users ----------
export const users = pgTable(
  'users',
  {
    id: bigint('id', { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    metadata: jsonb('metadata').$type<{ tenant?: string; flags?: string[] }>(),
  },
  (t) => ({
    // Unique active email — allows soft-deleted users to share an email
    emailActiveUnique: uniqueIndex('users_email_active_unique')
      .on(t.email)
      .where(sql`${t.deletedAt} IS NULL`),
    emailLowerIndex: index('users_email_lower_idx').on(sql`lower(${t.email})`),
  })
);

// ---------- Posts ----------
export const posts = pgTable(
  'posts',
  {
    id: bigint('id', { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    authorId: bigint('author_id', { mode: 'bigint' }).notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    // FK index — MUST-FIX rule: every FK gets an index
    authorIdIdx: index('posts_author_id_idx').on(t.authorId),
    authorFk: foreignKey({
      columns: [t.authorId],
      foreignColumns: [users.id],
      name: 'posts_author_id_fkey',
    }).onDelete('restrict'),
    // CHECK constraint — express invariants in the database
    titleNotEmpty: check('posts_title_not_empty', sql`length(${t.title}) > 0`),
  })
);

// ---------- Orders ----------
export const orders = pgTable(
  'orders',
  {
    id: bigint('id', { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'bigint' }).notNull(),
    status: orderStatus('status').notNull().default('pending'),
    // NUMERIC for money; never DOUBLE PRECISION
    totalCents: numeric('total_cents', { precision: 12, scale: 0 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index('orders_user_id_idx').on(t.userId),
    // Partial index for the "pending orders" hot query
    pendingByCreatedIdx: index('orders_pending_created_idx')
      .on(t.createdAt)
      .where(sql`${t.status} = 'pending'`),
    userFk: foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: 'orders_user_id_fkey',
    }).onDelete('restrict'),
    totalNonNegative: check('orders_total_non_negative', sql`${t.totalCents} >= 0`),
  })
);

/**
 * Trigger maintenance for `updated_at`:
 *
 * CREATE OR REPLACE FUNCTION trigger_set_updated_at() RETURNS trigger AS $$
 * BEGIN NEW.updated_at = now(); RETURN NEW; END;
 * $$ LANGUAGE plpgsql;
 *
 * CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
 * FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
 *
 * Apply per table; Drizzle does not yet manage triggers natively.
 */

/**
 * PII flags:
 *
 * COMMENT ON COLUMN users.email IS 'PII';
 *
 * These comments become discoverable via pg_description for `security-worker-bee` to audit.
 */
