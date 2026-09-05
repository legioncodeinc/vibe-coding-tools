# Format Selection: AVIF, WebP, JPEG, PNG, SVG

> Derived from: `research/external/2026-05-20-avif-caniuse.md`, `research/external/2026-05-20-avif-vs-webp-filemint.md`, `research/external/2026-05-20-image-formats-decision-tree-wuxwebtools.md`, `research/external/2026-05-20-avif-browser-support-iloveavif.md`, `research/external/2026-05-20-avif-vs-webp-format-comparison.md`

---

## 2026 browser support matrix

| Format | Chrome | Firefox | Safari | Edge | Global coverage |
|---|---|---|---|---|---|
| **AVIF** | 85+ | 93+ | 16.4+ | 121+ | ~93-95% |
| **WebP** | 32+ | 65+ | 14+ | 18+ | ~97% |
| **JPEG** | All | All | All | All | ~100% |
| **PNG** | All | All | All | All | ~100% |
| **SVG** | All | All | All | All | ~100% |

**Key dates:** Safari 16.4 (March 2023) and Edge 121 (January 2024) were the last major browser milestones. AVIF is safe as a primary format for all new raster content.

**iOS caveat:** Safari on iOS follows the macOS Safari version. Devices running iOS <16.4 (approximately 5-7% of iOS devices as of 2026) will not decode AVIF. Always provide a WebP fallback in `<picture>` elements or via `next.config` `formats`.

---

## Decision tree

```
Is the image a logo, icon, or diagram?
  YES → SVG (preferred) or PNG (lossless fallback)
  NO ↓

Does the image require a transparent background?
  YES → WebP (small alpha, good support) or PNG (lossless, no browser support concern)
         Note: AVIF also supports alpha, but WebP is faster to encode and equally supported.
  NO ↓

Is the image photographic / raster content?
  YES → AVIF primary + WebP fallback (always)
  NO → Reevaluate; most UI graphics should be SVG
```

---

## Encoding quality settings

For AVIF and WebP, quality is not a simple percentage: it maps differently to perceived quality:

| Format | Quality setting | File size vs JPEG |
|---|---|---|
| AVIF | 50-60 (Sharp) | -50% to -70% |
| WebP | 75-85 (Sharp) | -25% to -40% |
| JPEG | 80-85 (baseline) | baseline |

Start at AVIF quality 55 / WebP quality 80 for most photographic content. Adjust based on visual inspection at 1x and 2x DPR.

---

## Serving with `<picture>` (native HTML)

```html
<picture>
  <source type="image/avif" srcset="hero.avif 1x, hero@2x.avif 2x">
  <source type="image/webp" srcset="hero.webp 1x, hero@2x.webp 2x">
  <img src="hero.jpg" alt="Product hero" width="1200" height="600">
</picture>
```

Key rule: `<source>` elements are evaluated in order; the browser picks the first one it can decode. The `<img>` fallback must always be last and must have `alt`, `width`, and `height`.

---

## CDN-level format negotiation

Teams on the following CDNs get AVIF delivery for free via `Accept` header negotiation: no code changes required:

| CDN | AVIF via Accept? | WebP via Accept? |
|---|---|---|
| Cloudflare Image Resizing | Yes | Yes |
| Vercel Image Optimization | Yes (via `next/image` formats config) | Yes |
| Imgix | Yes | Yes |
| Fastly | Yes (with Image Optimizer) | Yes |
| Cloudinary | Yes | Yes |

If the product is on one of these CDNs, recommend enabling CDN-level negotiation as the primary path before spending time on manual format conversion pipelines.

> Source: `research/external/2026-05-20-adaptive-image-loading-avif-xictron.md`

---

## JPEG XL status (watchlist)

Chrome Canary 145 (late 2025) re-shipped a JPEG XL decoder, reversing the 2022 removal. Stable Chrome JPEG XL support could arrive H2 2026. **As of May 2026, JPEG XL is NOT production-ready.** Flag it in the refresh cadence note: re-evaluate at annual stinger refresh.
