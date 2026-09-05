# vitest-browser-svelte and Vitest component/unit testing for Svelte 5

- URL: https://vitest.dev/api/browser/svelte ; https://svelte.dev/docs/svelte/testing
- Fetched: 2026-08-14
- Source type: Official docs (vitest.dev, svelte.dev)
- Component: Component and unit testing setup for Svelte 5 / SvelteKit

## Content

### Two current, valid setups (neither is deprecated)

1. **`@testing-library/svelte` on jsdom** - higher-level, familiar Testing Library API, supports Svelte 3/4/5, runs in a simulated DOM (fast, no real browser needed).
2. **`vitest-browser-svelte`** - a community package (`vitest-community` org) that renders components in Vitest's Browser Mode (a real browser via Playwright). Requires **Vitest 4.0.0 or higher**. Browser Mode itself graduated out of experimental status in Vitest 4 - any guidance still calling it experimental is stale.

### `vitest-browser-svelte` usage

```ts
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Component from './Component.svelte'

test('counter button increments the count', async () => {
  const screen = await render(Component, { initialCount: 1 })
  await screen.getByRole('button', { name: 'Increment' }).click()
  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

Key API facts:
- `render()` must always be `await`ed - synchronous usage is deprecated and slated for removal in the next major version.
- Returns locators that auto-retry until an assertion succeeds, even across component re-renders - this is the documented advantage over `@testing-library/svelte`, which lacks Vitest's built-in retry-ability.
- Two entry points: `vitest-browser-svelte` (auto-cleans up the component before the *next* test starts) and `vitest-browser-svelte/pure` (no auto-cleanup, useful when you want to inspect the rendered result).
- Exposes `rerender(props)` to update props and wait for Svelte to apply changes, and `unmount()` (also must be awaited) to test cleanup/memory-leak behavior.
- For snippets: simple cases use a wrapper component with `data-testid` "dummy" children; complex snippets (where you need to inspect arguments passed into the snippet) use Svelte's `createRawSnippet` API directly in the test.

### Vitest 4 config for Browser Mode (breaking change from Vitest 2/3)

As of Vitest 4, browser provider packages install separately and the config shape changed:

```ts
// vite.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [svelte()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    }
  }
});
```

The older `provider: 'playwright', name: 'chromium'` string-based form (Vitest 2-era) is deprecated and no longer correct - guidance using that shape is stale.

### `@testing-library/svelte` on jsdom for Svelte 5

```ts
// vite.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: { environment: 'jsdom' }
});
```

The `svelteTesting` Vite plugin (from `@testing-library/svelte/vite`) sets the required browser resolve condition automatically AND auto-cleans the DOM after each test - so no manual `afterEach(cleanup)` is needed, and no manual `resolve.conditions` config either (writing both is redundant/conflicting). `svelte-jester` (a Jest-only shim) is unnecessary noise if the project is on Vitest; ignore any tutorial that includes it.

### Choosing jsdom vs real-browser mode

| | jsdom + `@testing-library/svelte` | `vitest-browser-svelte` |
|---|---|---|
| Environment | Simulated DOM | Real browser via Playwright |
| Speed/setup | Fast, no browser download | Heavier per test; needs a browser binary |
| Browser APIs | Shimmed/mocked | Native (layout, focus, `IntersectionObserver`, etc.), no mocking needed |
| Sync flushing | Often needs `flushSync` | Locators auto-retry; rarely needed |
| Requires | Svelte 3/4/5 | Vitest 4 |

Recommended split: jsdom for fast tests of markup/logic; browser mode specifically when a test genuinely depends on real browser behavior the jsdom shim can't reproduce.

### Svelte 5 runes in test files

Since Vitest processes test files through the same Svelte-aware pipeline as source, runes (`$state`, `$derived`, `$effect`, `$props`) work directly inside a test file **as long as the filename includes `.svelte`** (e.g. `counter.svelte.test.ts`) - this is what routes the file through the Svelte compiler. A plain `.test.ts` file cannot use runes.

Effects specifically don't run synchronously - the official pattern wraps effect-using code in `$effect.root()` and calls `flushSync()` before asserting:

```ts
test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);
		let log = logger(() => count);
		flushSync();
		expect(log).toEqual([0]);
		count = 1;
		flushSync();
		expect(log).toEqual([0, 1]);
	});
	cleanup();
});
```

### Should you even write a component test?

Official Svelte guidance, stated directly: before writing a component test, "think about whether you actually need to test the component, or if it's more about the logic inside the component. If so, consider extracting out that logic to test it in isolation, without the overhead of a component." Pure logic extracted into a `.svelte.js`/`.svelte.ts` module can be unit-tested directly (with runes, if the test filename includes `.svelte`) with no rendering overhead at all.

### Low-level `mount`/`unmount` API

Svelte exposes `mount()`/`unmount()` directly as the primitive underneath both testing-library-style helpers. The docs explicitly warn this raw API is "low level and somewhat brittle" because tests written against it tend to assert on exact `innerHTML`, which is fragile to compiler/markup changes - `@testing-library/svelte` or `vitest-browser-svelte` are the recommended layer for actual test authoring, not raw `mount`/`unmount`.

### End-to-end tests: Playwright

Svelte's own testing docs frame E2E as a separate concern from unit/component tests, using Playwright as the worked example (Cypress and NightwatchJS are named as valid alternatives - Svelte is explicitly unopinionated on which E2E tool). Setup via `npx sv add playwright` (Svelte CLI) or `npm init playwright` manually. Playwright config typically needs to be told how to start the app before running tests (e.g. build + preview on a fixed port); E2E tests interact only with the DOM/network, with no Svelte-specific test API - "these are totally unaware of Svelte as a framework."

```ts
import { expect, test } from '@playwright/test';
test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

### Storybook as a third component-testing surface

Storybook can also be used for component testing, and as of the current Svelte docs it runs on Vitest's Browser Mode under the hood (same real-browser rendering as `vitest-browser-svelte`) rather than its own separate runner. Installed via `npx sv add storybook`.
