# Organization Membership API reference

- URL: https://workos.com/docs/reference/authkit/organization-membership
- Fetched: 2026-08-14
- Source type: Official API reference (workos.com/docs/reference)
- Component: User Management API / Organizations

## Content

An organization membership is a top-level resource representing a user's relationship with an organization. A user may be a member of zero, one, or many organizations.

### Create an organization membership

`POST /user_management/organization_memberships`

```js
import { WorkOS } from '@workos-inc/node';
const workos = new WorkOS('sk_example_123456789');

const organizationMembership = await workos.userManagement.createOrganizationMembership({
  organizationId: 'org_01E4ZCR3C56J083X43JQXF3JK5',
  userId: 'user_01E4ZCR3C5A4QZ2Z2JQXGKZJ9E',
  roleSlug: 'admin',
});
```

Request fields: `user_id` (required), `organization_id` (required), `role_slug` (optional, defaults to `member` or the explicit default role, mutually exclusive with `role_slugs`), `role_slugs` (optional array, mutually exclusive with `role_slug`, limited to one role unless Multiple Roles is enabled).

Calling create with an org+user pair that matches an existing `inactive` membership **activates** that membership with the specified role(s), rather than erroring.

### Object shape

```json
{
  "object": "organization_membership",
  "id": "om_01HXYZ123456789ABCDEFGHIJ",
  "user_id": "user_01E4ZCR3C5A4QZ2Z2JQXGKZJ9E",
  "organization_id": "org_01E4ZCR3C56J083X43JQXF3JK5",
  "status": "active",
  "directory_managed": false,
  "organization_name": "Acme Corp",
  "custom_attributes": { "department": "Engineering", "title": "Developer Experience Engineer" },
  "created_at": "2026-01-15T12:00:00.000Z",
  "updated_at": "2026-01-15T12:00:00.000Z",
  "role": { "slug": "admin" },
  "roles": [{ "slug": "admin" }],
  "user": { "object": "user", "id": "...", "email": "...", "...": "..." }
}
```

Field notes: `customAttributes` is an object containing IdP-sourced attributes from a linked Directory User or SSO Profile (Directory User attributes take precedence when both are linked). `directoryManaged` indicates whether the membership is managed by a directory sync connection.

### Deactivate

`PUT /user_management/organization_memberships/{id}/deactivate` - sets status to `inactive`, revokes all active sessions, emits `organization_membership.updated`. No-op on an already-`inactive` membership; errors on `pending` (delete instead).

```js
const organizationMembership = await workos.userManagement.deactivateOrganizationMembership(
  'om_01E4ZCR3C56J083X43JQXF3JK5',
);
```

### Reactivate

Sets status back to `active`, retains the pre-deactivation role, emits `organization_membership.updated`. No-op if already `active`. Errors on `pending` (use invitation acceptance instead).

### List / Get / Update / List groups

`GET /user_management/organization_memberships` - requires at least one of `user_id` or `organization_id`. By default only `active` memberships are returned; use `statuses` to include others.

`PUT /user_management/organization_memberships/{id}` - update `role_slug` or `role_slugs`.

`GET /user_management/organization_memberships/{omId}/groups` - list IdP-sourced groups for the membership.

### Related: Roles and Custom Roles API

`GET/POST/PATCH/DELETE /authorization/organizations/{organizationId}/roles[/{slug}]` - manage per-organization custom roles. Slug must be unique within the org, must begin with `org-`, lowercase letters/numbers/hyphens/underscores only. New roles are placed at the bottom of the organization's priority order. Listing roles for an org returns both environment roles and custom roles, in priority order.

Role object fields: `id`, `name`, `slug`, `description`, `permissions` (string[]), `type` (`"EnvironmentRole"` | `"OrganizationRole"`), `resource_type_slug`, `created_at`, `updated_at`.

### Related: FGA-style resource permission checks (Authorization API)

`POST /authorization/organization_memberships/{organization_membership_id}/check` - check whether a membership has a `permission_slug` on a specific `resource_id` (or `resource_external_id` + `resource_type_slug`). Considers direct role assignments, inherited permissions from parent resources, and organization-scoped roles. For org-wide permissions, WorkOS recommends checking the JWT directly instead of an API call; use this endpoint only for resource-specific permission checks.

Related listing endpoints: list effective permissions for a membership on a resource; list memberships that have a given permission on a resource (`assignment=direct|indirect` filter); list resources a membership can access under a parent resource.
