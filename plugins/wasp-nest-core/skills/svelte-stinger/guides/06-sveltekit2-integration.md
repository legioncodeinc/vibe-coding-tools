# SvelteKit 2 integration

Copy-paste-ready code lives in `references/sveltekit2-patterns.md`. This guide covers the decisions: which mechanism to reach for, and why.

## Universal load vs. server load

Two kinds of `load` function, and picking the right one is the most common SvelteKit-2 judgment call [raw/08-sveltekit-load.md]:

- **Server load** (`+page.server.js`/`+layout.server.js`): always runs server-side. Use it when you need direct database/filesystem access, private environment variables, or secrets that must never reach the client bundle.
- **Universal load** (`+page.js`/`+layout.js`): runs server-side during SSR on first visit, then again during hydration (reusing fetch responses), then only client-side after that. Use it when fetching from a public external API without private credentials, since SvelteKit can let the browser hit that API directly instead of proxying through your server, or when you need to return something server `load` can't serialize (a component constructor, a custom class instance).

A community source frames the same choice slightly differently and adds a third option for `+server.js` standalone endpoints [raw/14-svelte5-best-practices-openreplay.md]:

| Scenario | Use |
|---|---|
| Page data needing SSR or server-only access | `+page.server.js` with `load()` |
| Standalone API endpoint for external consumers (webhooks, JSON API) | `+server.js` |
| Client-only data fetched after hydration | `onMount` + `fetch` |

If a route has both universal and server `load`, the server one runs first, and its return value is threaded into the universal `load`'s `data` argument, not passed directly to the page. This lets you combine server-only data fetching with a follow-up client-safe transformation [raw/08-sveltekit-load.md].

## Reading load data in components

`$props()` replaces `export let data` for reading `load` results:

```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>
```

`PageProps` (and `LayoutProps` for layouts, bundling `data` plus `children`, and `form` for pages with actions) was added in SvelteKit 2.16.0. Earlier versions, or projects still on Svelte 4, type `data`/`form`/`children` individually [raw/08-sveltekit-load.md, raw/09-sveltekit-form-actions.md].

For a layout to read a child page's data (or vice versa, a parent layout wanting page-level data like a `<title>`), use `page.data` from `$app/state` (added SvelteKit 2.12). Pre-2.12 projects, or Svelte 4 projects, use the `$app/stores` `page` store instead (`$page.data.title`) [raw/08-sveltekit-load.md].

## Form actions: default vs. named, and validation

Use a `default` action when a page has exactly one form purpose. Switch to named actions the moment a page needs more than one distinct form behavior (login vs. register on the same page, for instance), and never mix a `default` action with named actions on the same page, doing so risks a stale named-action query parameter misrouting a later default-action POST [raw/09-sveltekit-form-actions.md].

Return validation failures with the `fail(status, data)` helper (typically 400 or 422); the status surfaces via `page.status`, the data via the page's `form` prop, letting you re-render the form with the user's previous input and an error message [raw/09-sveltekit-form-actions.md].

**Gap:** progressive enhancement via `use:enhance`, redirects thrown from actions, and the `error`/`redirect` SvelteKit helpers used inside actions are not covered in the archived research. Don't assert specifics for these without a fresh docs check [raw/09-sveltekit-form-actions.md].

## Remote functions: experimental, opt-in, use sparingly in production

Remote functions (`query`, `query.batch`, `query.live`, and the undocumented-in-this-archive `form`/`command`/`prerender`) are explicitly experimental as of the archived research: "likely to contain bugs," "subject to change without notice," not covered by semver [raw/10-sveltekit-remote-functions.md]. Reach for them when you want type-safe client-to-server calls colocated with the component that uses them, and Svelte's experimental `await`-in-components support (also opt-in) to consume them directly in markup. For anything shipping to production without tolerance for breaking changes on a Svelte/SvelteKit patch bump, prefer conventional `load` functions and form actions until remote functions stabilize.

Key behavioral notes when you do use them:
- `query` results dedupe automatically: identical calls (same serialized arguments) share a server-scoped cache and a single client-side instance while actively in use [raw/10-sveltekit-remote-functions.md].
- `query.batch` exists specifically to solve the N+1 problem, batching same-macrotask calls into one server round trip [raw/10-sveltekit-remote-functions.md].
- `query.live` is for real-time/streaming data via an async generator; never cache its responses in a service worker unless the response has `Cache-Control: no-store` [raw/10-sveltekit-remote-functions.md].

## Error and pending UI: <svelte:boundary>

Use `<svelte:boundary>` to wall off a subtree that either has `await` expressions needing pending UI, or is prone to render-time/effect errors needing a `failed` fallback. It does **not** catch errors from event handlers or from async work outside the render process (a `setTimeout` callback, for instance), those need their own try/catch [raw/12-svelte-boundary-and-universal-reactivity.md].

On the server, boundaries have no effect by default; the `transformError` mechanism (5.51+) that lets a `failed`-snippet boundary render server-side requires the surrounding framework to wire it up. As of the archived research, SvelteKit's own `handleError`-hook integration for this was described as forthcoming, not confirmed shipped. Verify current SvelteKit release notes before relying on this in a specific project, rather than assuming it's available [raw/12-svelte-boundary-and-universal-reactivity.md].

## Streaming

A server `load` function's return object can include promises; SvelteKit streams those to the browser instead of blocking the initial render on them [raw/08-sveltekit-load.md]. Pair a streamed value with a `#await` block or a `<svelte:boundary>`'s `pending` snippet in the consuming component so the user sees a loading state instead of a blank gap while the promise resolves.
