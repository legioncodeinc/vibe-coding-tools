# Session tokens, JWKS, and third-party JWT verification patterns

- URL: https://workos.com/docs/reference/authkit/session-tokens/jwks ; https://workos.com/docs/reference/sso/json-web-key-set ; https://workos.com/blog/how-to-verify-jwts-in-nextjs-app-router ; https://workos.com/blog/how-to-handle-jwt-in-javascript
- Fetched: 2026-08-14
- Source type: Official docs + official WorkOS engineering blog
- Component: AuthKit / JWT verification

## Content

### JWKS URL

The access token returned in successful authentication responses is a JWT that can be used to verify a user has an active session. The JWT is signed by a JWKS retrievable from the WorkOS API.

```
GET https://api.workos.com/sso/jwks/{clientId}
```

Response:

```json
{
  "keys": [
    {
      "alg": "RS256",
      "kty": "RSA",
      "use": "sig",
      "x5c": ["MIIDQjCCAiqgAwIBAgIGATz/FuLiMA0GCSqGSIb3DQEBCwUA..."],
      "n": "0vx7agoebGc...eKnNs",
      "e": "AQAB",
      "kid": "key_01HXYZ123456789ABCDEFGHIJ",
      "x5t#S256": "ZjQzYjI0OT...NmNjU0"
    }
  ]
}
```

The refresh token can be used to obtain a new access token via the "authenticate with refresh token" endpoint. Refresh tokens may only be used once; refreshes succeed as long as the user's session is still active.

### Verifying with `jose` (pattern applicable to any Node/edge runtime, including SvelteKit)

Use RS256 with JWKS whenever the token issuer is a third party (any identity provider, OIDC service, or enterprise SSO setup) - which is the case for WorkOS access tokens. Fetch the issuer's public keys and let `jose` handle lookup by `kid`:

```ts
// lib/auth.ts
import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL('https://api.workos.com/sso/jwks/client_id')
)

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    algorithms: ['RS256'],
    issuer: 'https://api.workos.com/',
    audience: 'https://api.your-app.com',
  })
  return payload
}
```

`createRemoteJWKSet` caches keys in memory and refreshes them when it encounters an unrecognized `kid`, so the network cost is not paid on every request. Define the `JWKS` constant once at module scope, not inside a function, so the cache survives across requests.

Guidance from the official blog:
- Always pass `algorithms`, `issuer`, and `audience` explicitly to `jwtVerify`.
- Keep tokens in `httpOnly` cookies, never `localStorage`.
- Verify in middleware/hooks for routing decisions, and again in server load functions/route handlers for anything that reads claims.
- Each JWKS key carries a `kid` identifier matching the `kid` in the token header, so the verifier knows which key to use; issuers rotate keys periodically without invalidating outstanding tokens.

### Alternative: SDK-managed sessions vs. raw JWT verification

For most SvelteKit apps, the sealed-session helpers (`loadSealedSession().authenticate()`) documented in `workos--authkit--session-helpers-reference.md` already perform token verification server-side as part of `authenticate()`. Raw JWKS verification via `jose` is the pattern to reach for when: verifying WorkOS-issued access tokens in a separate downstream API/service that only receives the bearer JWT (not the sealed cookie), or building headless/custom auth without the sealed-session cookie flow.
