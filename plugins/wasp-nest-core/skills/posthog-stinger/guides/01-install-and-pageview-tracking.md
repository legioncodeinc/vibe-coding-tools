# 01. Install and pageview tracking

## Two SDKs, two install points

SvelteKit needs both `posthog-js` (client) and `posthog-node` (server) - there is no single "SvelteKit SDK" package. Install both:

```bash
npm install --save posthog-js posthog-node
```

[raw/posthog--sveltekit--install-client-server-pageviews.md]

## Client init

Put init in `src/routes/+layout.js`, guarded by `browser` from `$app/environment` so it never runs during SSR. Set `defaults: '2026-05-30'` (or any date `>= '2025-05-24'`) - this single option makes pageview capture default to `'history_change'` mode, which correctly tracks SvelteKit's client-side route changes instead of only firing on full page loads. This is the fix for the classic "SPA pageviews don't work" problem, and it requires no additional navigation-hook code for the default case [raw/posthog--sveltekit--install-client-server-pageviews.md, raw/posthog--autocapture--config-vs-manual-events.md]. Full copy-paste snippet: `references/client-init-and-pageview-tracking.md`.

## CSP

If the app sets a Content-Security-Policy, PostHog needs `script-src`, `connect-src`, and `worker-src` to allow `https://*.posthog.com` (or a reverse-proxy origin if proxied). Skipping this produces a silent failure mode: the SDK appears to load, `capture()`/`identify()` calls execute without throwing, but zero events ever arrive at PostHog - there is no console error to point at the CSP as the cause. Check the CSP first whenever "the integration looks right but nothing shows up in PostHog" [raw/posthog--sveltekit--install-client-server-pageviews.md].

## SSR and session replay

Svelte's default relative asset paths during server-side rendering break session replay specifically (not the rest of the SDK). Set `kit.paths.relative = false` in `svelte.config.js` before enabling replay [raw/posthog--sveltekit--install-client-server-pageviews.md].

## Manual pageview tracking (only when autocapture pageviews are off)

If the app disables `capture_pageview`/`capture_pageleave` (a documented cost-control lever, see `guides/06-cost-control-and-data-residency.md`), wire manual capture through SvelteKit's `afterNavigate` hook instead. This specific wiring is an inferred SvelteKit-idiomatic pattern built on PostHog's documented manual-capture escape hatch (`posthog.capture('$pageview')`), not a directly-quoted PostHog SvelteKit example - treat it as grounded-but-adapted, and verify against the installed `posthog-js` version's `$app/navigation` compatibility. Full snippet: `references/client-init-and-pageview-tracking.md`.

## Server-side capture

Create one module-scoped `posthog-node` client (`src/lib/server/posthog.ts`), not a per-request instance. In serverless/edge functions (Vercel Functions), set `flushAt: 1, flushInterval: 0` - the SDK's default batching assumes a long-lived process, and a short-lived function can exit before a batch fills, silently dropping events. Always `await posthog.shutdown()` (or `flush()`) before the response returns. Full pattern with a `+page.server.ts` form action example: `references/server-capture-hooks-server.md` [raw/posthog--sveltekit--install-client-server-pageviews.md].

## Identify users on the client, every session

Identifying users is not optional polish - it's what connects frontend events, session replays, LLM traces, and error tracking to one person, and is the mechanism that lets backend events (captured with the same `distinct_id`) link back to that same profile. Call `posthog.identify(user.id, {...})` as soon as the signed-in user is known (typically on app load and directly after login), and `posthog.reset()` on logout. Full detail on identify/alias mechanics: `guides/02-events-and-identify-alias.md` [raw/posthog--sveltekit--install-client-server-pageviews.md].

## Reverse proxy - do this before shipping to production

Not covered in this guide (see `guides/05-group-analytics-and-reverse-proxy.md`) but flagged here because it should be decided before the app ships, not retrofitted: PostHog's own recommendation is to set up a reverse proxy "before going to production for more reliable data capture" [raw/posthog--reverse-proxy--vercel-and-managed.md].
