# ADR-007: Server Components / Client Boundary for the Dashboard Route

Illustrates `guides/11-server-components.md` and the ADR format in `templates/ADR.md`.

**Status:** Accepted
**Date:** 2026-04-18
**Author:** react-worker-bee (under supervision of @jane-dev)
**Supersedes:** ADR-003 (which put `'use client'` at `app/dashboard/layout.tsx`)

---

## Context

`app/dashboard/layout.tsx` was originally a Client Component due to a `<ThemeProvider>` + an `useEffect` for analytics. This forced every descendant (charts, tables, hero, sidebar) into the client bundle. First-load JS for `/dashboard` ballooned to **412 KB gz**, 126 KB over budget (`guides/07-performance.md §bundle-budgets`).

Analysis of the render tree showed:

- `<ThemeProvider>`: needs client (stores preference in `localStorage`).
- `<AnalyticsTracker>`: needs client (runs `useEffect`).
- `<DashboardHero>`: static, could be RSC. 38 KB.
- `<RevenueChart>`: fetches + renders; can be RSC with `await getRevenue()`.
- `<InteractiveFilter>`: needs client (controls state).
- `<RecentActivity>`: pure data rendering. Can be RSC.
- `<AIInsights>`: pure data rendering. Can be RSC.

Total eligible for RSC: ~240 KB of deps.

## Decision

Restructure the boundary using the "Server Components as children" pattern (`guides/11-server-components.md §pass-server-components-as-children`):

1. Keep `app/dashboard/layout.tsx` as a **Server Component**.
2. Extract the client-only providers into `components/providers/client-root.tsx` marked `'use client'`. Accept `children: ReactNode`.
3. Page renders: `<ClientRoot>{serverChildren}</ClientRoot>`.
4. The only leaf client component remaining is `<InteractiveFilter>`.

```tsx
// app/dashboard/layout.tsx — RSC
import { ClientRoot } from '@/components/providers/client-root';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ClientRoot>{children}</ClientRoot>;
}

// app/dashboard/page.tsx — RSC
export default async function Page() {
  const [revenue, activity, insights] = await Promise.all([
    getRevenue(), getRecentActivity(), getAIInsights(),
  ]);
  return (
    <>
      <DashboardHero />
      <InteractiveFilter />          {/* 'use client' leaf */}
      <RevenueChart data={revenue} />
      <RecentActivity items={activity} />
      <AIInsights data={insights} />
    </>
  );
}
```

## Consequences

**Positive:**
- First-load JS drops from 412 KB gz → 184 KB gz (under 300 KB budget).
- LCP improves 0.7s (measured on throttled 4G).
- `<RevenueChart>` deps (`recharts`, `date-fns`) no longer ship to the client.

**Negative:**
- Theme flash risk on first render until `<ClientRoot>` mounts. Mitigated by a `suppressHydrationWarning` + `next-themes` script injection.
- `<InteractiveFilter>` cannot directly read server data; receives via props or calls a client fetch.

**Neutral:**
- `<RevenueChart>` is now server-rendered. Cannot be interactive (clicking bars). If future requirements demand interaction, promote to client and accept the bundle cost: write ADR-XXX.

## Alternatives considered

- **Keep all-client, add dynamic imports.** Would have helped, but charts and tables are the bulk of the bundle and don't need interactivity. Dynamic import = same bundle total, just time-shifted.
- **Marker `useClient` via a Provider trick.** Non-standard, brittle. Rejected.

## References

- `guides/11-server-components.md` §push-use-client-down, §pass-server-components-as-children
- `guides/07-performance.md §bundle-budgets`
- `research/2026-04-24-server-components-boundary.md`
- https://nextjs.org/docs/app/api-reference/directives/use-client

## Verification

`scripts/bundle-budget-check.ts` must show `/dashboard` first-load JS ≤ 300 KB gz before this ADR is marked "Implemented".
