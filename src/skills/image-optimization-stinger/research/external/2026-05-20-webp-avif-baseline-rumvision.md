---
url: https://www.rumvision.com/blog/modern-image-formats-webp-avif-browser-support/
title: "Modern Image Formats: WebP vs AVIF and its browser support - RUMvision"
date: 2025-01-01
source_type: blog
authority: medium
relevance: medium
topic: avif-browser-support
stinger: image-optimization-stinger
---

# WebP vs AVIF Browser Support - RUMvision

## Summary

Article clarifying the Baseline 2024 status for AVIF. AVIF achieved full support across all major browsers on January 26, 2024, when Edge 121 added support. WebP achieved Widely Available status (30+ months since Baseline) while AVIF is "Baseline 2024 - Newly Available." Concludes that for fully up-to-date browsers, AVIF can be served directly without `<picture>` fallback; for any audience with older browser versions, fallback is still needed.

## Key quotations / statistics

- "January 26th, 2024 marks one year since all major browsers fully supported AVIF."
- AVIF full support dates: Chrome 85, Edge 121, Firefox 93, Safari 16 -- "resulting in full support since January 26, 2024, as Microsoft Edge was the last browser to join."
- WebP: "Supported as of Chrome 9, Edge 18, Firefox 65 and Safari 14 -- resulting in full support since September 16, 2020." Status: "Widely Available."
- AVIF Baseline status: "Baseline 2024 Newly available -- AVIF works across the latest devices and browser versions. AVIF might not work in older devices or browsers."
- "When your data shows that AVIF is supported across all major browsers, your developers no longer need fallbacks. Instead, you can directly use `<img src='image.avif'>`."
- "While AVIF is considered Baseline 2024, a blue Baseline status... when a portion of your visitors are not as up to date with their browser version, they might not benefit from AVIF yet."

## Annotations for stinger-forge

- The Baseline 2024 classification is important framing for `guides/01-format-selection.md`: AVIF is "newly available" (safe for current browsers) but WebP is "widely available" (safe for 30+ month old browsers too).
- The "check your own analytics" recommendation is the right caveat to include in the stinger rather than a blanket "AVIF everywhere."
- The Edge 121 (Jan 2024) completion date explains why the "full support since 2024" framing is accurate.
- This source is slightly older (Jan 2025) -- cross-reference with caniuse.com for the current 93-95% figure.
