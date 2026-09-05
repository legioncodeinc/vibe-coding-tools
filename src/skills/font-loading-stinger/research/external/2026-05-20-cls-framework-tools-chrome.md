---
source_url: https://developer.chrome.com/blog/framework-tools-font-fallback
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: cls
stinger: font-loading-stinger
---

# Framework tools for font fallbacks | Chrome Developers Blog

## Summary
Chrome Developers blog post documenting how Next.js (v13+), Nuxt.js, Vite/Webpack
Fontaine plugin, and Capsize library all automatically generate metric-adjusted
fallback `@font-face` CSS. Provides the exact CSS output Next.js generates for
Inter/Arial, the `adjustFontFallback` config option for both `next/font/google`
and `next/font/local`, and the manual Capsize `createFontStack` API. The
definitive source for automatic CLS elimination via framework tooling.

## Key quotations / statistics

- Example auto-generated Next.js fallback CSS for Inter:
  ```css
  @font-face {
    font-family: "fallback-inter";
    ascent-override: 90.20%;
    descent-override: 22.48%;
    line-gap-override: 0.00%;
    size-adjust: 107.40%;
    src: local("Arial");
  }
  ```

- `adjustFontFallback` configuration:
  - `next/font/google`: boolean, **default `true`**
  - `next/font/local`: `'Arial'` | `'Times New Roman'` | `false`, **default `'Arial'`**

- "This feature is enabled by default when you load fonts using the
  `@next/font` component."

- Experimental flag for classic Google Fonts (non-next/font):
  ```js
  // next.config.js
  module.exports = {
    experimental: { adjustFontFallbacksWithSizeAdjust: true }
  }
  ```

- "Sites that load fonts with `font-display: swap` often suffer from a layout
  shift (CLS) when the web font loads... approximately **18% of Next.js sites
  that use `font-display: swap` also have a poor CLS score**."

- Capsize `createFontStack` API (framework-agnostic):
  ```js
  import { createFontStack } from '@capsizecss/core'
  import lobster from '@capsizecss/metrics/lobster'
  import arial from '@capsizecss/metrics/arial'
  const { fontFamily, fontFaces } = createFontStack([lobster, arial])
  ```

- Manual calculation formula:
  ```js
  let sizeAdjust = mainFontAvgWidth / fallbackFontAvgWidth
  let ascent = fontMetrics.ascent / (unitsPerEm * fontMetrics.sizeAdjust)
  ```

## Annotations for stinger-forge

- **Most important source** for `guides/05-cls-elimination.md`. Contains the
  exact generated CSS values for the most common font (Inter → Arial fallback).
- The "18% of Next.js swap sites have poor CLS" statistic is the business case
  for the CLS elimination guide.
- The three-tool ecosystem overview (Next.js built-in / Fontaine for Nuxt & Vite
  / Capsize for framework-agnostic) belongs as an introduction to the guide.
- The `experimental.adjustFontFallbacksWithSizeAdjust` note: this is for the
  CLASSIC Google Fonts path (not `next/font`). Important caveat for the guide.
- Capsize `@capsizecss/metrics/<font-name>` package approach should be in the
  guide as the advanced manual path.
