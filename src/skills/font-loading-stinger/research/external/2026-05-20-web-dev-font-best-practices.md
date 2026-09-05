---
url: https://web.dev/articles/font-best-practices
fetched: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: font-loading-overview
---

# Best practices for fonts (web.dev)

## Summary

Google's canonical 2026 article by Katie Hempenius and Barry Pollard covering font loading, delivery, and rendering best practices for Core Web Vitals. The article is organized into three sections mapping to the three phases of the font lifecycle: loading (how to discover fonts early), delivery (file format and subsetting choices), and rendering (font-display strategy). This is the single most authoritative source for the full picture.

## Key quotations / statistics

- "Delayed text rendering: If a web font has not loaded, browsers typically delay text rendering. In many situations, this delays First Contentful Paint (FCP). In some situations, this delays Largest Contentful Paint (LCP)."
- "The practice of font swapping has the potential to cause layout shifts and impact Cumulative Layout Shift (CLS). These layout shifts occur when a web font and its fallback font take up different amounts of space on the page."
- "In fact, we think it is also time to proclaim: Use only WOFF2 and forget about everything else. WOFF2 is now supported everywhere." (Bram Stein, 2022 Web Almanac)
- "Although `preload` is highly effective at making fonts discoverable early in the page load process, this comes at the cost of taking away browser resources from the loading of other resources."
- "Most sites would strongly benefit from inlining font declarations and other critical styling in the `<head>` of the main document rather than including them in an external stylesheet."
- font-display value table: `swap` = 0ms block / infinite swap; `fallback` = 100ms block / 3s swap; `optional` = 100ms block / none.
- "For most sites, these are the three most applicable strategies: optional (performance), swap (quickly display + still use webfont), block (text displayed in webfont)."
- "Also keep in mind that these two approaches can be combined: for example, use `font-display: swap` for branding and other visually distinctive page elements. Use `font-display: optional` for fonts used in body text."
- "When moving to self-hosting, [subsetting] is an optimization that can be missed and lead to larger font files locally."
- Tools for generating font subsets: subfont and glyphanger (note: actually glyphhanger with double 'h').

## Annotations for stinger-forge

- This article is the backbone of `guides/00-principles.md` (FOIT/FOUT/FOFT taxonomy) and `guides/01-font-display-decision-matrix.md` (the 5-value decision table).
- The `preload` caution is essential for `guides/02-preload-strategy.md`: the article explicitly recommends inline CSS declarations as an alternative to preload for discovered-late fonts.
- The `size-adjust` reference at the end leads directly into `guides/05-cls-elimination.md`.
- Confirms: `font-display: optional` is the performance recommendation for body copy where layout shift avoidance is the top priority in 2026.
- Contradictions: The article notes self-hosted fonts don't always outperform CDN fonts (Web Almanac finding). This should be surfaced in `guides/06-performance-checklist.md`.
