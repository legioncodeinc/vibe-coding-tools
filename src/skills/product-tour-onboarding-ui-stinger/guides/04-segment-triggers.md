# Guide 04: Segment-Based Tour Triggers

Use this guide when wiring the logic that decides who sees a tour, when, and under what conditions.

Source: `research/external/2026-05-20-segment-triggers-feature-flags.md`.

---

## The three-gate idiom

Every tour trigger must pass three independent gates before showing:

```typescript
const shouldShowTour = (
  hasSeenTour: boolean,
  isInSegment: boolean,
  flagEnabled: boolean
): boolean => !hasSeenTour && isInSegment && flagEnabled;
```

| Gate | What it checks | How to implement |
|---|---|---|
| `hasSeenTour` | Has this specific user already completed or dismissed this tour? | localStorage (single device) or `user.toursCompleted[]` in DB (cross-device) |
| `isInSegment` | Does this user belong to the target audience? | User attributes: plan tier, cohort, role, feature entitlement |
| `flagEnabled` | Is this tour live and enabled in the current deployment? | Feature flag (PostHog, LaunchDarkly, GrowthBook, etc.) |

---

## Implementing each gate

### Gate 1: "Has seen tour" persistence

```typescript
// localStorage approach (anonymous/single-device)
const TOUR_KEY = 'tour-dashboard-v1'; // versioned key
const hasSeenTour = (): boolean => !!localStorage.getItem(TOUR_KEY);
const markTourSeen = (): void => { localStorage.setItem(TOUR_KEY, '1'); };

// Call markTourSeen() on:
//   - Tour completion (last step's "Done" button)
//   - Explicit "don't show again" dismiss
//   - Timeout (if tour is not interactive after N seconds)
```

**Versioned key discipline:** When you make major changes to a tour, increment the version in the key (`-v1` → `-v2`). This triggers re-exposure for all users who saw the old tour but will not see an identical unchanged tour again.

**Never version-bump a key for minor copy edits.** Only increment for structural changes (new step, changed step order, new target element).

### Gate 2: Segment check

```typescript
// Example: show only to users on a paid plan who signed up in the last 30 days
const isInTourSegment = (user: User): boolean => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return user.plan !== 'free' && user.createdAt > thirtyDaysAgo;
};
```

Common segment dimensions:
- **Plan tier**: `user.plan === 'pro'` for feature-specific tours.
- **Account age**: new users (< 7 days) for onboarding; recent activations for feature adoption.
- **Role**: `user.role === 'admin'` for admin tours.
- **Activation state**: users who have NOT completed a specific milestone (the tour's purpose).
- **Cohort/experiment**: segment assigned by the feature flag system.

### Gate 3: Feature flag gate

```typescript
import posthog from 'posthog-js';

const isTourFlagEnabled = (): boolean =>
  posthog.isFeatureEnabled('tour-dashboard-v1');
```

Using a feature flag to gate tours provides:
- **Safe rollout**: enable for 10% of users first.
- **Kill switch**: disable immediately if the tour is causing confusion or breakage.
- **A/B testing**: compare conversion between tour variants.

The flag name should match the tour key for clarity. Using the same flag system as the rest of the product avoids a second configuration surface.

---

## Behavioral triggers vs. login triggers

**Do NOT:** Show tours on every login or page load without a behavioral trigger.

**Do:** Show tours based on user behavior: first time reaching a specific page, first time triggering a feature, or after completing a prerequisite step.

```typescript
// BAD: triggers on every login
useEffect(() => { tour.start(); }, []);

// GOOD: triggers when user first reaches the dashboard
useEffect(() => {
  if (router.pathname === '/dashboard' && !hasSeenTour() && isInTourSegment(user) && isTourFlagEnabled()) {
    tour.start();
  }
}, [router.pathname]);
```

Behavioral triggers produce better completion rates because the user is already in context (source: `research/external/2026-05-20-checklist-activation-gamification.md`).

---

## "Don't show again" persistence contract

Every tour must have a dismiss/skip path that permanently suppresses the tour for this user. This is not optional. A tour that cannot be permanently dismissed is hostile UX.

Required implementations:
1. **Explicit dismiss**: "Skip tour" or "Don't show again" button.
2. **Completion**: tour is marked seen on the last step.
3. **Implicit dismiss after N sessions**: if the user has seen the tour invite 3 times without starting, mark it seen to stop persisting.

---

## Shepherd.js native segment gating

Shepherd.js v15 provides `showOn` at the step level:

```typescript
{
  id: 'feature-step',
  attachTo: { element: '[data-tour="feature-button"]', on: 'bottom' },
  title: 'New feature',
  text: 'This is only relevant for Pro users.',
  showOn: () => user.plan === 'pro' && !localStorage.getItem('tour-feature-v1'),
}
```

This is cleaner than wrapping the entire tour in a condition; it allows a single tour to have steps that are conditionally shown based on user attributes.
