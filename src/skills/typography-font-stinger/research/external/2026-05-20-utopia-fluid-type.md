---
source_type: web
authority: high
relevance: high
topic: Utopia fluid type scale calculator
url: https://utopia.fyi/type/calculator/
retrieved: 2026-05-20
---

# Utopia - Fluid Type Scale Calculator

## Summary

Utopia is the canonical reference implementation for fluid `clamp()` type scales. It generates a complete set of CSS custom property declarations from five inputs: min/max viewport width, min/max base font size, type scale ratio, and number of steps. The calculator outputs ready-to-paste CSS and is widely cited as the production standard for fluid type scales in 2026.

## Key quotations / statistics

- Utopia is listed in the Command Brief reference material as the "reference implementation for clamp() scales."
- The generated CSS uses the naming convention `--step--2`, `--step--1`, `--step-0`, `--step-1` etc. with negative steps for sub-body sizes.
- Utopia links to a deep-dive article and encourages self-documenting scales via the calculator URL in the CSS comment.

## Sample output (defaults: 360px-1240px viewport, 18px-20px base, Minor Third to Major Third)

```css
/* @link https://utopia.fyi/type/calculator?c=360,18,1.2,1240,20,1.25,5,2,&s=... */

:root {
  --step--2: clamp(0.7813rem, 0.7736rem + 0.0341vw, 0.8rem);
  --step--1: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem);
  --step-0:  clamp(1.125rem,  1.0739rem + 0.2273vw, 1.25rem);
  --step-1:  clamp(1.35rem,   1.2631rem + 0.3864vw, 1.5625rem);
  --step-2:  clamp(1.62rem,   1.4837rem + 0.6057vw, 1.9531rem);
  --step-3:  clamp(1.944rem,  1.7405rem + 0.9044vw, 2.4414rem);
  --step-4:  clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem);
  --step-5:  clamp(2.7994rem, 2.384rem  + 1.8461vw, 3.8147rem);
}
```

## Utopia naming convention

- `--step--2`, `--step--1`: Sub-body sizes (caption, labels, fine print).
- `--step-0`: Body base size.
- `--step-1` through `--step-5`: Heading sizes, ascending.

This is different from the `--text-xs`, `--text-sm`, `--text-base` semantic naming convention used in other systems. Stinger-forge should decide which naming convention to adopt or bridge between the two.

## Utopia URL parameter system

The calculator URL encodes all parameters, making scales self-documenting:
```
https://utopia.fyi/type/calculator?c=360,18,1.2,1240,20,1.25,5,2
                                       ↑    ↑   ↑    ↑    ↑   ↑   ↑   ↑
                                    minVp  min scaleMin  maxVp max scaleMax  steps negative
```

## Utopia vs. fluid-type-scale.com

Both calculators generate equivalent CSS. Utopia uses the `--step-N` naming, while `fluid-type-scale.com` uses customizable prefixes. For design systems, the semantic naming (`--text-sm`, `--text-base`) is preferred as a consumer-facing layer over the raw Utopia output.

## Annotations for stinger-forge

- Include a copy of the sample Utopia output in `examples/fluid-scale-calculator.md` as the "canonical output" example.
- The `guides/03-fluid-type-scale.md` guide should explain the Utopia naming convention AND show how to map it to semantic token names.
- The self-documenting URL comment convention is a best practice worth recommending: include the generator URL as the first CSS comment so future maintainers can regenerate or adjust the scale.
- Utopia supports both `vw` and newer `vi` viewport units - check which the 2026 version defaults to.
- Negative steps (`--step--2`) are important for caption/label sizing - don't omit them in the template.
