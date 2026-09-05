# SSO overview: connections, authorization URL parameters, IdP-initiated flow, Okta SAML+SCIM walkthrough

- URL: https://workos.com/docs/sso ; https://workos.com/docs/integrations/okta-saml ; https://workos.com/blog/adding-sso-to-your-app ; https://workos.com/blog/okta-saml-sso-scim-provisioning-nodejs ; https://workos.com/docs/reference/authkit/authentication/get-authorization-url
- Fetched: 2026-08-14
- Source type: Official docs + official WorkOS blog
- Component: SSO / Enterprise connections

## Content

WorkOS SSO is compatible with any IdP supporting SAML or OIDC, modeled to meet the OAuth 2.0 framework spec, abstracting away the underlying handshake differences between IdPs.

A **Connection** is the method by which a group of users (typically within a single organization) signs in to the application. SSO and SCIM connections are configured **at the organization level** in the WorkOS Dashboard - enabling a connection for an org enables it for all members of that org, and lets you force users on a given email domain to a specific connection.

### Three ways to select which connection/IdP to use when calling `getAuthorizationUrl`

| Selector | When to use | Notes |
| --- | --- | --- |
| `organization` (organization ID) | Preferred parameter for SAML and OIDC connections | Use the org's WorkOS ID; the Test Organization (`org_test_idp`) ships in every staging environment with a mock IdP for integration testing without a real IdP |
| `connection` (connection ID) | Alternative for SAML/OIDC when you already know the specific connection | |
| `provider` | OAuth connections configured at the environment level | Supported values: `GoogleOAuth`, `MicrosoftOAuth`, `GitHubOAuth`, `AppleOAuth` |

These selectors are mutually exclusive on the `getAuthorizationUrl` / `GET /user_management/authorize` call - exactly one connection selector must be provided (or `provider: 'authkit'` to let AuthKit auto-detect the auth method).

```ts
const authorizationUrl = workos.sso.getAuthorizationUrl({
  organization: 'org_test_idp', // Test Organization, staging only
  redirectUri: 'https://dashboard.my-app.com',
  clientId,
});
res.redirect(authorizationUrl);
```

### Callback / profile exchange (standalone SSO, not AuthKit)

```ts
const { profile } = await workos.sso.getProfileAndToken({ code, clientId });

// Validate that this profile belongs to the organization used for authentication
if (profile.organizationId !== organization) {
  return res.status(401).send({ message: 'Unauthorized' });
}
```

### Redirect URI configuration

Configured per-application in Dashboard > Applications > Redirects tab. Multi-tenant apps typically use a single redirect URI; single-tenant apps can register multiple and select which to use per-call.

### Identity-provider-initiated SSO

The default redirect URI is used for all IdP-initiated sessions by default (since the WorkOS client SDK is not invoked to start the flow in that case). A customer can instead specify a separate redirect URI for their IdP-initiated sessions via a `RelayState` parameter on their SAML side.

### `getAuthorizationUrl` / `GET /user_management/authorize` parameter reference (subset relevant to AuthKit + SSO)

| Param | Required | Notes |
| --- | --- | --- |
| `response_type` | Yes | Only valid value is `"code"` |
| `redirect_uri` | Yes | Must match a URI configured in the app's Redirects tab |
| `provider` | No | `"authkit"` \| `"AppleOAuth"` \| `"GoogleOAuth"` \| ... - use `"authkit"` to let AuthKit auto-detect Email+Password vs SSO |
| `connection_id` | No | Initiates SSO for a specific WorkOS connection |
| `organization_id` | No | Initiates SSO for a specific org; if combined with `provider: 'authkit'`, the org is auto-selected during the AuthKit flow |
| `state` | No | Round-tripped back verbatim on redirect; commonly used to encode originating URL for post-login redirect |
| `screen_hint` | No | `"sign-up"` \| `"sign-in"` - only applies to `provider: 'authkit'` |
| `login_hint` | No | Pre-fills the IdP's username/email field; supported for OAuth, AuthKit, OIDC, Okta, Entra ID, custom SAML |
| `max_age` | No | Max seconds since last active auth before forcing re-auth; `0` forces re-auth every time; AuthKit-only |

### Okta SAML connection setup (representative of the general SAML onboarding pattern)

1. WorkOS Dashboard > Organizations > pick/create org > SSO section > "Configure manually" > select IdP > Create Connection.
2. Copy the **SP Entity ID** and **ACS URL** from WorkOS's "Service Provider Details".
3. In the IdP admin console, create a SAML app, set "Single Sign-On URL" = ACS URL, "Audience URI (SP Entity ID)" = SP Entity ID from WorkOS.
4. Add attribute statements mapping `id -> user.id`, `email -> user.email`.
5. Assign users/groups to the IdP app.
6. Retrieve the IdP metadata URL from the IdP's SAML app settings.
7. Back in WorkOS Dashboard, "Edit Configuration" on the connection, paste the metadata URL, save - connection is now linked.

### Directory Sync (SCIM) alongside SSO for the same organization

Configured under the same org's "Directory Sync" section, "Configure manually," picking a directory type (e.g. Okta, or Custom SCIM v2.0). WorkOS surfaces an **Endpoint** and a **Bearer Token** to hand off to the customer's IT team so their SCIM server can push user/group data to WorkOS, which then syncs it into the app.

### Directory sync events (dsync.*)

| Event | Fires when |
| --- | --- |
| `dsync.activated` | A directory is activated |
| `dsync.deleted` | A directory is deleted (state attribute shows pre-deletion state) |
| `dsync.group.created` / `.deleted` / `.updated` | Directory group lifecycle |
| `dsync.group.user_added` / `.user_removed` | Group membership changes |
| `dsync.user.created` / `.updated` / `.deleted` | Directory user lifecycle |

These can be consumed via the **Events API** (polling, ordered, replayable) or via **webhooks** (real-time, at-least-once, no ordering guarantee - see webhooks raw file).
