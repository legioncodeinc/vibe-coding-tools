# 03. Authorization and tenancy

Grounded in [references/research/distilled-security.md §3-4](../references/research/distilled-security.md).

## What leaving Supabase costs you

This repo does not use Supabase. That matters specifically for Row Level Security, because Supabase's popular `tenant_id = auth.uid()` RLS pattern depends on Supabase-managed JWT claims flowing automatically into `auth.uid()` inside Postgres - wiring that Neon (this repo's Postgres provider) does not provide out of the box. As one of the archived sources puts it: "The Supabase `tenant_id = auth.uid()` policy falls apart the moment you leave Supabase." [raw/security--postgres--rls-multitenant-production-pattern.md]

This does NOT mean RLS is unavailable - Postgres Row Level Security is a core database feature, identical on Neon and Supabase. What's lost is the automatic session-variable wiring; this repo has to implement it itself, via WorkOS-authenticated request context feeding a `set_config()` call rather than a Supabase-issued JWT feeding `auth.uid()` automatically.

## The "forgot the WHERE clause" bug class

Every multi-tenant app starts with a `tenant_id`/`organization_id` column and a `WHERE tenant_id = $1` on every query, relying on code review to catch the one place someone forgets it. That review does not reliably catch every instance - a debug script's `SELECT * FROM invoices WHERE id = $1`, a forgotten join in an admin endpoint, or an aggregate report are all realistic ways one tenant's row ends up in another tenant's response. The frank framing from the research: "a `WHERE` clause is a convention. A policy is a contract." [raw/security--postgres--rls-multitenant-production-pattern.md]

For an AI-built codebase specifically, this is not hypothetical: CVE-2025-48757 documented 303 vulnerable endpoints across 170 of 1,645 scanned Lovable-generated apps, all missing Supabase RLS by default, exposing PII, financial records, and admin credentials to unauthenticated reads. The root cause was named as a default-behavior gap in the generating tool, not a one-off bug - the same class of gap this guide exists to catch in this repo's own AI-generated Drizzle/Neon code. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]

## The production RLS pattern for Neon + Drizzle

Four pieces, and the source is explicit that all four matter together - skipping any one silently defeats the others:

1. **Enable AND force RLS on every tenant-scoped table:**
```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
```
`FORCE` is the line most tutorials skip. Without it, the table's owner role bypasses RLS by default (a documented Postgres carve-out) - and the role Drizzle migrations run as is very often the same role the application connects with, so skipping `FORCE` can mean RLS is enabled but silently not enforced for the app's own connection.

2. **Set the tenant GUC inside a transaction, with `true` as the third argument:**
```ts
await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
```
The `true` argument scopes the write to the transaction so it clears automatically on commit/rollback - this is what prevents a pooled connection from leaking one request's tenant context into the next request that reuses the same connection. Setting it with plain `SET` outside a transaction is the single highest-impact mistake in this pattern.

3. **Write the policy against the GUC with `current_setting(..., true)`** (not `auth.uid()`, which doesn't exist outside Supabase):
```sql
CREATE POLICY tenant_isolation_select ON invoices FOR SELECT
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```
The `true` second argument to `current_setting` is what makes an unset GUC FAIL CLOSED: without it, an unset GUC raises a Postgres error; with it, it returns an empty string, which fails the `::uuid` cast, which fails the equality check, which denies every row. A forgotten middleware call becomes "zero rows," never "leaked row."

4. **Index the tenant column.** The policy predicate runs on every query against that table; an unindexed policy column means every query on that table is a sequential scan.

## Wiring pattern - force every query through a wrapper

```ts
export async function withTenant<T>(tenantId: string, work: (tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
    return work(tx);
  });
}
```
Do not export the raw `db` instance (or pool client) from the module that defines this wrapper - the point is that a route handler CANNOT reach an unscoped connection even by mistake. This is the concrete mechanism that turns "the policy is a contract" into something the type system helps enforce, not just a convention documented in a wiki page.

## Negative test requirement

The RLS setup is not complete without a test proving it: a request with no tenant context set returns zero rows (not an error, not another tenant's rows), and a write tagged as a different tenant is rejected by the policy's `WITH CHECK` clause. Run this against the migrated schema in CI, before application code runs, so a missing RLS migration fails the build rather than reaching production. [raw/security--postgres--rls-multitenant-production-pattern.md]

## Drizzle-specific notes

Drizzle supports RLS natively (`pgPolicy`, `.withRLS()`, `entities.roles` in `drizzle.config.ts`) and ships `drizzle-orm/neon` and `drizzle-orm/supabase` role helper modules for those specific providers. Since this repo is on Neon without Supabase, reach for Neon's own predefined roles/auth integration if using Neon's native auth, or the generic raw-policy + application-level `set_config` wiring above - not the Supabase-specific role imports, which assume Supabase's JWT claim plumbing. [raw/security--drizzle--row-level-security-docs.md]

For the SQL-injection-specific risks inside Drizzle query construction (relevant to writing the policies and the tenant wrapper itself safely), see [04-secrets-and-env.md](04-secrets-and-env.md)'s sibling guide is not it - see the dedicated coverage in [references/research/distilled-security.md §4](../references/research/distilled-security.md) and [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md).
