# $derived / $effect
- URL: https://svelte.dev/docs/svelte/$derived ; https://svelte.dev/docs/svelte/$effect
- Fetched: 2026-08-14
- Source type: official docs
- Component: runes

## $derived (https://svelte.dev/docs/svelte/$derived)

Derived state is declared with the `$derived` rune:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

The expression inside `$derived(...)` should be free of side-effects. Svelte will disallow state changes (e.g. `count++`) inside derived expressions.

As with `$state`, you can mark class fields as `$derived`.

Code in Svelte components is only executed once at creation. Without the `$derived` rune, `doubled` would maintain its original value even when `count` changes.

### $derived.by

Sometimes you need to create complex derivations that don't fit inside a short expression. In these cases, you can use `$derived.by` which accepts a function as its argument.

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

In essence, `$derived(expression)` is equivalent to `$derived.by(() => expression)`.

### Understanding dependencies

Anything read synchronously inside the `$derived` expression (or `$derived.by` function body) is considered a dependency of the derived state. When the state changes, the derived will be marked as dirty and recalculated when it is next read.

In addition, if an expression contains an `await`, Svelte transforms it such that any state after the `await` is also tracked, in other words, in `$derived(await a + b)`, both `a` and `b` are tracked, even though `b` is only read once `a` has resolved, after the initial execution. (This does not apply to `await` in functions that are called by the expression, only the expression itself.)

To exempt a piece of state from being treated as a dependency, use `untrack`.

### Overriding derived values

Derived expressions are recalculated when their dependencies change, but you can temporarily override their values by reassigning them (unless they are declared with `const`). This can be useful for things like optimistic UI, where a value is derived from the 'source of truth' (such as data from your server) but you'd like to show immediate feedback to the user:

```svelte
<script>
	let { post, like } = $props();

	let likes = $derived(post.likes);

	async function onclick() {
		// increment the `likes` count immediately...
		likes += 1;

		// and tell the server, which will eventually update `post`
		try {
			await like();
		} catch {
			// failed! roll back the change
			likes -= 1;
		}
	}
</script>

<button {onclick}>likes: {likes}</button>
```

Prior to Svelte 5.25, deriveds were read-only.

### Deriveds and reactivity

Unlike `$state`, which converts objects and arrays to deeply reactive proxies, `$derived` values are left as-is. If the underlying source (e.g. an array item accessed via a derived index) is deeply reactive, you can change (or `bind:` to) properties of the derived result and it will affect the underlying reactive source. If the source was not deeply reactive, mutating the derived value would have no effect.

### Destructuring

If you use destructuring with a `$derived` declaration, the resulting variables will all be reactive, `let { a, b, c } = $derived(stuff())` is roughly equivalent to declaring `_stuff = $derived(stuff())` and then `a = $derived(_stuff.a)`, `b = $derived(_stuff.b)`, `c = $derived(_stuff.c)`.

### Update propagation

Svelte uses something called push-pull reactivity: when state is updated, everything that depends on the state (whether directly or indirectly) is immediately notified of the change (the 'push'), but derived values are not re-evaluated until they are actually read (the 'pull').

If the new value of a derived is referentially identical to its previous value, downstream updates will be skipped. E.g. with `let large = $derived(count > 10)`, Svelte will only update dependents when `large` changes, not on every `count` change.

## $effect (https://svelte.dev/docs/svelte/$effect)

Effects are functions that run when state updates, and can be used for things like calling third-party libraries, drawing on `<canvas>` elements, or making network requests. They only run in the browser, not during server-side rendering.

Generally speaking, you should not update state inside effects, as it will make code more convoluted and will often lead to never-ending update cycles. If you find yourself doing so, see "when not to use $effect" below for alternative approaches.

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		// this will re-run whenever `color` or `size` change
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

When Svelte runs an effect function, it tracks which pieces of state (and derived state) are accessed (unless accessed inside `untrack`), and re-runs the function when that state later changes. Effects are triggered differently than the `$:` blocks you may be used to if coming from Svelte 4.

### Understanding lifecycle

Your effects run after the component has been mounted to the DOM, and in a microtask after state changes. Re-runs are batched (i.e. changing `color` and `size` in the same moment won't cause two separate runs), and happen after any DOM updates have been applied.

You can use `$effect` anywhere, not just at the top level of a component, as long as it is called while a parent effect is running. Svelte uses effects internally to represent logic and expressions in your template, this is how `<h1>hello {name}!</h1>` updates when `name` changes.

An effect can return a teardown function which will run immediately before the effect re-runs:

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		// This will be recreated whenever `milliseconds` changes
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// if a teardown function is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

Teardown functions also run when the effect is destroyed, which happens when its parent is destroyed (for example, a component is unmounted) or the parent effect re-runs.

### Understanding dependencies

`$effect` automatically picks up any reactive values (`$state`, `$derived`, `$props`) that are synchronously read inside its function body (including indirectly, via function calls) and registers them as dependencies. When those dependencies change, the `$effect` schedules a re-run.

If `$state` and `$derived` are used directly inside the `$effect` (for example, during creation of a reactive class), those values will not be treated as dependencies.

Values that are read asynchronously, after an `await` or inside a `setTimeout`, for example, will not be tracked.

An effect only reruns when the object it reads changes, not when a property inside it changes:

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// this will run once, because `state` is never reassigned (only mutated)
	$effect(() => {
		state;
	});

	// this will run whenever `state.value` changes...
	$effect(() => {
		state.value;
	});

	// ...and so will this, because `derived` is a new object each time
	$effect(() => {
		derived;
	});
</script>
```

An effect only depends on the values that it read the last time it ran. This has interesting implications for effects that have conditional code, e.g. an `if` branch that reads `color` will only be a dependency while that branch executes.

### $effect.pre

In rare cases, you may need to run code before the DOM updates. For this use the `$effect.pre` rune:

```svelte
<script>
	import { tick } from 'svelte';

	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return; // not yet mounted
		messages.length; // reference so this re-runs whenever it changes
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

Apart from the timing, `$effect.pre` works exactly like `$effect`.

### $effect.tracking

The `$effect.tracking` rune is an advanced feature that tells you whether or not the code is running inside a tracking context, such as an effect or inside your template:

```svelte
<script>
	console.log('in component setup:', $effect.tracking()); // false
	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

It is used to implement abstractions like `createSubscriber`, which will create listeners to update reactive values but only if those values are being tracked (rather than, for example, read inside an event handler).

### $effect.pending

When using `await` in components, the `$effect.pending()` rune tells you how many promises are pending in the current boundary, not including child boundaries.

### $effect.root

The `$effect.root` rune is an advanced feature that creates a non-tracked scope that doesn't auto-cleanup. This is useful for nested effects that you want to manually control. This rune also allows for the creation of effects outside of the component initialisation phase.

```svelte
<script>
  let count = $state(0);
  const cleanup = $effect.root(() => {
	$effect(() => {
	  console.log(count);
	})
	return () => {
	  console.log('effect root cleanup');
	}
  });
</script>

<button onclick={() => cleanup()}>cleanup</button>
```

### When not to use $effect

In general, `$effect` is best considered something of an escape hatch, useful for things like analytics and direct DOM manipulation, rather than a tool you should use frequently. In particular, avoid using it to synchronise state. Instead of:

```js
// don't do this!
let doubled = $state();
$effect(() => {
	doubled = count * 2;
});
```

...do this:

```js
let doubled = $derived(count * 2);
```

For things that are more complicated than a simple expression, use `$derived.by`. If you're using an effect because you want to be able to reassign the derived value (to build an optimistic UI, for example) note that deriveds can be directly overridden as of Svelte 5.25.

Avoid convoluted effects that link one value to another (two-way sync via effects, e.g. syncing "money spent" and "money left" inputs with two `$effect`s that write to each other's source state). Instead, use `oninput` callbacks or function bindings (`bind:value={() => left, updateLeft}`) where possible, deriving one value from the other.

If you absolutely have to update `$state` within an effect and run into an infinite loop because you read and write to the same `$state`, use `untrack`.
