# OAuth & Auth Failure Modes Catalog

**Sources:**
- OWASP Top 10 (A01: Broken Access Control, A02: Cryptographic Failures, A07: Identification and Authentication Failures)
- RFC 6749 §10 (Security Considerations)
- https://oauth.net/articles/authentication/
- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics

**Retrieved:** 2026-04-25

## Summary

A consolidated catalog of OAuth, session, RBAC, MFA, configuration, and process failures. Each entry: signature, fix, governing principle.

## Categories captured

- **OAuth-specific**: session fixation, callback CSRF, redirect URI confusion, token leakage, ID-token verification skips, `aud` / `nonce` validation, scope creep, refresh-token reuse.
- **Session**: missing HttpOnly / Secure / SameSite, JWT without revocation, long-lived sessions.
- **Authorization**: single-layer enforcement, stale role on JWT, email-as-key, missing cross-tenant tests.
- **MFA / passkey**: no recovery codes, recovery without MFA, unencrypted TOTP secret, multi-use magic links, SMS as primary.
- **Configuration**: weak `state` / `nonce`, HTTP redirect URIs in production, wildcard URIs, `service_role` in client bundle, unmonitored Google OAuth client.
- **Process**: no audit log, email-domain allowlist not enforced, account-linking attack.

## Relevance

- `guides/11-common-failure-modes.md`: full catalog.
- `templates/audit-report-template.md` § Failure-mode check-list.
