# Guide 2: TanStack Query client setup and SSR in SvelteKit

Grounded in `references/research/distilled-tanstack.md` §2, `references/query-client-setup-template.md`.

## When to walk this guide

Adding TanStack Query to a SvelteKit project for the first time, or debugging a query that keeps running server-side after the response was already sent.

## The core SSR problem

SvelteKit SSRs by default. An unguarded `createQuery` fires on the server and keeps executing asynchronously even after the HTML has shipped - wasted work, and a source of unhandled-rejection risk. Fix it at the `QueryClient` construction site, not per-query:

```ts
const queryClient = new QueryClient({
  defaultOptions: { queries: { enabled: browser, staleTime: 60 * 1000 } },
});
```

`enabled: browser` stops automatic execution server-side without touching `prefetchQuery`, which still works and is the mechanism for getting data into the cache before the client ever mounts.

## Choosing a prefetch pattern

Two supported patterns, not equally good defaults:

- **`initialData` via any `load`.** Lowest setup cost. Use only for a single, shallow, one-off query. Doesn't scale: same-query-in-multiple-places requires re-threading `initialData` to every call site, and there's no true fetch timestamp so staleness is based on page-load time.
- **`prefetchQuery` through a universal `load`, passing the whole `queryClient` down.** More setup (a `+layout.ts` at minimum), but scales correctly - server-loaded data reachable anywhere without prop-drilling, accurate cache metadata. **Must use `+page.ts`/`+layout.ts`, not the `.server.ts` variants** - `prefetchQuery` needs a `QueryClient` the browser can also construct, which a server-only load return value can't provide.

Default to `prefetchQuery` for anything beyond a genuinely trivial single-query page.

## The "wrap in a function" rule

Every `create*` function's options must be a function returning the options object, not the object directly:

```ts
// correct
const query = createQuery(() => ({ queryKey: ['posts'], queryFn: fetchPosts }));
// wrong - breaks reactivity to changing inputs
const query = createQuery({ queryKey: ['posts'], queryFn: fetchPosts });
```

This is the single most common source of "my query doesn't refetch when its inputs change" bugs when porting React Query instincts to Svelte.

## Devtools

Two valid install paths - pick one, don't install both:

```bash
npm i @tanstack/svelte-query-devtools   # standalone
# or
npm i @tanstack/svelte-devtools         # unified shell, hosts multiple TanStack devtools plugins
```

The unified shell's plugin API takes a `component` prop (a real Svelte component reference), not React's `render` (JSX) - a real adapter-shape difference to expect, not a bug.

## Common mistakes

- Passing a plain object instead of a function to `createQuery`/`createMutation`.
- Trying `prefetchQuery` from a `+page.server.ts` load function.
- Forgetting `enabled: browser` and wondering why server logs show duplicate/dangling query execution.
