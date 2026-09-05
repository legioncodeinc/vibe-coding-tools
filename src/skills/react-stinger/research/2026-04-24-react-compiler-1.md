# React Compiler 1.0 (Stable)

**Sources:**
- https://react.dev/blog/2025/10/07/react-compiler-1
- https://react.dev/learn/react-compiler/introduction
- https://www.infoq.com/news/2025/12/react-compiler-meta/

**Retrieved:** 2026-04-24

## Summary

React Compiler 1.0 went stable October 2025. It's a build-time tool that automatically memoizes components and hooks: analyzing code to eliminate unnecessary re-renders without manual `useMemo`, `useCallback`, or `memo` wrappers. Meta shipped it to production first and reports up to 12% faster loads, 2.5x faster interactions.

## Key facts

- **Build-time only**: no runtime cost.
- **Works with React 17+** (not React 19-exclusive). Older apps can adopt it.
- **Opt-in** initially; default rollout increasing.
- **Compatible with existing `useMemo` / `useCallback`**: they still work as escape hatches.
- **Rules-of-React-compliant code required.** Compiler refuses to optimize components that mutate props, break hook rules, etc. The eslint-plugin-react-hooks + react-compiler plugin catches violations.

## Impact on best practices

1. **Manual memoization loses value** in Compiler-enabled codebases. Premature `useMemo` / `useCallback` is both unnecessary and a code smell.
2. **But** `useMemo` remains useful for expensive *computation caching* used as *effect dependencies* (stability, not perf).
3. **Discipline moves up the stack:** state colocation, composition via `children`, code splitting: these still matter; Compiler can't undo architectural problems.

## Adoption checklist

- Enable `eslint-plugin-react-compiler`.
- Fix all violations (impure functions, direct mutations, conditional hooks).
- Turn on Compiler in Babel / SWC / Vite config.
- Verify with the `react-compiler-runtime` DevTools badge showing memoized components.

## Relevance to this stinger

Flows into `guides/07-performance.md` (memoization discipline) and `guides/12-anti-patterns.md` (premature memoization). Also drives `scripts/react-version-audit.ts` recommending Compiler adoption for eligible projects.
