# Supabase Auth + RLS

**Sources:**
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/auth/auth-hooks

**Retrieved:** 2026-04-25

## Summary

Supabase Auth (built on the open-source GoTrue project) provides email + password, magic links, OAuth, and SAML (Pro tier) auth with JWT-based sessions. Its strongest feature is integration with Postgres Row-Level Security (RLS) via `auth.uid()` and `auth.jwt()` claims.

## Key concepts

- **`auth.uid()`**: current user UUID, derived from the JWT.
- **`auth.jwt()`**: full JWT claims; can include custom claims via Auth Hooks.
- **`anon` role**: public, unauthenticated; RLS enforces on this role's queries.
- **`authenticated` role**: signed-in user; RLS enforces.
- **`service_role` role**: bypasses RLS. Server-only.

## RLS pattern

```sql
alter table public.posts enable row level security;

create policy "users read own posts" on public.posts
  for select using (auth.uid() = user_id);
```

## Multi-tenancy via RLS

```sql
create policy "users read tenant posts" on public.posts
  for select using (
    tenant_id in (select tenant_id from user_tenants where user_id = auth.uid())
  );
```

`user_tenants` is canonical; OR encode tenant memberships in JWT custom claims via Auth Hooks (Pro tier).

## Common failures

- **RLS not enabled on a new table**: anon key + REST exposes it. Default is RLS-off; always enable on table creation.
- **`service_role` from client**: total bypass. Server-only.
- **Trusting `auth.jwt() ->> 'email'`**: IdP-asserted, may be unverified. Trust `auth.uid()`.

## Relevance

- `guides/05-supabase-auth.md`: full deep dive.
- `guides/09-rbac.md`: multi-tenancy patterns including RLS.
- `guides/00-principles.md` Principle 3: two-layer enforcement.
