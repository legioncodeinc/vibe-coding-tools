# SvelteKit: Loading data
- URL: https://svelte.dev/docs/kit/load
- Fetched: 2026-08-14
- Source type: official docs
- Component: sveltekit-2

Note: the raw fetch of this page interleaved IDE-hover type annotations and (near the end) unrelated Node.js `console`/`process` API-reference boilerplate into the scraped text (an artifact of the docs site's interactive code-sample widget). That noise has been stripped below; only the SvelteKit-specific `load` content is retained. The page content was cut off partway through the "Using URL data" section (`url`/`route` continuing into `params`) during archiving; treat anything about `params`, `fetch`, `setHeaders`, `parent`, `depends`/`invalidate`, and streaming with promises as a gap unless covered elsewhere in this archive.

Before a `+page.svelte` component (and its containing `+layout.svelte` components) can be rendered, data is fetched via `load` functions.

## Page data

A `+page.svelte` file can have a sibling `+page.js` that exports a `load` function, whose return value is available to the page via the `data` prop:

```js
// src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
}
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

Before SvelteKit 2.16.0, page/layout props had to be typed individually as `{ data: import('./$types').PageData }`; `PageProps` is the newer shorthand. In Svelte 4 you'd use `export let data` instead of `$props()`.

A `load` function in `+page.js` runs both on the server and in the browser (unless combined with `export const ssr = false`, in which case it only runs in the browser). If a `load` function must always run on the server (private env vars, database access), put it in `+page.server.js` instead:

```js
// src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

Note the type changes from `PageLoad` to `PageServerLoad` because server `load` functions can access additional arguments.

## Layout data

`+layout.svelte` files load data via `+layout.js` or `+layout.server.js`:

```js
// src/routes/blog/[slug]/+layout.server.js
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

```svelte
<!-- src/routes/blog/[slug]/+layout.svelte -->
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<main>
	{@render children()}
</main>

<aside>
	<h2>More posts</h2>
	<ul>
		{#each data.posts as post}
			<li><a href="/blog/{post.slug}">{post.title}</a></li>
		{/each}
	</ul>
</aside>
```

`LayoutProps` was added in 2.16.0; earlier versions type `data`/`children` individually.

Data returned from a layout `load` is available to child `+layout.svelte` components and the `+page.svelte` component, plus the layout it belongs to. Example: a page reading `data.posts` returned by a parent layout's `load`, deriving `next` with `$derived`:

```svelte
<script>
	import { page } from '$app/state';
	let { data } = $props();
	let index = $derived(data.posts.findIndex(post => post.slug === page.params.slug));
	let next = $derived(data.posts[index + 1]);
</script>
```

If multiple `load` functions return data with the same key, the last one wins: a layout `load` returning `{ a: 1, b: 2 }` and a page `load` returning `{ b: 3, c: 4 }` combine into `{ a: 1, b: 3, c: 4 }`.

## page.data

Any `+layout.svelte`, including the root, can read the current page's data (or a child layout's) via `page.data` from `$app/state`:

```svelte
<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.data.title}</title>
</svelte:head>
```

Type info for `page.data` comes from `App.PageData`. `$app/state` was added in SvelteKit 2.12; earlier versions (or Svelte 4) use `$app/stores`'s `page` store instead (`$page.data.title`).

## Universal vs server load functions

Two kinds:
- `+page.js`/`+layout.js` export **universal** `load` functions: run both on server and in the browser.
- `+page.server.js`/`+layout.server.js` export **server** `load` functions: run only server-side.

### When each runs

Server `load` functions always run on the server. Universal `load` functions run on the server during SSR on first visit, then again during hydration (reusing fetch responses), then subsequently only in the browser. Disabling SSR makes it an SPA where universal `load` always runs client-side. If a route has both, the server `load` runs first.

A `load` function runs at request time, unless the page is prerendered (then it runs at build time).

### Input

Both kinds get `params`, `route`, and `url`, plus functions `fetch`, `setHeaders`, `parent`, `depends`, and `untrack`. Server `load` functions receive a `ServerLoadEvent` which additionally inherits `clientAddress`, `cookies`, `locals`, `platform`, and `request` from `RequestEvent`. Universal `load` functions receive a `LoadEvent` with a `data` property: if both `+page.js` and `+page.server.js` (or layout equivalents) define `load`, the server `load`'s return value becomes the universal `load`'s `data` argument.

### Output

A universal `load` can return an object with any values, including custom classes and component constructors. A server `load` must return data serializable with `devalue` (anything JSON-representable plus `BigInt`, `Date`, `Map`, `Set`, `RegExp`, and repeated/cyclical references) so it can cross the network. Server `load` return values can include promises, which stream to the browser. Custom types need transport hooks to (de)serialize.

### When to use which

Server `load` is for direct DB/filesystem access or private env vars. Universal `load` is for fetching from an external API without private credentials (SvelteKit can fetch directly from the client, skipping the server hop) or for returning non-serializable values like component constructors. You can combine both: the server `load` return value is passed as `data` into the universal `load`, not directly to the page.

```js
// +page.server.js
export async function load() {
	return { serverMessage: 'hello from server load function' };
}
```

```js
// +page.js
export async function load({ data }) {
	return {
		serverMessage: data.serverMessage,
		universalMessage: 'hello from universal load function'
	};
}
```

## Using URL data

`load` functions receive `url`, `route`, and `params` describing the request.

### url

An instance of `URL`, with `origin`, `hostname`, `pathname`, and `searchParams` (parsed query string as `URLSearchParams`). `url.hash` cannot be accessed during `load` (unavailable on the server). In some environments this is derived from request headers during SSR; adapter-node, for example, may need configuration for the URL to be correct.

### route

Contains the current route directory name, relative to `src/routes`, e.g. for `src/routes/a/[b]/[...c]/+page.js`, `route.id` is `'/a/[b]/[...c]'` (`null` when no route matches).

**Gap:** the archived fetch was truncated inside the `route` example before `params` was documented; `params`, `fetch` (credential-forwarding behavior), `setHeaders`, `parent()`, `depends`/`invalidate`, streaming promises from server `load`, and redirects/errors thrown from `load` are not covered in this raw archive. Flagged in the distillation as a gap.
