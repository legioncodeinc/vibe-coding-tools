# Research Plan: auth-stinger

**Bee:** auth-worker-bee
**Forged:** 2026-04-25

## Open questions from the brief

1. React Native auth flows (App Auth)? **Out of scope v1.** High-level coverage only; defer mobile-OS deep dives.
2. Building your own IdP / OIDC server? **Out of scope.** Recommend Ory Kratos or Keycloak.
3. SAML protocol from scratch? **Out of scope.** Recommend WorkOS or Auth.js SAML support.

## Authoritative sources to consult

### Provider docs (must fetch)

- https://clerk.com/docs
- https://www.better-auth.com/docs
- https://authjs.dev
- https://supabase.com/docs/guides/auth
- https://workos.com/docs
- https://stack-auth.com/docs
- https://kinde.com/docs
- https://stytch.com/docs

### Google OAuth & Identity

- https://developers.google.com/identity
- https://developers.google.com/identity/oauth2/web/guides/migration-to-gis
- https://developers.google.com/identity/protocols/oauth2
- https://developers.google.com/identity/protocols/oauth2/scopes
- https://developers.google.com/identity/protocols/oauth2/policies
- https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance
- https://support.google.com/cloud/answer/13463073 (October 2025 unused-client deletion)
- https://developers.google.com/workspace/guides/configure-oauth-consent
- https://developers.google.com/identity/risc (Cross-Account Protection)
- https://developers.google.com/identity/protocols/oauth2/service-account
- https://cloud.google.com/iam/docs/workload-identity-federation

### Standards & cheat sheets

- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://www.w3.org/TR/webauthn-3/ (WebAuthn Level 3)
- RFC 6238 (TOTP)
- RFC 6749 (OAuth 2.0)
- RFC 7636 (PKCE)
- RFC 7519 (JWT)
- RFC 6265bis (cookies)
- OAuth 2.1 draft

### Real-world journey reports

- https://medium.com/@info.brightconstruct/the-real-oauth-journey-getting-a-google-workspace-add-on-verified-fc31bc4c9858

## Search queries executed

1. "Google OAuth unused client deletion October 2025 policy"
2. "Google Identity Services GIS migration 2026 deprecation gapi.auth2"
3. "Better Auth 2026 momentum vs NextAuth Auth.js production"
4. "Clerk vs WorkOS vs Better Auth 2026 B2B SaaS decision"
5. "WebAuthn passkeys SAML SSO 2026 production patterns"
6. "OAuth 2.1 PKCE refresh token rotation 2026"
7. "Cross-Account Protection Google RISC events 2026"
8. "row-level security multi-tenant Postgres Supabase auth 2026"
9. "session cookie SameSite None Lax 2026 cross-site"
10. "Auth.js v5 Better Auth migration 2026"
11. "Clerk Google OAuth verification sensitive scope demo video 2025 2026"

## Notes captured (in research/)

- `2026-04-25-google-oauth-scopes-and-policies.md`
- `2026-04-25-google-identity-services-migration.md`
- `2026-04-25-october-2025-oauth-deletion-policy.md`
- `2026-04-25-google-oauth-verification-journey.md`
- `2026-04-25-provider-decision-matrix.md`
- `2026-04-25-better-auth-momentum.md`
- `2026-04-25-authjs-v5-status.md`
- `2026-04-25-supabase-auth-and-rls.md`
- `2026-04-25-webauthn-and-totp.md`
- `2026-04-25-cookie-security-and-csrf.md`
- `2026-04-25-oauth2-and-token-strategy.md`
- `2026-04-25-rbac-and-multitenancy.md`
- `2026-04-25-oauth-failure-modes.md`
