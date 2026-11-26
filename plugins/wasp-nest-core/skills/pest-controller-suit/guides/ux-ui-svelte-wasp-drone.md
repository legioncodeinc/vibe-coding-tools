# ux-ui-svelte-wasp-drone

**Plugin owner:** `web-development-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
Owns the steady-state enforcement of a project's SvelteKit UI standard: shadcn-svelte 1.x on Bits UI v2 + Melt UI, Tailwind v4, the `@theme` token bridge into the project's design tokens, the brand or white-label contract, and the project's dark-mode polarity. OSPRY's ADR-007 is the worked example (`apps/portal`, `apps/web`, `apps/wl`, PRD-071 tokens, the `--brand-accent` → `--interactive` → `--primary` chain, the dark-first inversion). This is where Svelte-specific UX/UI design decisions for a project's apps live: which primitive to use, how a token bridges, whether a surface is on-brief.

## Paired Stinger
[ux-ui-svelte-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/ux-ui-svelte-stinger) - the token bridge (load-bearing), component anatomy, dark-mode inversion, white-label preservation, surface migration procedure, and the violations/guardrails catalog.

## Trigger phrases
- "add a Button to this app"
- "copy in this shadcn-svelte component"
- "convert this bespoke style to Tailwind"
- "does the white-label still work after this change"
- "is this component on-brief"
- "wire Phase 0 for this app"
- "migrate this surface to the copy-in primitive"

## Do NOT route when
- The surface is React, or one the project's UI decision record fences off. In OSPRY, ADR-007 fences off `apps/cms` (Payload chrome), `apps/cmp` (vendored cookieconsent) and `apps/edge/*` (no UI).
- The ask is bootstrapping a brand-new design system rather than enforcing the project's existing one: route to design-system-wasp-drone.
- The ask is general Svelte language/runes questions unrelated to project UI-standard enforcement ($state, $derived, $effect mechanics, SvelteKit routing not tied to a specific surface): route to svelte-wasp-drone.
- The ask is general Tailwind v4 mechanics (how `@theme` works as a mechanism, migration tooling) rather than the project's specific token values: route to tailwind-wasp-drone.
- The ask is shadcn-svelte library mechanics in a project with no UI standard to enforce, or CLI/registry/anatomy questions not tied to the project's UI decision record: route to shadcn-svelte-wasp-drone.

## Inputs the Drone needs
- Which app the surface lives in (OSPRY example: apps/portal, apps/web, or apps/wl) and whether Phase 0 (Tailwind v4 + token bridge + verification) is already complete there.
- The source-of-truth docs: the project's UI decision record, token file, brand contract, and the app's own `app.css` (OSPRY: ADR-007, `tokens.css`, `brand.css`, `app.css`).
- Whether the question is a new surface migration, a token-bridge question, a dark-mode question, or a PR review.

## Outputs
- A migrated surface using copy-in shadcn-svelte primitives with the dead `<style>` block removed.
- Token-bridge edits confined to `:root`/`.dark`, never touching `@theme inline` or `@layer base`.
- White-label preservation verification confirming the brand chain resolves with no new raw-CSS surface.
- PR review output citing the governing section of the project's UI decision record (OSPRY: ADR-007) and `path:line`, using the standard violation classes.

## Commonly sequenced with
- svelte-wasp-drone: for the underlying runes/component-logic correctness before applying project-specific styling.
- tailwind-wasp-drone: for general Tailwind v4 mechanics questions that surface mid-task.
- shadcn-svelte-wasp-drone: for library-mechanics questions (CLI, registry) that aren't project-design-system-specific.
- design-system-wasp-drone: when the task turns out to be a system-level redesign rather than enforcement of the existing one.
