---
source_type: internal
authority: high
relevance: high
topic: command brief scope and directives
url: ai-tools/command-briefs/typography-font-worker-bee-command-brief.md
retrieved: 2026-05-20
---

# Command Brief Notes: typography-font-worker-bee

## Summary

The `typography-font-worker-bee` Command Brief defines an opinionated type-and-font specialist that owns the full technical typographic surface of web products. It covers font loading strategy selection, variable font configuration, fluid type scale construction via `clamp()`, vertical rhythm, and a reusable font-token layer.

The Bee activates after `design-system-worker-bee` has chosen the typeface and before `ux-ui-svelte-worker-bee` applies tokens in components.

## Scope boundary (critical for stinger-forge)

- **Owns:** hosting strategy (next/font, Fontsource, self-host), `@font-face` config for variable fonts, `font-display` semantics, `clamp()` fluid type scales, vertical rhythm tokens, `tokens/typography.css` authorship.
- **Does NOT own:** typeface aesthetic selection (`design-system-worker-bee`), per-component token application (`ux-ui-svelte-worker-bee`), build pipeline font optimization steps (`devops-worker-bee`), font preference DB schema (`db-worker-bee`).

## Expected input surface

- Current font loading setup (link tags, `@font-face`, `next/font` config, Fontsource imports)
- Desired typefaces / licensing constraints / variable font support
- Next.js version + App Router vs Pages Router (affects `next/font` API shape)
- Current type scale definition (px, rem, or existing `clamp()`)
- Performance budget (Core Web Vitals targets, font byte budget)
- Design system token file for alignment

## Critical directives from brief

1. Always specify `font-display` explicitly on every `@font-face` rule.
2. Never reference raw px font sizes in component code - all sizes through token layer.
3. Distinguish FOIT (invisible text), FOUT (unstyled text), FOFT (faux text) - each has different remediation.
4. Always subset variable fonts - unsubsetted are 300-800 kB; Latin subset is 20-60 kB.
5. Validate `next/font` usage with App Router API, not Pages Router API.
6. Express fluid type steps as `clamp()` expressions, never breakpoint steps.
7. Keep font-token file as the single source of truth.

## Proposed guides structure (from brief)

- `guides/00-principles.md` - FOIT/FOUT/FOFT, font-display decision matrix, variable font anatomy
- `guides/01-hosting-strategy.md` - Google Fonts, next/font, Fontsource, self-hosting
- `guides/02-variable-fonts.md` - @font-face syntax, font-variation-settings, axes, @supports fallback
- `guides/03-fluid-type-scale.md` - modular scale arithmetic, clamp() formula, Utopia output
- `guides/04-vertical-rhythm.md` - base unit, heading margins, line-height invariants
- `guides/05-font-token-layer.md` - canonical tokens/typography.css layout, Tailwind integration
- `guides/06-performance-checklist.md` - preload hints, CWV, subset byte budgets

## Templates requested

- `templates/typography.css.template` - CSS custom property skeleton for all font tokens
- `templates/next-font-config.ts.template` - canonical next/font/google or next/font/local setup
- `examples/fluid-scale-calculator.md` - clamp() arithmetic for major-third 320px-1440px scale

## Annotations for stinger-forge

- The brief explicitly requests seven guides with clear scope per guide.
- `guides/01-hosting-strategy.md` is the critical decision tree guide - the research on Fontsource, next/font, and self-hosting should flow directly into this guide.
- The FOIT/FOUT/FOFT triad is a core concept in `guides/00-principles.md` - the font-performance and font-display research directly informs this.
- The fluid type scale research (clamp(), Utopia, modular ratios) maps directly to `guides/03-fluid-type-scale.md`.
- The token architecture research maps to `guides/05-font-token-layer.md`.
