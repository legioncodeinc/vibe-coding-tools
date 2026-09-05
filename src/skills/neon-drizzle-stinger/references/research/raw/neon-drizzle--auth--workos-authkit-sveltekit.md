# AuthKit SDK for SvelteKit - WorkOS (GitHub README)

- URL: https://github.com/workos/authkit-sveltekit/blob/main/README.md
- Fetched: 2026-08-14
- Source type: Official (WorkOS GitHub repository README)
- Component: Migration from Supabase, auth replacement (WorkOS in this stack)

## Overview

The official WorkOS AuthKit SDK for SvelteKit applications, providing session-based authentication with encrypted cookies. Positioned as "SvelteKit Native, built for SvelteKit's architecture," with full TypeScript support.

Install: `npm install @workos/authkit-sveltekit`

## Required environment variables

```
WORKOS_CLIENT_ID=client_...
WORKOS_API_KEY=sk_...
WORKOS_REDIRECT_URI=http://localhost:5173/callback
WORKOS_COOKIE_PASSWORD=<min 32 chars>
```

## Setup sequence

1. **`app.d.ts`**, extend `App.Locals` with the AuthKit auth type:

```typescript
declare global {
  namespace App {
    interface Locals {
      auth: import('@workos/authkit-sveltekit').AuthKitAuth;
    }
  }
}
export {};
```

2. **`hooks.server.ts`**, configure and install the handle:

```typescript
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

If the runtime supports `process.env`, `configureAuthKit` can be skipped and the SDK reads config automatically.

3. **Callback route** (`src/routes/callback/+server.ts`):

```typescript
import { authKit } from '@workos/authkit-sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const handler = authKit.handleCallback();
  return handler(event);
};
```

4. **Sign-in endpoint** (`src/routes/sign-in/+server.ts`), **required**, not optional, for certain flows:

```typescript
import { redirect } from '@sveltejs/kit';
import { authKit } from '@workos/authkit-sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const signInUrl = await authKit.getSignInUrl();
  throw redirect(302, signInUrl);
};
```

This route must be registered as the **Sign-in endpoint** (`initiate_login_uri`) in the WorkOS dashboard's Redirects settings. **Explicit gotcha**: without a configured sign-in endpoint, WorkOS-dashboard-initiated flows (e.g. user impersonation) fail, because they redirect straight to the callback URL without the PKCE/CSRF `state` parameter this library enforces on every callback, the error surfaces as "Missing required auth parameter."

5. **Protecting routes**, in any `+page.server.ts`:

```typescript
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

## API surface

| Function | Purpose |
|---|---|
| `authKit.withAuth(handler)` | Protects a route/action, redirecting unauthenticated users to sign in |
| `authKit.getUser(event)` | Get the current user (nullable) |
| `authKit.getSignInUrl(options)` | Get the WorkOS-hosted sign-in URL |
| `authKit.getSignUpUrl(options)` | Get the WorkOS-hosted sign-up URL |
| `authKit.signOut(event)` | Sign the user out |
| `authKitHandle(options)` | SvelteKit `handle` hook that manages authentication for every request |

## Config shape

```typescript
interface AuthKitConfig {
  clientId: string;
  apiKey: string;
  redirectUri: string;
  cookiePassword: string; // min 32 chars
  cookieName?: string;    // default 'wos-session'
  cookieDomain?: string;
  cookieMaxAge?: number;  // default 400 days
}
```

## Relevance for a Supabase-to-Neon migration in this stack

This library replaces Supabase Auth's session/cookie management, sign-in/callback routes, and `locals`-based current-user access in a SvelteKit app. It authenticates independently of the database, it issues its own session and (per the RLS docs) can be wired as a JWT issuer for Neon RLS policies via `auth.user_id()`/JWKS validation, the same integration pattern Neon documents for Clerk/Auth0/any JWT-issuing provider. WorkOS user IDs are **not** the same as Supabase `auth.users` IDs, so any Supabase-to-Neon migration that also switches to WorkOS needs the same "remap `user_id` by email" step documented for Neon's own Managed Better Auth migration path, applied instead to WorkOS user IDs.
