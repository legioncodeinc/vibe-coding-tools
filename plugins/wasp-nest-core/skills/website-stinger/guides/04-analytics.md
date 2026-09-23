# 04: Analytics & Tracking Stack

Source PRD: `research/source-prds/prd-phase-04-analytics-tracking-stack.md`

---

## Goal

Compose Vercel Analytics, Speed Insights, GA4, and Web Vitals as sibling providers in `+layout.svelte`. Wire first-touch UTM attribution. All analytics are client-side only, never leak to SSR.

---

## Installation

```bash
cd apps/web
pnpm add @vercel/analytics @vercel/speed-insights web-vitals
```

---

## Root layout: +layout.svelte

```svelte
<!-- apps/web/src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { Analytics } from '@vercel/analytics/sveltekit';
  import { SpeedInsights } from '@vercel/speed-insights/sveltekit';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { captureAttribution } from '$lib/analytics/attribution';
  import WebVitals from '$lib/components/WebVitals.svelte';

  const { children } = $props();

  onMount(() => {
    captureAttribution(new URL($page.url));
  });

  afterNavigate(({ to }) => {
    if (browser && window.gtag && to?.url) {
      window.gtag('event', 'page_view', {
        page_path: to.url.pathname,
        page_location: to.url.href,
      });
    }
  });
</script>

<Analytics />
<SpeedInsights />
<WebVitals />

{@render children()}
```

---

## GA4 component

```svelte
<!-- apps/web/src/lib/components/GoogleAnalytics.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public';
</script>

{#if browser && PUBLIC_GA_MEASUREMENT_ID}
  <svelte:head>
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GA_MEASUREMENT_ID}"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', '{PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: false });
    </script>
  </svelte:head>
{/if}
```

Mount `<GoogleAnalytics />` in `+layout.svelte` (add after `<WebVitals />`).

---

## Web Vitals reporter component

```svelte
<!-- apps/web/src/lib/components/WebVitals.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals');

    function report(metric: { name: string; value: number; rating: string; id: string }) {
      const body = JSON.stringify({
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        id: metric.id,
        url: window.location.href,
      });
      navigator.sendBeacon?.('/api/web-vitals', new Blob([body], { type: 'application/json' }))
        ?? fetch('/api/web-vitals', { method: 'POST', body, keepalive: true });
    }

    onCLS(report);
    onINP(report);   // INP replaced FID — never use onFID
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  });
</script>
```

---

## Web Vitals endpoint

```ts
// apps/web/src/routes/api/web-vitals/+server.ts
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const metric = await request.json().catch(() => null);
  if (!metric) return new Response(null, { status: 400 });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value, metric.rating);
  }

  // Forward to analytics platform in production (optional)
  return new Response(null, { status: 204 });
};
```

---

## First-touch attribution store

```ts
// apps/web/src/lib/analytics/attribution.ts
import { browser } from '$app/environment';

const STORAGE_KEY = 'first_touch_attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export function captureAttribution(url: URL): void {
  if (!browser) return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  const params: Record<string, string> = {};
  let hasUtm = false;
  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) { params[key] = val; hasUtm = true; }
  }

  if (hasUtm) {
    params.referrer = document.referrer;
    params.landing_page = url.pathname;
    params.captured_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  }
}

export function getAttribution(): Record<string, string> {
  if (!browser) return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

export function clearAttribution(): void {
  browser && localStorage.removeItem(STORAGE_KEY);
}
```

---

## Environment variables

Add to `.env.local` (and Vercel dashboard):

```
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The `PUBLIC_` prefix is SvelteKit's convention for browser-safe env vars (equivalent of `NEXT_PUBLIC_`).

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 4.1 | `@vercel/analytics` tracks page views on route change without manual calls |
| 4.2 | `@vercel/speed-insights` wired in `+layout.svelte` |
| 4.3 | GA4 `page_view` fires on every SvelteKit navigation (check GA4 DebugView) |
| 4.4 | GA4 script not present in SSR HTML (browser guard works) |
| 4.5 | Web Vitals POSTed to `/api/web-vitals` (204 response) |
| 4.6 | `onINP` used, `onFID` absent |
| 4.7 | UTM attribution captured on `?utm_source=test` visit; cleared after form submission |
