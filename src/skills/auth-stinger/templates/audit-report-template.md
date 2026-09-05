# Auth Implementation Audit Report

Fill at the end of an implementation invocation. Hand to `security-worker-bee` for verification.

**Project:** _____
**Auth provider:** _____
**Date:** _____
**Reporter:** auth-worker-bee

---

## Summary

One paragraph: what was built, what provider was chosen, what scopes are in play, what's flagged for security-worker-bee.

## Provider decision

- Chosen: _____
- Rationale: _____ (cite `templates/provider-comparison-matrix.md`)
- Named alternative if [constraint] shifts: _____

## Implementation manifest

| Surface | File | Notes |
|---|---|---|
| Middleware | _____ | Two-layer enforcement: yes / no |
| Callback handler | _____ | `state` validated, `nonce` validated, ID-token signature verified: yes / no / library does it |
| Session config | _____ | Cookie attributes vs `templates/session-cookie-config.ts` |
| RBAC policies | _____ | Cite `templates/rbac-policy-table.md` |
| MFA enrollment flow | _____ | Recovery codes generated: yes / no |
| Recovery flow | _____ | MFA-protected: yes / no |
| Webhook handler | _____ | Signature verified: yes / no |

## Scope inventory (Google or OIDC)

Cite filled `templates/scope-justification-template.md`.

| Scope | Tier | Justified | In code at |
|---|---|---|---|
| _____ | _____ | _____ | _____ |

## Failure-mode check-list

Walk `guides/11-common-failure-modes.md`. Mark each `pass` / `fail` / `n/a` / `flag-to-security`.

### OAuth-specific

- [ ] Session fixation: `pass` / `fail` / `n/a`
- [ ] OAuth callback CSRF (`state` validation): `pass` / `fail`
- [ ] Redirect URI confusion: `pass` / `fail`
- [ ] Token leakage in URL fragments (no implicit flow): `pass` / `fail`
- [ ] ID-token signature verified: `pass` / `fail`
- [ ] `aud` claim validated: `pass` / `fail`
- [ ] `nonce` used and validated: `pass` / `fail`
- [ ] Refresh-token rotation: `pass` / `fail` / `n/a`

### Session

- [ ] `HttpOnly` on session cookie: `pass` / `fail`
- [ ] `Secure` on session cookie: `pass` / `fail`
- [ ] `SameSite` set (Lax / Strict / None+CSRF): `pass` / `fail`
- [ ] Opaque session OR JWT with revocation: `pass` / `fail`
- [ ] Logout server-side revocation: `pass` / `fail`
- [ ] Session ID regeneration at sign-in: `pass` / `fail`

### Authorization

- [ ] Two-layer enforcement on tenant resources: `pass` / `fail`
- [ ] Role-revocation latency acceptable: `pass` / `fail`
- [ ] Cross-tenant test coverage: `pass` / `fail`

### MFA

- [ ] MFA recovery codes issued at enrollment: `pass` / `fail` / `n/a`
- [ ] Recovery flow MFA-protected: `pass` / `fail` / `n/a`
- [ ] TOTP secret encrypted at rest: `pass` / `fail` / `n/a`
- [ ] Magic link single-use: `pass` / `fail` / `n/a`
- [ ] SMS as recovery only: `pass` / `fail` / `n/a`

### Configuration

- [ ] `state` and `nonce` cryptographically random: `pass` / `fail`
- [ ] No `http://` redirect URIs in production: `pass` / `fail`
- [ ] No wildcard redirect URIs: `pass` / `fail`
- [ ] No `service_role` / superuser keys in client bundle: `pass` / `fail`
- [ ] Google client unused-deletion defense (synthetic call + runbook): `pass` / `fail` / `n/a`

### Process

- [ ] Audit log on auth events: `pass` / `fail`
- [ ] Email-domain allowlist enforced (if applicable): `pass` / `fail` / `n/a`
- [ ] `link_account` events logged + user-notified: `pass` / `fail` / `n/a`

## Items explicitly handed to security-worker-bee

For each `flag-to-security` above, list the file:line and the question being asked:

| File:line | Question |
|---|---|
| _____ | _____ |

## Items handed to other Bees

| Bee | What | Why |
|---|---|---|
| `db-worker-bee` | Schema migration + RLS policies | auth-worker-bee flagged the requirements |
| `react-worker-bee` | `<SignIn />`, `<UserMenu />` JSX | Protocol vs UI split |
| `quality-worker-bee` | Post-implementation QA | After security audit |

## Open questions

- _____
- _____
