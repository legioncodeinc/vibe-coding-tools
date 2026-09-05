# Svelte 5 Runes Explained: $state, $derived, $effect (2026)
- URL: https://nerdleveltech.com/svelte-5-runes-explained
- Fetched: 2026-08-14
- Source type: blog (community, secondary; cites svelte.dev docs throughout via numbered footnotes)
- Component: runes, performance, common-mistakes

Published 2026-06-19. States Svelte 5 has been stable since October 19, 2024, at version 5.56.x as of June 2026. Article is footnoted against svelte.dev docs; footnote citations preserved below as "[svelte.dev docs]" since the underlying claims are themselves grounded in official sources this archive has independently captured (see raw/01, raw/02).

## Framing

Runes are $-prefixed compiler keywords, not imports, valid only inside `.svelte`, `.svelte.js`, and `.svelte.ts` files. Svelte 5 ships seven runes: `$state`, `$derived`, `$effect`, `$props`, `$bindable`, `$inspect`, `$host`. Before runes, Svelte 4 made every top-level `let` in a component reactive and used `$:` for computed values, concise but "magical": reactivity depended on where code lived. Runes make reactivity explicit and portable, the same `$state` works inside a component or inside a plain `.svelte.js` module, enabling shared reactive logic outside components entirely.

## $derived vs $effect decision table (community synthesis, matches official "when not to use $effect" guidance)

| You want to... | Use | Why |
|---|---|---|
| Compute a value from state | `$derived` | Pure, lazy, memoized; recomputed only when read |
| Multi-statement computation | `$derived.by` | Same as `$derived` but with a function body |
| Mirror one state value into another | `$derived` | Never `$effect`, docs single this out as an anti-pattern |
| Call an API / log / touch the DOM | `$effect` | True side effect, browser-only |
| Set up and tear down a subscription/timer | `$effect` + teardown | Return a cleanup function |
| Run code before the DOM updates | `$effect.pre` | Runs before DOM updates |

Gut check offered: "if your effect body ends in an assignment to another `$state`, you almost certainly want `$derived` instead."

## Migration mapping (mechanical, matches official migration guide)

- Reactive `let x = 0` → `let x = $state(0)`
- `$: doubled = x * 2` (computed) → `let doubled = $derived(x * 2)`
- `$: { sideEffect(x); }` (side effect) → `$effect(() => { sideEffect(x); })`
- `export let name` → `let { name } = $props()`
- `export let value` with `bind:` → `let { value = $bindable() } = $props()`

"The one judgment call is the old `$:` label, which Svelte 4 used for both computed values and side effects. Split it: anything that produces a value becomes `$derived`; anything that performs an action becomes `$effect`. When in doubt, choose `$derived`, it's the cheaper, safer default."

## Universal reactivity pattern (shared state via .svelte.js)

```js
// counter.svelte.js
let count = $state(0);

export function getCount() {
  return count;
}
export function increment() {
  count++;
}
```

This is the accessor-function workaround for the "cannot export reassigned `$state`" restriction documented in the official `$state` page (see raw/12): wrap the mutable binding behind exported functions instead of exporting the reactive variable directly.

## Do stores still work?

Yes. `writable`, `readable`, `derived`, and the `$store` auto-subscription syntax from `svelte/store` still work in Svelte 5 and are not deprecated. Official recommendation (per the article's paraphrase) is to prefer runes for most component and shared state, but stores remain useful for existing code and RxJS-style external subscriptions; both coexist, so no big-bang rewrite is required.

## Bottom line

"Svelte 5 runes turn reactivity from compiler magic into three explicit tools: `$state` for values, `$derived` for computed values, and `$effect` for side effects, with `$props`/`$bindable` for component inputs. A simple rule that avoids a whole class of bugs is to reach for `$derived` before `$effect`, and to treat `$effect` as an escape hatch for things like network requests and DOM work rather than a way to keep state in sync."
