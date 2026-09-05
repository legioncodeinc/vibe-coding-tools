---
url: https://webvitals.tools/fixes/font-loading-cls/
fetched: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: cls-elimination
---

# How to Fix CLS Caused by Font Loading (WebVitals.tools)

## Summary

A practical 2026 how-to on eliminating CLS from font loading. Provides a concrete example of metric-override CSS for an Inter fallback using Arial, including the exact percentage values. Documents browser support for the `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` descriptors. Confirms a dramatic CLS improvement: from 0.28 ("Poor") to 0.02 ("Good") after applying metric overrides.

## Key quotations / statistics

- CLS impact measurement: "This approach can reduce CLS from 0.28 ('Poor') to 0.02 ('Good')."
- Browser support: "Chrome 87+, Firefox 89+, Safari 17+"
- Example Inter Fallback implementation:
  ```css
  @font-face {
    font-family: 'Inter Fallback';
    src: local('Arial');
    size-adjust: 107.64%;
    ascent-override: 90%;
    descent-override: 22.43%;
    line-gap-override: 0%;
  }
  ```
- Automated tools that generate these values: Next.js `@next/font` (13+), Nuxt `@nuxtjs/fontaine` (3+), Fontaine library, Google Fonts metric override datasets.
- The technique relies on overriding "a font's vertical and horizontal spacing: ascent (above baseline), descent (below baseline), line gap (between lines), size-adjust (overall font size)."

## Annotations for stinger-forge

- The Inter + Arial example with exact percentage values is a ready-to-use code snippet for `guides/05-cls-elimination.md`'s examples section. These values can be verified against the Google Fonts metric overrides dataset.
- CLS improvement from 0.28 to 0.02 is the key motivating statistic (14x improvement): include in the stinger's introduction section.
- Safari 17+ for `size-adjust` support is significant: Safari 17 was released in September 2023, meaning broad Safari support is now established. The stinger can recommend this without Safari caveats for most modern target browsers.
- The automated tools list confirms the hierarchy: Next.js `adjustFontFallback: true` (zero-config) → Fontaine/Fontaine library (framework-agnostic) → Manual calculation (power user path).
- The `local('Arial')` usage is key: the override applies to a local font reference, not a downloaded web font. This technique requires no additional HTTP requests.
