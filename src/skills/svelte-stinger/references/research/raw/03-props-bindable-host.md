# $props / $bindable / $host
- URL: https://svelte.dev/docs/svelte/$props ; https://svelte.dev/docs/svelte/$bindable ; https://svelte.dev/docs/svelte/$host
- Fetched: 2026-08-14
- Source type: official docs
- Component: runes

## $props (https://svelte.dev/docs/svelte/$props)

The inputs to a component are referred to as props, short for properties. You pass props to components just like you pass attributes to elements:

```svelte
<script>
	import MyComponent from './MyComponent.svelte';
</script>

<MyComponent adjective="cool" />
```

On the other side, inside `MyComponent.svelte`, receive props with the `$props` rune:

```svelte
<script>
	let props = $props();
</script>

<p>this component is {props.adjective}</p>
```

More commonly you'll destructure your props:

```svelte
<script>
	let { adjective } = $props();
</script>

<p>this component is {adjective}</p>
```

### Fallback values

Destructuring allows fallback values, used if the parent component does not set a given prop (or the value is `undefined`):

```js
let { optionalProp = 42, requiredProp, bindableProp = $bindable() } = $props();
```

Fallback values are not turned into reactive state proxies (see Updating props).

### Renaming props

Use destructuring assignment to rename props, necessary if they're invalid identifiers or a JavaScript keyword like `super`.

### Rest props

Use a rest property to get the rest of the props: `let { a, b, ...rest } = $props();`

### Updating props

References to a prop inside a component update when the prop itself updates, when `count` changes in the parent, it also changes inside the child. But the child component is able to temporarily override the prop value, useful for unsaved ephemeral state.

While you can temporarily reassign props, you should not mutate props unless they are bindable.

- If the prop is a regular (non-reactive) object, mutation has no effect.
- If the prop is a reactive state proxy, mutations will have an effect but Svelte emits an `ownership_invalid_mutation` warning, because the component is mutating state that does not "belong" to it.
- The fallback value of a prop not declared with `$bindable` is left untouched, it is not turned into a reactive state proxy, so mutating a fallback object has no effect.

In summary: don't mutate props. Either use callback props to communicate changes, or, if parent and child should share the same object, use the `$bindable` rune.

### Type safety

TypeScript:

```ts
let { adjective }: { adjective: string } = $props();
```

Or with a separate interface:

```ts
interface Props {
	adjective: string;
}
let { adjective }: Props = $props();
```

Interfaces for native DOM elements are provided in the `svelte/elements` module. Snippet props like `children` should be typed using the `Snippet` interface imported from `'svelte'`.

### $props.id()

Added in version 5.20.0. Generates an ID that is unique to the current component instance. When hydrating a server-rendered component, the value will be consistent between server and client. Useful for linking elements via attributes like `for` and `aria-labelledby`:

```svelte
<script>
	const uid = $props.id();
</script>

<form>
	<label for="{uid}-firstname">First Name: </label>
	<input id="{uid}-firstname" type="text" />
</form>
```

## $bindable (https://svelte.dev/docs/svelte/$bindable)

Ordinarily, props go one way, from parent to child. In Svelte, component props can be bound, meaning data can also flow up from child to parent. This isn't something you should do often, overuse can make your data flow unpredictable and your components harder to maintain, but it can simplify your code if used sparingly and carefully. It also means a state proxy can be mutated in the child (mutation with normal, non-bindable props is possible but strongly discouraged; Svelte warns if a component mutates state it does not "own").

To mark a prop as bindable, use the `$bindable` rune:

```svelte
<!-- FancyInput.svelte -->
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

A component that uses `<FancyInput>` can add the `bind:` directive:

```svelte
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

The parent component doesn't have to use `bind:`, it can just pass a normal prop. You can specify a fallback value for when no prop is passed at all:

```js
let { value = $bindable('fallback'), ...props } = $props();
```

## $host (https://svelte.dev/docs/svelte/$host)

When compiling a component as a custom element, the `$host` rune provides access to the host element, allowing you to (for example) dispatch custom events:

```svelte
<!-- Stepper.svelte -->
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>
```

Consuming it as a custom element:

```svelte
<script>
	import './Stepper.svelte';
	let count = $state(0);
</script>

<my-stepper
	ondecrement={() => count -= 1}
	onincrement={() => count += 1}
></my-stepper>

<p>count: {count}</p>
```
