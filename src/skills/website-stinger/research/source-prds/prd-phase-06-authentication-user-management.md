# Phase 6: Authentication & Multi-Role User Management

> **Site Template Guide**: PRD Phase 6 of 12

---

## Phase Overview

### Goals

Wire Supabase Auth for end-users. Define RBAC roles. Protect SvelteKit routes via `hooks.server.ts`. Create the `admin-users` Edge Function for privileged user management. Document the Payload Auth vs Supabase Auth split.

### Scope

**In scope:**
- SvelteKit `+page.server.ts` form actions for login, signup, logout, and password reset
- `hooks.server.ts` route guard for `/admin` and `/dashboard`
- RBAC based on `public.profiles.role` (admin / editor / member)
- `supabase/functions/admin-users/` Edge Function for user role management
- Documentation of Payload Auth vs Supabase Auth boundary

**Out of scope:**
- Payload Auth configuration (Phase 7 / `website-stinger` (owns the Payload CMS surface))
- OAuth social login (add via Supabase dashboard; no code changes required for basic flows)
- MFA (add later via Supabase Auth settings)

### Dependencies

- Phase 5: `public.profiles` table and `app_role` enum exist

---

## Auth Architecture

### Two separate auth systems

| System | Users | Admin UI | Protected routes |
|---|---|---|---|
| **Supabase Auth** | End-users, lead submitters, registered members, SvelteKit admin users | SvelteKit login page at `/login` | `/admin`, `/dashboard`: guarded by `hooks.server.ts` |
| **Payload Auth** | CMS editors and admins who use the Payload admin panel | Payload admin at `apps/cms` URL | Payload Collections: guarded by Payload's `access` objects |

**Critical boundary:** Never use Payload Auth to protect SvelteKit routes. Never use Supabase Auth to protect Payload Collections.

---

## User Stories

### Story 1: Admin User: Login to SvelteKit Admin

> As an **Admin**, I want to log in via a form at `/login` so that I can access the leads dashboard and webhook management pages.

**Acceptance criteria:**
- `POST /login?/login` calls `supabase.auth.signInWithPassword()`
- On success: redirects to `/dashboard` (or `redirectTo` query param)
- On failure: returns form error via superforms fail()
- Session cookie set by `@supabase/ssr`

### Story 2: Route Guard: Protect Admin Routes

> As the **System**, I want unauthenticated requests to `/admin` and `/dashboard` to be redirected to `/login` so that private data is not exposed.

**Acceptance criteria:**
- `hooks.server.ts` checks `safeGetSession()` for all requests to paths starting with `/admin` or `/dashboard`
- Unauthenticated → `throw redirect(303, '/login?redirectTo=<path>')`
- Non-admin role visiting `/admin` → `throw redirect(303, '/')`

### Story 3: Admin: Manage User Roles

> As an **Admin**, I want to promote a member to editor or admin via the SvelteKit admin UI so that content editors can access the leads and settings pages.

**Acceptance criteria:**
- `/admin/users` page lists all profiles with role
- "Set role" action calls `admin-users` Edge Function with Bearer token
- Edge Function verifies caller has `admin` role before updating `profiles.role`
- Role change reflected immediately on next session refresh

### Story 4: User: Password Reset

> As a **User**, I want to request a password reset email so that I can regain access if I forget my password.

**Acceptance criteria:**
- `POST /forgot-password?/reset` calls `supabase.auth.resetPasswordForEmail()` with `redirectTo: PUBLIC_SITE_URL + '/reset-password'`
- `PUBLIC_SITE_URL` is used: no hardcoded domain in the codebase
- Email delivers a working reset link
- `/reset-password` page updates password via `supabase.auth.updateUser()`

---

## RBAC Design

| Role | SvelteKit access | Supabase data access |
|---|---|---|
| `admin` | All routes including `/admin` | All leads, app_settings, webhooks, all profiles |
| `editor` | `/admin/leads`, `/admin/content` | Read leads, read/write certain app_settings |
| `member` | Own profile data only | Own profile row only |
| Unauthenticated | Public pages only | Anon INSERT to leads |

---

## admin-users Edge Function

```
POST /functions/v1/admin-users
Authorization: Bearer <user-JWT>
Body: { "action": "set-role", "userId": "<uuid>", "role": "editor" }
```

The function:
1. Verifies caller's JWT → confirms caller exists and is admin
2. Updates `public.profiles.role` for target user
3. Returns `{ success: true }` or error

Deploy: `supabase functions deploy admin-users --no-verify-jwt`

---

## Password Reset Redirect

```ts
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${PUBLIC_SITE_URL}/reset-password`,
});
```

`PUBLIC_SITE_URL` is the env var, never a hardcoded domain string. This is the critical fix vs the NST Sports pattern where `https://leads.nstsports.com/reset-password` was hardcoded.

---

## Risks and Open Questions

- **R-1:** SvelteKit's `hooks.server.ts` runs before every request, including static assets in dev. Ensure the route guard only applies to HTML page requests, not to `/api/`, `/favicon.ico`, etc.
- **R-2:** JWT expiry and session refresh: `@supabase/ssr` handles refresh automatically when `setAll` is implemented correctly. If cookies are being set without a `path: '/'`, session refresh may fail on sub-routes.
- **Q-1:** Should editors have access to Payload admin? If so, they need to be created as Payload `users` independently from Supabase profiles. Define a clear policy: Supabase profiles control SvelteKit admin access; Payload users are a separate system for content editing.
