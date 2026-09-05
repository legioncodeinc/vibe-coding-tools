---
source_type: official-docs
authority: official
relevance: high
topic: compat-compatibility
url: https://preactjs.com/guide/v10/switching-to-preact
---

# preact/compat Compatibility Surface

## What preact/compat provides

`preact/compat` is a compatibility shim that maps React's API surface to Preact's implementation. It allows code written for React to run on Preact without modification, by aliasing React imports to Preact.

**Vite alias config:**
```js
// vite.config.js
export default {
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
};
```

## Confirmed gaps (as of May 2026)

| React API | compat status | Notes |
|---|---|---|
| `React.use()` (React 19) | NOT SUPPORTED | No equivalent in Preact |
| `useTransition` | NOT SUPPORTED | Requires Concurrent Mode / fiber |
| `useDeferredValue` | partial | Implemented as a no-op pass-through |
| `useSyncExternalStore` | partial | Available via compat, but lower-fidelity |
| React Server Components | BLOCKED | Fundamental architecture mismatch |
| `react-dom/client` createRoot (direct) | works via compat alias | Must go through compat alias |
| `@types/react` | INCOMPATIBLE | Never use `@types/react` alongside `preact/compat`; use `@types/preact` or the types bundled with preact |

## Critical warnings

### 1. `@types/react` + `preact/compat` = type errors
Installing `@types/react` in a `preact/compat` project creates type conflicts that are hard to debug. Use only `preact`'s built-in TypeScript types. If a third-party library requires `@types/react` as a peer dep, you may need to stub it.

### 2. Next.js App Router is a footgun
`preact/compat` + Next.js App Router = broken. React Server Components require React's fiber runtime; compat wraps but does not replace it. The result is silent failures and confusing errors. Next.js Pages Router with `preact/compat` works (v10 pattern); App Router does not.

### 3. React 19 `use()` hook
If an existing React codebase uses `use(promise)` or `use(context)`, compat will not handle it. These components must be refactored or left in React.

## What works well under compat

- `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`, `useReducer`
- `Context.Provider` / `useContext`
- Class components (via compat)
- `lazy` / `Suspense` (limited, no streaming)
- `memo` / `forwardRef`
- Most ecosystem libraries that use only stable React hooks
