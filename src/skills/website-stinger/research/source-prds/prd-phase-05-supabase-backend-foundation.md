# Phase 5: Supabase Backend Foundation

> **Site Template Guide**: PRD Phase 5 of 12

---

## Phase Overview

### Goals

Wire Supabase Postgres as the business data layer. Establish the dual-namespace design (Payload's tables in `payload` schema, business data in `public` schema). Create the SSR-aware SvelteKit client via `hooks.server.ts`. Generate type-safe database types. Apply RLS to all `public` schema tables.

### Scope

**In scope:**
- Dual Postgres namespace design and documentation
- `src/hooks.server.ts`: `createServerClient` with cookie-based session management
- `src/lib/supabase.ts`: browser client for client-side features
- `src/app.d.ts`: `App.Locals` type declarations
- Core `public` schema migrations: `profiles`, `leads`, `app_settings`, `webhook_endpoints`, `webhook_deliveries`
- RLS policies for all public tables
- `supabase gen types typescript` → `src/lib/types/database.ts`
- `getSettings()` helper for `app_settings` reads

**Out of scope:**
- Auth flows (Phase 6)
- Payload schema setup (handled by `@payloadcms/db-postgres` on first Payload start)
- Edge Functions (Phases 6, 8, 10)

### Dependencies

- Phase 1: monorepo structure + `supabase/` initialized
- Phase 7 (Payload mode): Payload will create `payload` schema on first start; Phase 5 only documents the namespace isolation contract

---

## User Stories

### Story 1: Developer: Type-Safe Supabase Client in SvelteKit

> As a **Developer**, I want an SSR-aware Supabase client available on `event.locals` in every SvelteKit `+page.server.ts` so that I can query Supabase with proper session cookie handling.

**Acceptance criteria:**
- `hooks.server.ts` creates `event.locals.supabase` per request using `createServerClient` from `@supabase/ssr`
- Cookies are read from `event.cookies` and set back via `event.cookies.set`
- `event.locals.safeGetSession()` returns `{ session, user }`: uses `getUser()` not `getSession()` for security
- `App.Locals` declared in `app.d.ts` with correct types

### Story 2: Developer: Generated Type Safety

> As a **Developer**, I want `database.ts` generated from the Supabase schema so that all Supabase queries are type-checked at compile time.

**Acceptance criteria:**
- `supabase gen types typescript` produces `src/lib/types/database.ts`
- `createServerClient<Database>()` used in `hooks.server.ts`
- `database.ts` is listed in `.gitignore` comments as "do not hand-edit"
- Script in `apps/web/package.json`: `"db:types": "supabase gen types typescript ..."`

### Story 3: Anonymous User: Insert a Lead

> As an **Anonymous User** submitting a contact form, I want my lead data to be stored in Supabase via the anon key so that I do not need to be authenticated to submit a form.

**Acceptance criteria:**
- `public.leads` has `INSERT` policy allowing anon
- `public.leads` has `SELECT` policy allowing only admin/editor roles
- `curl -X POST /contact` → 201 lead row in Supabase dashboard

### Story 4: Developer: Payload Schema Isolation

> As a **Developer**, I want Payload's tables to live in a separate Postgres schema (`payload`) so that the Supabase anon key cannot access them.

**Acceptance criteria:**
- Payload's `@payloadcms/db-postgres` configured with `schemaName: 'payload'`
- Supabase anon key `search_path` does NOT include `payload`
- `SELECT COUNT(*) FROM payload.payload_migrations` fails with permission denied for anon role

---

## Data Model

### public.app_role

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'member');
```

Note: `admin` and `editor` refer to Supabase-managed users in the SvelteKit app (lead management, webhook config, analytics access). Payload CMS editors have their own separate user table managed by Payload. These are distinct auth systems.

### public.profiles

```sql
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  full_name  text,
  role       app_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

Trigger syncs from `auth.users` on `INSERT` to automatically create profile rows.

### public.leads

```sql
CREATE TABLE public.leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email            text NOT NULL,
  name             text,
  phone            text,
  message          text,
  source           text,           -- contact_form | popup | footer | hero
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_term         text,
  utm_content      text,
  referral_source  text,           -- friend | search | social | event | other
  referral_name    text,           -- conditional on referral_source = 'friend'
  created_at       timestamptz NOT NULL DEFAULT now()
);
```

The `referral_source` enum is generic and industry-agnostic. There is no `sport` column, no `athlete` or `coach` referral source, and no domain-specific enrichment fields.

### public.app_settings

```sql
CREATE TABLE public.app_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category   text NOT NULL,
  key        text NOT NULL,
  value      jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, key)
);
```

Standard categories: `site`, `forms`, `analytics`, `ab_tests`, `notifications`, `webhooks`.

### public.webhook_endpoints and public.webhook_deliveries

See Phase 10 PRD for full schema.

---

## SvelteKit Client Setup

### hooks.server.ts

```ts
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) {
          event.cookies.set(name, value, { ...options, path: '/' });
        }
      },
    },
  });

  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    if (!session) return { session: null, user: null };
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();
    if (error) return { session: null, user: null };
    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-range' || name === 'x-supabase-api-version',
  });
};
```

---

## RLS Policy Baseline

See `website-stinger/templates/rls-policy-skeleton.sql` for the complete policy set.

Policy philosophy:
- All `public.*` tables have RLS enabled
- `payload.*` tables are NOT given RLS (Payload's access control layer handles that)
- Service-role bypasses RLS for Edge Functions
- Anon can insert leads; cannot read them
- Admin/editor can read all leads
- `app_settings` readable by authenticated users; writable only via service-role (Edge Functions)

---

## Risks and Open Questions

- **R-1:** `@payloadcms/db-postgres` requires the Postgres connection string user to have `CREATESCHEMA` rights to create the `payload` namespace. The default Supabase `postgres` role has this. If using a restricted role, grant it explicitly.
- **R-2:** Supabase's pgbouncer transaction-mode pooler (the default) may conflict with Payload's connection expectations. Test with `?pgbouncer=true&connection_limit=1` in `PAYLOAD_DATABASE_URI`. See `website-stinger/guides/04-supabase-postgres-adapter.md`.
- **Q-1:** Should `profiles.role` be read from `raw_app_meta_data` (set by Edge Function, not user-editable) rather than a separate column? This would make JWT-based role checks faster. Trade-off: requires a service-role call to set; a database column is simpler but requires a table join.
