# Best Practices for Working with Svelte (Svelte 5)
- URL: https://blog.openreplay.com/svelte-best-practices/
- Fetched: 2026-08-14
- Source type: blog (community)
- Component: performance, sveltekit-2, common-mistakes

Published 2026-05-19, OpenReplay engineering blog. Aimed at developers past the basics, focused on production maintainability/performance/clarity.

## Key takeaways (as stated by the source)

- Use `$state` only when a value drives UI updates, and reach for `$state.raw` when you're replacing values rather than mutating them.
- Prefer `$derived` over `$effect` for computed values; reserve `$effect` for syncing with external systems.
- Avoid module-level state in SSR environments. Use Svelte's context API with class-based `$state` for type-safe, request-scoped shared state.
- In SvelteKit, use `+page.server.js` for server-side page data and `+server.js` for standalone API endpoints.
- Adopt modern Svelte 5 syntax (`onclick`, `{#snippet}`, `$props()`) instead of legacy patterns in new code.

## $state.raw for replace-not-mutate data

```js
// Unnecessary proxy overhead for API data you'll only reassign
let users = $state(await fetchUsers());

// No proxy cost when you're replacing, not mutating
let users = $state.raw(await fetchUsers());
```

Rule: use `$state` when you need to mutate nested properties directly (e.g. `cart.items[0].quantity++`); use `$state.raw` when you're swapping the whole value wholesale.

## $derived over $effect for computed values

```js
let num = $state(0);

// Avoid: creates an unnecessary side effect
let square = $state(0);
$effect(() => { square = num * num; });

// Correct: declarative and dependency-tracked
let square = $derived(num * num);
```

"`$effect` is an escape hatch. Reserve it for syncing with external systems (like D3), and consider `{@attach}` for DOM-level integrations where it fits naturally." (Note: `{@attach}` is referenced here but not independently documented elsewhere in this archive, flagged as a gap for a future research pass if attachments become relevant to this Stinger's scope.)

## Treat props as dynamic

```js
let { type } = $props();

// Stays in sync when `type` changes
let color = $derived(type === 'danger' ? 'red' : 'green');
```

Plain assignment from a prop (`let color = type === 'danger' ? 'red' : 'green'`) would only compute once at initialization; deriving keeps it in sync as the prop updates.

## Type-safe context over shared modules (SSR-safety pattern)

For state shared across a component subtree, prefer the context API (`setContext`/`getContext`) over module-level `$state`. Module-level state persists across every request the server handles in an SSR environment (like SvelteKit) and can leak one user's data into another user's session. The recommended modern pattern: a class with `$state` fields, instantiated and placed into context per-request:

```ts
// lib/theme.svelte.ts
import { getContext, setContext } from 'svelte';

class ThemeContext {
  current = $state('light');

  toggle() {
    this.current = this.current === 'light' ? 'dark' : 'light';
  }
}

const KEY = Symbol('theme');

export const setTheme = () => setContext(KEY, new ThemeContext());
export const getTheme = () => getContext<ThemeContext>(KEY);
```

This gives type safety, reactive state, and proper SSR scoping (request-scoped, not global) in one pattern.

## SvelteKit: +page.server.js vs +server.js

| Scenario | Use |
|---|---|
| Fetching data for a page with SSR or server-only access | `+page.server.js` with `load()` |
| Building an API endpoint for external use | `+server.js` |
| Client-only data after hydration | `onMount` + `fetch` |

"For page data that needs server access, secrets, or SSR, `+page.server.js` is usually the right default. It runs server-side, keeps secrets out of the client, and integrates cleanly with SvelteKit's form actions for progressive enhancement." Use `+server.js` for a standalone HTTP endpoint (JSON API for external clients, webhooks, non-page fetches).

## Small practical wins

- Keyed `{#each}` blocks prevent subtle DOM recycling bugs: always key by a stable unique ID, never by array index.
- `$inspect.trace` is described as underused for debugging reactivity: drop it at the top of any `$effect` or `$derived.by` to see exactly which dependency triggered a re-run.
- Snippets over slots for reusable markup chunks: snippets compose better and can be passed as props, producing cleaner component APIs.
- Avoid legacy syntax in new code: replace `on:click` with `onclick`, `<slot>` with `{#snippet}`, and `export let` with `$props()`.

## Conclusion (as stated)

"Svelte 5 rewards restraint. The more precisely you scope reactivity, using `$state` only where needed, `$derived` instead of `$effect`, and context instead of module globals, the more predictable and performant your application becomes. Start with the simplest reactive primitive that solves the problem, and only reach for more powerful tools when the simpler ones genuinely fall short."
