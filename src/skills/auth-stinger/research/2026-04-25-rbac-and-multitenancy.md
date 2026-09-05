# RBAC + Multi-Tenancy

**Sources:**
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Top 10 2021 (A01: Broken Access Control)
- https://www.cerbos.dev (Cerbos), https://www.osohq.com (Oso), https://www.openpolicyagent.org (OPA), https://casbin.org (Casbin)
- https://supabase.com/docs/guides/database/postgres/row-level-security

**Retrieved:** 2026-04-25

## Summary

Authorization is consistently the most common production-impacting security failure (OWASP A01). The dominant fix pattern in 2026 is **two-layer enforcement**: middleware AND data layer (or RLS at the DB). Single-layer enforcement is a finding regardless of how careful the middleware is.

## Vocabulary

- **Role**: bundle of permissions.
- **Permission**: verb on a resource.
- **Tenant / org**: multi-customer boundary.
- **ABAC**: policy logic over attributes (region, clearance, ownership).
- **RLS**: Postgres row-level security; DB enforces.

## Two-layer enforcement (mandatory)

**Layer 1: middleware / edge.** Session check; role check at route level.

**Layer 2: data layer.** Query filters by tenant or owner. RLS at DB enforces it from below. Single-layer is a single point of failure.

Why both:

- Middleware can be bypassed (sibling internal call, misconfigured proxy, forgotten on a new route).
- Data-layer-only leaks side-channel (403 vs 404 timing).

## Multi-tenancy patterns

- **Shared schema, `tenant_id` column**: most common. RLS or query filter required.
- **Schema-per-tenant**: operational cost; helps with strict isolation.
- **Database-per-tenant**: for compliance-bound large customers.

## Policy library options

- **Cerbos**: declarative policies, gRPC service.
- **Oso**: embedded library, declarative.
- **OPA** (Open Policy Agent): general-purpose, Rego language.
- **Casbin**: ABAC / RBAC / ACL, multi-language.

For most apps, plain RBAC with two-layer enforcement is sufficient. Reach for a policy library when permissions vary per row, per attribute, or per customer-defined rule.

## Common failures

- Single-layer enforcement (middleware-only or data-layer-only).
- Stale role on JWT (user demoted, JWT still valid).
- Email-as-key (emails change).
- No cross-tenant negative test coverage.

## Relevance

- `guides/09-rbac.md`: full deep dive.
- `templates/rbac-policy-table.md`: fillable table.
- `guides/00-principles.md` Principle 3: two-layer enforcement.
