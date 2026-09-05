# Phase 4: Analytics & Tracking Stack

> **Site Template Guide**: PRD Phase 4 of 12

---

## Phase Overview

### Goals

Compose Vercel Analytics, Speed Insights, GA4, and Web Vitals as sibling providers in `+layout.svelte`. Wire first-touch UTM attribution in `localStorage`. All analytics are client-side only, never leak to SSR.

### Scope

**In scope:**
- `@vercel/analytics/sveltekit`: automatic page-view tracking via SvelteKit lifecycle
- `@vercel/speed-insights/sveltekit`: performance timing
- GA4 via `<svelte:head>` + `afterNavigate` for manual page-view events
- `web-vitals` npm package for LCP/INP/CLS measurement
- `/api/web-vitals/+server.ts`: metrics collector endpoint
- `src/lib/analytics/attribution.ts`: first-touch UTM persistence

**Out of scope:**
- WhatConverts call tracking (add separately if needed)
- Microsoft Clarity (add as standalone `<svelte:head>` snippet if needed)
- Server-side analytics (all tracking is client-side only)

### Dependencies

- Phase 1: `apps/web/` scaffold
- Phase 2: `hooks.server.ts` exists (CSP must allow `www.googletagmanager.com` for GA4)

---

## User Stories

### Story 1: Marketing Team: Page View Tracking

> As a **Marketing Team Member**, I want page views tracked automatically on every SvelteKit navigation so that I can measure traffic without configuring individual pages.

**Acceptance criteria:**
- `@vercel/analytics/sveltekit` tracks all page views automatically via `afterNavigate`
- GA4 fires `page_view` event on every SvelteKit navigation
- GA4 `send_page_view: false` to prevent double-counting the initial load
- GA4 script NOT present in SSR-rendered HTML (browser guard)

### Story 2: Developer: Core Web Vitals Reporting

> As a **Developer**, I want LCP, INP, and CLS reported to a server endpoint so that I can monitor real-user performance without third-party analytics lock-in.

**Acceptance criteria:**
- `WebVitals.svelte` component mounted in root `+layout.svelte`
- Metrics sent to `/api/web-vitals` via `navigator.sendBeacon` (falls back to `fetch`)
- Endpoint returns 204 on success
- `onINP` used. `onFID` is deprecated and must not be present

### Story 3: Marketing Team: UTM Attribution

> As a **Marketing Team Member**, I want UTM parameters from campaign links to be captured on first visit and attached to lead form submissions so that I can measure campaign ROI.

**Acceptance criteria:**
- `captureAttribution()` called on `onMount` in `+layout.svelte` when UTM params present in URL
- Attribution persists in `localStorage` under `first_touch_attribution`
- Attribution NOT re-captured on subsequent visits (first-touch semantics)
- Attribution merged into lead form payload (Phase 8)
- Attribution cleared from `localStorage` after successful conversion

---

## Technical Specification

### +layout.svelte composition

```svelte
<script lang="ts">
  import { Analytics } from '@vercel/analytics/sveltekit';
  import { SpeedInsights } from '@vercel/speed-insights/sveltekit';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { captureAttribution } from '$lib/analytics/attribution';
  import WebVitals from '$lib/components/WebVitals.svelte';

  const { children } = $props();

  onMount(() => captureAttribution(new URL($page.url)));

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

### Multi-vendor composition principles

| Provider | Component | Mounting point | Note |
|---|---|---|---|
| Vercel Analytics | `<Analytics />` | `+layout.svelte` | Auto page-view tracking |
| Vercel Speed Insights | `<SpeedInsights />` | `+layout.svelte` | Auto performance timing |
| Web Vitals | `<WebVitals />` | `+layout.svelte` | Manual LCP/INP/CLS report |
| Google Analytics 4 | `<GoogleAnalytics />` | `+layout.svelte` | Page views via `afterNavigate` |

### Web Vitals transport

```
browser → navigator.sendBeacon('/api/web-vitals', JSON)
                       ↓
          +server.ts: 204 response (log to console in dev,
                      forward to time-series DB in prod)
```

### Attribution data shape

```ts
{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term?: string;
  utm_content?: string;
  referrer: string;
  landing_page: string;
  captured_at: string;  // ISO 8601
}
```

### Environment variables

| Variable | Convention | Purpose |
|---|---|---|
| `PUBLIC_GA_MEASUREMENT_ID` | `PUBLIC_*` prefix (browser-safe) | GA4 measurement ID (G-XXXXXXXXXX) |

Note: SvelteKit uses `PUBLIC_*` for browser-safe variables (equivalent of Next.js's `NEXT_PUBLIC_*`).

---

## Risks and Open Questions

- **R-1:** CSP header from Phase 2 must allow `https://www.googletagmanager.com` for GA4. Verify the Phase 2 CSP baseline includes this. If CSP is tightened by `security-worker-bee`, re-verify GA4 loads.
- **R-2:** `@vercel/analytics/sveltekit` requires the package to be installed with the `sveltekit` export map. Older versions may not have this export. Pin to a version that explicitly documents SvelteKit support.
- **Q-1:** Should Web Vitals data be forwarded to a time-series database (ClickHouse, Supabase timeseries, or a managed service like Axiom)? For most sites, console logging in dev and discarding in prod is sufficient at launch. Add forwarding when real-user performance monitoring becomes operationally important.
