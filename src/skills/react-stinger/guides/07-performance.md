# 07: Performance

Sources: `research/2026-04-24-bulletproof-react-performance.md`, `research/2026-04-24-react-compiler-1.md`.

## The principle

**Measure, then optimize.** "It feels fast" is not data. Every performance finding must cite:

- React Profiler flame graph (DevTools)
- Chrome DevTools Performance trace
- Lighthouse LCP / INP
- Bundle size from `rollup-plugin-visualizer` / `@next/bundle-analyzer`

## Hierarchy of performance wins (apply in order)

### 1. Route-level code splitting

```tsx
const Dashboard = lazy(() => import('./routes/dashboard'));
```

Route boundary is the sweet spot. More granular splitting produces too many requests; less adds to initial bundle.

### 2. Colocate state

State near its consumer = fewer components re-render when it updates. See `guides/03-state-management.md`.

### 3. Composition via `children`

Children passed as JSX are isolated from parent state updates:

```tsx
// Parent re-renders on count change. <PureComponent /> is NOT a child of state holder — doesn't re-render.
<Counter>
  <PureComponent />
</Counter>

function Counter({ children }) {
  const [count, setCount] = useState(0);
  return <div><button onClick={() => setCount(c => c + 1)}>{count}</button>{children}</div>;
}
```

Source: bulletproof-react. This is the first-reach performance pattern.

### 4. React Compiler (if eligible)

If React 17+ and code is Rules-of-React compliant, enable the Compiler. It automatically memoizes components and hooks. See `research/2026-04-24-react-compiler-1.md`.

Adoption:

1. Add `eslint-plugin-react-compiler`.
2. Fix all reported violations (mutations, impure functions, conditional hooks).
3. Enable Compiler in Babel / SWC / Vite config.
4. Remove manual `useMemo` / `useCallback` / `memo` that Compiler now handles, but **keep** `useMemo` used for effect-dependency stability.

### 5. State initializer for expensive init

```tsx
// bad: runs every render
const [state, setState] = useState(expensiveFn());
// good: runs once
const [state, setState] = useState(() => expensiveFn());
```

### 6. Zero-runtime styling

Runtime CSS-in-JS (emotion, styled-components) generates styles per-render. Prefer Tailwind / vanilla-extract / CSS Modules (build-time).

### 7. Manual memoization: last resort

Reach for `useMemo` / `useCallback` / `memo` only after measuring. Cite the Profiler run in the PR. Compiler-enabled codebases rarely need them.

## Bundle budgets

Set per-route budgets in CI. Reference: `scripts/bundle-budget-check.ts`.

Typical budgets (adjust per product):

| Route type | First-load JS |
|---|---|
| Landing / marketing | ≤ 90 KB gz |
| Auth | ≤ 120 KB gz |
| App shell | ≤ 180 KB gz |
| Heavy feature page (editor, dashboard) | ≤ 300 KB gz |

Exceeding a budget is a must-fix or requires an ADR justifying the exception.

## Profiling workflow

1. Run React DevTools Profiler → record the interaction.
2. Find the commit with the longest total time.
3. Identify the components rendering. Is rendering necessary?
4. If unnecessary: check for prop identity issues (inline objects/functions, new references each render).
5. Apply: children-as-optimization, colocation, or (last resort) `useMemo` / `memo`.

## Web Vitals targets

- **LCP** < 2.5s
- **INP** < 200ms
- **CLS** < 0.1

Sized skeletons in Suspense boundaries prevent CLS. See `guides/05-error-handling.md §rule-2`.

## Common findings

> **[Must-fix]** `src/app/App.tsx:1`: `import { ChartLibrary } from 'huge-chart-lib'` at the app root; adds 220KB to every page including the login screen. Split to the specific route where it's used. See `scripts/bundle-budget-check.ts` output.

> **[Should-refactor]** `src/features/feed/Feed.tsx:42`: 50+ `useMemo` / `useCallback` wrappers inserted defensively. Enable React Compiler and remove. See `guides/07-performance.md §react-compiler`.

> **[Must-fix]** `src/components/Page.tsx:10`: `<Suspense fallback={null}>` produces CLS of 0.3. Size the fallback.

## Example in action

See `examples/refactor-proposal-example.md §phase-3` for a bundle-budget-driven split.
