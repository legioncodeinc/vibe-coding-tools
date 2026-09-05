---
url: https://dbushell.com/2026/02/17/web-font-choice-and-loading-strategy/
fetched: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: font-loading-overview
---

# Web font choice and loading strategy (David Bushell, February 2026)

## Summary

A February 2026 practitioner post from David Bushell (a UK-based web developer with a strong performance focus) on web font selection and loading strategy. This article captures the current-year practitioner consensus: Chrome's zero-second block period for `font-display: swap` vs Firefox's slightly different default, real-world CLS measurement approaches, and the trade-offs between `swap` and `optional` in a post-CWV-enforcement environment. Represents the kind of up-to-date practitioner synthesis that anchors the stinger's guides to 2026 reality rather than 2020-era advice.

## Key quotations / statistics

- "Chrome has a zero-second block period, while Firefox defaults to 100ms." (for font-display: swap block period)
- Written in February 2026, the most recent practitioner article in this research set.
- Discusses real-world implications of CWV enforcement for e-commerce and publisher sites where CLS > 0.1 affects Core Web Vitals assessment.
- Confirms `swap` remains the dominant choice in production but notes increasing adoption of `optional` for body copy where stable text rendering is prioritized over font-brand consistency.

## Annotations for stinger-forge

- This is the most recent (2026) practitioner source in the dataset. Use it to confirm that no major changes to the font loading ecosystem have occurred since 2025.
- The Chrome 0ms / Firefox ~100ms block period discrepancy is confirmed here as a current 2026 reality. This nuance belongs in `guides/01-font-display-decision-matrix.md`.
- The trend toward `optional` for body copy is a 2026 signal worth encoding: the command brief explicitly asks "Is `font-display: optional` now the correct default for non-critical body copy in 2026?": this source supports "yes, increasingly so."
- Cross-reference with the web.dev recommendation to combine strategies: `swap` for headings/branding, `optional` for body copy.
- David Bushell's blog is a credible individual practitioner source (not a vendor), making it useful for confirming community consensus without vendor bias.
