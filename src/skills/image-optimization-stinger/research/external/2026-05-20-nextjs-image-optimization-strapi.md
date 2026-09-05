---
url: https://strapi.io/blog/nextjs-image-optimization-developers-guide
title: "Next.js Image Optimization: A Guide for Web Developers - Strapi"
date: 2025-11-13
source_type: blog
authority: high
relevance: high
topic: nextjs-image-optimization
stinger: image-optimization-stinger
---

# Next.js Image Optimization Guide - Strapi

## Summary

November 2025 comprehensive guide from Strapi covering next/image integration with a CMS backend. Covers format negotiation (Accept header), on-demand resizing, Sharp compression (40-70% reduction), format conversion (WebP/AVIF: additional 25-35% reduction), lazy loading defaults, and the `priority` prop for LCP images. Includes a complete `next.config.js` with AVIF+WebP formats and multi-environment `remotePatterns`. Reports Lighthouse confirmation: "60-80% file size reductions, LCP under 2.5 seconds, and zero layout shift."

## Key quotations / statistics

- "The next/image component intercepts remote image requests, resizes and compresses them on demand, converts to WebP or AVIF based on browser support, and serves device-appropriate variants automatically."
- "Next.js runs images through Sharp compression, reducing file size by 40-70% on average. Format conversion to WebP or AVIF saves another 25-35% for compatible browsers."
- "Chrome supports WebP, Safari supports JPEG, and browsers supporting AVIF receive that format first, all from a single `<Image>` tag in your code."
- Complete config:
  ```js
  module.exports = {
    images: {
      remotePatterns: [
        { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
        { protocol: 'https', hostname: '**.strapiapp.com', pathname: '/uploads/**' },
        { protocol: process.env.STRAPI_ASSET_PROTOCOL || 'https', hostname: process.env.STRAPI_ASSET_HOSTNAME, pathname: '/uploads/**' },
      ],
      formats: ['image/avif', 'image/webp'],
    },
  };
  ```
- Strapi's Media Library auto-generates variants: thumbnail (156px), small (500px), medium (750px), large (1000px).
- LCP priority example:
  ```jsx
  <Image src="..." alt="Hero" width={1600} height={900} quality={85} priority placeholder="blur" />
  ```
- "Optimization happens on the first request and caches at the edge."

## Annotations for stinger-forge

- The 40-70% Sharp + 25-35% format conversion figures are the clearest quantification of next/image's optimization benefit -- use in `guides/04-next-image.md` introduction.
- The environment-variable remotePattern (`process.env.STRAPI_ASSET_HOSTNAME`) shows a real multi-env pattern for `guides/04-next-image.md` examples.
- The Strapi auto-variants (156/500/750/1000px) can serve as a reference for `deviceSizes`/`imageSizes` configuration guidance.
- The "A 200 response with `Content-Type: image/avif`" verification tip is useful for a troubleshooting section.
