# Lifecycle hooks / $inspect
- URL: https://svelte.dev/docs/svelte/lifecycle-hooks ; https://svelte.dev/docs/svelte/$inspect
- Fetched: 2026-08-14
- Source type: official docs
- Component: lifecycle

## Lifecycle hooks (https://svelte.dev/docs/svelte/lifecycle-hooks)

In Svelte 5, the component lifecycle consists of only two parts: its creation and its destruction. Everything in between, when certain state is updated, is not related to the component as a whole; only the parts that need to react to the state change are notified. This is because under the hood the smallest unit of change is not a component, it's the (render) effects that the component sets up upon initialization. Consequently, there's no such thing as a "before update"/"after update" hook.

### onMount

The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM. It must be called during the component's initialisation (but doesn't need to live inside the component; it can be called from an external module). `onMount` does not run inside a component that is rendered on the server.

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('the component has mounted');
	});
</script>
```

If a function is returned from `onMount`, it will be called when the component is unmounted:

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const interval = setInterval(() => {
			console.log('beep');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>
```

This behaviour only works when the function passed to `onMount` is synchronous. `async` functions always return a `Promise`, so the cleanup function does not get registered in that case.

### onDestroy

Schedules a callback to run immediately before the component is unmounted. Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the only one that runs inside a server-side component.

```svelte
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('the component is being destroyed');
	});
</script>
```

### tick

While there's no "after update" hook, you can use `tick` to ensure the UI is updated before continuing. `tick` returns a promise that resolves once any pending state changes have been applied, or in the next microtask if there are none.

```svelte
<script>
	import { tick } from 'svelte';

	$effect.pre(() => {
		console.log('the component is about to update');
		tick().then(() => {
			console.log('the component just updated');
		});
	});
</script>
```

### Deprecated: beforeUpdate / afterUpdate

Svelte 4 contained hooks that ran before and after the component as a whole was updated. For backwards compatibility, these hooks were shimmed in Svelte 5 but are **not available inside components that use runes**.

Instead of `beforeUpdate` use `$effect.pre`, and instead of `afterUpdate` use `$effect`, these runes offer more granular control and only react to the changes you're actually interested in.

**Chat window example (canonical migration):** to autoscroll a chat window only when messages change (not when an unrelated `theme` state changes), Svelte 4 needed a manual `updatingMessages` flag inside `beforeUpdate` to avoid reacting to every update. With runes, `$effect.pre` replaces `beforeUpdate` and, because effects track only the state they read, referencing `messages` (not `theme`) inside the effect body means it only reruns when `messages` changes:

```svelte
<script>
	import { tick } from 'svelte';

	let theme = $state('dark');
	let messages = $state([]);
	let viewport;

	$effect.pre(() => {
		messages; // establishes the dependency
		const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
		if (autoscroll) {
			tick().then(() => {
				viewport.scrollTo(0, viewport.scrollHeight);
			});
		}
	});

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			const text = event.target.value;
			if (!text) return;
			messages = [...messages, text];
			event.target.value = '';
		}
	}
</script>
```

`beforeUpdate` and `afterUpdate` are therefore deprecated in Svelte 5 runes mode.

## $inspect (https://svelte.dev/docs/svelte/$inspect)

`$inspect` only works during development. In a production build it becomes a noop.

The `$inspect` rune is roughly equivalent to `console.log`, except it re-runs whenever its argument changes. `$inspect` tracks reactive state deeply, so updating something inside an object or array via fine-grained reactivity will cause it to re-fire:

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');

	$inspect(count, message); // will console.log when `count` or `message` change
</script>

<button onclick={() => count++}>Increment</button>
<input bind:value={message} />
```

On updates, a stack trace will be printed, making it easy to find the origin of a state change (except in the playground, due to technical limitations).

### $inspect(...).with

`$inspect(...)` returns an object with a `with` method, which you can invoke with a callback that runs instead of `console.log`. The first argument is either `"init"` or `"update"`; subsequent arguments are the values passed to `$inspect`:

```svelte
<script>
	let count = $state(0);

	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger; // or console.trace, or whatever you want
		}
	});
</script>
```

### $inspect.trace(...)

Added in 5.14. Causes the surrounding function to be traced in development. Any time the function re-runs as part of an effect or a derived, information is printed to the console about which pieces of reactive state caused it to fire. `$inspect.trace()` must be the first statement of a function body, and takes an optional first argument used as a label:

```svelte
<script>
	import { doSomeWork } from './elsewhere';

	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```
