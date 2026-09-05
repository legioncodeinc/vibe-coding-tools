# Testing Stack: Vitest + RTL + MSW + Playwright

**Sources:**
- https://vitest.dev/
- https://testing-library.com/docs/react-testing-library/intro/
- https://playwright.dev/
- https://mswjs.io/
- WebSearch: "React Testing Library Vitest Playwright MSW 2026"

**Retrieved:** 2026-04-24

## Summary

2026 consensus: **Vitest** (unit + integration) + **React Testing Library** (components) + **MSW** (network mocking) + **Playwright** (E2E). Jest still in use on legacy codebases; new projects default to Vitest.

## Layered strategy (adapted from bulletproof-react)

| Layer | Tool | What to cover | How many |
|---|---|---|---|
| Unit | Vitest | Pure functions, reducers, utilities, shared hooks in isolation | Broad |
| Integration | Vitest + RTL + MSW | Components rendered with providers, simulating real user interactions, MSW-mocked network | **Majority of effort** |
| E2E | Playwright | Business-critical flows (signup, checkout, auth) | 20-30, not more |

## Rules

1. **Test behavior, not implementation.** "User clicks Submit, toast appears", not "state.isLoading flips to true".
2. **MSW over mocking fetch.** Write handlers once; reuse in local dev, Storybook, tests.
3. **Test accessibility implicitly.** Use `getByRole`, `getByLabelText`; if they fail, accessibility is broken.
4. **Playwright runs in headless CI; UI mode locally for flaky test debugging.**
5. **Coverage target: ≥70% statements.** Don't chase 100%: diminishing returns.
6. **Snapshot tests are a last resort.** They get stale and rarely fail for the right reason.

## Setup checklist (Vite + React)

- `vitest` + `@vitest/ui`
- `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom`
- `jsdom` or `happy-dom` as environment
- `msw` + service-worker setup for browser; Node setup for Vitest
- `playwright` separate from unit suite, own config
- Shared `testing/setup.ts` that starts MSW and loads `@testing-library/jest-dom/vitest`

## Relevance to this stinger

Spine of `guides/08-testing.md`. Drives `templates/test-setup.ts`.
