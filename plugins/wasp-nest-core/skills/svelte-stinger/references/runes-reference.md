# Runes reference

Field-by-field reference for all seven Svelte 5 runes, each with a minimal copy-paste-ready example. All code below is idiomatic Svelte 5 runes mode: no `$:`, no `export let`, no `on:` directives. Grounded in `references/research/distilled-svelte5.md` section 1; every claim traces back to `references/research/raw/`.

## $state

Declares reactive state. Plain objects and arrays become deeply reactive proxies; mutating a nested property triggers updates with no reassignment needed [raw/01-runes-overview-and-state.md].

```svelte
<script>
	let count = $state(0);
	let user = $state({ name: 'Ada', tags: ['admin'] });
</script>

<button onclick={() => count++}>{count}</button>
<button onclick={() => user.tags.push('editor')}>add tag</button>
```

Destructuring a reactive value breaks reactivity for the destructured binding, it's evaluated once, like normal JS [raw/01-runes-overview-and-state.md].

### $state.raw

Shallow state: not made deeply reactive, updates only on full reassignment, never on mutation. Use for large data you replace wholesale (e.g. a freshly fetched API payload) to skip proxy overhead [raw/01-runes-overview-and-state.md, raw/14-svelte5-best-practices-openreplay.md].

```svelte
<script>
	let items = $state.raw([0]);
	const addItem = () => {
		items = [...items, items.length]; // reassign, don't push
	};
</script>
```

### $state.snapshot

Takes a static, non-proxy copy of a deep `$state` value, for handing to external APIs that choke on Proxies (e.g. `structuredClone`) [raw/01-runes-overview-and-state.md].

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // plain object, not a Proxy
```

### $state.eager

Forces an immediate UI update for state read inside an `await` expression, which otherwise defers the UI update until the async work resolves. Use sparingly, only for user-action feedback [raw/01-runes-overview-and-state.md].

```svelte
<a aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
```

### $state in classes

Class instances are not proxied; mark individual fields with `$state` instead. Wrapping `new Foo()` in `$state(...)` has no effect [raw/01-runes-overview-and-state.md].

```js
class Todo {
	done = $state(false);
	text = $state('');

	// arrow field preserves `this` when passed as a bare handler
	reset = () => {
		this.text = '';
		this.done = false;
	};
}
```

## $derived

Declares a computed value; the expression must be free of side effects. Lazy (pull-based, only recomputes when read) and referentially memoized (skips downstream updates if the recomputed value is identical to the last one) [raw/02-derived-and-effect.md].

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{doubled}</button>
```

### $derived.by

For computations that don't fit a single expression. `$derived(expr)` is exactly equivalent to `$derived.by(() => expr)` [raw/02-derived-and-effect.md].

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let sum = 0;
		for (const n of numbers) sum += n;
		return sum;
	});
</script>
```

Since Svelte 5.25, a `$derived` (unless declared `const`) can be temporarily reassigned, handy for optimistic UI:

```svelte
<script>
	let { post, like } = $props();
	let likes = $derived(post.likes);

	async function onclick() {
		likes += 1; // optimistic bump
		try {
			await like();
		} catch {
			likes -= 1; // roll back on failure
		}
	}
</script>
```

## $effect

Runs a side effect when its synchronously-read dependencies change. Browser-only, never runs during SSR. Runs after mount, then in a batched microtask after state changes [raw/02-derived-and-effect.md].

```svelte
<script>
	let ms = $state(1000);
	let count = $state(0);

	$effect(() => {
		const id = setInterval(() => count++, ms);
		return () => clearInterval(id); // teardown, runs before re-run and on unmount
	});
</script>
```

**When NOT to use $effect:** never use it to sync one piece of state into another. This is the single most commonly flagged Svelte 5 mistake across official docs and community sources [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md, raw/14-svelte5-best-practices-openreplay.md]:

```js
// wrong: creates an unnecessary side effect and extra render pass
let doubled = $state();
$effect(() => { doubled = count * 2; });

// right: declarative, lazy, memoized
let doubled = $derived(count * 2);
```

Gut check: if an effect body ends in an assignment to another `$state`, reach for `$derived` instead [raw/13-runes-community-explainer-2026.md]. If you must write `$state` inside an effect and hit an infinite loop from reading and writing the same state, wrap the read in `untrack` (from `svelte`) [raw/02-derived-and-effect.md].

### $effect.pre

Same tracking rules as `$effect`, but runs before the DOM updates. Canonical use: measuring the DOM before a change for autoscroll, and the runes-mode replacement for `beforeUpdate` [raw/02-derived-and-effect.md, raw/05-lifecycle-and-inspect.md].

```svelte
<script>
	import { tick } from 'svelte';
	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return;
		messages.length; // establish the dependency
		const autoscroll = div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
		if (autoscroll) tick().then(() => div.scrollTo(0, div.scrollHeight));
	});
</script>
```

### $effect.tracking / $effect.pending / $effect.root

```js
console.log($effect.tracking()); // false in component setup, true inside an effect/template

// count of pending promises in the current boundary (experimental await-in-components feature)
$effect(() => { console.log($effect.pending()); });

// manual, non-auto-cleanup scope
const cleanup = $effect.root(() => {
	$effect(() => console.log('tracked'));
	return () => console.log('root cleanup');
});
cleanup(); // call manually when done
```

[raw/02-derived-and-effect.md]

## $props

Declares component inputs via destructuring, with fallback values, renaming, and rest [raw/03-props-bindable-host.md].

```svelte
<script>
	let {
		optional = 'unset',
		required,
		class: klass,
		...rest
	} = $props();
</script>

<button class={klass} {...rest}>{required} ({optional})</button>
```

Don't mutate props unless bindable. Fallback values are never turned into reactive proxies, mutating a fallback object has no effect [raw/03-props-bindable-host.md].

### $props.id()

Unique per-component-instance ID, stable across server/client hydration. Added 5.20.0. For `for`/`aria-labelledby` linking [raw/03-props-bindable-host.md]:

```svelte
<script>
	const uid = $props.id();
</script>
<label for="{uid}-firstname">First Name</label>
<input id="{uid}-firstname" />
```

## $bindable

Marks a prop as two-way bindable from the parent [raw/03-props-bindable-host.md]:

```svelte
<!-- FancyInput.svelte -->
<script>
	let { value = $bindable(), ...props } = $props();
</script>
<input bind:value {...props} />
```

```svelte
<!-- Parent.svelte -->
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>
<FancyInput bind:value={message} />
```

## $host

Only valid when compiling as a custom element (`<svelte:options customElement="..." />`); gives access to the host element for dispatching `CustomEvent`s [raw/03-props-bindable-host.md]:

```svelte
<svelte:options customElement="my-stepper" />
<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>
<button onclick={() => dispatch('increment')}>increment</button>
```

## $inspect

Dev-only, no-op in production. Re-fires whenever any argument changes, tracks deeply [raw/05-lifecycle-and-inspect.md]:

```svelte
<script>
	let count = $state(0);
	$inspect(count); // console.logs on every change, with a stack trace
</script>
```

`$inspect(...).with(fn)` replaces the default `console.log`:

```js
$inspect(count).with((type, count) => {
	if (type === 'update') debugger;
});
```

`$inspect.trace(label?)` (added 5.14) must be the first statement in a function body; prints which reactive state caused a re-run:

```svelte
<script>
	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```

[raw/05-lifecycle-and-inspect.md]
