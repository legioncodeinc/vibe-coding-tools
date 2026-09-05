---
source_type: blog
authority: high
relevance: high
topic: type scale tokens CSS custom properties
url: https://fontfyi.com/blog/type-scale-css-custom-properties/
retrieved: 2026-05-20
---

# FontFYI - Type Scale with CSS Custom Properties (Practical Guide)

## Summary

A guide covering the implementation of a type scale via CSS custom properties, including a three-tier token architecture (primitive, semantic, component tokens), Figma Tokens plugin integration, and Tailwind CSS bridging. Directly supports the font-token layer guide in the stinger.

## Key quotations / statistics

- "CSS custom properties are the ideal implementation layer for a type scale. They let you define the scale in one place, use it everywhere via var() references, and update the entire scale by changing a handful of values."
- "A robust token architecture has three tiers: Tier 1 - Primitive tokens (raw values), Tier 2 - Semantic tokens (reference primitives, communicate purpose), Tier 3 - Component tokens (reference semantic tokens)."
- "This architecture means that a redesign (changing the ratio from Major Third to Perfect Fourth) only requires updating the Tier 1 primitives. Every component, heading, and UI element automatically adopts the new scale."
- "Tokens Studio plugin (formerly Figma Tokens): export a JSON file that maps directly to this structure" - creates a living connection between Figma and CSS.

## Three-tier token architecture

### Tier 1: Primitive tokens (raw scale values)

```css
:root {
  --primitive-size-0: 0.64rem;
  --primitive-size-1: 0.8rem;
  --primitive-size-2: 1rem;        /* base */
  --primitive-size-3: 1.25rem;
  --primitive-size-4: 1.563rem;
  --primitive-size-5: 1.953rem;
  --primitive-size-6: 2.441rem;
  --primitive-size-7: 3.052rem;
  --primitive-size-8: 3.815rem;

  --primitive-weight-light:    300;
  --primitive-weight-regular:  400;
  --primitive-weight-medium:   500;
  --primitive-weight-semibold: 600;
  --primitive-weight-bold:     700;
}
```

### Tier 2: Semantic tokens (purpose-named)

```css
:root {
  --text-body-size:     var(--primitive-size-2);    /* 1rem */
  --text-body-weight:   var(--primitive-weight-regular);
  --text-body-leading:  1.65;

  --text-heading-xs-size: var(--primitive-size-3);
  --text-heading-sm-size: var(--primitive-size-4);
  --text-heading-md-size: var(--primitive-size-5);
  --text-heading-lg-size: var(--primitive-size-6);
  --text-heading-xl-size: var(--primitive-size-7);
  --text-heading-2xl-size: var(--primitive-size-8);
  --text-heading-weight:   var(--primitive-weight-bold);
  --text-heading-leading:  1.2;

  --text-label-size:    var(--primitive-size-0);
  --text-label-weight:  var(--primitive-weight-semibold);
  --text-label-spacing: 0.08em;

  --text-code-size:     0.875em;   /* Relative to context */
  --text-code-family:   'JetBrains Mono', monospace;
}
```

### Tier 3: Component tokens (component-scoped)

```css
/* In a component stylesheet */
.card-title {
  font-size: var(--text-heading-sm-size);
  font-weight: var(--text-heading-weight);
  line-height: var(--text-heading-leading);
}
```

## Figma Tokens JSON structure (for design-to-code pipeline)

```json
{
  "primitive": {
    "size": {
      "2": { "value": "1rem", "type": "fontSizes" }
    }
  },
  "semantic": {
    "text": {
      "body": {
        "size": { "value": "{primitive.size.2}", "type": "fontSizes" }
      }
    }
  }
}
```

## Tailwind CSS integration

```js
// tailwind.config.js
module.exports = {
  theme: {
    fontSize: {
      'xs':   ['var(--text-label-size)', { lineHeight: '1.4' }],
      'sm':   ['var(--primitive-size-1)', { lineHeight: '1.5' }],
      'base': ['var(--text-body-size)', { lineHeight: 'var(--text-body-leading)' }],
      'lg':   ['var(--primitive-size-3)', { lineHeight: '1.4' }],
      'xl':   ['var(--primitive-size-4)', { lineHeight: '1.3' }],
      '2xl':  ['var(--primitive-size-5)', { lineHeight: '1.2' }],
      '3xl':  ['var(--primitive-size-6)', { lineHeight: '1.15' }],
    }
  }
}
```

## Annotations for stinger-forge

- Primary source for `guides/05-font-token-layer.md` and `templates/typography.css.template`.
- The three-tier architecture (primitive → semantic → component) is the design system canon. This maps directly to what the Command Brief calls "font-token layer."
- The naming conventions (`--primitive-size-*`, `--text-body-*`, `--text-heading-*`) should be the defaults in the template, but stinger-forge should note these can be adapted to match `design-system-stinger` conventions.
- Include the Tailwind integration as a section in `guides/05-font-token-layer.md`.
- The Figma Tokens JSON is an advanced integration pattern - include as an optional section.
- Cross-reference with `design-system-stinger` peer stinger: the three-tier architecture is a design system concern, not a typography-only concern. This guide shows the typography-specific application of it.
