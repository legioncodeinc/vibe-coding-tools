# Sessions - AuthKit

- URL: https://workos.com/docs/authkit/sessions
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: AuthKit / Sessions

## Content

When a user signs in, a session is created. Along with the User object, a successful authentication response includes an access token and a refresh token.

- The **access token** should be stored as a secure cookie in the user's browser and validated by the backend on each request.
- The **refresh token** should either be stored in a secure cookie or persisted on the backend. Once the access token has expired, a new one can be obtained using the refresh token.

If using the Next SDK (`@workos-inc/authkit-nextjs`) or Remix SDK (`authkit-remix`), token validation and refresh are handled automatically.

Refresh tokens should be persisted on the backend (database, cache, or secure http-only cookie). A new access token is obtained via the "authenticate with refresh token" endpoint. If the session is still active, a new access token AND refresh token are returned. **Refresh tokens may be rotated after use** - always replace the old refresh token with the newly returned one.

### Signing out

Steps when a user signs out:

1. Get the session id (`sid` claim) out of the access token.
2. Delete the user's app session.
3. Redirect the user's browser to the logout endpoint (ends the session at WorkOS).
4. The user is redirected back to the URL configured as the App homepage URL.

```javascript
// extract sessionId from access token
const sessionId = jose.decodeJwt(session.accessToken).sid;

// delete app session cookie
cookies().delete('my-app-session');

// redirect to logout endpoint
// (the user will be redirected to your App homepage URL after logout completes)
redirect(workos.userManagement.getLogoutUrl({ sessionId }));
```

Configure a default **Sign-out URI** (location users are redirected to after session ends). Non-default sign-out URIs can be used via the `return_to` parameter of the Logout API for dynamic final-redirect selection.
