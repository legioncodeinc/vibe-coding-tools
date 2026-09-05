# 09: RBAC and Authorization

Roles, permissions, ABAC, multi-tenancy, and the **two-layer enforcement** rule.

Source: `research/2026-04-25-rbac-and-multitenancy.md`, OWASP Authorization Cheat Sheet.

## The vocabulary

- **Role**: a named bundle of permissions (`admin`, `editor`, `viewer`).
- **Permission**: a verb on a resource (`posts:write`, `billing:read`).
- **Tenant / org**: a multi-customer boundary (each customer's data is partitioned).
- **ABAC (attribute-based)**: policy logic over attributes (`user.region == resource.region AND user.clearance >= resource.classification`).
- **RLS (row-level security)**: DB-level enforcement; the database refuses to return rows the requester shouldn't see.

## The decision tree

1. **Single-tenant, ≤3 distinct user types?** → Plain RBAC (`role` field on user). Done.
2. **Multi-tenant, ≤3 distinct user types per tenant?** → RBAC + tenant scoping. `(user, tenant, role)` triple.
3. **Permissions vary per row, per attribute (region, clearance, ownership)?** → ABAC. Probably with a policy library (Casbin, OPA, OSO, Cerbos).
4. **B2B with customer-defined permissions?** → RBAC + customer-customizable role definitions. Better Auth's organization plugin, Clerk Organizations, WorkOS roles.

## Two-layer enforcement (mandatory)

Every tenant- or owner-scoped resource is enforced **at two layers**:

1. **Edge / middleware layer**: `if (!session) reject`; `if (!hasRole('admin')) reject`. Runs on every request before route handlers.
2. **Data layer**: the query itself filters by `tenant_id = current_user_tenant`. Or RLS at the DB level enforces it.

Why both:

- Middleware can be bypassed (internal call, misconfigured proxy, forgotten registration on a new route).
- Data-layer-only leaks side-channel info ("403 vs 404"); middleware fronts it.
- A single layer is a single point of failure.

Source: `research/2026-04-25-rbac-and-multitenancy.md`, OWASP A01:2021 Broken Access Control.

## Pattern: middleware layer (Next.js)

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth(async (req) => {
  if (!req.auth) return NextResponse.redirect(new URL('/sign-in', req.url));

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (req.auth.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
  }
  return NextResponse.next();
});

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'] };
```

## Pattern: data layer (Postgres RLS)

```sql
alter table public.posts enable row level security;

create policy "tenant scope read" on public.posts
  for select using (
    tenant_id in (select tenant_id from user_tenants where user_id = auth.uid())
  );

create policy "tenant scope write" on public.posts
  for insert with check (
    tenant_id in (select tenant_id from user_tenants where user_id = auth.uid() and role in ('admin','editor'))
  );
```

Hand RLS migration to `db-worker-bee`. auth-worker-bee flags the requirement; db-worker-bee writes the SQL with proper indexing and the right `user_tenants` relationship.

## Pattern: data layer (application code)

If RLS isn't available (non-Postgres, or org policy):

```ts
// Always include tenant_id in the WHERE clause.
const posts = await db.posts.findMany({
  where: {
    tenant_id: { in: session.user.tenant_ids },  // narrowed by session
    // ... other filters
  },
});
```

The risk: a developer forgets `tenant_id` on a new query and exposes cross-tenant data. Mitigations:

- Centralized data accessor (`db.tenantPosts(tenantId).findMany(...)`) that takes tenant as the first arg, can't be omitted.
- Static analysis / lint rule on bare `db.posts.findMany`.
- Test coverage that asserts a user from tenant A cannot read tenant B's data.

## Permissions check shape

Pure RBAC:

```ts
function can(user: User, action: string): boolean {
  return PERMISSIONS[user.role]?.includes(action) ?? false;
}

if (!can(session.user, 'posts:delete')) throw new ForbiddenError();
```

ABAC with a policy library (Cerbos):

```ts
const decision = await cerbos.checkResource({
  principal: { id: user.id, roles: user.roles, attributes: { region: user.region } },
  resource: { kind: 'document', id: doc.id, attributes: { region: doc.region, classification: doc.classification } },
  actions: ['view', 'edit'],
});
if (!decision.isAllowed('view')) throw new ForbiddenError();
```

Cite https://www.cerbos.dev (Cerbos), https://www.osohq.com (Oso), https://www.openpolicyagent.org (OPA), https://casbin.org (Casbin).

## Multi-tenancy with row-level security (the canonical SaaS pattern)

```
users (id, email, ...)
tenants (id, name, ...)
user_tenants (user_id, tenant_id, role)   <-- the join table
posts (id, tenant_id, author_id, body)
billing (id, tenant_id, plan, ...)
```

Every shared resource carries `tenant_id`. Every query filters by membership. RLS enforces at the DB. Middleware enforces the role on the route.

For data isolation requirements above shared schema, escalate to:

- **Schema-per-tenant**: separate Postgres schema per tenant. Operationally heavier; helps with strict isolation requirements.
- **DB-per-tenant**: separate database. For very large or compliance-bound customers.
- These are `db-worker-bee` decisions; auth-worker-bee flags the requirement.

## Common pitfalls

- **Middleware-only enforcement.** A sibling internal endpoint forgets to register middleware → cross-tenant leak.
- **Data-layer-only enforcement.** Middleware-less routes leak via unauthenticated 404 vs 403 timing.
- **Storing role on the JWT, never refreshing.** A demoted admin keeps admin until token expiry. Either short-lived JWTs + refresh, or session DB lookups, or revocation list.
- **Using `email` as the tenant key.** Emails change. Use stable UUIDs.
- **Missing the negation case in policies**: "users can read posts" without "users can NOT read posts in other tenants" lets RLS evaluate `true` first.
- **Granting `service_role` / superuser tokens to the application runtime**: defeats RLS. Use a constrained role.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- The role / permission catalog (which roles have which permissions).
- The two-layer enforcement implementation (middleware AND data layer).
- The RLS policies (handed to `db-worker-bee` first).
- The multi-tenant pattern (shared / schema-per / DB-per).
- The role-revocation latency (how fast a demoted user loses access).
- Cross-tenant test coverage (does the test suite include the "user A cannot read tenant B" assertion?).
