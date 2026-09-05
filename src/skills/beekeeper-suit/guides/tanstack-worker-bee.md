# tanstack-worker-bee

## Domain
Owns which TanStack libraries actually work in a Svelte 5 SvelteKit app and how to use them correctly: TanStack Query (`@tanstack/svelte-query` - SSR-safe setup, prefetching in load functions, mutations, invalidation), TanStack Table (`@tanstack/svelte-table` v9 - runes-native state, opt-in feature registration), TanStack Form (`@tanstack/svelte-form` - snippet-based validation), and TanStack Virtual. It equally owns the negative space: TanStack Router and TanStack Start have no official Svelte support, and it states that plainly rather than reaching for the unofficial, self-described-experimental third-party adapter.

## Paired Stinger
[tanstack-stinger](../../tanstack-stinger) - the Svelte 5 support matrix, Query SSR/caching/mutation guides, Table feature registration, Form validation, virtualization, and the bundle-budget checklist.

## Trigger phrases
- "add TanStack Query"
- "set up svelte-query"
- "build a data table"
- "TanStack Form validation"
- "virtualize this list"
- "should I use TanStack Router"
- "do I actually need TanStack Query here or can load handle it"

## Do NOT route when
- The ask is the SvelteKit route/component markup itself, not the data-fetching or table wiring: route to ux-ui-svelte-worker-bee.
- The ask is Vercel deployment or caching configuration, even if it interacts with a Query prefetch pattern: route to vercel-worker-bee (this Bee only flags the interaction).
- The ask is the underlying database schema behind a query function or table's row data: route to db-worker-bee.
- The user wants TanStack Router or TanStack Start built out despite no official Svelte support: restate the fact plainly rather than inventing a workaround; if they proceed anyway, flag the unofficial adapter as explicitly experimental.

## Inputs the Bee needs
- Confirmation the project is Svelte 5 SvelteKit (this Bee's supported target); other frameworks get reduced coverage.
- Whether SvelteKit's own `load` functions or remote functions already solve the problem before reaching for TanStack Query.
- The specific library in play (Query, Table, Form, Virtual) and, for Query, whether the prefetch runs through a universal or server-only `load`.

## Outputs
- A recommendation on whether TanStack Query is warranted versus native SvelteKit `load`/remote functions.
- SSR-safe Query client setup, mutation/invalidation strategy, or a runes-native Table configuration.
- A Form validation setup choosing between TanStack Form and SvelteKit's native `form` remote function.
- An explicit "no official Svelte support" statement for Router/Start requests.

## Commonly sequenced with
- ux-ui-svelte-worker-bee: for the surrounding route/component markup the table or form renders into.
- vercel-worker-bee: when a Query prefetch pattern interacts with Vercel's ISR/Cache-Control behavior.
- db-worker-bee: for the data source behind a query function or table's row data.
