---
url: https://caniuse.com/avif
title: "AVIF image format | Can I use... Support tables for HTML5, CSS3, etc"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: avif-browser-support
stinger: image-optimization-stinger
---

# AVIF - Can I Use

## Summary

The authoritative browser compatibility data source for AVIF as of May 2026. Confirms full support across all current-generation browsers. Edge added full support starting version 121 (dropping partial/disabled in earlier versions). Safari partial support started at 16.1-16.3, with full support from 16.4 onward. Opera Mini has no support. Baidu Browser has support from version 13.52.

## Key quotations / statistics

- Chrome 85-151+: Full support
- Edge 121-148+: Full support (12-120 had no or partial support)
- Firefox 93-153+: Full support
- Safari 16.4-26.5: Full support (16.1-16.3 partial only)
- Safari on iOS: Full support from 16.0+ (including 16.4+)
- Samsung Internet 14.0-29: Full support
- Chrome for Android 148: Full support
- Firefox for Android 150: Full support
- Opera Mini: Not supported
- KaiOS: Not supported
- QQ Browser 14.9: Not supported
- "AVIF generally has better compression than WebP, JPEG, PNG and GIF and is designed to supersede them."
- "AVIF competes with JPEG XL which has similar compression quality and is generally seen as more feature-rich than AVIF."

## Annotations for stinger-forge

- This is the primary citation for the browser support matrix table in `guides/01-format-selection.md`.
- Key nuance: Edge didn't get full support until version 121 (late 2023/early 2024), so the "full support since January 2024" date in other sources refers to Edge 121 crossing the Baseline threshold.
- Opera Mini and KaiOS are genuine gaps. For global-audience sites these may be worth a fallback.
- The "AVIF vs JPEG XL" note is relevant for `guides/01-format-selection.md` -- include JPEG XL as "watch this space, not production-ready in 2026."
