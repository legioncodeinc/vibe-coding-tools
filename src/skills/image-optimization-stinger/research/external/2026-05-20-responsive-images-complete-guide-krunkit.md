---
url: https://krunkit.me/blog/responsive-images-complete-guide
title: "The Complete Guide to Responsive Images in 2026: srcset, sizes..."
date: 2026-03-14
source_type: blog
authority: medium
relevance: high
topic: srcset-sizes
stinger: image-optimization-stinger
---

# Complete Guide to Responsive Images in 2026 - krunkit.me

## Summary

March 2026 comprehensive guide covering the full srcset/sizes mental model. Explains the browser's DPR-aware selection algorithm, when to use w vs x descriptors, how to calculate correct `sizes` values from CSS layouts, file-size-based breakpoint generation (rather than device-width-based), standard size set recommendations (minimal 3-variant, standard 5-variant, comprehensive 7-variant), and DPR caps (serve 2x max for most content, 3x only for critical branding).

## Key quotations / statistics

- "The `w` descriptor tells the browser the intrinsic width of each image file in pixels."
- Browser selection algorithm for iPhone 375px viewport with 3x DPR:
  1. Check viewport width: 375px
  2. Evaluate `sizes`: `(max-width: 640px) 100vw` → display width = 375px
  3. Multiply by DPR: 375 × 3 = 1125 physical pixels
  4. Select smallest srcset source ≥ 1125px: picks `1200w` variant
- "Width descriptors (`w`): For images whose display size changes with the viewport. Density descriptors (`x`): For fixed-size images that don't change with viewport (logos, icons, avatars)."
- "`sizes` attribute is required when using width descriptors (`w`) in `srcset`. Without this, the browser can't calculate which source to choose."
- Size breakpoint strategy: "Choose breakpoints based on file size jumps rather than device widths. Goal: no user downloads an image more than ~20-30 KB larger than needed."
- Standard size sets:
  - Minimal (3 variants): 400, 800, 1600
  - Standard (5 variants): 400, 800, 1200, 1600, 2400
  - Comprehensive (7 variants): 320, 640, 960, 1280, 1600, 1920, 2560
- "Serve up to 2x for most content images. A 2x image on a 3x screen still looks good."
- "Serve up to 3x only for critical branding elements (logo, hero image)."
- "Never serve 1x if the image is important."
- Best practices: (1) Use srcset with w for viewport-varying images. (2) Always pair srcset (w) with sizes. (3) Use `<picture>` for art direction or format fallbacks. (4) Generate 3-5 variants based on file size steps. (5) Don't over-optimize for 3x DPR. (6) Set image performance budgets. (7) Always include `width`, `height`, and `loading` attributes.

## Annotations for stinger-forge

- The DPR-aware browser selection algorithm is the best explanation found in research -- use in `guides/02-srcset-sizes.md` to explain WHY `sizes` matters.
- The file-size-jump breakpoint method (not device-width-based) is the expert-level recommendation for `guides/02-srcset-sizes.md`.
- The 2x cap for most content + 3x for branding is a practical rule for `guides/02-srcset-sizes.md`.
- The "never serve 1x" rule and the minimal/standard/comprehensive variant sets are ready-to-use tables.
