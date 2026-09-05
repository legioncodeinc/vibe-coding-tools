# The Complete Supabase to Neon Database & Auth Migration Guide - Neon Guides

- URL: https://neon.com/guides/complete-supabase-migration; supplementary from https://neon.com/docs/import/migrate-from-supabase and https://neon.com/docs/guides/logical-replication-supabase-to-neon
- Fetched: 2026-08-14
- Source type: Official docs / guide (Neon)
- Component: Migration from Supabase to Neon (schema/data transfer, auth replacement, RLS translation, gotchas)

## Scope

A comprehensive guide to migrating a Postgres database, user accounts, and Row-Level Security (RLS) policies from Supabase to Neon. It explicitly addresses the reassignment of `user_id` values during auth migration and how to remap IDs, restore data integrity, and update application code.

## Part 1: schema/data transfer

### Basic path: `pg_dump` / `pg_restore` (from `migrate-from-supabase`)

```bash
pg_dump -Fc -v -d postgresql://[user]:[password]@[supabase_host]:[port]/[database] --schema=public -f supabase_dump.bak
```

- `-Fc`: custom (compressed) format suitable for `pg_restore`.
- `--schema=public`: dump only the `public` schema by default. Supabase also stores data under other schemas (`auth`, `storage`, etc.), add `--schema` multiple times to include them if needed.
- **Avoid a pooled connection string for `pg_dump`**, use the unpooled/direct connection string.

```bash
pg_restore -d <neon-connection-string> -v --no-owner --no-acl supabase_dump.bak
```

- `--no-owner` / `--no-acl`: **required** because Supabase ties object ownership and ACLs to its own auth system; skip restoring those and reconfigure roles/privileges manually afterward.
- Verify by running the same queries against both databases and comparing row counts / spot data.

### Near-zero-downtime path: logical replication (from `logical-replication-supabase-to-neon`)

- Requires a **direct IPv4 connection string** from Supabase (the Supabase IPv4 add-on, which may incur extra cost), pooled/transaction-mode connection strings do not support logical replication.
- Neon's NAT Gateway IP addresses must be allow-listed in Supabase's network restrictions.
- Supabase enables `wal_level=logical` by default.
- Steps: create a `PUBLICATION` on Supabase for the tables to replicate → create matching destination tables in Neon (matching names/columns; `pg_dump`/`pg_restore` schema-only can do this) → create a `SUBSCRIPTION` on Neon pointing at Supabase's direct connection string and publication name → cut the application over once replication catches up.
- **Gotcha**: Supabase's `max_replication_slots`/`max_wal_senders` are capped by instance size/plan, large datasets or multiple replication slots may require a Supabase instance upgrade before this will work.

## Part 2: auth replacement

Step-by-step (as documented for a Next.js example app, generalizable to any framework including SvelteKit):

1. **Migrate user accounts** from Supabase Auth to Neon's Managed Better Auth (Neon's first-party auth integration with the Data API), export users to a CSV, import via a Node.js script into Managed Better Auth.
2. **Critical gotcha, user IDs change**: importing users into Managed Better Auth assigns **new, unique `user_id` values** to every user. All foreign-key references in the migrated schema (any `user_id` column) now point at stale IDs and must be remapped.
3. **Export the Supabase `public` schema** with `pg_dump`.
4. **Pre-process the SQL dump manually** before importing to Neon:
   - Replace every instance of Supabase's `auth.uid()` with Neon's `auth.user_id()` (different function name, same purpose, current-user extraction from JWT for RLS policies).
   - **Temporarily remove foreign key constraints** that reference `auth.users`, since Neon has no `auth.users` table, these constraints will otherwise fail on import.
5. **Import the modified dump into Neon** via `psql`.
6. **Create a `user_id` mapping table**: dump the original Supabase `auth.users` data, retarget the `INSERT` statements at a temporary `public.temp_users` table in Neon, mapping old Supabase `user_id` to email address.
7. **Update foreign keys**: for every table containing a `user_id` column, run a script that replaces old (Supabase) IDs with new (Managed Better Auth) IDs by joining through the user's email address. Drop the temporary mapping table once complete.

This guide's explicit note: this specific ID-remap challenge (and this is a stack-specific detail worth flagging for a team using **WorkOS** rather than Neon's own Managed Better Auth) exists because switching **any** auth provider away from Supabase Auth reassigns user identifiers, the remap-by-email pattern generalizes regardless of which auth provider replaces Supabase Auth.

## Part 3: RLS translation

- **Role name changes**: Supabase's anonymous role is `anon`; Neon's equivalent is `anonymous`. Any RLS policy referencing `anon` must be rewritten to reference `anonymous`.
- **Function name changes**: `auth.uid()` (Supabase) → `auth.user_id()` (Neon), as noted above, every RLS policy `USING`/`WITH CHECK` clause referencing `auth.uid()` needs this rewrite.
- To reproduce granular Supabase permissions, extract current `GRANT`s from Supabase first, then re-apply the equivalent `GRANT`s to the corresponding Neon role (there is no automatic 1:1 permission migration).

## Part 4: application code migration (storage and realtime implications)

The guide walks a Next.js example refactor: replacing `@supabase/ssr`/`@supabase/supabase-js` (auth) with the auth provider's SDK, and replacing `supabase.from(...)` data access with a `postgrest-js` client pointed at the Neon Data API (which is PostgREST-compliant, query syntax like `.select()`, `.insert()`, `.eq()` stays nearly identical, only client initialization and JWT-based auth differ).

**Explicit gotcha for teams evaluating this migration**: this guide covers **database, auth, and RLS**. It does **not** cover a built-in replacement for **Supabase Storage** or **Supabase Realtime**, those are separate Supabase products with no direct Neon equivalent documented in this guide; a team leaving Supabase needs a separate object-storage service (e.g. S3/R2/Vercel Blob) and a separate realtime/pub-sub mechanism (e.g. a WebSocket service, Postgres `LISTEN`/`NOTIFY` over a direct connection, or a third-party realtime provider), Neon's Data API/RLS/auth migration path only replaces the Postgres + Auth portion of a Supabase stack.
