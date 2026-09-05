---
url: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
title: "Responsive images - MDN Web Docs"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: srcset-sizes
stinger: image-optimization-stinger
---

# Responsive Images - MDN Web Docs

## Summary

MDN's authoritative guide to responsive images. Covers resolution switching with `srcset` + `sizes` (w descriptors), density switching (x descriptors), art direction with `<picture>` + `<source media="...">`, and the rule that `media` attribute on `<source>` should only be used for art direction (not combined with `sizes`). Confirms that all discussed features are supported in all modern desktop and mobile browsers.

## Key quotations / statistics

- `srcset` + `sizes` syntax for resolution switching:
  ```html
  <img
    srcset="elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
    sizes="(width <= 600px) 480px, 800px"
    src="elva-fairy-800w.jpg"
    alt="Elva dressed as a fairy" />
  ```
- "`srcset` defines the set of images we will allow the browser to choose between, and what size each image is."
- "`sizes` defines a set of media conditions (e.g., screen widths) and indicates what image size would be best to choose."
- "In `sizes`, you can use any length value... you cannot use a percentage as the slot width."
- "The browser ignores everything after the first matching condition, so be careful how you order the media conditions."
- x-descriptor (density) for fixed-size images: `srcset="elva-fairy-320w.jpg, elva-fairy-480w.jpg 1.5x, elva-fairy-640w.jpg 2x"`
- Art direction with `<picture>`:
  ```html
  <picture>
    <source media="(width < 800px)" srcset="elva-480w-close-portrait.jpg" />
    <source media="(width >= 800px)" srcset="elva-800w.jpg" />
    <img src="elva-800w.jpg" alt="..." />
  </picture>
  ```
- "You should use the `media` attribute only in art direction scenarios; when you do use `media`, don't also offer media conditions within the `sizes` attribute."
- CSS `image-set()` for backgrounds: supports x-descriptors per pixel density.

## Annotations for stinger-forge

- This is the canonical reference for `guides/02-srcset-sizes.md`. All examples should be cross-referenced against MDN's syntax.
- The "don't combine `media` attribute with `sizes` conditions" rule is a gotcha to document explicitly.
- The "percentage cannot be used as slot width in `sizes`" is a notable constraint.
- The media condition ordering note ("browser ignores everything after the first match") is the 100vw fallacy source -- if sizes conditions are wrong, 100vw is implicitly used.
- CSS `image-set()` coverage for background images is in scope for the stinger -- add to `guides/02-srcset-sizes.md`.
