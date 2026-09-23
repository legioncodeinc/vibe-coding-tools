# Example: Native HTML picture + srcset + Art Direction

> Edge case. Demonstrates: native `<picture>` element for non-Next.js contexts, AVIF/WebP format sources, art direction (different crops at different breakpoints), correct `sizes`, and `fetchpriority="high"` for the LCP candidate.
>
> Guides exercised: `guides/00-principles.md`, `guides/01-format-selection.md`, `guides/02-srcset-sizes.md`

---

## Scenario

A marketing site built with Astro, SvelteKit, or plain HTML: no Next.js. The hero image needs:
- A square crop on mobile (portrait phones)
- A wide 16:9 crop on desktop
- AVIF delivered to modern browsers, WebP to Safari <16.4
- LCP priority treatment

---

## Generated image variants (Sharp)

```bash
# Run at build time via npm script (see guides/05-tooling.md)
# Mobile crop: 1:1 ratio
npx tsx scripts/generate-variants.ts --src hero-original.jpg --crop square --widths 480,960

# Desktop crop: 16:9 ratio
npx tsx scripts/generate-variants.ts --src hero-original.jpg --crop wide --widths 1200,1920,2560
```

This produces: `hero-square-480.avif`, `hero-square-480.webp`, `hero-square-960.avif`, `hero-square-960.webp`, `hero-wide-1200.avif`, `hero-wide-1200.webp`, `hero-wide-1920.avif`, `hero-wide-1920.webp`, `hero-wide-2560.avif`, `hero-wide-2560.webp`, plus JPEG fallbacks.

---

## HTML markup

```html
<picture>
  <!--
    Art direction: mobile gets the square crop.
    Browser checks media queries in order; first match wins.
  -->

  <!-- Mobile: square crop, AVIF -->
  <source
    media="(max-width: 640px)"
    type="image/avif"
    srcset="
      /images/hero-square-480.avif  480w,
      /images/hero-square-960.avif  960w
    "
    sizes="100vw"
  >
  <!-- Mobile: square crop, WebP fallback -->
  <source
    media="(max-width: 640px)"
    type="image/webp"
    srcset="
      /images/hero-square-480.webp  480w,
      /images/hero-square-960.webp  960w
    "
    sizes="100vw"
  >

  <!-- Desktop: wide 16:9 crop, AVIF -->
  <source
    type="image/avif"
    srcset="
      /images/hero-wide-1200.avif  1200w,
      /images/hero-wide-1920.avif  1920w,
      /images/hero-wide-2560.avif  2560w
    "
    sizes="100vw"
  >
  <!-- Desktop: wide 16:9 crop, WebP fallback -->
  <source
    type="image/webp"
    srcset="
      /images/hero-wide-1200.webp  1200w,
      /images/hero-wide-1920.webp  1920w,
      /images/hero-wide-2560.webp  2560w
    "
    sizes="100vw"
  >

  <!--
    Fallback <img>:
    - fetchpriority="high": marks this as the LCP candidate (Principle 3)
    - loading="eager": paired with fetchpriority, ensures no lazy-load delay
    - width/height: prevents CLS (Principle 2) — use the desktop dimensions
    - alt: always required
    - src: JPEG fallback for browsers that don't support <picture> (IE11, very old mobile)
  -->
  <img
    src="/images/hero-wide-1200.jpg"
    alt="Summer collection hero — colorful sneakers on a white background"
    width="1200"
    height="675"
    fetchpriority="high"
    loading="eager"
  >
</picture>
```

---

## Non-art-direction version (resolution switching only)

When you only need different sizes (same crop), skip `<picture>` and use `<img srcset>` directly:

```html
<img
  srcset="
    /images/banner-640.avif   640w,
    /images/banner-1024.avif 1024w,
    /images/banner-1920.avif 1920w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
  src="/images/banner-1024.jpg"
  alt="Summer collection banner"
  width="1920"
  height="600"
  fetchpriority="high"
  loading="eager"
>
```

**Note:** This only serves AVIF to browsers that support it. For a WebP fallback without art direction, you still need `<picture>` with separate `<source type="image/avif">` and `<source type="image/webp">` elements.

---

## What this example demonstrates

| Principle | Where applied |
|---|---|
| AVIF first (Principle 1) | AVIF `<source>` before WebP `<source>` in markup order |
| `width` + `height` always (Principle 2) | `<img>` has desktop dimensions; CLS is prevented |
| LCP gets `fetchpriority="high"` (Principle 3) | `<img fetchpriority="high" loading="eager">` |
| `sizes` matches layout (Principle 4) | Both square and wide sources use `sizes="100vw"` for full-bleed hero |
| Art direction (Principle from `guides/02`) | `media=` on `<source>` selects different crops by viewport |
