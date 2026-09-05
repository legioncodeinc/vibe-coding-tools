# Testing and performance

## Testing setup: Vitest first

Svelte is testing-framework agnostic, but the official docs recommend Vitest for any Vite-based project, which includes every SvelteKit app [raw/07-testing.md].

### Runes inside test files

Vitest processes test files the same way it processes source files, so a test file can use runes directly, as long as the filename includes `.svelte` (e.g. `multiplier.svelte.test.js`, not `multiplier.test.js`) [raw/07-testing.md]:

```js
// multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let count = $state(0);
	let double = multiplier(() => count, 2);
	expect(double.value).toEqual(0);
	count = 5;
	expect(double.value).toEqual(10);
});
```

If the code under test uses `$effect`, wrap the test body in `$effect.root(() => {...})` and call `flushSync()` after state changes, since effects normally run in a batched microtask and the test needs them to run synchronously to make assertions [raw/07-testing.md]. See `references/research/raw/07-testing.md` for the full worked `logger.svelte.js` example.

### Component testing: low-level vs. library-assisted

Svelte's own `mount`/`unmount`/`flushSync` APIs against a jsdom `document.body` work, but the docs themselves call this approach "brittle," since it's coupled to exact DOM structure [raw/07-testing.md]. Two community libraries streamline this:

- **`@testing-library/svelte`** (supports Svelte 3, 4, and 5): set up via the `svelteTesting` Vite plugin, which auto-cleans up rendered components after each test and resolves the `browser` condition (both individually toggleable). If targeting Svelte 5 under Jest specifically, you need `svelte-jester@5+` with an adjusted transform regex (`'^.+\\.svelte(\\.(js|ts))?$'`) and an added `transformIgnorePatterns` entry, the plain Svelte-4-era Jest config silently breaks on `.svelte.js`/`.svelte.ts` files [raw/07-testing.md].
- **`vitest-browser-svelte`**: renders components in Vitest's real-browser Browser Mode rather than jsdom, and returns locator-based APIs that auto-retry assertions against rerendered elements, useful for components with async state transitions. Supports snippet testing via a wrapper component with `data-testid` markers for simple cases, or `createRawSnippet` when you need to assert on the arguments passed into a snippet [raw/07-testing.md].

Default to `@testing-library/svelte` for most component tests (broad Svelte-version support, mature ecosystem); reach for `vitest-browser-svelte` when jsdom's simulated DOM isn't faithful enough for what you're testing (real layout, real CSS, real browser event timing).

### What the docs mention but this archive didn't capture in depth

Storybook (run via Vitest's browser mode plus Testing Library's play function) and Playwright (framework-unaware end-to-end testing, set up via `npx sv add playwright`) are both named as supported testing layers in the official docs, but not documented beyond that mention in this archive [raw/07-testing.md]. Don't cite specifics about Storybook or Playwright Svelte integration without a fresh docs check.

## Performance patterns

### The dominant pattern: prefer $derived over $effect

This is not a minor style preference, it's the single most repeated piece of guidance in the entire archive, appearing independently in the official `$effect` docs and in two unrelated community sources written months apart [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md, raw/14-svelte5-best-practices-openreplay.md]. `$derived` is lazy (only recomputes when read) and referentially memoized (skips notifying dependents if the recomputed value is identical to the last one); `$effect` runs unconditionally on a microtask schedule whenever its dependencies change, whether or not anything is currently reading the result. See `guides/01-runes-fundamentals.md` for the full decision table.

### $state vs $state.raw

Use plain `$state` when you need fine-grained reactivity on nested mutations (`cart.items[0].quantity++`). Use `$state.raw` when the value is only ever replaced wholesale (a freshly fetched API response you reassign but never mutate in place), it skips the proxy-wrapping cost entirely [raw/14-svelte5-best-practices-openreplay.md].

### Keyed {#each} blocks

A community source restates the general Svelte list-rendering best practice for Svelte 5: key `{#each}` blocks by a stable unique ID, never by array index, to avoid DOM-recycling bugs where Svelte reuses the wrong DOM node for the wrong data after a reorder. This specific claim was not independently cross-checked against an official `{#each}` doc page in this archive, treat it as a widely-held convention rather than a directly-cited official rule [raw/14-svelte5-best-practices-openreplay.md].

### Debugging re-renders

`$inspect.trace()`, placed as the first statement in an `$effect` or `$derived.by` body, prints which specific piece of reactive state caused that block to re-run, useful for tracking down an effect that fires more often (or less often) than expected [raw/05-lifecycle-and-inspect.md, raw/14-svelte5-best-practices-openreplay.md].

## Gap flag: no benchmark numbers

Nothing in this archive contains hard performance benchmarks (bundle size deltas, render-time measurements) comparing Svelte 5 runes mode against Svelte 4. A community source describes runtime performance as "similar" to Svelte 4, explicitly qualitative, not a benchmark: "the compiler still produces efficient JavaScript; the main difference is what you write, not what the browser runs" [raw/13-runes-community-explainer-2026.md]. Do not state specific performance numbers for Svelte 5 without commissioning new research; see `references/research/distilled-svelte5.md` section 14, item 8.
