# 04. User management and organizations

## Users

A User is uniquely identified by **email address** - a user can have several authentication methods attached (password, OAuth, etc.) but WorkOS auto-links them by email so you never get duplicate-email users [raw/workos--authkit--users-organizations.md]. All users go through email verification by default, across every auth method including OAuth and SSO, unless the address is already covered by organization domain verification [raw/workos--authkit--users-organizations.md].

## Organizations and the B2B model choice

WorkOS Organizations support both common B2B shapes at once, so you don't have to pick one at day one:

- **Multiple workspaces per user** (Figma-style) - a user can belong to and switch between many orgs.
- **Single workspace per user** - each user belongs to exactly one org.

[raw/workos--authkit--users-organizations.md]

Org-owned resources should be scoped to the organization, not the individual user, so that when a member leaves, org-owned data stays with the org rather than disappearing [raw/workos--authkit--users-organizations.md].

## Organization membership lifecycle

| Status | Meaning | Deactivate? | Reactivate? |
| --- | --- | --- | --- |
| `pending` | Invited, not yet accepted | No - delete instead | No - use invitation acceptance |
| `active` | Direct add or accepted invite | Yes -> `inactive`, revokes active sessions | - |
| `inactive` | Deactivated | - | Yes -> `active`, restores prior role |

[raw/workos--user-management--organization-membership-api.md]

Choose **deactivation** when member-authored data (messages, documents) should persist and a "former members" list is useful in your UI. Choose **hard delete** when the app has no reason to remember a departed member [raw/workos--authkit--users-organizations.md].

## Getting users into an organization

Two automated paths, plus a manual one:

1. **JIT (Just-in-Time) provisioning** - a user's email domain matches one of the org's verified domains, so they're auto-added on sign-in [raw/workos--authkit--users-organizations.md].
2. **Invitations** - works regardless of email domain (contractors, mixed-domain teams). `POST /user_management/invitations` with `email`, optional `organization_id`, `role_slug`, `expires_in_days` (1-30, default 7) [raw/workos--user-management--invitation-api.md]. Prefer accepting via `authenticateWithCode` (which consumes an invitation token and signs the user in as one step) over the standalone accept-invitation endpoint, unless the app specifically needs a custom invitation-only flow or the user is accepting a second org's invite while already signed in [raw/workos--user-management--invitation-api.md].
3. **Manual API call** - `createOrganizationMembership({ organizationId, userId, roleSlug })` [raw/workos--user-management--organization-membership-api.md].

## New-user-with-no-org flow (for apps where everything is org-scoped)

1. Check the access token for an `org_id` claim after AuthKit redirects post sign-up/sign-in.
2. If absent, show an organization-creation form.
3. `POST /organizations` to create it.
4. `createOrganizationMembership` to add the new user as a member.
5. Call the refresh-token endpoint with the new org ID so the resulting access token now carries `org_id`.

[raw/workos--authkit--users-organizations.md]

## Reading membership data

Either read the Organization Membership object via the API, or read `role`/`organizationId`/`permissions` straight off the AuthKit session JWT (what `auth.role` / `auth.organizationId` / `auth.permissions` in `references/hooks-server-session-pattern.md` expose) - the JWT read avoids an extra API round-trip for per-request checks [raw/workos--rbac--configuration-and-integration.md].

## Next

`05-rbac-roles-permissions.md` covers how roles and permissions actually attach to a membership and how precedence resolves when both IdP mapping and manual assignment are in play.
