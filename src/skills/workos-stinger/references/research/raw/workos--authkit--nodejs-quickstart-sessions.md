# Node.js Quick Start - AuthKit (full flow, sealed sessions, protected routes, logout)

- URL: https://workos.com/docs/authkit/vanilla/nodejs
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: AuthKit / Node SDK / Sessions

## Content

Prerequisites: a WorkOS account, API Key, and Client ID.

### Configure a redirect URI

A redirect URI is a callback endpoint that WorkOS redirects to after a user authenticates. This endpoint exchanges the authorization code returned by WorkOS for an authenticated User object. Set it in the Applications section of the WorkOS Dashboard > your app > Redirects tab. Recommended default for local dev: `http://localhost:3000/callback`.

### Configure Initiate login URL

When a sign-in request did not originate at your application (e.g. IdP-initiated SSO or dashboard impersonation), AuthKit redirects to your application's Initiate login URL, an endpoint you define that redirects users to sign in using AuthKit. Configure this from the app's Redirects tab.

### Set secrets

```
WORKOS_API_KEY='sk_example_123456789'
WORKOS_CLIENT_ID='client_123456789'
```

### (2) Add AuthKit to your app - login endpoint

```js
app.get('/login', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: 'authkit',
    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: 'http://localhost:3000/callback',
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  // Redirect the user to the AuthKit sign-in page
  res.redirect(authorizationUrl);
});
```

WorkOS redirects to the Redirect URI if there is an issue generating an authorization URL.

### Callback endpoint (exchanges code for User)

The authorization code is valid for 10 minutes.

```js
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }
  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  // Use the information in `user` for further business logic.
  return res.redirect('/');
});
```

### (3) Handle the user session - sealed sessions

For security reasons, sessions returned by the SDK are automatically "sealed", i.e. encrypted with a strong password (`WORKOS_COOKIE_PASSWORD`, must be at least 32 characters long). The refresh token is sensitive (it can re-authenticate), hence the session is encrypted before being stored in a cookie.

```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    const authenticateResponse = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID,
      code,
      session: {
        sealSession: true,
        cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
      },
    });

    const { user, sealedSession } = authenticateResponse;

    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return res.redirect('/');
  } catch (error) {
    return res.redirect('/login');
  }
});
```

### Reading the session on a page

```js
app.get('/', async (req, res) => {
  let user = null;
  try {
    const session = workos.userManagement.loadSealedSession({
      sessionData: req.cookies['wos-session'],
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    });
    const authResult = await session.authenticate();
    if (authResult.authenticated) {
      user = authResult.user;
    }
  } catch (e) {
    // Not authenticated, user stays null
  }
  // render page using `user`
});
```

### Protected routes middleware (with automatic refresh)

```js
async function withAuth(req, res, next) {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const { authenticated, reason } = await session.authenticate();

  if (authenticated) {
    return next();
  }

  // If the cookie is missing, redirect to login
  if (!authenticated && reason === 'no_session_cookie_provided') {
    return res.redirect('/login');
  }

  // If the session is invalid, attempt to refresh
  try {
    const { authenticated, sealedSession } = await session.refresh();
    if (!authenticated) {
      return res.redirect('/login');
    }
    // update the cookie
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    // Redirect to the same route to ensure the updated cookie is used
    return res.redirect(req.originalUrl);
  } catch (e) {
    // Failed to refresh access token, redirect user to login page after deleting the cookie
    res.clearCookie('wos-session');
    res.redirect('/login');
  }
}

app.get('/dashboard', withAuth, async (req, res) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });
  const { user } = await session.authenticate();
  // ... render dashboard page
});
```

### Ending the session (logout)

```js
app.post('/logout', doubleCsrfProtection, async (req, res) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const url = await session.getLogoutUrl();

  res.clearCookie('wos-session');
  res.redirect(url);
});
```

> Note: CSRF Protection. The logout endpoint uses POST to prevent unintended logouts from browser prefetching. If you haven't configured a Sign-out URI in the WorkOS dashboard, users will see an error when logging out.

### Validation

Start the server, navigate to the app, sign up for an account, sign in, and confirm the user shows up in the **Users** section of the WorkOS Dashboard.
