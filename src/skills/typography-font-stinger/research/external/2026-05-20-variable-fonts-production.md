---
source_type: blog
authority: high
relevance: high
topic: variable fonts production configuration
url: https://fontfyi.com/blog/how-to-use-variable-fonts-css/
retrieved: 2026-05-20
---

# FontFYI - How to Use Variable Fonts in CSS (Practical Guide)

## Summary

A comprehensive 2026 production guide covering the complete variable font workflow: loading via `@font-face`, setting axes in CSS, using standard CSS properties vs. `font-variation-settings`, animating axes, and handling the small browser support gap. Covers production-ready patterns for Inter and other variable fonts.

## Key quotations / statistics

- "A single variable font file can contain an infinite number of design variations — every weight from Thin to Black, every width from Condensed to Extended — through continuous numeric axes rather than discrete files."
- "Variable font support in browsers is now essentially universal. All modern browsers — Chrome 66+, Firefox 62+, Safari 11+, Edge 17+ — support variable fonts fully. The global coverage is over 97% as of 2024."
- "Weight transitions on hover, smooth optical size adjustments on scroll, kinetic type that responds to user interaction — all of these are achievable with CSS transitions and animations."
- On economics: "Before variable fonts, providing five weight variants for a typeface meant five network requests, five files to cache, and five @font-face declarations to maintain. A variable font collapses all of that into one file, one declaration, and one cache entry — while actually expanding typographic capability."

## Production-ready @font-face pattern

```css
/* Variable font with @supports fallback */
@supports (font-variation-settings: normal) {
  @font-face {
    font-family: "Inter";
    src: url("/fonts/inter-variable.woff2") format("woff2");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
}

/* Base typography */
body {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-optical-sizing: auto;
}

/* Headings use continuous weight scale */
h1 { font-weight: 700; }
h2 { font-weight: 650; }
h3 { font-weight: 600; }
```

## The five registered axes

| Axis | CSS property | Tag |
|---|---|---|
| Weight | `font-weight` | `wght` |
| Width | `font-stretch` | `wdth` |
| Italic | `font-style` | `ital` |
| Slant | `font-style: oblique` | `slnt` |
| Optical size | `font-optical-sizing` | `opsz` |

## Using standard properties vs. font-variation-settings

- **Use standard CSS properties first** (`font-weight`, `font-stretch`, `font-style`) - they cascade correctly and work with non-variable fallbacks.
- **Use `font-variation-settings` only for custom axes** not covered by standard properties (e.g., `GRAD` for grade, `XTRA` for contrast).
- `font-variation-settings` is a low-level override and must specify ALL axes if used - partial overrides reset unspecified axes to defaults.

## Animatable axes (2026 capability)

Variable font axes are animatable CSS properties, enabling effects impossible with static fonts:
```css
a:hover { font-weight: 600; transition: font-weight 0.2s ease; }
```

## @supports fallback pattern

```css
/* Static font fallback for legacy browsers */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-regular.woff2") format("woff2");
  font-weight: 400;
}

/* Variable font enhancement */
@supports (font-variation-settings: normal) {
  @font-face {
    font-family: "Inter";
    src: url("/fonts/inter-variable.woff2") format("woff2");
    font-weight: 100 900;
  }
}
```

## Annotations for stinger-forge

- Primary source for `guides/02-variable-fonts.md`.
- The `font-weight: 100 900` range declaration in `@font-face` is essential - without it, browsers may try to synthesize bold/italic from the variable font.
- The `font-optical-sizing: auto` property enables automatic optical adjustments based on rendered size - include as a recommended default.
- The `@supports (font-variation-settings: normal)` fallback pattern should be the canonical pattern in the guide, though it notes that omitting the fallback is acceptable for modern web apps (97%+ support).
- The animation capability is worth noting in the guide as a differentiating benefit of variable fonts.
