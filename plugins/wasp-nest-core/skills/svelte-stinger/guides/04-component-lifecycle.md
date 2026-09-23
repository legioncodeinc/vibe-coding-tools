# Component lifecycle in runes mode

## The two-part lifecycle

In Svelte 5, a component's lifecycle has exactly two parts: creation and destruction. There is no "before update" or "after update" hook for the component as a whole, because the smallest unit of reactive change is no longer the component, it's the individual effect a piece of template or logic sets up during initialization. Only the effects that actually depend on changed state are notified; nothing fires "for the whole component" on every update [raw/05-lifecycle-and-inspect.md].

## What still exists, unchanged

- **`onMount(fn)`**: runs once, after the component mounts to the DOM. Must be called during component initialization (though it can live in an external module, not just inline). Never runs during SSR. If `fn` is synchronous and returns a function, that returned function runs on unmount. If `fn` is `async`, it returns a `Promise` instead of a cleanup function, so **no cleanup gets registered**, this is a real footgun: don't make your `onMount` callback `async` if you need the returned-cleanup pattern [raw/05-lifecycle-and-inspect.md].
- **`onDestroy(fn)`**: runs immediately before unmount. It's the only one of the four classic Svelte-4 lifecycle hooks that also runs during server-side rendering [raw/05-lifecycle-and-inspect.md].
- **`tick()`**: returns a Promise that resolves once pending state changes have been applied to the DOM (or on the next microtask if nothing's pending). Since there's no "after update" hook, `tick()` inside an effect is how you wait for the DOM to catch up before doing follow-up work.

## What's deprecated: beforeUpdate / afterUpdate

Shimmed for backward compatibility, but **not available inside components that have adopted runes**. If a component still uses `let`-implicit-reactivity and `$:`, `beforeUpdate`/`afterUpdate` still work; the moment that component starts using `$state`/`$derived`/`$effect`, they stop [raw/05-lifecycle-and-inspect.md, raw/06-migration-guide.md].

Replacements:
- `beforeUpdate` → `$effect.pre`
- `afterUpdate` → `$effect`

The reason these are better, not just renamed: `beforeUpdate`/`afterUpdate` fired on **every** component update regardless of relevance, forcing manual guard flags to avoid reacting to unrelated state changes. `$effect.pre`/`$effect` only re-run when the specific reactive values they actually read change [raw/05-lifecycle-and-inspect.md].

## Worked example: chat window autoscroll

The canonical migration example from the official docs, an autoscrolling chat window that should only autoscroll when `messages` changes, not when an unrelated `theme` toggle fires.

Svelte 4 needed a manual flag to distinguish the two cases inside `beforeUpdate`, because `beforeUpdate` couldn't tell what caused the update:

```js
// Svelte 4: needs `updatingMessages` guard because beforeUpdate fires on every update
let updatingMessages = false;
beforeUpdate(() => {
	if (!updatingMessages) return;
	// ... measure scroll position, autoscroll ...
	updatingMessages = false;
});
```

Svelte 5 doesn't need the guard, because `$effect.pre` only re-runs when the value it actually reads (`messages`) changes:

```svelte
<script>
	import { tick } from 'svelte';

	let theme = $state('dark');
	let messages = $state([]);
	let viewport;

	$effect.pre(() => {
		messages; // reading this establishes the dependency
		const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
		if (autoscroll) {
			tick().then(() => {
				viewport.scrollTo(0, viewport.scrollHeight);
			});
		}
	});
</script>
```

Toggling `theme` no longer risks accidentally triggering the autoscroll logic, because `theme` is never read inside the effect, so it was never registered as a dependency [raw/05-lifecycle-and-inspect.md].

## onMount vs $effect: which one for setup

Both can run one-time setup, but they answer different questions:

- **`onMount`**: "run this once, when the component first appears in the DOM." Right for one-time initialization: attaching a third-party library, setting up an event listener that shouldn't be re-attached, focusing an input.
- **`$effect`**: "run this whenever these specific reactive values change, including once at mount." Right when the side effect genuinely needs to re-run in response to state, not just once.

If your `$effect` body never reads any reactive state, it functionally behaves like `onMount`, at which point `onMount` is the more honest, more readable choice.
