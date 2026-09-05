# 05: Error Handling

Source: `research/2026-04-24-bulletproof-react-error-handling-security.md`.

## The pillar

Every route gets an **`<ErrorBoundary>` and a `<Suspense>` boundary**. A component tree without both breaks ugly under real-world failure.

## The layered approach

```
AppErrorBoundary               (catches the unexpected)
  ├─ Router
     ├─ RouteErrorBoundary     (catches per-route failures — user sees "this page" error)
     │  ├─ Suspense fallback=<Skeleton />
     │     ├─ FeatureErrorBoundary  (optional, for isolating a feature within a route)
     │        └─ <FeatureContent />
```

`templates/error-boundary.tsx` contains the canonical component.

## React 19 Error Boundary

Still a class component (no functional replacement as of React 19). Use `react-error-boundary` for ergonomics:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  FallbackComponent={RouteErrorFallback}
  onReset={() => queryClient.resetQueries()}
  onError={(error, info) => Sentry.captureException(error, { extra: info })}
>
  <Suspense fallback={<RouteSkeleton />}>
    <Outlet />
  </Suspense>
</ErrorBoundary>
```

## The five rules

### 1. Multiple boundaries, not one

A single app-level boundary means any error blanks the whole app. Put boundaries per route, and inside routes around isolated features that can fail independently (a chart, a third-party widget).

### 2. Suspense boundaries must have real fallbacks

A blank `<Suspense fallback={null}>` is a finding. Use skeletons sized to the expected content to avoid CLS.

### 3. Reset on navigation

`ErrorBoundary` state persists. Pass `resetKeys={[pathname]}` or use router integration so retrying works.

### 4. Error handlers log to tracking

`onError` calls Sentry (or equivalent). Error tracking with source maps. Never `console.error` as the only log.

### 5. API errors are not UI errors

API-layer errors are caught by the shared client's interceptor (see `guides/04-data-layer.md §the-api-client`) and turned into typed errors:

```ts
class ApiError extends Error {
  constructor(public status: number, public code: string, public payload?: unknown, message?: string) {
    super(message ?? code);
  }
}
```

Components use TanStack Query's `error` state to render them inline; they don't throw to a boundary for routine 404 / 403.

## React 19 + Suspense: read promises directly

With the `use` hook:

```tsx
function PostDetail({ promise }: { promise: Promise<Post> }) {
  const post = use(promise); // suspends until resolved
  return <article>{post.title}</article>;
}
```

Wrap in `<Suspense>` upstream. Errors are caught by the nearest `<ErrorBoundary>`. This replaces many old useEffect-for-fetch patterns.

## Common findings

> **[Must-fix]** `src/app/routes/dashboard.tsx:10`: no error boundary on the route; a thrown error will crash the whole app. Add per `templates/error-boundary.tsx`.

> **[Must-fix]** `src/app/App.tsx:22`: single app-level `<ErrorBoundary>` wrapping all routes. Add per-route boundaries. See `guides/05-error-handling.md §multiple-boundaries`.

> **[Should-refactor]** `src/components/PostList.tsx:8`: `<Suspense fallback={null}>` renders nothing during loading, causing layout shift. Replace with a sized skeleton.

## Example in action

See `examples/code-review-example-before-after.md` for boundary placement fixes.
