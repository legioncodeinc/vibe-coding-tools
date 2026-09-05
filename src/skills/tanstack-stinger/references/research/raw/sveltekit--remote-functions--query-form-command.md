# SvelteKit remote functions: query, form, command, prerender (native alternative to a data-fetching library)

- URL: https://svelte.dev/docs/kit/remote-functions ; https://svelte.dev/docs/kit/form-actions ; https://github.com/sveltejs/kit/releases/tag/@sveltejs%2Fkit@2.61.0
- Fetched: 2026-08-14
- Source type: Official svelte.dev docs + official sveltejs/kit release notes
- Component: SvelteKit / remote functions (context for "when NOT to reach for TanStack Query")

## Content

### What remote functions are

Type-safe client-server communication, callable from anywhere in the app, always executing on the server (safe to touch env vars/DB clients directly inside them). Exported from `.remote.js`/`.remote.ts` files (anywhere in `src` except `src/lib/server`). Four flavors: `query` (read dynamic data), `form` (write data, progressively-enhanced HTML forms), `command` (imperative writes not tied to a form), `prerender` (static data, cannot be used on a fully prerendered page).

### `query` - SvelteKit's own answer to "cached, dedup'd server read"

```ts
// src/routes/blog/data.remote.ts
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
  const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
  return posts;
});
```
Called with `await getPosts()` directly in components, event handlers, universal `load` functions, or async callbacks - usable with Svelte's experimental `await` support directly inside markup. SvelteKit **automatically dedupes concurrent identical invocations**: server-side, a request-scoped cache means multiple calls to the same query in one request only do the work once; client-side, multiple identical invocations "point to the same instance" - `getPosts() === getPosts()` - so no manual memoization/reference-holding is needed. As of `@sveltejs/kit@2.61.0` (2026-05-22), `await query()` works everywhere directly (the older `.run()` method was removed).

### `query.live` - self-updating real-time data

Behaves like `query` but the callback is an async generator returning an `AsyncIterable`; stays connected while actively used in a component, shares one connection across multiple instances, disconnects automatically when nothing is consuming it. No manual `refresh()` needed since it's self-updating - this directly overlaps with what a WebSocket-backed TanStack Query setup would otherwise hand-roll.

### `form` - SvelteKit's own answer to "mutation with pending/error state"

Takes a callback receiving validated `FormData`; the returned object exposes `method`/`action` so it works with **zero JavaScript** (real form POST + page reload) and progressively enhances via an attachment when JS is available (submits without a full reload). Validated via any Standard Schema library (Zod, Valibot) passed as the first argument. Recent releases (`2.61.0`) added a programmatic `submit()` method on form remote-function instances and pass the `form` remote-function instance into the `enhance` callback - signs of active, ongoing native investment in this exact "mutation" problem space.

### Named form actions (older, adjacent mechanism, still relevant)

`+page.server.js` `actions` + `<form method="POST" action="?/actionName">` + `use:enhance` for progressive JS enhancement - the pre-remote-functions mechanism for form mutations, still fully supported and commonly seen in existing codebases. `use:enhance` only works with `method="POST"` forms pointing at a `+page.server.js` action, not `+server.js` endpoints or GET forms.

## Relevance to this skill's core question

`query`/`query.live`/`form`/`command` cover request dedup, server-scoped caching within a request, real-time self-updating data, and progressively-enhanced mutations - all natively, all without adding TanStack Query's bundle cost. This is the strongest concrete evidence for "SvelteKit load functions and remote functions already cover a lot" from the mission brief. What remote functions do NOT natively provide that TanStack Query does: cross-navigation client-side cache persistence with configurable staleness/GC, window-focus/interval background refetching, and an addressable client-side `invalidateQueries`-style cache-invalidation API decoupled from any specific remote function call site. A team with light server-state needs and simple pages should default to remote functions first; a team building a data-dense dashboard with heavy client-side cache-sharing, background revalidation, and cross-component mutation state has a real case for adding TanStack Query on top.
