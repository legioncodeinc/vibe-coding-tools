# <svelte:boundary> / .svelte.js and .svelte.ts files
- URL: https://svelte.dev/docs/svelte/svelte-boundary ; https://svelte.dev/docs/svelte/svelte-js-files
- Fetched: 2026-08-14
- Source type: official docs
- Component: sveltekit-2, universal-reactivity

## <svelte:boundary> (https://svelte.dev/docs/svelte/svelte-boundary)

```svelte
<svelte:boundary onerror={handler}>...</svelte:boundary>
```

Added in Svelte 5.3.0. Boundaries let you "wall off" parts of an app so you can:

- provide UI shown while `await` expressions inside are first resolving
- handle errors that occur during rendering or while running effects, and render fallback UI when an error happens

If a boundary handles an error (via a `failed` snippet, an `onerror` handler, or both), its existing content is removed. Errors occurring outside the rendering process (event handlers, `setTimeout`, other async work not part of the render) are **not** caught by boundaries.

For the boundary to do anything, at least one of the following must be provided:

### pending

Shown when the boundary is first created, remains visible until all `await` expressions inside have resolved:

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

The `pending` snippet is not shown for subsequent async updates, for those use `$effect.pending()`. In the Svelte Playground, apps are rendered inside a boundary with an empty `pending` snippet so `await` works without you creating one.

### failed

Rendered when an error is thrown inside the boundary, receiving `error` and a `reset` function that recreates the contents:

```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

Can be passed explicitly as a prop (`<svelte:boundary {failed}>`) or implicitly declared inside the boundary.

### onerror

Called with the same `error`/`reset` arguments, useful for reporting to an error-tracking service, or for lifting `error`/`reset` out of the boundary into surrounding component state:

```svelte
<svelte:boundary onerror={(e) => report(e)}>
	...
</svelte:boundary>
```

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});
	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => { error = null; reset(); }}>oops! try again</button>
{/if}
```

If an error occurs inside `onerror` itself (or is rethrown), a parent boundary handles it if one exists.

### transformError (server-side, since 5.51)

By default, error boundaries have no effect on the server, if an error occurs during rendering, the whole render fails. Since 5.51, boundaries with a `failed` snippet can be controlled via a `transformError` function passed to `render(...)` (from `svelte/server`). If using a framework like SvelteKit, you typically don't call `render(...)` directly, the framework configures `transformError` (SvelteKit was noted as adding support for this "in the near future" via the `handleError` hook, as of this archive's fetch date).

`transformError` must return a JSON-stringifiable object used to render the `failed` snippet; this object is serialized and reused to hydrate the snippet in the browser. Recommended to redact sensitive `message`/`stack` info before sending errors to the browser rather than passing them through unaltered. If `transformError` throws or rethrows, `render(...)` as a whole fails with that error. If the boundary has an `onerror` handler, it is called on hydration with the deserialized error object. `mount` and `hydrate` also accept a `transformError` option (defaults to the identity function).

## .svelte.js and .svelte.ts files (https://svelte.dev/docs/svelte/svelte-js-files)

Besides `.svelte` files, Svelte also operates on `.svelte.js` and `.svelte.ts` files. These behave like any other `.js`/`.ts` module, except that you can use runes inside them. This is useful for creating reusable reactive logic, or sharing reactive state across the app, though **you cannot export reassigned state** directly. This concept did not exist prior to Svelte 5.

### Passing state across modules (from $state docs, https://svelte.dev/docs/svelte/$state)

You can declare state in `.svelte.js`/`.svelte.ts` files, but you can only export that state if it is not directly reassigned. You cannot do this:

```js
// state.svelte.js
export let count = $state(0); // NOT exportable if reassigned elsewhere
```

Every reference to `count` is transformed by the Svelte compiler, roughly into calls like `$.get(count)`/`$.set(count, value)`. Because the compiler only operates on one file at a time, an importing file doesn't get the same transform applied to its own references to the imported binding, so direct reassignment across the module boundary breaks. Two ways around it: don't reassign the exported binding directly, wrap the state in an object or a getter/setter pair, or export a class instance with the state as a class field (class fields with `$state` are excluded from this restriction since access goes through get/set methods on the prototype instead of a bare compiler-transformed binding). This is the mechanism referenced by "Universal reactivity" material for `.svelte.ts` modules: encapsulate `$state` behind a function, object with getters, or a class, and export that wrapper rather than the raw reactive binding.
