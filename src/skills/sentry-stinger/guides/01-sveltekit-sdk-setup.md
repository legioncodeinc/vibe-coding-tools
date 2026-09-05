# 01. SvelteKit SDK setup (client + server hooks)

## Install

```bash
npm install @sentry/sveltekit --save
```

Requires SvelteKit `2.0.0+` (`2.31.0+` recommended - unlocks SvelteKit's own observability support so Sentry gets accurate `load`/action/remote-function spans and auto-instrumented DB queries) and Vite `4.2+` [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## Three places to configure

1. **Client**: `src/hooks.client.ts` - `Sentry.init()` + `handleError`. See `references/hooks-client-pattern.md` for the full file.
2. **Server**: `src/instrumentation.server.ts` (SDK init) + `src/hooks.server.ts` (`handle` + `handleError`) + an experimental-flags block in `svelte.config.js` (SvelteKit 2) or the `sveltekit()` Vite plugin call (SvelteKit 3). See `references/hooks-server-pattern.md` for the full files.
3. **Build**: `vite.config.ts` - the `sentrySvelteKit()` plugin, ordered before `sveltekit()`, for source map upload and `load`-function instrumentation. See `references/vite-config-sourcemaps.md`, and `guides/02-sourcemaps-and-releases-vercel.md` for the full source-map story.

## Runtime constraint - read before scaffolding

**Vercel's Edge runtime is not supported.** Confirm the SvelteKit Vercel adapter targets the Node.js Lambda runtime (the default for `adapter-auto`/`adapter-vercel`) before wiring any of this into a route with an edge runtime config. Deploying this SDK to an edge function will not give the coverage this skill assumes [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## The rule most likely to get skipped: `sentryHandle()`

`export const handle = Sentry.sentryHandle();` (or `sequence(Sentry.sentryHandle(), ...)` if other server hooks exist) does more than error capture - it creates the root span for every request and is what stitches server spans to client spans into one connected trace via injected `<meta>` tags. Skipping it, or ordering it wrong inside `sequence()`, silently breaks distributed tracing while errors still appear to work fine - a hard-to-notice gap unless specifically checked for [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## `handleError`'s contract

Both client and server `handleError` hooks must never throw, and their return value becomes `page.error` - the safe-to-render-to-users shape. Do not assume `error.message` is safe to show; it may carry internal detail that `page.error`'s custom message should not repeat. Always pass a custom error handler into `Sentry.handleErrorWithSentry(myErrorHandler)` rather than using the bare `handleErrorWithSentry()` if the app needs a user-facing error ID or custom fallback message - see the pattern in `references/hooks-server-pattern.md`.

## PII posture at init time

The `dataCollection: { userInfo, httpBodies }` option controls default PII collection at the SDK-init level, and should be set deliberately (not left to defaults) for any app handling sensitive user data. This is the current, more granular replacement for the older flat `sendDefaultPii` boolean seen in general (non-SvelteKit) Sentry docs - don't mix the two patterns [raw/sentry--sveltekit-sdk--client-server-hooks.md, raw/sentry--data-scrubbing--beforesend-pii.md]. Full scrubbing guidance: `guides/04-session-replay-and-pii-scrubbing.md`.

## Verify before shipping

- `tracesSampleRate` or `tracesSampler` is actually set (tracing is opt-in - unset means zero transactions ever, silently) - see `guides/03-performance-tracing-and-sampling.md`.
- Client and server sample rates are aligned, not drifted apart.
- A production build (`vite build`, not `vite dev`) actually uploads source maps - see `guides/02-sourcemaps-and-releases-vercel.md`.

## Next

`02-sourcemaps-and-releases-vercel.md` covers what happens at build time: source map upload, the Sentry Vercel integration, and release/commit association.
