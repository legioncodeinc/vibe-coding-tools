# SvelteKit server-side Sentry wiring: hooks.server.ts, instrumentation.server.ts, svelte.config.js

Grounded in [raw/sentry--sveltekit-sdk--client-server-hooks.md]. Targets SvelteKit `2.31.0+` and `@sentry/sveltekit` `10.8.0+` (the current-recommended path with SvelteKit's own observability support). If pinned to an older SvelteKit, the server config lives directly in `hooks.server.ts` instead of `instrumentation.server.ts` - check the SDK's own version-specific manual-setup guide before copying this pattern onto an old SvelteKit version.

## `svelte.config.js` (SvelteKit 2) - enable experimental instrumentation + tracing

```javascript
const config = {
	kit: {
		experimental: {
			instrumentation: {
				server: true
			},
			// Only needed if the performance/tracing product is enabled
			tracing: {
				server: true
			}
		}
	}
};

export default config;
```

If on SvelteKit 3, this same flag moves into the `sveltekit()` call inside `vite.config.ts` instead - see `vite-config-sourcemaps.md`.

## `src/instrumentation.server.ts` - initializes the server SDK

This file must exist for the `2.31.0+` path; it runs at the earliest possible point on the server, before route handlers, so auto-instrumentation (database queries, etc.) is wired up correctly.

```typescript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: process.env.PUBLIC_SENTRY_DSN,

	dataCollection: {
		// Uncomment to stop sending user identity data and HTTP bodies by default:
		// userInfo: false,
		// httpBodies: [],
	},

	environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,

	// Traces: see sampling-rate-decision-table.md before hardcoding a number here.
	tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

	// PII scrubbing hook - see before-send-pii-scrubbing.md for the full pattern.
	beforeSend(event) {
		return event;
	},

	enableLogs: true
});
```

Read the DSN from a server-accessible env var (Vercel project env var, not `PUBLIC_`-prefixed unless the value is genuinely safe to ship to the client - the DSN itself is not secret, but keeping the pattern consistent with server-only config avoids confusion later). Confirm the exact env var naming convention against the app's existing `$env/dynamic/private` vs `$env/static/private` usage (see `env-var-checklist.md`).

## `src/hooks.server.ts` - wraps `handle` and `handleError`

```typescript
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleServerError } from '@sveltejs/kit';

const myErrorHandler: HandleServerError = ({ error, event, status, message }) => {
	// Never throw inside handleError - SvelteKit requires this to always resolve.
	console.error('Unhandled server error:', error, {
		route: event.route.id,
		status,
		message
	});

	// Return the safe-to-show-user shape. Do not leak `error.message` here if it
	// may contain sensitive detail - Sentry already has the full error server-side.
	return {
		message: 'Something went wrong. Our team has been notified.'
	};
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);

// If composing with other server hooks (auth, security headers, etc.), use sequence()
// so Sentry's handle still wraps the full chain and captures spans for everything downstream.
export const handle: Handle = sequence(Sentry.sentryHandle(), yourOtherHandle);
```

If there are no other server hooks yet, `export const handle = Sentry.sentryHandle();` alone is sufficient - `sequence()` is only needed once a second handler exists.

## Why `sentryHandle()` matters beyond error capture

`sentryHandle()` creates a root span for every incoming request. Without it, server-side spans never connect to client-side spans in the same trace - the SDK stitches server -> client via `<meta>` tags injected by `sentryHandle()` and read by `browserTracingIntegration()` on the client. Skipping this hook silently breaks distributed tracing even if errors still report correctly [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## Runtime constraint - do not deploy this to Vercel Edge Functions

As of this research, Vercel's Edge runtime is explicitly unsupported by `@sentry/sveltekit`. Confirm the SvelteKit Vercel adapter is targeting the Node.js Lambda runtime (the default for `adapter-auto`/`adapter-vercel`), not an edge route, before wiring this pattern into a route that has `export const config = { runtime: 'edge' }` or equivalent [raw/sentry--sveltekit-sdk--client-server-hooks.md].
