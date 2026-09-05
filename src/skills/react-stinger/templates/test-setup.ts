/**
 * Vitest + React Testing Library + MSW setup.
 *
 * Used via: vite.config.ts -> test.setupFiles: ['./src/testing/setup.ts']
 *
 * See `guides/08-testing.md` for the full testing strategy.
 */

import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server'; // implement at src/testing/mocks/server.ts

// Start MSW before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers between tests (so one test can't leak mocks to another)
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Stop MSW after all tests
afterAll(() => {
  server.close();
});

/**
 * Global mocks that most tests want:
 */

// Silence the "not wrapped in act" warning for cases where it's a false positive.
// Leave off unless your suite has legitimate noise to suppress.
// vi.spyOn(console, 'error').mockImplementation(() => {});

// IntersectionObserver / ResizeObserver stubs (common in component tests):
class _Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

// @ts-expect-error — jsdom doesn't provide these
globalThis.IntersectionObserver = globalThis.IntersectionObserver ?? _Observer;
// @ts-expect-error
globalThis.ResizeObserver = globalThis.ResizeObserver ?? _Observer;

/**
 * Companion file: src/testing/mocks/server.ts
 *
 *   import { setupServer } from 'msw/node';
 *   import { handlers } from './handlers';
 *   export const server = setupServer(...handlers);
 *
 * Companion file: src/testing/test-utils.tsx
 *
 *   export function renderWithProviders(ui: React.ReactElement, opts?: { route?: string }) {
 *     const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
 *     return render(
 *       <QueryClientProvider client={qc}>
 *         <MemoryRouter initialEntries={[opts?.route ?? '/']}>
 *           {ui}
 *         </MemoryRouter>
 *       </QueryClientProvider>,
 *     );
 *   }
 */
