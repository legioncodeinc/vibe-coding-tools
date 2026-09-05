# SvelteKit: Form actions
- URL: https://svelte.dev/docs/kit/form-actions
- Fetched: 2026-08-14
- Source type: official docs
- Component: sveltekit-2

Note: the raw fetch interleaved IDE-hover type annotations into the scraped text (docs site widget artifact); stripped below, keeping the SvelteKit-specific content. The page content was cut off partway through the "Validation errors" section (`fail()` return type) during archiving; treat progressive enhancement (`use:enhance`), redirects from actions, and the full validation-error worked example as a gap.

A `+page.server.js` file can export `actions`, which allow `POST`ing data to the server using the `<form>` element. Client-side JavaScript is optional with `<form>`, and forms can be progressively enhanced.

## Default actions

```js
// src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		// TODO log the user in
	}
};
```

Invoke it with a plain form, no JavaScript needed:

```svelte
<!-- src/routes/login/+page.svelte -->
<form method="POST">
	<label>Email <input name="email" type="email"></label>
	<label>Password <input name="password" type="password"></label>
	<button>Log in</button>
</form>
```

Actions always use `POST` requests, since `GET` requests should never have side effects. The action can also be invoked from another route via an explicit `action` attribute:

```svelte
<!-- src/routes/+layout.svelte -->
<form method="POST" action="/login">
	<!-- content -->
</form>
```

## Named actions

A page can export multiple named actions instead of one `default`:

```js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async (event) => {
		// TODO log the user in
	},
	register: async (event) => {
		// TODO register the user
	}
};
```

Invoke a named action with a query parameter prefixed by `/`:

```svelte
<form method="POST" action="?/register">
```

```svelte
<!-- from another route -->
<form method="POST" action="/login?/register">
```

A `formaction` attribute on a `<button>` posts the same form data to a different action than the parent `<form>`:

```svelte
<form method="POST" action="?/login">
	<label>Email <input name="email" type="email"></label>
	<label>Password <input name="password" type="password"></label>
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

You cannot have a `default` action alongside named actions: POSTing to a named action without a redirect persists the query parameter in the URL, so a subsequent default POST would go through the stale named action.

## Anatomy of an action

Each action receives a `RequestEvent`, so it can read form data with `request.formData()`. After processing (e.g. setting a cookie), an action returns data that becomes available through the `form` prop on the page and through `page.form` app-wide until the next update:

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

```js
// src/routes/login/+page.server.js (load, sibling to actions)
/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies }) => {
	const user = await db.getUserFromSession(cookies.get('sessionid'));
	return { user };
};
```

```svelte
<!-- src/routes/login/+page.svelte -->
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>

{#if form?.success}
	<!-- this message is ephemeral; it exists because the page was rendered in
	       response to a form submission. it will vanish if the user reloads -->
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

`PageProps` (bundling `data` and `form`) was added in SvelteKit 2.16.0; earlier versions type `data`/`form` individually as `import('./$types').PageData` / `ActionData`. In Svelte 4, use `export let data` and `export let form`.

`cookies.set(...)` defaults: `httpOnly: true`, `secure: true` (except in dev, where it defaults to `false`), `path: '/'`. These must be explicitly overridden if you need client-JS-readable or HTTP (non-HTTPS) cookies.

### Validation errors

If a request can't be processed due to invalid data, return validation errors (plus the previously submitted values) so the user can retry. The `fail` function returns an HTTP status code (typically 400 or 422) alongside the data. The status is available via `page.status`, the data via `form`.

**Gap:** the archived fetch was truncated inside the `fail()`-based login action example (return type showed `ActionFailure<{...}>` unions for missing/incorrect credentials, but the full worked code sample, the `page.status` usage example, and any coverage of `use:enhance` progressive enhancement, redirects thrown from actions, and the `error`/`redirect` helpers were not captured). Flagged as a gap in the distillation.
