---
url: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
fetched: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: font-display
---

# font-display CSS at-rule descriptor (MDN)

## Summary

The authoritative MDN specification reference for the `font-display` descriptor within `@font-face`. Describes the five values, the font display timeline model (block period, swap period, failure period), and formal CSS syntax. Marked "Baseline Widely Available" as of January 2020, meaning all major browsers support this feature. Firefox-specific: the preferences `gfx.downloadable_fonts.fallback_delay` and `gfx.downloadable_fonts.fallback_delay_short` control the duration of "short" and "extremely small" block/swap windows respectively: a key cross-browser consideration for `fallback` and `optional` values.

## Key quotations / statistics

- `auto`: "The font display strategy is defined by the user agent."
- `block`: "Gives the font face a short block period and an infinite swap period." (2-3 seconds block in Chrome/Firefox by default)
- `swap`: "Gives the font face an extremely small block period and an infinite swap period." (effectively 0ms block)
- `fallback`: "Gives the font face an extremely small block period and a short swap period." (100ms block, ~3s swap)
- `optional`: "Gives the font face an extremely small block period and no swap period." (100ms block, no swap: font either used immediately or not at all)
- Three timeline phases: "Font block period", "Font swap period", "Font failure period"
- "If the font face is not loaded, any element attempting to use it must render an invisible fallback font face." (block period behavior)
- "In Firefox, the preferences `gfx.downloadable_fonts.fallback_delay` and `gfx.downloadable_fonts.fallback_delay_short` provide the duration of the 'short' and 'extremely small' periods."

## Annotations for stinger-forge

- This is the primary spec reference for `guides/01-font-display-decision-matrix.md`. All five values with their exact block/swap period semantics should be sourced from here.
- The Firefox-specific note about preferences is a critical cross-browser nuance: Chrome's block period for `swap` is ~0ms; Firefox uses a slightly longer "extremely small" period defined by `fallback_delay_short`.
- The "invisible fallback font" behavior during block period is the formal definition of FOIT (Flash of Invisible Text).
- Formal CSS syntax is clean and directly quotable in the decision matrix table.
- No CLS discussion here: that is covered in web.dev/cls and the Chrome Developer fallbacks article.
