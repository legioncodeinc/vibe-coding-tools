# The developer's guide to JWKS - WorkOS / Session tokens - WorkOS API Reference

- URL: https://workos.com/blog/developers-guide-jwks ; https://workos.com/docs/reference/authkit/session-tokens/jwks ; https://workos.com/docs/reference/authkit/logout
- Fetched: 2026-08-14
- Source type: official vendor documentation and engineering blog (WorkOS)
- Component: WorkOS AuthKit session verification

## JWKS verification

- WorkOS access tokens are JWTs signed against a hosted JWKS endpoint at `https://api.workos.com/sso/jwks/{client_id}` (per-client-id, not a single global endpoint).
- Recommended verification with the `jose` library:
```ts
import { createRemoteJWKSet, jwtVerify } from 'jose';
const JWKS = createRemoteJWKSet(new URL(`https://api.workos.com/sso/jwks/${process.env.WORKOS_CLIENT_ID}`));
async function verifyWorkOSToken(sessionToken: string) {
  const { payload } = await jwtVerify(sessionToken, JWKS, {
    issuer: 'https://api.workos.com',
    audience: process.env.WORKOS_CLIENT_ID,
  });
  return payload;
}
```
- `createRemoteJWKSet` handles caching and cache invalidation of the fetched public keys automatically - a downstream service should use this rather than fetching/parsing the JWKS document itself.
- WorkOS manages RSA signing key generation, storage, and rotation; during rotation BOTH the outgoing and incoming keys are present in the JWKS simultaneously, so in-flight tokens continue to validate without interruption - a verifier must therefore always resolve the signing key from the JWKS by the token's `kid` header rather than caching a single static key long-term.
- Explicit note on revocation: "If you maintain a token revocation list or blocklist, you can invalidate tokens by `jti` (JWT ID) or `sub` (subject) without touching the JWKS at all, but this reintroduces the statefulness that JWKS was meant to eliminate, and only works if your verifiers check the revocation list." - i.e. JWKS/JWT verification alone is stateless and CANNOT immediately revoke an already-issued access token; a separate stateful revocation list is required if immediate revocation (e.g. on admin-forced logout, compromised-account response) is a requirement, and every verifier in the system must consult it.

## Refresh tokens

- Refresh tokens may only be used ONCE - each refresh call issues a new access token and rotates the refresh token; reusing an already-consumed refresh token fails. Refresh succeeds only while the underlying session is still active server-side.
- For browser-based apps that cannot hold secrets (SPA/mobile), WorkOS stores the refresh token inside an `HttpOnly` session cookie rather than exposing it to client-side JS, specifically to prevent a stolen/exfiltrated refresh token via XSS: "This ensures that the refresh token is inaccessible to client-side code."
- Default session lifetimes noted in the WorkOS dashboard: 7 days for refresh tokens ("Maximum session length"), 5 minutes for access tokens ("Access token duration") - short-lived access tokens plus rotating refresh tokens is the default posture, not a hardening opt-in.

## Logout

`GET /user_management/sessions/logout?session_id=...&return_to=...` ends a specific session server-side by `session_id` (extractable from the `sid` claim of the access token, or via `getLogoutUrlFromSessionCookie` which extracts it from the sealed session cookie for you); the SDK builds a redirect URL that performs the logout and then returns the user to `return_to`.
