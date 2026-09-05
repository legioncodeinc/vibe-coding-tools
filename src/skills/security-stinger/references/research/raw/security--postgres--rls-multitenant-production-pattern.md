# Postgres RLS for Multi-Tenant SaaS, the Production Pattern

- URL: https://theroadtoenterprise.com/blog/postgres-rls-multi-tenant-saas
- Fetched: 2026-08-14
- Source type: vendor-independent technical blog (Thomas Findlay), published 2026-07-03, updated 2026-08-01
- Component: Neon Postgres + Drizzle tenant isolation (this repo left Supabase, so its RLS/JWT-claim conveniences do not apply)

## Why "leaving Supabase" changes the isolation story

- Verbatim: "The Supabase `tenant_id = auth.uid()` policy falls apart the moment you leave Supabase." Supabase's convenience RLS pattern depends on Supabase-managed JWT claims flowing through `auth.uid()`, which does not exist on self-hosted/Neon Postgres. A team moving off Supabase (as this repo has, onto Neon + Drizzle + WorkOS) loses that built-in wiring and must implement the tenant-context plumbing itself - the RLS mechanism (Postgres row security) still works identically, but nothing sets the session/transaction variable for you anymore.
- "A `WHERE` clause is a convention. A policy is a contract." - the article's framing for why RLS is worth the migration effort even without Supabase's helpers.

## Why tenant_id columns + WHERE clauses alone are not enough

- Every multi-tenant app starts with a `tenant_id` column and `WHERE tenant_id = $1` on every query, relying on code review to catch the one place a developer forgets the predicate. Code review does not catch every instance: "A single `SELECT * FROM invoices WHERE id = $1` in a debug script, a forgotten join in an admin endpoint, or an aggregate over an internal report is enough to cross-tenant a row into the wrong customer's response."
- Audit framing: a SOC 2 reviewer asking "what control prevents tenant A from reading tenant B's data" cannot be answered with "the developers remembered to add a WHERE clause" - that is not a control, RLS is.

## The four-line production RLS pattern (self-hosted / Neon, no Supabase helpers)

1. `BEGIN;`
2. `SELECT set_config('app.tenant_id', $1, true);` - the `true` third argument scopes the write to the current transaction; it reverts automatically on COMMIT or ROLLBACK.
3. The actual query/queries.
4. `COMMIT;`

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY; -- the line most tutorials skip

CREATE POLICY tenant_isolation_select ON invoices FOR SELECT
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY tenant_isolation_insert ON invoices FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY tenant_isolation_update ON invoices FOR UPDATE
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY tenant_isolation_delete ON invoices FOR DELETE
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

- `ENABLE ROW LEVEL SECURITY` activates policies for normal roles; by default the table OWNER still bypasses RLS (a documented Postgres carve-out). `FORCE ROW LEVEL SECURITY` removes that bypass, which matters because the role that ran your Drizzle migrations is very often the same role the app connects as.
- `current_setting('app.tenant_id', true)` - the `true` second argument is critical: without it, an unset GUC raises a Postgres error; with it, it returns an empty string, which fails the `::uuid` cast, which fails the equality check, which denies every row. This makes a forgotten tenant-context middleware fail closed (zero rows) rather than leak the previous tenant's data.
- Index `tenant_id` (composite with the next most-selective column for time-ordered queries) - the policy predicate is evaluated on every query, so an unindexed policy column produces a sequential scan on every request.

## The connection-pool trap

- Pooled connections are reused across unrelated requests. If the GUC is set with plain `SET app.tenant_id = ...` outside a transaction (not `set_config(..., true)`), the value survives on the connection after the request completes and can leak into the NEXT request that reuses that same pooled connection - a cross-tenant data leak caused purely by connection reuse, not application logic.
- Mitigation: always set the GUC via `set_config(..., true)` inside a transaction wrapper (e.g. a `withTenant`/`withTenantTx` helper that every route handler is forced to go through - do not export the raw `db`/`PrismaClient`/pool client from that module, only the wrapper, so a handler cannot bypass the policy by reaching the client directly).
- If sitting behind PgBouncer, run it in transaction pooling mode (not session mode) - transaction mode binds a pooled connection to a single transaction at a time, matching the GUC's lifetime; session mode holds the connection for the whole client session, which defeats the transaction-scoped reset.

## Drizzle wiring pattern

```ts
export async function withTenantTx<T>(tenantId: string, work: (tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
    return work(tx);
  });
}
```
Every tenant-scoped query in the application must flow through this wrapper; the module that defines it should not export the raw Drizzle `db` instance, so a route handler literally cannot reach an unscoped connection.

## Negative-test requirement

The article's audit checklist item: "A negative test asserts that a request with no tenant set returns zero rows, and that a write tagged as another tenant raises a policy error." Recommended to run this test against the migrated schema in CI before any application code runs, so a missing RLS migration fails the build before deploy.
