# Guide 06: Tour Maintenance and Drift Prevention

Use this guide when a tour is broken after a UI change, when establishing a maintenance protocol for new tours, or when running a tour health audit.

Source: `research/external/2026-05-20-tour-maintenance-unbreakable.md` (primary), `research/external/2026-05-20-driverjs-react-integration.md`.

---

## Why tours break

The #1 cause of tour breakage: **dynamic CSS class generation**. CSS-in-JS frameworks (Emotion, styled-components, Angular ViewEncapsulation) rebuild class names like `.css-4mrg2x7c` with every deployment. The tour tool's selector points at a class that no longer exists. From the tour's perspective, the element has vanished.

Other causes:
- Component renamed or restructured (DOM hierarchy changed).
- Copy changed (if the tour uses text-based targeting).
- Page moved or route changed.
- Element conditionally rendered (tour fires before the element exists in the DOM).

---

## Four-strategy drift-prevention framework

### Strategy 1: Data attributes (gold standard)

Add `data-tour` attributes to every element targeted by a tour. This is a permanent contract between the tour layer and the engineering team.

```html
<!-- Add to any element that will be tour-targeted -->
<button data-tour="create-project-button">New Project</button>
<nav data-tour="sidebar-navigation">...</nav>
<input data-tour="workspace-name-field" />
```

**Selector in the tour:**
```javascript
element: '[data-tour="create-project-button"]'
```

This selector is:
- Immune to CSS class regeneration.
- Immune to copy changes.
- Stable across CSS-in-JS framework upgrades.

**Naming convention:** Use kebab-case identifiers that describe the element's semantic purpose, not its visual appearance. `data-tour="primary-cta"` is better than `data-tour="blue-button"`.

**Two-for-one benefit:** `data-tour` attributes work identically to `data-testid` for Playwright and Cypress. Adding them for tours also improves automated test coverage at no extra cost.

### Strategy 2: Dynamic URL wildcards (for multi-tenant and path-variable routes)

If the tour targets a specific page and the URL contains dynamic segments, use wildcards or path pattern matching:

```javascript
// Appcues / Userpilot: use wildcard URL matching
// Target: /workspaces/*/dashboard → show on any workspace dashboard
url: '/workspaces/*/dashboard'

// Shepherd.js: use a beforeShowPromise to wait for route match
beforeShowPromise: () => new Promise(resolve => {
  const match = window.location.pathname.match(/^\/workspaces\/[^/]+\/dashboard$/);
  if (match) resolve();
})
```

### Strategy 3: Text targeting (immediate no-code fix)

If `data-tour` attributes cannot be added immediately (third-party component, unowned code), use visible text as a fallback selector. Most SaaS tools (Userpilot, Appcues) support text-based targeting.

**Limitations:** Text targeting breaks if copy changes. Use as a temporary fix while engineering adds `data-tour` attributes, not as a permanent strategy.

### Strategy 4: Analytics-driven maintenance cadence

Review tour funnel analytics after every sprint release:

- If a step's completion rate drops by > 20% compared to the previous sprint, the selector for that step is likely broken.
- If a step's drop-off is "cliff-shaped" (near 0% continue), the element is not being found.

**Recommended cadence:** Post-sprint tour review (15 minutes) after every 2-week sprint. Teams report this catches breakage before users report it en masse.

---

## The selector registry

Maintain a JSON file (`templates/data-tour-registry.json`) that catalogs every `data-tour` attribute in the codebase along with its owning component, tour(s) that use it, and the last verified date.

```json
[
  {
    "selector": "data-tour=\"create-project-button\"",
    "component": "src/components/ProjectList/EmptyState.tsx",
    "tours": ["dashboard-onboarding-v1", "create-first-project-v2"],
    "verified": "2026-05-20",
    "notes": "Also used as data-testid in Playwright tests"
  }
]
```

This registry serves two purposes:
1. **Audit trail**: when a component is renamed or deleted, engineers can look up which tours depend on it.
2. **CI verification**: the smoke test reads this file to confirm all registered selectors exist in the live DOM.

---

## CI smoke test (Playwright)

Add a Playwright test that visits each key page and asserts the existence of all registered `data-tour` attributes:

```typescript
// tests/tour-selectors.spec.ts
import { test, expect } from '@playwright/test';
import registry from '../templates/data-tour-registry.json';

test('all data-tour anchors exist on their target pages', async ({ page }) => {
  // Group selectors by page
  await page.goto('/dashboard');
  for (const entry of registry.filter(e => e.page === '/dashboard')) {
    const selector = `[${entry.selector}]`;
    await expect(page.locator(selector)).toBeVisible({
      timeout: 5000
    });
  }
});
```

This test runs on every CI build and fails if an engineer removes a `data-tour` attribute that is still referenced in the registry. The failure surfaces the broken tour before it reaches production.

---

## Recovery playbook: "our tour is broken"

When a user reports a broken tour (or analytics show a cliff-shaped drop-off at a step):

1. **Identify the broken step**: check tour analytics for which step has the anomalous drop-off.
2. **Open the browser DevTools** on the affected page.
3. **Run in console:** `document.querySelector('[data-tour="<step-name>"]')`, if it returns `null`, the element is missing from the DOM.
4. **Check the selector registry**: which component owns this selector?
5. **Find the component**: was it renamed? Removed? Conditionally rendered?
6. **Fix**: either restore the `data-tour` attribute in the component, or update the tour step's selector to match the new component.
7. **Update the selector registry** with the fix date.
8. **Re-run the CI smoke test** to confirm.

---

## Tour versioning

When making structural changes to a tour (new step, reordered steps, new target element):

1. Increment the version in the localStorage key: `'tour-dashboard-v1'` → `'tour-dashboard-v2'`.
2. Update the selector registry's `verified` date.
3. Update any feature flag that gates the tour (deploy the new version to a subset first).

Do NOT increment the version for minor copy edits: users who have seen the tour should not see it again because a typo was fixed.
