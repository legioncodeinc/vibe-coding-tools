# Svelte 5 is alive (release announcement)
- URL: https://svelte.dev/blog/svelte-5-is-alive
- Fetched: 2026-08-14
- Source type: release notes / official blog
- Component: runes (rationale), migration

Author: The Svelte team, Oct 22 2024.

Note: the raw fetch interleaved unrelated Node.js `console` API-reference boilerplate into the scraped text mid-article (docs site widget artifact); stripped below.

After almost 18 months of development, comprising thousands of commits from dozens of contributors, Svelte 5 went stable. It is described as the most significant release in the project's history: a ground-up rewrite intended to make apps faster, smaller, and more reliable, with more consistent and idiomatic code and less to learn for newcomers. Despite the rewrite, Svelte 5 is "almost completely backwards-compatible" with Svelte 4, most users' initial upgrade (bumping `svelte` and `@sveltejs/vite-plugin-svelte` major versions in `package.json`) is described as "completely seamless."

## What changed, and why

Svelte historically changed less than other major frameworks between Svelte 3 (2019) and Svelte 5. Design-decision limitations that prompted the Svelte 5 rewrite:

- **Reactivity was compiler-driven and coarse-grained.** In Svelte 4, changing a single property of a reactive object invalidated the entire object, because that's all static compiler analysis could realistically do. Other frameworks had since adopted fine-grained signal-based reactivity, overtaking Svelte on performance.
- **Component composition was awkward.** Svelte 4 treated event handlers and "slotted content" as separate concepts distinct from props, a 2019-era bet that web components would become the primary distribution mechanism, which the team now calls "a mistake."
- **`$:` conflated two concepts.** Reactive statements were "a neat trick" but a footgun: they mixed derived state and side effects, and because dependencies were determined at compile time (not runtime), the construct resisted refactoring and became "a magnet for complexity."

Svelte 5 introduces runes as an explicit mechanism for declaring reactive state. Interacting with state is unchanged from the developer's point of view: with Svelte, `count` declared via `$state(0)` is just a number, not a function, not an object with a `.value` property, not something requiring a paired `setCount`. Runes can be used in `.svelte.js`/`.svelte.ts` modules in addition to `.svelte` components, enabling reusable reactive logic through a single mechanism.

Event handlers are now just props like any other prop, making it possible to (for example) detect whether a caller supplied a particular handler (useful for skipping expensive setup work) or to spread arbitrary handlers onto an element, both particularly valuable for library authors.

The `slot` mechanism (together with the "confusing" `let:` and `<svelte:fragment>` syntax) has been replaced with `{#snippet ...}`, described as "a much more powerful tool."

Other improvements: native TypeScript support (no more preprocessors), many bugfixes, and performance/scalability improvements across the board.

## How to upgrade

If starting from Svelte 3, migrate to Svelte 4 first. From there, bump `svelte` and `vite-plugin-svelte` to their newest majors. Component-level migration is not required immediately, apps continue working as-is (and faster), but the team recommends migrating incrementally. `npx sv migrate svelte-5` migrates an entire app; the Svelte VS Code extension's "Migrate Component to Svelte 5 Syntax" command migrates one component at a time.

The ecosystem (shadcn-svelte, Skeleton, Flowbite Svelte, etc.) does not need to upgrade to Svelte 5 first in order for an app to upgrade. Svelte 4 syntax support will eventually be phased out, but "not for a while," with advance warning promised.

## New CLI

Alongside Svelte 5, the team shipped a new CLI, `sv`.

## What's next (as of Oct 2024)

The team announced plans to release a new SvelteKit version taking advantage of Svelte 5 features (this materialized as SvelteKit 2's continued runes-aware releases; see the SvelteKit docs archived elsewhere in this collection). In the meantime, Svelte 5 already worked with SvelteKit, and `npx sv create` created new SvelteKit projects with Svelte 5 installed.
