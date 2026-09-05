/**
 * Canonical root provider composition.
 *
 * Order matters. Outer = wraps everything inside.
 *
 * ErrorBoundary (outermost — must catch Suspense / Query errors too)
 *   Suspense (for top-level code-splitting / use() promises)
 *     QueryClientProvider (server cache — TanStack Query)
 *       ThemeProvider (UI theme)
 *         AuthProvider (user state)
 *           Router (page routing)
 *             {children}
 *
 * See `guides/05-error-handling.md` for boundary placement rationale.
 * See `guides/04-data-layer.md` for the QueryClient config.
 *
 * Placeholders: replace {{...}} with your implementations.
 * This is a starter — keep it ~60 lines or under.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, type ReactNode, useState } from 'react';

import { RouteErrorFallback } from '@/components/providers/route-error-fallback'; // implement
import { RouteFallback } from '@/components/providers/route-fallback';             // implement
import { ThemeProvider } from '@/components/providers/theme-provider';             // implement
import { AuthProvider } from '@/components/providers/auth-provider';               // implement

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export function AppProvider({ children }: { children: ReactNode }) {
  // per-app singleton; for Next.js App Router use a per-request factory
  const [queryClient] = useState(makeQueryClient);

  return (
    <ErrorBoundary FallbackComponent={RouteErrorFallback} onError={(err, info) => {
      // send to Sentry / logger
      console.error('[app-error]', err, info);
    }}>
      <Suspense fallback={<RouteFallback />}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
          {import.meta.env.DEV ? <ReactQueryDevtools buttonPosition="bottom-left" /> : null}
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Usage:
 *
 * // src/main.tsx (Vite)
 * createRoot(document.getElementById('root')!).render(
 *   <AppProvider>
 *     <RouterProvider router={router} />
 *   </AppProvider>,
 * );
 */
