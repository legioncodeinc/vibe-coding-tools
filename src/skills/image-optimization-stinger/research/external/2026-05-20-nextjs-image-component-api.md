---
url: https://nextjs.org/docs/app/api-reference/components/image
title: "Image Component | Next.js - Official API Reference"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: nextjs-image-api
stinger: image-optimization-stinger
---

# Next.js Image Component API Reference

## Summary

Official Next.js documentation for the `<Image>` component. Covers all props (src, width, height, fill, sizes, quality, priority/preload, placeholder, blurDataURL, loading, decoding, unoptimized, overrideSrc), configuration options in `next.config.js` (localPatterns, remotePatterns, formats, imageSizes, deviceSizes, qualities, loaderFile, minimumCacheTTL, maximumRedirects), and the `domains` deprecation in favor of `remotePatterns`.

## Key quotations / statistics

- `remotePatterns` config (recommended over deprecated `domains`):
  ```js
  module.exports = {
    images: {
      remotePatterns: [new URL('https://example.com/account123/**')],
    },
  }
  ```
- `formats` config for AVIF+WebP: `formats: ['image/avif', 'image/webp']`
- "AVIF generally takes 50% longer to encode but it compresses 20% smaller compared to WebP."
- "Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property in order to make the behavior clear."
- `fill` prop: "The parent element must have `position: relative`, `fixed`, `absolute`."
- `sizes` prop: "If `sizes` is missing, the browser assumes the image will be as wide as the viewport (100vw). This can cause unnecessarily large images to be downloaded."
- `remotePatterns` wildcard syntax: `*` for single segment/subdomain, `**` for multiple (beginning or end only; `**` does not work in the middle of the pattern).
- "Note that any allowed `remotePatterns` that respond with a redirect will follow the redirect from the remote image server without validating `remotePatterns` again on the redirect location."
- `domains` deprecation: "Deprecated since Next.js 14 in favor of strict `remotePatterns` in order to protect your application from malicious users."

## Annotations for stinger-forge

- **Critical note for `guides/04-next-image.md`**: As of Next.js 16, `priority` prop is deprecated. The stinger must document both `priority` (for older Next.js) and the new `preload` prop, and warn users to check their version.
- The `formats: ['image/avif', 'image/webp']` config snippet is the exact code block for `guides/04-next-image.md`.
- The `remotePatterns` URL constructor form (`new URL(...)`) is a newer, simpler syntax vs. the object form -- include both in examples.
- `**` wildcard not working in the middle of a pattern is a common gotcha -- flag in `guides/04-next-image.md`.
- The `sizes` missing = 100vw assumption is the "sizes discipline rule" from `guides/00-principles.md`.
- Caching note: Next.js caches AVIF and WebP separately, increasing storage requirements -- relevant for Vercel Image Optimization billing awareness.
