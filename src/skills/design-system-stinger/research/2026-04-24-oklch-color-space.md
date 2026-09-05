# OKLCH Color Space in Design Systems

**Sources:**
- https://medium.com/@sandroieva/smarter-palettes-better-accessibility-why-your-design-system-needs-oklch-f20f3f9c1c1f (2026-02-23)
- https://oklch.org/posts/ultimate-oklch-guide
- https://colorbox.io/oklch-vs-hsl (2025-01-27)
- https://oklch.net/
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch

**Retrieved:** 2026-04-24

## Summary

OKLCH is a perceptually uniform color space (lightness, chroma, hue). Developed
by Björn Ottosson in 2020. Shipped in all evergreen browsers (Chrome 111+,
Safari 15.4+, Firefox 113+). Tailwind v4 adopted it as the default for its
color palette. It is the right default for modern design systems because:

1. **Equal numeric changes produce equal perceived changes.** In HSL, 50%
   lightness is near-white for yellow and near-black for blue. In OKLCH, L
   axis is perceptually uniform across all hues.
2. **Contrast becomes predictable.** Because L corresponds to perceived
   lightness, WCAG contrast targets line up with L-value deltas.
3. **Dark-mode inversion works.** Invert L (and optionally tune C) and the
   palette stays harmonious automatically.
4. **Wide gamut.** OKLCH can express P3 and Rec.2020 colors; HSL cannot.

## Syntax

```css
color: oklch(55% 0.2 250);          /* L 55%, C 0.2, H 250deg */
color: oklch(0.55 0.2 250);         /* same, L as 0-1 */
color: oklch(from var(--brand) calc(l - 0.1) c h);  /* relative color */
```

CSS Color Module Level 5 adds **relative color syntax**: `oklch(from <color>
L C H)`. This lets you derive hover/pressed/disabled shades from a base token
without hardcoding new hex values.

## When to use hex vs oklch

- **hex / rgb:** legacy brand refs, tenant-provided brand values where exact
  round-trip matters, code comments.
- **oklch:** every new palette expansion. Every design-token color. Every
  hover/pressed derivation.

## Relevance to this stinger

- `guides/03-authoring-tokens.md` covers the OKLCH vs hex trade-off and
  prescribes: brand tokens as hex (tenant round-trip), derived shades as
  `oklch()` or `color-mix()`.
- Starter kits should use `oklch()` where possible so the palette stays
  extensible.
- The glass-on-beige starter uses hex plus `color-mix()` for
  shadows/derivations: this is pragmatic and acceptable, but new systems
  should default to oklch for any non-brand color.
