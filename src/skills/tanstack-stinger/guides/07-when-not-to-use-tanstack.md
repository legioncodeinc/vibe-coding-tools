# Guide 7: When NOT to use TanStack in SvelteKit

Grounded in `references/research/distilled-tanstack.md` §5, `references/research/raw/sveltekit--load-functions--universal-vs-server.md`, `references/research/raw/sveltekit--remote-functions--query-form-command.md`.

## When to walk this guide

Before adding TanStack Query (or, less commonly, Form) to a SvelteKit project - check whether SvelteKit's own primitives already solve the actual problem.

## What SvelteKit already gives you for free

| Need | Native SvelteKit answer | What it covers |
|---|---|---|
| Fetch data for a route, SSR'd | `load` (`+page.js`/`+page.server.js`) | Server/universal split, credentialed + relative fetch, automatic SSR-to-hydration response inlining (no re-fetch on hydration), response streaming for slow data |
| Read dynamic data anywhere, deduped | `query` remote function | Server-side request-scoped dedup + client-side instance dedup (`getPosts() === getPosts()`), usable directly in markup via `await` |
| Real-time/self-updating data | `query.live` | Async-iterable-backed, auto-manages connection lifecycle, no manual refresh |
| Write data with pending/error state | `form` remote function, or actions + `use:enhance` | Zero-JS-capable progressive enhancement, Standard Schema validation, programmatic submit |

None of this requires an extra dependency or bundle cost. SvelteKit's own team is actively investing in this exact space (recent releases added programmatic `submit()` and passed the form instance into `enhance`).

## What TanStack Query adds that SvelteKit's natives don't

- A client-side cache that persists and is **shared across navigations and unrelated components**, with configurable staleness/GC - `load`/`query` dedup is scoped to a request or a component instance, not a long-lived cross-page cache.
- Background refetching on an interval or window-focus.
- An addressable, explicit `invalidateQueries`-style operation, decoupled from any one call site.
- Mutation state (`isPending`, rollback context, cross-component visibility via `useMutationState`) as a reusable, first-class primitive.

## The decision rule this skill enforces

Default to `load` + remote functions for typical page data and typical mutations. Reach for TanStack Query specifically when:
- Multiple, unrelated components need to independently subscribe to the same server data and stay in sync.
- The app needs background revalidation (interval or window-focus) that `load`'s per-navigation model doesn't provide.
- Mutation state needs to be visible/actionable from components that didn't trigger the mutation.
- The data-fetching surface is dense enough (a dashboard with many independent panels, for example) that hand-rolling equivalent caching in remote functions would mean re-implementing what Query already does well.

Do not add TanStack Query to a project by default just because the stack "does TanStack." Every added library is added bundle weight and a second data-fetching mental model layered on top of a first-party one that's actively maintained and already covers a meaningful chunk of the problem.

## Common mistakes

- Reaching for TanStack Query for a page that fetches once per navigation and doesn't need cross-component sharing - `load` alone was sufficient.
- Building a mutation with TanStack Query for a form that would have worked fine, with better zero-JS resilience, as a native `form` remote function.
- Not considering `query.live` for a "needs periodic refresh" requirement before reaching for Query's interval-refetch config - the native option may be simpler for genuinely real-time needs.
