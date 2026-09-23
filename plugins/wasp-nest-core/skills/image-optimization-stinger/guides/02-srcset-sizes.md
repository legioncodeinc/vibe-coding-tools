# Responsive Images: srcset and sizes

> Derived from: `research/external/2026-05-20-mdn-responsive-images.md`, `research/external/2026-05-20-responsive-images-complete-guide-krunkit.md`, `research/external/2026-05-20-srcset-sizes-picovert.md`, `research/external/2026-05-20-webdev-responsive-images.md`, `research/external/2026-05-20-responsive-srcset-sizes-lcp.md`

---

## How the browser selects a srcset candidate

The browser algorithm:
1. Evaluate the `sizes` attribute to determine the **effective display width** of the image at the current viewport.
2. Multiply effective display width by the device **DPR** (Device Pixel Ratio) to get the **required pixel width**.
3. Select the smallest `srcset` candidate that is at least as wide as the required pixel width.

This means `sizes` is evaluated **before CSS loads**: the browser makes the network request during HTML parsing, before it can evaluate layout. If `sizes` says `100vw` but the image renders at 33vw in a 3-column grid, the browser downloads an image 3x wider than needed.

---

## The 100vw fallacy

`sizes="100vw"` is correct ONLY when the image genuinely spans the full viewport width (full-bleed hero, full-width banner). For anything else, it causes the browser to download the wrong-sized image.

```
❌ Wrong — sidebar image using default 100vw
<img srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"
     src="img-800.jpg" alt="..." width="400" height="300">

✅ Correct — sidebar at 25% viewport width on desktop
<img srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 25vw"
     src="img-800.jpg" alt="..." width="400" height="300">
```

---

## Calculating sizes values

Match `sizes` to your CSS breakpoints. Work backwards from your layout:

| Layout situation | Correct sizes value |
|---|---|
| Full-bleed hero | `sizes="100vw"` |
| 2-column grid (1 col on mobile) | `sizes="(max-width: 640px) 100vw, 50vw"` |
| 3-column grid (1 col on mobile) | `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` |
| Sidebar (25% on desktop) | `sizes="(max-width: 768px) 100vw, 25vw"` |
| Fixed-width card (300px) | `sizes="300px"` |
| Fixed-width on desktop, full on mobile | `sizes="(max-width: 768px) 100vw, 300px"` |

The rightmost value in `sizes` is the default (no media query). Always include a fallback.

---

## Choosing srcset breakpoints

**Approach: file-size-jump method** (preferred over naive device-width breakpoints)

Create a new size variant when the file size would drop by ~20-30 KB compared to the nearest larger variant. This produces variants the browser will actually select, rather than intermediate sizes that are never chosen.

**Minimal variant set (covers most cases):**
```
320w, 640w, 1024w, 1920w
```

**Standard variant set:**
```
320w, 480w, 640w, 768w, 1024w, 1200w, 1600w, 1920w
```

**Comprehensive (retina-heavy, product images):**
```
320w, 480w, 640w, 768w, 1024w, 1280w, 1600w, 1920w, 2400w, 3840w
```

> Source: `research/external/2026-05-20-responsive-images-complete-guide-krunkit.md`

---

## Art direction with `<picture>`

Use `<picture>` + `<source media="...">` when the image needs to be **cropped differently** at different breakpoints (not just resized):

```html
<picture>
  <!-- Mobile: square crop -->
  <source
    media="(max-width: 640px)"
    type="image/avif"
    srcset="hero-square-480.avif 480w, hero-square-960.avif 960w"
    sizes="100vw">
  <source
    media="(max-width: 640px)"
    type="image/webp"
    srcset="hero-square-480.webp 480w, hero-square-960.webp 960w"
    sizes="100vw">
  <!-- Desktop: wide crop -->
  <source
    type="image/avif"
    srcset="hero-wide-1200.avif 1200w, hero-wide-2400.avif 2400w"
    sizes="100vw">
  <source
    type="image/webp"
    srcset="hero-wide-1200.webp 1200w, hero-wide-2400.webp 2400w"
    sizes="100vw">
  <img src="hero-wide-1200.jpg" alt="Product hero" width="1200" height="600">
</picture>
```

`<source media="...">` is evaluated in order; only `<picture>` supports art direction. `<img srcset>` only handles resolution switching (same crop, different sizes).

---

## next/image and sizes

`next/image` auto-generates `srcset` based on the `deviceSizes` and `imageSizes` config in `next.config`. The `sizes` prop maps directly to the HTML `sizes` attribute.

```jsx
// ❌ Wrong — next/image defaults sizes to 100vw when sizes is omitted
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} />

// ✅ Correct — explicit sizes for a sidebar image
<Image
  src="/sidebar-banner.jpg"
  alt="Banner"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 25vw"
/>
```

When you omit `sizes` in `next/image`, it defaults to `100vw`, which is the #1 next/image performance bug in production. Always provide `sizes` for non-full-width images.

> Source: `research/external/2026-05-20-nextjs-image-component-api.md`
