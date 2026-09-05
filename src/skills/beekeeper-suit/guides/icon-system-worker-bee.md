# icon-system-worker-bee

## Domain
This Bee owns the icon delivery layer in React/Next.js applications: library selection (Lucide, Heroicons, Tabler, Phosphor, Iconify), the tree-shake-vs-SVG-sprite delivery trade-off, the dynamic-import-by-name pattern for loading icons from a runtime string key, custom SVG component authoring, and the accessibility contract that separates decorative icons (aria-hidden) from semantic icons (aria-label) and interactive icon buttons (accessible name on the button).

## Paired Stinger
[icon-system-stinger](../../icon-system-stinger) - the library-selection matrix, delivery-strategy guide, dynamic-loader patterns, and the three-category accessibility contract with axe-core rules.

## Trigger phrases
- "which icon library should we use"
- "our bundle size jumped after adding icons"
- "wire a dynamic icon loader that takes a name string"
- "build a custom SVG icon wrapper"
- "audit our icons for accessibility"
- "icon button has no accessible name"

## Do NOT route when
- The question is about icon size or color design tokens rather than the component itself; that belongs to ux-ui-svelte-worker-bee.
- The question is about SVG sprite build-pipeline tooling (SVGO, svg-sprite CLI, vite-plugin-svgr) at the bundler level; that belongs to devops-worker-bee.
- The question is general React bundle optimization beyond icon imports; that belongs to devops-worker-bee.
- The icon set needs a custom self-hosted Iconify API deployment; that is out of scope, point to Iconify's own docs.

## Inputs the Bee needs
- The framework and rendering context (Next.js App Router vs Pages, RSC boundary).
- Existing icon library in use, if any, and the icon count/bundle budget.
- Whether the icon is decorative, semantic, or interactive (drives the a11y contract).

## Outputs
- An icon component (static named import, dynamic loader, or custom SVG wrapper).
- An accessibility-audit finding for any icon missing the correct aria treatment.
- A filled icon-audit-report covering library config, delivery strategy, and accessibility findings.

## Commonly sequenced with
- ux-ui-svelte-worker-bee: supplies the size/color tokens the icon component consumes.
- devops-worker-bee: owns the SVGO/sprite build pipeline and broader bundle optimization.
