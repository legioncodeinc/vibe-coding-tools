# Session Management Cheat Sheet - OWASP Cheat Sheet Series

- URL: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Fetched: 2026-08-14
- Source type: official standard (OWASP Cheat Sheet Series)
- Component: session/cookie handling, framework-agnostic (applies to WorkOS session cookies and any custom session cookie)

## Session ID properties

- Session identifiers must have at least 64 bits of entropy from a CSPRNG to resist brute-force guessing. At 64 bits of entropy, brute-forcing a valid session ID at 10,000 guesses/sec against 100,000 concurrent valid sessions would take roughly 585 years.
- Session ID content/value must be meaningless to the client - never encode PII or business logic in the ID itself; store the meaning (roles, IP, user agent, timeouts, etc.) server-side.
- Prefer the session ID generation built into your framework/auth provider over rolling your own.

## Session fixation and exchange mechanism

- A web application should exchange session IDs only via cookies. If a client submits a session ID through another channel (URL parameter, hidden form field), the application should refuse to accept it - accepting externally-supplied IDs is the core enabler of session fixation attacks, where an attacker sets/injects a known session ID into the victim's browser before authentication and then simply waits for the victim to authenticate under that known ID.
- Session ID regeneration on privilege change (most importantly: on login) is mandatory to prevent session fixation, independent of HTTP vs HTTPS.
- TLS/HTTPS protects the session ID against interception in transit (MitM) but does NOT by itself protect against prediction, brute force, client-side tampering, or fixation - it is one necessary layer, not a complete defense.

## Cookie attributes (the concrete audit checklist for any session cookie)

- `Secure`: cookie is only sent over HTTPS. Mandatory - prevents MitM disclosure of the session ID over a downgraded/unencrypted connection.
- `HttpOnly`: cookie is inaccessible to `document.cookie` / JS. Mandatory - the single mitigation that stops session-ID theft via an XSS vulnerability elsewhere in the app. (Only protects confidentiality; if XSS is combined with CSRF, the browser still attaches the cookie to the forged request.)
- `SameSite`: controls cross-site sending. `SameSite=Strict` (preferred) or `SameSite=Lax` should be set explicitly on session cookies; treat `SameSite` as defense-in-depth against CSRF, not a replacement for CSRF tokens/origin checks. Never use `SameSite=None` without also setting `Secure`. Do not rely on browser-default `SameSite` behavior, since it varies by browser/version.
- Cookie name prefixes (RFC 6265bis §4.1.3): `__Host-` requires `Secure`, no `Domain` attribute, and `Path=/` - prevents subdomain forgery and downgrade attacks; recommended for session IDs. `__Secure-` requires only `Secure`, used when subdomain sharing is needed. Recommended pattern: `Set-Cookie: __Host-SessionID=<value>; Secure; HttpOnly; SameSite=Strict; Path=/`.
- `Domain`/`Path`: keep as narrow as possible. Do not set `Domain` to a broad parent domain (e.g. `example.com`) - this exposes the session cookie to every subdomain, including less-trusted ones, enabling cross-subdomain session fixation if any subdomain is compromised or has a lower security bar.
- `Expires`/`Max-Age`: prefer non-persistent (session) cookies for authentication so the session dies when the browser closes; persistent cookies remain on disk and extend the attack window if the device is compromised.

## Storage location - the localStorage/sessionStorage warning

- Explicit warning (marked `[!WARNING]` in the source): "Do not store authentication tokens, session IDs, JWTs, refresh tokens, or any credential in `localStorage` or `sessionStorage`. These APIs are accessible to any JavaScript executing in the origin, so a single XSS vulnerability discloses every token. Use `HttpOnly; Secure; SameSite=Strict` cookies (preferred) or a Backend-for-Frontend (BFF) pattern."
- This directly rules out client-side token storage patterns sometimes seen in SPA-style code (e.g. storing a WorkOS or custom JWT in `localStorage` for an `Authorization` header) as an anti-pattern versus the cookie-based session model.
