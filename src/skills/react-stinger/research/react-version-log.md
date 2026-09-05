# React Version Log

Tracks "what was current when each guide was authored" so the Stinger can be updated when React / its ecosystem moves.

## Author time: 2026-04-24

| Package | Version at forge time | Notes |
|---|---|---|
| react | 19.x (stable since Dec 2024) | Actions, useActionState, useOptimistic, useFormStatus, `use` hook |
| react-compiler | 1.0 (stable since Oct 2025) | Automatic memoization, opt-in |
| next | 15 (stable) | App Router default. 16 in preview with new primitives |
| vite | 6.x | React plugin SWC default |
| react-router | v7 (framework mode) | Loaders + actions; renamed from Remix |
| @tanstack/react-query | v5 | Mature; DevTools external |
| zustand | 5.x | |
| jotai | 2.x | |
| @reduxjs/toolkit | 2.x | RTK Query bundled |
| nuqs | 2.x | |
| react-hook-form | 7.x | |
| zod | 4.x | Performance rewrite |
| vitest | 3.x | |
| @testing-library/react | 16.x | React 19 compatible |
| playwright | 1.x (late 2025 cadence) | |
| msw | 2.x | |
| tailwindcss | 4.x | Oxide engine |

## Deprecated / retired patterns

- Class components (except error boundaries): functional only.
- `forwardRef`: replaced by ref-as-prop in React 19.
- `defaultProps` on function components: removed in React 19. Use default parameters.
- `propTypes`: rely on TypeScript.
- Moment.js, Enzyme, Recoil, react-scripts (CRA): all retired.
- Pages Router in new Next.js projects: App Router default.

## How to refresh this log

Re-run the Stinger's research pass every 6-9 months, or sooner when a React major ships. Update this file, then scan each guide for version-anchored claims and refresh as needed.
