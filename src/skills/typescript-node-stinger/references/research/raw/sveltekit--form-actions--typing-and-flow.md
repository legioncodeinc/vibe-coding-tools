# SvelteKit form actions: typing, ActionData, execution order

- URL: https://svelte.dev/docs/kit/form-actions
- Fetched: 2026-08-14
- Source type: Official docs (svelte.dev)
- Component: Form action typing

## Content

### Where actions live and how they're typed

A `+page.server.js`/`.ts` file can export both a `load` function and an `actions` object. Actions let a page write data via a `<form>` element, where `load` lets it read data. Typed with `Actions` from `./$types`:

```ts
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => { /* ... */ };

export const actions: Actions = {
	default: async (event) => {
		// handle the form submission
	}
};
```

### `ActionData` and `PageProps`

After an action runs, the page re-renders (unless a redirect or unexpected error occurred) with the action's return value available to the page via the `form` prop. This means **the page's `load` functions run again after the action completes** - the form prop and the reloaded page data arrive together. Typing:

```svelte
<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>
```

Before SvelteKit 2.16.0, `data` and `form` had to be typed individually via `PageData` and `ActionData` imported from `./$types`:

```svelte
<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData, form: ActionData } = $props();
</script>
```

In Svelte 4 syntax this was `export let data` / `export let form` instead of the `$props()` rune destructure.

### `handle` runs before the action, and does not re-run after it

An important ordering/state-staleness gotcha documented directly: `handle` (the `hooks.server` request hook) runs before the action is invoked and does **not** run again afterward. If your `handle` hook populates `event.locals` based on a cookie (e.g. session/auth state), and an action sets or deletes that cookie, `event.locals` inside that same request will still reflect the pre-action state - the action itself must read/update anything it needs directly rather than relying on `handle` having re-run.

### Deserializing action responses on the client

When invoking actions progressively-enhanced from client-side JavaScript (e.g. via `use:enhance` or a manual `fetch` to the form action endpoint), the response must be deserialized with the framework's own deserialize helper from `$app/forms`, not plain `JSON.parse()` - because, like `load` return values, action results support `Date`/`BigInt` and other devalue-compatible types that raw `JSON.parse` cannot reconstruct.
