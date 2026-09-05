# 00: Principles

The non-negotiables for authentication implementation. Read on every invocation.

## The ten principles

### 1. Least-privilege scopes: every scope is a verification cost

Every OAuth scope you request is a security review you must pass, a consent prompt the user must accept, and a breach surface if the token leaks. Default to the smallest scope set that lets the feature work. If a feature doesn't need it, don't request it.

For Google specifically: sensitive and restricted scopes trigger Google's verification process: a multi-week journey that may require a demo video, a security assessment, and a re-review on every scope change. See `guides/06-google-oauth.md` and `guides/07-google-oauth-verification.md`. Source: `research/2026-04-25-google-oauth-scopes-and-policies.md`.

### 2. Secure-by-default cookies

Session cookies floor: `HttpOnly` + `Secure` + `SameSite=Lax` + `Path=/`. For cross-site embeds promote to `SameSite=None` *only* together with the `__Host-` prefix and an anti-CSRF token. Never store a session token in `localStorage`; it is XSS-readable. Source: `research/2026-04-25-cookie-security-and-csrf.md`.

### 3. Two-layer enforcement: never trust middleware alone

Middleware can be bypassed by a malformed Host header, a misconfigured proxy, an internal endpoint that forgot to register the middleware, or a direct call from a sibling service. Every tenant-scoped or owner-scoped resource must be enforced **in middleware AND in the data layer** (or via row-level security in the database). See `guides/09-rbac.md`. Source: `research/2026-04-25-rbac-and-multitenancy.md`.

### 4. Recovery is part of MFA, not an afterthought

An MFA enrollment that doesn't issue recovery codes is a denial-of-service generator. Lose the device, lose the account. Recovery codes are issued at enrollment, stored hashed, single-use, and the recovery flow itself is MFA-protected (or rate-limited + identity-verified). See `guides/08-mfa-and-passkeys.md`.

### 5. Refresh tokens are bearer secrets: rotate them

Refresh tokens that don't rotate are persistent bearer credentials. Rotate on every use, bind to a session ID, and revoke on logout / password change / suspicious activity. Detect refresh-token reuse and treat it as compromise. Source: `research/2026-04-25-oauth2-and-token-strategy.md`.

### 6. Verify the ID token signature, every time

A Google ID token from your own callback is not automatically trustworthy. Verify the signature against Google's JWKS, validate `iss`, `aud`, `exp`, and the `nonce` you stored at the start of the flow. The library should do this; confirm it does. Source: `research/2026-04-25-google-oauth-scopes-and-policies.md`.

### 7. The October 2025 unused-client-deletion policy is load-bearing

Google deletes OAuth clients with no traffic for 6 months. A client created for a feature that quietly stops being used will be removed without warning a year later, breaking any rare or seasonal flow. Production-critical clients need a recurring health check or synthetic monthly call. See `guides/06-google-oauth.md` §"Unused-client deletion". Source: `research/2026-04-25-google-oauth-scopes-and-policies.md`.

### 8. Use Google Identity Services (GIS): `gapi.auth2` is deprecated

The legacy Google Sign-In JavaScript Library and `gapi.auth2` are deprecated. New clients use Google Identity Services (`accounts.google.com/gsi/client`). For server-side OAuth, the Web Server flow with PKCE remains correct. Source: `research/2026-04-25-google-identity-services-migration.md`.

### 9. Cite every finding

Two citations per finding:

- **Where in the user's codebase**: `app/api/auth/callback/route.ts:42`
- **Why it's a finding**: guide section (`guides/10-session-storage.md §"CSRF"`), an RFC (RFC 6749 §10.12), an OWASP cheat sheet, or a vendor doc URL

### 10. Severity discipline

Three levels only:

| Severity | Example | Blocks PR? |
|---|---|---|
| Must-fix | Missing `HttpOnly` on session cookie, accepting unverified ID token, single-layer enforcement on a tenant resource, refresh token in URL fragment | Yes |
| Should-refactor | JWT-only sessions with no revocation list, no MFA recovery codes, no health check on a Google client | No, but open a follow-up |
| Style | Env-var naming, comment phrasing | No, suggestion only |

Calling a style nit "must-fix" is a reviewer error. Be disciplined.

---

## First-move checklist

Before writing findings, confirm:

- [ ] Use case classified (B2C / B2B / internal / mobile / CLI).
- [ ] `package.json` and `.env.example` read; runtime stack and current provider captured.
- [ ] Invocation classified (provider-selection / implementation / Google-OAuth / audit-handoff / migration).
- [ ] Relevant guide(s) identified from the routing table in `SKILL.md`.
- [ ] Severity rubric in mind.

## Cross-Bee boundaries

Below is what you *do not own*. Hand off if the question is primarily:

| Question type | Owner |
|---|---|
| Audit of the implementation you just produced | `security-worker-bee` |
| The `<SignIn />` / `<SignUpPage />` JSX, React 19 Actions for credential forms | `react-worker-bee` |
| The `users` / `sessions` / `accounts` / `roles` tables, RLS policies | `db-worker-bee` |
| The auth PRD before implementation | `library-worker-bee` |
| Post-implementation QA | `quality-worker-bee` |
| Visual / token / spacing issues in auth pages | `ux-ui-svelte-worker-bee` |

You *surface* concerns in audit territory (e.g., "the session middleware is implemented; flagging the refresh-token rotation strategy for `security-worker-bee` to verify"), but the audit is their job.

## Scope explicitly excluded (v1)

- **OIDC provider implementation**: building your own IdP. Out of scope; recommend a hosted provider or Ory / Keycloak instead.
- **SAML protocol implementation from scratch**: out of scope; recommend WorkOS or Auth.js's SAML support.
- **Native mobile auth flows (App Auth for iOS/Android)**: covered at a high level; deep mobile-OS specifics deferred.
