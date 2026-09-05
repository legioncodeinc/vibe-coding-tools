---
url: https://github.com/hunghg255/blur-images
title: "GitHub - hunghg255/blur-images: Modern LQIP using WebP and Sharp"
date: 2026-05-20
source_type: github-readme
authority: medium
relevance: medium
topic: lqip-implementation
stinger: image-optimization-stinger
---

# blur-images - Modern LQIP via WebP and Sharp

## Summary

Open-source npm package implementing LQIP using Sharp to resize images to max 16px, encode as WebP at quality 20, and return a Base64 data URI. This is the same approach Medium uses. Provides code examples for CSS blur filter application. Also compares the approach against BlurHash (slower to compute, needs non-native client-side decoding) and notes that WebP "performs a similar set of transforms as the one used by blurhash."

## Key quotations / statistics

- `npm i blur-images`
- "We use sharp to resize input images to a max dimension of 16px and output webp (default) or jpeg images with an encoding quality set to 20."
- Output: `{ content: <Buffer>, metadata: { originalWidth, originalHeight, width, height, type: 'webp', dataURIBase64: '...' } }`
- CSS to apply: `.placeholder { filter: blur(20px); transform: scale(1.1); }`
- "The biggest disadvantage of [BlurHash] is that it's ~10-100x slower to compute these images."
- "blurhash - Really nice, compact placeholder images. Requires non-native client-side decoding which makes it awkward and slow for browser usage."

## Annotations for stinger-forge

- Confirms the 16px max dimension + quality 20 + WebP is the practical LQIP recipe for Sharp.
- The `scale(1.1)` on the blurred placeholder is a CSS trick to hide the blurred edges -- worth noting in `guides/03-placeholders.md`.
- The BlurHash encoding speed (10-100x slower) supports preferring LQIP for most use cases.
- The output format `dataURIBase64` is what goes into `next/image`'s `blurDataURL` prop.
