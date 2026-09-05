# OAuth 2.0 / 2.1 + Token Strategy

**Sources:**
- RFC 6749 (OAuth 2.0)
- RFC 7636 (PKCE)
- RFC 7519 (JWT)
- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1 (OAuth 2.1 draft)
- https://oauth.net/2.1/

**Retrieved:** 2026-04-25

## Summary

OAuth 2.1 consolidates a decade of OAuth 2.0 best practices: PKCE required for public clients, implicit flow deprecated, refresh-token rotation required. The Authorization Code flow with PKCE is the canonical pick for both server-side and client-side apps.

## Token types

- **Access token**: short-lived (5-60 min), bearer for API calls. JWT or opaque.
- **Refresh token**: longer-lived (days-months), used only to obtain new access tokens.
- **ID token**: OpenID Connect only. JWT signed by IdP, asserts user identity. For sign-in, not API auth.
- **Session token / cookie**: your app's own session ID.

## Critical mistakes

- **Conflating tokens**: ID token used for API auth. Access token used for session.
- **Implicit flow** (`response_type=token`): deprecated; tokens leak in URL fragments.
- **No PKCE**: public clients (SPAs, mobile) must use PKCE; OAuth 2.1 also requires for confidential clients.
- **No refresh-token rotation**: leaked refresh = persistent ownership.
- **Skipping ID-token signature verification**: anyone can forge.

## Refresh-token rotation

```
1. User signs in. Issue access (10 min) + refresh (7 days).
2. Access expires. Client calls /refresh with refresh.
3. Server validates refresh, ROTATES it: new access + new refresh, INVALIDATE old refresh.
4. If old refresh reused, treat as compromise: revoke session, log out.
```

The reuse-detection is the value.

## ID-token verification (OIDC)

Verify in this order:

1. JWS signature against IdP JWKS (auto-fetched from `well-known/openid-configuration`).
2. `iss` matches expected IdP.
3. `aud` matches your `client_id`.
4. `exp` not in past.
5. `nonce` matches the value you stored at flow start.

Most libraries do this; **confirm**.

## Relevance

- `guides/06-google-oauth.md`: Google-specific flow.
- `guides/10-session-storage.md`: token storage.
- `guides/11-common-failure-modes.md`: what goes wrong.
