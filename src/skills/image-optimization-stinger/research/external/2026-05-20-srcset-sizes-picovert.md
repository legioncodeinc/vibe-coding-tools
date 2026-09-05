---
url: https://www.picovert.com/en/blog/responsive-images-srcset
title: "Responsive Images with srcset and sizes: The Complete 2026 Guide - Picovert"
date: 2026-04-11
source_type: blog
authority: medium
relevance: high
topic: srcset-sizes
stinger: image-optimization-stinger
---

# Responsive Images srcset and sizes 2026 - Picovert

## Summary

April 2026 guide focused on the practical implementation of srcset + sizes, with emphasis on common mistakes. Covers the "100vw default" problem (Next.js defaults to 100vw if `sizes` prop is missing), Retina/DPR handling, art direction vs format fallback use cases for `<picture>`, and the Next.js `<Image>` component's `sizes` prop. Includes a quick checklist.

## Key quotations / statistics

- "Without a `sizes` attribute, it assumes the image will be 100vw wide -- usually wrong."
- Next.js specific: "Without the `sizes` prop, Next.js defaults to `100vw` -- set it correctly to avoid loading unnecessarily large images."
- `<Image>` sizes example: `sizes="(max-width: 640px) 100vw, 800px"` maps directly to HTML `sizes`.
- Retina DPR: "A browser on a 375px Retina display with `sizes='100vw'` will actually request the 800w image (375 × 2 DPR ≈ 750px → nearest variant is 800w). This is handled automatically when you provide enough variants."
- Art direction `<picture>` (different crop per viewport) vs format `<picture>` (AVIF > WebP > JPEG):
  ```html
  <picture>
    <source type="image/avif" srcset="hero.avif" />
    <source type="image/webp" srcset="hero.webp" />
    <img src="hero.jpg" alt="Hero image" />
  </picture>
  ```
- Sharp one-liner: `sharp('hero.jpg').resize(400).webp().toFile('hero-400.webp')`
- Quick checklist: Always set `sizes`, provide 3+ width variants, include 2x for Retina, lazy-load below-fold, preload LCP image.

## Annotations for stinger-forge

- The Next.js "sizes defaults to 100vw" gotcha is critical for `guides/04-next-image.md` -- it's the single most common next/image performance mistake.
- The clear split between art-direction `<picture>` and format-fallback `<picture>` is a good organizing principle for `guides/02-srcset-sizes.md`.
- The Sharp one-liner is a good quick-start snippet for `guides/05-tooling.md`.
- The quick checklist is a candidate for the SKILL.md header or an audit template.
