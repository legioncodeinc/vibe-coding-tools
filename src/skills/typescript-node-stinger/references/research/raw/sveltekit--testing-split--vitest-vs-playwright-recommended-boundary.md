# SvelteKit testing split: what goes in Vitest vs what goes in Playwright

- URL: https://helpmetest.com/blog/testing-sveltekit/ ; https://github.com/sveltejs/kit/discussions/5285
- Fetched: 2026-08-14
- Source type: Blog (practitioner guide, 2026-05-13) + official SvelteKit maintainer/community discussion thread
- Component: Test-layer boundary decision (unit/component vs E2E)

## Content

### The 2026 consensus setup

"This is the testing setup that works for SvelteKit in 2026: Vitest for unit and component tests, `@testing-library/svelte` for behavior-focused component tests, and Playwright for E2E." SvelteKit's own scaffolding (`npm create svelte@latest`) offers opting into a `@playwright/test` integration at project-creation time, or it can be added manually.

### Maintainer-level reasoning for the split (from the SvelteKit GitHub discussion that originally decided this)

Direct quote from a SvelteKit core contributor in the discussion thread that settled this: "I think that both, Vitest and Playwright are necessary for comprehensive testing. To differentiate between the two: Vitest for component tests, where every dependency is mocked (and 'normal' unit tests for business code of course). Playwright for end-to-end tests, where nothing is mocked (or at most outgoing HTTP calls)." This mocked-vs-unmocked distinction is the actual decision rule, not "Vitest is for small things, Playwright is for big things."

Community consensus that emerged in the same thread: use Vitest for testing individual parts (the `lib` folder - business logic, components in isolation), and Playwright for testing the application as a whole through the routes folder (full request/response cycle, real routing, real forms).

### Playwright config for a SvelteKit app

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

Playwright drives the **built and previewed** app (`npm run build && npm run preview`), not the dev server - this exercises the actual production build path (adapter output, SSR behavior as it will really run) rather than Vite's dev-mode behavior, which can differ. `reuseExistingServer: !process.env.CI` avoids relaunching a server that's already running locally during iterative test-writing, while always launching fresh in CI.

### Recommended cadence: don't run E2E on every commit

"Run E2E tests with `npx playwright test`. Add them to CI on pull requests against staging, not every commit - they take 20-60 seconds per test file." This is a direct, practical recommendation: Vitest unit/component tests belong in the fast inner loop (every commit/every push), Playwright E2E belongs on PR-gate or staging-deploy CI, not as a per-commit blocker, because of the wall-clock cost of spinning up a real browser and a built server per test file.

### What neither layer catches (explicitly named gap, relevant to a Ship Gate conversation)

The blog explicitly lists failure classes that pass both Vitest and Playwright but still happen in production: a third-party API a `load` function depends on going down or changing its response shape; a deployment introducing a build error that breaks SSR on specific routes only; a race condition in form submission under real network latency; a browser-compatibility issue jsdom can't reproduce; a slow page load after a dependency bump causing real-user bounce. The stated fix is synthetic monitoring against the real production URL on a schedule - out of scope for this skill's guides, but worth naming explicitly as a known gap rather than implying Vitest+Playwright is a complete safety net.

### `$app/*` runtime module mocking (a recurring SvelteKit-testing footgun, from the same discussion thread)

Testing code that imports SvelteKit runtime modules (`$app/stores`, `$app/navigation`, `$app/forms`, etc.) inside a component or unit test requires mocking them explicitly - they don't exist outside a real SvelteKit request context. The documented working pattern uses Vitest's mock capability directly:

```ts
vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
  prerender: false,
}));
```

A `+page.server.ts` `load` function is not automatically invoked by Vitest when rendering the corresponding `+page.svelte` in a component test (Vitest has no SvelteKit router context) - the documented workaround is to call `load()` directly in the test and feed its return value into the component's `data` prop by hand:

```ts
import { load } from './+page.server'
// ...
const data = load()
render(Page, { props: { data } })
```

This is a load-bearing detail: component tests for pages with server `load` functions require manually bridging the load-function output into the render call, they do not "just work" the way an E2E test against a real running server does.
