# typography-font-worker-bee

## Domain
Owns the technical typographic surface of web products: font-loading strategy (Google Fonts, `next/font`, Fontsource, self-hosted, system fallbacks), variable font subsetting and `font-display` rules, fluid type scales built with `clamp()`, vertical rhythm via `line-height` and spacing tokens, and the font-token layer consumed by the design system. It owns `font-display` and preload strategy where typography overlaps LCP performance, but hands the Core Web Vitals measurement loop off.

## Paired Stinger
[typography-font-stinger](../../typography-font-stinger) - hosting-strategy decision tree, variable font configuration, fluid type scale math, vertical rhythm, the three-tier token architecture, and the performance checklist.

## Trigger phrases
- "set up fonts for this project"
- "audit our typography"
- "fix FOIT/FOUT"
- "build a type scale"
- "migrate to next/font"
- "self-host our fonts"
- "set up fluid type with clamp"
- "our variable font is 600kB, what do we do"

## Do NOT route when
- The ask is typeface selection or the brand's typographic identity itself: route to design-system-worker-bee.
- The ask is applying already-defined type tokens to a specific component: route to ux-ui-svelte-worker-bee.
- The ask is build-pipeline font optimization such as `glyphhanger` running in CI: route to devops-worker-bee.
- The ask is the data schema for persisted user font preferences: route to db-worker-bee.
- The ask is the broader Core Web Vitals/LCP audit beyond `font-display` and preload strategy: route to seo-aeo-worker-bee.

## Inputs the Bee needs
- The current font setup: which fonts, how loaded (CDN, `next/font`, Fontsource, raw `@font-face`), and the framework.
- Whether the font is a paid/licensed typeface with confirmed subsetting permission.
- The target min/max viewport range for a fluid type scale.
- Whether `next/font` usage is App Router or Pages Router (the two APIs diverge significantly).

## Outputs
- `@font-face` rules or `next/font` configuration with explicit `font-display`.
- A `clamp()`-based fluid type scale and vertical-rhythm token set.
- A `tokens/typography.css` file following the primitive/semantic/component tier architecture.
- A structured audit report covering FOIT/FOUT/FOFT findings and font payload budget.

## Commonly sequenced with
- design-system-worker-bee: for the typeface/brand decision this Bee's technical implementation serves.
- ux-ui-svelte-worker-bee: for applying the resulting type tokens at the component level.
- seo-aeo-worker-bee: for the Core Web Vitals measurement loop once `font-display` and preload are set.
