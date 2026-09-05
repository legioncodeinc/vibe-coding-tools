# 05: Supabase Auth

When already on Supabase. Pairs with Postgres Row-Level Security (RLS): that's the lever.

Source: `research/2026-04-25-supabase-auth-and-rls.md`, https://supabase.com/docs/guides/auth.

## When Supabase Auth wins

- The data layer is already Supabase Postgres. Running a second auth provider against a Supabase DB is friction.
- You want RLS as your primary authorization mechanism (`auth.uid()` directly in policies).
- Multi-tenancy via tenant_id on rows + an RLS policy is the model. Source: `research/2026-04-25-rbac-and-multitenancy.md`.

## When Supabase Auth loses

- You're not on Supabase Postgres. Self-hosting GoTrue (Supabase Auth's underlying engine) outside Supabase Cloud is supported but uncommon; Better Auth or Auth.js is a smoother self-host path.
- You need rich org / role models out of the box. Supabase Auth gives you JWT claims; org modeling is on you.
- You need polished prebuilt UI past the Auth UI library: design-system custom forms work better.

## Integration shape (Next.js App Router with `@supabase/ssr`)

```ts
// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)),
      },
    }
  );
};
```

```ts
// app/auth/callback/route.ts — OAuth callback
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL('/dashboard', url));
}
```

## RLS: the load-bearing piece

```sql
-- Enable on every tenant table.
alter table public.posts enable row level security;

-- Policy: authenticated users can read their own posts.
create policy "users read own posts" on public.posts
  for select using (auth.uid() = user_id);

-- Policy: authenticated users can insert their own posts.
create policy "users insert own posts" on public.posts
  for insert with check (auth.uid() = user_id);
```

`auth.uid()` is the current Supabase user UUID, derived from the JWT. RLS enforces *at the database*; combined with middleware, this is the two-layer enforcement from `guides/00-principles.md` and `guides/09-rbac.md`.

**Hand schema + RLS migration to `db-worker-bee`.** auth-worker-bee flags the requirement; db-worker-bee writes the SQL.

## Multi-tenancy pattern

```sql
-- tenant_id on every shared table; user_tenants joins users to tenants.
alter table public.posts add column tenant_id uuid not null;

create policy "users read tenant posts" on public.posts
  for select using (
    tenant_id in (select tenant_id from user_tenants where user_id = auth.uid())
  );
```

The `user_tenants` table is canonical. JWT custom claims can also encode tenant memberships: Supabase Auth Hooks let you inject a `tenants` claim at JWT issuance time, then test with `auth.jwt() ->> 'tenants' @> '["tenant-uuid"]'`.

## Critical config

- **`NEXT_PUBLIC_SUPABASE_URL`** + **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: public; safe in client.
- **`SUPABASE_SERVICE_ROLE_KEY`**: server-only; bypasses RLS. Never ship to the client. Use only in server routes that explicitly need to bypass RLS (admin tasks).
- **Auth Hooks** (Pro tier): modify JWTs at issuance. Use to add `tenants`, `roles` claims. Without Auth Hooks, fetch from `user_tenants` per-request.
- **Email templates**: customize confirmation / recovery / magic-link emails in Supabase Dashboard. Default templates leak Supabase branding.
- **Redirect URLs**: set in Dashboard → Auth → URL Configuration. Without these, OAuth and magic-link redirects fail closed.

## Google OAuth via Supabase

Configure in Dashboard → Auth → Providers → Google. Paste your own production Google OAuth `client_id` and `client_secret`. The Supabase callback URL is `https://<project>.supabase.co/auth/v1/callback`: register that as an authorized redirect URI in Google Cloud Console. The October 2025 unused-client-deletion policy applies: see `guides/06-google-oauth.md`.

## Common pitfalls

- **Not enabling RLS** on a new table. Default is RLS-off, which means anon key + REST API exposes the table. Always: `alter table X enable row level security;` immediately on creation.
- **Using `service_role` from the client.** Total bypass. Stops being a security boundary. Server-only.
- **Trusting `auth.jwt() ->> 'email'`**: the `email` claim is from the IdP and may be unverified. Trust `auth.uid()` instead.
- **Forgetting redirect URLs**: sign-in fails silently in prod with no clear error.
- **Forgetting to verify the JWT on a custom backend**: if you have a non-Supabase backend reading Supabase JWTs, you must verify the signature against Supabase's JWKS.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- The RLS policy set (handed to `db-worker-bee` first; then audited by `security-worker-bee`).
- `service_role` key handling (server-only, secret-manager-stored).
- Auth Hooks vs per-request claim hydration trade-off.
- Email-template customization (anti-phishing branding).
- Google OAuth client config and the unused-client deletion health check.
