---
source_url: https://www.greadme.com/blog/best-practices/optimize-font-loading-with-font-display-complete-guide
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: font-display
stinger: font-loading-stinger
---

# What Is the font-display CSS Property? Complete Guide (2026)

## Summary
Practitioner-authored 2026 guide providing a decision table for all five
`font-display` values with block period, swap period, behavior column, and
"when to use" column. Covers the common audit failure ("Ensure text remains
visible during webfont load"), step-by-step implementation instructions, and
four key testing methods including Chrome DevTools "Slow 4G" throttle. Notes
that `swap` without `size-adjust` overrides causes CLS.

## Key quotations / statistics

- Complete reference table:

  | Value    | Block period | Swap period | Behavior                              | When to use                         |
  |----------|-------------|-------------|---------------------------------------|--------------------------------------|
  | `auto`   | ~3s         | Infinite    | Usually equiv to `block`              | Avoid; be explicit                   |
  | `block`  | ~3s         | Infinite    | FOIT then swap                        | Icon fonts only                      |
  | `swap`   | 0ms         | Infinite    | Fallback shown immediately (FOUT)     | Body copy, headings (most websites)  |
  | `fallback`| ~100ms     | ~3s         | Brief block, short swap window        | Brand-led sites tolerating small FOIT|
  | `optional`| ~100ms     | 0ms         | Custom font only if cached/near-instant| Slow connections, perf-critical pages|

- "Default `auto` behaves like `block` in Chrome and Firefox: invisible text for
  up to 3 seconds."

- "Using `swap` without `size-adjust` overrides: the font swap causes a layout
  shift and hurts CLS."

- "Use `font-display: swap` for body copy, pair it with a size-matched fallback
  using `size-adjust` and `ascent-override` to eliminate CLS, and preload the
  LCP font."

## Annotations for stinger-forge

- The decision table is the best practitioner summary available for
  `guides/01-font-display-decision-matrix.md`: use it as the template for the
  guide's main table, with the web.dev official figures for period durations.
- The "icon fonts only" use-case for `block` is a clear directive that belongs in
  the matrix's guidance column.
- The four testing methods (Slow 4G throttle, audit, network block, web-vitals
  library) belong in `guides/06-performance-checklist.md` as a verification
  section.
- The `swap` + `size-adjust` paired recommendation directly answers the Command
  Brief directive: "Never recommend `font-display: swap` without metric-matched
  fallback overrides."
