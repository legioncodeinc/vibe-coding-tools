---
url: https://web.dev/articles/optimize-lcp
title: "Optimize Largest Contentful Paint | web.dev"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: lcp-optimization
stinger: image-optimization-stinger
---

# Optimize Largest Contentful Paint - web.dev

## Summary

Google's web.dev guide on optimizing LCP. Key insight from 2024-2026 field data: image download time is rarely the bottleneck for poor LCP; the bigger problems are resource load delay (time from TTFB to image request starts) and render-blocking resources. Covers LCP resource discoverability (preload scanner), `fetchpriority`, dependency chains, and the four-step LCP optimization framework.

## Key quotations / statistics

- "Sites should strive to have an LCP of 2.5 seconds or less for at least 75% of page visits."
- "The majority of origins with poor LCP spend less than 10% of their p75 LCP time downloading the LCP image."
- "The median site with poor LCP spends almost four times as long waiting to start downloading the LCP image as it does actually downloading it, waiting 1.3 seconds between TTFB and image request."
- "Your LCP resource should start loading at the same time as the first resource loaded by that page."
- "To ensure your LCP resource starts loading as early as possible, it's critical that the resource is discoverable in the initial HTML document response by the browser's preload scanner."
- For CSS background LCP images (not in HTML): preload with `fetchpriority="high"`:
  ```html
  <link rel="preload" fetchpriority="high" as="image" href="/path/to/hero-image.webp" type="image/webp">
  ```
- "Even without lazy loading, images are not initially loaded with the highest priority by browsers as they are not render-blocking resources."
- Deprioritize carousel non-active images: `<img fetchpriority="low" src="/path/to/carousel-slide-3.webp">`
- Four-step LCP optimization framework:
  1. Ensure the LCP resource starts loading as early as possible.
  2. Ensure the LCP element can render as soon as its resource finishes loading.
  3. Reduce the load time of the LCP resource as much as you can without sacrificing quality.
  4. Deliver the initial HTML document as fast as possible.

## Annotations for stinger-forge

- The "load delay >> download time" finding reframes the stinger's priority: getting the LCP image into the preload scanner (discoverable in initial HTML) matters more than squeezing the last 5% of file size.
- `loading="lazy"` on the LCP image is the most common LCP anti-pattern -- the stinger must explicitly warn against it in `guides/00-principles.md`.
- The four-step framework can structure `guides/00-principles.md`'s LCP section.
- CSS background LCP images need `<link rel="preload" fetchpriority="high">` -- this is a separate case from `<img fetchpriority="high">` and both should be in `guides/04-next-image.md`.
