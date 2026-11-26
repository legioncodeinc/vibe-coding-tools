# svelte-wasp-drone

**Plugin owner:** `web-development-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
Owns the Svelte 5 language and SvelteKit 2 runtime layer for any Svelte codebase: runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`, `$host`, `$inspect`), snippets and event attributes, component lifecycle, universal reactivity in `.svelte.js`/`.svelte.ts`, Svelte 4-to-5 migration, and SvelteKit 2 mechanics (load functions, form actions, remote functions, error boundaries). It is the language specialist, not a UI-application specialist: it rules on whether the code rendering a button is idiomatic Svelte 5, not on what that button looks like or which design system it belongs to.

## Paired Stinger
[svelte-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/svelte-stinger) - runes fundamentals, migration cheatsheet, snippets/events, lifecycle, universal reactivity, and SvelteKit 2 integration patterns.

## Trigger phrases
- "migrate this component to Svelte 5 runes"
- "should this be $derived or $effect"
- "why is $effect looping"
- "review this SvelteKit load function"
- "what's the difference between a snippet and a slot"
- "set up a SvelteKit remote function"
- "this component still uses on:click, is that a problem"

## Do NOT route when
- The ask is Tailwind CSS utility, config, or token-bridge work: route to tailwind-wasp-drone.
- The ask is shadcn-svelte component library internals (Bits UI, Melt UI, copy-in component anatomy): route to shadcn-svelte-wasp-drone.
- The ask is applying a project's design system or white-label brand contract to product surfaces (OSPRY's ADR-007 on apps/portal, apps/web, apps/wl is the worked example): route to ux-ui-svelte-wasp-drone.
- The task is mixed (e.g. "migrate to runes AND restyle with shadcn-svelte"): do the runes/reactivity portion here and hand the styling portion off explicitly rather than guessing.
- The ask is a from-scratch meta-framework choice (SvelteKit vs. something else), not a review or migration of existing Svelte/SvelteKit code.

## Inputs the Drone needs
- The `svelte` version pinned in `package.json` and whether the target file already uses runes or legacy syntax.
- Whether the task is a review/PR pass, a migration, or new component authorship.
- The specific SvelteKit surface in play if relevant (load function, form action, remote function, boundary).

## Outputs
- File:line-cited review findings classified must-fix / should-refactor / style.
- Migrated or newly authored runes-idiom Svelte 5 code.
- Explicit handoff notes when a finding is really a Tailwind, shadcn-svelte, or project design-system concern.

## Commonly sequenced with
- tailwind-wasp-drone: for the styling half of a mixed component task.
- shadcn-svelte-wasp-drone: when a component under review is a copy-in shadcn-svelte primitive.
- ux-ui-svelte-wasp-drone: when the surface has a project UI standard (OSPRY's apps/portal, apps/web, apps/wl under ADR-007 is the worked example) that applies on top of the runes review.
- quality-wasp-drone: for post-migration verification.

For accessible forms and robust validation, load the paired Svelte skill's [guide 08](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/svelte-stinger/guides/08-accessible-forms-and-validation.md) and contract worksheet. Preserve installed-version checks, server authorization, pending/error state and explicit compiler/browser/manual accessibility proof gaps.
