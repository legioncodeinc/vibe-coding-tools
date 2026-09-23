# Svelte 4 to Svelte 5 migration cheatsheet

Side-by-side table for converting Svelte 4 syntax to Svelte 5 runes mode. Grounded in `references/research/distilled-svelte5.md` section 3; every row traces to `references/research/raw/06-migration-guide.md` unless noted otherwise. Automate the bulk of this with `npx sv migrate svelte-5`, then hand-review the flagged categories at the bottom.

## Reactivity

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `let x = 0;` (implicitly reactive top-level `let`) | `let x = $state(0);` | Explicit reactivity now also works outside the component top level, e.g. in `.svelte.js`/`.svelte.ts` [raw/06-migration-guide.md, raw/12-svelte-boundary-and-universal-reactivity.md] |
| `$: double = count * 2;` | `let double = $derived(count * 2);` | A `$:` computed statement becomes `$derived` |
| `$: { sideEffect(count); }` | `$effect(() => { sideEffect(count); });` | Timing differs: `$:` ran once per tick before render; `$effect` runs after mount, then in a microtask after changes |

## Props

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `export let optional = 'x';`<br>`export let required;` | `let { optional = 'x', required } = $props();` | One `$props()` destructure replaces every `export let` |
| `export { klass as class };` | `let { class: klass } = $props();` | Renaming for reserved identifiers |
| `$$restProps` | `let { foo, bar, ...rest } = $props();` | Rest destructuring |
| `$$props` | `let props = $props();` (don't destructure) | All props, undestructured |
| Every `export let` was implicitly bindable | `let { value = $bindable() } = $props();` | Runes-mode props are **not** bindable by default; opt in explicitly with `$bindable()` |

## Events

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `<button on:click={handler}>` | `<button onclick={handler}>` | Event attributes, case-sensitive, no colon [raw/04-snippets-and-events.md] |
| `createEventDispatcher()` + `dispatch('inflate', power)` | `let { inflate } = $props();` then `inflate(power)` | `createEventDispatcher` is deprecated; callback props replace it |
| `<button on:click>` (forwarding to parent) | `let { onclick } = $props(); <button {onclick}>` | Callback props can be spread instead of forwarded event-by-event |
| `<button on:click|once|preventDefault={handler}>` | wrapper functions: `onclick={once(preventDefault(handler))}` | Modifiers removed except `capture` (→ `onclickcapture`); `passive`/`nonpassive` need an action |
| `<button on:click={one} on:click={two}>` | `onclick={(e) => { one(e); two(e); }}` | Duplicate handlers/attributes are disallowed |

## Slots to snippets

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `<slot />` | `let { children } = $props();` then `{@render children()}` | Default content [raw/04-snippets-and-events.md] |
| `<slot name="header" />` | `let { header } = $props();` then `{@render header()}` | Named slots become named snippet props |
| `<Widget>content</Widget>` | same markup; `content` implicitly becomes the `children` prop | No syntax change needed on the caller side for the simplest case |
| `<List let:item>{item}</List>` (passing data up) | `<List>{#snippet item(text)}{text}{/snippet}</List>` | Snippet parameters replace `let:` |

## Lifecycle

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `beforeUpdate(fn)` | `$effect.pre(() => { ... });` | Shimmed for backward compat but **unavailable in runes-mode components** [raw/05-lifecycle-and-inspect.md] |
| `afterUpdate(fn)` | `$effect(() => { ... });` | Same caveat |
| `onMount(fn)` | unchanged | Still the right tool for one-time setup; still browser-only |
| `onDestroy(fn)` | unchanged | Still the only classic hook that also runs during SSR |

## Component instantiation

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `new Component({ target, props })` | `mount(Component, { target, props })` (from `'svelte'`) | Migration script converts this automatically |

## What the migration script does NOT convert automatically

Run `npx sv migrate svelte-5` first, it bumps dependencies, converts `let`→`$state`, `on:click`→`onclick`, slot creation→render tags, slot usage→snippets, and obvious `new Component()`→`mount()` calls. Then hand-review:

- **Ambiguous `$:` statements.** When the script can't tell whether a `$:` is a derivation or a side effect, it wraps it in a `run()` shim imported from `svelte/legacy` instead of guessing. `run()` behaves like `$:` did (runs once on the server, then as `$effect.pre` on the client), which is a safe stopgap but not the end state. Classify it yourself: producing a value → `$derived`; performing an action → `$effect` [raw/06-migration-guide.md, raw/13-runes-community-explainer-2026.md].
- **`createEventDispatcher` usage.** Not auto-converted, the script can't verify who listens for the dispatched event without risking breakage for consumers. Convert to callback props by hand.
- **`beforeUpdate`/`afterUpdate`.** Not auto-converted, intent (derivation vs. side effect vs. DOM measurement) is ambiguous from the callback body alone. Convert by hand to `$effect.pre`/`$effect`, using the pattern in `guides/04-component-lifecycle.md`.

## Gap flag

The migration guide's own coverage of `bind:` default-value semantics, hydration-mismatch handling (`src`/`{@html}` no longer auto-repaired, dev warns instead), and comment-preservation requirements for hydration was only partially captured in this archive's raw fetch (truncated mid-page); see `references/research/distilled-svelte5.md` section 14, item 4, before asserting specifics beyond what's in this cheatsheet.
