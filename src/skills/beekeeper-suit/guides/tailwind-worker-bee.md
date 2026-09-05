# tailwind-worker-bee

## Domain
Owns Tailwind CSS v4 the framework itself, for any codebase: CSS-first configuration, `@theme` mechanics and namespace-to-utility generation, the full directive/function set (`@utility`, `@variant`, `@custom-variant`, `@apply`, `@reference`, `@source`), the `@tailwindcss/vite` plugin, v3-to-v4 migration, dark mode variants, container queries, arbitrary values, class ordering, and Oxide-engine performance. It explains how `@theme` works as a mechanism; it does not decide what any specific product's tokens should be.

## Paired Stinger
[tailwind-stinger](../../tailwind-stinger) - theme/token guide, the upgrade-tool-first migration procedure, Vite/SvelteKit setup, dark mode, container queries, class ordering, and anti-patterns/performance.

## Trigger phrases
- "migrate to Tailwind v4"
- "set up @theme"
- "wire up the Tailwind Vite plugin"
- "why isn't dark mode working after the v4 upgrade"
- "container query this component"
- "sort my Tailwind classes"
- "should this repeated arbitrary value be a token"

## Do NOT route when
- The ask is really Svelte component/runes architecture wearing a styling costume: route to svelte-worker-bee.
- The ask is shadcn-svelte component library specifics (Bits UI, Melt UI internals, copy-in component anatomy): route to shadcn-svelte-worker-bee.
- The ask is OSPRY's specific token values, brand contract, or apps/portal, apps/web, apps/wl enforcement per ADR-007: route to ux-ui-svelte-worker-bee immediately rather than answering from general Tailwind knowledge.
- The ask is cross-framework dark mode/theming strategy beyond Tailwind's own `@custom-variant` mechanics: route to dark-mode-theming-worker-bee for the pattern, keep this Bee for the Tailwind-specific implementation.
- The ask is bootstrapping a design system from scratch rather than bridging an existing one into Tailwind: route to design-system-worker-bee.

## Inputs the Bee needs
- Whether the project is on Tailwind v3 or v4, and the framework/build tool (Vite, SvelteKit, etc.).
- The specific surface: theme/tokens, migration, Vite setup, dark mode, container queries, class ordering, or anti-pattern review.
- Whether the question is about Tailwind mechanics or about a specific product's token values (the latter is out of scope).

## Outputs
- CSS-first `@theme` configuration or a token-extension/override/reset recommendation.
- A migration plan anchored on `npx @tailwindcss/upgrade`, plus the manual breaking-change follow-ups it doesn't catch.
- Vite/SvelteKit wiring, `@custom-variant dark` configuration, or container-query patterns.
- File:line-cited findings for anti-pattern or performance review, citing official Catalyst benchmarks.

## Commonly sequenced with
- svelte-worker-bee: when a styling task is entangled with component architecture.
- shadcn-svelte-worker-bee: when the theming question touches shadcn-svelte's token vocabulary.
- ux-ui-svelte-worker-bee: whenever the question turns out to be about OSPRY's actual token values or app-specific enforcement.
- quality-worker-bee: for post-migration or post-refactor verification.
