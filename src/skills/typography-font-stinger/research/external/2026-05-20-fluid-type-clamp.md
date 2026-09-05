---
source_type: blog
authority: high
relevance: high
topic: fluid type clamp() CSS implementation
url: https://moderncsstools.com/guides/fluid-typography/
retrieved: 2026-05-20
---

# Modern CSS Tools - Fluid Typography with CSS clamp() - A Complete Guide (January 2026)

## Summary

A complete 2026 reference for fluid typography implementation using CSS `clamp()`. Covers the linear interpolation formula derivation, modular type scales with `clamp()`, accessibility (WCAG 1.4.4), and browser compatibility. Provides production-ready CSS custom property patterns.

## Key quotations / statistics

- "Fluid typography eliminates the staircase. Instead of jumping between fixed sizes, the text scales smoothly and continuously between a minimum and maximum value as the viewport (or container) changes size."
- "A heading defined as `font-size: clamp(1.5rem, 2.5vw + 1rem, 3rem)` will be exactly 1.5rem on small screens, exactly 3rem on large screens, and a proportional size at every viewport width in between — all without a single media query."
- "Support exceeds 97% of global users as of 2026 and the function is in Baseline Widely Available."
- On accessibility: "Adding a rem term in the preferred value (e.g. 2.5vw + 1rem) lets the size scale with both viewport width and the user's font-size preference, satisfying WCAG 2.2 SC 1.4.4 Resize Text."
- "Using only vw alone breaks browser zoom because it is calculated against the viewport in CSS pixels, which does not change when the user zooms."

## The clamp() formula

```
font-size: clamp(MIN, PREFERRED, MAX)
```

- **MIN** - minimum value, in `rem` (never goes below this).
- **PREFERRED** - linear equation: `slope × 100vw + intercept`. Scales with viewport.
- **MAX** - maximum value, in `rem` (never exceeds this).

**Derivation formula:**
```
slope     = (max_size − min_size) / (max_viewport − min_viewport)
intercept = min_size − slope × min_viewport

clamp(min_size, slope×100vw + intercept, max_size)
```

**Example:** Scale 24px → 48px between 320px and 1280px:
```
slope     = (3rem − 1.5rem) / (80rem − 20rem) = 0.025
intercept = 1.5rem − 0.025 × 20rem = 1rem
Result:   clamp(1.5rem, 2.5vw + 1rem, 3rem)
```

## Modular type scale with clamp()

```css
:root {
  --fs-sm:   clamp(0.8rem, 0.17vi + 0.76rem, 0.89rem);
  --fs-base: clamp(1rem, 0.34vi + 0.91rem, 1.19rem);
  --fs-md:   clamp(1.25rem, 0.61vi + 1.1rem, 1.58rem);
  --fs-lg:   clamp(1.56rem, 1vi + 1.31rem, 2.11rem);
  --fs-xl:   clamp(1.95rem, 1.56vi + 1.56rem, 2.81rem);
  --fs-xxl:  clamp(2.44rem, 2.38vi + 1.85rem, 3.75rem);
  --fs-xxxl: clamp(3.05rem, 3.54vi + 2.17rem, 5rem);
}
```

Note: `vi` is the inline viewport unit (equivalent to `vw` for horizontal writing modes) - the 2026 recommended alternative to `vw` for fluid type.

## Legacy fallback pattern

```css
/* Fallback for browsers that don't support clamp() */
.text-lg { font-size: 1.5rem; }

/* Enhanced for browsers that do */
@supports (font-size: clamp(1rem, 1vw, 2rem)) {
  .text-lg { font-size: clamp(1.125rem, 1vi + 1.31rem, 2.11rem); }
}
```

## Annotations for stinger-forge

- Primary source for `guides/03-fluid-type-scale.md`.
- The slope/intercept derivation formula is the mathematical foundation that stinger-forge should include as the "first principles" section of the guide.
- The WCAG 1.4.4 accessibility concern (always mix vw with rem) is a critical directive to codify as a rule in the guide.
- The `vi` unit (inline viewport width) is the 2026 preferred alternative to `vw` for horizontal writing modes - check if Utopia already uses it (see utopia-fyi research note).
- The `clamp()` Baseline Widely Available status means no polyfill is needed - state this clearly in the guide.
- Contradicts older articles that suggest providing media query fallbacks - current browser support makes fallbacks optional for most audiences.
