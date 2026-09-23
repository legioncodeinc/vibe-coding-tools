# Vertical Rhythm and Line-Height Tokens

*Sources: `research/external/2026-05-20-type-scale-tokens.md`, `research/external/2026-05-20-fluid-type-clamp.md`*

---

## What is vertical rhythm?

Vertical rhythm is the pattern of spacing between lines of text and between typographic elements on the page. A consistent rhythm makes reading feel effortless; broken rhythm feels choppy and amateurish without the reader being able to name why.

Vertical rhythm in CSS is controlled by three properties:

1. **`line-height`** - the spacing between baselines within a text block
2. **`margin-block`** (or `margin-top`/`margin-bottom`) - the space between adjacent typographic elements
3. **`gap`** and **`padding`** - the space between text blocks and their container context

---

## The base rhythm unit

All vertical spacing should derive from a single base rhythm unit. A common choice is `1.5rem` (24px at 16px root), which is the `line-height` of body text.

```css
:root {
  --rhythm: 1.5;          /* unitless: used as line-height */
  --rhythm-rem: 1.5rem;   /* rem equivalent: used for spacing */
}
```

**Rationale:** When headings and body text both derive margins from the same unit, the eye perceives a continuous vertical grid even when heading sizes vary.

---

## Line-height by text role

Different text roles require different `line-height` values because optical comfort depends on font size, measure (line length), and content density.

| Role | Recommended `line-height` | Why |
|------|--------------------------|-----|
| Body text | 1.5 - 1.65 | Long lines require more leading for the eye to track |
| Headings (h1-h2) | 1.1 - 1.2 | Short lines; tight leading looks intentional |
| Subheadings (h3-h4) | 1.25 - 1.35 | Between heading and body density |
| UI labels, buttons | 1.0 - 1.2 | Short strings; tight leading fits component constraints |
| Captions, footnotes | 1.4 - 1.5 | Small sizes need proportionally more leading |
| Code blocks | 1.6 - 1.7 | Wider characters benefit from extra air |

```css
:root {
  --line-height-body:     1.6;
  --line-height-heading:  1.15;
  --line-height-subhead:  1.3;
  --line-height-ui:       1.1;
  --line-height-caption:  1.45;
  --line-height-code:     1.65;
}
```

---

## Heading margins as rhythm multiples

Margins above and below headings should be multiples of the base rhythm unit, with more space above than below (the heading belongs visually to the content following it).

```css
:root {
  --space-rhythm-xs:  calc(var(--rhythm-rem) * 0.25);  /* 0.375rem */
  --space-rhythm-sm:  calc(var(--rhythm-rem) * 0.5);   /* 0.75rem */
  --space-rhythm-md:  var(--rhythm-rem);               /* 1.5rem */
  --space-rhythm-lg:  calc(var(--rhythm-rem) * 1.5);   /* 2.25rem */
  --space-rhythm-xl:  calc(var(--rhythm-rem) * 2);     /* 3rem */
  --space-rhythm-2xl: calc(var(--rhythm-rem) * 3);     /* 4.5rem */
}

h1, h2, h3, h4, h5, h6 {
  margin-block-start: var(--space-rhythm-xl);
  margin-block-end:   var(--space-rhythm-sm);
}

p, ul, ol {
  margin-block-start: 0;
  margin-block-end:   var(--space-rhythm-md);
}
```

---

## Optical adjustments for display text

At large sizes (h1, hero text), mathematically-derived line-heights often look too loose because ascenders and descenders create optical illusions. Apply optical compression:

```css
/* Mathematical: 1.15 × step-5 */
h1 {
  line-height: var(--line-height-heading);  /* 1.15 */
}

/* Optical: for hero/display text above ~3rem, reduce further */
.hero-headline {
  line-height: 1.05;  /* Tighten for very large display text */
  letter-spacing: -0.02em;  /* Compensate for large optical spacing */
}
```

---

## Integrating with the fluid type scale

When using `clamp()` sizes from `guides/03-fluid-type-scale.md`, the line-height token values remain unitless and fixed - they do not need to scale with the font size because `line-height` is already relative to `font-size`.

```css
:root {
  /* Scale steps from 03-fluid-type-scale.md */
  --font-size-body:   var(--step-0);   /* clamp(1rem, ..., 1.13rem) */
  --font-size-h1:     var(--step-5);   /* clamp(3.05rem, ..., 3.44rem) */

  /* Line-height tokens: unitless, not fluid */
  --line-height-body:    1.6;
  --line-height-heading: 1.15;
}

body    { font-size: var(--font-size-body);  line-height: var(--line-height-body); }
h1      { font-size: var(--font-size-h1);   line-height: var(--line-height-heading); }
```

---

## Paragraph measure (line length)

Vertical rhythm also depends on line length. Lines that are too long or too short require `line-height` compensation. Target 45-80 characters per line for body text.

```css
article p, .prose p {
  max-width: 65ch;    /* ~65 characters: classic Bringhurst recommendation */
}

.narrow-column p {
  max-width: 45ch;
  line-height: 1.5;   /* Slightly tighter because lines are short */
}
```

---

## Tailwind integration

Add rhythm tokens to Tailwind's spacing and line-height scales:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      lineHeight: {
        'body':    'var(--line-height-body)',
        'heading': 'var(--line-height-heading)',
        'ui':      'var(--line-height-ui)',
        'caption': 'var(--line-height-caption)',
      },
      spacing: {
        'rhythm':    'var(--rhythm-rem)',
        'rhythm-sm': 'var(--space-rhythm-sm)',
        'rhythm-lg': 'var(--space-rhythm-lg)',
        'rhythm-xl': 'var(--space-rhythm-xl)',
      }
    }
  }
}
```
