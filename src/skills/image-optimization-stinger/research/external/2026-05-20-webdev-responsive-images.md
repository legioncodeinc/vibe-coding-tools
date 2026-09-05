---
url: https://web.dev/learn/design/responsive-images
title: "Responsive images | web.dev"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: srcset-sizes
stinger: image-optimization-stinger
---

# Responsive Images - web.dev

## Summary

Google's web.dev responsive images guide. Covers srcset with w-descriptors, the `sizes` attribute, density descriptors (x), `<picture>` element for art direction, CSS `image-set()`, `loading="lazy"`, `decoding="async"`, `width`/`height` attributes for CLS prevention, preloading responsive images with `imagesrcset` + `imagesizes` + `fetchpriority="high"`, and the `max-inline-size` CSS technique.

## Key quotations / statistics

- "If you know your image's dimensions, always include `width` and `height` attributes. Even if the image is rendered at a different size because of your `max-inline-size` rule, the browser still knows the width to height ratio and can set aside the right amount of space."
- "Save bandwidth, the browser only downloads the larger image if they're needed."
- sizes with multi-column layout: `sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"`
- Preloading responsive images:
  ```html
  <link rel="preload" imagesrcset="hero_sm.jpg 1x hero_med.jpg 2x hero_lg.jpg 3x" as="image" fetchpriority="high">
  ```
- "Use the `loading` attribute to tell the browser whether to delay loading the image until it's in or near the viewport."
- CSS `image-set()`:
  ```css
  element {
    background-image: image-set(
      small-image.png 1x,
      medium-image.png 2x,
      large-image.png 3x
    );
  }
  ```
- "However, the better option is usually to try to avoid excessive DOM sizes and use responsive images to reduce decoding time, instead of using `decoding`."

## Annotations for stinger-forge

- The `imagesrcset` + `imagesizes` preload pattern is the recommended way to preload an LCP image that uses srcset -- critical for `guides/00-principles.md` and `guides/02-srcset-sizes.md`.
- The multi-column `sizes` example (33vw for 3-col, 50vw for 2-col, 100vw default) is a perfect worked example.
- The CSS `image-set()` pattern for backgrounds is the native complement to the `<picture>` element in HTML.
- The `decoding` caveat ("avoid if possible, reduce DOM size instead") is a nuance worth including to prevent over-engineering.
