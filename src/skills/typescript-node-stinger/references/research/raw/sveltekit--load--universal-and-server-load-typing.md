# SvelteKit load functions: universal vs server, typing, data merging

- URL: https://svelte.dev/docs/kit/load ; https://svelte.dev/docs/kit/routing
- Fetched: 2026-08-14
- Source type: Official docs (svelte.dev)
- Component: `load` function typing and behavior

## Content

### Two kinds of `load`

- `+page.js` / `+layout.js` export **universal** `load` functions. They run on both the server and in the browser (unless paired with `export const ssr = false`, in which case browser-only). Type them with `PageLoad` / `LayoutLoad` from `./$types`.
- `+page.server.js` / `+layout.server.js` export **server** `load` functions. They run only on the server (needed for private env vars, direct DB access, etc.). Type them with `PageServerLoad` / `LayoutServerLoad` from `./$types`. Server `load` functions receive additional arguments (e.g. `cookies`) that universal ones don't.

Annotating the exported `load` function with the correct generated type (`PageLoad`, `PageServerLoad`, `LayoutLoad`, or `LayoutServerLoad`) is what makes `params` and the function's return value correctly typed - the generic form `Load` exists but the docs explicitly say to import the generated per-route type from `./$types` instead of using `Load` directly.

```ts
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	return { serverMessage: 'hello from server load function' };
};
```

```ts
// +page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	// `data` here is the return value of the server load function, if one exists
	return {
		serverMessage: data.serverMessage,
		universalMessage: 'hello from universal load function'
	};
};
```

When both a server `load` and a universal `load` exist for the same route, the server load's return value arrives as the `data` property on the universal load's event argument - the universal load does not receive the server data directly as its own return, it must explicitly forward/merge it.

### Data merging across layouts and pages

If multiple `load` functions in the hierarchy (parent layouts, child layout, page) return objects with overlapping keys, the last one to run 'wins' for that key. Example given in the docs: a layout `load` returning `{ a: 1, b: 2 }` and a page `load` returning `{ b: 3, c: 4 }` produces a merged `{ a: 1, b: 3, c: 4 }` available to the page.

A parent layout can read data from a child's `load` (or a page's `load`) via `page.data` (typed by `App.PageData`), rather than only children reading from parents.

### `await parent()`

A `load` function can call `await parent()` to get the merged return value of parent `load` functions in the same category (universal `load`s call `parent()` to get merged universal-layout data; server `load`s call `parent()` to get merged server-layout data). A missing `+layout.js` is implicitly treated as `({ data }) => data`, meaning it still forwards data from a parent `+layout.server.js` even without its own explicit universal load. The docs warn explicitly against introducing accidental request waterfalls: call `parent()` after starting other independent data fetches, not before, if you don't need the parent data for those fetches.

### Serialization constraint on server `load` return values

A server `load` function's return value must be serializable with `devalue` so it can cross the server/client boundary - JSON plus `BigInt`, `Date`, `Map`, `Set`, `RegExp`, and repeated/cyclical references. It may include promises, in which case the value streams to the browser rather than blocking. Universal `load` functions have no such constraint and may return arbitrary values including class instances and component constructors, because they never cross a network boundary (or if they do, only as the already-serialized `data` prop from the server load).

### `PageProps` / `LayoutProps` (2.16.0+)

`+page.svelte` receives `data` via a `data` prop; before SvelteKit 2.16.0 this had to be typed manually via `PageData` from `./$types`. From 2.16.0 onward, `PageProps` bundles `data: PageData` (and `form: ActionData` when the route has actions) into a single type:

```svelte
<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>
```

`LayoutProps` is the equivalent for `+layout.svelte`, adding `children: Snippet` alongside `data: LayoutData`.

### `App.PageData` / `App.Locals` (ambient app types)

Type information for the cross-page `page.data` read (via `$app/state`'s `page` object) comes from `App.PageData`, declared in `src/app.d.ts`. This is the ambient-typing mechanism SvelteKit projects use for `App.Error`, `App.Locals`, `App.PageData`, and `App.PageState` - all declared once in `app.d.ts` and picked up automatically by the generated tsconfig's `include` list.
