# Snippets ({#snippet}/{@render}) / event attributes
- URL: https://svelte.dev/docs/svelte/snippet ; https://svelte.dev/docs/svelte/basic-markup
- Fetched: 2026-08-14
- Source type: official docs
- Component: snippets

## {#snippet ...} (https://svelte.dev/docs/svelte/snippet)

```
{#snippet name()}...{/snippet}
{#snippet name(param1, param2, paramN)}...{/snippet}
```

Snippets, and render tags, are a way to create reusable chunks of markup inside your components. Instead of duplicating markup inside `{#each}`/`{#if}` blocks, declare a snippet once and render it with `{@render}`:

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

Like function declarations, snippets can have an arbitrary number of parameters, which can have default values, and you can destructure each parameter. You cannot use rest parameters.

### Snippet scope

Snippets can be declared anywhere inside your component. They can reference values declared outside themselves (e.g. in `<script>` or `{#each ...}` blocks), and they are "visible" to everything in the same lexical scope (siblings, and children of those siblings). A snippet declared inside another snippet is not visible outside it. Snippets can reference themselves and each other (including recursively).

### Passing snippets to components

**Explicit props:** snippets are values like any other and can be passed to components as props:

```svelte
{#snippet header()}
	<th>fruit</th><th>qty</th><th>price</th><th>total</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td><td>{d.qty}</td><td>{d.price}</td><td>{d.qty * d.price}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

Inside `Table.svelte`:

```svelte
<script>
	let { data, header, row } = $props();
</script>

<table>
	{#if header}<thead><tr>{@render header()}</tr></thead>{/if}
	<tbody>
		{#each data as d}<tr>{@render row(d)}</tr>{/each}
	</tbody>
</table>
```

Think about it like passing content instead of data to a component. The concept is similar to slots in web components.

**Implicit props:** snippets declared directly inside a component's opening/closing tags implicitly become props on the component:

```svelte
<Table data={fruits}>
	{#snippet header()}
		<th>fruit</th><th>qty</th><th>price</th><th>total</th>
	{/snippet}
	{#snippet row(d)}
		<td>{d.name}</td><td>{d.qty}</td><td>{d.price}</td><td>{d.qty * d.price}</td>
	{/snippet}
</Table>
```

**Implicit children snippet:** any content inside component tags that is not a snippet declaration implicitly becomes part of the `children` snippet:

```svelte
<!-- App.svelte -->
<Button>click me</Button>

<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>
<button>{@render children()}</button>
```

You cannot have a prop called `children` if you also have content inside the component, avoid props with that name.

**Optional snippet props:** use optional chaining `{@render children?.()}` to render nothing if unset, or an `#if` block for fallback content:

```svelte
{#if children}
	{@render children()}
{:else}
	fallback content
{/if}
```

### Typing snippets

Snippets implement the `Snippet` interface imported from `'svelte'`:

```ts
import type { Snippet } from 'svelte';

interface Props {
	data: any[];
	children: Snippet;
	row: Snippet<[any]>;
}

let { data, children, row }: Props = $props();
```

The type argument to `Snippet` is a tuple, since snippets can have multiple parameters. You can tighten further with a generic:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	let { data, children, row }: { data: T[]; children: Snippet; row: Snippet<[T]> } = $props();
</script>
```

### Exporting snippets

Snippets declared at the top level of a `.svelte` file can be exported from a `<script module>` for use in other components, provided they don't reference declarations in a non-module `<script>` (directly or indirectly via other snippets). Requires Svelte 5.5.0+.

```svelte
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```

### Programmatic snippets

Snippets can be created programmatically with the `createRawSnippet` API, intended for advanced use cases.

### Snippets and slots

In Svelte 4, content is passed to components using slots. Snippets are more powerful and flexible, and so slots have been deprecated in Svelte 5.

## Event attributes (https://svelte.dev/docs/svelte/basic-markup, "Events" section)

Listening to DOM events is possible by adding attributes to the element that start with `on`. For example, to listen to the `click` event, add the `onclick` attribute to a button:

```svelte
<button onclick={() => console.log('clicked')}>click me</button>
```

Event attributes are case sensitive. `onclick` listens to the `click` event, `onClick` listens to the `Click` event (different). This ensures you can listen to custom events that have uppercase characters in them.

Because events are just attributes, the same rules as for other attributes apply:

- shorthand form: `<button {onclick}>click me</button>`
- can be spread: `<button {...spreadProps}>click me</button>`

Timing-wise, event attributes always fire after events from bindings (e.g. `oninput` always fires after an update to `bind:value`). Under the hood, some event handlers are attached directly with `addEventListener`, while others are delegated.

When using `ontouchstart` and `ontouchmove` event attributes, the handlers are passive for better performance, allowing the browser to scroll the document immediately rather than waiting to see if the handler calls `event.preventDefault()`. In the very rare cases you need to prevent these event defaults, use the `on` function from `svelte/events` instead (for example inside an action).

### Event delegation

To reduce memory footprint and increase performance, Svelte uses event delegation: for certain events, a single event listener at the application root takes responsibility for running any handlers on the event's path. Gotchas:

- when manually dispatching an event with a delegated listener, set `{ bubbles: true }` or it won't reach the application root
- when using `addEventListener` directly, avoid calling `stopPropagation` or the event won't reach the application root; prefer the `on` function imported from `svelte/events` over `addEventListener` so ordering and `stopPropagation` are handled correctly

Delegated events: `beforeinput`, `click`, `change`, `dblclick`, `contextmenu`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`, `touchend`, `touchmove`, `touchstart`.

### Other basic-markup notes

- Text expressions: `{expression}`, null/undefined are omitted, others coerced to strings. Use `{@html potentiallyUnsafeHtmlString}` to render raw HTML (escape or control the source to prevent XSS).
- `<!-- svelte-ignore a11y_autofocus -->` style comments disable warnings for the next block of markup.
- A `<!-- @component -->` comment block shows documentation on hover in other files.
