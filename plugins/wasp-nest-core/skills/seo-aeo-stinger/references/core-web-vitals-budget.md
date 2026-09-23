# Core Web Vitals budget table (SvelteKit on Vercel)

Grounding: rendering-strategy docs [raw/seo-aeo--core-web-vitals--adapter-vercel-docs.md]; image pipeline [raw/seo-aeo--core-web-vitals--images-and-vercel-optimization.md]; metadata/rendering-config crossover on TTFB [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md].

## Budgets by metric

| Metric | Good | Needs improvement | Poor | Notes |
| --- | --- | --- | --- | --- |
| LCP (Largest Contentful Paint) | <= 2500 ms | 2500-4000 ms | > 4000 ms | Standard web-vitals thresholds; measure at p75 field data, not a single lab run. |
| INP (Interaction to Next Paint) | <= 200 ms | 200-500 ms | > 500 ms | Replaced deprecated FID; report `onINP`, not `onFID`, in any web-vitals collector. |
| CLS (Cumulative Layout Shift) | <= 0.1 | 0.1-0.25 | > 0.25 | Image `width`/`height` (via `@sveltejs/enhanced-img`) and reserved space for late-loading UI (banners, ads, embeds) are the primary levers. |
| TTFB (edge/SSR routes) | <= 200 ms (edge) / <= 600 ms (regional SSR) | up to 1000 ms | > 1000 ms | Not a Core Web Vital itself but the leading input to LCP on SSR routes; the fix is prerendering or an edge adapter, not micro-optimizing the SSR handler. |

## Rendering-strategy decision table

| Content shape | Strategy | Why |
| --- | --- | --- |
| Marketing/static pages (home, about, services) | `prerender = true` | Served from CDN edge, near-zero TTFB, directly improves LCP; no per-request compute. [raw/seo-aeo--core-web-vitals--adapter-vercel-docs.md] |
| Blog posts from Payload, content stable between deploys | `prerender = true` with an `entries()` export enumerating every published slug | Static-capable content should not pay SSR cost on every crawl/visit. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md] |
| Blog posts / listing pages that must reflect newly published Payload content without a full redeploy | Vercel ISR: `config.isr.expiration` (seconds) | Gets prerender-equivalent CDN performance while content stays fresh; `allowQuery` should whitelist only params that legitimately change content (never `utm_*`). [raw/seo-aeo--core-web-vitals--adapter-vercel-docs.md] |
| Pages with per-visitor/session-specific content | SSR (`ssr = true`, no `prerender`), session logic client-side only | ISR/prerender must never serve one visitor's session data to another; per Vercel's own ISR guidance. [raw/seo-aeo--core-web-vitals--adapter-vercel-docs.md] |
| Anything indexable | `ssr = true` always | `ssr = false` ships an empty shell -- the single most common cause of thin/unindexed SvelteKit pages. Never disable SSR on a route a crawler must read. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md] |

## Image checklist (feeds LCP + CLS directly)

- LCP candidate image: `fetchpriority="high"`, never `loading="lazy"`.
- Use `@sveltejs/enhanced-img` for build-time-available images (design assets, static marketing imagery); it auto-generates AVIF/WebP, sets `width`/`height`, and builds `srcset` when `sizes` is provided. [raw/seo-aeo--core-web-vitals--images-and-vercel-optimization.md]
- Use Vercel's platform Image Optimization (`adapter-vercel`'s `images` config, or a CDN-dynamic `<img>`) for CMS/DB-sourced images that aren't present at build time. [raw/seo-aeo--core-web-vitals--images-and-vercel-optimization.md]
- Provide source images at 2x intended display resolution for HiDPI screens; do not upscale.
- Never use `em`/`rem` inside a `sizes` attribute -- root font-size changes elsewhere in the app can desync the browser's preload reservation from the actual rendered layout, causing CLS.

## Measurement protocol

1. Lab data (Lighthouse/PageSpeed Insights) for pre-merge validation -- fast feedback, not representative of real users.
2. Field data (CrUX via PageSpeed Insights API or Search Console's Core Web Vitals report) for the number that actually matters, always read at p75.
3. Schedule a 14-day follow-up against field data after any performance-impacting change; lab numbers alone are not sufficient evidence of a fix. Numbers or it didn't happen -- record before/after LCP/INP/CLS in the relevant `library/requirements/reports/seo/` report before declaring a Core Web Vitals fix shipped.
