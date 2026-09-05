---
url: https://nayankyada.com/blog/how-i-keep-sanity-image-pipelines-under-50-kb-using-lqip-hashes-and-blur-overlay
title: "How I keep Sanity image pipelines under 50 kB using LQIP hashes and blur overlay"
date: 2026-04-29
source_type: blog
authority: medium
relevance: high
topic: lqip-production-patterns
stinger: image-optimization-stinger
---

# Sanity Image Pipeline LQIP Under 50 kB - nayankyada.com

## Summary

April 2026 production case study from a developer using Sanity CMS + Next.js who replaced Base64 LQIP data URIs (2-4 kB each, causing 20-40 kB on product grids) with a build-time CSS gradient derived from a 4x4 average-color grid. The gradient compresses to ~50 bytes gzip. Reports 200-400 ms LCP improvement on image-heavy pages. Key pattern: compute color grid at build time via Sanity webhook or `generateStaticParams`, store as CSS gradient string, render as `::before` pseudo-element behind `next/image`.

## Key quotations / statistics

- "When you query Sanity for an image asset and include the lqip field, you get back a Base64-encoded JPEG or WebP string... typically 2-4 kB."
- "On a page with ten products, you've added 20-40 kB to the document before React hydrates."
- "A blur hash is a short ASCII string (15-30 characters) that decodes into a tiny, blurred bitmap."
- "I run this at build time... then store the gradient string in a custom field on the image document. The gradient compresses to ~50 bytes in gzip."
- "LCP improved by 200-400 ms on image-heavy pages."
- "Computing a 4x4 gradient adds ~30 ms per image at build time."
- "For 500 product images, that's 15 seconds total -- acceptable in a CI pipeline."
- "500 images add 25 kB to your build manifest. That's still 10x smaller than embedding Base64 LQIPs."
- "The gradient renders immediately -- no fetch, no decode. The next/image loads in parallel and fades in once ready."
- "LCP is the image, not the placeholder, so this pattern doesn't hurt Core Web Vitals scoring."

## Annotations for stinger-forge

- This is the most practical 2026 production case study for LQIP optimization in a CMS context.
- The "CSS gradient as LQIP" approach (~50 bytes gzip) is a third option beyond raw LQIP (~100-600 bytes) and BlurHash -- useful for `guides/03-placeholders.md`.
- The CLS warning ("LCP is the image, not the placeholder") confirms the stinger's directive that placeholders should not become the LCP element.
- The 20-40 kB HTML overhead of inline Base64 LQIP for product grids is a concrete anti-pattern to document.
- The `::before` pseudo-element + fade-in transition pattern is a clean implementation approach for `guides/03-placeholders.md`.
