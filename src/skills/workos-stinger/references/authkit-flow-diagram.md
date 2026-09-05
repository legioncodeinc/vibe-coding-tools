# AuthKit flow diagram

Grounded in [raw/workos--authkit--hosted-ui-overview.md], [raw/workos--authkit--nodejs-quickstart-sessions.md], and [raw/workos--authkit--sessions-reference.md]. See `research/distilled-workos.md` section 2 for the numbered narrative this diagram illustrates.

## Sign-in, callback, and protected-route flow

```mermaid
sequenceDiagram
    participant Browser
    participant SvelteKit as SvelteKit app (hooks.server.ts)
    participant WorkOS as WorkOS / AuthKit

    Browser->>SvelteKit: GET /sign-in
    SvelteKit->>WorkOS: getAuthorizationUrl({ provider: 'authkit', redirectUri, clientId })
    SvelteKit-->>Browser: 302 redirect to AuthKit URL
    Browser->>WorkOS: Load hosted AuthKit sign-in page
    Note over WorkOS: User authenticates<br/>(password, SSO, Magic Auth,<br/>passkey, or MFA step-up)
    WorkOS-->>Browser: 302 redirect to /callback?code=...
    Browser->>SvelteKit: GET /callback?code=...
    SvelteKit->>WorkOS: authenticateWithCode({ code, clientId, session: { sealSession: true, cookiePassword } })
    WorkOS-->>SvelteKit: { user, sealedSession, accessToken, refreshToken }
    SvelteKit-->>Browser: Set-Cookie wos-session (httpOnly, secure, sameSite=lax) + 302 to app
    Browser->>SvelteKit: GET /dashboard (Cookie: wos-session)
    SvelteKit->>SvelteKit: loadSealedSession(cookie).authenticate()
    alt authenticated
        SvelteKit-->>Browser: 200 render protected page
    else expired, has refresh token
        SvelteKit->>WorkOS: session.refresh()
        WorkOS-->>SvelteKit: new sealedSession
        SvelteKit-->>Browser: Set-Cookie (refreshed) + 302 retry same URL
    else no session cookie / refresh failed
        SvelteKit-->>Browser: clear cookie + 302 to /sign-in
    end
```

## Logout flow

```mermaid
sequenceDiagram
    participant Browser
    participant SvelteKit as SvelteKit app
    participant WorkOS

    Browser->>SvelteKit: POST /logout (CSRF-protected)
    SvelteKit->>SvelteKit: loadSealedSession(cookie)
    SvelteKit->>WorkOS: session.getLogoutUrl()
    WorkOS-->>SvelteKit: logout URL
    SvelteKit-->>Browser: clear wos-session cookie + 302 to logout URL
    Browser->>WorkOS: GET logout URL
    WorkOS-->>Browser: 302 to configured Sign-out URI
```

## Notes

- The authorization code from WorkOS is valid for 10 minutes only [raw/workos--authkit--nodejs-quickstart-sessions.md].
- The sign-in endpoint (not just the callback) must be registered in the WorkOS dashboard as the Initiate login URL for IdP-initiated SSO and dashboard impersonation to complete PKCE/CSRF `state` correctly [raw/workos--authkit--sveltekit-sdk.md].
- Logout must be POST, not GET, to avoid a browser prefetch silently ending the session [raw/workos--authkit--nodejs-quickstart-sessions.md].
