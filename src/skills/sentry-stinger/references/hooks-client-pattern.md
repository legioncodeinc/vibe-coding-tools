# SvelteKit client-side Sentry wiring: hooks.client.ts

Grounded in [raw/sentry--sveltekit-sdk--client-server-hooks.md], [raw/sentry--session-replay--sampling-and-privacy.md], [raw/sentry--performance--tracing-sampling-strategy.md].

## `src/hooks.client.ts`

```typescript
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { HandleClientError } from '@sveltejs/kit';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,

	dataCollection: {
		// Uncomment to stop sending user identity data and HTTP bodies by default:
		// userInfo: false,
		// httpBodies: [],
	},

	environment: import.meta.env.MODE,

	// Traces: see sampling-rate-decision-table.md. Keep client and server rates
	// aligned unless there's a specific reason to sample them differently -
	// mismatched rates break distributed-trace completeness.
	tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

	integrations: [
		Sentry.replayIntegration({
			// Defaults are already maskAllText: true, blockAllMedia: true.
			// Only relax these if the app genuinely has no sensitive UI content -
			// see before-send-pii-scrubbing.md and the privacy raw file before touching this.
		})
	],

	// Session Replay sample rates - see sampling-rate-decision-table.md for the
	// traffic-tiered recommendation. These defaults are safe starting points.
	replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
	replaysOnErrorSampleRate: 1.0,

	beforeSend(event) {
		return event;
	},

	enableLogs: true
});

const myErrorHandler: HandleClientError = ({ error, event, status, message }) => {
	console.error('Unhandled client error:', error, { route: event.route.id, status, message });
	return {
		message: 'Something went wrong. Our team has been notified.'
	};
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
```

## Ad blocker note - tunneling

If a meaningful share of users run ad blockers, Sentry's default ingest endpoint can get silently blocked client-side, undercounting real error volume. The `tunnel` option routes events through a same-origin API endpoint that forwards to Sentry instead:

```typescript
Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,
	tunnel: '/monitoring'
	// ...
});
```

This requires a matching server-side route (`src/routes/monitoring/+server.ts`) that parses and forwards the payload - not included here since this research did not fetch the full tunneling implementation guide; treat as a follow-up if ad-blocker-driven undercounting becomes a confirmed problem, not a default to wire in speculatively [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## Client vs. server `dsn` env var

The DSN itself is not a secret (it's meant to be embedded in client bundles), but it must still be sourced from an env var rather than hardcoded, so staging/production/preview deployments each point at their own Sentry project. Use `$env/static/public` (or `$env/dynamic/public` if the same build needs to run against different Sentry projects without a rebuild - e.g. Vercel preview deployments) - never `$env/static/private` or `$env/dynamic/private` for this value, since it must reach the browser bundle.
