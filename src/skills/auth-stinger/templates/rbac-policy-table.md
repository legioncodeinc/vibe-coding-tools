# RBAC Policy Table

Fill for the project. Cite from `guides/09-rbac.md`.

**Project:** _____
**Date:** _____

## Roles

| Role | Description | Default for |
|---|---|---|
| `owner` | Full control, billing, delete tenant | First user in a tenant |
| `admin` | Manage members, settings, content | Promoted by owner |
| `editor` | Create / edit / delete tenant content | Invited member |
| `viewer` | Read-only access | Invited member or guest |
| _____ | _____ | _____ |

## Permissions

Permission shape: `<resource>:<action>` (e.g., `posts:write`, `billing:read`).

| Permission | Resource | Action | Description |
|---|---|---|---|
| `tenant:delete` | tenant | delete | Delete the tenant |
| `tenant:manage` | tenant | update | Change tenant settings |
| `members:invite` | members | create | Invite a new member |
| `members:remove` | members | delete | Remove a member |
| `billing:read` | billing | read | View invoices, plan |
| `billing:write` | billing | write | Change plan, payment method |
| `posts:read` | posts | read | View posts in this tenant |
| `posts:write` | posts | create / update / delete | Author and edit posts |
| _____ | _____ | _____ | _____ |

## Role → permission grid

|  | owner | admin | editor | viewer |
|---|---|---|---|---|
| `tenant:delete` | yes | no | no | no |
| `tenant:manage` | yes | yes | no | no |
| `members:invite` | yes | yes | no | no |
| `members:remove` | yes | yes | no | no |
| `billing:read` | yes | yes | no | no |
| `billing:write` | yes | no | no | no |
| `posts:read` | yes | yes | yes | yes |
| `posts:write` | yes | yes | yes | no |
| _____ | _____ | _____ | _____ | _____ |

## Two-layer enforcement plan

For every row above, name where it's enforced:

| Permission | Middleware check | Data-layer check (RLS or query filter) |
|---|---|---|
| `tenant:delete` | `requireRole('owner')` on `DELETE /tenants/:id` | RLS: `auth.uid() = tenants.owner_id` |
| `posts:read` | `requireSession()` | RLS: `tenant_id IN (user's tenants)` |
| `posts:write` | `requireRole('owner','admin','editor')` | RLS: same + role check on insert / update |
| _____ | _____ | _____ |

## Multi-tenancy strategy

- [ ] Shared schema, `tenant_id` column on every table
- [ ] Schema-per-tenant
- [ ] Database-per-tenant

If shared schema: confirm RLS on every shared table. Hand to `db-worker-bee`.

## Cross-tenant test plan

Test cases to add:

- [ ] User A in tenant X cannot read posts from tenant Y (HTTP 403 or empty result, not 200 with data)
- [ ] User A in tenant X cannot mutate posts in tenant Y
- [ ] Demoting an admin removes admin permissions within `_____` seconds
- [ ] Removing a member from a tenant immediately invalidates their access

## Audit handoff

Hand the filled table to `security-worker-bee` along with the migration that implements the RLS policies (which `db-worker-bee` writes).
