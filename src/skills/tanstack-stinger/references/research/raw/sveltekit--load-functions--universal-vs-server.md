# SvelteKit load functions: universal vs server, fetch behavior, streaming

- URL: https://svelte.dev/docs/kit/load
- Fetched: 2026-08-14
- Source type: Official svelte.dev docs
- Component: SvelteKit / load functions (context for "when NOT to reach for TanStack Query")

## Content

### Two kinds of `load`, different guarantees

- **Universal** (`+page.js`/`+layout.js`): runs on the server during initial SSR, runs again during hydration reusing fetch responses, then runs only in the browser for subsequent client-side navigations. Useful for fetching from an external API without needing private credentials, or returning something unserializable (e.g. a component constructor).
- **Server** (`+page.server.js`/`+layout.server.js`): always runs server-side only. Convenient for direct DB/filesystem access or private env vars. If a route has both, the server `load` runs first and its return value becomes the universal load's `data` argument.

### The provided `fetch` is not plain `fetch`

SvelteKit's `load`-scoped `fetch`: can make credentialed requests server-side (inherits `cookie`/`authorization` headers from the original request), can make relative-URL requests server-side (plain server-side `fetch` requires an absolute URL), routes internal `+server.js` requests directly to the handler function without an actual HTTP round-trip when running server-side, and - critically - during SSR the response is captured and inlined into the rendered HTML, then read back out of the HTML during hydration instead of being re-fetched. This built-in dedup/inlining is a big part of why a hand-rolled TanStack Query prefetch setup can be redundant for data that's only ever needed once per page load with no client-side cache-sharing requirement.

### Streaming

A server `load` can return promises that stream to the browser as they resolve, letting the page start rendering before all data is ready - SvelteKit's own answer to "slow, non-essential data," a use case that might otherwise reach for a query library's loading states.

## Relevance to this skill's core question

This is the primary evidence behind "when NOT to use TanStack Query in SvelteKit": SvelteKit's own `load` + its specialized `fetch` already provide request deduplication (via SSR-to-hydration response inlining), credentialed/relative fetch handling, and streaming for slow data - a meaningful subset of what TanStack Query's caching layer exists to solve. The gap TanStack Query fills on top of this is: client-side cache **shared across multiple components/routes without prop-drilling**, background refetching/window-focus revalidation, mutation state management with rollback, and query invalidation as an explicit, addressable operation - none of which `load` provides on its own. See distilled research for the concrete decision table.
