# Snippets and events

## Snippets replace slots

Slots are deprecated (not removed) in Svelte 5; snippets and `{@render}` are the replacement, described by the Svelte team as "more powerful and flexible" [raw/04-snippets-and-events.md, raw/06-migration-guide.md, raw/11-svelte5-release-blog.md]. Snippets can be passed to a component that still uses `<slot>`, but not the reverse, so migration is one-directional: snippet-based parents can consume slot-based children, but not vice versa [raw/06-migration-guide.md].

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{@render figure(image)}
{/each}
```

Three ways to hand a snippet to a component, in increasing order of "authoring convenience" [raw/04-snippets-and-events.md]:

1. **Explicit prop:** `<Table {header} {row} />`, declared as top-level snippets and passed like any other prop.
2. **Implicit prop:** declare the snippet directly inside the component's opening/closing tags; it becomes a same-named prop automatically.
3. **Implicit `children`:** any non-snippet content inside a component's tags becomes the `children` prop, rendered with `{@render children()}`. You cannot also declare an explicit prop named `children` on that component.

Optional snippet props: `{@render children?.()}` (renders nothing if unset) or an `{#if children}...{:else}fallback{/if}` block for real fallback content [raw/04-snippets-and-events.md].

Type snippets with the `Snippet` interface from `'svelte'`; `Snippet<[T]>` for a snippet taking one parameter of type `T` [raw/04-snippets-and-events.md]. See `references/runes-reference.md` for the full worked typing example.

## Event attributes replace on: directives

`onclick={handler}` replaces `on:click={handler}`, no colon, and event attributes are case-sensitive (`onClick` is a different, custom `Click` event, not `click`) [raw/04-snippets-and-events.md]. Because they're just attributes now:

- shorthand works: `<button {onclick}>`
- spreading works: `<button {...handlers}>`
- **duplicate handlers on the same element are disallowed.** Where Svelte 4 let you stack `on:click={one} on:click={two}`, Svelte 5 requires combining them into a single function: `onclick={(e) => { one(e); two(e); }}` [raw/06-migration-guide.md]

### Component events: callback props replace createEventDispatcher

`createEventDispatcher` is deprecated in Svelte 5. A component that used to `dispatch('inflate', power)` and expect `on:inflate={...}` from its parent should instead accept a callback prop:

```svelte
<!-- Pump.svelte -->
<script>
	let { inflate, deflate } = $props();
	let power = $state(5);
</script>
<button onclick={() => inflate(power)}>inflate</button>
```

```svelte
<!-- Parent.svelte -->
<Pump
	inflate={(power) => { size += power; }}
	deflate={(power) => { size -= power; }}
/>
```

Why: the official rationale is that `createEventDispatcher` was boilerplate-heavy (import, instantiate, call with a string plus payload, unwrap the payload from `.detail` because the event was always a `CustomEvent`), and now that DOM events use plain attributes too, callback props are the consistent default across both. It also buys type safety Svelte 4 couldn't offer: a component can now express whether a handler is required or optional, and can detect at runtime whether a caller supplied a particular handler at all [raw/06-migration-guide.md].

### Bubbling events

Instead of `<button on:click>` to forward a DOM event up, accept and spread an `onclick` callback prop:

```svelte
<script>
	let { onclick } = $props();
</script>
<button {onclick}>click me</button>
```

This also means handlers can be spread onto an element alongside other props instead of forwarding one event at a time [raw/06-migration-guide.md].

### Event modifiers are gone; write wrapper functions

`on:click|once|preventDefault={handler}` has no direct equivalent. Prefer calling `event.preventDefault()` inside the handler itself. For reusable modifier behavior, write plain wrapper functions:

```js
function once(fn) {
	return function (event) {
		if (fn) fn.call(this, event);
		fn = null;
	};
}
function preventDefault(fn) {
	return function (event) {
		event.preventDefault();
		fn.call(this, event);
	};
}
```

```svelte
<button onclick={once(preventDefault(handler))}>...</button>
```

Three modifiers can't be expressed as wrapper functions because they must apply at bind time, not run time: `capture` (append to the event name: `onclickcapture={...}`), and `passive`/`nonpassive` (require an action) [raw/06-migration-guide.md].

## Event delegation gotchas

A fixed list of common events (`click`, `input`, `keydown`, `pointerdown`, and others, full list in `references/research/raw/04-snippets-and-events.md`) are delegated through a single root listener for performance. Two gotchas: a manually-dispatched `CustomEvent` needs `{ bubbles: true }` to reach the root listener, and calling `stopPropagation()` via raw `addEventListener` prevents the event from reaching the root, breaking delegated handlers elsewhere in the tree. Prefer the `on` function from `svelte/events` over raw `addEventListener` when you need manual listener attachment, it preserves ordering and handles `stopPropagation` correctly [raw/04-snippets-and-events.md].
