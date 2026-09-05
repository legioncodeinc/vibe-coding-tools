---
source_url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: font-display
stinger: font-loading-stinger
---

# font-display - CSS - MDN Web Docs

## Summary
The MDN specification reference for the `font-display` descriptor inside
`@font-face`. Defines the five values (`auto`, `block`, `swap`, `fallback`,
`optional`) and their block/swap/failure period semantics. Updated April 2026.
Notes Firefox-specific preferences (`gfx.downloadable_fonts.fallback_delay`)
that control the exact "short" and "extremely small" period durations.

## Key quotations / statistics

- "The font display timeline is based on a timer that begins the moment the user
  agent attempts to use a given downloaded font face."

- Value definitions:
  - `auto`: "The font display strategy is defined by the user agent."
  - `block`: "Gives the font face a short block period and an infinite swap period."
  - `swap`: "Gives the font face an extremely small block period and an infinite
    swap period."
  - `fallback`: "Gives the font face an extremely small block period and a short
    swap period."
  - `optional`: "Gives the font face an extremely small block period and no swap
    period."

- Firefox implementation note: `gfx.downloadable_fonts.fallback_delay` and
  `gfx.downloadable_fonts.fallback_delay_short` control the "short" and
  "extremely small" period durations respectively.

- Page last modified: **April 20, 2026**, confirming current spec alignment.

## Annotations for stinger-forge

- Use this as the spec citation in `guides/00-principles.md` when defining block,
  swap, and failure periods. The MDN definition is cross-browser authoritative.
- The Firefox preference names are worth noting in `guides/01-font-display-decision-matrix.md`
  as a cross-browser caveat: "extremely small" is not a fixed ms value.
- This source resolves the "block" vs "swap" terminology used in the web.dev
  table: MDN confirms `swap` = "extremely small block period + infinite swap"
  while `fallback` = "extremely small block + short swap."
- Template `templates/font-face-block.md` should show all five values with
  `font-display: swap` as the recommended default with a comment.
