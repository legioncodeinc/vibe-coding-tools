# Data Layer: TanStack Query vs SWR vs Server Components

**Sources:**
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://www.pkgpulse.com/blog/tanstack-query-vs-swr-vs-apollo-2026
- WebSearch: "TanStack Query vs SWR 2026 comparison Server Components"
- Next.js docs on RSC data fetching

**Retrieved:** 2026-04-24

## Summary

2026 data fetching landscape splits roughly:

1. **Server-rendered frameworks (Next.js App Router, Remix):** Prefer server data fetching. Server Components fetch and stream; Route loaders fetch and pass data. Client-side cache libraries layer on top only when needed.
2. **Client-only (Vite SPA):** TanStack Query is the near-universal default. SWR for small apps where bundle size matters.

## Opinionated call

| Stack | Default data layer |
|---|---|
| Next.js 15 App Router | Server Components for reads; Server Actions or TanStack Query for mutations + client reads |
| Remix / React Router v7 (framework) | Route loaders + actions |
| Vite SPA | **TanStack Query** |
| Small Next.js dashboard | SWR acceptable |
| Anything GraphQL-heavy | urql or Apollo: TanStack Query can still wrap the client |

## Why TanStack Query over SWR (default)

- Full mutation lifecycle (`onMutate` / `onError` / `onSettled`) with rollback.
- DevTools are excellent.
- Larger community, more battle-tested, more plugins.
- Query invalidation by key pattern, not just by URL.
- Bundle cost (13.4KB gz vs 4.2KB gz) is justified by feature depth in any non-trivial app.

## The three-layer pattern (drawn from bulletproof-react)

```
/features/<feature>/api/get-foo.ts
  export async function getFoo(id: string): Promise<Foo> { ... Zod.parse(res) }
  export function useFoo(id: string) {
    return useQuery({ queryKey: ['foo', id], queryFn: () => getFoo(id) });
  }
```

Components consume hooks. Fetcher is exported separately so RSC, loaders, tests, or `queryClient.prefetchQuery` can call it.

## Relevance to this stinger

Spine of `guides/04-data-layer.md`. Also drives the ADR example for the RSC boundary in `examples/`.
