---
url: https://github.com/ascorbic/unpic-placeholder
title: "GitHub - ascorbic/unpic-placeholder: Pure-CSS image placeholders"
date: 2026-05-20
source_type: github-readme
authority: medium
relevance: medium
topic: blurhash-css
stinger: image-optimization-stinger
---

# unpic-placeholder - CSS BlurHash (no client-side JS)

## Summary

Library that generates LQIP by either extracting the dominant color from an image or by server-side rendering a BlurHash value as CSS gradients or a tiny BMP data URI (~150 bytes). Key differentiator: unlike other BlurHash libraries, this generates CSS values so it works without client-side JavaScript in any web framework. Designed for use with `unpic-img`, a multi-framework responsive image component.

## Key quotations / statistics

- "Unlike other BlurHash libraries, this generates CSS values so it works without client-side JavaScript in any web framework or none, and can be displayed before page hydration."
- "The library uses the k-means clustering algorithm to extract a dominant color from the image."
- "A BlurHash is a small string that can be generated from an image and then rendered as a placeholder. It should be pre-generated and stored alongside the image URL in the database."
- Installation: `npm install @unpic/placeholder`
- "It can render the Blurhash to either a set of CSS gradients, or a tiny BMP image data URI. These are usually around 150 bytes in size."
- Works on Node.js, Deno, and WinterCG edge runtimes.

## Annotations for stinger-forge

- This resolves the BlurHash JS-dependency problem: by rendering BlurHash as CSS gradients server-side, the stinger can offer a BlurHash option without requiring client-side JS.
- The dominant-color extraction via k-means is the simplest placeholder (zero JS, one color) -- useful as the "tier 3" in `guides/03-placeholders.md`.
- The 150-byte CSS BMP size is on par with LQIP -- good comparison data point.
- Recommend stinger-forge include this library in `guides/03-placeholders.md` alongside the Sharp LQIP approach.
