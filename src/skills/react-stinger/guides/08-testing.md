# 08: Testing

Sources: `research/2026-04-24-bulletproof-react-testing.md`, `research/2026-04-24-testing-stack.md`.

## The stack

**Vitest + React Testing Library + MSW + Playwright.** New projects default to this. Jest acceptable on legacy.

## The pyramid (bulletproof-react version)

| Layer | Tool | Effort | Scope |
|---|---|---|---|
| Unit | Vitest | ~15% | Pure fns, reducers, utils, shared hooks |
| **Integration** | Vitest + RTL + MSW | **~70%** | Rendered components, real user flows, mocked network |
| E2E | Playwright | ~15% | 20-30 business-critical flows |

Integration tests are where the value is. The Kent Dodds / Guillermo Rauch position ("integration tests are where confidence comes from") holds.

## Rules

### 1. Test behavior, not implementation

```tsx
// bad
expect(component.state.isLoading).toBe(true);

// good
expect(screen.getByRole('status')).toHaveTextContent('Loading');
```

If refactoring the implementation (Redux → Zustand, class → function) breaks tests, the tests were wrong.

### 2. MSW over fetch mocks

```ts
// src/testing/mocks/handlers/discussions.ts
import { http, HttpResponse } from 'msw';
export const discussionHandlers = [
  http.get('/api/discussions', () => HttpResponse.json([{ id: '1', title: 'Hello' }])),
];
```

Handlers are reused across dev, Storybook, unit tests. One source of truth.

### 3. Prefer `getByRole` / `getByLabelText`

Accessibility queries first, then `getByText`, then `getByTestId` (last resort). If `getByRole` can't find it, the component has an a11y issue.

### 4. Real `user-event`, not `fireEvent`

```ts
const user = userEvent.setup();
await user.click(screen.getByRole('button', { name: /save/i }));
```

Simulates realistic interaction timing and focus behavior.

### 5. Snapshot tests are forbidden in component tests

Snapshot tests break for the wrong reasons and rot fast. Exception: golden-output tests for pure functions (schema serializers, etc.) are fine.

### 6. Coverage target: ≥70% statements

Don't chase 100%. Invest in integration tests over coverage chasing.

## Vitest setup

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/testing/setup.ts'],
    globals: true,
    coverage: { reporter: ['text', 'html'], thresholds: { statements: 70 } },
  },
});
```

```ts
// src/testing/setup.ts
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

See `templates/test-setup.ts` for a complete drop-in.

## Integration test example

```tsx
// src/features/discussions/__tests__/discussions.test.tsx
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DiscussionsPage } from '../DiscussionsPage';
import { renderWithProviders } from '@/testing/test-utils';

test('shows discussions and lets user delete one', async () => {
  renderWithProviders(<DiscussionsPage />);
  expect(await screen.findByText('Hello')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /delete hello/i }));
  await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

  expect(screen.queryByText('Hello')).not.toBeInTheDocument();
});
```

`renderWithProviders` wraps with `QueryClientProvider`, `MemoryRouter`, theme, etc. Define once in `src/testing/test-utils.tsx`.

## E2E with Playwright

```ts
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('hunter22hunter22');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

Run in CI headless; UI mode locally for flake debugging.

## Common findings

> **[Must-fix]** `src/components/button.test.tsx:1`: tests internal state (`expect(component.state.count).toBe(1)`). Rewrite to test rendered output. See `guides/08-testing.md §rule-1`.

> **[Should-refactor]** `src/features/auth/login.test.tsx:10`: mocks `fetch` with `vi.fn()`. Replace with MSW handler. See `guides/08-testing.md §rule-2`.

> **[Must-fix]** `vitest.config.ts:3`: no setup file registered; `@testing-library/jest-dom` matchers missing. See `templates/test-setup.ts`.

## Example in action

See `examples/code-review-example-before-after.md` for test-quality findings on a PR.
