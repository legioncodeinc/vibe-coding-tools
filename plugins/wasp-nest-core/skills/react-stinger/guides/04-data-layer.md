# 04: Data Layer

Sources: `research/2026-04-24-bulletproof-react-api-layer.md`, `research/2026-04-24-data-layer-tanstack-query-vs-rsc.md`.

## Picking the data strategy

Before writing a fetch, ask:

1. **Are we in an RSC-capable framework (Next.js App Router, Remix)?**
   - **Yes:** fetch on the server by default. Use Server Components for reads; Server Actions for mutations. Add TanStack Query *only* for interactive client data that isn't a simple read.
   - **No (Vite SPA, React Router v7 library mode):** TanStack Query is the default.

2. **Is the framework a full-stack framework with loaders (Remix, React Router v7 framework)?**
   - Use **route loaders** for the initial data of a route. Add TanStack Query for subsequent in-route fetches.

3. **GraphQL-heavy?**
   - Use urql or Apollo Client. TanStack Query still wraps mutations / derived state.

## The 3-part request declaration

Every request (in any of the strategies above) is declared in three parts, colocated:

```ts
// src/features/discussions/api/get-discussions.ts
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const DiscussionSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
});
export type Discussion = z.infer<typeof DiscussionSchema>;

// 1 — fetcher
export async function getDiscussions(): Promise<Discussion[]> {
  const res = await api.get('/discussions');
  return z.array(DiscussionSchema).parse(res.data);
}

// 2 — hook
export function useDiscussions() {
  return useQuery({ queryKey: ['discussions'], queryFn: getDiscussions });
}
```

Three parts:

1. **Types + Zod schema**: the contract.
2. **Fetcher**: uses the single shared `api` client. Can be called from RSC, route loaders, prefetch, tests.
3. **Hook**: the component-facing API. Wraps the fetcher in `useQuery` / `useMutation`.

Source: `research/2026-04-24-bulletproof-react-api-layer.md`.

## The API client

One shared instance in `src/lib/api-client.ts`:

- Pre-configured base URL, headers, auth.
- Response interceptor: auth refresh on 401, toast on 5xx, error logging.
- Returns a normalized error object.

Never construct fetch calls elsewhere.

## Mutations with optimistic updates

TanStack Query:

```ts
const createDiscussion = useMutation({
  mutationFn: postDiscussion,
  onMutate: async (newDiscussion) => {
    await queryClient.cancelQueries({ queryKey: ['discussions'] });
    const previous = queryClient.getQueryData<Discussion[]>(['discussions']);
    queryClient.setQueryData(['discussions'], (old) => [...(old ?? []), optimistic(newDiscussion)]);
    return { previous };
  },
  onError: (_err, _vars, ctx) => {
    queryClient.setQueryData(['discussions'], ctx?.previous);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['discussions'] }),
});
```

React 19 + Server Actions: use `useOptimistic` instead. See `guides/10-react-19-idioms.md §useOptimistic`.

## Server Component reads

```tsx
// app/discussions/page.tsx — RSC
export default async function Page() {
  const discussions = await getDiscussions(); // same fetcher, called on server
  return <DiscussionList initial={discussions} />;
}
```

To hydrate TanStack Query from an RSC:

```tsx
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';

const qc = new QueryClient();
await qc.prefetchQuery({ queryKey: ['discussions'], queryFn: getDiscussions });
return (
  <HydrationBoundary state={dehydrate(qc)}>
    <DiscussionListClient />
  </HydrationBoundary>
);
```

## Common findings

> **[Must-fix]** `src/features/posts/PostCard.tsx:12`: `fetch('/api/author/' + authorId)` inside a leaf component. Creates N+1 waterfall and un-cached requests. Lift to parent hook or RSC. See `guides/04-data-layer.md §the-3-part-request-declaration`.

> **[Must-fix]** `src/hooks/usePosts.ts:1`: fetches with raw `fetch`; response typed as `Post[]` without parsing. Parse with Zod at the boundary. See `guides/09-typescript-patterns.md §zod-at-boundary`.

> **[Should-refactor]** `src/stores/posts-store.ts:5`: posts cache maintained in Zustand manually. Migrate to TanStack Query. See `guides/03-state-management.md §layer-3`.

## Example in action

See `examples/adr-example-server-components-boundary.md` for a complete RSC-vs-client-data decision.
