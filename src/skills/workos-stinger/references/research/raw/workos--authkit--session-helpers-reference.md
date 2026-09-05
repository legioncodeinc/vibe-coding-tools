# Session helpers API reference (loadSealedSession, authenticate, refresh, getLogOutUrl)

- URL: https://workos.com/docs/reference/authkit/session-helpers/authenticate ; https://workos.com/docs/reference/authkit/session-helpers/load-sealed-session ; https://workos.com/docs/reference/user-management/authentication/session-cookie
- Fetched: 2026-08-14
- Source type: Official API reference (workos.com/docs/reference)
- Component: AuthKit / Sessions / Node SDK

## Content

After authenticating and storing the encrypted session as a cookie, retrieving and decrypting the session is made easy via session helper methods on the Node SDK.

### Load sealed session

```js
import { WorkOS } from '@workos-inc/node';

const session = await workos.userManagement.loadSealedSession({
  sessionData: 'sealed_session_cookie_data',
  cookiePassword: 'password_previously_used_to_seal_session_cookie',
});
```

### Authenticate

```js
const authResponse = await session.authenticate();

if (authResponse.authenticated) {
  // User is authenticated and session data can be used
  const { sessionId, organizationId, role, permissions, user } = authResponse;
} else {
  if (authResponse.reason === 'no_session_cookie_provided') {
    // Redirect the user to the login page
  }
}
```

### Refresh

Refreshes the user's session with the refresh token. Passing a new organization ID switches the user to that organization.

```js
const refreshResult = await session.refresh();

if (!refreshResult.authenticated) {
  // Redirect the user to the login page
}

const {
  session: userSession,
  sealedSession,
  user,
  organizationId,
  role,
  permissions,
  entitlements,
  impersonator,
} = refreshResult;

// Use claims and userSession for further business logic
// Set the sealedSession in a cookie
```

### Get log out URL

Functionally similar to the standalone Get Logout URL endpoint but extracts the session ID automatically from the session data.

```js
const logOutUrl = await session.getLogOutUrl();
// Redirect the user's browser to this URL
```

### Server-side "refresh and seal" endpoint (stateless refresh)

`workos.userManagement.refreshAndSealSessionData` unseals session data from a cookie, authenticates with the existing refresh token, and returns the sealed data for the refreshed session in one call:

```js
import { RefreshAndSealSessionDataFailureReason, WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_example_123456789', { clientId: 'client_123456789' });

const { authenticated, ...restOfRefreshResponse } =
  await workos.userManagement.refreshAndSealSessionData({
    sessionData: 'sealed_session_cookie_data',
    cookiePassword: 'password_previously_used_to_seal_session_cookie',
  });

if (authenticated) {
  const { sealedSession } = restOfRefreshResponse;
  // Set the sealed session in a cookie
} else {
  const { reason } = restOfRefreshResponse;
  if (reason === RefreshAndSealSessionDataFailureReason.NO_SESSION_COOKIE_PROVIDED) {
    // Redirect the user to the login page
  }
}
```

Success response shape: `{ "authenticated": true, "sealed_session": "Fe26.2*1*d7f59d8b9d29c26c44dd3df2b56a7d1d40d4" }`
Failure response shape: `{ "authenticated": false, "reason": "invalid_session_cookie" }`
