---
source_url: https://vincent.bernat.ch/en/blog/2024-cls-webfonts
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: cls
stinger: font-loading-stinger
---

# Fixing layout shifts caused by web fonts - Vincent Bernat (2024)

## Summary
Practitioner blog post documenting a real-world process of manually tuning
fallback font metrics to achieve CLS = 0. Provides an interactive tool for
step-by-step visual tuning of `size-adjust`, `ascent-override`,
`descent-override`, and `line-gap-override`. Notably, the author had to create
multiple `@font-face` rules for the same fallback name to handle different OS
font availability (Android lacks Georgia, replaces with Noto Serif).

## Key quotations / statistics

- Achieved result: "After a month, the CLS metric improved to **0**."

- Manual tuning steps:
  1. Load your custom font.
  2. Select a fallback font to tune.
  3. Adjust `size-adjust` to match width of custom font with fallback.
  4. Fine-tune `ascent-override`: aim to align the final dot of the last
     paragraph while monitoring the font's baseline.
  5. Modify `descent-override`: make the two boxes match.
  6. If necessary, adjust `line-gap-override` (typically not required).

- Multi-fallback CSS for cross-platform coverage:
  ```css
  @font-face {
    font-family: "Fallback for Merriweather";
    src: local("Noto Serif"), local("Droid Serif");
    size-adjust: 98.3%;
    ascent-override: 99%;
    descent-override: 27%;
  }
  @font-face {
    font-family: "Fallback for Merriweather";
    src: local("Georgia");
    size-adjust: 106%;
    ascent-override: 90.4%;
    descent-override: 27.3%;
  }
  font-family: Merriweather, "Fallback for Merriweather", serif;
  ```

- Cross-platform note: "Android lacks most fonts found in other operating
  systems. It replaces *Georgia* with *Noto Serif*, which is not metrically
  compatible.": Requires separate `@font-face` rules per fallback font.

## Annotations for stinger-forge

- The multi-fallback pattern (multiple `@font-face` with the same family name
  but different `src: local()`) is an important cross-platform CLS technique
  not covered in other sources. Include in `guides/05-cls-elimination.md` as
  an advanced section.
- The "Android lacks Georgia" platform note should be a callout in the guide:
  production implementations need to account for Android fallback font availability.
- The step-by-step tuning process complements the automated (fontpie/next/font)
  approach as a "manual tuning" path for maximum precision.
- Published 2024, within recency window, relevant methodology.
