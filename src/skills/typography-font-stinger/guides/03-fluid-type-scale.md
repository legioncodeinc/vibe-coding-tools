# Fluid Type Scale with clamp()

*Sources: `research/external/2026-05-20-fluid-type-clamp.md`, `research/external/2026-05-20-utopia-fluid-type.md`, `research/external/2026-05-20-modular-scale-ratios.md`*

---

## What is a fluid type scale?

A fluid type scale uses CSS `clamp()` to interpolate font sizes smoothly between a minimum and maximum viewport width. Unlike media-query breakpoint steps, `clamp()` produces a continuous curve: no sudden jumps.

```css
font-size: clamp(min, preferred, max);
```

- `min`: the size at the smallest viewport (e.g., 320px)
- `max`: the size at the largest viewport (e.g., 1440px)
- `preferred`: a `calc()` expression that grows linearly between min and max

---

## The linear interpolation formula

Given:
- `min-size` in rem, `max-size` in rem
- `min-vw` in px (typically 320), `max-vw` in px (typically 1440)

The formula for the preferred value is:

```
slope = (max-size - min-size) / (max-vw - min-vw)
intercept = min-size - slope * min-vw
preferred = slope * 100vw + intercept
```

In CSS:

```css
/* Example: 1rem at 320px viewport, 1.5rem at 1440px viewport */
/* slope = (1.5 - 1) / (1440 - 320) = 0.5 / 1120 = 0.000446 */
/* intercept = 1 - 0.000446 * 320 = 1 - 0.143 = 0.857rem */
font-size: clamp(1rem, 0.857rem + 0.446vw, 1.5rem);
```

**Source:** `research/external/2026-05-20-fluid-type-clamp.md` (Modern CSS Tools, January 2026)

### WCAG 1.4.4 compliance

To pass WCAG 1.4.4 (Text Resize, Level AA), the preferred value must include a `rem` component (not pure `vw`) so that browser text-zoom still works:

```css
/* GOOD: includes rem component - responds to browser zoom */
font-size: clamp(1rem, 0.857rem + 0.446vw, 1.5rem);

/* BAD: pure vw - ignores browser text zoom, fails WCAG 1.4.4 */
font-size: clamp(1rem, 2vw, 1.5rem);
```

> **Open question (Q4 from research):** Utopia is transitioning some output to `vi` (viewport inline size) instead of `vw`. For horizontal-writing Latin projects, `vi` = `vw`. Use `vw` until Utopia's stable generator defaults to `vi`.

---

## Scale ratios

A modular scale multiplies each step by a ratio. Common ratios:

| Ratio | Name | Steps (base 1rem) |
|-------|------|-------------------|
| 1.067 | Minor Second | 1, 1.07, 1.14, 1.22... |
| 1.125 | Major Second | 1, 1.13, 1.27, 1.42... |
| 1.200 | Minor Third | 1, 1.20, 1.44, 1.73... |
| 1.250 | Major Third (default) | 1, 1.25, 1.56, 1.95... |
| 1.333 | Perfect Fourth | 1, 1.33, 1.78, 2.37... |
| 1.618 | Golden Ratio | 1, 1.62, 2.62, 4.24... |

**Recommended default:** Major Third (1.25) for most web products. Provides clear visual hierarchy without overpowering the body text. Perfect Fourth (1.33) for display-heavy designs (portfolios, landing pages). Source: `research/external/2026-05-20-modular-scale-ratios.md`.

---

## Step naming convention

Use a neutral naming scheme that does not embed size values (which become wrong when the scale changes):

```css
/* Neutral naming (preferred) */
--step--2: clamp(0.64rem, ...);  /* caption, label */
--step--1: clamp(0.80rem, ...);  /* small */
--step-0:  clamp(1.00rem, ...);  /* body base */
--step-1:  clamp(1.25rem, ...);  /* large body */
--step-2:  clamp(1.56rem, ...);  /* h4 */
--step-3:  clamp(1.95rem, ...);  /* h3 */
--step-4:  clamp(2.44rem, ...);  /* h2 */
--step-5:  clamp(3.05rem, ...);  /* h1 */
```

Then alias to semantic names in a separate layer:

```css
--font-size-caption: var(--step--2);
--font-size-small:   var(--step--1);
--font-size-body:    var(--step-0);
--font-size-h4:      var(--step-2);
--font-size-h3:      var(--step-3);
--font-size-h2:      var(--step-4);
--font-size-h1:      var(--step-5);
```

This two-tier approach (primitive steps + semantic aliases) lets you remap semantic names to different steps without changing component CSS. Source: `research/external/2026-05-20-utopia-fluid-type.md`.

---

## Generated example: Major Third, 320px-1440px

The following was generated from Utopia's algorithm for a Major Third scale with base 1rem at 320px and 1.25rem at 1440px:

```css
:root {
  --step--2: clamp(0.64rem, 0.62rem + 0.11vw, 0.72rem);
  --step--1: clamp(0.80rem, 0.77rem + 0.14vw, 0.90rem);
  --step-0:  clamp(1.00rem, 0.96rem + 0.18vw, 1.13rem);
  --step-1:  clamp(1.25rem, 1.20rem + 0.23vw, 1.41rem);
  --step-2:  clamp(1.56rem, 1.50rem + 0.28vw, 1.76rem);
  --step-3:  clamp(1.95rem, 1.88rem + 0.35vw, 2.20rem);
  --step-4:  clamp(2.44rem, 2.35rem + 0.43vw, 2.75rem);
  --step-5:  clamp(3.05rem, 2.94rem + 0.54vw, 3.44rem);
}
```

For your actual project, generate from https://utopia.fyi/type/calculator/ with your min/max viewport and base size inputs.

---

## Using the scale in Tailwind

Extend the Tailwind theme with the custom properties:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'caption': 'var(--font-size-caption)',
        'small':   'var(--font-size-small)',
        'base':    'var(--font-size-body)',
        'h4':      'var(--font-size-h4)',
        'h3':      'var(--font-size-h3)',
        'h2':      'var(--font-size-h2)',
        'h1':      'var(--font-size-h1)',
      }
    }
  }
}
```

Then in component CSS:

```html
<h1 className="text-h1 leading-tight">Page Title</h1>
```

**Important:** Do NOT use Tailwind's built-in `text-sm`, `text-xl` etc. alongside fluid custom properties: they conflict and produce inconsistent sizing. Pick one system.
