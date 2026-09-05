---
source_type: blog
authority: high
relevance: high
topic: responsive images srcset sizes LCP Core Web Vitals best practices 2026
url: https://www.sammapix.com/blog/optimize-images-core-web-vitals-2026
date_accessed: 2026-05-20
---

# How to Optimize Images for Core Web Vitals: LCP, CLS (2026)

## Key Findings

### Never Lazy-Load the LCP Image

- Adding `loading="lazy"` to the hero/LCP image is one of the most common LCP regressions
- LCP image must use `loading="eager"` (default) + `fetchpriority="high"`
- `decoding="sync"` on the LCP image for synchronous main-thread decode

### srcset + sizes Pattern

```html
<img
  src="hero-800.webp"
  srcset="hero-400.webp 400w,
          hero-800.webp 800w,
          hero-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 80vw,
         800px"
  width="1200" height="800"
  alt="Descriptive alt text"
  loading="eager"
  fetchpriority="high"
/>
```

### picture Element with AVIF/WebP Fallback

```html
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" width="1200" height="800" alt="..." loading="eager" />
</picture>
```

### CLS Prevention

- Always set `width` and `height` on every `<img>` element
- Browser uses these to calculate aspect ratio and reserve space before image loads
- CSS: `max-width: 100%; height: auto` for responsive scaling
- This approach eliminates image-caused CLS in all modern browsers

### sizes="auto" (Modern Browsers Only)

- Chrome 126+ and Edge 126+ support `sizes="auto"` for lazy-loaded images
- Lets browser calculate correct size automatically based on CSS layout
- Only safe for below-the-fold images; NOT for LCP candidates

### LCP Image Checklist

1. Preload: `<link rel="preload" as="image" href="lcp-image.webp">`
2. `loading="eager"` (or omit loading attribute)
3. `fetchpriority="high"`
4. `decoding="sync"` (LCP image only)
5. Correct `sizes` attribute (never omit)
6. `width` and `height` set (prevents CLS)

## Relevance to image-optimization-stinger

Primary content for `guides/02-responsive-srcset.md`. Provides the canonical LCP-first checklist and the exact srcset/sizes pattern the Command Brief mandates. The `sizes="auto"` caveat is a notable 2026-era gotcha worth documenting.

## Direct Quotes / Data Points

- "One of the most common mistakes is adding loading='lazy' to all images, including the hero image."
- "Google considers LCP 'good' when it occurs within 2.5 seconds."
- "Resize + format conversion + compression together bring LCP from 'needs improvement' to solidly 'good.' Compression alone (50% reduction) barely passes."
- "sizes='auto' (supported in Chrome 126+ and Edge 126+), which lets the browser calculate the correct size automatically based on the image's CSS layout" (only for lazy-loaded images)
