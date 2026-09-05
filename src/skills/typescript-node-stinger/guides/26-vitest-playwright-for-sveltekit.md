# 26 - Vitest (unit + component) and Playwright (e2e) for SvelteKit

**Primary context: SvelteKit app on Vercel.** This guide broadens the Hivemind-era Vitest guides (`guides/10-vitest-discipline.md`, `guides/11-vitest-async-fixtures.md` - which remain valid for the npm-library/CLI secondary case and for plain `.ts` unit tests in this app too) with SvelteKit-specific component testing and the Vitest/Playwright split.

## The 2026 consensus setup

Vitest for unit and component tests; `@testing-library/svelte` or `vitest-browser-svelte` for component-level behavior tests; Playwright for end-to-end. This is the current recommended split for a SvelteKit app - not a Hivemind-specific choice, this repo's actual testing stack. Source: `references/research/raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md`.

## The decision rule: mocked vs unmocked, not "small vs big"

Per SvelteKit's own maintainers: "Vitest for component tests, where every dependency is mocked ... Playwright for end-to-end tests, where nothing is mocked (or at most outgoing HTTP calls)." Use this as the actual test-placement rule during a review, not test file size or perceived importance. A "unit test" that spins up a real HTTP server to hit a real database belongs in the Playwright/e2e layer regardless of how small it looks; a component test that mocks its data layer belongs in Vitest regardless of how much markup it covers.

## Two current, valid component-test setups (neither is deprecated)

1. **`@testing-library/svelte` on jsdom** - simulated DOM, fast, no browser download, supports Svelte 3/4/5.
2. **`vitest-browser-svelte`** - real browser via Playwright, requires Vitest 4+. Browser Mode is stable (not experimental) as of Vitest 4 - treat any guidance still calling it experimental as stale.

Pick per test: jsdom for fast markup/logic tests; browser mode specifically when a test depends on real browser behavior jsdom can't reproduce (layout, focus, `IntersectionObserver`).

### `@testing-library/svelte` setup (Svelte 5)

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: { environment: 'jsdom' }
});
```

The `svelteTesting` plugin sets the browser resolve condition AND auto-cleans the DOM after each test. Do not also hand-write `resolve.conditions` - that's redundant with what the plugin already does, and a common source of confusing double-setup in a config a reviewer inherits.

### `vitest-browser-svelte` setup (Vitest 4 shape - the old form is deprecated)

```ts
// vite.config.ts
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

The older `provider: 'playwright', name: 'chromium'` string form (Vitest 2-era) is deprecated - flag it as a **should-refactor** if found in a config, since it will stop working on a Vitest 4+ upgrade.

```ts
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Counter from './Counter.svelte'

test('increments', async () => {
  const screen = await render(Counter, { initialCount: 1 })
  await screen.getByRole('button', { name: 'Increment' }).click()
  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

`render()` and `unmount()` must always be `await`ed - synchronous usage is deprecated. Locators auto-retry until an assertion succeeds, even across re-renders, which is the documented advantage over `@testing-library/svelte`.

## Runes in test files

Runes (`$state`, `$derived`, `$effect`, `$props`) only work inside a test file if the **filename itself includes `.svelte`** (e.g. `counter.svelte.test.ts`) - that's what routes it through the Svelte compiler. A plain `.test.ts` file cannot use runes at all; if the code under test needs runes, either the test file needs the `.svelte.test.ts` naming or the reactive logic under test should be exercised through a component-render helper instead.

Effects don't run synchronously - wrap effect-using code in `$effect.root()` and call `flushSync()` before asserting:

```ts
test('effect logs updates', () => {
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

## Should you write a component test at all?

Official guidance, worth applying as a review gate: before reaching for a component test, ask whether the thing under test is really component behavior or is actually just logic. If it's logic, extract it into a `.svelte.js`/`.svelte.ts` module and unit-test it directly (with runes available, since the filename includes `.svelte`) without the overhead of mounting a component. A component test whose assertions never touch rendered markup, events, or DOM state - only internal logic that could have been extracted - is a **should-refactor**: pull the logic out, test it directly.

## `$app/*` runtime module mocking

SvelteKit runtime modules (`$app/environment`, `$app/stores`, `$app/navigation`, `$app/forms`) don't exist outside a real SvelteKit request/router context and must be mocked explicitly in unit/component tests:

```ts
vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
  prerender: false,
}));
```

A component or unit test importing a module that touches `$app/*` without mocking it is a **must-fix** - it will fail at import time, not just produce a wrong assertion.

## Server `load` functions don't run automatically in a component test

Vitest has no SvelteKit router context, so rendering a page component in a test does not automatically invoke its `+page.server.ts` `load` function. The working pattern is to call `load()` directly and feed the result into the component's `data` prop by hand:

```ts
import { load } from './+page.server'
const data = load()
render(Page, { props: { data } })
```

A component test for a page with a server `load` that either skips exercising `load` entirely or fakes `data` with a shape that doesn't match what `load` actually returns is a **should-refactor** - use the real `load()` output.

## Playwright for end-to-end

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:4173' },
});
```

Playwright drives the **built and previewed** app, not the dev server - this exercises the real adapter/SSR output path (what will actually run on Vercel), which can differ from Vite's dev-mode behavior. A Playwright config pointed at the dev server instead of build+preview is a **should-refactor** - it's testing a different code path than production.

E2E tests are "totally unaware of Svelte as a framework" - they interact with the DOM and network like a real user, with no Svelte-specific test API:

```ts
import { expect, test } from '@playwright/test';

test('contact form validates email', async ({ page }) => {
	await page.goto('/contact');
	await page.fill('[name="message"]', 'A valid message body.');
	await page.click('[type="submit"]');
	await expect(page.getByText(/valid email is required/i)).toBeVisible();
});
```

## Cadence: don't gate every commit on Playwright

Run Playwright E2E on PR-gate or staging-deploy CI, not on every commit - each test file costs roughly 20-60 seconds of wall clock for a real browser + built server. Keep Vitest unit/component tests in the fast inner loop (every commit/push). A CI pipeline running the full Playwright suite on every single commit to a feature branch (rather than on PR-gate) is a **should-refactor** worth flagging in a CI review, not a hard blocker.

## What neither layer catches (name this explicitly, don't imply full coverage)

Vitest and Playwright together still miss: a third-party API a `load` function depends on going down or changing shape in production; a build error breaking SSR on specific routes only; a race condition under real network latency; a genuine cross-browser compatibility gap jsdom can't reproduce; real-user page-load slowness. These require synthetic monitoring against the live production URL - out of scope for this skill, but worth naming so a "we have tests" claim doesn't overstate coverage during a Ship Gate conversation.

## Common findings

- Deprecated `provider: 'playwright', name: 'chromium'` Vitest browser-mode config - **should-refactor**.
- Hand-written `resolve.conditions` alongside the `svelteTesting` plugin (redundant/conflicting) - **should-refactor**.
- A `.test.ts` file (not `.svelte.test.ts`) attempting to use runes - **must-fix** (won't compile/run correctly).
- A test importing `$app/*` without mocking it - **must-fix**.
- A component test for a page with a server `load` that fakes `data` instead of calling the real `load()` - **should-refactor**.
- Playwright pointed at the dev server instead of build+preview - **should-refactor**.
- Full Playwright suite gating every commit instead of PR/staging CI - **should-refactor**.
- A component test that only exercises extractable logic, never rendered behavior - **should-refactor**.

## Sources

- `references/research/raw/sveltekit--testing--vitest-browser-svelte-component-testing.md`
- `references/research/raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md`
- `references/research/distilled-typescript-node.md` section 5
- `guides/10-vitest-discipline.md`, `guides/11-vitest-async-fixtures.md` for the npm-library/CLI Vitest discipline that still applies to plain `.ts` code in this app too
