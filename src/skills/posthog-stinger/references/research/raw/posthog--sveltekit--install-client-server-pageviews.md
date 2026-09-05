# PostHog SvelteKit installation: client init, pageview tracking, server-side capture

- URL: https://posthog.com/docs/libraries/svelte ; https://posthog.com/docs/libraries/node ; https://posthog.com/tutorials/single-page-app-pageviews
- Fetched: 2026-08-14
- Source type: Official docs
- Component: SvelteKit SDK (posthog-js + posthog-node)

## Content

### Beta: AI wizard install

`npx @posthog/wizard` installs PostHog for Svelte automatically (works with Cursor/Bolt too). Manual install below.

### Client-side setup (posthog-js)

```bash
npm install --save posthog-js
```

If the site sets a Content-Security-Policy, it must allow PostHog (snippet and package installs both lazy-load extra bundles - session replay, surveys - from PostHog's CDN):

```
script-src 'self' https://*.posthog.com;
connect-src 'self' https://*.posthog.com;
worker-src 'self' blob: data:;
```

`script-src` covers the snippet and lazy-loaded bundles, `connect-src` covers event ingestion and feature flags, `worker-src` covers session replay. Failing to allow these causes silent failures where `capture`/`identify` calls never send (looks integrated, zero events arrive). `connect-src` falls back to `default-src`, so `default-src 'self'` alone blocks event delivery even when the script is bundled.

Create `src/routes/+layout.js` (or `.ts`), check environment is the browser, initialize PostHog:

```javascript
// routes/+layout.js
import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {
  if (browser) {
    posthog.init('<ph_project_token>', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-05-30',
    })
  }
  return
};
```

### Pageview tracking in SPA-style apps (SvelteKit router)

Because SvelteKit uses client-side routing after the initial load, a plain `capture_pageview: true` (page-load-based) misses in-app navigations. Setting `defaults` to a recent date (e.g. `'2026-05-30'` or any date `>= '2025-05-24'`) makes `capture_pageview` default to `'history_change'`, which listens to the browser History API and captures pageviews on path changes - this is what makes pageview tracking work correctly for SPA-style navigation. This is the same fix needed across all SPA frameworks (React, Vue, Next.js, Svelte): initializing with `defaults` set to a recent date is what enables `history_change`-based pageview capture. [https://posthog.com/tutorials/single-page-app-pageviews]

The Svelte-specific guide's `+layout.js` snippet is identical to the client-side setup snippet above - no extra pageview code is needed once `defaults` is set; PostHog automatically tracks pageviews via `history_change`.

### Identifying users

Identifying users is required. Call `posthog.identify('your-user-id')` after login to link events to a known user - this connects frontend event captures, session replays, LLM traces, and error tracking to the same person, and lets backend events link back too.

Use a stable ID from your auth system (not email/display name as the primary ID - send those as person properties). Never use a shared literal like `"anonymous"` or `"user"` (pools many people into one person profile). Call `posthog.reset()` on logout.

### Tracing headers (frontend-to-backend linking)

If the app calls its own backend, `tracing_headers` adds `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` to matching `fetch`/`XMLHttpRequest` calls, letting server-side SDKs link backend events, errors, and LLM traces back to frontend sessions/replays. Use hostnames only (no protocol/path/port):

```javascript
posthog.init('<ph_project_token>', {
  api_host: 'https://us.i.posthog.com',
  tracing_headers: ['api.example.com'],
})
```

Match on hostname alone in local dev too: use `'localhost'`, not `'localhost:3000'` (ports are never part of a hostname).

### Server-side rendering note for session replay

By default, Svelte uses relative asset paths during SSR, which breaks PostHog's ability to record sessions. Fix in `svelte.config.js`:

```javascript
kit: {
  paths: {
    relative: false,
  },
},
```

### Server-side setup (posthog-node)

```bash
npm install posthog-node --save
```

```javascript
// routes/+page.server.js
import { PostHog } from 'posthog-node';

export async function load() {
  const posthog = new PostHog('<ph_project_token>', { host: 'https://us.i.posthog.com' });
  posthog.capture({
    distinctId: 'distinct_id_of_the_user',
    event: 'event_name',
  })
  await posthog.shutdown()
}
```

Always call `posthog.shutdown()` after capturing events server-side - PostHog queues events into batches and this call forces immediate flush. In serverless/edge functions (Vercel Functions), set `flushAt: 1` and `flushInterval: 0` so events send immediately rather than waiting for a batch that may never fill before the function exits, and always await `shutdown()` at the end.

### posthog-node client options (relevant table)

| Variable | Description | Default |
| --- | --- | --- |
| host | PostHog host | https://us.i.posthog.com/ |
| flushAt | Batch size before flush | 20 |
| flushInterval | ms before flush | 10000 |
| personalApiKey | Enables local feature-flag evaluation (triggers periodic background calls even if flags aren't used) | null |
| featureFlagsPollingInterval | ms between flag definition polls | 300000 |
| requestTimeout | ms | 10000 |
| disableGeoip | Disables GeoIP resolution | true |
| isServer | Controls `$is_server` event property | true |

### Capturing events server-side

```javascript
client.capture({
  distinctId: 'distinct_id_of_the_user',
  event: 'user signed up',
})
```

Recommended event name format: `[object] [verb]`, e.g. `project created`, `user signed up`, `invite sent`.

### Capturing pageviews from the backend only (rare, backend-only implementations)

```javascript
client.capture({
  distinctId: 'distinct_id_of_the_user',
  event: '$pageview',
  properties: { $current_url: 'https://example.com' },
})
```

### Add request context to Express (posthog-node >= 5.31.0)

`setupExpressRequestContext(posthog, app)` registered before routes auto-attaches session/distinct ID from incoming `x-posthog-session-id` / `x-posthog-distinct-id` headers (set by the frontend's `tracing_headers` config) plus request metadata (`$current_url`, `$request_method`, `$request_path`, `$user_agent`, `$ip`). `setupExpressErrorHandler(posthog, app)` registered after routes sends Express errors to PostHog Error Tracking. Properties/`distinctId` passed directly to `capture` override request context. Tracing headers are client-controlled analytics context, not auth - pass an authenticated `distinctId` explicitly for security-sensitive decisions.

### Client-side feature flags in a Svelte component

```javascript
<script>
  import posthog from 'posthog-js'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  let coolFeature = $state(false)
  onMount(() => {
    if (browser) {
      coolFeature = posthog.isFeatureEnabled('cool-feature')
    }
  })
</script>
{#if coolFeature}
  <p>Welcome to the cool feature!</p>
{/if}
```

### Server-side feature flags in a SvelteKit load function

```javascript
// routes/+page.server.js
import { PostHog } from 'posthog-node';
const client = new PostHog('<ph_project_token>', { host: 'https://us.i.posthog.com' });

export async function load() {
  const distinctId = 'distinct_id_of_the_user';
  const megaFeature = await client.isFeatureEnabled('mega-feature', distinctId);
  return { megaFeature };
}
```

### Recommended: reverse proxy, WAF allowlist, product grouping

- Set up a reverse proxy (managed, free for PostHog Cloud users) so events are less likely to be intercepted by tracking blockers.
- For heatmaps and similar features, a Web Application Firewall (WAF) may block PostHog's requests - allowlist PostHog's public/stable IPs: EU `3.75.65.221, 18.197.246.42, 3.120.223.253`; US `44.205.89.55, 52.4.194.122, 44.208.188.173`.
- If the org has multiple customer-facing products (marketing site + web app + mobile app), install PostHog on all of them and group them in one project to track users across the full journey.
