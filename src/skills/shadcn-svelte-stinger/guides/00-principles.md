# Principles

## What shadcn-svelte actually is

shadcn-svelte is not a component library you `npm install` and import from `node_modules`. It's a copy-in system: the CLI writes real component source files directly into your repo. The project's own framing: "This is not a component library. It is how you build your component library" [research/raw/14-copy-in-philosophy-and-component-anatomy.md]. Five stated principles: Open Code, Composition, Distribution, Beautiful Defaults, AI-Ready [research/raw/14-copy-in-philosophy-and-component-anatomy.md].

Foundation: Bits UI (currently v2) provides the headless, WAI-ARIA-compliant primitives for most components; Melt UI inspired Bits UI's internal architecture and is used directly in some styles. Tailwind CSS v4 handles styling via CSS-first `@theme`/`@theme inline`. tailwind-variants composes variant classes; clsx + tailwind-merge (wrapped as `cn()`) merges them [research/distilled-shadcn-svelte.md sections 1-2].

## Boundary with ux-ui-svelte-stinger

Read this before doing anything else with this skill.

**This skill (shadcn-svelte-stinger) owns the shadcn-svelte library itself, generically, for any Svelte project adopting it:** the CLI (`init`/`add`/`apply`/`registry build`), the copy-in model and why it matters for upgrades, component anatomy (`$props()`, `tv()`, `cn()`, `data-slot`), the registry system (`registry.json`, `registry-item.json`, custom/private registries), the generic CSS-variable theming vocabulary and its `@theme inline` bridge into Tailwind v4, dark mode mechanics (`mode-watcher`), forms (Formsnap + Superforms + Zod), customization patterns that survive upstream re-syncs, accessibility inherited from Bits UI, and version/upgrade tracking.

**`ux-ui-svelte-stinger` owns applying a specific, already-decided design system on top of this library to specific product surfaces**: enforcement of ADR-007 on `apps/portal`, `apps/web`, `apps/wl`; the PRD-071 token bridge into `@theme`; the white-label `--brand-*` contract; the dark-first inversion (OSPRY is dark-first, shadcn-svelte defaults light-first); per-surface migration workflow; and PR review of shadcn-svelte usage in those three apps specifically.

Rule of thumb: if the question is "how does shadcn-svelte work" or "how do I use this library in any Svelte project," it's this skill. If the question is "does this component follow OSPRY's brand contract" or "is this PR compliant with ADR-007 on apps/portal," it's `ux-ui-svelte-stinger`. When in doubt, and the question touches `apps/portal`, `apps/web`, or `apps/wl` specifically, hand off to `ux-ui-svelte-stinger`.

## The core tradeoff, stated plainly

You own the diff. No black-box breaking changes from an opaque npm dependency landing in a semver-major bump; you can read every line of every component in your own repo. But also no automatic updates: nothing silently patches itself, and re-syncing with upstream is a manual, diff-driven exercise [research/distilled-shadcn-svelte.md section 5]. Every guide in this skill assumes you've accepted that tradeoff and is written to make the manual side of it less painful.

## First-move checklist

1. Identify what's actually being asked: install/setup ([guides/01-installation-and-cli.md](01-installation-and-cli.md)), reading/editing a copied-in component ([guides/02-component-anatomy.md](02-component-anatomy.md)), theming ([guides/03-theming-and-css-variables.md](03-theming-and-css-variables.md)), dark mode ([guides/04-dark-mode.md](04-dark-mode.md)), forms ([guides/05-forms-superforms-formsnap.md](05-forms-superforms-formsnap.md)), an upgrade/customization conflict ([guides/06-customizing-without-breaking-upgrades.md](06-customizing-without-breaking-upgrades.md)), or an accessibility/gap question ([guides/07-accessibility-and-gaps-vs-react.md](07-accessibility-and-gaps-vs-react.md)).
2. If the question mentions `apps/portal`, `apps/web`, `apps/wl`, OSPRY branding, white-label, or ADR-007 by name, stop and hand off to `ux-ui-svelte-stinger`. That is not a judgment call, it is a scope boundary.
3. Ground every factual claim in [references/](../references/) and [research/distilled-shadcn-svelte.md](../research/distilled-shadcn-svelte.md), never from memory. If a fact isn't in the archive, say so; don't guess.
4. Every code sample you write or review must be Svelte 5 runes idiom: `$props()`, `$bindable()`, `{@render ...}`, plain `onclick`-style props. Never Svelte 4 `export let`, never `on:click`.

## Severity framing for reviews

When reviewing a diff or a copied-in component for correctness against this skill's domain (not against OSPRY's design system):

- **Must-fix**: Svelte 4 syntax in a component meant to be Svelte 5-native; a `tailwind.config.js` reintroduced into a Tailwind v4 project; a hand-rolled dark-mode toggle that reads localStorage in `onMount` (guaranteed flash-of-wrong-theme, see [guides/04-dark-mode.md](04-dark-mode.md)); an `add --overwrite` run without a prior commit checkpoint.
- **Should-fix**: missing `data-slot` attribute on a hand-authored component meant to match upstream conventions; variant/type definitions left inside a `<script module>` block instead of split out (breaks `tsc --noEmit` for CI consumers, see [references/component-anatomy-example.md](../references/component-anatomy-example.md)).
- **Style/note**: base-color preset choice, icon library choice beyond the documented `@lucide/svelte` default.
