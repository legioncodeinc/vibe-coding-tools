# workos-worker-bee

## Domain
Owns WorkOS specifically: AuthKit integration (hosted and headless), sealed sessions, JWT/JWKS verification, the User Management API (users, organizations, memberships, invitations), the WorkOS RBAC model, SSO (SAML/OIDC) and Directory Sync (SCIM), MFA/passkeys/Magic Auth support status, webhook signature verification and idempotent handling, the Node SDK, and migrating an existing user base from Supabase Auth or Clerk onto WorkOS. Once a task is scoped to WorkOS, this Bee owns the implementation depth; it does not decide whether WorkOS is the right provider in the first place.

## Paired Stinger
[workos-stinger](../../workos-stinger) - AuthKit mode selection, SvelteKit integration, sessions/JWT verification, user/org modeling, RBAC, SSO/SCIM, webhooks, migration, and the security checklist.

## Trigger phrases
- "set up WorkOS"
- "wire up AuthKit"
- "AuthKit in SvelteKit"
- "set up WorkOS SSO for this customer"
- "configure WorkOS SCIM"
- "verify WorkOS webhook signatures"
- "migrate our users from Supabase Auth to WorkOS"

## Do NOT route when
- The question is which auth provider to use in the first place (Clerk, Better Auth, Auth.js, Supabase Auth, WorkOS, Stack Auth, Kinde, Stytch): that provider-selection call belongs to auth-worker-bee; do not preempt it with WorkOS-flavored advice before the decision lands on WorkOS.
- The task is non-WorkOS provider work, Google OAuth verification mechanics, or cross-provider session/RBAC principles that apply regardless of vendor: route to auth-worker-bee.
- The ask is the security audit of the resulting implementation: route to security-worker-bee.
- The ask is the sign-in screen's JSX/markup or matching AuthKit branding to the app's design system: route to react-worker-bee or ux-ui-svelte-worker-bee.
- The ask is the `users`/`organizations` schema itself, or the auth PRD: route to db-worker-bee or library-worker-bee respectively.

## Inputs the Bee needs
- Whether the surface is AuthKit (hosted/headless), standalone SSO, standalone Directory Sync, webhooks, or a migration.
- The app's framework, confirmed as SvelteKit + Svelte 5 for full guide coverage, otherwise flag reduced coverage.
- Whether the customer scenario needs SSO, SCIM, or both, since they solve different problems (login vs. lifecycle).
- For a migration: the source provider (Supabase Auth or Clerk) and whether any users are on SMS MFA, which is not a safe migration target.

## Outputs
- AuthKit wiring with sealed sessions (never raw tokens in cookies) and the Sign-in endpoint registered when impersonation or IdP-initiated SSO matter.
- A two-layer RBAC enforcement plan (route guard and data layer).
- Idempotent webhook handlers verified against the raw body, branching on `event`.
- A migration or environment-cutover plan with the env-var checklist filled.

## Commonly sequenced with
- auth-worker-bee: for the upstream provider-selection decision, before or in place of this Bee when WorkOS isn't yet confirmed.
- security-worker-bee: for the audit pass of the finished implementation.
- react-worker-bee or ux-ui-svelte-worker-bee: for the sign-in screen's markup and brand matching.
- db-worker-bee: for the `users`/`organizations`/webhook-event-log schema this Bee's patterns write to.
