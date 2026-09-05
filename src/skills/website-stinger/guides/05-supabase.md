# 05: Supabase Backend Foundation

Source PRD: `research/source-prds/prd-phase-05-supabase-backend-foundation.md`

Handoff: `db-worker-bee` for detailed schema design and indexing decisions. Use the Supabase MCP (`plugin-supabase-supabase`) for migration management.

---

## Goal

Wire Supabase Postgres as the business data layer for `apps/web`. In Payload mode, establish the dual-namespace design: Payload owns `payload.*` tables; business data lives in `public.*`. Generate type-safe clients for both apps.

---

## Dual Postgres namespace (Payload mode)

```
Supabase Postgres
├── public schema       ← RLS-protected business data (leads, app_settings, ...)
│   └── All tables: RLS enabled, explicit policies
└── payload schema      ← Managed by @payloadcms/db-postgres
    └── All Payload tables: NO RLS (Payload enforces access control in its own layer)
```

**Connection strings:**
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` → `apps/web` (public schema, RLS-filtered)
- `PAYLOAD_DATABASE_URI` → `apps/cms` (full Postgres URL, must have rights to create `payload` schema)

---

## SvelteKit Supabase client: hooks.server.ts

```ts
// apps/web/src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            event.cookies.set(name, value, { ...options, path: '/' });
          }
        },
      },
    }
  );

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

`app.d.ts` types:

```ts
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
    }
  }
}
```

---

## Browser client for client-side features

```ts
// apps/web/src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';

export const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
```

---

## Core schema (public namespace)

Delegate detailed schema design to `db-worker-bee`. The canonical tables are:

```sql
-- Generic CMS roles (no domain-specific names)
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'member');

-- User profiles (synced from Supabase Auth via trigger)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role app_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Lead capture
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  phone text,
  message text,
  source text,                        -- e.g. 'contact_form', 'popup', 'footer'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referral_source text,               -- friend, search, social, event, other
  referral_name text,                 -- optional contact name if referral_source = 'friend'
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Generic key-value settings (category:key namespacing)
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  key text NOT NULL,
  value jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, key)
);
```

---

## RLS policies skeleton

See `templates/rls-policy-skeleton.sql` for the full baseline. Core pattern:

```sql
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- Anon can insert (for lead form)
CREATE POLICY "leads_insert_anon" ON public.leads FOR INSERT WITH CHECK (true);
-- Only admins can read
CREATE POLICY "leads_select_admin" ON public.leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## app_settings hook (SvelteKit)

```ts
// apps/web/src/lib/hooks/useAppSettings.ts
import { supabase } from '$lib/supabase';

export async function getSettings(category: string): Promise<Record<string, unknown>> {
  const { data } = await supabase
    .from('app_settings')
    .select('key, value')
    .eq('category', category);

  if (!data) return {};
  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}
```

---

## Generated types

```bash
# Run from monorepo root
npx supabase gen types typescript --project-id <your-project-id> > apps/web/src/lib/types/database.ts
```

Add to scripts in `apps/web/package.json`:

```json
{ "db:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/lib/types/database.ts" }
```

Never hand-edit `database.ts`.

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 5.1 | `hooks.server.ts` creates `event.locals.supabase` per request |
| 5.2 | `database.ts` generated and committed (not hand-edited) |
| 5.3 | `profiles`, `leads`, `app_settings` tables created via migration |
| 5.4 | RLS enabled on all `public` schema tables |
| 5.5 | Anon lead insert works (curl test → 201) |
| 5.6 (Payload mode) | `payload` schema created by Payload's db adapter on first `apps/cms` start |
| 5.7 (Payload mode) | `apps/web` cannot read `payload.*` tables via anon key |
