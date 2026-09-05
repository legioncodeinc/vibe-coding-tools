# SvelteKit 2 patterns

Copy-paste-ready SvelteKit 2 patterns in Svelte 5 runes idiom: load functions, form actions, remote functions, and error boundaries. Grounded in `references/research/distilled-svelte5.md` sections 8 to 11. Where the archive has a documented gap, this file says so instead of guessing.

## Load functions

Two kinds: **universal** (`+page.js`/`+layout.js`, runs on server during SSR then in the browser) and **server** (`+page.server.js`/`+layout.server.js`, server-only, can touch secrets/DB) [raw/08-sveltekit-load.md].

```js
// src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
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

`PageProps` (bundling `data`, and `form` on pages with actions) was added in SvelteKit 2.16.0; before that, type `data` individually as `import('./$types').PageData` [raw/08-sveltekit-load.md, raw/09-sveltekit-form-actions.md].

### Layout data cascades down

```js
// src/routes/blog/[slug]/+layout.server.js
export async function load() {
	return { posts: await db.getPostSummaries() };
}
```

```svelte
<!-- src/routes/blog/[slug]/+layout.svelte -->
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<main>{@render children()}</main>
<aside>
	<ul>
		{#each data.posts as post}
			<li><a href="/blog/{post.slug}">{post.title}</a></li>
		{/each}
	</ul>
</aside>
```

A page can read data returned by its own `load` plus every parent layout `load` in the same `data` prop. On key collisions, the innermost `load` wins [raw/08-sveltekit-load.md].

### Combining server and universal load

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

The server `load` return value becomes the universal `load`'s `data` argument, it is not passed directly to the page [raw/08-sveltekit-load.md].

**Gap:** `params`, `fetch` forwarding semantics, `setHeaders`, `parent()`, `depends`/`invalidate`, and redirects/errors thrown from `load` are not covered in the archived research; do not assert specifics for these beyond what a fresh docs check confirms [raw/08-sveltekit-load.md].

## Form actions

```js
// src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	},
	register: async (event) => {
		// TODO register the user
	}
};
```

```svelte
<!-- src/routes/login/+page.svelte -->
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>

<form method="POST" action="?/login">
	<label>Email <input name="email" type="email"></label>
	<label>Password <input name="password" type="password"></label>
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>

{#if form?.success}
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

Rules: actions always run over POST; a page cannot mix a `default` action with named actions (a persisted `?/name` query param after a non-redirected POST would misroute a later default POST); `cookies.set()` defaults to `httpOnly: true`, `secure: true` outside dev, `path: '/'` [raw/09-sveltekit-form-actions.md].

**Gap:** progressive enhancement (`use:enhance`), action-triggered redirects, and the `error`/`redirect` SvelteKit helpers as used inside actions are not covered in the archived research [raw/09-sveltekit-form-actions.md].

## Remote functions (experimental, opt-in)

Available since SvelteKit 2.27. Requires explicit opt-in in `svelte.config.js`, and is explicitly not covered by semver [raw/10-sveltekit-remote-functions.md]:

```js
// svelte.config.js
export default {
	kit: {
		experimental: { remoteFunctions: true }
	},
	compilerOptions: {
		experimental: { async: true }
	}
};
```

### query: read dynamic server data

```js
// src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';
import * as v from 'valibot';

export const getPosts = query(async () => {
	return db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
});

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
	if (!post) error(404, 'Not found');
	return post;
});
```

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

Validate arguments with a Standard Schema library (Zod/Valibot). Queries dedupe automatically: repeated calls with the same serialized argument share a server-scoped cache and a single client-side instance while in active use [raw/10-sveltekit-remote-functions.md]. Refresh on demand:

```svelte
<button onclick={() => getPosts().refresh()}>Check for new posts</button>
```

### query.batch: solve N+1

```js
export const getWeather = query.batch(v.string(), async (cityIds) => {
	const weather = await db.sql`SELECT * FROM weather WHERE city_id = ANY(${cityIds})`;
	const lookup = new Map(weather.map(w => [w.city_id, w]));
	return (cityId) => lookup.get(cityId);
});
```

Calls made within the same macrotask are batched into one server round trip [raw/10-sveltekit-remote-functions.md].

### query.live: real-time data

```js
export const getTime = query.live(async function* () {
	while (true) {
		yield new Date();
		await new Promise((f) => setTimeout(f, 1000));
	}
});
```

```svelte
<script>
	import { getTime } from './time.remote.js';
	const time = getTime();
</script>
<p>{await time}</p>
<p>connected: {time.connected}</p>
<button onclick={() => time.reconnect()}>Reconnect</button>
```

Live queries have no `.refresh()` (they self-update), expose `.connected`/`.reconnect()` instead, and must never be cached in a service worker unless the response carries `Cache-Control: no-store` [raw/10-sveltekit-remote-functions.md].

**Gap:** the `form`, `command`, and `prerender` remote-function flavours are entirely undocumented in the archived research [raw/10-sveltekit-remote-functions.md].

## Error and pending boundaries: <svelte:boundary>

Added Svelte 5.3.0. Provides `pending` UI while contained `await` expressions first resolve, and `failed`/`onerror` handling for render-time or effect errors [raw/12-svelte-boundary-and-universal-reactivity.md]:

```svelte
<svelte:boundary onerror={(e) => report(e)}>
	<FlakyComponent />

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}

	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

Errors from event handlers, `setTimeout`, or other non-render async work are **not** caught by a boundary; only render-time and effect errors are [raw/12-svelte-boundary-and-universal-reactivity.md]. On the server, boundaries have no effect by default; a `render(..., { transformError })` option (5.51+) lets a `failed`-snippet boundary render server-side too, but SvelteKit's own hook integration for this was described as forthcoming, not confirmed shipped, as of the archived fetch. Verify current SvelteKit release notes before asserting this integration exists in a specific project [raw/12-svelte-boundary-and-universal-reactivity.md].

## Streaming from server load

A server `load` function can return promises in its result object; SvelteKit streams them to the browser rather than blocking the initial render on them [raw/08-sveltekit-load.md, distillation section 8]. Pair a streamed promise with a `<svelte:boundary>`'s `pending` snippet (or `#await` block) in the consuming component to render a loading state while it resolves.
