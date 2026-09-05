# 11: Common Failure Modes

The catalog. Each failure mode has a name, a signature, and a fix. Use as a check-list during code review and during the audit-handoff.

Source: `research/2026-04-25-oauth-failure-modes.md`, OWASP Top 10 (A01: Broken Access Control, A02: Cryptographic Failures, A07: Identification and Authentication Failures).

## OAuth-specific failures

### Session fixation

**Signature**: pre-auth session ID is reused after authentication.

**Fix**: regenerate session ID on every privilege escalation (sign-in, MFA-pass). See `guides/10-session-storage.md` §"Session fixation".

### OAuth callback CSRF

**Signature**: callback handler accepts `code` without validating `state`.

**Fix**: server generates a high-entropy `state` at flow start, stores in session, validates on callback. Mismatch → reject. See `guides/06-google-oauth.md` flow step 6.

### Redirect URI confusion

**Signature**: callback handler accepts `redirect_uri` from the client, then redirects to it post-auth.

**Fix**: redirect URIs are an allowlist on the IdP side AND your app validates redirects against an allowlist (no open-redirect). Never echo a user-controlled redirect.

### Token leakage in URL fragments

**Signature**: implicit flow (`response_type=token`) returns token in `#access_token=...`. Logged by browser history, by analytics scripts, by CDN logs.

**Fix**: do not use the implicit flow. Use authorization code + PKCE. `response_type=code`. The implicit flow is deprecated as of OAuth 2.1.

### ID-token signature not verified

**Signature**: server reads `id_token` claims (`email`, `sub`) without verifying the JWS signature against Google's JWKS.

**Fix**: always verify signature, `iss`, `aud`, `exp`, `nonce`. Use a library that does it (most do; confirm). See `guides/06-google-oauth.md` step 9.

### `aud` claim not validated

**Signature**: ID token from a different OAuth client passes verification.

**Fix**: validate `aud == YOUR_CLIENT_ID`. Without this, any Google ID token validates.

### `nonce` not used or not validated

**Signature**: replay attack, attacker captures a valid ID token and submits it later.

**Fix**: client generates `nonce` per flow, sends in auth request, validates it matches in the returned ID token. Server stores the `nonce` in the pre-auth session.

### Scope creep at consent time

**Signature**: app starts requesting `gmail.readonly`, ships, then adds `gmail.modify` next quarter, re-triggers verification, and meanwhile users see escalating consent prompts.

**Fix**: bundle scopes deliberately at one verification cycle; if you anticipate Gmail-modify, get verified once.

### Refresh token reuse not detected

**Signature**: leaked refresh token usable indefinitely.

**Fix**: rotate on use; invalidate old token; if old token reused → treat as compromise, revoke all sessions for the user. See `guides/10-session-storage.md` §"Refresh token rotation".

## Session-management failures

### Cookie missing `HttpOnly`

**Signature**: a single XSS bug exfiltrates the session.

**Fix**: every session cookie has `HttpOnly`.

### Cookie missing `Secure`

**Signature**: session traverses HTTP and is captured by network attacker.

**Fix**: every session cookie has `Secure`. Block HTTP at the load balancer.

### `SameSite=None` without CSRF protection

**Signature**: cross-site POST authenticates with the user's session.

**Fix**: `SameSite=Lax` floor; `None` only with `__Host-` prefix and CSRF token.

### JWT session with no revocation

**Signature**: user logs out, JWT still valid until expiry.

**Fix**: opaque sessions OR JWT + short TTL + revocation list (Redis). See `guides/10-session-storage.md` §"JWT vs opaque".

### Long-lived JWT sessions

**Signature**: 30-day JWT. Leaked = 30 days of access.

**Fix**: short access JWT (5-15 min) + refresh token rotation against a server-side store.

## Authorization failures

### Single-layer enforcement

**Signature**: middleware checks role; data layer doesn't filter by tenant.

**Fix**: middleware AND data layer (or RLS). See `guides/09-rbac.md` §"Two-layer enforcement".

### Stale role on JWT

**Signature**: admin demoted, still admin until JWT expiry.

**Fix**: short JWTs OR session-DB role lookup OR revocation list keyed by `(user_id, role-version)`.

### Email-as-key

**Signature**: lookups and grants keyed on `email`. Email change → permissions break or duplicate.

**Fix**: stable internal `user_id` (UUID).

### Missing cross-tenant test coverage

**Signature**: test suite proves "user can read own data"; doesn't prove "user CANNOT read other tenant's data".

**Fix**: add explicit cross-tenant negative tests. Two users in two tenants; assert each cannot read the other.

## MFA / passkey failures

### MFA without recovery codes

**Signature**: user loses device, account is permanently locked.

**Fix**: 10 single-use recovery codes at enrollment. See `guides/08-mfa-and-passkeys.md` §"Recovery codes".

### Recovery flow without MFA

**Signature**: "lost MFA" link bypasses MFA.

**Fix**: recovery flow itself requires MFA (recovery code, hard identity verification, support flow with verification).

### TOTP secret stored unencrypted

**Signature**: DB leak yields all TOTP secrets, attacker generates valid OTPs.

**Fix**: encrypt-at-rest with KMS-backed key.

### Magic link with multi-use semantics

**Signature**: token works twice.

**Fix**: mark redeemed atomically; reject reuse. See `guides/08-mfa-and-passkeys.md` §"Magic links".

### SMS as primary factor

**Signature**: SIM-swap → account takeover.

**Fix**: SMS as recovery only.

## Configuration failures

### `state` and `nonce` not random enough

**Signature**: predictable `state`, attacker forges callback.

**Fix**: 32-byte cryptographically random.

### Redirect URI `http://` in production

**Signature**: token returned over HTTP.

**Fix**: HTTPS-only redirect URIs in production. Google rejects HTTP for production OAuth clients anyway.

### Wildcard redirect URIs

**Signature**: `https://*.example.com/callback` allows attacker to register `evil.example.com`.

**Fix**: list each redirect URI explicitly. No wildcards.

### `service_role` key in client bundle

**Signature**: Supabase / similar `service_role` shipped in JS, bypasses RLS.

**Fix**: server-only. Audit `.env.example` and bundle output.

### Unused Google OAuth client unmonitored

**Signature**: October 2025 deletion policy → client deleted → production broken.

**Fix**: synthetic monthly call OR runbook entry with quarterly audit.

## Process failures

### No audit log on auth events

**Signature**: post-incident, no record of when MFA was disabled or recovery code redeemed.

**Fix**: write every authentication event (sign-in, MFA-add, MFA-remove, recovery-code-redeem, password-change, session-revoke) to an immutable log.

### Email-domain allowlist not enforced

**Signature**: company says "only `@acme.com` users can sign in" but the `signIn` callback doesn't check.

**Fix**: enforce in the `signIn` callback / sign-in webhook. Test with a non-allowed email.

### `link_account` events not logged

**Signature**: account-linking attack, attacker links their email to victim's social account, takes over.

**Fix**: account linking requires re-authentication; log the event; email the user with revert link.

---

## Output

When this guide is the primary reference (audit-handoff invocation), produce a check-list output: walk every relevant failure mode, mark each as `pass` / `fail` / `n/a`, and pass the list to `security-worker-bee`.
