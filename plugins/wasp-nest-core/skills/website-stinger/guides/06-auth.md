# 06: Authentication & User Management

Source PRD: `research/source-prds/prd-phase-06-authentication-user-management.md`

---

## Goal

Wire Supabase Auth for end-users and Payload's built-in auth for CMS editors. Gate SvelteKit routes via `hooks.server.ts`. Create the `admin-users` Edge Function for privileged user management operations.

---

## Auth architecture decision

| User type | Auth system | Admin UI |
|---|---|---|
| End-users (lead submitters, registered members) | Supabase Auth | Supabase dashboard or custom admin page in SvelteKit |
| CMS editors and content admins | Payload built-in auth | Payload admin at `apps/cms` URL |

**Never use Payload Auth to protect SvelteKit routes.** SvelteKit checks only Supabase sessions in `hooks.server.ts`.

**Never use Supabase Auth to protect Payload Collections.** Payload access control is defined in `payload.config.ts` via `access` objects.

---

## SvelteKit route protection: hooks.server.ts

Extend the Phase 5 `hooks.server.ts` to protect admin-only routes:

```ts
// apps/web/src/hooks.server.ts (extend Phase 5 version)
import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

const PROTECTED_PATHS = ['/admin', '/dashboard'];

export const handle: Handle = async ({ event, resolve }) => {
  // ... Phase 5 Supabase client setup ...

  const { session, user } = await event.locals.safeGetSession();

  // Protect /admin and /dashboard routes
  const isProtectedPath = PROTECTED_PATHS.some((p) => event.url.pathname.startsWith(p));
  if (isProtectedPath && !session) {
    throw redirect(303, `/login?redirectTo=${event.url.pathname}`);
  }

  // Role-based route guarding
  if (event.url.pathname.startsWith('/admin') && user) {
    const { data: profile } = await event.locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      throw redirect(303, '/');
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-range',
  });
};
```

---

## Login/Signup pages in SvelteKit

Use SvelteKit form actions for auth flows (no `@supabase/auth-ui-react`):

```ts
// apps/web/src/routes/login/+page.server.ts
import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) return fail(400, { error: error.message });

    throw redirect(303, '/dashboard');
  },

  logout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    throw redirect(303, '/');
  },
};
```

---

## RBAC: roles

The `public.app_role` enum from Phase 5 defines:
- `admin`: full access to all SvelteKit admin routes and all Supabase data
- `editor`: content-editing access (create/update leads, read analytics)
- `member`: registered end-user (read own data only)

Payload CMS roles are separate and defined in `payload.config.ts` → `users` collection `access` object.

---

## admin-users Edge Function (privileged operations)

For user creation, role changes, or deletion (which require service-role access), use a Supabase Edge Function:

```ts
// supabase/functions/admin-users/index.ts
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Verify the caller's JWT and role
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );
  if (authError || !user) return new Response('Unauthorized', { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403 });

  const { action, ...payload } = await req.json();

  // Handle admin actions
  if (action === 'set-role') {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: payload.role })
      .eq('id', payload.userId);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response('Unknown action', { status: 400 });
});
```

Deploy: `supabase functions deploy admin-users`

---

## Password reset redirect

Use `PUBLIC_SITE_URL` env var, never hardcode a domain:

```ts
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${PUBLIC_SITE_URL}/reset-password`,
});
```

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 6.1 | `/login` form action signs in via Supabase Auth, redirects to `/dashboard` |
| 6.2 | `/dashboard` (or `/admin`) returns 303 redirect if no session |
| 6.3 | Non-admin user visiting `/admin` is redirected to `/` |
| 6.4 | `admin-users` Edge Function deployed and callable with admin Bearer token |
| 6.5 | Password reset email uses `PUBLIC_SITE_URL` (not hardcoded domain) |
| 6.6 | Payload admin (`apps/cms`) accessible at its own URL, separate from SvelteKit routes |
