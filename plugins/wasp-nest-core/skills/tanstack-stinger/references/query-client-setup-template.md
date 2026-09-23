# TanStack Query client setup for SvelteKit (copy-paste)

Grounded in `research/distilled-tanstack.md` §2, `research/raw/tanstack--query--sveltekit-ssr-prefetching.md`.

## Root layout: disable queries on the server, keep prefetch working

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

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  let { data, children } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
  {@render children()}
</QueryClientProvider>
```

## Prefetch pattern (recommended default for anything beyond a single shallow query)

```ts
// src/routes/posts/+page.ts
export async function load({ parent, fetch }) {
  const { queryClient } = await parent();
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: async () => (await fetch('/api/posts')).json(),
  });
}
```

```svelte
<!-- src/routes/posts/+page.svelte -->
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  // cached by prefetchQuery, no client-side fetch happens
  const query = createQuery(() => ({
    queryKey: ['posts'],
    queryFn: async () => (await fetch('/api/posts')).json(),
  }));
</script>

{#if query.data}
  <!-- render -->
{/if}
```

Remember: `prefetchQuery` only works through **universal** `+page.ts`/`+layout.ts` load functions, not `+page.server.ts`/`+layout.server.ts`.

## Simple case: `initialData` from a `load`

```ts
// +page.server.ts (or +page.ts)
export async function load() {
  return { initialPosts: await getPostsFromDb() };
}
```

```svelte
<script lang="ts">
  let { data } = $props();
  import { createQuery } from '@tanstack/svelte-query';
  const query = createQuery(() => ({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialData: data.initialPosts,
  }));
</script>
```

Use this only for a single, shallow, one-off query - it doesn't scale to multiple consumers of the same query without re-threading `initialData` everywhere.
