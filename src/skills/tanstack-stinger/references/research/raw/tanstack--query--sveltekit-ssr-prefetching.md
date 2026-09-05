# TanStack Query + SvelteKit SSR: disabling on server, initialData vs prefetchQuery

- URL: https://tanstack.com/query/v5/docs/framework/svelte/ssr ; https://github.com/TanStack/query/blob/main/examples/svelte/ssr/src/routes/%2Bpage.ts ; https://github.com/TanStack/query/blob/main/examples/svelte/ssr/src/routes/%2Blayout.ts
- Fetched: 2026-08-14
- Source type: Official TanStack docs + official TanStack/query example repo source
- Component: TanStack Query / SvelteKit SSR

## Content

### The problem this guide solves

SvelteKit SSRs routes by default. Without intervention, a `createQuery` call fires on the server AND continues executing asynchronously even after the HTML response has already been sent - wasted work at best, a dangling promise / unhandled rejection risk at worst.

### Fix: disable queries on the server via the `browser` check

```ts
// src/routes/+layout.ts
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 60 * 1000,
      },
    },
  });
  return { queryClient };
};
```

Setting `enabled: browser` disables automatic query execution on the server while explicitly NOT disabling `queryClient.prefetchQuery()` - prefetching still works, only the automatic fetch-on-mount behavior is server-disabled.

### Two supported prefetching patterns

**Pattern A - `initialData` via SvelteKit `load`.** Pass server-loaded data into `createQuery`'s `initialData` option.
- Pros: minimal setup, works with both `+page.ts`/`+layout.ts` (universal) AND `+page.server.ts`/`+layout.server.ts` (server-only) load functions.
- Cons: if `createQuery` is called deeper in the component tree, `initialData` must be threaded down to that point; if the same query is called in multiple places, `initialData` must be passed to all of them; no way to know the true fetch timestamp, so `dataUpdatedAt`/staleness is based on page-load time instead of actual fetch time.

**Pattern B - `prefetchQuery` (recommended, more setup).** Fetch and populate the query cache server-side, pass the whole `queryClient` through `load`, before the QueryClientProvider renders.
```ts
// src/routes/+page.ts
export async function load({ parent, fetch }) {
  const { queryClient } = await parent();
  // must use SvelteKit's own fetch here, not global fetch
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: async () => (await fetch('/api/posts')).json(),
  });
}
```
```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  // cached by prefetchQuery in +page.ts, no fetch happens here
  const query = createQuery(() => ({
    queryKey: ['posts'],
    queryFn: async () => (await fetch('/api/posts')).json(),
  }));
</script>
```
- Pros: server-loaded data accessible anywhere without prop-drilling; no client-side initial fetch since the cache retains full metadata including true `dataUpdatedAt`.
- Cons: requires more files for initial setup; **will not work with `+page.server.ts`/`+layout.server.ts` load functions** - must use universal (`+page.ts`/`+layout.ts`) load functions, because the data needs to flow through a `QueryClient` instance that the browser can also construct, not a server-only return value. The docs note this is fine anyway since "APIs which are used with TanStack Query need to be fully exposed to the browser" regardless.

### Which pattern to default to

Prefer Pattern B (`prefetchQuery`) for anything beyond a single, shallow, one-off query - it's the pattern that scales to multiple consumers of the same query and preserves accurate cache metadata. Reserve Pattern A (`initialData`) for a genuinely simple, single-consumer case where the extra `+layout.ts` plumbing isn't worth it.
