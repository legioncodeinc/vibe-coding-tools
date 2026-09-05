---
source_url: https://web.dev/articles/preload-optional-fonts
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: preload
stinger: font-loading-stinger
---

# Prevent layout shifting and FOIT by preloading optional fonts | web.dev

## Summary
Documents the Chrome 83 optimization that eliminates layout jank when combining
`<link rel="preload">` with `font-display: optional`. Explains that prior to
Chrome 83, optional fonts caused two render cycles producing a flicker; the
fix blocks rendering until the font loads or the 100ms threshold passes. This
source establishes the canonical `preload + optional` pairing as the most
effective zero-layout-jank strategy.

## Key quotations / statistics

- "Combining `<link rel="preload">` with `font-display: optional` is the most
  effective way to guarantee no layout jank when rendering custom fonts."

- "Chrome re-renders the page **twice** in both instances, regardless of whether
  the fallback font is used or if the custom font finishes loading in time. This
  causes a slight flicker of invisible text and, in cases when a new font is
  rendered, layout jank."

- "Optimizations have landed in Chrome 83 to entirely remove the first render
  cycle for optional fonts that are preloaded with `<link rel="preload">`.
  Instead, rendering is blocked until the custom font has finished loading or a
  certain period of time has passed. This timeout period is currently set at
  100ms."

- "Preloading optional fonts in Chrome removes the possibility of layout jank
  and flash of unstyled text."

## Annotations for stinger-forge

- This source resolves the open question in the Command Brief: "Is
  `font-display: optional` now the correct default for non-critical body copy in
  2026?" The answer is nuanced: `optional` is zero-CLS *only when paired with
  `<link rel="preload">`* (Chrome 83+). Without preload, it can still cause a
  flicker on first load. Use `optional` + preload for the cleanest result;
  use `swap` + metric overrides when preloading is not feasible.
- The 100ms render-blocking threshold for preloaded `optional` fonts is
  important to document in `guides/02-preload-strategy.md`.
- The "most effective zero-jank" claim belongs in
  `guides/01-font-display-decision-matrix.md` as the recommended strategy for
  performance-critical pages.
