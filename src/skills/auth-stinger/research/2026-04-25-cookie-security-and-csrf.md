# Cookie Security + CSRF Defense

**Sources:**
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
- https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis (cookie spec)
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

**Retrieved:** 2026-04-25

## Summary

Modern session cookies require `HttpOnly` + `Secure` + `SameSite` + (often) `__Host-` prefix. SameSite=Lax is the floor for CSRF defense; SameSite=None requires both Secure and an additional CSRF token. Storing tokens in `localStorage` is XSS-vulnerable and never appropriate for sessions.

## Cookie attributes

- **`HttpOnly`**: JS cannot read. XSS-resistant.
- **`Secure`**: HTTPS-only.
- **`SameSite=Lax`**: blocks most CSRF. Top-level GET navigation still allowed.
- **`SameSite=Strict`**: blocks even top-level navigation; UX cost. For high-sensitivity flows.
- **`SameSite=None`**: sent in third-party context. Requires Secure. Pair with CSRF token.
- **`__Host-` prefix**: browser-enforced: Secure + Path=/ + no Domain. Use for high-sensitivity sessions.
- **`Path`**: explicit, default `/`.
- **`Max-Age` / `Expires`**: explicit; otherwise session cookie (cleared on browser close).

## CSRF defense

`SameSite=Lax` blocks most CSRF, but not all:

- GETs (Lax allows top-level).
- Cross-site POSTs from sites the browser considers same-site.
- Older browsers without SameSite support.

**Layered defense for state-changing endpoints:**

1. **Double-submit cookie**: server sets `csrf_token` cookie (client-readable) AND requires the same value in a request header. Cross-origin attackers can't read the cookie, can't forge the header.
2. **Origin / Referer header check**: reject mismatched.
3. **Custom request header** (e.g., `X-Requested-With`): triggers CORS preflight, blocks simple cross-origin attacks.

## Storage anti-patterns

- **`localStorage` for tokens**: XSS-readable. Never use for sessions.
- **`sessionStorage`**: same as localStorage but tab-scoped. Same XSS issue.
- **JS variable**: gone on refresh; not session storage.

## Relevance

- `guides/10-session-storage.md`: full deep dive.
- `templates/session-cookie-config.ts`: fillable config.
- `scripts/cookie-attribute-checker.ts`: runtime verification.
