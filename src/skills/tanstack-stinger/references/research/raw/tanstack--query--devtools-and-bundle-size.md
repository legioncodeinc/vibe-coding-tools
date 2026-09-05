# TanStack Query Svelte devtools, and cross-framework bundle size / philosophy

- URL: https://tanstack.com/query/latest/docs/framework/svelte/devtools ; https://tanstack.com/devtools/latest/docs/framework/svelte/basic-setup ; https://github.com/TanStack/query/discussions/5319 ; https://tanstack.com/blog/announcing-tanstack-query-v5
- Fetched: 2026-08-14
- Source type: Official TanStack docs + official GitHub discussion (bundle size, maintainer-answered) + official TanStack blog
- Component: TanStack Query / Devtools, bundle size

## Content

### Devtools install (two documented paths - legacy standalone and new unified devtools shell)

**Legacy/standalone path** (`@tanstack/svelte-query-devtools`):
```bash
npm i @tanstack/svelte-query-devtools
```
```svelte
<script>
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
</script>
<QueryClientProvider client={queryClient}>
  <!-- app -->
  <SvelteQueryDevtools />
</QueryClientProvider>
```

**Unified TanStack Devtools shell** (`@tanstack/svelte-devtools`, newer, plugin-based - hosts Query devtools plus any other TanStack devtools plugin in one panel):
```bash
npm i @tanstack/svelte-devtools
```
```svelte
<script lang="ts">
  import { TanStackDevtools } from '@tanstack/svelte-devtools';
  import type { TanStackDevtoolsSveltePlugin } from '@tanstack/svelte-devtools';
  import { SvelteQueryDevtoolsPanel } from '@tanstack/svelte-query-devtools';

  const plugins: TanStackDevtoolsSveltePlugin[] = [
    { name: 'Svelte Query', component: SvelteQueryDevtoolsPanel },
  ];
</script>
<TanStackDevtools {plugins} />
```
Note the Svelte adapter's plugin API uses `component` (a Svelte component reference), not `render` (a JSX element) as the React adapter's plugin API does - a real, documented API-shape divergence between adapters, not an oversight.

### Bundle size (framework-agnostic core, applies equally to the Svelte adapter since both wrap `@tanstack/query-core`)

From an official maintainer response in the TanStack/query GitHub discussions: importing `useQuery` (Svelte: `createQuery`) always drags in `QueryClient`, because a `QueryClient` instance is required to construct the provider - and `QueryClient` is a class, which cannot be tree-shaken. Baseline cost cited: **~10.44 KB gzipped** for `useQuery, QueryClient, QueryClientProvider, useQueryClient` together - described as "likely the bare minimum" for any app using the library at all. v5 (and the Svelte v6 adapter, which sits on v5's core) dropped roughly 10% bundle size versus v4 by dropping legacy-browser support and using modern minification-friendly JS features (private class fields).

### What problem the library is actually solving (official framing, informs "when NOT to use it" judgment calls)

TanStack's own marketing copy for Query frames it as "the server-state standard for modern frontend apps" - giving async data "a cache, a lifecycle, and declarative APIs for fetching, sharing, refetching, mutating, and observing server state." Explicitly named default behaviors: caching, request deduplication, retries, background refetching, window-focus revalidation, garbage collection of unused cache entries, and explicit optimistic-UI/invalidation/reconciliation primitives for writes. This is useful framing for deciding when TanStack Query earns its bundle cost versus when SvelteKit's own `load`/remote-function primitives (see `sveltekit--load-functions` and `sveltekit--remote-functions` raw files) already cover the need without it.
