# Bulletproof-React: Testing

**Source:** https://github.com/alan2207/bulletproof-react/blob/master/docs/testing.md
**Retrieved:** 2026-04-24

## Summary

Three test levels: Unit (small, isolated), Integration (multi-part, the most valuable level), E2E (full-stack, Playwright). Tools: Vitest + Testing Library + MSW + Playwright.

## Key quote (on integration tests)

> "Integration testing checks how different parts of your application work together. It's crucial to focus on integration tests for most of your testing, as they provide significant benefits and boost confidence in your application's reliability."

## Recommended tooling

| Layer | Tool |
|---|---|
| Test runner | Vitest |
| Component tests | React Testing Library |
| E2E | Playwright (browser + headless for CI) |
| API mocking | MSW |

## Philosophy

Test the app "the way a real user uses it", not implementation details. If you refactor from Redux to Zustand, tests should still pass because the output didn't change.

## Relevance to this stinger

Spine of `guides/08-testing.md`. MSW + Vitest + RTL is the canonical local stack; Playwright for E2E. Informs `templates/test-setup.ts`.
