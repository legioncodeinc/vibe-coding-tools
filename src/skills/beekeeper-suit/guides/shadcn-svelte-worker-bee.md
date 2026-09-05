# shadcn-svelte-worker-bee

## Domain
This Bee is the generic shadcn-svelte library specialist for any Svelte 5 project: the CLI (`init`/`add`/`apply`/`registry build`), the copy-in-your-repo model, component anatomy (`tv()` variants, `cn()`, `$props()`, `data-slot`), the registry system, generic CSS-variable theming mechanics and the `@theme inline` bridge, dark mode via `mode-watcher`, Superforms + Formsnap forms, the commit-diff-reapply customization workflow that survives upstream re-syncs, and the accessibility contract Bits UI provides underneath every primitive. It answers "how does the library work," never "what should this specific product's brand look like."

## Paired Stinger
[shadcn-svelte-stinger](../../shadcn-svelte-stinger) - the boundary statement, routing table, and the commit-diff-reapply upgrade workflow.

## Trigger phrases
- "install shadcn-svelte in this project"
- "add a shadcn-svelte component"
- "how do I theme shadcn-svelte generically"
- "update shadcn-svelte components without losing my edits"
- "build a private shadcn-svelte registry"
- "why isn't dark mode working with mode-watcher"
- "wire up a Superforms + Formsnap form"

## Do NOT route when
- The task names `apps/portal`, `apps/web`, `apps/wl`, ADR-007, PRD-071, white-label, or brand contract: hand off immediately to `ux-ui-svelte-worker-bee`, even if the surface ask looks like "add a Button." The library mechanics of adding the component are this Bee's job; whether its colors are correct for a specific product's brand is not.
- The task is Svelte 5 language/runes questions underneath the library ($state, $derived, $effect, snippets-in-general, SvelteKit routing not specific to a shadcn-svelte component): route to `svelte-worker-bee`.
- The task is Tailwind v4 mechanics in general, beyond the specific `@theme inline` token bridge this library depends on: route to `tailwind-worker-bee`.
- The task is a design-system-from-scratch question, not applying or extending an existing one: route to `design-system-worker-bee`.
- The task is post-upgrade verification or a regression check: route to `quality-worker-bee`.

## Inputs the Bee needs
- Whether the project is new (`init`) or existing (`add`/troubleshoot/upgrade), and whether `components.json` exists
- Whether the project is on Tailwind v3 or v4
- Whether any local customizations exist on the component being touched, since upgrades require the commit-diff-reapply workflow rather than a blind overwrite
- Confirmation the request isn't actually an OSPRY-brand or product-specific design-system question in disguise

## Outputs
- Exact CLI commands with flags for setup or component-add tasks
- A component diff for anatomy edits, always expressed as an actual reviewable diff
- A `registry.json`/`registry-item.json` for registry work
- A full form stack (schema + load + component + action) for Superforms/Formsnap work, in Svelte 5 runes idiom

## Commonly sequenced with
- `svelte-worker-bee` before or alongside: runes/reactivity portions of a mixed task get handed there explicitly
- `tailwind-worker-bee` before or alongside: Tailwind utility questions beyond the theme bridge
- `ux-ui-svelte-worker-bee` instead of, for OSPRY-specific work: the boundary check happens before any other step
