# Row-Level Security (RLS) - Drizzle ORM

- URL: https://orm.drizzle.team/docs/rls
- Fetched: 2026-08-14
- Source type: official ORM documentation
- Component: Drizzle ORM (Postgres dialect), Neon Postgres

## Content

- Drizzle supports enabling RLS on any Postgres table and defining policies/roles directly in the schema. Works with any Postgres provider including Neon (this repo's provider).
- `pgTable.withRLS('users', {...})` enables RLS without adding an explicit policy. Per Postgres docs, quoted in Drizzle's own docs: "If no policy exists for the table, a default-deny policy is used, meaning that no rows are visible or can be modified." `TRUNCATE` and `REFERENCES` are NOT subject to row security.
- Adding a `pgPolicy(...)` to a table automatically enables RLS on it - no need to call `.withRLS()` separately once a policy exists.
- Policy definition shape:
```ts
pgPolicy('policy', {
  as: 'permissive' | 'restrictive',
  to: adminRole, // or 'public' | 'current_role' | 'current_user' | 'session_user' | role name
  for: 'all' | 'select' | 'insert' | 'update' | 'delete',
  using: sql`...`,      // gates SELECT/existing rows
  withCheck: sql`...`,  // gates INSERT/new-or-updated rows
})
```
- `.link(existingTable)` attaches a policy to a table that already exists in the database but is not managed by Drizzle's schema (common with Neon/Supabase-managed tables).
- `entities.roles` in `drizzle.config.ts` controls whether drizzle-kit manages Postgres roles in migrations; disabled (`false`) by default, so roles referenced in policies must be marked `.existing()` unless explicitly enabled.
- RLS can be applied to views via `security_invoker: true` in the view's WITH options.
- `drizzle-orm/neon` ships predefined `authenticatedRole` and `anonymousRole` (marked `.existing()`) plus an `authUid()` helper for Neon-specific auth integration; `drizzle-orm/supabase` ships the analogous `anonRole`/`authenticatedRole`/`serviceRole`/`supabaseAuthAdminRole` set for teams still on Supabase. Since this repo is on Neon Postgres without Supabase, the generic raw-policy API (not the Supabase-specific roles) is the applicable pattern, or Neon's own predefined roles/functions if using Neon's native auth integration - otherwise application-level `set_config`/GUC wiring (see the theroadtoenterprise production-pattern source) is required.
