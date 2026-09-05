---
url: https://fontfyi.com/blog/font-display-strategies/
fetched: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: font-display
---

# font-display Strategies: swap vs fallback vs optional (FontFYI)

## Summary

A practitioner comparison of `font-display` values focused on real-world performance and CLS impact in 2026. Confirms `swap` remains the most widely recommended value but provides clear CLS caveats. The article positions the three main practical choices (swap, fallback, optional) with use-case guidance aligned with the web.dev recommendation. Critically documents the 2026 Chrome behavior: a zero-second block period for `swap`, while Firefox uses a slightly longer "extremely small" period.

## Key quotations / statistics

- "swap is the most widely recommended value."
- "`swap` can be 'further optimized to mitigate layout shifts with font metric overrides.'" (Chrome documentation)
- Chrome block period for `swap`: effectively 0ms; Firefox: slight variation due to `fallback_delay_short` preference.
- "Browser Implementation (2026): Chrome has a zero-second block period, while Firefox defaults to 100ms." (for the block period under `swap`)
- CLS mitigation with `swap`: "Use `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` properties to size-match the fallback font to the web font."
- "`swap` remains the default recommendation for most websites as of 2026, particularly for body copy and headings, though careful fallback selection and metric overrides are essential to avoid CLS penalties."

## Annotations for stinger-forge

- Useful supporting source for `guides/01-font-display-decision-matrix.md`. Confirms that the 2026 community consensus still backs `swap` as the default, with metric overrides as the mandatory CLS companion.
- The Chrome 0ms vs Firefox 100ms block period discrepancy under `swap` is an important cross-browser nuance that should appear in the decision matrix's footnotes.
- The three-way split (performance-first = optional; text-availability = swap + metric overrides; strict web-font = block) matches the web.dev recommendation and should be encoded in the matrix.
- This source supports the command brief's directive: "Never recommend `font-display: swap` without also implementing metric-matched fallback overrides."
- Note: FontFYI is a web font information resource, not a Google or browser vendor source. Use for corroboration, not as primary authority.
