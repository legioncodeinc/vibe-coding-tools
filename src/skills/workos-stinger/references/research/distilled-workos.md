# Distilled WorkOS research

Dense, cited reference distilled from `raw/`. Every claim ends with `[raw/<file>]`. Research window: sources fetched/searched 2026-08-14, official docs undated (live pages), blog/changelog posts dated where shown. Weighted toward AuthKit per mission brief.

## 1. AuthKit modes and when to use which

| Mode | What it is | When to use |
| --- | --- | --- |
| Hosted UI | Pre-built, customizable auth UI on a WorkOS-hosted domain (or custom domain). Handles sign up/in, password reset, email verification, SSO routing, MFA enrollment, bot detection, branding | Default recommendation for almost all apps [raw/workos--authkit--modeling-your-app.md] |
| Headless / custom UI (Authentication API) | Build your own UI, call the AuthKit API directly | Only after hitting the genuine ceiling of hints + branding + custom CSS on the hosted UI; going headless trades a maintained, localized, bot-resistant flow for one you own end-to-end [raw/workos--authkit--branding-customization.md] |
| Standalone SSO (no AuthKit) | SSO acts as pure auth middleware; does not manage a user database | Rare; WorkOS's own guidance is to default to AuthKit even for SSO-only needs, since it preserves the option to add MFA/Magic Auth/etc. later without re-architecting [raw/workos--authkit--modeling-your-app.md] |

AuthKit sits outside the app; the app redirects to the AuthKit URL, WorkOS completes auth, and redirects back with a code the app exchanges for a User object [raw/workos--authkit--hosted-ui-overview.md].

## 2. Full authentication flow (hosted UI, confidential/server client)

1. Configure a **redirect URI** and (if IdP-initiated/impersonation flows matter) an **Initiate login URL** in WorkOS Dashboard > Applications > Redirects [raw/workos--authkit--nodejs-quickstart-sessions.md].
2. Login endpoint calls `workos.userManagement.getAuthorizationUrl({ provider: 'authkit', redirectUri, clientId })` and redirects [raw/workos--authkit--nodejs-quickstart-sessions.md].
3. Callback endpoint reads `?code=`, calls `workos.userManagement.authenticateWithCode({ code, clientId, session: { sealSession: true, cookiePassword } })`. Authorization code is valid for **10 minutes** [raw/workos--authkit--nodejs-quickstart-sessions.md].
4. Store the returned `sealedSession` in an `httpOnly`, `secure`, `sameSite: 'lax'` cookie named (by SDK convention) `wos-session` [raw/workos--authkit--nodejs-quickstart-sessions.md].
5. On protected routes, `loadSealedSession(...).authenticate()`; on `no_session_cookie_provided` redirect to login; on an expired/invalid session call `.refresh()` and rewrite the cookie; on refresh failure, clear the cookie and redirect to login [raw/workos--authkit--nodejs-quickstart-sessions.md].
6. Logout: extract session id, call `session.getLogoutUrl()` (or `workos.userManagement.getLogoutUrl({ sessionId })` when working from a raw JWT), clear the local cookie, redirect the browser there so WorkOS also ends its side; requires a configured **Sign-out URI** or the user sees an error [raw/workos--authkit--nodejs-quickstart-sessions.md, raw/workos--authkit--sessions-reference.md]. WorkOS recommends the logout endpoint be POST-only with CSRF protection, to prevent prefetch-triggered logouts [raw/workos--authkit--nodejs-quickstart-sessions.md].

Mermaid flow: see `references/authkit-flow-diagram.md`.

## 3. Sessions and sealed sessions

- Successful auth returns an **access token** (JWT) and a **refresh token**. Access token -> secure cookie, validated server-side each request. Refresh token -> secure cookie or backend store; used to mint a new access token when expired [raw/workos--authkit--sessions-reference.md].
- **Sealed sessions**: SDK-level convenience that encrypts (`Fe26.2*...` format, Iron/Fernet-style) the access+refresh token pair with `cookiePassword` (min 32 chars) before it ever touches a cookie, so the raw refresh token (a bearer secret) is never stored in cleartext client-side [raw/workos--authkit--nodejs-quickstart-sessions.md, raw/workos--authkit--session-helpers-reference.md].
- Refresh tokens **may be rotated on use** - always persist the newly returned refresh token, don't reuse the old one [raw/workos--authkit--sessions-reference.md, raw/workos--authkit--session-helpers-reference.md].
- Framework SDKs for Next.js (`@workos-inc/authkit-nextjs`) and Remix (`authkit-remix`) handle token validation/refresh automatically; no first-party SvelteKit equivalent is confirmed to do so as of this research (see conflict in §8) [raw/workos--authkit--sessions-reference.md].
- Server-side stateless refresh helper `refreshAndSealSessionData` unseals, re-authenticates with the refresh token, and reseals in one call - useful for a SvelteKit `hooks.server.ts` that wants to refresh without a second round trip [raw/workos--authkit--session-helpers-reference.md].

## 4. JWT / JWKS verification

- Access token is a JWT signed via a per-client JWKS at `GET https://api.workos.com/sso/jwks/{clientId}` [raw/workos--authkit--jwt-jwks-verification.md].
- Recommended verification pattern (any Node/edge runtime, including SvelteKit): `jose`'s `createRemoteJWKSet` + `jwtVerify`, module-scoped (not per-request) so the key cache persists; always pass `algorithms: ['RS256']`, `issuer`, `audience` explicitly [raw/workos--authkit--jwt-jwks-verification.md].
- For most SvelteKit apps using the SDK's sealed-session cookie flow, raw JWKS verification is **not** needed for every request - `session.authenticate()` already verifies server-side. Reach for manual `jose` JWKS verification specifically when a *separate downstream service* only receives the bearer access token (no sealed cookie) [raw/workos--authkit--jwt-jwks-verification.md]. This is a judgment call layered onto the raw source, not a directly quoted WorkOS recommendation - flagged as such.

## 5. SvelteKit integration - CONFLICT

Two sources both claim to be the official SvelteKit SDK:

| Source | Package |
| --- | --- |
| `workos.com/docs` CLI Installer framework table (current live docs) | `@workos-inc/authkit-sveltekit` |
| `github.com/workos/authkit-sveltekit` README (org: workos, MIT, created 2025-07-27) | `@workos/authkit-sveltekit` |
| Archived `github.com/workos/sveltekit-authkit-example` (says it moved *into* `authkit-sveltekit`) | installs `@workos-inc/authkit-sveltekit` |

[raw/workos--authkit--sveltekit-sdk.md]

**Gap/conflict, stated plainly**: this is unresolved in the research. The CLI installer table also lists TanStack Start under the `@workos/*` scope (not `@workos-inc/*`), so WorkOS does maintain packages under both scopes for different frameworks - this is not simply "one is wrong." **Guides in this skill default to `@workos-inc/authkit-sveltekit`** per the CLI installer table (the most current top-level docs artifact) but instruct verifying the live npm package before scaffolding [raw/workos--authkit--sveltekit-sdk.md].

Regardless of package name, the shape is consistent across both sources: `configureAuthKit()` + `authKitHandle()` in `hooks.server.ts`, a `+server.ts` callback route, a `+server.ts` sign-in route (required for dashboard impersonation / IdP-initiated flows to complete PKCE/CSRF `state`), `authKit.withAuth()` wrapping `+page.server.ts` load functions, `authKit.getUser()`, `authKit.signOut()` [raw/workos--authkit--sveltekit-sdk.md].

`withAuth` should only wrap routes serving top-level HTML documents - applying it to JSON API endpoints sets PKCE verifier cookies on XHR responses that can't complete OAuth, risking HTTP 431 under load [raw/workos--authkit--sveltekit-sdk.md].

## 6. User Management API: users, organizations, memberships, invitations

- **User** uniquely identified by email; multiple auth methods can attach to one user; WorkOS auto-links identities by email so duplicate-email users can't exist; all users go through email verification by default (including OAuth/SSO), except when SSO domain verification already vouches for the address [raw/workos--authkit--users-organizations.md].
- **Organization**: no limit on count; supports both "multiple workspaces per user" (Figma-style) and "one workspace per user" B2B models simultaneously [raw/workos--authkit--users-organizations.md].
- **Organization membership** lifecycle - three statuses:

| Status | Meaning | Can deactivate? | Can reactivate? |
| --- | --- | --- | --- |
| `pending` | Invited, not yet accepted | No - delete instead | No - use invitation acceptance |
| `active` | Member (direct add or accepted invite) | Yes -> `inactive`, revokes sessions | n/a |
| `inactive` | Deactivated | n/a | Yes -> `active`, restores prior role |

[raw/workos--authkit--users-organizations.md, raw/workos--user-management--organization-membership-api.md]

- Deactivation vs. hard delete: deactivate when member-authored data (messages/docs) should persist and a "former members" view is useful; hard-delete when the app has no need to remember departed members [raw/workos--authkit--users-organizations.md].
- **JIT provisioning** (verified-domain match) and **invitations** (any email) are the two automated membership-creation paths [raw/workos--authkit--users-organizations.md].
- No-org-yet flow for new users: check `org_id` claim on the access token -> if absent, show an org-creation form -> Create Organization API -> Create Organization Membership API -> refresh token with the new org ID to get an access token that now carries `org_id` [raw/workos--authkit--users-organizations.md].
- **Invitations**: `POST /user_management/invitations` (`email` required, `organization_id`, `role_slug`, `expires_in_days` 1-30 default 7, `inviter_user_id`, `locale` all optional). Accept via `authenticateWithCode` (which also consumes an invitation token and signs the user in) in most cases, or the standalone accept-invitation endpoint for custom flows / already-signed-in users accepting a second org's invite. App should independently verify the invitation email matches the accepting user [raw/workos--user-management--invitation-api.md].

## 7. RBAC model

| Concept | Scope | Notes |
| --- | --- | --- |
| Environment role | All orgs in the environment | Seeded `member` default, cannot delete (can replace as default) [raw/workos--rbac--configuration-and-integration.md] |
| Custom (organization) role | One organization | Slug auto-prefixed `org-`; org has none until first is created, then gets its own independent default + priority order [raw/workos--rbac--configuration-and-integration.md] |
| Permission | Global, referenced by slug | Assignable to any number of roles; recommended naming `resource:action` (e.g. `users:view`); kept short because permissions land in the session JWT, capped ~4KB in many browsers [raw/workos--rbac--configuration-and-integration.md] |

- **Single-role (default) vs. multiple-roles**: multiple roles is an environment-level opt-in toggle. Recommendation: start single-role, adopt multiple only once overlapping permission sets are common [raw/workos--rbac--configuration-and-integration.md].
- **Priority order** resolves which role wins in single-role mode when a user maps to multiple IdP groups, and determines the survivor when downgrading multi-role -> single-role [raw/workos--rbac--configuration-and-integration.md].
- **Precedence**: IdP role assignment (SSO group mapping or Directory group mapping) always overrides dashboard/API-assigned roles. SSO-sourced roles update on every authentication; Directory-sourced roles update on every directory event received [raw/workos--rbac--configuration-and-integration.md].
- **Groups**: assign a role once at the group level; membership changes propagate automatically; group roles combine additively with direct roles in multi-role mode, or lose to the highest-priority role in single-role mode [raw/workos--rbac--configuration-and-integration.md].
- Read roles either from the Organization Membership object (extra API call) or directly from the AuthKit session JWT claims (`role`, `permissions`) - the JWT read is the lower-latency per-request pattern [raw/workos--rbac--configuration-and-integration.md, raw/workos--authkit--session-helpers-reference.md].
- For resource-level (not just org-wide) authorization, a separate Authorization/FGA-style API exists: `POST /authorization/organization_memberships/{id}/check` with `permission_slug` + `resource_id`. WorkOS's own guidance: check the JWT directly for org-wide permissions, only call this endpoint for resource-specific checks [raw/workos--user-management--organization-membership-api.md].

Full role/permission tables: see `references/rbac-model.md`.

## 8. SSO (SAML/OIDC) and Directory Sync (SCIM)

- Connections are configured **at the organization level**; enabling one enables it for every member of that org [raw/workos--sso--overview-and-connections.md].
- Three mutually-exclusive connection selectors on `getAuthorizationUrl`: `organization` (preferred for SAML/OIDC), `connection` (specific connection ID), `provider` (env-level OAuth: `GoogleOAuth`/`MicrosoftOAuth`/`GitHubOAuth`/`AppleOAuth`) [raw/workos--sso--overview-and-connections.md].
- Staging ships a built-in **Test Organization** (`org_test_idp`) with a mock IdP so SSO integration can be validated without a real IdP [raw/workos--sso--overview-and-connections.md].
- Representative onboarding sequence for a SAML IdP (Okta shown, generalizes): WorkOS gives an SP Entity ID + ACS URL -> paste into the IdP's SAML app config -> map attribute statements (`id`, `email`) -> assign users/groups on the IdP side -> copy the IdP metadata URL back into the WorkOS connection -> connection goes live [raw/workos--sso--overview-and-connections.md].
- **Directory Sync (SCIM)**: configured per-org alongside SSO. WorkOS issues an **Endpoint URL** + **Bearer Token** (shown once) that the customer's IT team plugs into their SCIM server; WorkOS then syncs users/groups from there [raw/workos--directory-sync--scim-setup.md].
- SCIM has two incompatible major versions (1.1, 2.0) - a common source of enterprise-integration pain if built in-house; non-SCIM directory sources (Azure AD, GSuite Directory, LDAP, Workday) need their own connectors [raw/workos--directory-sync--scim-setup.md].
- **When a B2B app needs which**: SSO alone covers login; SCIM alone covers automated provisioning/deprovisioning independent of how a user authenticates; most enterprise-grade B2B apps eventually need both so that an employee removed from the company directory automatically loses app access without a manual admin step [raw/workos--directory-sync--scim-setup.md].
- `dsync.*` events (`user.created/updated/deleted`, `group.created/updated/deleted`, `group.user_added/user_removed`) can be consumed via Events API (ordered, replayable) or webhooks (real-time, unordered) [raw/workos--sso--overview-and-connections.md, raw/workos--events--webhooks-guide.md].

## 9. Magic Auth, MFA, Passkeys - support status

| Method | Support | Key constraint |
| --- | --- | --- |
| Magic Auth (email OTP) | Full, hosted + headless API | 6-digit code, expires in 10 minutes [raw/workos--authkit--mfa-passkeys-magic-auth.md] |
| MFA - TOTP | Full, hosted + headless API | Authenticator app, `enrollFactor`/`challengeFactor`/verify flow; does NOT apply to SSO users [raw/workos--authkit--mfa-passkeys-magic-auth.md] |
| MFA - SMS | Supported by the MFA API | **US phone numbers only**; challenge verifiable for 10 minutes; WorkOS's own migration docs discourage it (SIM-swap) even though the API exists [raw/workos--authkit--mfa-passkeys-magic-auth.md, raw/workos--migrate--supabase-and-clerk-to-workos.md] |
| Passkeys | **Hosted UI only** - no headless/custom-API passkey support | Bound to the registration domain; **configure a custom domain before enabling passkeys in production** or passkeys break when a custom domain is added later; acts as both 1st and 2nd factor (satisfies MFA without a separate TOTP prompt); no self-service passkey management UI for end users - admin must delete via dashboard [raw/workos--authkit--mfa-passkeys-magic-auth.md] |

## 10. Webhooks and events

- Header **`WorkOS-Signature`** (no `X-` prefix), composite `t=<ms_timestamp>,v1=<hmac_hex>`; signed string is `<timestamp>.<raw_body>`, HMAC-SHA256 keyed by the dashboard-issued webhook secret [raw/workos--events--webhooks-guide.md].
- Node SDK: `workos.webhooks.constructEvent({ payload: rawBody, sigHeader, secret, tolerance })` verifies signature + timestamp tolerance (~3-5 min default) and throws `SignatureVerificationException` on failure - must be called on the **raw** request body, before any JSON parsing [raw/workos--events--webhooks-guide.md].
- Event field is **`event`** (dotted string, e.g. `dsync.user.created`), not `type` - a common integration bug when porting handlers from other providers [raw/workos--events--webhooks-guide.md].
- Respond `200` immediately, process async; **production retries up to 6 times with exponential backoff over 3 days**; staging only retries for "several minutes" [raw/workos--events--webhooks-guide.md].
- Delivery is at-least-once, unordered - **idempotency required**, keyed on the event `id`, persisted durably (not just an in-memory Set) [raw/workos--events--webhooks-guide.md].
- Audit Logs have **no** webhook event type [raw/workos--events--webhooks-guide.md].
- WorkOS's own preference: use the **Events API** (ordered, replayable, pull-based) over webhooks for user/directory-sync sync specifically; webhooks remain the right call when real-time push matters more than ordering [raw/workos--events--webhooks-guide.md].

Full handler example: see `references/webhook-handler-example.md`.

## 11. Node SDK, API keys vs. client IDs, environments

- `new WorkOS('sk_...')` (confidential/server) reads `WORKOS_API_KEY` automatically if no key is passed; `new WorkOS({ clientId })` (public/client, no secret) for browser/mobile/CLI, paired with `getAuthorizationUrlWithPKCE` [raw/workos--sdks--node-sdk-api-keys-environments.md].
- PKCE can additionally be layered onto a confidential/server client for defense in depth (OAuth 2.1 recommendation) - both `client_secret` and `code_verifier` are then sent on token exchange [raw/workos--sdks--node-sdk-api-keys-environments.md].
- **API key** (`sk_...`) = secret, any-permission credential, server-only. **Client ID** (`client_...`) = app identifier, used in both confidential and public flows [raw/workos--sdks--node-sdk-api-keys-environments.md].
- Staging and production are **fully separate**: API keys, orgs, connections, users, webhook endpoints, and branding do not carry over [raw/workos--sdks--node-sdk-api-keys-environments.md]. Production API keys are **shown once at creation** - store immediately or regenerate [raw/workos--sdks--node-sdk-api-keys-environments.md]. Production redirect URIs require `https://` (native `127.0.0.1` excepted); staging allows `http://`/`localhost` [raw/workos--sdks--node-sdk-api-keys-environments.md].
- Env var checklist and cutover steps: see `references/env-var-checklist.md`.

## 12. Pricing / limits that shape architecture

| Item | Detail |
| --- | --- |
| AuthKit free tier | First 1,000,000 MAUs free; $2,500/mo per additional 1M MAU block [raw/workos--pricing--authkit-pricing.md] |
| MAU definition | Any sign up, sign in, or profile update within a calendar month [raw/workos--pricing--authkit-pricing.md] |
| Staging | Entirely free regardless of usage/features exercised [raw/workos--pricing--authkit-pricing.md] |
| OAuth (social login) | Free in all environments [raw/workos--pricing--authkit-pricing.md] |
| SAML SSO / SCIM Directory Sync | **Per-connection charges in production** - this, not raw AuthKit MAU count, is the concrete cost trigger for adding enterprise features [raw/workos--pricing--authkit-pricing.md] |

Architectural implication: gating SSO/SCIM behind a paid/"Enterprise" app tier aligns product pricing with WorkOS's actual billing boundary [raw/workos--pricing--authkit-pricing.md] - this is an inference drawn from the pricing facts above, not a direct WorkOS recommendation, flagged as such.

## 13. Migration notes

- Unified CLI `npx workos migrations` is the primary tool across Auth0, Clerk, Firebase, Stytch, Descope, Cognito, Supabase, Better Auth: read-only source auth -> paginated export with resumable local checkpointing -> bulk import with retry/backoff -> optional diff-before-cutover [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **Supabase -> WorkOS**: export straight from Postgres `auth` schema (full access, including bcrypt password hashes); `password_hash_type: 'bcrypt'` import preserves existing passwords with no forced reset; Supabase has no native multi-tenancy (commonly RLS + `tenant_id`), map to WorkOS Organizations explicitly; Supabase TOTP secrets **cannot be exported** - users must re-enroll MFA; Supabase SMS-MFA users must move to TOTP or Magic Auth (WorkOS has no SMS second factor by policy) [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **Clerk -> WorkOS**: `npx workos migrations export clerk --from-file <csv> --output-dir <dir>` transforms Clerk's column shape before `import-package`; `--secret-key` additionally exports Clerk's enterprise SAML/OIDC connections as SSO handoff artifacts; same bcrypt passthrough as Supabase; Clerk SMS second factors have the same no-SMS-on-WorkOS migration gap [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **Common pitfall across both**: interim signups between export and cutover get missed unless you either freeze signups behind a flag during the migration window or dual-write new users to both systems until cutover completes [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **SSO connection migration at scale**: under 15 connections, hand IT admins a per-connection Admin Portal setup link; 15+, run a transparent proxy so the existing ACS/callback URL routes to WorkOS without the customer touching their IdP [raw/workos--migrate--supabase-and-clerk-to-workos.md].
- **Cutover sequencing to avoid dropped events**: disable webhooks on the OLD provider before (not during) the bulk import; import against a known-quiet source; flip traffic behind a feature flag while watching the WorkOS Events API; deliberately drain/discard the old provider's webhook backlog rather than relying on auto-flush [raw/workos--migrate--supabase-and-clerk-to-workos.md].

## Gaps and open questions (state plainly, do not guess)

1. **SvelteKit package name is unresolved** between `@workos-inc/authkit-sveltekit` and `@workos/authkit-sveltekit` - see §5. Verify on npm before scaffolding [raw/workos--authkit--sveltekit-sdk.md].
2. **No first-party confirmation that the SvelteKit SDK auto-refreshes tokens** the way the Next.js/Remix SDKs are documented to. The `hooks.server.ts` pattern in the raw source does not explicitly describe automatic silent refresh; guides in this skill therefore show an explicit `session.refresh()` fallback pattern rather than assuming it's automatic [raw/workos--authkit--sveltekit-sdk.md, raw/workos--authkit--sessions-reference.md].
3. **Whether Vercel edge runtime specifically is validated for the SvelteKit SDK** was not directly confirmed in the fetched SvelteKit sources (the archived example repo's own marketing copy claims "Cloudflare Workers, Vercel Edge" platform-agnostic support, but this is a secondary/example-repo claim, not the primary SDK README) - treat as likely-true but unconfirmed by a primary source, and verify Node vs. Edge runtime compatibility directly against the resolved package (see gap 1) before deploying to a Vercel Edge function.
4. **No dedicated raw source was fetched on WebAuthn cross-device passkey portability specifics** beyond the general passwordless-comparison blog post; if passkey UX questions get more detailed than "enable in dashboard, bind to a custom domain first," additional research would be needed.
5. **Custom-domain setup steps themselves** (DNS records, verification flow) were not fetched as a dedicated raw source - only referenced as a prerequisite for production passkeys and production branding. If a guide needs exact custom-domain DNS steps, treat that as a research gap.
