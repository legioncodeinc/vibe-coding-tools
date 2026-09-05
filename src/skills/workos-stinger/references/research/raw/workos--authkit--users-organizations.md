# Users and Organizations - AuthKit

- URL: https://workos.com/docs/authkit/users-organizations
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: AuthKit / User Management

## Content

### Users

The User object represents an identity that has access to or owns artifacts in the application. What uniquely identifies a user is their **email address**, since access to that inbox ultimately grants access to all accounts based on that address.

- A user may have multiple authentication methods (Email + Password, OAuth, etc.) and can sign in with any enabled method.
- Because a user is uniquely identified by email, there are no duplicate-email users; WorkOS handles identity linking automatically.
- All users go through initial email verification by default, across every authentication method including OAuth and SSO.
- If a user's email domain matches a verified organization domain when signing in with SSO, they are automatically considered verified and skip the email verification flow (domain verification).

### Organizations

Organizations represent both a collection of users an IT contact controls and a workspace within which members collaborate. No limit on number of organizations. Two supported B2B models, both supported by AuthKit simultaneously:

- **Multiple Workspaces** - self-serve app (e.g. Figma-style) where a user can belong to many orgs.
- **Single Workspace** - app with no cross-org collaboration; each user belongs to exactly one org.

### Organization memberships

An organization contains users as members. Access to org-owned resources is tied to org membership, not individual user ownership - so when a user leaves an org, org-owned data stays with the org.

Membership statuses (three-state lifecycle, for soft-delete use cases):

| Status | Meaning |
| --- | --- |
| `pending` | User has been invited to the organization |
| `active` | User was added directly as a member, or accepted an invitation |
| `inactive` | Membership has been deactivated |

- **Deactivate** an `active` membership -> sets `inactive`, revokes all active sessions. `pending` memberships cannot be deactivated (delete instead).
- **Reactivate** an `inactive` membership -> sets `active`, retains prior role. `pending` memberships cannot be reactivated (use invitation acceptance flow instead).
- Hard-delete model: apps with no need to "remember" a former member can just delete the membership (and optionally the User) outright.

**When to deactivate vs. delete:** deactivation is preferred when a member's data (messages, documents) persists after they leave and a "former members" UI is useful; hard deletion is preferred when the app has no need to remember departed members.

### Automated membership creation

- **JIT (Just-in-Time) provisioning**: users are automatically added to an org if their email matches one of the org's verified domains.
- **Invitations**: users can be invited to an org regardless of email domain (useful for contractors).

### Creating organizations for new users (no-org flow)

1. Check the access token for an `org_id` claim after AuthKit redirects post sign-up/sign-in.
2. If absent, present an org-creation form.
3. Create the organization via the Create Organization API.
4. Add the user as a member via the Create Organization Membership API.
5. Refresh the token (authenticate-with-refresh-token, passing the new org ID) to get an access token that includes the organization.

### Custom roles

In addition to environment-level roles, organizations can define their own custom roles assignable only within that org's context (see RBAC custom roles).
