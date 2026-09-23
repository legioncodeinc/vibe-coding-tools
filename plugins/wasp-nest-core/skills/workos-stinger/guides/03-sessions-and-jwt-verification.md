# 03. Sessions and JWT verification

## Sealed sessions - the default you should use

A successful authentication returns an access token and a refresh token. Rather than storing either directly in a cookie, the SDK "seals" (encrypts) both together with `WORKOS_COOKIE_PASSWORD` before it ever reaches the browser, because the refresh token is a bearer secret capable of re-authenticating the user [raw/workos--authkit--nodejs-quickstart-sessions.md]. This is what `configureAuthKit` + `authKitHandle` (guide 02) do for you automatically - you should not need to touch the access/refresh tokens directly in normal SvelteKit usage.

## The authenticate -> refresh -> re-login lifecycle

```
loadSealedSession(cookie).authenticate()
  -> authenticated: true         -> proceed
  -> authenticated: false,
     reason: no_session_cookie_provided
                                  -> redirect to /sign-in
  -> authenticated: false,
     (session expired but refresh token still valid)
                                  -> session.refresh()
                                     -> success: rewrite the cookie, retry the request
                                     -> failure: clear the cookie, redirect to /sign-in
```
[raw/workos--authkit--nodejs-quickstart-sessions.md, raw/workos--authkit--session-helpers-reference.md]

Refresh tokens may be rotated on use - always persist the newly returned refresh token/sealed session rather than reusing the old value [raw/workos--authkit--sessions-reference.md, raw/workos--authkit--session-helpers-reference.md].

**Open question for SvelteKit specifically**: the Next.js and Remix SDKs are documented to handle this refresh cycle automatically [raw/workos--authkit--sessions-reference.md]. No primary source directly confirms the SvelteKit SDK does the same silently inside `authKitHandle()`. Until that's confirmed against the resolved package (see guide 02), assume you may need the explicit refresh-and-rewrite pattern shown in `references/hooks-server-session-pattern.md` / `references/authkit-flow-diagram.md` rather than trusting silent auto-refresh.

## Logging out

Extract the session id, ask the SDK for the WorkOS logout URL, clear your own cookie, then redirect the browser to that URL so WorkOS also ends its side of the session:

```js
const sessionId = jose.decodeJwt(session.accessToken).sid;
cookies().delete('my-app-session');
redirect(workos.userManagement.getLogoutUrl({ sessionId }));
```
[raw/workos--authkit--sessions-reference.md]

Or, using the sealed-session helper directly (simpler, no manual JWT decode needed): `session.getLogOutUrl()` extracts the session id from the sealed session data automatically [raw/workos--authkit--session-helpers-reference.md]. Make the logout endpoint **POST**, not GET, with CSRF protection - a GET logout endpoint can be triggered by browser link-prefetching [raw/workos--authkit--nodejs-quickstart-sessions.md].

## When you need raw JWT/JWKS verification instead

The sealed-session flow above already verifies the token server-side as part of `.authenticate()`. Reach for manual JWKS verification (`references/jwt-verification.md`) only when a **separate service** receives a bare WorkOS access token without the sealed cookie - for example, an internal API that trusts a forwarded `Authorization: Bearer <token>` header from your SvelteKit app.

```ts
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(new URL(`https://api.workos.com/sso/jwks/${clientId}`));

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    algorithms: ['RS256'],
    issuer: 'https://api.workos.com/',
  });
  return payload;
}
```
[raw/workos--authkit--jwt-jwks-verification.md]

Define the `JWKS` constant at module scope, not inside a function - `createRemoteJWKSet` caches keys in memory and only refetches when it sees an unrecognized `kid`, so module scope is what lets that cache survive across requests [raw/workos--authkit--jwt-jwks-verification.md]. Always pass `algorithms`, `issuer`, and `audience` (when applicable) explicitly rather than relying on defaults [raw/workos--authkit--jwt-jwks-verification.md].

## Next

`04-user-management-and-orgs.md` covers what's actually inside `auth.user`, `auth.organizationId`, and how organization membership works.
