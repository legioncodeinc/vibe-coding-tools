---
source_url: https://blog.logrocket.com/using-react-shepherd-build-site-tour
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: oss-libraries
stinger: product-tour-onboarding-ui-stinger
---

# Using React Shepherd to Build a Site Tour: LogRocket (2024, updated API still current in 2026)

## Summary

Step-by-step integration guide for `react-shepherd`, the official React wrapper for Shepherd.js, from LogRocket. Covers two integration patterns (ShepherdTour provider component and useShepherdTour hook) plus the complete `ShepherdOptionsWithType` step interface (15 keys). The library accepts two top-level props: `steps` (required, array of step objects) and `tourOptions`. Shepherd.js is identified as the most actively maintained of the three major OSS libraries as of 2026 (v15.2.2 / react-shepherd 7.0.4, released March 2026). Breaking changes in v15.0.0 removed Svelte support and migrated to vanilla TypeScript; teams on pre-15 should review the CHANGELOG before upgrading. The library is "highly accessible, providing actions with the user's keyboard": keyboard navigation for forward/back/exit is built in. No official WCAG certification is claimed but modal focus trap and Escape-key handling are native.

## Key quotations / statistics

- "React Shepherd provides two convenient ways to access methods and set objects for the tour without complexities: React Hooks and React Context."
- Current versions (March 2026): shepherd.js v15.2.2, react-shepherd v7.0.4.
- Breaking change in v15.0.0: "Removed Svelte and [switched to] vanilla TypeScript." Teams migrating from Shepherd.js 14 to 15+ need to audit Svelte-specific integrations.
- Note on research: the Command Brief specifies Shepherd.js 14 but the library is now at v15.2.2 (March 2026). stinger-forge should document v15 as the current version and note the 14→15 migration path.

```javascript
// ShepherdTour Provider pattern
<ShepherdTour steps={newSteps} tourOptions={tourOptions}>
  {children}
</ShepherdTour>

// Hook pattern
const tour = useShepherdTour({ tourOptions, steps: newSteps });
tour.start();
```

- `attachTo` key: binds a step dialog to a DOM element. Accepts `{ element: "selector", on: "bottom" }`. Supports all 12 placement options: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `right`, `right-start`, `right-end`, `left`, `left-start`, `left-end`.
- `beforeShowPromise`: accepts a Promise, executes before the step renders. Used for route-navigation delays in multi-page tours:

```typescript
beforeShowPromise: function () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      router.push("/about");
      resolve();
    }, 200);
  });
}
```

- `showOn` key: accepts a function returning boolean: the step only renders if the function returns `true`. This is Shepherd's native segment-gate mechanism (analogous to `shouldShowTour` in Driver.js custom code).
- `canClickTarget` key: boolean: whether users can interact with the highlighted element while the step is active. Set `false` for read-only spotlights; `true` for action-based progression.
- Accessibility: keyboard navigation built in (LogRocket: "highly accessible, providing actions with the user's keyboard"). Modal overlay captures focus; Escape key dismisses by default.
- No built-in state persistence: Shepherd.js does not manage "has seen tour" state; teams must implement localStorage or DB persistence themselves (same gap as Driver.js, confirmed consistent across both libraries).

## Annotations for stinger-forge

- This is the dedicated source for the Shepherd.js section of `guides/03-driver-js-shepherd-js.md`. The Command Brief specifies Shepherd.js 14; stinger-forge should note that the library has advanced to v15.2.2 as of March 2026 and provide upgrade notes.
- The two integration patterns (ShepherdTour provider vs. useShepherdTour hook) should both be demonstrated in the guide. The hook pattern is cleaner for functional component trees; the provider is better when multiple components need to trigger tour methods.
- The `showOn` key is Shepherd's native segment-gate: important to call out explicitly in `guides/04-segment-triggers.md` as the Shepherd-specific implementation of the three-gate trigger idiom.
- The `beforeShowPromise` pattern for route-navigation is Shepherd's answer to the multi-page tour problem. Next.js App Router teams should use this with `useRouter().push()` inside the promise.
- The `canClickTarget: true` pattern enables action-based progression (user performs real action to advance): the correct implementation for tours that track activation behaviors, not passive "Next" clicks.
- The missing persistence layer is a recurring gap across all three OSS libraries. `guides/03-driver-js-shepherd-js.md` should include a shared persistence hook (`useTourPersistence`) that works identically for both Driver.js and Shepherd.js, so teams don't need separate implementations.
- Contradictions to resolve: the `2026-05-20-oss-tour-libraries.md` file lists Shepherd.js as version-agnostic and "updated 17 days ago." This file identifies the specific current version as v15.2.2. stinger-forge should use v15.2.2 as the canonical version reference.
