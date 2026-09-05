# Sentry SvelteKit SDK: client hooks, server hooks, instrumentation, Vite plugin

- URL: https://docs.sentry.io/platforms/javascript/guides/sveltekit/manual-setup/ ; https://docs.sentry.io/platforms/javascript/guides/sveltekit/ ; https://svelte.dev/docs/kit/hooks ; https://github.com/getsentry/sentry-agent-skills/blob/main/skills/sentry-svelte-sdk/references/tracing.md
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io, svelte.dev) + official-org GitHub reference (getsentry/sentry-agent-skills)
- Component: SvelteKit SDK

## Content

### Prerequisites

- SvelteKit `2.0.0+`, `2.31.0+` recommended for best support.
- Vite `4.2` or newer.
- Package: `@sentry/sveltekit` (installed via `npm install @sentry/sveltekit --save`).

### Two setup paths depending on SvelteKit version

SvelteKit `2.31.0` introduced official support for observability and tracing (`svelte.dev/docs/kit/observability`). Sentry's manual-setup guide defaults to this newer path. On this path:

- The Sentry SDK initializes at the earliest possible point on the server, so auto-instrumentation (e.g. database query spans) works correctly.
- The SDK picks up spans SvelteKit itself emits, giving accurate performance data for handlers, server actions, `load`, and remote functions.
- SvelteKit's own observability support is still experimental as of this research, but Sentry's wizard and current manual-setup guide use it as the default.

If not upgrading to `2.31.0+`, an older manual-setup guide path exists (`manual-setup__v10.7.0`) where auto-instrumentation for things like DB queries does not work. This skill assumes the modern (`2.31.0+`) path as the default target since it is what current official docs recommend.

### Adapter / runtime compatibility

- **Fully supported Node.js runtimes**: `adapter-auto` for Vercel; other Node-based platforms might work but are not guaranteed. `adapter-vercel` when used with Vercel's Node.js Lambda runtime. `adapter-node`.
- **Supported non-Node runtimes**: `adapter-cloudflare` requires additional setup (separate Cloudflare-specific guide).
- **Currently not supported**: non-Node server runtimes, explicitly including **Vercel's edge runtime**.
- Other adapters "might work" but aren't officially supported.

This directly matters for the stack context (SvelteKit on Vercel): use the Node.js Lambda runtime (the SvelteKit Vercel adapter's default/Node target), not Vercel Edge Functions, if full Sentry SvelteKit SDK support is required.

### Client-side setup: `src/hooks.client.(js|ts)`

```javascript
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dsn: "https://<key>@o<orgId>.ingest.sentry.io/<projectId>",

  dataCollection: {
    // To disable sending user data and HTTP bodies:
    // userInfo: false,
    // httpBodies: [],
  },

  // Tracing (if performance product selected)
  tracesSampleRate: 1.0, // recommend adjusting in production

  integrations: [
    Sentry.replayIntegration(), // if session replay selected
    Sentry.feedbackIntegration({ colorScheme: "system" }), // if user feedback selected
  ],

  // Session Replay sample rates (if selected)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Logs (if selected)
  enableLogs: true,
});

const myErrorHandler = ({ error, event }) => {
  console.error("An error occurred on the client side:", error, event);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
// or, without a custom handler:
// export const handleError = handleErrorWithSentry();
```

Note the current SDK exposes a structured `dataCollection` option (with `userInfo` and `httpBodies` sub-keys) as the mechanism to control default PII collection, rather than only a flat boolean - this is newer/more granular than the older `sendDefaultPii` boolean referenced in some general JS docs.

### Server-side setup (SvelteKit `2.31.0`+ and `@sentry/sveltekit` `10.8.0`+)

Requires enabling SvelteKit's own instrumentation/tracing experimental flags. Where this config lives depends on SvelteKit version:

**SvelteKit 2** - `svelte.config.js`:

```js
const config = {
  kit: {
    experimental: {
      instrumentation: { server: true },
      tracing: { server: true }, // if performance/tracing selected
    },
  },
};
export default config;
```

**SvelteKit 3** - inside the `sveltekit()` Vite plugin call in `vite.config.(js|ts)` instead:

```js
sveltekit({
  tracing: { server: true },
});
```

Then create `src/instrumentation.server.(js|ts)` to initialize the server SDK:

```js
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dsn: "https://<key>@o<orgId>.ingest.sentry.io/<projectId>",
  dataCollection: {
    // userInfo: false,
    // httpBodies: [],
  },
  tracesSampleRate: 1.0,
  enableLogs: true,
});
```

Then wire `src/hooks.server.(js|ts)`:

```javascript
import * as Sentry from "@sentry/sveltekit";

const myErrorHandler = ({ error, event }) => {
  console.error("An error occurred on the server side:", error, event);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
// or: export const handleError = handleErrorWithSentry();

export const handle = Sentry.sentryHandle();
// Or compose with your own handler(s):
// export const handle = sequence(Sentry.sentryHandle(), yourHandler());
```

`sentryHandle()` creates root spans for all incoming requests and is what stitches server-side spans into the same trace as client-side spans.

### Vite config wiring (source maps + load-function tracing)

Add the `sentrySvelteKit` plugin **before** `sveltekit()` in `vite.config.(js|ts)` to automatically upload source maps and instrument `load` functions for tracing (exact snippet is truncated in the fetched page after `import { sveltekit } from "@sveltejs/kit/vite"; i...` - the pattern shown across Sentry's Vite-plugin docs generally is `sentrySvelteKit({...}), sveltekit()` in the `plugins` array). Cross-reference with the dedicated Vite source-maps raw file for the plugin's own config surface (`org`, `project`, `authToken`, `sourcemaps.filesToDeleteAfterUpload`).

### handleError hook contract (from svelte.dev, framework-level, not Sentry-specific)

```
function handleError(input: {
    error: unknown;
    event: RequestEvent;
    status: number;
    message: string;
}): MaybePromise<void | App.Error>
```

- Runs when an unexpected error is thrown while responding to a request (server) or during navigation (client).
- Must never itself throw.
- The returned value (default `{ message }`) becomes `page.error` - this is where the safe-to-show-users error shape comes from, distinct from `error.message` which may carry sensitive detail.
- `resolve(...)` inside `handle` never throws; if an error is thrown elsewhere during `handle`, it's treated as fatal and SvelteKit responds with a JSON or fallback HTML error page depending on `Accept` header.

### Integrations config location

For browser-runtime integrations (e.g. `browserTracingIntegration()`), add to `Sentry.init()` in `hooks.client.js`. For Node.js-runtime integrations, add to `Sentry.init()` in `hooks.server.js` (or, per the newer path above, `instrumentation.server.ts`).

### Tracing coverage table (from getsentry/sentry-agent-skills reference doc)

| What's traced | Where | How |
| --- | --- | --- |
| Client-side page loads | Browser | `browserTracingIntegration()` in `hooks.client.ts` |
| Client-side navigations | Browser | `browserTracingIntegration()` - SvelteKit router changes |
| Outbound fetch/XHR requests | Browser | `browserTracingIntegration()` with `tracePropagationTargets` |
| Server-side request handling | Node | `sentryHandle()` in `hooks.server.ts` |
| Load functions (`+page.ts`, `+layout.ts`) | Both | Auto via `sentryHandle()` (>= 10.8.0) |
| Server -> client trace stitching | SSR -> browser | SDK injects `<meta>` tags; `browserTracingIntegration()` reads them |

### Common troubleshooting (same source)

| Issue | Solution |
| --- | --- |
| No transactions in Performance dashboard | Ensure `tracesSampleRate` > 0; check `browserTracingIntegration()` is in client init |
| Distributed trace not connected (server <-> client) | Verify `sentryHandle()` is exported from `hooks.server.ts` |
| API calls not connected to frontend trace | Add API URL to `tracePropagationTargets` |
| Load functions not instrumented | Upgrade to `@sentry/sveltekit` >= 10.8.0; remove legacy `wrapLoadWithSentry` |
| `sentryHandle()` breaking other handles | Wrap with `sequence(Sentry.sentryHandle(), myHandle)` from `@sveltejs/kit/hooks` |
| Web Vitals missing | Confirm `browserTracingIntegration()` is included; check browser support |
| High transaction volume / cost | Lower `tracesSampleRate`; use `tracesSampler` to drop health checks and static assets |

### Ad-blocker / tunneling note

Ad blockers can block Sentry's default ingest endpoint from the browser. The `tunnel` option inside `hooks.client.ts`'s `Sentry.init()` routes events through your own app's API endpoint instead, which then forwards to Sentry - requires additional server-side parsing/redirect configuration (see Troubleshooting page for the `tunnel` option's server half).

### CSP note for older SvelteKit

On SvelteKit versions older than `2.16.0`, Sentry's `fetch` instrumentation can trip Content Security Policy errors - flagged in Sentry's troubleshooting guide as a known interaction, not fully detailed in the fetched excerpt.

### Gap flagged

The exact final Vite plugin snippet combining `sentrySvelteKit()` and `sveltekit()` together was cut off mid-fetch in the manual-setup page; the shape (`sentrySvelteKit` plugin ordered before `sveltekit()`) is stated by Sentry's own guide text but the complete option list wasn't captured verbatim in this source. Cross-reference the source maps upload guide for `@sentry/vite-plugin`'s standalone option surface, which is the plugin's actual config shape when unbundled from `sentrySvelteKit`.
