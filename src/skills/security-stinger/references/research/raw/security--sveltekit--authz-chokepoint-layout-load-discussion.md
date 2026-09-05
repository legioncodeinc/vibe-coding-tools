# Attack vector arising from naive developer use of the `+layout.server.js` tree - sveltejs/kit#6315

- URL: https://github.com/sveltejs/kit/issues/6315
- Fetched: 2026-08-14
- Source type: official framework issue tracker (long-running maintainer/community design discussion, open since 2022, still active into 2026)
- Component: SvelteKit authorization architecture (`+layout.server.ts` vs `+page.server.ts` vs `hooks.server.ts`)

## The vulnerability pattern

- A developer places authorization logic in `+layout.server.js` (e.g. `launch-codes/+layout.server.js`), assuming it always runs before any descendant page renders, and puts data-fetching in the sibling `+page.server.js`.
- SvelteKit's client-side router decides what to actually re-fetch on navigation. If the layout's data is already cached client-side and nothing invalidates it, navigating to a new page under that layout (e.g. `/launch-codes?page=2`) does NOT re-run the layout's `load` function - only the page's `load` runs.
- Reproduction: sign in, load `/launch-codes` (authz runs, page cached), delete the session cookie from devtools without refreshing, then navigate to `/launch-codes?page=2` via the client router. The now-signed-out user is shown protected data because the authorization check in the layout was skipped.
- Maintainer (Rich Harris) and community confirmed: "as a fundamental rule, authorization has to happen on each request to the server before data is loaded and returned... There's nothing stopping anyone requesting the `__data.json` files directly without even going through your app UI."
- `+layout.server.js` is fundamentally a caching/data-tree mechanism, not a middleware/guard mechanism, despite superficially looking like one. SvelteKit never shipped a first-class `+auth.server.js` or per-directory guard file for this; several such proposals (`event.alwaysRun()`, `export const guard`, `+auth.server.js`) were discussed at length but none were adopted as of this writing.

## The community-converged mitigation

- The most-repeated recommendation across the multi-year thread: put all authorization/authentication logic in the root `hooks.server.ts` `handle` function, before calling `resolve(event)`, and use route pattern matching (route groups like `(protected)`, `(requiresAdmin)`) against `event.route.id` to decide which requests need a check - because `handle` runs on every server request unconditionally, unlike layout `load` functions.
- Example pattern from the thread:
```ts
export const handle = (async ({ event, resolve }) => {
  const user = await getUserFromCookieOrHeader(event);
  if (event.route.id?.includes('/(requiresUser)/') && !user) {
    throw error(401, 'requires authentication');
  }
  if (event.route.id?.includes('/(requiresAdmin)/') && user?.role !== 'ADMIN') {
    throw error(401, 'requires admin');
  }
  return resolve(event);
}) satisfies Handle;
```
- Additional confirmed footgun raised in the thread: because sibling `load` functions run in parallel by default, a page's `load` can start (and even complete) an expensive/sensitive DB call before a parent layout's authorization check has resolved - the data is never sent to the unauthorized client, but the query still executes, which is a minor DoS/cost concern on top of the primary authz bypass.
- Endpoints (`+server.ts`) are explicitly called out as needing their OWN individual authorization checks - protecting a layout node does not protect a sibling or child `+server.ts` route handler.
