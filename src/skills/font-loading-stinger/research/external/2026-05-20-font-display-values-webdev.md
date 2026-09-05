---
source_url: https://web.dev/articles/font-best-practices
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: font-display
stinger: font-loading-stinger
---

# Best practices for fonts | web.dev

## Summary
Google's canonical guide for web font loading best practices. Covers the full
`font-display` descriptor decision matrix, preloading strategy, inline CSS for
early discovery, preconnect hints for third-party fonts, and the recommendation
to use `size-adjust` to mitigate font-swap CLS. Confirms that WOFF2 is now the
only format worth serving in 2026.

## Key quotations / statistics

- "In fact, we think it is also time to proclaim: Use only WOFF2 and forget about
  everything else. This will simplify your CSS and workflow massively and also
  prevents any accidental double or incorrect font downloads."

- Font-display period table (authoritative 2026 values):

  | Value    | Block period         | Swap period |
  |----------|----------------------|-------------|
  | auto     | Varies by browser    | Varies      |
  | block    | 2-3 seconds          | Infinite    |
  | swap     | 0ms                  | Infinite    |
  | fallback | 100ms                | 3 seconds   |
  | optional | 100ms                | None        |

- "Performance: Use `font-display: optional`. This is the most 'performant'
  approach: text render is delayed for no longer than 100ms and there's assurance
  that there isn't font-swap related layout shifts."

- "Quickly display text and still use a web-font: Use `font-display: swap` but
  make sure to deliver the font early enough that it does not cause a layout
  shift."

- "To reduce the CLS impact, you can use the `size-adjust` attributes."

- "Most sites would strongly benefit from inlining font declarations and other
  critical styling in the `<head>` of the main document rather than including
  them in an external stylesheet."

## Annotations for stinger-forge

- This is the **primary authoritative source** for `guides/01-font-display-decision-matrix.md`.
  Use the exact block/swap/fallback/optional period table verbatim.
- The recommendation to inline `@font-face` declarations in `<head>` belongs in
  `guides/00-principles.md` as a browser-discovery performance principle.
- The combined strategy (swap for branding, optional for body text) maps directly
  to the decision matrix's "use-case" column.
- The `size-adjust` mention is thin here; defer to the dedicated CLS sources for
  the full technique (`guides/05-cls-elimination.md`).
- The "use only WOFF2" directive belongs in `guides/06-performance-checklist.md`
  as a 2026 baseline.
