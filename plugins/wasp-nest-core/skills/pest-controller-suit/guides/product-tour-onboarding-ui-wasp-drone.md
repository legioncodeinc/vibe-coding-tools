# product-tour-onboarding-ui-wasp-drone

## Domain
This Drone owns the in-app guided-experience layer: product tours, tooltips, hotspots, modals, onboarding checklists, and the segment/trigger logic that decides who sees what and when. It treats onboarding UX as a product engineering problem, starting with tool qualification (Userpilot, Appcues, Userflow, Pendo Guides, or code-first Driver.js/Shepherd.js/Intro.js), through integration mechanics and segment logic, ending with a maintenance protocol that survives iterative UI changes without tours silently breaking after every deploy.

## Paired Stinger
[product-tour-onboarding-ui-stinger](../../product-tour-onboarding-ui-stinger) - platform selection framework, tooltip/modal/hotspot component patterns, and the selector-registry maintenance protocol.

## Trigger phrases
- "set up a product tour for new users"
- "build an onboarding checklist"
- "compare Driver.js vs Shepherd.js for us"
- "our tours keep breaking after deploys"
- "which product tour tool should we use"
- "wire up segment-based tour triggers"
- "our tour is showing to the wrong users"

## Do NOT route when
- The task is broader onboarding email sequences: no Drone owns this yet, flag it and defer rather than guessing.
- The task is user-auth flows themselves: route to `auth-wasp-drone`.
- The task is design token work for tour visuals (spacing, color, typography of the tooltip/modal chrome): route to `ux-ui-svelte-wasp-drone`; tour CSS must consume design tokens, not invent a parallel system.
- The task is analytics event instrumentation for tour funnels: route to the appropriate analytics Drone (PostHog/Mixpanel); this Drone flags what needs tracking but does not instrument it.
- The task is user-progress database schema (the table backing checklist completion state): route to `db-wasp-drone`.

## Inputs the Drone needs
- Team size, MAU, budget, and engineering involvement level, to qualify no-code vs. code-first tooling
- Whether the ask is platform selection, component implementation, trigger logic, checklist UI, or maintenance/drift diagnosis
- Existing selector conventions (class names vs. `data-tour` attributes) in the target app
- Prior tour analytics, if a follow-through or drift diagnosis is in scope

## Outputs
- A ranked platform recommendation with integration steps, or implemented tour/tooltip/modal/hotspot components
- Segment-trigger wiring using the three-gate idiom (`hasSeenTour && isInSegment && flagEnabled`)
- A selector registry and CI smoke test checking `data-tour` attribute existence
- A tour health report at `library/requirements/reports/onboarding/` or a feature-tied report

## Commonly sequenced with
- `react-wasp-drone` before or during: component architecture for a custom tour implementation
- `ux-ui-svelte-wasp-drone` after: visual polish and token application on tour chrome
- `db-wasp-drone` before: user-progress schema for checklist state persistence
