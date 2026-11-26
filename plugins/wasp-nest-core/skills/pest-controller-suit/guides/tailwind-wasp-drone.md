# tailwind-wasp-drone

**Plugin owner:** `web-development-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
Owns Tailwind CSS v4 the framework itself, for any codebase: CSS-first configuration, `@theme` mechanics and namespace-to-utility generation, the full directive/function set (`@utility`, `@variant`, `@custom-variant`, `@apply`, `@reference`, `@source`), the `@tailwindcss/vite` plugin, v3-to-v4 migration, dark mode variants, container queries, arbitrary values, class ordering, and Oxide-engine performance. It explains how `@theme` works as a mechanism; it does not decide what any specific product's tokens should be.

## Paired Stinger
[tailwind-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/tailwind-stinger) - theme/token guide, the upgrade-tool-first migration procedure, Vite/SvelteKit setup, dark mode, container queries, class ordering, and anti-patterns/performance.

## Trigger phrases
- "should this app use Tailwind and shadcn"
- "migrate to Tailwind v4"
- "set up @theme"
- "wire up the Tailwind Vite plugin"
- "why isn't dark mode working after the v4 upgrade"
- "container query this component"
- "sort my Tailwind classes"
- "should this repeated arbitrary value be a token"

## Do NOT route when
- The ask is really Svelte component/runes architecture wearing a styling costume: route to svelte-wasp-drone.
- The ask is shadcn-svelte component library specifics (Bits UI, Melt UI internals, copy-in component anatomy): route to shadcn-svelte-wasp-drone.
- The ask is a project's specific token values, brand contract, or product-surface enforcement (OSPRY's apps/portal, apps/web, apps/wl under ADR-007 is the worked example): route to ux-ui-svelte-wasp-drone immediately rather than answering from general Tailwind knowledge.
- The ask is cross-framework dark mode/theming strategy beyond Tailwind's own `@custom-variant` mechanics: route to dark-mode-theming-wasp-drone for the pattern, keep this Drone for the Tailwind-specific implementation.
- The ask is bootstrapping a design system from scratch rather than bridging an existing one into Tailwind: route to design-system-wasp-drone.

## Inputs the Drone needs
- Whether the project is on Tailwind v3 or v4, and the framework/build tool (Vite, SvelteKit, etc.).
- The specific surface: theme/tokens, migration, Vite setup, dark mode, container queries, class ordering, or anti-pattern review.
- Whether the question is about Tailwind mechanics or about a specific product's token values (the latter is out of scope).

## Outputs
- CSS-first `@theme` configuration or a token-extension/override/reset recommendation.
- A migration plan anchored on `npx @tailwindcss/upgrade`, plus the manual breaking-change follow-ups it doesn't catch.
- Vite/SvelteKit wiring, `@custom-variant dark` configuration, or container-query patterns.
- File:line-cited findings for anti-pattern or performance review, citing official Catalyst benchmarks.

## Commonly sequenced with
- svelte-wasp-drone: when a styling task is entangled with component architecture.
- shadcn-svelte-wasp-drone: when the theming question touches shadcn-svelte's token vocabulary.
- ux-ui-svelte-wasp-drone: whenever the question turns out to be about a project's actual token values or app-specific enforcement (OSPRY's, for example).
- quality-wasp-drone: for post-migration or post-refactor verification.

## Component fit intake
Use the paired skill's guide 08 and fit worksheet for O071. Match Svelte/React component variants, record scan and theme contracts, and route actual UI implementation through Impeccable. Verify selected owners; verify `vue-stinger`, `nuxt-stinger` and `nextjs-stinger` are selected for Vue, Nuxt and Next.js work and flag any that are not. Source qualification does not establish a running app or accessibility pass.
