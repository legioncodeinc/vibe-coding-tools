# RBAC model tables

Grounded in [raw/workos--rbac--configuration-and-integration.md], [raw/workos--user-management--organization-membership-api.md].

## Role scope

| Role type | Configured at | Slug uniqueness | Default behavior |
| --- | --- | --- | --- |
| Environment role | Environment (applies to every org in it) | Unique within the environment | Seeded with a `member` role that is the default and cannot be deleted; any role can be promoted to default instead |
| Custom (organization) role | A single organization | Unique within the organization; auto-prefixed `org-` | Organization has none until the first is created; creating one gives that org its own independent default role and priority order, separate from the environment |

## Single-role vs. multiple-roles mode

| Setting | Scope | Effect |
| --- | --- | --- |
| Multiple roles: off (default) | Environment-level toggle | Every organization membership / SSO profile / directory user carries exactly one role; conflicts resolved by priority order |
| Multiple roles: on | Environment-level toggle | Roles can stack; group-sourced roles combine additively with directly-assigned roles |

## Role assignment sources and precedence

| Source | Applies to | Update trigger | Precedence |
| --- | --- | --- | --- |
| IdP group role mapping (SSO) | SSO profiles, and org memberships via JIT | Every authentication | **Highest** - always overrides dashboard/API assignment |
| IdP group role mapping (Directory Sync) | Directory users, and org memberships via directory provisioning | Every directory event received | **Highest** - always overrides dashboard/API assignment |
| Manual assignment (Dashboard or API) | Organization memberships | On write | Overridden by IdP mapping when both are present |
| Group role assignment (WorkOS Groups feature) | Any member of a WorkOS Group | On group membership change | Treated identically to a direct assignment once resolved |

## Permission model

| Concept | Detail |
| --- | --- |
| Naming convention | `resource:action` recommended, e.g. `users:view`. Permitted delimiters: `- . : _ *` |
| Size constraint | Permissions assigned to a role are embedded in the session JWT; keep slugs short - JWT-in-cookie is commonly capped around 4KB in browsers |
| Assignment | A permission can attach to any number of roles; roles can carry any number of permissions |
| Read path | From the AuthKit session JWT (`role`, `permissions` claims) for per-request checks, or from the Organization Membership API object for an out-of-band lookup |

## Resource-level (FGA-style) authorization

For access control finer than "org-wide role," a separate Authorization API layer exists:

| Endpoint | Purpose |
| --- | --- |
| `POST /authorization/organization_memberships/{id}/check` | Check whether a membership has `permission_slug` on a specific `resource_id` (direct + inherited + org-scoped roles all considered) |
| `GET .../resources/{resourceId}/permissions` | List effective permissions a membership has on a resource |
| `GET .../resources/{typeSlug}/{externalId}/organization_memberships` | "Who can access this resource?" - list memberships with a given permission on a resource |
| `GET .../organization_memberships/{id}/resources` | "What can this user access?" - list resources under a parent where the membership has a permission |

WorkOS's own guidance: for org-wide permission checks, read the JWT directly (no API call needed); reserve this endpoint family for resource-specific checks [raw/workos--user-management--organization-membership-api.md].

## Two-layer enforcement (Hive convention, not a WorkOS-sourced claim)

Consistent with the broader Hive auth convention documented in `auth-stinger`: enforce roles/permissions both in `hooks.server.ts` / route-level guards AND again at the data-access layer (e.g. a Postgres RLS policy or an explicit `organizationId` filter on every query). A JWT role check alone is a single point of failure if a route guard is ever skipped or a new route is added without one.
