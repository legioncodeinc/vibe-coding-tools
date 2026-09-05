# Guide 03: Code-First Libraries (Driver.js and Shepherd.js)

Use this guide for open-source library implementations. Sources: `research/external/2026-05-20-driverjs-react-integration.md`, `research/external/2026-05-20-oss-tour-libraries.md`, `research/external/2026-05-20-shepherdjs-react-integration.md`.

---

## Library selection

| Criterion | Driver.js | Shepherd.js v15 |
|---|---|---|
| Primary use case | Spotlight/highlight on single elements; simple linear tours | Full-featured multi-step tours with custom UI |
| Bundle size | Smallest (zero dependencies) | Larger but still reasonable |
| License | MIT | MIT |
| Maintenance (May 2026) | Active (updated ~4 months ago) | Most active (v15.2.2 released March 2026) |
| Accessibility | Manual additions required | Built-in (keyboard nav, focus management, modal overlays) |
| React integration | `useRef` + `useEffect` pattern | `ShepherdTour` provider or `useShepherdTour` hook |
| SSR safety | Safe to import; DOM calls only on invocation | Safe to import; activate client-side only |
| Built-in persistence | None: teams implement localStorage | None: teams implement localStorage |

**Default recommendation:** Shepherd.js for production tours. Driver.js for lightweight spotlight use cases.

**Avoid Intro.js for commercial SaaS**: AGPL v3 licensing requires a paid commercial license ($199+) for any product with a paid tier.

---

## Driver.js React integration

```typescript
// tour/useTour.ts
import { useRef, useEffect } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_STORAGE_KEY = 'tour-v1-dashboard-seen'; // versioned key

export function useDashboardTour() {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard
    if (localStorage.getItem(TOUR_STORAGE_KEY)) return; // already seen

    const steps: DriveStep[] = [
      {
        element: '[data-tour="sidebar-nav"]',
        popover: { title: 'Navigation', description: 'Your main navigation lives here.' }
      },
      {
        element: '[data-tour="create-button"]',
        popover: { title: 'Create', description: 'Start a new project from here.' }
      },
    ];

    driverRef.current = driver({ steps, animate: true });
    driverRef.current.drive();

    return () => { driverRef.current?.destroy(); };
  }, []);

  const markSeen = () => localStorage.setItem(TOUR_STORAGE_KEY, '1');

  return { markSeen };
}
```

**Key patterns:**
- Use `useRef` to hold the driver instance: avoids recreation on re-renders.
- Gate behind a versioned localStorage key (`tour-v1-...`). The version prefix allows re-triggering after major tour updates.
- Always add an SSR guard (`typeof window === 'undefined'`) for Next.js.
- Call `.destroy()` in the `useEffect` cleanup to prevent memory leaks.

---

## Shepherd.js v15 React integration

Shepherd.js v15 (March 2026) offers two React integration patterns:

### Pattern A: ShepherdTour provider (recommended for app-wide tour management)

```tsx
// components/OnboardingTour.tsx
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
import { useContext, useEffect } from 'react';

const steps = [
  {
    id: 'welcome',
    attachTo: { element: '[data-tour="dashboard-header"]', on: 'bottom' as const },
    title: 'Welcome',
    text: 'This is your dashboard.',
    buttons: [
      { label: 'Next', action: function(this: any) { this.next(); } }
    ],
    canClickTarget: false,
    showOn: () => !localStorage.getItem('tour-v1-seen'),
  },
  {
    id: 'create',
    attachTo: { element: '[data-tour="create-button"]', on: 'right' as const },
    title: 'Create a project',
    text: 'Click here to get started.',
    buttons: [
      { label: 'Done', action: function(this: any) {
        localStorage.setItem('tour-v1-seen', '1');
        this.complete();
      }}
    ],
  }
];

const tourOptions = {
  defaultStepOptions: {
    scrollTo: true,
    cancelIcon: { enabled: true },
  },
  useModalOverlay: true,
};

export function OnboardingTour() {
  return (
    <ShepherdTour steps={steps} tourOptions={tourOptions}>
      <TourStarter />
    </ShepherdTour>
  );
}

function TourStarter() {
  const tour = useContext(ShepherdTourContext);
  useEffect(() => {
    if (!localStorage.getItem('tour-v1-seen')) {
      tour?.start();
    }
  }, [tour]);
  return null;
}
```

### Pattern B: useShepherdTour hook (for simple single-component tours)

```tsx
import { useShepherdTour } from 'react-shepherd';

const steps = [ /* ... same shape as above ... */ ];
const tourOptions = { useModalOverlay: true };

export function FeatureTour() {
  const tour = useShepherdTour({ tourOptions, steps });
  return (
    <button onClick={() => tour.start()}>
      Take a tour
    </button>
  );
}
```

**Shepherd.js v15 key patterns:**
- `showOn: () => boolean`: built-in per-step segment gate; use to check feature flags, user attributes, or localStorage state without a wrapper.
- `beforeShowPromise: () => Promise<void>`: delays step display until a route has loaded. Use for multi-page tours.
- `canClickTarget: true`: allows the user to click the highlighted element directly, enabling action-based progression ("click the button to continue").
- `useModalOverlay: true`: enables the backdrop spotlight; recommended for all production tours.

**v14 → v15 migration:** Shepherd.js v15.0.0 removed the Svelte package and migrated to vanilla TypeScript internally. The React-facing API is backward-compatible for most cases. Check the CHANGELOG (`research/` note: Shepherd.js CHANGELOG is available at `github.com/shipshapecode/shepherd/blob/main/CHANGELOG.md`) if migrating from v14.

---

## Shared patterns for both libraries

### Persistence: localStorage vs. database

Both libraries have no built-in persistence. Implement one of:

```typescript
// Tier 1: localStorage (single-device, no login required)
const TOUR_KEY = 'product-tour-v1-seen';
const hasSeen = (): boolean => !!localStorage.getItem(TOUR_KEY);
const markSeen = (): void => { localStorage.setItem(TOUR_KEY, '1'); };

// Tier 2: Database (cross-device; requires authenticated user)
// POST /api/user/tour-seen { tourId: 'dashboard-v1' }
// GET  /api/user/tour-seen -> { seen: true/false }
```

Use localStorage for anonymous or first-session tours. Use the database for authenticated users where cross-device consistency matters (e.g., the tour should not repeat on a new device after completion).

### Cross-referencing with stable anchors

Both libraries accept any valid CSS selector in their element targeting fields. The canonical selector format is `[data-tour="step-name"]`:

```html
<button data-tour="create-button">New Project</button>
```

```javascript
// Driver.js
{ element: '[data-tour="create-button"]', ... }

// Shepherd.js
attachTo: { element: '[data-tour="create-button"]', on: 'bottom' }
```

See `guides/06-maintenance-and-drift.md` for the selector registry and CI smoke test.
