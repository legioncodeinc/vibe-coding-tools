# Runes fundamentals

Full field reference lives in `references/runes-reference.md`. This guide covers the decision-making, not just the syntax.

## The three-rune mental model

`$state` holds values. `$derived` computes values. `$effect` performs actions. This is the entire model; almost every bug report about "reactivity not working" or "effect looping" traces back to using the wrong one of these three for the job [raw/13-runes-community-explainer-2026.md].

Decision table [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md]:

| You want to... | Use | Why |
|---|---|---|
| Hold a value that drives UI updates | `$state` | The reactive primitive |
| Compute a value from other state | `$derived` (or `$derived.by` for multi-statement) | Pure, lazy, memoized |
| Mirror one state value into another | `$derived`, never `$effect` | The docs single this out as an anti-pattern |
| Call an API, log, touch the DOM, integrate a third-party library | `$effect` | True side effect, browser-only |
| Set up and tear down a subscription or timer | `$effect` + a returned teardown function | Teardown runs before re-run and on unmount |
| Run code before the DOM updates | `$effect.pre` | Same tracking rules, different timing |

Gut check: if an effect body ends in an assignment to a `$state` variable, that's almost always a `$derived` in disguise [raw/13-runes-community-explainer-2026.md].

## Why not just always use $effect

`$effect` is described in the official docs as an escape hatch, not a default tool [raw/02-derived-and-effect.md]. Concretely:

- `$effect` only runs in the browser (never during SSR), so if the derived-looking value needs to exist during server rendering, `$effect` silently can't provide it, while `$derived` works everywhere.
- `$effect` runs asynchronously in a microtask after state changes, batched; a `$derived` value is available synchronously the moment it's read, because it recomputes lazily on read rather than eagerly on a schedule.
- Two effects that each write to the state the other reads (a common "let me sync these two inputs" pattern) create a fragile bidirectional dependency that's easy to turn into an infinite loop or a stale-read bug. The canonical fix is to derive one value from the other and use `oninput` callbacks or function bindings, not paired effects [raw/02-derived-and-effect.md].

If you're tempted to reach for `$effect` because you want to reassign a derived value (optimistic UI, for instance), don't, `$derived` values have been directly overridable by reassignment since Svelte 5.25 [raw/02-derived-and-effect.md]. See the optimistic-UI example in `references/runes-reference.md`.

## $state.raw: the performance-conscious default for replace-only data

If you fetch a payload and only ever replace it wholesale (never mutate a nested field), `$state.raw` skips the proxy wrapping cost that `$state` pays for deep reactivity [raw/01-runes-overview-and-state.md, raw/14-svelte5-best-practices-openreplay.md]:

```js
// pays proxy overhead you'll never use, since this array is only ever replaced
let users = $state(await fetchUsers());

// no proxy cost
let users = $state.raw(await fetchUsers());
```

Use plain `$state` the moment you need to mutate a nested property directly (`cart.items[0].quantity++`); `$state.raw` requires a full reassignment to register as a change.

## Props stay in sync with $derived, not one-time assignment

A value computed from a prop needs `$derived`, not a plain assignment, or it will only ever reflect the prop's value at first render:

```svelte
<script>
	let { type } = $props();
	let color = $derived(type === 'danger' ? 'red' : 'green'); // stays in sync as `type` changes
</script>
```

[raw/14-svelte5-best-practices-openreplay.md]

## Debugging: $inspect and $inspect.trace

`$inspect(...)` is a reactive, dev-only `console.log` that re-fires on any change to its arguments, with a stack trace attached [raw/05-lifecycle-and-inspect.md]. `$inspect.trace()`, placed as the first statement inside an `$effect` or `$derived.by` body, prints exactly which piece of reactive state triggered a given re-run, useful when an effect fires more (or less) often than expected [raw/05-lifecycle-and-inspect.md, raw/14-svelte5-best-practices-openreplay.md].

## Gap flag

No source in the archive contains hard performance benchmarks (bundle size, render time) comparing runes mode against Svelte 4. A community source states runtime performance is "similar" to Svelte 4 as a qualitative claim only [raw/13-runes-community-explainer-2026.md]. Do not cite specific performance numbers without new research; see `references/research/distilled-svelte5.md` section 14, item 8.
