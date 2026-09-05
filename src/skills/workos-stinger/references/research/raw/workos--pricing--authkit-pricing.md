# AuthKit pricing, free tier, MAU definition, what triggers charges

- URL: https://workos.com/pricing ; https://workos.com/user-management ; https://workos.com/docs/authkit/environments ; https://workos.com/docs/dashboard/billing ; https://workos.com/changelog/introducing-authkit-and-user-management
- Fetched: 2026-08-14
- Source type: Official pricing page + official docs + official changelog
- Component: Pricing / architecture constraints

## Content

### AuthKit (User Management) pricing tiers

| Tier | Price |
| --- | --- |
| First 1,000,000 MAUs | Free |
| Each additional 1,000,000 MAUs | $2,500/mo |

**MAU (Monthly Active User)** definition: a user who performs any action - sign up, sign in, or profile update - within a calendar month.

### What is free vs. what triggers billing

- **Staging environments are entirely free for testing** - no charges of any kind, regardless of usage or which features are exercised.
- Only **production** environments are billed, and only once billing information has been added to unlock production.
- Within production: **AuthKit itself (username/password, social login, sessions, user management) is free up to 1M MAUs** - an app using only those features incurs zero charges below that threshold, though billing info must still be on file to unlock the production environment at all.
- **OAuth (social login) connections are free** in all environments, including production.
- **Enterprise connections incur per-connection charges in production**: SAML-based Single Sign-On and SCIM-based Directory Sync connections. This is the concrete architectural trigger for cost: adding a B2B customer's SAML/SCIM connection is what starts metering, not raw AuthKit user count.
- A **Connection**, for billing purposes, represents the relationship between WorkOS and a group of end users authenticating via one identity provider (e.g. one Okta tenant, one Entra tenant).

### Billing visibility

Dashboard > Billing shows current plan, billing period, and a line-item usage breakdown for the current period (the same line items that appear on the next invoice), including: Monthly Active Users (AuthKit), Monthly Tracked Agents (agent authentication, a separate WorkOS product), and connection counts for SSO/Directory Sync. Tiered line items can be expanded to see per-tier quantities; an "Estimated total for this month" row projects the next invoice from usage so far.

### Architectural implication for a SvelteKit/Vercel B2B app

Because SAML/SCIM connections - not AuthKit MAUs - are the primary production cost driver below 1M users, a product decision to gate SSO/SCIM behind an "Enterprise" pricing tier (rather than offering it to every customer) maps directly onto WorkOS's own billing boundary, and is the natural place to align in-app plan gating with WorkOS cost exposure.
