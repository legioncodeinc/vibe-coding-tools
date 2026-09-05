# SvelteKit: Remote functions (experimental)
- URL: https://svelte.dev/docs/kit/remote-functions
- Fetched: 2026-08-14
- Source type: official docs
- Component: sveltekit-2

Note: the raw fetch interleaved IDE-hover type annotations and, in the `query.live` section, unrelated Node.js `console` API-reference boilerplate into the scraped text (docs site widget artifact); stripped below. The fetch was cut off at the start of the `## form` section (only the heading and the letter "T" of the next sentence were captured); the `form` and `command` and `prerender` flavours of remote functions, plus any single-flight-mutation / progressive enhancement details for them, are a **gap** in this archive.

Available since SvelteKit 2.27. Remote functions are a tool for type-safe communication between client and server. They can be called anywhere in the app but always run on the server, so they can safely access server-only modules (env vars, database clients). Combined with Svelte's experimental `await` support, they let you load and manipulate data directly inside components.

**This feature is experimental**: likely to contain bugs, subject to change without notice, not covered by semver. Opt in via `svelte.config.js`:

```js
export default {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true // allows `await` in deriveds, template expressions, and top level of components
		}
	}
};
```

## Overview

Remote functions are exported from a `.remote.js`/`.remote.ts` file, in four flavours: `query`, `form`, `command`, and `prerender`. On the client, exported functions are transformed into `fetch` wrappers invoking their server counterpart via a generated HTTP endpoint. Remote files can live anywhere in `src` (except inside `src/lib/server`); third-party libraries can also provide them.

## query

`query` reads dynamic data from the server. For static data, use `prerender` instead. Queries cannot be used on an entirely prerendered page (`export const prerender = true`), e.g. under `adapter-static`.

```js
// src/routes/blog/data.remote.js (or .ts)
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`
		SELECT title, slug FROM post ORDER BY published_at DESC
	`;
	return posts;
});
```

Usage inside a component (the query behaves like a Promise):

```svelte
<script>
	import { getPosts } from './data.remote';
</script>

<ul>
	{#each await getPosts() as { title, slug }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
```

Until the promise resolves (or if it errors), the nearest `<svelte:boundary>` is invoked. As an alternative to `await`, a query exposes `loading`, `error`, and `current` properties:

```svelte
<script>
	import { getPosts } from './data.remote';
	const query = getPosts();
</script>

{#if query.error}
	<p>oops!</p>
{:else if query.loading}
	<p>loading...</p>
{:else}
	<ul>{#each query.current as { title, slug }}<li><a href="/blog/{slug}">{title}</a></li>{/each}</ul>
{/if}
```

### Query arguments

Queries can accept arguments, e.g. a post `slug`:

```svelte
<script>
	import { getPost } from '../data.remote';
	let { params } = $props();
	const post = $derived(await getPost(params.slug));
</script>
```

Because `getPost` exposes an HTTP endpoint, validate the argument with a Standard Schema library (Zod, Valibot):

```js
export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
	if (!post) error(404, 'Not found');
	return post;
});
```

Both argument and return value are serialized with `devalue` (handles `Date`, `Map`, custom transport-hook types, in addition to JSON). For `query`/`prerender` arguments (not return values), objects/maps/sets are sorted so instances with the same members produce the same cache key regardless of key order; use an array if order matters.

### Deduplication

Calling a query serializes the argument as a cache key. On the server this creates a request-scoped cache so repeated invocations with the same key only do the work once. On the client, multiple identical invocations point to the same instance. You can `await` a query anywhere (components, event handlers, universal `load`, async callbacks) and SvelteKit dedupes against other consumers using the same query:

```svelte
<script>
	import { getData } from './data.remote.js';
	const data = getData(); // awaited in template — populates the cache
</script>
<p>{await data}</p>
<button onclick={async () => console.log(await getData())}>click me!</button>
<!-- dedupes with the component-level use above; no extra request -->
```

The cache lives as long as the query is in active use (rendered, being awaited, or referenced); once nothing uses it, the cached value is released.

### Refreshing queries

```svelte
<button onclick={() => getPosts().refresh()}>Check for new posts</button>
```

Queries are cached while on the page (`getPosts() === getPosts()`), so no need to hold a `const posts = getPosts()` reference just to refresh.

## query.batch

`query.batch` batches requests happening within the same macrotask, solving the n+1 problem: simultaneous queries are grouped into one round trip instead of one call each. The server callback receives an array of all arguments called within the batch window, and must return a function `(input, index) => output` that SvelteKit calls per input to resolve each individual call's result.

```js
export const getWeather = query.batch(v.string(), async (cityIds) => {
	const weather = await db.sql`SELECT * FROM weather WHERE city_id = ANY(${cityIds})`;
	const lookup = new Map(weather.map(w => [w.city_id, w]));
	return (cityId) => lookup.get(cityId);
});
```

```svelte
<script>
	import CityWeather from './CityWeather.svelte';
	import { getWeather } from './weather.remote';
	let { cities } = $props();
	let limit = $state(5);
</script>

{#each cities.slice(0, limit) as city}
	<h3>{city.name}</h3>
	<CityWeather weather={await getWeather(city.id)} />
{/each}

{#if cities.length > limit}
	<button onclick={() => limit += 5}>Load more</button>
{/if}
```

## query.live

`query.live` accesses real-time data. Similar to `query`, but the callback is typically an async generator function returning an `AsyncIterable`. During SSR, `await getTime()` returns the first yielded value then closes the iterator; that initial value is serialized and reused during hydration.

On the client, the query stays connected while actively used in a component; multiple instances share one connection. When no active uses remain, the stream disconnects and server-side iteration stops.

Live queries expose `connected` and `reconnect()`:

```svelte
<script>
	import { getTime } from './time.remote.js';
	const time = getTime();
</script>
<p>{await time}</p>
<p>connected: {time.connected}</p>
<button onclick={() => time.reconnect()}>Reconnect</button>
```

If the connection drops, `connected` becomes `false`; SvelteKit attempts reconnection passively with exponential backoff, and actively when `navigator.onLine` flips `false` → `true`. Unlike `query`, live queries have no `refresh()` (they self-update).

For imperative access to the value stream (instead of the reactive `current`), live query instances are themselves async-iterable and can be consumed with `for await`. Multiple consumers (reactive or imperative) share a single underlying connection. If values arrive faster than a `for await` consumer drains them, only the latest pending value is kept, live streams are not event logs. On the server, `for await` similarly joins a per-request shared iteration so concurrent consumers don't re-run the generator multiple times.

**Important:** don't cache live query responses in a service worker (the cloned response keeps streaming after the page closes); exclude responses whose `Cache-Control` header includes `no-store`.

## form / command / prerender

**Gap:** the archive fetch was cut off immediately after the `## form` heading. The `form` remote-function flavour (form actions via remote functions), the `command` flavour (server mutations callable like functions), and the `prerender` flavour (for static data) are not documented in this raw archive. Flagged as a gap in the distillation; consult `svelte.dev/docs/kit/remote-functions` directly for these sections until a follow-up research pass fills the gap.
