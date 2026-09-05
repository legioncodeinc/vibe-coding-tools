# Supabase → Neon translation table

Load when: planning or reviewing a Supabase-to-Neon migration, or translating a Supabase-flavored RLS policy / client call into its Neon/Drizzle equivalent. Grounded in `raw/neon-drizzle--migration--supabase-to-neon.md`, `raw/neon-drizzle--authorization--rls-data-api.md`, `raw/neon-drizzle--auth--workos-authkit-sveltekit.md`.

## Concept mapping

| Supabase concept | Neon/Drizzle equivalent (this stack) | Notes |
|---|---|---|
| `supabase.auth` (Supabase Auth) | WorkOS AuthKit (`@workos/authkit-sveltekit`) | Session/cookie/callback flow is entirely independent of the database; not a drop-in API match |
| `auth.uid()` (RLS function) | `auth.user_id()` | Different function name, same purpose (current user's id from JWT `sub` claim). Rewrite every policy, don't just alias |
| `anon` role | `anonymous` role | Rewrite every policy/grant referencing `anon` |
| `authenticated` role | `authenticated` role | Same name on both platforms |
| Supabase `auth.users` table | No equivalent table on Neon by default | Any FK referencing `auth.users` must be dropped before import and re-pointed at the app's own users table populated from the new auth provider |
| `supabase.from(...)` client calls | Drizzle query builder (server-side) or a PostgREST-compatible client against the Neon Data API (client-side, if used) | Neon's Data API is PostgREST-compliant, `.select()`/`.insert()`/`.eq()` syntax carries over almost unchanged if the app keeps a client-side data-access pattern |
| Supabase Storage | No Neon equivalent | Needs a separate object-storage service (S3, Cloudflare R2, Vercel Blob) |
| Supabase Realtime | No Neon equivalent | Needs a separate mechanism: a WebSocket service, Postgres `LISTEN`/`NOTIFY` over a direct connection, or a third-party realtime provider |
| Row Level Security | Same primitive (standard Postgres RLS), required only if using the Neon Data API | See `guides/07-authorization-without-rls.md`, a server-only SvelteKit + Drizzle app can enforce authorization in app code instead |
| `pg_dump`/`pg_restore` | Same tools, same flags, minus `--no-owner --no-acl` requirement on the Neon side (Supabase output needs those flags because Supabase ties ownership/ACLs to its own auth system) | |

## User ID remap procedure (required regardless of new auth provider)

1. Export Supabase users (email + old `auth.users.id`) to CSV.
2. Import users into the new auth provider (WorkOS). This assigns **new** user IDs, do not assume any ID stability.
3. Dump `public` schema data with `pg_dump` (direct connection), pre-process the SQL:
   - Replace every `auth.uid()` with `auth.user_id()`.
   - Temporarily strip FK constraints that reference `auth.users` (Neon has no such table).
4. Restore into Neon with `pg_restore --no-owner --no-acl` (or `psql` for a pre-processed plain-SQL dump).
5. Create a temporary `public.temp_users(old_user_id, email)` mapping table, populated from the original Supabase `auth.users` dump.
6. For every table with a `user_id`-shaped column: `UPDATE` it to the new provider's user id by joining `temp_users` on email, then joining the new provider's user list on email again.
7. Drop `temp_users` once every table is remapped and verified.

**This step cannot be skipped.** Every foreign key pointing at a user is silently wrong until this remap runs, there is no way to preserve old Supabase user IDs across an auth-provider switch, per the official migration guide.

## RLS policy translation example

Supabase:

```sql
CREATE POLICY "users_can_view_own_notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);
```

Neon:

```sql
CREATE POLICY "users_can_view_own_notes" ON notes
  FOR SELECT USING (auth.user_id() = user_id);
```

Or declared in Drizzle alongside the schema, using `crudPolicy`:

```typescript
export const notes = pgTable('notes', { /* ... */ }, (table) => [
  crudPolicy({
    role: authenticatedRole,
    read: authUid(table.userId),
    modify: authUid(table.userId),
  }),
]);
```

## Gotchas checklist (pulled from the migration guide, verbatim scope)

- [ ] Used a **direct**, not pooled, connection string for `pg_dump`.
- [ ] Included every non-`public` schema that holds data you need (`--schema` flag repeated), not just `public`.
- [ ] Ran `pg_restore` with `--no-owner --no-acl`, then manually re-granted the correct roles/privileges.
- [ ] Replaced every `auth.uid()` with `auth.user_id()` in the dumped SQL before import.
- [ ] Replaced every `anon` role reference with `anonymous`.
- [ ] Stripped FK constraints referencing `auth.users` before import, re-added them after the ID remap.
- [ ] Ran the full user-ID remap (old id → email → new provider id) before trusting any `user_id` FK.
- [ ] Decided on a replacement for Supabase Storage, if the app used it.
- [ ] Decided on a replacement for Supabase Realtime, if the app used it.
- [ ] Verified row counts and spot-checked data between Supabase and Neon before cutting over the app's connection string.
