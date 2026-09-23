# Client init and pageview tracking (SvelteKit)

Grounded in [raw/posthog--sveltekit--install-client-server-pageviews.md], [raw/posthog--autocapture--config-vs-manual-events.md]. Package: `posthog-js`.

## `src/routes/+layout.js`

The standard install point - runs once, guarded so PostHog only initializes in the browser (never during SSR):

```javascript
import posthog from 'posthog-js'
import { browser } from '$app/environment'

export const load = async () => {
  if (browser) {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      defaults: '2026-05-30', // enables history_change pageview capture for SPA navigation
    })
  }
  return {}
}
```

`defaults: '2026-05-30'` (or any date `>= '2025-05-24'`) makes `capture_pageview` default to `'history_change'`, which listens to the browser History API and automatically fires `$pageview` on every SvelteKit client-side route change. This is the primary, recommended way to get correct pageview tracking in a SvelteKit app - no extra navigation-hook code is required for the default case [raw/posthog--sveltekit--install-client-server-pageviews.md].

## CSP requirement

If the app sets a Content-Security-Policy, it must explicitly allow PostHog or `capture`/`identify` silently no-op with zero visible error (the integration will look connected but nothing arrives):

```
script-src 'self' https://*.posthog.com;
connect-src 'self' https://*.posthog.com;
worker-src 'self' blob: data:;
```

`connect-src` falls back to `default-src`, so a bare `default-src 'self'` blocks event delivery even if the SDK script itself loads fine [raw/posthog--sveltekit--install-client-server-pageviews.md].

## SSR session-replay asset path fix (`svelte.config.js`)

```javascript
export default {
  kit: {
    paths: { relative: false },
  },
}
```

Svelte's default relative asset paths during SSR break PostHog's ability to record sessions - `relative: false` fixes it [raw/posthog--sveltekit--install-client-server-pageviews.md].

## Manual pageview tracking via `afterNavigate` (only if autocapture pageviews are disabled)

Use this pattern instead of (not alongside) the `defaults`-based autocapture when the app has deliberately turned off automatic pageview/pageleave capture (`capture_pageview: false, capture_pageleave: false` - a documented cost-control lever [raw/posthog--cost-control--billing-sampling-estimation.md]) and wants to capture pageviews selectively, or wants to attach custom properties to each pageview event. This wiring is a SvelteKit-idiomatic implementation of PostHog's documented manual-capture escape hatch (`posthog.capture('$pageview')`); it is not itself a directly-documented PostHog SvelteKit snippet, so treat the `afterNavigate` wiring specifically as an inferred integration pattern grounded in SvelteKit's own navigation lifecycle, not a verbatim PostHog example [raw/posthog--sveltekit--install-client-server-pageviews.md].

`src/routes/+layout.svelte`:

```svelte
<script>
  import posthog from 'posthog-js'
  import { browser } from '$app/environment'
  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/state'

  afterNavigate(() => {
    if (browser) {
      posthog.capture('$pageview', {
        $current_url: page.url.href,
      })
    }
  })
</script>

<slot />
```

If using this manual path, initialize with `capture_pageview: false` at `posthog.init()` time so events aren't double-counted:

```javascript
posthog.init(token, {
  api_host,
  capture_pageview: false,
  capture_pageleave: 'if_capture_pageview', // stays off automatically since capture_pageview is off
})
```

## Identifying users on the client

Required for any app with logged-in users - connects frontend captures, replays, LLM traces, and error tracking to one person, and lets backend events link back [raw/posthog--sveltekit--install-client-server-pageviews.md]. Call after login, and `reset()` on logout:

```javascript
posthog.identify(user.id, { email: user.email, name: user.name })
// on logout:
posthog.reset()
```

Use a stable ID from your auth system (Supabase/Auth.js/etc. user ID), not email or display name as the primary key - send those as person properties instead [raw/posthog--sveltekit--install-client-server-pageviews.md].
