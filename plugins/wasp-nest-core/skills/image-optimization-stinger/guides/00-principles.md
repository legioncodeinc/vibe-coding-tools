# Principles: Image Optimization Non-Negotiables

> Derived from: `research/research-summary.md`, `research/external/2026-05-20-webdev-optimize-lcp.md`, `research/external/2026-05-20-avif-caniuse.md`, `research/external/2026-05-20-blur-placeholders-web-mux.md`

These five rules apply to every image in every project. No exceptions without explicit user justification.

---

## 1. AVIF first, WebP fallback: never JPEG as primary for new raster content

**Why:** AVIF delivers 50-70% smaller files than JPEG at equivalent perceptual quality. As of May 2026, AVIF has 93-95% global browser coverage (Chrome 85+, Firefox 93+, Safari 16.4+, Edge 121+). The last major holdout was Edge 121 (January 2024), so the "AVIF is not safe yet" objection is stale.

WebP remains necessary as a fallback for iOS devices running Safari <16.4 and for a small tail of legacy browsers.

**In practice:**
- For `next/image`: set `formats: ['image/avif', 'image/webp']` in `next.config`.
- For native HTML: use `<picture>` with an `<source type="image/avif">` before `<source type="image/webp">` before `<img>`.
- For build pipelines: use Sharp to produce `.avif` and `.webp` variants of every raster source.

**Exception:** Images that require alpha channel: WebP supports alpha at smaller file sizes than AVIF for many cases; test both. SVG is always preferred over raster for logos and diagrams.

> Source: `research/external/2026-05-20-avif-caniuse.md` (caniuse.com), `research/external/2026-05-20-avif-vs-webp-filemint.md`

---

## 2. `width` and `height` always: missing dimensions cause CLS

**Why:** Browsers use explicit `width` and `height` attributes to reserve layout space before the image loads. Without them, the page reflogs when the image arrives, causing Cumulative Layout Shift (CLS). A CLS score above 0.1 fails Core Web Vitals.

**In practice:**
- `next/image` enforces this at the type level: you cannot omit `width` and `height` on a non-`fill` image.
- Native `<img>`: always add `width="W" height="H"` in the markup even when you size via CSS.
- For responsive images that change aspect ratio across breakpoints, use `aspect-ratio` in CSS combined with `width="0" height="0"` as a minimum signal, or use `fill` layout mode in `next/image`.

---

## 3. LCP images get `priority` / `preload` / `fetchpriority="high"`: never `loading="lazy"`

**Why:** The LCP (Largest Contentful Paint) image is the element the browser must paint first to pass Core Web Vitals. Research shows that 75% of poor-LCP sites waste time in load delay: the gap between when the LCP resource could be fetched and when it actually starts. `loading="lazy"` defers the fetch until the element is in the viewport, which is exactly the wrong behavior for the LCP candidate.

**In practice:**
- `next/image` <16: `<Image priority />` (suppresses lazy-loading and injects a `<link rel="preload">`)
- `next/image` >=16: `<Image preload />` (`priority` is deprecated in Next.js 16)
- Native HTML: `<img fetchpriority="high" loading="eager" ...>`
- `fetchpriority="high"` has 95%+ browser support as of 2026 (Chrome 101+, Firefox 132+, Safari 17.2+)

**Identifying the LCP candidate:** It is almost always the above-the-fold hero image, product image, or full-width banner on the page. When in doubt, run a Lighthouse audit: the LCP element is labeled.

> Source: `research/external/2026-05-20-webdev-optimize-lcp.md`, `research/external/2026-05-20-webdev-fetch-priority-lcp.md`

---

## 4. `sizes` must match the CSS layout: the default `100vw` is wrong for most components

**Why:** The `sizes` attribute tells the browser how wide the image will be rendered before it can evaluate CSS. The browser uses `sizes` plus the device DPR to pick the right `srcset` candidate. `100vw` (the browser default, and `next/image`'s default when `sizes` is omitted) means "this image fills the full viewport width," causing the browser to download an oversized variant for images in sidebars, cards, or grid columns.

**In practice:**
- Full-width hero: `sizes="100vw"`: this is the only correct use of 100vw.
- Sidebar image (25% of layout width): `sizes="(max-width: 768px) 100vw, 25vw"`
- Card grid (3 columns above 1024px): `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Fixed-width component: `sizes="300px"` (or `width={300}` in `next/image` which handles it automatically)

A mismatched `sizes` value is the #1 `next/image` performance bug in production codebases (per `research/external/2026-05-20-nextjs-image-component-api.md`).

---

## 5. Placeholders must be chosen deliberately: default to LQIP, not "no placeholder"

**Why:** Images without placeholders produce a jarring content pop when they load. The three valid options differ in complexity, JS dependency, and color fidelity:

| Placeholder | JS required | Color fidelity | Best for |
|---|---|---|---|
| LQIP (16px WebP + CSS blur) | None | Low | Simplest; works everywhere |
| BlurHash as CSS gradient (`@unpic/placeholder`) | None | Medium | When branding matters; no extra JS |
| ThumbHash | None (precomputed) | High (supports alpha) | When BlurHash isn't faithful enough; alpha channel images |
| Client-side BlurHash decode | Yes (blurhash npm) | High | Avoid for web: 10x larger than LQIP string |

**The rule:** default to LQIP via Sharp (generate a 16px WebP thumbnail, encode as base64, use as `src` with `style="filter: blur(20px)"` on the wrapping div). Use BlurHash-as-CSS-gradient for hero images where color fidelity matters. Avoid client-side BlurHash decode in production web contexts.

> Source: `research/external/2026-05-20-blur-placeholders-web-mux.md` (Mux, definitive tradeoff analysis)

---

## CDN-level format negotiation (bonus principle for teams on supported CDNs)

If the host product uses Cloudflare Image Resizing, Vercel Image Optimization, Imgix, Fastly, or Cloudinary, format selection can be delegated entirely to the CDN via `Accept` header negotiation: the CDN serves AVIF to AVIF-capable browsers and WebP to older browsers automatically, with no code changes required.

This is the highest-leverage path for teams that are already on these CDNs. Document it in the README and implementation notes so developers don't spend time on manual format conversion when the CDN handles it.

> Source: `research/external/2026-05-20-adaptive-image-loading-avif-xictron.md`
