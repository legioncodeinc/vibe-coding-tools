# TanStack Query Svelte adapter: overview, install, Svelte 5 runes migration (v6)

- URL: https://tanstack.com/query/latest/docs/framework/svelte/overview ; https://tanstack.com/query/latest/docs/framework/svelte/migrate-from-v5-to-v6 ; https://www.npmjs.com/package/@tanstack/svelte-query
- Fetched: 2026-08-14
- Source type: Official TanStack docs + npm registry package page
- Component: TanStack Query / Svelte adapter

## Content

### Status: officially supported, first-class

`@tanstack/svelte-query` is described in TanStack's own docs as offering "a 1st-class API for using TanStack Query via Svelte." This is a real, maintained, official adapter - not a community port. Latest published version at fetch time: 6.1.25 (Apr 28, 2026), MIT license, ~101.5K weekly downloads, 27 dependents.

### Svelte 5 requirement (hard cutover in v6)

Peer dependency: `svelte: ^5.25.0`. The v6 adapter **fully migrated to Svelte 5 runes syntax** (signals-based reactivity), dropping the old stores-based approach. Direct quote from the official migration doc: "While Svelte v5 has legacy compatibility with the stores syntax from Svelte v3/v4, it has been somewhat buggy and unreliable for this adapter. The `@tanstack/svelte-query` v6 adapter fully migrates to the runes syntax... This rewrite should also simplify the code required to ensure your query inputs remain reactive [you don't even need a `$derived`]." Minimum Svelte version for v6: **5.25.0 or newer**, verified explicitly in the docs.

Runes mode can be forced per-component (`<svelte:options runes={true} />`) for gradual migration, or project-wide via `svelte.config.js`:
```js
compilerOptions: { runes: true }
``` - only recommended once stores syntax is fully eradicated from the app.

### Install and basic setup

```bash
npm i @tanstack/svelte-query
```

```svelte
<script>
  import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
  import Example from './lib/Example.svelte';
  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <Example />
</QueryClientProvider>
```

### Available functions

`createQuery`, `createQueries`, `createInfiniteQuery`, `createMutation`, `useQueryClient`, `useIsFetching`, `useIsMutating`, `useMutationState`, `useIsRestoring`, `useHydrate`.

### Key API difference vs React Query

Arguments to the `create*` functions **must be wrapped in a function** to preserve reactivity - e.g. `createQuery(() => ({ queryKey: [...], queryFn: ... }))` rather than passing the options object directly. This is the single most important divergence from the React API shape and the most common source of "my query isn't reactive to changing inputs" bugs when porting React Query knowledge to Svelte.

### Dependency note

`@tanstack/svelte-query` v6 depends on `@tanstack/query-core` v5 - the core caching engine is version-independent of the per-framework adapter version number, which can be confusing when comparing version numbers across the React and Svelte adapters.
