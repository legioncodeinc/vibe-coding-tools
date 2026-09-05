# Bulletproof-React: Performance

**Source:** https://github.com/alan2207/bulletproof-react/blob/master/docs/performance.md
**Retrieved:** 2026-04-24

## Summary

Performance advice prioritizes architectural wins (code splitting, colocation, composition) over memoization wrappers.

## Key techniques (in order of priority)

1. **Route-level code splitting** (lazy routes). Avoid over-splitting: too many requests is worse than a large chunk.
2. **Split state by locality.** Don't stuff everything into one store; close-to-consumer is faster.
3. **State initializer function** for expensive initial values: `useState(() => myExpensiveFn())`.
4. **Atomic state libraries** (Jotai) when many small pieces of state drive many components.
5. **Use Context wisely**: low-velocity data only. For higher-velocity, use `use-context-selector` or a proper store.
6. **Prefer zero-runtime styling**: Tailwind / vanilla-extract / CSS Modules over emotion / styled-components under heavy re-render.
7. **Children as a rerender optimization**: pass JSX as `children` instead of rendering inside the state-holding component. The children subtree is isolated from parent state updates.
8. **Prefetch data** with `queryClient.prefetchQuery` for anticipated navigations.

## Key quote (children-as-optimization)

> "The `children` prop is the most basic and easiest way to optimize your components. When applied properly, it eliminates a lot of unnecessary rerenders."

## Relevance to this stinger

Spine of `guides/07-performance.md`. Children-as-optimization is the first-reach pattern; memoization is last resort (especially with Compiler). Informs `scripts/bundle-budget-check.ts`.
