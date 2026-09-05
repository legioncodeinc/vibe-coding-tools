---
source_url: https://www.debugbear.com/blog/web-font-layout-shift
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: cls
stinger: font-loading-stinger
---

# Fixing Layout Shifts Caused by Web Fonts | DebugBear (2025)

## Summary
Step-by-step practitioner guide for diagnosing and fixing web font layout shifts.
Covers switching from `font-display: block` to `swap`, choosing a metrically
similar fallback, and using `ascent-override` and `descent-override` in a
dedicated `@font-face` for the fallback font. Provides the Capsize workflow for
getting exact metric values. Updated November 2025.

## Key quotations / statistics

- Fix FOIT first: change `font-display: block` to `font-display: swap`:
  ```css
  @font-face {
    font-family: "Victor Mono";
    src: url("victor-mono.woff2") format("woff2");
    font-display: swap;
  }
  ```

- Fallback override CSS (using Courier New for a monospaced font):
  ```css
  @font-face {
    font-family: "My fallback font";
    src: local("Courier New");
    /* formula: ascender / unitsPerEm * 100 */
    ascent-override: 110%;
    descent-override: 25%;
  }
  .web-font {
    font-family: "Victor Mono", "My fallback font";
  }
  ```

- "Navigate to Capsize and select the font or upload the font file. Pay
  particular attention to the 'Ascender', 'Descender' and 'Em Square' values."

- "With these adjustments, the fallback font should be a very close match to the
  web font, minimizing any layout shift when the swap occurs."

- "You can also use a tool like Fallback Font Generator to tweak the fallback
  font through a visual interface."

- Fallback font selection principle: "One way to reduce the layout shift is to
  choose a fallback font that better matches the size and metrics of the web font."
  For monospaced fonts: `Courier New`. For proportional fonts: choose based on
  x-height and character width similarity.

## Annotations for stinger-forge

- This source provides the **worked example** for `guides/05-cls-elimination.md`:
  monospaced fallback for monospaced web font using Capsize metrics.
- The fallback `@font-face` pattern (separate named fallback family + `src: local()`)
  is the canonical CSS structure: use it in `templates/font-face-block.md`.
- The Capsize workflow (Ascender, Descender, Em Square values → CSS percentages)
  belongs in the guide as the manual metric calculation path.
- Contrast with `fontpie` (CLI approach) and `next/font adjustFontFallback`
  (automatic approach) to provide three implementation paths in the guide.
