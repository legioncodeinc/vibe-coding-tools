# AuthKit SDK for SvelteKit (official SDK, hooks.server.ts pattern, package name conflict)

- URL: https://github.com/workos/authkit-sveltekit ; https://workos.com/docs/authkit/cli-installer/what-the-cli-handles ; https://github.com/workos/sveltekit-authkit-example ; https://registry.npmjs.org/@workos/authkit-sveltekit
- Fetched: 2026-08-14
- Source type: Official GitHub repo (workos org) + official docs (CLI installer table) + archived example repo
- Component: AuthKit / SvelteKit SDK

## Content

### CONFLICT FLAG: two package names both presented as "official"

1. The **workos.com/docs CLI Installer** framework table (current live docs, fetched 2026-08-14) lists the SvelteKit SDK as **`@workos-inc/authkit-sveltekit`**, in the same `@workos-inc/*` npm scope as every other official framework SDK (`@workos-inc/authkit-nextjs`, `@workos-inc/authkit-react`, `@workos-inc/authkit-react-router`, `@workos-inc/node`).
2. The **`workos/authkit-sveltekit` GitHub repo** (org: workos, created 2025-07-27, MIT licensed, top contributor `nicknisi`) documents installing **`@workos/authkit-sveltekit`** (different npm scope: `@workos` not `@workos-inc`) and describes itself as "The official WorkOS AuthKit SDK for SvelteKit applications."
3. The now-archived `workos/sveltekit-authkit-example` repo says it "has been moved into the authkit-sveltekit project" but itself documents installing `@workos-inc/authkit-sveltekit` (matching the CLI installer table, not the current `workos/authkit-sveltekit` README).

**Resolution guidance:** this is an unresolved naming conflict between two sources that both claim official status. Prefer the CLI installer table's `@workos-inc/authkit-sveltekit` as the source of truth since it is the currently-maintained top-level docs page, but **verify the actual npm package name on npmjs.com immediately before scaffolding** any project, since the underlying SDK appears to have been renamed or exists in two parallel scopes at time of research.

### hooks.server.ts pattern (from `workos/authkit-sveltekit` README)

```typescript
// hooks.server.ts
import { configureAuthKit, authKitHandle } from '@workos/authkit-sveltekit';
import { env } from '$env/dynamic/private';

configureAuthKit({
  clientId: env.WORKOS_CLIENT_ID,
  apiKey: env.WORKOS_API_KEY,
  redirectUri: env.WORKOS_REDIRECT_URI,
  cookiePassword: env.WORKOS_COOKIE_PASSWORD,
});

export const handle = authKitHandle();
```

If the runtime supports `process.env`, `configureAuthKit` can be skipped entirely and the SDK reads config automatically.

### Callback route

```typescript
// src/routes/callback/+server.ts
import { authKit } from '@workos/authkit-sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const handler = authKit.handleCallback();
  return handler(event);
};
```

### Sign-in endpoint (required for dashboard impersonation / IdP-initiated flows)

```typescript
// src/routes/sign-in/+server.ts
import { redirect } from '@sveltejs/kit';
import { authKit } from '@workos/authkit-sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const signInUrl = await authKit.getSignInUrl();
  throw redirect(302, signInUrl);
};
```

Set this route as the **Sign-in endpoint** (`initiate_login_uri`) in the WorkOS dashboard Redirects settings. Without it, WorkOS-initiated flows such as dashboard impersonation fail because the PKCE/CSRF `state` parameter the SDK enforces on every callback cannot be set up first.

### Protecting a load function

```typescript
// +page.server.ts
import { authKit } from '@workos/authkit-sveltekit';

export const load = authKit.withAuth(async ({ auth }) => {
  // auth.user is guaranteed to exist
  return {
    user: auth.user,
    organizationId: auth.organizationId,
    role: auth.role,
    permissions: auth.permissions,
  };
});
```

> Apply `withAuth` only to routes that serve top-level HTML documents. Using it on JSON API endpoints sets PKCE verifier cookies on XHR responses that can't complete the OAuth flow, and (with per-flow cookie naming in `authkit-session` 0.5.0+) can accumulate into HTTP 431 under concurrent load.

### Config shape

```typescript
interface AuthKitConfig {
  clientId: string;
  apiKey: string;
  redirectUri: string;
  cookiePassword: string; // min 32 chars
  cookieName?: string; // default: 'wos-session'
  cookieDomain?: string;
  cookieMaxAge?: number; // default: 400 days
}
```

### Required env vars

```env
WORKOS_CLIENT_ID=client_01234567890123456789012345
WORKOS_API_KEY=<WORKOS_API_KEY>
WORKOS_REDIRECT_URI=http://localhost:5173/callback
WORKOS_COOKIE_PASSWORD=your-secure-password-at-least-32-chars
```
Generate a secure cookie password with `openssl rand -base64 24`.

### Other exports documented

- `authKit.getUser(event)` - get current user, nullable.
- `authKit.getSignUpUrl(options)` - sign-up URL, options include `returnTo`, `organizationId`, `loginHint`.
- `authKit.signOut(event)` - sign out current user, used in a form action.
- `authKit.switchOrganization(event, { organizationId })` - switch active org for multi-org users.
- `authKitHandle(options)` accepts `debug` and `onError` callback.

### CLI Installer supported frameworks table (from official docs)

| Framework | SDK |
| --- | --- |
| Next.js | `@workos-inc/authkit-nextjs` |
| React | `@workos-inc/authkit-react` |
| React Router | `@workos-inc/authkit-react-router` |
| TanStack Start | `@workos/authkit-tanstack-start` |
| SvelteKit | `@workos-inc/authkit-sveltekit` |
| Node.js / Express | `@workos-inc/node` |
| Vanilla JS | `workos` |
| Python / Django | `workos` (pip) |
| Ruby / Rails | `workos` (gem) |
| Go | `github.com/workos/workos-go` |
| PHP | `workos/workos-php` |
| .NET / ASP.NET Core | `WorkOS.net` |

Note the TanStack Start row uses the `@workos/*` scope (not `@workos-inc/*`), suggesting WorkOS uses both scopes across different framework SDKs rather than one being universally deprecated - this weakens the case for treating either scope as definitively wrong, and strengthens the "verify on npm before use" recommendation above.
