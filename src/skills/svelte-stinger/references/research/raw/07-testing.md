# Testing Svelte 5 (Vitest, @testing-library/svelte, vitest-browser-svelte)
- URL: https://svelte.dev/docs/svelte/testing ; https://testing-library.com/docs/svelte-testing-library/setup/ ; https://vitest.dev/api/browser/svelte
- Fetched: 2026-08-14
- Source type: official docs (svelte.dev) + community (testing-library.com, vitest.dev)
- Component: testing

## Svelte official testing docs (https://svelte.dev/docs/svelte/testing)

Note: the raw fetch of this page interleaved some unrelated Node.js `process.env` API-reference boilerplate into the scraped text (an artifact of the docs site's interactive code-sample widget). That noise has been stripped below; only the Svelte-specific testing content is retained.

Testing helps you write and maintain your code and guard against regressions. Svelte is unopinionated about which testing framework you use, you can write unit, integration, and end-to-end tests using solutions like Vitest, Jasmine, Cypress and Playwright.

### Unit and component tests with Vitest

Unit tests test small isolated parts of your code. Integration tests test parts of your application working together. If you're using Vite (including via SvelteKit), the Svelte team recommends Vitest. Setup manually with `npm install -D vitest`, then adjust `vite.config.js` (the docs example shows resolving the `browser` condition for `VITEST` env so packages resolve their browser build during tests; alias config may be needed if you also test backend libraries that shouldn't load browser builds).

You can write unit tests for code inside `.js`/`.ts` files:

```js
// multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
	double.set(5);
	expect(double.value).toEqual(10);
});
```

```js
// multiplier.svelte.js
export function multiplier(initial, k) {
	let count = $state(initial);
	return {
		get value() {
			return count * k;
		},
		set: (c) => {
			count = c;
		}
	};
}
```

#### Using runes inside your test files

Since Vitest processes test files the same way as source files, you can use runes inside tests as long as the filename includes `.svelte` (e.g. `multiplier.svelte.test.js`):

```js
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

If the code being tested uses effects, wrap the test inside `$effect.root`:

```js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { logger } from './logger.svelte.js';

test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);
		let log = logger(() => count);

		// effects normally run after a microtask;
		// use flushSync to execute all pending effects synchronously
		flushSync();
		expect(log).toEqual([0]);

		count = 1;
		flushSync();
		expect(log).toEqual([0, 1]);
	});

	cleanup();
});
```

#### Component testing

You can test components in isolation, rendering them in a real or simulated browser, simulating behavior, and making assertions, without spinning up the whole app. Before writing component tests, consider whether the logic under test could be extracted out of the component and tested in isolation instead, without component overhead.

Install jsdom (`npm install -D jsdom`), adjust `vite.config.js` for the jsdom test environment, then use Svelte's `mount`/`unmount`/`flushSync` APIs directly:

```js
import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', () => {
	const component = mount(Component, {
		target: document.body, // document exists because of jsdom
		props: { initial: 0 }
	});

	expect(document.body.innerHTML).toBe('0');

	// click the button, then flush the changes so you can synchronously write expectations
	document.body.querySelector('button')?.click();
	flushSync();

	expect(document.body.innerHTML).toBe('1');

	unmount(component);
});
```

`unmount(component, { outro: true })` (since Svelte 5.13.0) plays transitions before removal and returns a `Promise` that resolves once they complete; before 5.13.0 it returned `void`.

This low-level API is described as straightforward but "brittle" since it's coupled to exact DOM structure. Tools like `@testing-library/svelte` are recommended to streamline component tests.

The Svelte docs also mention **Storybook** for component tests: Storybook is run with Vitest's browser mode, rendering components in a real browser via the play function and Testing Library integration. And **Playwright** for end-to-end tests, set up via the Svelte CLI (`npx sv add playwright`); Playwright is described as unaware of Svelte specifics, testing the app as a real user would in the browser.

## @testing-library/svelte setup (https://testing-library.com/docs/svelte-testing-library/setup/)

Recommends Vitest, but works with any ESM-compatible test runner.

### Vitest setup

```bash
npm install --save-dev @testing-library/svelte @testing-library/jest-dom @sveltejs/vite-plugin-svelte vitest jsdom
```

Optional: `npm install --save-dev @vitest/ui`.

`vitest-setup.js`:
```js
import '@testing-library/jest-dom/vitest'
```

`vitest.config.js` (or `vite.config.js`):
```js
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
  },
})
```

For SvelteKit, swap `svelte()` for `sveltekit()`:
```js
import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [sveltekit(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
  },
})
```

The `svelteTesting` Vite plugin auto-cleans up rendered components after each test and resolves the `browser` condition; both behaviors can be disabled individually: `svelteTesting({ autoCleanup: false, resolveBrowser: false })`. Resolving the `browser` condition can cause issues with complex Vite configs or Node-incompatible dependencies (see testing-library/svelte-testing-library#222).

`package.json` scripts:
```json
{ "scripts": { "test": "vitest run", "test:ui": "vitest --ui", "test:watch": "vitest" } }
```

TypeScript: add `"types": ["@testing-library/jest-dom"]` to `tsconfig.json` `compilerOptions`.

### Jest setup

`@testing-library/svelte` is ESM-only, so Jest must run in ESM mode.

```bash
npm install --save-dev @testing-library/svelte @testing-library/jest-dom svelte-jester jest jest-environment-jsdom
```

`jest-setup.js`:
```ts
import '@testing-library/jest-dom'
```

`jest.config.js`:
```js
export default {
  transform: { '^.+\\.svelte$': 'svelte-jester' },
  moduleFileExtensions: ['js', 'svelte'],
  extensionsToTreatAsEsm: ['.svelte'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
}
```

**If using Svelte 5**, you must use `svelte-jester@5`+ and adjust the transform pattern and add a `transformIgnorePatterns` entry:

```diff
  export default {
    transform: {
-     '^.+\\.svelte$': 'svelte-jester',
+     '^.+\\.svelte(\\.(js|ts))?$': 'svelte-jester',
    },
+   transformIgnorePatterns: [
+     '/node_modules/(?!@testing-library/svelte/)',
+   ],
    moduleFileExtensions: ['js', 'svelte'],
    extensionsToTreatAsEsm: ['.svelte'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  }
```

`package.json`:
```json
{ "scripts": { "test": "npx --node-options=\"--experimental-vm-modules\" jest src" } }
```

TypeScript with Jest requires `svelte-preprocess` and `ts-jest` (see svelte-jester docs).

**Cleanup:** in Vitest (via `svelteTesting` plugin) and Jest (via `beforeEach`/`afterEach` globals), the library auto-sets-up and cleans up the test environment before/after each test. `@testing-library/svelte` supports Svelte 3, 4, and 5.

## vitest-browser-svelte (https://vitest.dev/api/browser/svelte)

Community package that renders Svelte components in Vitest's Browser Mode (real browser, not jsdom). Takes inspiration from `@testing-library/svelte` but returns APIs that interact with Vitest's built-in locators, user events, and assertions, e.g. Vitest auto-retries an element until an assertion succeeds, even across rerenders. Two entry points: `vitest-browser-svelte` and `vitest-browser-svelte/pure` (the `pure` entry skips the automatic pre-next-test component removal).

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

`render` is async; synchronous usage is deprecated and will be removed in the next major version, always `await render(...)`.

`render` accepts `props`, `target` (defaults to a `div` appended to `document.body`; supply your own container, e.g. a `<table>` when testing `<tbody>` fragments, and append it yourself first), and a third `baseElement` argument (rarely needed; defaults to `target` or `document.body`, used as the base for locator queries and `debug()` output).

Render result includes: `container` (raw DOM node; avoid querying it directly, prefer locators), `component` (the mounted Svelte component instance, for accessing exports), `locator` (scoped locator for the container), `debug()` (prints `prettyDOM(baseElement)`), `rerender(props)` (updates props and awaits Svelte's update, records a `svelte.rerender` trace mark), and `unmount()` (destroys the component; async, records a `svelte.unmount` trace mark; useful for testing cleanup of event handlers/effects).

A top-level `cleanup()` function removes all components rendered with `render`.

Custom locators can be added via `locators.extend(...)` from `vitest/browser`.

### Testing snippets with vitest-browser-svelte

For simple snippets, use a wrapper component with "dummy" children and `data-testid` attributes:

```svelte
<!-- basic-snippet.svelte -->
<script>
  let { children } = $props()
</script>
<h1>{@render children?.()}</h1>
```

```svelte
<!-- basic-snippet.test.svelte -->
<script>
  import Subject from './basic-snippet.svelte'
</script>
<Subject><span data-testid="child"></span></Subject>
```

```ts
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import SubjectTest from './basic-snippet.test.svelte'

test('basic snippet', async () => {
  const screen = await render(SubjectTest)
  const heading = screen.getByRole('heading')
  const child = heading.getByTestId('child')
  await expect.element(child).toBeInTheDocument()
})
```

For complex snippets where you need to check arguments passed into the snippet, use Svelte's `createRawSnippet` API:

```ts
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import { expect, test } from 'vitest'
import Subject from './complex-snippet.svelte'

test('renders greeting in message snippet', async () => {
  const screen = await render(Subject, {
    name: 'Alice',
    message: createRawSnippet(greeting => ({
      render: () => `<span data-testid="message">${greeting()}</span>`,
    })),
  })
  const message = screen.getByTestId('message')
  await expect.element(message).toHaveTextContent('Hello, Alice!')
})
```

```svelte
<!-- complex-snippet.svelte -->
<script>
  let { name, message } = $props()
  const greeting = $derived(`Hello, ${name}!`)
</script>
<p>{@render message?.(greeting)}</p>
```
