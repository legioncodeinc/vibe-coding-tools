# Node SDK initialization, API keys vs. client IDs, PKCE, staging vs. production

- URL: https://workos.com/docs/sdks/node ; https://workos.com/docs/reference/api-authentication ; https://workos.com/docs/authkit/environments
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: Node SDK / API authentication / Environments

## Content

### Confidential (server) initialization

```ts
import { WorkOS } from '@workos-inc/node';
const workos = new WorkOS('sk_1234'); // or read WORKOS_API_KEY env var automatically
```

API key env var: `WORKOS_API_KEY`. All API requests must be over HTTPS; plain HTTP fails outright. Requests without auth, or with an invalid key, return `401`; a valid key with insufficient permissions returns `403`.

### Public client mode (browser / mobile / CLI - no secret storable)

```ts
const workos = new WorkOS({ clientId: 'client_...' }); // no API key

const { url, codeVerifier } = await workos.userManagement.getAuthorizationUrlWithPKCE({
  provider: 'authkit',
  redirectUri: 'myapp://callback',
  clientId: 'client_...',
});

const { accessToken, refreshToken } = await workos.userManagement.authenticateWithCode({
  code: authorizationCode,
  codeVerifier,
  clientId: 'client_...',
});
```

Store `codeVerifier` securely on-device between generating the auth URL and handling the callback (iOS Keychain / Android Keystore / OS credential storage for CLI apps); it must survive app restarts mid-flow.

### PKCE with confidential clients (defense in depth, OAuth 2.1 recommended)

Server-side apps CAN also use PKCE alongside the client secret:

```ts
const workos = new WorkOS('sk_...'); // with API key
const { url, codeVerifier } = await workos.userManagement.getAuthorizationUrlWithPKCE({
  provider: 'authkit',
  redirectUri: 'https://example.com/callback',
  clientId: 'client_...',
});
// Both client_secret AND code_verifier are sent on exchange
const { accessToken } = await workos.userManagement.authenticateWithCode({
  code: authorizationCode,
  codeVerifier,
  clientId: 'client_...',
});
```

### API key vs. Client ID - what each is for

- **API key** (`sk_...` prefix) - a secret credential that can perform any API request; keep it server-side only, never in client-side code / GitHub / unsecured buckets.
- **Client ID** (`client_...` prefix) - identifies the application making the request; safe-ish to reference in redirect construction but paired with the API key server-side for confidential-client flows, and used alone in public-client PKCE mode.

### Staging vs. production - what does NOT carry over automatically

Every WorkOS workspace has fully separate staging and production environments: **API keys, organizations, connections, users, webhook endpoints, and branding are all scoped to a single environment** and do not carry over between them.

| Feature | Staging | Production |
| --- | --- | --- |
| Redirect URIs | `http://` and `localhost` allowed | Requires `https://` for web apps; `http://127.0.0.1` still allowed for native clients |
| API keys | Reviewable anytime in dashboard | **Shown once at creation** - store securely, cannot be viewed again |
| Custom domains | Uses WorkOS domains | Can use custom domains |
| Billing | No charges | Enterprise connections (SAML SSO, SCIM) incur per-connection charges; AuthKit itself free up to 1M MAUs |
| Test IdP | Built-in test IdP (Test Organization, `org_test_idp`) available | No test IdP - real connections only |
| Email subjects | Prefixed `[STAGING]` | No prefix |
| Rate limits | Same as production | Same as staging |
| Branding | Independent from production | Independent from staging |

### Cutover checklist (staging -> production)

1. Verify the integration works end-to-end in staging (sufficient validation for most workflows).
2. Unlock production by adding billing information in the Dashboard.
3. Generate the production API key and store it securely - **it can only be viewed once**.
4. Note the production Client ID, update the app's environment variables.
5. Configure production redirect URIs (`https://` required for web).
6. (Optional) Set up custom domains for AuthKit / Admin Portal / Authentication API.
7. Test the full auth flow in production before sending real traffic.

Things that must be independently (re-)configured per environment when cutting over: API keys and Client IDs, redirect URIs, branding (logo/colors/theme), organizations and SSO/Directory Sync connections, webhook endpoints and secrets, custom domains.
