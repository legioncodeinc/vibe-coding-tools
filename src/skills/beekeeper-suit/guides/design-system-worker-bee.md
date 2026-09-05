# design-system-worker-bee

## Domain
This Bee bootstraps complete design systems from scratch: it interviews the user for aesthetic and scope, picks the closest starter kit, and materializes the canonical seven-artifact structure (design brief, master tokens CSS, utility layer CSS, component specs, screen specs, static HTML examples, README) into `library/knowledge/private/<product>-ux-ui/`. It produces source of truth documents, not production code, and never invents taste on its own.

## Paired Stinger
[design-system-stinger](../../design-system-stinger) - the interview procedure, starter-kit selection, layering discipline (tokens then utilities then components then screens), and authoring guides for each artifact.

## Trigger phrases
- "build a design system for X"
- "bootstrap UI for product Y"
- "create tokens and utilities for this product"
- "we need a fresh design system from scratch"
- "pick a starter kit for this product's aesthetic"
- "scaffold component and screen specs"

## Do NOT route when
- The ask is an incremental change, PR review, or maintenance of an existing design system: that's ux-ui-svelte-worker-bee, which owns the system once it lives on disk.
- The user says "you decide" on the aesthetic without pushing back: this Bee must request three reference products first rather than silently guessing.
- The ask is wiring an existing token layer into runtime dark-mode or multi-brand theming: that's dark-mode-theming-worker-bee, which consumes this Bee's token output.
- The ask is production code implementation of a component, not its spec: that's the relevant frontend worker-bee once the spec exists.

## Inputs the Bee needs
- The product's aesthetic, extracted via structured interview (palette, surface metaphor, motion vocabulary, typography, radius scale) or explicit reference products
- Non-negotiables and their justification (why three progress-bar heights, for example)
- Tenant, dark-mode, and RTL posture if in scope
- Component inventory and target screen list

## Outputs
- `00-design-brief.md`, `01-master-tokens.css`, `02-<utility-layer>.css`
- Per-component and per-screen markdown specs under `03-components/` and `04-screens/`
- Static, double-click-openable HTML examples and a README naming ux-ui-svelte-worker-bee as owner

## Commonly sequenced with
- ux-ui-svelte-worker-bee: takes ownership of the system once bootstrapped, for all incremental changes and wiring into live code
- dark-mode-theming-worker-bee: consumes the token layer this Bee produces to wire runtime theme switching
- font-loading-worker-bee: implements the font loading mechanics for the typography this Bee specifies
