# SvelteKit hooks.server.ts session-handling pattern

Grounded in [raw/workos--authkit--sveltekit-sdk.md], [raw/workos--authkit--nodejs-quickstart-sessions.md], [raw/workos--authkit--session-helpers-reference.md]. Package name per the conflict noted in `research/distilled-workos.md` §5: verify `@workos-inc/authkit-sveltekit` vs `@workos/authkit-sveltekit` on npm before installing; this example uses the CLI-installer-table name (`@workos-inc/authkit-sveltekit`).

Svelte 5 / current SvelteKit idiom: no legacy `App.Locals` boilerplate beyond the typed `app.d.ts` augmentation the SDK itself requires; `hooks.server.ts` is plain `Handle`.

## `src/app.d.ts`

```typescript
/// <reference types="@sveltejs/kit" />
import type { AuthKitAuth } from '@workos-inc/authkit-sveltekit';

declare global {
	namespace App {
		interface Locals {
			auth: AuthKitAuth;
		}
	}
}

export {};
```

## `src/hooks.server.ts`

```typescript
import { configureAuthKit, authKitHandle } from '@workos-inc/authkit-sveltekit';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

// $env/dynamic/private keeps secrets out of the client bundle and works
// identically across `vercel adapter` and local dev.
configureAuthKit({
	clientId: env.WORKOS_CLIENT_ID,
	apiKey: env.WORKOS_API_KEY,
	redirectUri: env.WORKOS_REDIRECT_URI,
	cookiePassword: env.WORKOS_COOKIE_PASSWORD
});

export const handle: Handle = authKitHandle({
	debug: env.NODE_ENV !== 'production',
	onError: (error) => {
		console.error('AuthKit session error:', error);
	}
});
```

If you need to compose AuthKit's handle with other hooks (analytics, CSP headers, etc.), use SvelteKit's `sequence()`:

```typescript
import { sequence } from '@sveltejs/kit/hooks';
import { configureAuthKit, authKitHandle } from '@workos-inc/authkit-sveltekit';
import { env } from '$env/dynamic/private';
import { securityHeaders } from '$lib/server/security-headers';

configureAuthKit({
	clientId: env.WORKOS_CLIENT_ID,
	apiKey: env.WORKOS_API_KEY,
	redirectUri: env.WORKOS_REDIRECT_URI,
	cookiePassword: env.WORKOS_COOKIE_PASSWORD
});

export const handle = sequence(authKitHandle(), securityHeaders);
```

## `src/routes/callback/+server.ts`

```typescript
import { authKit } from '@workos-inc/authkit-sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const handler = authKit.handleCallback();
	return handler(event);
};
```

## `src/routes/sign-in/+server.ts`

Required as the dashboard's "Initiate login URL" so dashboard impersonation and IdP-initiated SSO can complete PKCE/CSRF verification [raw/workos--authkit--sveltekit-sdk.md].

```typescript
import { redirect } from '@sveltejs/kit';
import { authKit } from '@workos-inc/authkit-sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const returnTo = url.searchParams.get('returnTo') ?? '/dashboard';
	const signInUrl = await authKit.getSignInUrl({ returnTo });
	throw redirect(302, signInUrl);
};
```

## `src/routes/logout/+page.server.ts` (POST-only form action, CSRF-protected)

```typescript
import type { Actions } from './$types';
import { authKit } from '@workos-inc/authkit-sveltekit';

export const actions: Actions = {
	default: async (event) => {
		// SvelteKit's built-in form-action CSRF protection (origin check) covers this
		// by default; do not downgrade csrf: false in svelte.config.js for this route.
		return authKit.signOut(event);
	}
};
```

## Protecting a route: `+page.server.ts`

```typescript
import { authKit } from '@workos-inc/authkit-sveltekit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = authKit.withAuth(async ({ auth }) => {
	// auth.user is guaranteed to exist past this point
	return {
		user: auth.user,
		organizationId: auth.organizationId,
		role: auth.role,
		permissions: auth.permissions
	};
});
```

Apply `withAuth` only to routes that render a top-level HTML document. Using it on a JSON `+server.ts` API endpoint sets PKCE verifier cookies on XHR responses that can never complete the OAuth redirect, and can accumulate into HTTP 431 (header too large) under concurrent load [raw/workos--authkit--sveltekit-sdk.md]. For API endpoints, check `event.locals.auth` (populated by the `handle` hook) directly instead:

```typescript
// src/routes/api/profile/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.auth?.user) {
		throw error(401, 'Unauthorized');
	}
	return json({ user: locals.auth.user });
};
```

## Required environment variables

See `env-var-checklist.md` for the full list and staging/production split.
