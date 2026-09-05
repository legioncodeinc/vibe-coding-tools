/**
 * Canonical error boundary + Suspense wrapper for a route or feature subtree.
 *
 * Usage:
 *
 *   <RouteBoundary name="dashboard">
 *     <DashboardPage />
 *   </RouteBoundary>
 *
 * See `guides/05-error-handling.md` for placement rules (one per route, plus
 * per-feature where a failure should be isolated).
 */

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Suspense, type ReactNode } from 'react';
import { useLocation } from 'react-router'; // or next/navigation in Next.js

export function RouteBoundary({
  name,
  children,
  fallback,
}: {
  name: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <DefaultFallback {...props} boundaryName={name} />}
      onError={(error, info) => {
        // window.Sentry?.captureException(error, { extra: { boundaryName: name, info } });
        console.error(`[${name}-boundary]`, error, info);
      }}
      resetKeys={[pathname]}
    >
      <Suspense fallback={fallback ?? <DefaultSuspenseFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function DefaultFallback({ error, resetErrorBoundary, boundaryName }: FallbackProps & { boundaryName: string }) {
  return (
    <div role="alert" className="route-error">
      <h2>Something went wrong in {boundaryName}</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function DefaultSuspenseFallback() {
  // Return a sized skeleton matching the expected content to prevent CLS.
  // See `guides/07-performance.md §web-vitals-targets`.
  return <div aria-busy="true" className="route-skeleton" style={{ minHeight: '60vh' }} />;
}
