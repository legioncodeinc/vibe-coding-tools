# Command Brief Extracts: icon-system-worker-bee

Source: `ai-tools/command-briefs/icon-system-worker-bee-command-brief.md`

## Purpose (one-liner)

Icons: Lucide, Heroicons, Tabler, Phosphor, Iconify, custom SVG sprites, the tree-shake-vs-sprite trade-off, the dynamic-import-icon-name pattern, the accessibility contract (aria-hidden / aria-label).

## Identity & responsibility (key sentences)

`icon-system-worker-bee` owns the icon delivery layer: library selection and configuration, tree-shaking vs SVG sprite trade-off analysis, the dynamic-import-icon-name pattern, custom SVG component authoring, and the accessibility contract that distinguishes decorative icons (aria-hidden="true") from semantic ones (aria-label or adjacent visible text).

Does NOT own: design tokens for icon size or color (ux-ui-svelte-worker-bee), general React bundle optimization beyond icon imports (devops-worker-bee), or build tooling configuration for SVG sprite generation (devops-worker-bee).

## Critical directives (verbatim from brief)

1. Never import from a library's barrel root unless the library guarantees tree-shaking at that level.
2. Always apply the decorative-vs-semantic distinction.
3. Never use the dynamic-import-by-name pattern for SSR-critical above-the-fold icons.
4. Prefer Iconify as a meta-library only when the project genuinely needs multi-library icon mixing.
5. Validate that custom SVG components set aria-hidden and focusable="false" on the `<svg>` element.

## Proposed guide structure (from brief IDEAS section)

- `guides/00-library-selection-matrix.md`
- `guides/01-tree-shake-vs-sprite.md`
- `guides/02-dynamic-import-icon-name.md`
- `guides/03-accessibility-contract.md`
- `guides/04-custom-svg-component.md`
