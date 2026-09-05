# 10: Session Storage

Cookies, JWT vs opaque, refresh-token rotation, CSRF defense.

Source: `research/2026-04-25-cookie-security-and-csrf.md`, `research/2026-04-25-oauth2-and-token-strategy.md`, OWASP Session Management Cheat Sheet.

## Token types: get the vocabulary right

- **Access token**: short-lived (5-60 min), bearer credential for API calls. JWT or opaque.
- **Refresh token**: longer-lived (days-months), used only to obtain new access tokens. Bearer credential.
- **ID token**: only in OpenID Connect. JWT signed by the IdP, asserts the user's identity. Used at sign-in; not used for API auth.
- **Session token / cookie**: your app's own session identifier. Sent as `Cookie:` on every request.

The mistake to avoid: conflating these. ID tokens are not for API auth. Access tokens are not for session management. Refresh tokens never go to the client more than once (they're rotated on use).

## Session storage decision: JWT vs opaque

| | JWT session | Opaque session |
|---|---|---|
| Storage | Signed cookie or in client storage | Random ID in cookie + row in DB / Redis |
| Revocation | Hard (need a deny-list) | Easy (delete row) |
| Refresh on activity | Re-issue | Update DB row |
| DB read on each request | None | Yes |
| Best for | High-RPS read-only API at large scale | Most apps |

**Default to opaque sessions** with a server-side store (DB or Redis). Revocation matters more than the saved DB read. JWT sessions are for cases where the read is genuinely a bottleneck, and even then, prefer short-lived JWTs (5 min) + refresh against a server-side store.

## Cookie attributes: the floor

```
Set-Cookie: session=<opaque-id>;
            HttpOnly;
            Secure;
            SameSite=Lax;
            Path=/;
            Max-Age=2592000;       <-- 30 days
            Domain=.example.com    <-- only if you need cross-subdomain
```

Required:

- **`HttpOnly`**: JS cannot read; defends against XSS exfiltration.
- **`Secure`**: sent only over HTTPS; defends against MITM on plain-HTTP.
- **`SameSite=Lax`**: defends against CSRF for state-changing requests in most browsers. Promote to `Strict` for high-sensitivity sessions; promote to `None` only when needed (cross-site embed).
- **`Path=/`**: explicit. Don't accidentally scope a session to `/api`.
- **`Max-Age`**: explicit; not a session cookie. Decide your TTL.

The `__Host-` prefix:

```
Set-Cookie: __Host-session=<id>; HttpOnly; Secure; SameSite=Lax; Path=/
```

`__Host-` cookies must be `Secure`, `Path=/`, no `Domain` attribute. Browsers enforce this; it prevents cookie injection from a subdomain. Use for high-sensitivity sessions, especially when serving cross-origin.

## CSRF: when SameSite isn't enough

`SameSite=Lax` blocks most CSRF, but not:

- GET requests (Lax allows top-level navigation GETs).
- Cross-site POSTs from sites the browser considers same-site by registrable domain.
- Older browsers without SameSite support.

For state-changing endpoints, also implement:

1. **Double-submit cookie**: server sets a `csrf_token` cookie (readable by JS) AND requires the same value in a request header. Attackers can't read cross-origin, so they can't forge the header.
2. **Origin / Referer header check**: reject if `Origin` or `Referer` doesn't match expected.
3. **Custom request header**: requiring `X-Requested-With` or similar means CORS preflight applies, blocking simple cross-origin attacks.

Cite OWASP CSRF Prevention Cheat Sheet, https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html.

## Refresh token rotation

```
1. User signs in. Server issues access_token (10 min) + refresh_token (7 days).
2. Both stored: access in HttpOnly cookie, refresh in HttpOnly cookie OR returned to client.
3. Access expires. Client (or server-side proxy) calls /refresh with refresh_token.
4. Server validates refresh_token, rotates it: issues new access + new refresh, INVALIDATES old refresh.
5. If old refresh is reused, treat as compromise: revoke session, log out.
```

The reuse-detection is the value. If you see the same refresh token used twice, the attacker has the token; force re-auth and revoke everything.

Cite OAuth 2.0 RFC 6749 §10.4, https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1 (OAuth 2.1 draft consolidates rotation as required).

## Idle vs absolute timeouts

Two clocks:

- **Idle timeout**: extended on activity. Common: 30 min idle.
- **Absolute timeout**: hard cap, never extended. Common: 30 days. Forces a fresh sign-in.

Both apply. Web banking: idle 5 min, absolute 1 day. SaaS: idle 30 min, absolute 30 days. Cite OWASP Session Management Cheat Sheet.

## Where to store the session token

- **Server-side opaque token in HttpOnly cookie**: default. Server holds the row.
- **Client-side JWT in HttpOnly cookie**: when DB read is genuinely too costly.
- **Client-side JWT in `localStorage`**: **never**. XSS-readable.
- **Mobile / native app**: secure keystore (iOS Keychain, Android Keystore), not preferences.

## Logout

```
1. Delete session row server-side (or add to deny-list if JWT).
2. Send Set-Cookie: session=; Max-Age=0 to expire client cookie.
3. If using OAuth, optionally call provider's revoke endpoint to invalidate refresh token at IdP.
4. Audit-log the logout event.
```

Logout-everywhere: delete all session rows for the user. Pair with an "end all other sessions" UI.

## Session fixation

A session ID issued before sign-in, then "promoted" to authenticated, is a session-fixation hole. Fix: **regenerate the session ID at sign-in.** Most frameworks do this; confirm.

```ts
// Pre-sign-in: anonymous session_id = abc
// User signs in successfully.
// Generate NEW session_id = xyz; delete row for abc.
```

Cite https://owasp.org/www-community/attacks/Session_fixation.

## Common pitfalls

- **`localStorage` for tokens**: XSS-readable.
- **No `HttpOnly`**: XSS exfiltrates the session.
- **`SameSite=None` without CSRF token**: wide open.
- **JWT sessions with no rotation, no deny-list, 30-day TTL**: a leaked token is good for 30 days.
- **No refresh-token rotation**: leaked refresh = account ownership.
- **Skipping session ID regeneration at sign-in**: session fixation.
- **Logout that only clears the client cookie**: server still honors the token.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- Session strategy (opaque vs JWT) and the rationale.
- Cookie attributes against `templates/session-cookie-config.ts`.
- Refresh-token rotation and reuse-detection logic.
- CSRF defense (SameSite + double-submit / origin check).
- Idle and absolute timeouts.
- Logout flow (server-side revocation + cookie clear + provider revoke).
- Session ID regeneration at sign-in.
