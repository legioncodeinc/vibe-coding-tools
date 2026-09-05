# 06 - Supabase migration

This guide is for the one-time cutover from Supabase to Neon, not ongoing schema changes (that's guide 03). Load `references/supabase-to-neon-translation-table.md` alongside this guide for the full concept-mapping table and gotchas checklist.

## Schema and data transfer

Basic path, `pg_dump`/`pg_restore`:

```bash
pg_dump -Fc -v -d postgresql://[user]:[password]@[supabase_host]:[port]/[database] --schema=public -f supabase_dump.bak
pg_restore -d <neon-connection-string> -v --no-owner --no-acl supabase_dump.bak
```
[raw/neon-drizzle--migration--supabase-to-neon.md]

- Use a **direct**, not pooled, connection string on both ends, `pg_dump` relies on `SET` statements unsupported in transaction-mode pooling [raw/neon-drizzle--connections--pooling.md].
- `--schema=public` only dumps the public schema by default. Supabase stores auth/storage data under other schemas, add `--schema` again per schema you need [raw/neon-drizzle--migration--supabase-to-neon.md].
- `--no-owner --no-acl` are **required** on restore: Supabase ties object ownership and ACLs to its own auth system, and restoring them as-is will fail against Neon. Reconfigure roles/privileges manually after restore [raw/neon-drizzle--migration--supabase-to-neon.md].

Near-zero-downtime path, logical replication: requires the Supabase IPv4 add-on (direct connection only; pooled won't work), Neon's NAT IPs allow-listed in Supabase network restrictions, a `PUBLICATION` on Supabase, and a matching `SUBSCRIPTION` on Neon. Supabase's `max_replication_slots`/`max_wal_senders` are plan-capped and may require an instance upgrade for large migrations [raw/neon-drizzle--migration--supabase-to-neon.md].

## Auth replacement (WorkOS, in this stack)

Supabase Auth and WorkOS AuthKit are structurally different systems, AuthKit manages its own session/cookie/callback flow independent of the database [raw/neon-drizzle--auth--workos-authkit-sveltekit.md]. Migrating means:

1. Export Supabase users (email + old `auth.users.id`) to CSV.
2. Import into WorkOS, this assigns **new** user IDs. There is no way to preserve old Supabase IDs across an auth-provider switch [raw/neon-drizzle--migration--supabase-to-neon.md].
3. Every `user_id`-shaped foreign key in the migrated schema now points at a stale ID and must be remapped via a temporary `email → old_id → new_id` mapping table (full procedure in `references/supabase-to-neon-translation-table.md`).

## WorkOS SvelteKit setup (what replaces `supabase.auth`)

```typescript
// hooks.server.ts
import { configureAuthKit, authKitHandle } from '@workos/authkit-sveltekit';
import { env } from '$env/dynamic/private';

configureAuthKit({
  clientId: env.WORKOS_CLIENT_ID,
  apiKey: env.WORKOS_API_KEY,
  redirectUri: env.WORKOS_REDIRECT_URI,
  cookiePassword: env.WORKOS_COOKIE_PASSWORD,
});

export const handle = authKitHandle();
```
[raw/neon-drizzle--auth--workos-authkit-sveltekit.md]

Required routes: a callback route (`src/routes/callback/+server.ts`) and a **sign-in endpoint** route (`src/routes/sign-in/+server.ts`) registered in the WorkOS dashboard as the `initiate_login_uri`. **Gotcha, stated explicitly in the SDK's own docs**: without a registered sign-in endpoint, WorkOS-dashboard-initiated flows (e.g. admin impersonation) fail with "Missing required auth parameter," because they redirect straight to the callback URL without the PKCE/CSRF `state` this library enforces on every callback [raw/neon-drizzle--auth--workos-authkit-sveltekit.md]. Protect routes with `authKit.withAuth(handler)` in `+page.server.ts` files [raw/neon-drizzle--auth--workos-authkit-sveltekit.md].

## RLS translation

If the app used Supabase RLS policies and continues to use Postgres RLS on Neon (see guide 07 for whether that's even necessary in this stack):

| Supabase | Neon |
|---|---|
| `auth.uid()` | `auth.user_id()` |
| `anon` role | `anonymous` role |

Both require an actual policy rewrite, not a find-and-replace rename, the function bodies and role definitions differ between platforms [raw/neon-drizzle--migration--supabase-to-neon.md]. Permissions are not auto-migrated: extract Supabase `GRANT`s manually and reapply the Neon equivalents [raw/neon-drizzle--migration--supabase-to-neon.md].

## What this migration does NOT cover, storage and realtime

**Explicit gap, stated by the source material itself, not this stinger's own inference**: the most detailed Supabase-to-Neon migration guide found in research covers database, auth, and RLS only. It provides **no Neon-native replacement** for Supabase Storage (object storage) or Supabase Realtime (pub/sub) [raw/neon-drizzle--migration--supabase-to-neon.md]. Plan separately for:

- **Storage**: S3, Cloudflare R2, or Vercel Blob.
- **Realtime**: a dedicated WebSocket service, Postgres `LISTEN`/`NOTIFY` over a direct connection, or a third-party realtime provider.

Do not assume a Neon migration guide silently covers these, it does not, and no source in this stinger's archive claims otherwise.

## Load next

- `references/supabase-to-neon-translation-table.md`, full concept mapping and the gotchas checklist
- `guides/07-authorization-without-rls.md`, deciding whether RLS is even needed post-migration
- [auth-stinger](../auth-stinger) and [workos-stinger](../workos-stinger), deeper WorkOS/AuthKit guidance beyond the database-migration scope of this guide
