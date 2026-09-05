---
url: https://developer.chrome.com/blog/font-fallbacks
fetched: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: cls-elimination
---

# Improved font fallbacks (Chrome for Developers)

## Summary

A deep-dive from Katie Hempenius (Google Chrome team) on the `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` CSS descriptors. This is the most technically precise document available on the metric-override technique for eliminating CLS caused by font swapping. Covers the mathematical formulas for calculating each override value, cross-platform compatibility (hhea vs typo vs win font tables on macOS vs Windows), tool support in Next.js and Nuxt, and guidance for choosing between two approaches: metric-overrides alone vs metric-overrides + size-adjust.

## Key quotations / statistics

- "These APIs make it possible to use local fonts to create fallback font faces that closely or exactly match the dimensions of a web font. This reduces or eliminates layout shifts caused by font swapping."
- Framework tools listed: `@next/font` (Next 13+) "automatically uses font metric overrides and `size-adjust` to provide matching font fallbacks"; `@nuxtjs/fontaine` for Nuxt 3.
- Non-framework tools: `Fontaine` library (unjs/fontaine), and the `font-fallbacks-dataset` repo (all Google Fonts metric overrides).
- Formulas: `ascent-override = ascent/unitsPerEm`, `descent-override = descent/unitsPerEm`, `line-gap-override = line-gap/unitsPerEm`
- `size-adjust` formula: `size-adjust = avgCharacterWidth of web font / avgCharacterWidth of fallback font`
- Poppins example overrides: `ascent-override: 105%`, `descent-override: 35%`, `line-gap-override: 10%` (UPM=1000, ascent=1050, descent=350, line-gap=100)
- Cross-platform note: "For the vast majority of fonts (for example, ~90% of the fonts hosted by Google Fonts) font metric overrides can be safely used without knowing the user's operating system."
- Fallback font recommendation: `Arial` for sans-serif (Windows/Mac), `Roboto` for Android. Neither exists universally, so recommend a 3-fallback stack.
- "Using font metric overrides by themselves is a good approach to use if you are getting started... When implemented correctly, [size-adjust] approach can effectively eliminate font-related layout-shifts."
- Warning: "you may be wondering why you can't just set a fixed line-height instead... this practice is not recommended."

## Annotations for stinger-forge

- This is the primary source for `guides/05-cls-elimination.md`. The mathematical derivation of `ascent-override`, `descent-override`, `line-gap-override`, and `size-adjust` should be lifted directly.
- The Poppins worked example with Arial and Roboto fallbacks is a perfect template to adapt for the stinger's example section.
- The `adjustFontFallback` option in `next/font` (which defaults to `true`) automates exactly this process, confirmed by this article. This resolves the open question from the command brief: "Does next/font v15 handle size-adjust fallback generation automatically?": YES, it has since Next 13.
- The 90% compatibility note (same values across OS) simplifies the recommendation path for most projects.
- Cross-reference with `fontpie` and `capsizefitter` tools mentioned in the command brief: they automate the same formulas documented here.
- Font tables explainer (hhea vs typo vs win) is essential context for the edge-case handling in the cls-elimination guide.
