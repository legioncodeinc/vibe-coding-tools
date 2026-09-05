# ux-ui-svelte-worker-bee

## Domain
Owns the steady-state enforcement of the OSPRY SvelteKit UI standard (ADR-007) across `apps/portal`, `apps/web`, and `apps/wl`: shadcn-svelte 1.x on Bits UI v2 + Melt UI, Tailwind v4, the `@theme` token bridge into PRD-071 design tokens, the white-label brand contract (`--brand-accent` → `--interactive` → `--primary`), and the dark-first inversion. This is where Svelte-specific UX/UI design decisions for those three apps live: which primitive to use, how a token bridges, whether a surface is on-brief.

## Paired Stinger
[ux-ui-svelte-stinger](../../ux-ui-svelte-stinger) - the token bridge (load-bearing), component anatomy, dark-mode inversion, white-label preservation, surface migration procedure, and the violations/guardrails catalog.

## Trigger phrases
- "add a Button to apps/portal"
- "copy in this shadcn-svelte component for apps/web"
- "convert this bespoke style to Tailwind on apps/wl"
- "does the white-label still work after this change"
- "is this component on-brief"
- "wire Phase 0 for this app"
- "migrate this surface to the copy-in primitive"

## Do NOT route when
- The surface is React, `apps/cms` (Payload chrome), `apps/cmp` (vendored cookieconsent), or `apps/edge/*` (no UI): all explicitly fenced off by ADR-007, do not invoke.
- The ask is bootstrapping a brand-new design system rather than enforcing the existing OSPRY one: route to design-system-worker-bee.
- The ask is general Svelte language/runes questions unrelated to OSPRY enforcement ($state, $derived, $effect mechanics, SvelteKit routing not tied to a specific surface): route to svelte-worker-bee.
- The ask is general Tailwind v4 mechanics (how `@theme` works as a mechanism, migration tooling) rather than OSPRY's specific token values: route to tailwind-worker-bee.
- The ask is shadcn-svelte library mechanics in a project that is not one of the three OSPRY apps, or CLI/registry/anatomy questions not tied to ADR-007: route to shadcn-svelte-worker-bee.

## Inputs the Bee needs
- Which app the surface lives in (apps/portal, apps/web, or apps/wl) and whether Phase 0 (Tailwind v4 + token bridge + verification) is already complete there.
- The source-of-truth docs: ADR-007, `tokens.css`, `brand.css`, and the app's own `app.css`.
- Whether the question is a new surface migration, a token-bridge question, a dark-mode question, or a PR review.

## Outputs
- A migrated surface using copy-in shadcn-svelte primitives with the dead `<style>` block removed.
- Token-bridge edits confined to `:root`/`.dark`, never touching `@theme inline` or `@layer base`.
- White-label preservation verification confirming the brand chain resolves with no new raw-CSS surface.
- PR review output citing the governing ADR-007 section and `path:line`, using the standard violation classes.

## Commonly sequenced with
- svelte-worker-bee: for the underlying runes/component-logic correctness before applying OSPRY-specific styling.
- tailwind-worker-bee: for general Tailwind v4 mechanics questions that surface mid-task.
- shadcn-svelte-worker-bee: for library-mechanics questions (CLI, registry) that aren't OSPRY-specific.
- design-system-worker-bee: when the task turns out to be a system-level redesign rather than enforcement of the existing one.
