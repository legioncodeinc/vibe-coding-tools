# 05. Core Web Vitals on Vercel

LCP, INP, CLS; SSR vs. prerender vs. ISR tradeoffs; image optimization.

Full budget table: `references/core-web-vitals-budget.md`. This guide covers the decision-making; the reference file is the lookup table.

## The rendering-strategy decision

| Content shape | Strategy |
| --- | --- |
| Static marketing pages | `prerender = true` |
| Payload blog posts, content stable between deploys | `prerender = true` with an `entries()` export |
| Payload content that must reflect new publishes without a full redeploy | Vercel ISR |
| Per-visitor/session content | SSR only, session logic client-side |
| Anything indexable | `ssr = true`, always |

[raw/seo-aeo--core-web-vitals--adapter-vercel-docs.md], [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]

`ssr = false` is banned on indexable routes -- covered already in `guides/01`, repeated here because it is also the single biggest LCP failure mode: an empty shell has no LCP candidate until hydration completes client-side.

## ISR configuration

```ts
// src/routes/blog/[slug]/+page.server.ts
export const config = {
  isr: {
    expiration: 60,            // required: seconds before regeneration
    allowQuery: ['slug'],      // optional: only params that legitimately vary content
  },
};
```

`expiration` is required, everything else optional. ISR pages are cached AND persisted to durable storage across every Vercel Edge region with automatic cache shielding -- materially better hit ratio than plain `Cache-Control` headers, which expire per-region uncoordinated. `prerender = true` on the same route makes the ISR config a no-op, since the route is already static at build time. Use ISR only where every visitor sees identical content; anything session-specific belongs client-side only, never inside an ISR-cached response. [raw/seo-aeo--core-web-vitals--adapter-vercel-docs.md]

## Image pipeline

Two complementary tools, not competitors:

**`@sveltejs/enhanced-img`** -- a Vite build-time preprocessor for images present on disk at build time (design assets, static marketing imagery). Auto-generates AVIF/WebP, sets `width`/`height` to prevent CLS, builds `srcset` when `sizes` is provided, strips EXIF.

```svelte
<enhanced:img src="./hero.png" sizes="min(1280px, 100vw)" alt="..." fetchpriority="high" />
```

[raw/seo-aeo--core-web-vitals--images-and-vercel-optimization.md]

**Vercel platform Image Optimization** -- for CMS/DB-sourced images that don't exist at build time (Payload media). Configure via `adapter-vercel`'s `images` option:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      images: {
        sizes: [640, 828, 1200, 1920, 3840],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 300,
        domains: ['your-payload-media-domain.com'],
      },
    }),
  },
};
```

[raw/seo-aeo--core-web-vitals--images-and-vercel-optimization.md]

Rules that apply to both pipelines:
- The LCP candidate image gets `fetchpriority="high"` and never `loading="lazy"`.
- Source images at 2x intended display resolution for HiDPI; never upscale.
- Never use `em`/`rem` inside a `sizes` attribute -- a root font-size change elsewhere in the CSS can desync the browser's preload reservation from the actual layout, causing CLS.

## Measurement protocol

1. Lab data (Lighthouse/PageSpeed Insights) for fast pre-merge feedback -- not representative of real users on its own.
2. Field data (CrUX via PageSpeed Insights API or the Search Console Core Web Vitals report), read at p75, for the number that actually matters.
3. Schedule a 14-day follow-up against field data after any performance-impacting change.
4. Record before/after LCP, INP, CLS in the relevant `library/requirements/reports/seo/` report before declaring a fix shipped -- numbers or it didn't happen.

Note `onINP` replaced the deprecated `onFID` metric; any web-vitals collector wired into `apps/web` (see `website-stinger/guides/04-analytics.md`) must report INP, not FID.
