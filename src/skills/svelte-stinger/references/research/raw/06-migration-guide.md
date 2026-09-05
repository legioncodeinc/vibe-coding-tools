# Svelte 5 migration guide
- URL: https://svelte.dev/docs/svelte/v5-migration-guide
- Fetched: 2026-08-14
- Source type: official docs
- Component: migration

Version 5 comes with an overhauled syntax and reactivity system. Svelte 5 still supports the old Svelte 4 syntax, and you can mix and match components using the new syntax with components using the old and vice versa. There is a migration script that automates many of the steps.

## Reactivity syntax changes

Runes are compiler instructions that inform Svelte about reactivity, syntactically functions starting with a dollar sign.

### let → $state

In Svelte 4, a `let` declaration at the top level of a component was implicitly reactive. In Svelte 5, a variable is reactive when created using the `$state` rune:

```svelte
<script>
	let count = $state(0);
</script>
```

`count` is still the number itself, read/write directly, no wrapper like `.value` or `getCount()`.

Why: `let` being implicitly reactive at the top level worked great, but constrained reactivity to the top level of components, forcing store usage when refactoring code out for reuse (a second reactivity model to learn). Explicit `$state` works the same way outside the top level of components too.

### $: → $derived/$effect

In Svelte 4, a `$:` statement at the top level could declare a derivation. In Svelte 5:

```svelte
<script>
	let count = $state(0);
	const double = $derived(count * 2);
</script>
```

`double` is still the number itself, read directly, no wrapper.

A `$:` statement could also create side effects; in Svelte 5 this is `$effect`:

```svelte
<script>
	let count = $state(0);
	$effect(() => {
		if (count > 5) {
			alert('Count is too high!');
		}
	});
</script>
```

Note that *when* `$effect` runs is different than when `$:` ran.

Why: `$:` was intuitive to start with but harder to reason about as code grew, ambiguous whether the intent was a derivation or a side effect. Gotchas with `$:`:
- only updated directly before rendering, so stale values could be read in-between rerenders
- only ran once per tick, so statements could run less often than expected
- dependencies were determined through static analysis, which could break in subtle ways during refactors (e.g. moving a dependency into a function hides it from static analysis)
- statement ordering was also determined by static analysis and could break during refactors, requiring manual intervention
- not TypeScript-friendly

`$derived` and `$effect` fix all of these by: always returning the latest value, running as often as needed to be stable, determining dependencies at runtime (immune to refactors), executing dependencies as needed (immune to ordering problems), and being TypeScript-friendly.

### export let → $props

In Svelte 4, properties were declared with `export let`, one per declaration. In Svelte 5, all properties are declared through `$props`, via destructuring:

```svelte
<script>
	let { optional = 'unset', required } = $props();
</script>
```

Special cases that needed extra Svelte-specific syntax in Svelte 4 (renaming with `export { klass as class }`, other properties with `$$restProps`, all properties with `$$props`) are now handled with plain JS destructuring:

- renaming: `let { class: klass } = $props();`
- other properties: `let { foo, bar, ...rest } = $props();`
- all properties: `let props = $props();` (don't destructure)

```svelte
<script>
	let { class: klass, ...rest } = $props();
</script>
<button class={klass} {...rest}>click me</button>
```

Why: `export let` was controversial (export vs import framing). `$props` is in line with the "everything special to reactivity in Svelte is a rune" model and removes the need for the extra `$$restProps`/`$$props` API.

## Event changes

In Svelte 4, `on:` directive attached DOM listeners. In Svelte 5, event handlers are properties like any other (remove the colon):

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

Shorthand syntax works since they're just properties:

```svelte
<script>
	let count = $state(0);
	function onclick() {
		count++;
	}
</script>

<button {onclick}>clicks: {count}</button>
```

### Component events

In Svelte 4, components emitted events via `createEventDispatcher`. **This is deprecated in Svelte 5.** Instead, components accept callback props (functions passed as properties):

Old (Svelte 4, parent):
```svelte
<Pump
	on:inflate={(power) => { size += power.detail; }}
	on:deflate={(power) => { size -= power.detail; }}
/>
```

Old (Svelte 4, Pump.svelte):
```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let power = $state(5);
</script>
<button onclick={() => dispatch('inflate', power)}>inflate</button>
```

New (Svelte 5, parent):
```svelte
<Pump
	inflate={(power) => { size += power; }}
	deflate={(power) => { size -= power; }}
/>
```

New (Svelte 5, Pump.svelte):
```svelte
<script>
	let { inflate, deflate } = $props();
	let power = $state(5);
</script>
<button onclick={() => inflate(power)}>inflate</button>
```

### Bubbling events

Instead of `<button on:click>` to "forward" an event, the component accepts an `onclick` callback prop:

```svelte
<script>
	let { onclick } = $props();
</script>
<button {onclick}>click me</button>
```

This also means event handlers can be spread onto an element along with other props instead of forwarding each event separately.

### Event modifiers

Svelte 4: `<button on:click|once|preventDefault={handler}>...</button>`. Modifiers are specific to `on:` and do not work with modern event attributes. Prefer doing `event.preventDefault()` inside the handler. Since handlers are just functions, write wrapper functions:

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

Three modifiers (`capture`, `passive`, `nonpassive`) can't be expressed as wrapper functions since they must apply when the handler is bound. For `capture`, append to the event name: `<button onclickcapture={...}>...</button>`. Changing `passive` requires an action.

### Multiple event handlers

Svelte 4 allowed `<button on:click={one} on:click={two}>`. Duplicate attributes/properties (including event handlers) are **not allowed** in Svelte 5. Combine into one handler:

```svelte
<button onclick={(e) => { one(e); two(e); }}>...</button>
```

When spreading props, local event handlers must go after the spread or risk being overwritten:

```svelte
<button {...props} onclick={(e) => { doStuff(e); props.onclick?.(e); }}>...</button>
```

Why: `createEventDispatcher` was boilerplate-heavy (import, call to get dispatcher, call dispatcher with string + payload, retrieve payload via `.detail` because the event was always a `CustomEvent`). Callback props are now the more sensible default since DOM events use plain `onclick`-style attributes too, for syntactic consistency. Event modifier removal traded a smaller surface area for explicitness (they were also inconsistent, mostly DOM-element-only). Multiple listeners for the same event were an anti-pattern for readability and correctness (e.g. `stopImmediatePropagation` in one handler silently prevented another). Net benefits: reduced learning curve, less boilerplate, no `CustomEvent` overhead for unlistened events, spreadable handlers, ability to know which handlers were provided, ability to express required vs optional handlers, increased type safety.

## Snippets instead of slots

In Svelte 4, content is passed via `<slot />`. Svelte 5 replaces slots with snippets, which are more powerful and flexible; **slots are deprecated in Svelte 5** (they still work, and snippets can be passed to a component that uses `<slot>`, but not the reverse). Custom elements should still use `<slot>`.

### Default content

Svelte 4: `<slot />`. Svelte 5: the `children` prop, rendered with `{@render children()}`:

```svelte
<script>
	let { children } = $props();
</script>
{@render children?.()}
```

### Multiple content placeholders

Svelte 4 used named slots (`<slot name="header" />`, `<div slot="header">`). Svelte 5 uses named props, rendered with `{@render ...}`:

```svelte
<script>
	let { header, main, footer } = $props();
</script>
<header>{@render header()}</header>
<main>{@render main()}</main>
<footer>{@render footer()}</footer>
```

### Passing data back up

Svelte 4 passed data to `<slot item={entry} />` and retrieved it with `let:item` in the parent. Svelte 5 uses snippet parameters:

Svelte 4 parent: `<List items={items} let:item><span>{item}</span></List>`

Svelte 5 parent:
```svelte
<List items={['one', 'two', 'three']}>
	{#snippet item(text)}
		<span>{text}</span>
	{/snippet}
	{#snippet empty()}
		<span>No items yet</span>
	{/snippet}
</List>
```

Svelte 5 List.svelte:
```svelte
<script>
	let { items, item, empty } = $props();
</script>
{#if items.length}
	<ul>{#each items as entry}<li>{@render item(entry)}</li>{/each}</ul>
{:else}
	{@render empty?.()}
{/if}
```

Why: slots' `let:` syntax was confusing (creates a variable, unlike other `:` directives that receive one), its scope was unclear, named slots needed a `slot` attribute on an element (forcing a `<svelte:fragment>` API when you didn't want an element), and named slots on a component changed where `let:` was available in ways even maintainers found confusing. Snippets solve all of this and are more powerful: they define reusable UI sections renderable anywhere, not just passed as component props.

## Migration script

Run `npx sv migrate svelte-5` to automate most of the migration:

- bump core dependencies in `package.json`
- migrate to runes (`let` → `$state`, etc.)
- migrate to event attributes for DOM elements (`on:click` → `onclick`)
- migrate slot creations to render tags (`<slot />` → `{@render children()}`)
- migrate slot usages to snippets
- migrate obvious component creations (`new Component(...)` → `mount(Component, ...)`)

A single component can also be migrated in VS Code via the "Migrate Component to Svelte 5 Syntax" command, or in the Playground via the "Migrate" button.

Not everything migrates automatically; some migrations need manual cleanup.

### run

The migration script may convert some `$:` statements to a `run` function imported from `svelte/legacy`. This happens when the script cannot reliably determine the statement is a `$derived` and concludes it's a side effect instead. This can be wrong (should be `$derived`) or right but unsafe to convert directly to `$effect`, since `$:` statements ran on the server but `$effect` does not; `run` is a stopgap that mimics most `$:` characteristics, including running on the server.

**Note:** the raw source page continued past this point (further sections on component instantiation changes, `mount`/`unmount`, and other legacy-mode details) but the fetch was truncated at this point during archiving; treat anything past "### run" as a gap. See `references/research/distilled-svelte5.md` for the explicit gap flag.
