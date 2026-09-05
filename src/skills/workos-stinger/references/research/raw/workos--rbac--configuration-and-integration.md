# RBAC configuration and integration (roles, permissions, single vs multiple roles, groups)

- URL: https://workos.com/docs/rbac/configuration ; https://workos.com/docs/rbac/integration ; https://workos.com/docs/rbac/custom-roles ; https://workos.com/docs/reference/roles
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: RBAC / Authorization

## Content

### Core model

A **role** is a logical grouping of permissions, identified by a unique, immutable slug, assigned to users via organization memberships. Role assignment can be sourced manually or from IdP group mappings (SSO or Directory Sync). A **permission** grants access to a resource/action and is referenced by a unique, immutable slug; a permission can be assigned to any number of roles.

Role and permission configuration applies to all integrations (AuthKit, standalone SSO, standalone Directory Sync).

### When to use roles alone vs. roles + permissions

- **Roles alone** are sufficient for coarse-grained access control with minimal overlap between roles.
- **Roles + permissions** are recommended when access rights change frequently, there's significant overlap between roles with slight variations, or you want to avoid application code changes when access rights shift - the app checks permission slugs, and admins reassign which roles carry which permissions in the dashboard without a deploy.

### Environment roles vs. custom (organization) roles

| Type | Scope | Slug uniqueness | Notes |
| --- | --- | --- | --- |
| Environment role | All organizations in the environment | Unique within environment | Seeded with a `member` default role that cannot be deleted (can be replaced as default) |
| Custom role | A single organization | Unique within organization, slug auto-prefixed `org-` | Organizations have none by default and inherit environment roles until the first custom role is created; once created, the org gets its own independent default role and priority order |

Listing roles for an org returns both environment roles and custom roles together, in priority order.

### Default role

Role configuration occurs at the environment level. Every org membership requires at least one role by default (single-role mode) and is automatically assigned the default role (`member` unless changed) when added to an org.

### Multiple roles

Disabled by default; toggled per-environment in Authorization > Configuration > Multiple Roles. When enabled, an org membership, directory user, or SSO profile can carry more than one role simultaneously.

Two ways multiple roles get assigned:
- **Group-based**: if a user belongs to multiple mapped groups, they receive all mapped roles (applies to directory users, SSO profiles, and org memberships via JIT provisioning).
- **Manual**: assign multiple roles directly to an org membership via dashboard or API (`role_slugs` array).

Recommendation: start with single-role for simplicity/predictability; adopt multiple roles only once overlapping permission sets become common (avoids needing combinatorial roles like `designer-engineer`).

### Priority order

Used to resolve conflicts when a user belongs to multiple IdP-mapped groups in single-role mode: the highest-priority role wins. Also determines which role survives when migrating an environment from multiple-roles to single-role.

### Role deletion behavior

- Single-role (default): affected memberships/profiles/directory users are reassigned to the environment/org default role.
- Multiple-roles: the deleted role is removed from each membership that had it; other roles on that membership remain.
- Deletion is asynchronous.
- To migrate the default role: set the new default first, then delete the old one - affected users are reassigned automatically.

### Permission naming convention (WorkOS recommendation)

Define a common scheme, e.g. `resource:action` such as `users:view`. Permitted delimiters: `- . : _ *`. Keep slugs concise: permissions assigned to roles are included in session cookie JWT claims, which are capped at 4KB in many modern browsers - a large permission set can blow the cookie size budget.

### Groups and group role assignment

Groups let you assign a role once at the group level instead of per-membership; every group member inherits the role, and membership changes propagate automatically. Group-sourced roles are treated identically to directly-assigned roles: they appear in the session token and count toward effective permissions. In multiple-roles mode, group roles combine additively with directly-assigned roles; in single-role mode, the highest-priority role across all sources wins.

### Integrating with AuthKit

- Roles live on the **organization membership**. Every membership is auto-assigned the default role on creation.
- Modify a membership's role(s) via the Organization Memberships API, WorkOS Dashboard, or IdP role assignment.
- **IdP role assignment always takes precedence** over roles assigned via API or dashboard.
  - SSO group role assignment: the membership's role updates **on every authentication**.
  - Directory group role assignment (via directory provisioning): the membership's role updates **each time a directory event is received** for that user.
- Read a user's role(s) either from the organization membership object or directly from the AuthKit session access token (JWT claims) - the JWT read avoids an extra API call and is the recommended pattern for per-request authorization checks.

### Integrating with standalone Directory Sync / SSO

- Directory users and SSO profiles always carry role slugs (default role if none explicitly mapped).
- Roles granted to directory users update in real time on group-membership webhook/event delivery.
- Roles granted to SSO profiles update at each authentication.

### Role object fields (Authorization API)

`id`, `name`, `slug` (immutable), `description`, `permissions` (string[]), `type` (`"EnvironmentRole"` | `"OrganizationRole"`), `resource_type_slug`, `created_at`, `updated_at`.

### Custom Roles API

`POST/GET/PATCH/DELETE /authorization/organizations/{organizationId}/roles[/{slug}]`, plus permission-assignment sub-endpoints:
- `POST .../roles/{slug}/permissions` - add a single permission (no-op if already assigned).
- `PUT .../roles/{slug}/permissions` - replace all permissions on the role.
- `DELETE .../roles/{slug}/permissions/{permissionSlug}` - remove one permission.
Deleting a custom role requires it have no active assignments or IdP group role mappings.
