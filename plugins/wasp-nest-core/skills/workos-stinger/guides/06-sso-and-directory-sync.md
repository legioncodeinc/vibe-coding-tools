# 06. SSO (SAML/OIDC) and Directory Sync (SCIM)

## When a B2B app actually needs these

- **SSO alone** solves login - a customer's employees authenticate through their company IdP instead of a WorkOS/app-managed password.
- **Directory Sync (SCIM) alone** solves lifecycle - user and group changes in the customer's IdP automatically create/update/deprovision accounts in your app, independent of how the user signs in.
- Most enterprise-tier B2B apps eventually need **both**, so that removing an employee from the company directory automatically revokes their app access without your team doing anything manual [raw/workos--directory-sync--scim-setup.md].

This is also where the pricing boundary lives: SAML SSO and SCIM Directory Sync connections are the concrete cost driver in production (per-connection charges), not raw AuthKit user count [raw/workos--pricing--authkit-pricing.md]. If you're deciding what to gate behind an "Enterprise" plan, this is the natural line.

## Connections are configured at the organization level

Enabling a connection for an organization enables it for every member of that org - this is how you force everyone on `acme.com` through Acme's Okta tenant instead of password auth [raw/workos--sso--overview-and-connections.md].

## Initiating SSO - three mutually exclusive selectors

| Selector | Use for |
| --- | --- |
| `organization` | Preferred for SAML/OIDC - pass the WorkOS org ID |
| `connection` | Alternative for SAML/OIDC when you already have the specific connection ID |
| `provider` | Environment-level OAuth only (`GoogleOAuth`, `MicrosoftOAuth`, `GitHubOAuth`, `AppleOAuth`) |

Exactly one must be provided on `getAuthorizationUrl` [raw/workos--sso--overview-and-connections.md]. Every staging environment ships a built-in **Test Organization** (`org_test_idp`) with a mock IdP, so you can validate the SSO flow before onboarding a real enterprise customer [raw/workos--sso--overview-and-connections.md]. With AuthKit, you don't usually call this directly - `getAuthorizationUrl({ provider: 'authkit', organizationId })` lets AuthKit auto-detect and route to the right connection for you [raw/workos--sso--overview-and-connections.md].

## Setting up a SAML connection (Okta shown, generalizes to other IdPs)

1. WorkOS Dashboard > Organizations > pick/create the org > SSO section > "Configure manually" > pick the IdP > Create Connection.
2. Copy the **SP Entity ID** and **ACS URL** WorkOS generates.
3. In the customer's IdP admin console, create a SAML app; set "Single Sign-On URL" = ACS URL, "Audience URI (SP Entity ID)" = SP Entity ID.
4. Map attribute statements (`id -> user.id`, `email -> user.email`).
5. Assign users/groups on the IdP side.
6. Copy the IdP's metadata URL back into the WorkOS connection config and save - the connection goes live.

[raw/workos--sso--overview-and-connections.md]

## Setting up Directory Sync (SCIM) for the same organization

1. Same organization page > Directory Sync section > "Configure manually" > pick **Custom SCIM v2.0** (or a named provider) > Create Directory.
2. WorkOS shows an **Endpoint URL** immediately; generate a **Bearer Token** (shown once - copy before closing the dialog).
3. Hand both values to the customer's IT team to plug into their SCIM server.
4. User/group changes then flow: customer IdP -> WorkOS -> your app, via the Events API or webhooks.

[raw/workos--directory-sync--scim-setup.md]

SCIM has two incompatible major versions (1.1 and 2.0) - a first hurdle if you were ever tempted to build this in-house instead of using WorkOS's abstraction over a dozen-plus providers (Entra, Okta, Workday, any SCIM-compliant directory) [raw/workos--directory-sync--scim-setup.md].

## How this interacts with roles (see guide 05)

IdP group role mapping on either an SSO connection or a Directory Sync connection **always overrides** roles you set manually. SSO-sourced roles refresh on every authentication; Directory-sourced roles refresh on every directory sync event [raw/workos--rbac--configuration-and-integration.md]. Design your admin UI to reflect this rather than letting an admin's manual override get silently clobbered.

## Consuming directory/connection change events

`dsync.user.created` / `.updated` / `.deleted`, `dsync.group.*`, `connection.activated` / `.deactivated`, `organization_membership.*` - via the Events API (ordered, replayable, pull-based - WorkOS's own preference for sync-critical data) or webhooks (real-time, push, unordered) [raw/workos--sso--overview-and-connections.md, raw/workos--events--webhooks-guide.md]. See guide 07 for the webhook implementation.

## Next

`07-webhooks.md` covers verifying and handling the events referenced above.
