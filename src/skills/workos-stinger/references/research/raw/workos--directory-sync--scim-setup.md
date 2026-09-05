# Directory Sync / SCIM setup and provider landscape

- URL: https://workos.com/docs/integrations/scim ; https://workos.com/guide/the-developers-guide-to-scim
- Fetched: 2026-08-14
- Source type: Official docs + official WorkOS guide
- Component: Directory Sync / SCIM

## Content

### What SCIM is

SCIM (System for Cross-domain Identity Management) is the dominant open protocol for Directory Sync: a central source of truth for a company's identity data that talks to cloud apps over REST. Behind the scenes it's User and Group JSON objects with standard metadata (IDs, timestamps) plus custom fields, exposed via REST endpoints. SCIM has two major, **not fully compatible**, versions - 1.1 and 2.0 - which is a common first hurdle for anyone building it from scratch. Non-SCIM directory sources also exist and would need custom connectors if built in-house: Azure Active Directory, GSuite Directory, LDAP, Workday.

### Setting up a SCIM v2.0 connection manually in WorkOS

1. WorkOS Dashboard > pick the organization.
2. Organization page > **Directory Sync** section > "Configure manually".
3. Select **Custom SCIM v2.0** as the directory type, name the connection, "Create Directory".
4. WorkOS displays an **Endpoint** (the URL the org's SCIM server sends requests to) immediately on directory creation.
5. Generate a **Bearer Token** from the "Bearer Tokens" card - shown once at creation, copy before closing the dialog.
6. Hand the Endpoint URL and Bearer Token to the organization's IT team to plug into their SCIM server / IdP admin dashboard.
7. Once configured on their end, user/group assignment changes flow to the WorkOS Dashboard, and from there into the app via Events API or webhooks.

### WorkOS's value proposition over building Directory Sync in-house

- Unified SCIM integration across a dozen-plus IdPs (Microsoft Entra, Okta, Workday, any SCIM-compliant directory) without per-provider custom connectors.
- Events-based processing: even though webhooks are supported, the Events API processes every SCIM request in order and in real time, avoiding missed provisioning requests.
- Support for custom attributes beyond the basic profile (employee number, department, cost center) per organization.
- Admin Portal for guided customer IT-team onboarding, reducing back-and-forth.

### When a B2B app needs SSO vs. Directory Sync vs. both

- **SSO only** covers authentication (how users log in) - appropriate when the app just needs frictionless login via the customer's IdP.
- **Directory Sync (SCIM) only** covers user lifecycle (automated provisioning/deprovisioning of accounts and group membership) independent of how the user authenticates.
- Enterprise B2B apps commonly need **both**: SSO for login, SCIM so that when IT removes an employee from the company directory, that employee's access is automatically revoked in the app without a manual admin action. Directory-managed org memberships propagate role changes via `directoryManaged: true` on the organization membership object.
