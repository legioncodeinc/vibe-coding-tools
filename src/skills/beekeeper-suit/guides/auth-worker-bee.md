# auth-worker-bee

## Domain
Owns the implementation half of authentication for this repo's stack: provider selection among Clerk, Better Auth, Auth.js, Supabase Auth, WorkOS, Stack Auth, Kinde, and Stytch; OAuth flow wiring with deep Google Auth Platform expertise (including the October 2025 unused-client-deletion policy and the GIS migration); session-cookie hardening; MFA/passkey enrollment; RBAC enforcement across two layers (middleware and data layer); and provider migrations. It is opinionated about least-privilege scopes and secure-by-default cookies, and it writes the auth spec, not the sign-in JSX.

## Paired Stinger
[auth-stinger](../../auth-stinger) - the provider decision tree, Google OAuth and verification guides, session-storage hardening, MFA/passkey strategy, and the RBAC two-layer enforcement model.

## Trigger phrases
- "set up auth for this app"
- "which auth provider should we pick, Clerk or Better Auth or Supabase"
- "wire up Google sign-in"
- "our Google OAuth client is about to get deleted"
- "set up MFA and passkeys"
- "design RBAC for a multi-tenant app"
- "migrate from NextAuth to Better Auth"
- "review our session cookie config"

## Do NOT route when
- The request is specifically about WorkOS: AuthKit, sealed sessions, WorkOS User Management API, WorkOS SSO/SCIM, or migrating onto WorkOS; that is workos-worker-bee. This Bee owns the "which provider" decision; once the decision lands on WorkOS, or the task is already scoped to WorkOS, hand off to workos-worker-bee for implementation depth. Do not preempt a still-open provider-selection question with WorkOS-flavored advice.
- The request is a security audit of an auth implementation already built; that is security-worker-bee.
- The request is the `<SignIn />` / `<UserMenu />` JSX itself; that is react-worker-bee.
- The request is the `users` / `sessions` / `accounts` / `roles` table schema or RLS policies; that is db-worker-bee.
- The request is the auth PRD; that is library-worker-bee.
- The request is a self-hosted IdP (Keycloak, Ory); out of scope; recommend a hosted IdP via workos-worker-bee. No Bee owns self-hosted Keycloak or Ory.

## Inputs the Bee needs
- B2C vs B2B classification, hosted UI vs custom, and scope footprint (sign-in only vs Workspace data access).
- The runtime stack from `package.json` / `.env.example`: framework, existing auth libs, existing provider, existing cookie config.
- Whether Google OAuth is in play, since that triggers the scope-justification and unused-client-deletion checks.

## Outputs
- A provider recommendation ("use X because Y" with one named alternative) via the decision tree.
- Hardened session-cookie config, an RBAC policy table with two-layer enforcement, and an MFA/passkey strategy spec.
- A handoff package: schema needs to db-worker-bee, an audit-report template to security-worker-bee, UI needs to react-worker-bee.

## Commonly sequenced with
- workos-worker-bee: takes over implementation depth once the provider decision lands on WorkOS.
- security-worker-bee: audits the implementation this Bee produces, using its audit-report template.
- db-worker-bee: builds the `users`/`sessions`/`roles` schema this Bee's RBAC and session design depend on.
- react-worker-bee: builds the sign-in UI against this Bee's auth spec.
