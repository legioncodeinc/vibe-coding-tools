# Font Token Layer

*Sources: `research/external/2026-05-20-type-scale-tokens.md`, `research/external/2026-05-20-utopia-fluid-type.md`, `research/external/2026-05-20-variable-fonts-production.md`*

---

## The three-tier architecture

Font tokens follow the same three-tier architecture used by all design system tokens:

1. **Tier 1 - Primitive tokens**: raw scale values, no semantic meaning
2. **Tier 2 - Semantic tokens**: purpose-named references to primitives (what these sizes ARE)
3. **Tier 3 - Component tokens**: component-scoped bindings to semantic tokens

This architecture means a scale change (e.g., switching from Major Third to Perfect Fourth ratio) only requires updating Tier 1. Every component and heading automatically adopts the new scale via the reference chain.

---

## Tier 1: Primitive scale steps

Combine the fluid step values from `guides/03-fluid-type-scale.md` with primitive naming:

```css
:root {
  /* --- Fluid scale primitives (clamp values from 03-fluid-type-scale.md) --- */
  --step--2: clamp(0.64rem, 0.62rem + 0.11vw, 0.72rem);
  --step--1: clamp(0.80rem, 0.77rem + 0.14vw, 0.90rem);
  --step-0:  clamp(1.00rem, 0.96rem + 0.18vw, 1.13rem);
  --step-1:  clamp(1.25rem, 1.20rem + 0.23vw, 1.41rem);
  --step-2:  clamp(1.56rem, 1.50rem + 0.28vw, 1.76rem);
  --step-3:  clamp(1.95rem, 1.88rem + 0.35vw, 2.20rem);
  --step-4:  clamp(2.44rem, 2.35rem + 0.43vw, 2.75rem);
  --step-5:  clamp(3.05rem, 2.94rem + 0.54vw, 3.44rem);

  /* --- Weight primitives --- */
  --weight-light:    300;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* --- Family primitives --- */
  --family-sans:  "Inter", system-ui, -apple-system, sans-serif;
  --family-serif: "Lora", Georgia, "Times New Roman", serif;
  --family-mono:  "JetBrains Mono", "Fira Code", Consolas, monospace;
}
```

---

## Tier 2: Semantic tokens

Semantic tokens give purpose to the primitive steps. This layer is what component authors reference.

```css
:root {
  /* --- Font families --- */
  --font-family-body:    var(--family-sans);
  --font-family-heading: var(--family-sans);
  --font-family-code:    var(--family-mono);
  --font-family-display: var(--family-sans);

  /* --- Font sizes --- */
  --font-size-caption: var(--step--2);
  --font-size-small:   var(--step--1);
  --font-size-body:    var(--step-0);
  --font-size-large:   var(--step-1);
  --font-size-h6:      var(--step-1);
  --font-size-h5:      var(--step-2);
  --font-size-h4:      var(--step-2);
  --font-size-h3:      var(--step-3);
  --font-size-h2:      var(--step-4);
  --font-size-h1:      var(--step-5);
  --font-size-display: var(--step-5);

  /* --- Font weights --- */
  --font-weight-body:    var(--weight-regular);
  --font-weight-strong:  var(--weight-semibold);
  --font-weight-heading: var(--weight-bold);
  --font-weight-ui:      var(--weight-medium);

  /* --- Line heights --- */
  --line-height-body:    1.6;
  --line-height-heading: 1.15;
  --line-height-subhead: 1.3;
  --line-height-ui:      1.1;
  --line-height-caption: 1.45;
  --line-height-code:    1.65;

  /* --- Letter spacing --- */
  --letter-spacing-tight:   -0.025em;
  --letter-spacing-normal:   0;
  --letter-spacing-wide:     0.025em;
  --letter-spacing-widest:   0.1em;
}
```

---

## Applying the semantic layer

```css
/* Base document typography */
body {
  font-family:   var(--font-family-body);
  font-size:     var(--font-size-body);
  font-weight:   var(--font-weight-body);
  line-height:   var(--line-height-body);
  letter-spacing: var(--letter-spacing-normal);
}

/* Heading defaults */
h1, .h1 {
  font-family:    var(--font-family-heading);
  font-size:      var(--font-size-h1);
  font-weight:    var(--font-weight-heading);
  line-height:    var(--line-height-heading);
  letter-spacing: var(--letter-spacing-tight);
}

h2, .h2 {
  font-size:      var(--font-size-h2);
  font-weight:    var(--font-weight-heading);
  line-height:    var(--line-height-heading);
  letter-spacing: var(--letter-spacing-tight);
}

h3, .h3 {
  font-size:      var(--font-size-h3);
  font-weight:    var(--font-weight-strong);
  line-height:    var(--line-height-subhead);
}

/* Code */
code, kbd, pre {
  font-family: var(--font-family-code);
  font-size:   0.875em;
  line-height: var(--line-height-code);
}
```

---

## Tailwind integration

Wire the semantic tokens into Tailwind's theme so utility classes reference your scale:

```javascript
// tailwind.config.js (Tailwind v3)
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-family-body)'],
        serif: ['var(--font-family-heading-serif)'],
        mono:  ['var(--font-family-code)'],
      },
      fontSize: {
        caption: 'var(--font-size-caption)',
        small:   'var(--font-size-small)',
        base:    'var(--font-size-body)',
        large:   'var(--font-size-large)',
        h6:      'var(--font-size-h6)',
        h5:      'var(--font-size-h5)',
        h4:      'var(--font-size-h4)',
        h3:      'var(--font-size-h3)',
        h2:      'var(--font-size-h2)',
        h1:      'var(--font-size-h1)',
      },
      lineHeight: {
        body:    'var(--line-height-body)',
        heading: 'var(--line-height-heading)',
        ui:      'var(--line-height-ui)',
      }
    }
  }
}
```

**Tailwind v4 (CSS-native):** In v4, import the token file directly in your main CSS and use `@theme inline` to register the tokens:

```css
/* app/globals.css */
@import "tailwindcss";
@import "./tokens/typography.css";

@theme inline {
  --font-size-h1: var(--font-size-h1);
  --font-family-sans: var(--font-family-body);
}
```

---

## The single source-of-truth rule

All typographic values - family, size, weight, line-height, letter-spacing - must live in one `tokens/typography.css` file. Never declare font sizes in:

- Component `.tsx` or `.module.css` files (except `var()` references)
- `tailwind.config.js` as raw values (only as `var()` references)
- Inline `style=` attributes
- Any other global CSS file

Why: when values are scattered, a type scale migration becomes a codebase-wide search-and-replace. When they flow through the token file, it is a one-line change.

---

## Optional: Figma Tokens / Tokens Studio bridge

For design-to-code pipelines using Tokens Studio (formerly Figma Tokens), the three-tier architecture maps directly to the JSON export format:

```json
{
  "primitive": {
    "step": {
      "0": { "value": "clamp(1rem, 0.96rem + 0.18vw, 1.13rem)", "type": "fontSizes" }
    }
  },
  "semantic": {
    "font": {
      "size": {
        "body": { "value": "{primitive.step.0}", "type": "fontSizes" }
      }
    }
  }
}
```

See `.claude/skills/design-system-stinger/` for the full design system token pipeline.
