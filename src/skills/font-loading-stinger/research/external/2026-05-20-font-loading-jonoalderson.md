---
source_url: https://www.jonoalderson.com/performance/youre-loading-fonts-wrong/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: font-display
stinger: font-loading-stinger
---

# You're loading fonts wrong (and it's crippling your performance)

## Summary
In-depth practitioner post (2025) explaining the full browser font loading
sequence from DNS resolution through paint, with critical analysis of each
`font-display` value and strategic guidance on preload, subsetting, and fallback
selection. Particularly useful for its explanation of why Safari historically
caused FOIT while Chrome showed FOUT, and its strategic breakdown by font role
(critical vs secondary vs decorative).

## Key quotations / statistics

- On historical inconsistency: "Safari often hid text entirely until the font
  arrived (FOIT), while Chrome showed fallback text immediately (FOUT). This
  inconsistency fuelled years of bad hacks."

- Practical decision guidance:
  - "`swap`: show fallback immediately, swap when ready (the safe modern default)."
  - "`fallback`: tiny block (~100ms), then fallback; swap later. Safer on poor networks."
  - "`optional`: show fallback, may never swap. Great for decorative fonts."
  - "`block`: hide text for a while (≈3s). Looks 'clean' on fast, awful on slow. Avoid."

- Strategic breakdown by font role:
  - "Critical fonts (body, navigation): preload + `font-display: swap`."
  - "Secondary fonts (headlines, accents): preload only if above the fold."
  - "Decorative fonts: consider `optional` or defer entirely."

- On preload targeting: "Don't preload everything: if you've split by
  `unicode-range` (e.g., Latin, Cyrillic), preload only the subset you'll
  actually paint above the fold."

- On subsetting: "Use `unicode-range` to declare subsets per script. Build
  locale-specific bundles (e.g., `fonts-en.css`, `fonts-ar.css`) for
  internationalised sites."

## Annotations for stinger-forge

- The FOIT/FOUT/FOFT taxonomy section maps to `guides/00-principles.md`: use
  this source to explain the historical browser inconsistency that drove the
  `font-display` spec.
- The strategic role-based breakdown (critical / secondary / decorative) belongs
  in `guides/01-font-display-decision-matrix.md` as a "use-case" decision row.
- The unicode-range + selective preload guidance belongs in both
  `guides/02-preload-strategy.md` and `guides/03-variable-font-subsetting.md`.
- Date: 2025-08-21, recent and directly relevant.
