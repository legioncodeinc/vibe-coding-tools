---
url: https://web.dev/articles/fetch-priority
title: "Optimize resource loading with the Fetch Priority API | web.dev"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: lcp-fetchpriority
stinger: image-optimization-stinger
---

# Fetch Priority API - web.dev

## Summary

Google's web.dev authoritative article on the `fetchpriority` attribute. Covers boosting LCP image priority (`fetchpriority="high"`), lowering priority for non-critical above-fold images (`fetchpriority="low"`, e.g. carousel slides), the relationship with `preload`, and browser behavior (Chrome defaults images to Low priority until after layout). Confirms Firefox support arrived in version 132 (October 2024).

## Key quotations / statistics

- "A few key areas where Fetch Priority can help: Boosting the priority of the LCP image by specifying `fetchpriority='high'` on the image element, causing LCP to happen sooner."
- LCP example: `<img src="lcp-image.jpg" fetchpriority="high">`
- "With the priority set to high, the LCP improved from 2.6s to 1.9s" (Google Flights case study).
- "The first five larger images are set to `Medium` priority by Chrome which will help, but an explicit `fetchpriority='high'` will be even better."
- "Images inside the viewport typically start at a `Low` priority. After the layout is complete, Chrome discovers that they're in the viewport and boosts their priority. This usually adds a significant delay to loading the critical images."
- Carousel pattern: first image `fetchpriority="high"`, subsequent images `fetchpriority="low"`.
- Preload + fetchpriority: `<link rel="preload" fetchpriority="high" as="image" href="/hero.webp" type="image/webp">` for CSS background LCP images.
- "Fetch Priority complements these Resource Hints. It's a markup-based signal available through the `fetchpriority` attribute."
- "Developers should use preload for its intended purpose -- to preload resources not detected by the parser (fonts, imports, background LCP images)."

## Annotations for stinger-forge

- `fetchpriority="high"` on the LCP image is the stinger's most impactful single-attribute recommendation -- document prominently in `guides/00-principles.md`.
- The carousel pattern (`fetchpriority="low"` on non-active slides) prevents bandwidth contention above the fold.
- The `<link rel="preload" fetchpriority="high">` is needed for LCP images that are CSS backgrounds (not `<img>` elements) -- cover in `guides/02-srcset-sizes.md` or a dedicated LCP section.
- Etsy's 4% LCP improvement and Google Flights' 700ms improvement are citable business case data points.
- Firefox 132 (Oct 2024) support means `fetchpriority` has near-universal coverage in May 2026 -- the stinger can recommend it unconditionally.
