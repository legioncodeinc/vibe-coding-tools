# Blur Placeholders: LQIP, BlurHash, ThumbHash

> Derived from: `research/external/2026-05-20-blur-placeholders-web-mux.md`, `research/external/2026-05-20-blurhash-lqip-placeholders.md`, `research/external/2026-05-20-blurhash-css-unpic-placeholder.md`, `research/external/2026-05-20-thumbhash-vs-blurhash.md`, `research/external/2026-05-20-plaiceholder-nextjs-blurdataurl.md`, `research/external/2026-05-20-sanity-lqip-hashes-gradient-nayankyada.md`

---

## Tradeoff matrix

| Method | JS required | Color fidelity | Alpha support | Aspect ratio encoded | Complexity | File size overhead |
|---|---|---|---|---|---|---|
| **LQIP (Sharp 16px WebP)** | None | Low | No | Via `width/height` | Low | ~0.5-1 KB base64 |
| **BlurHash as CSS gradient** (`@unpic/placeholder`) | None | Medium | No | No | Medium | ~30-50 chars string |
| **ThumbHash** | None | High | Yes | Yes | Medium | ~30-80 bytes |
| **Client-side BlurHash decode** | Yes (5KB gzip) | High | No | No | High | Avoid |
| **Solid color from palette** | None | Very low | No | No | Low | ~7 chars hex |
| **Skeleton/shimmer** | Minimal CSS | N/A (abstract) | N/A | No | Low | Zero |

---

## Default recommendation: LQIP via Sharp

**Why:** LQIP (Low Quality Image Placeholder) uses a real pixel-accurate thumbnail of the image, scaled to 16-20px, encoded as WebP, and delivered as a base64 data URI. The browser renders it instantly (no network request), CSS `blur()` smooths the pixelation, and the transition to the full image is nearly invisible. No JavaScript is required.

**The Mux finding:** A client-side BlurHash decoder is 10x larger in transfer size than a LQIP string. For web contexts, LQIP via Sharp is preferable.

### Generating LQIP with Sharp (Node.js)

```javascript
import sharp from 'sharp';

async function generateLQIP(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(16, undefined, { fit: 'inside' })  // max 16px wide, preserve ratio
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}
```

### Using LQIP in HTML

```html
<div style="position: relative; overflow: hidden;">
  <img
    src="data:image/webp;base64,..."
    style="position: absolute; inset: 0; width: 100%; height: 100%; filter: blur(20px); transform: scale(1.1);"
    aria-hidden="true"
    alt=""
  >
  <img
    src="hero.avif"
    alt="Product hero"
    width="1200"
    height="600"
    loading="lazy"
  >
</div>
```

### Using LQIP in next/image (`blurDataURL`)

```jsx
import Image from 'next/image';

// At build time, generate blurDataURL:
const blurDataURL = await generateLQIP('./public/hero.jpg');

// In component:
<Image
  src="/hero.avif"
  alt="Product hero"
  width={1200}
  height={600}
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

**Recommended library for Next.js:** `plaiceholder` (`npm i plaiceholder sharp`): provides `getPlaiceholder()` which returns a `base64` LQIP string ready for `blurDataURL`. Pairs cleanly with App Router data fetching.

> Source: `research/external/2026-05-20-plaiceholder-nextjs-blurdataurl.md`

---

## BlurHash as CSS gradient (`@unpic/placeholder`)

Use when: hero images where the placeholder needs to represent the color tone of the image faithfully, without any JavaScript decoding at runtime.

`@unpic/placeholder` converts a BlurHash string to a CSS gradient that can be used as a CSS `background`: no canvas, no JS.

```javascript
import { blurhashToCssGradientString } from '@unpic/placeholder';

// blurhash string is generated server-side (e.g. from sharp-blurhash)
const gradient = blurhashToCssGradientString('L6PZfSi_.AyE_3t7t7R**0o#DgR4');
// Returns: "linear-gradient(to right, #a8b5c2, #8fa1b0, ...)"
```

```jsx
<Image
  src="/hero.avif"
  alt="Hero"
  width={1200}
  height={600}
  placeholder="blur"
  blurDataURL={`data:image/svg+xml;charset=utf-8,<svg ...><foreignObject>
    <div style="background: ${gradient}; width: 100%; height: 100%;"></div>
  </foreignObject></svg>`}
/>
```

> Source: `research/external/2026-05-20-blurhash-css-unpic-placeholder.md`

---

## ThumbHash (when BlurHash isn't faithful enough)

**ThumbHash** is a newer algorithm from Evan Wallace (2023, actively maintained) that improves on BlurHash in three ways:
1. Encodes the **aspect ratio** in the hash: the placeholder can be rendered without knowing the image dimensions.
2. Supports **alpha channels**: correct for product images with transparency.
3. Higher fidelity for saturated / gradient images.

Use ThumbHash when:
- The image has a transparent background (product shots, stickers).
- The placeholder must be self-describing (aspect ratio baked in).
- BlurHash is producing obviously wrong colors for the content.

**Library:** `thumbhash` on npm. Generate at build time with Node.js; decode in the browser with a tiny decoder (~3KB gzip).

> Source: `research/external/2026-05-20-thumbhash-vs-blurhash.md`

---

## Solid color from dominant palette

Simplest possible placeholder: extract the dominant color from the image (e.g., via `sharp` and the `stats()` API) and use it as a `background-color`.

```javascript
const { dominant } = await sharp(inputPath).stats();
const hex = `#${dominant.r.toString(16).padStart(2,'0')}${dominant.g.toString(16).padStart(2,'0')}${dominant.b.toString(16).padStart(2,'0')}`;
```

Use when: the team has zero tolerance for placeholder complexity and LQIP is considered an over-investment. Acceptable for product catalogs where load speed matters more than polish.

---

## Decision guide

```
Is this the LCP image above the fold?
  YES → Skip placeholder entirely (it's loaded with priority, no placeholder visible)
  NO ↓

Is this a product image / hero with alpha channel?
  YES → ThumbHash
  NO ↓

Does color fidelity of the placeholder matter for brand perception?
  YES → BlurHash as CSS gradient (@unpic/placeholder)
  NO ↓

Default → LQIP via Sharp + plaiceholder
```
