# Example: Three-Step Dashboard Tour with Driver.js

A worked end-to-end implementation of a three-step product tour using Driver.js 9.x + React 18 + `data-tour` anchors + localStorage persistence.

Demonstrates guides: `guides/00-principles.md`, `guides/03-driver-js-shepherd-js.md`, `guides/04-segment-triggers.md`, `guides/06-maintenance-and-drift.md`.

---

## Context

A B2B SaaS dashboard (Next.js App Router) needs to onboard new users to three key navigation elements: the sidebar, the create-project button, and the workspace switcher. The tour should show once per user, be dismissible, and only appear for users who signed up in the last 7 days.

---

## Step 1: Add data-tour anchors

In the relevant components:

```tsx
// src/components/Sidebar/Sidebar.tsx
<nav data-tour="sidebar-navigation" className="...">
  {/* sidebar content */}
</nav>

// src/components/ProjectList/EmptyState.tsx
<button data-tour="create-project-button" onClick={onCreateProject}>
  New Project
</button>

// src/components/Header/WorkspaceSwitcher.tsx
<div data-tour="workspace-switcher">
  {/* switcher content */}
</div>
```

---

## Step 2: Register anchors in the selector registry

`templates/data-tour-registry.json` entry:

```json
[
  {
    "selector": "data-tour=\"sidebar-navigation\"",
    "component": "src/components/Sidebar/Sidebar.tsx",
    "page": "/dashboard",
    "tours": ["dashboard-onboarding-v1"],
    "verified": "2026-05-20"
  },
  {
    "selector": "data-tour=\"create-project-button\"",
    "component": "src/components/ProjectList/EmptyState.tsx",
    "page": "/dashboard",
    "tours": ["dashboard-onboarding-v1"],
    "verified": "2026-05-20"
  },
  {
    "selector": "data-tour=\"workspace-switcher\"",
    "component": "src/components/Header/WorkspaceSwitcher.tsx",
    "page": "/dashboard",
    "tours": ["dashboard-onboarding-v1"],
    "verified": "2026-05-20"
  }
]
```

---

## Step 3: Implement the tour hook

```typescript
// src/hooks/useDashboardTour.ts
'use client'; // Next.js App Router: client component

import { useRef, useEffect } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_KEY = 'tour-dashboard-v1';

interface UseDashboardTourOptions {
  user: {
    createdAt: Date;
    plan: string;
  };
  isFeatureEnabled: boolean; // from feature flag system
}

export function useDashboardTour({ user, isFeatureEnabled }: UseDashboardTourOptions) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const isNewUser = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return user.createdAt > sevenDaysAgo;
  };

  const hasSeenTour = () => !!localStorage.getItem(TOUR_KEY);
  const markTourSeen = () => localStorage.setItem(TOUR_KEY, '1');

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard
    if (!isFeatureEnabled) return;             // feature flag gate
    if (!isNewUser()) return;                  // segment gate
    if (hasSeenTour()) return;                 // already seen

    const steps: DriveStep[] = [
      {
        element: '[data-tour="sidebar-navigation"]',
        popover: {
          title: 'Your navigation',
          description: 'Access all your projects and settings from here.',
          side: 'right',
        }
      },
      {
        element: '[data-tour="create-project-button"]',
        popover: {
          title: 'Start a project',
          description: 'Create your first project to get started.',
          side: 'bottom',
        }
      },
      {
        element: '[data-tour="workspace-switcher"]',
        popover: {
          title: 'Switch workspaces',
          description: 'If you have multiple workspaces, switch between them here.',
          side: 'bottom',
        }
      }
    ];

    driverRef.current = driver({
      steps,
      animate: true,
      showProgress: true,
      allowClose: true,
      onDestroyStarted: () => {
        markTourSeen(); // Mark seen on any close (complete or dismiss)
        driverRef.current?.destroy();
      },
    });

    // Small delay to let the page fully render before the tour activates
    const timer = setTimeout(() => driverRef.current?.drive(), 500);

    return () => {
      clearTimeout(timer);
      driverRef.current?.destroy();
    };
  }, [isFeatureEnabled]);
}
```

---

## Step 4: Use the hook in the dashboard page

```tsx
// src/app/dashboard/page.tsx
'use client';

import { useDashboardTour } from '@/hooks/useDashboardTour';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import posthog from 'posthog-js';

export default function DashboardPage() {
  const { user } = useCurrentUser();

  useDashboardTour({
    user: { createdAt: user.createdAt, plan: user.plan },
    isFeatureEnabled: posthog.isFeatureEnabled('tour-dashboard-v1'),
  });

  return (
    // ... page content with data-tour anchors in place
  );
}
```

---

## Step 5: CI smoke test

```typescript
// tests/tour-selectors.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard data-tour anchors exist', async ({ page }) => {
  await page.goto('/dashboard');
  const selectors = [
    '[data-tour="sidebar-navigation"]',
    '[data-tour="create-project-button"]',
    '[data-tour="workspace-switcher"]',
  ];
  for (const sel of selectors) {
    await expect(page.locator(sel)).toBeVisible({ timeout: 5000 });
  }
});
```

---

## Result

- Tour shows only to users who signed up in the last 7 days (`isNewUser()`).
- Tour shows only when the feature flag is enabled (`isFeatureEnabled`).
- Tour shows only once per user (`hasSeenTour()` / `markTourSeen()`).
- If a component is refactored and a `data-tour` attribute is removed, the CI smoke test fails on the next PR, surfacing the broken tour before deployment.
