# 07 - Authorization without RLS

## What RLS actually requires, per Neon's own docs

Row-Level Security on Neon is standard Postgres RLS, `ENABLE ROW LEVEL SECURITY`, `CREATE POLICY`, `USING`/`WITH CHECK`, nothing proprietary [raw/neon-drizzle--authorization--rls-data-api.md]. The state matrix matters:

| State | Behavior |
|---|---|
| RLS disabled | All granted rows visible to any role with table access, **no filtering at all** |
| RLS enabled, no policy | **All access blocked** |
| RLS enabled + policy | Rows filtered per policy |
[raw/neon-drizzle--authorization--rls-data-api.md]

Critically: **RLS is a hard requirement only if the app uses the Neon Data API**, Neon's PostgREST-compatible REST layer that lets a browser query Postgres directly with a JWT. The Data API has no permission system of its own; GRANT decides table access, RLS decides row access, and the docs state every table exposed through the Data API must have RLS enabled [raw/neon-drizzle--authorization--rls-data-api.md].

## Why this stack can treat RLS as optional

This stack's SvelteKit convention (guide 05) puts the database client exclusively in server-only code, the browser never receives a database-scoped JWT and never queries Postgres directly. The specific threat model RLS defends against (a client holding direct, if scoped, database access) does not exist unless the team deliberately adopts the Data API for client-side queries. This is a reasoned inference from the sources, not a direct quote, flagged as such in the research distillation [raw/neon-drizzle--authorization--rls-data-api.md, raw/neon-drizzle--integration--sveltekit-vercel-guide.md].

**Practical rule**: if this app's Drizzle client only ever runs in `src/lib/server/`, RLS is defense-in-depth, not the primary authorization mechanism. If any route starts using the Neon Data API for client-side queries, RLS on every table the Data API touches becomes mandatory again, immediately, per Neon's own requirement, this is a decision to revisit any time the Data API enters the picture, not a one-time architectural choice.

## Enforcing authorization in app code (the default for this stack)

Authorization checks live at two layers, both server-side:

1. **Route/load-function layer**: `authKit.withAuth(handler)` (WorkOS) gates every protected `+page.server.ts`/`+server.ts`, guaranteeing `auth.user` exists before the handler body runs [raw/neon-drizzle--auth--workos-authkit-sveltekit.md].
2. **Query layer**: every Drizzle query that returns user-scoped data filters explicitly by the authenticated user's ID, e.g. `db.query.posts.findMany({ where: { authorId: { eq: auth.user.id } } })`. There is no database-enforced backstop if this filter is forgotten, code review and tests are the safety net, not the database.

## When to add RLS anyway, even without the Data API

Add RLS as defense-in-depth when:

- A table holds especially sensitive data (PII, financial records) where a missed `WHERE` clause in application code would be a serious incident, not just a bug.
- Multiple services/roles query the same database and an application-code-only guarantee can't be verified across all of them.
- Compliance requirements (HIPAA, SOC 2, both available on Neon's Scale plan [raw/neon-drizzle--cost--pricing-plans-limits.md]) call for a database-level control, not just an application-level one.

## Declaring RLS with Drizzle, if adopted

```typescript
export const notes = pgTable('notes', { /* ... */ }, (table) => [
  crudPolicy({
    role: authenticatedRole,
    read: authUid(table.userId),
    modify: authUid(table.userId),
  }),
]);
```
[raw/neon-drizzle--authorization--rls-data-api.md]

`crudPolicy` (from `drizzle-orm/neon`) generates the four CRUD policies from one declaration; `authUid(column)` expands to `(select auth.user_id() = column)`. For asymmetric per-operation rules (e.g. anonymous read, authenticated-only write), use the lower-level `pgPolicy` directly [raw/neon-drizzle--authorization--rls-data-api.md]. `auth.user_id()` works with any JWT-issuing provider, Neon validates against the provider's JWKS, so it works the same way with WorkOS as with Neon's own Managed Better Auth, Clerk, or Auth0 [raw/neon-drizzle--authorization--rls-data-api.md].

## Load next

- `guides/05-sveltekit-vercel-integration.md`, the server-only client boundary this guide's default posture depends on
- `references/supabase-to-neon-translation-table.md`, RLS policy translation if migrating existing Supabase policies
- [security-stinger](../security-stinger), broader authorization/audit guidance beyond this stinger's Neon/Drizzle-specific scope
