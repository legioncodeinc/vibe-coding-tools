---
name: "product-tour-onboarding-ui-stinger"
description: "In-app product tour and onboarding UI specialist. Selects the right tour tool (Userpilot, Appcues, Userflow, Pendo Guides, Driver.js, Shepherd.js, Intro.js), implements tooltip/modal/hotspot/checklist components, wires segment-based trigger logic, and establishes a tour maintenance protocol that survives iterative UI changes. Invoke when the user says \\\\\\\"set up a product tour\\\\\\\", \\\\\\\"build an onboarding checklist\\\\\\\", \\\\\\\"compare Driver.js vs Shepherd.js\\\\\\\", \\\\\\\"our tours keep breaking after deploys\\\\\\\", \\\\\\\"which product tour tool should we use\\\\\\\", \\\\\\\"add segment-based tour triggers\\\\\\\", or \\\\\\\"our tour is showing to the wrong users\\\\\\\". Do NOT invoke for broader onboarding email sequences (lifecycle-email Bee), user-auth flows (auth-worker-bee), design token work (ux-ui-svelte-worker-bee), or analytics instrumentation (posthog/mixpanel Bees)."
license: MIT
---

# product-tour-onboarding-ui Stinger

Procedural arsenal for `product-tour-onboarding-ui-worker-bee`, the Bee that owns the in-app guided-experience layer.

This stinger is organized around the seven action verbs from the Command Brief: qualify the tour stack, select a platform, implement components, wire segment triggers, build the checklist UI, establish a maintenance protocol, and produce a tour health report.

**The stinger's three non-negotiables (from `guides/00-principles.md`):**

1. **Stable anchors first.** Never target an element by CSS class or text if you can add a `data-tour` attribute. Classes change; `data-tour` attributes are a contract.
2. **Qualify before recommending.** Run the four-axis decision framework (cost, code-depth, team size, DOM stability) before naming a platform.
3. **Tour maintenance is code maintenance.** A tour without a selector registry and CI smoke test is technical debt from day one.

---

## When this stinger applies

Load this stinger when `product-tour-onboarding-ui-worker-bee` is invoked. Trigger scenarios:

- User wants to add a product tour to a React/Next.js app.
- User is deciding between Userpilot, Appcues, Userflow, Pendo, Driver.js, or Shepherd.js.
- Tours are breaking after UI changes (selector drift problem).
- User wants to show different tours to different user segments.
- User wants to add an onboarding checklist with progress gamification.
- User wants to audit existing tours for health and effectiveness.

Do NOT load for:
- Onboarding email sequences (out of scope: no Bee owns this yet).
- User authentication flows (auth-worker-bee).
- Design token system for tour tooltip styling (ux-ui-svelte-worker-bee).
- Analytics funnel instrumentation for tour events (posthog/mixpanel Bees).
- Database schema for user-progress storage (db-worker-bee).

---

## First action when this stinger is loaded

Read these files in order before producing any output:

1. **`guides/00-principles.md`**: the three non-negotiables and the foreman's boundary; read on every invocation.
2. **`guides/01-platform-selection.md`**: the four-axis decision framework for tool selection; required before any platform recommendation.
3. The guide(s) that match the user's specific task (see the guide index below).

---

## Guide index

| Guide | When to read |
|---|---|
| `guides/00-principles.md` | Every invocation |
| `guides/01-platform-selection.md` | Any platform recommendation or comparison |
| `guides/02-tooltip-modal-hotspot.md` | Implementing tour component UI (tooltips, modals, hotspots, spotlights) |
| `guides/03-driver-js-shepherd-js.md` | Code-first open-source implementation (Driver.js or Shepherd.js) |
| `guides/04-segment-triggers.md` | Wiring tour trigger logic or segment conditions |
| `guides/05-checklist-activation.md` | Onboarding checklist UI, progress gamification, activation milestones |
| `guides/06-maintenance-and-drift.md` | Tour breakage diagnosis, selector hygiene, CI integration |

---

## Worked examples

- `examples/happy-path-driver-js.md`: end-to-end implementation of a three-step product tour with Driver.js 9.x + React + `data-tour` anchors + localStorage persistence.
- `examples/saas-platform-audit.md`: walkthrough of the qualification checklist applied to a 2,000-MAU SaaS startup choosing between Userpilot, Userflow, and Driver.js.

---

## Output templates

- `templates/tour-audit-report.md`: the tour health report template; produced for every standalone audit.
- `templates/data-tour-registry.json`: the selector registry template; populate one entry per interactive element targeted by any tour.

---

## Critical directives (lifted from the Command Brief)

- **Select stable element anchors (`data-tour` attributes) over class or text selectors.** CSS class names change with every CSS-in-JS rebuild; `data-tour` is a durable engineering contract. See `guides/06-maintenance-and-drift.md`.
- **Never recommend a tour platform without running the qualification checklist first.** Wrong-tool selection costs months of migration. The checklist lives in `guides/01-platform-selection.md`.
- **Treat tour maintenance as code maintenance.** A tour without a CI smoke test and selector registry will break silently. The maintenance protocol is `guides/06-maintenance-and-drift.md`.
- **Route visual polish to `ux-ui-svelte-worker-bee`.** Tour tooltip/modal CSS must consume the product's design tokens; a parallel custom-CSS system in the tour layer is a maintenance trap.
- **Do not instrument analytics yourself.** Flag what needs tracking; route to the appropriate analytics Bee.

---

## Research foundation

All factual claims in this stinger's guides trace to files in `research/external/`. The research index is at `research/index.md`. The summary of the five most influential sources is at `research/research-summary.md`. Refresh annually or on a major platform version bump.

Key sources:
- Platform pricing + features: `research/external/2026-05-20-saas-platform-comparison.md`
- OSS library comparison: `research/external/2026-05-20-oss-tour-libraries.md`
- Maintenance + drift prevention: `research/external/2026-05-20-tour-maintenance-unbreakable.md`
- Segment triggers: `research/external/2026-05-20-segment-triggers-feature-flags.md`
- Checklist activation: `research/external/2026-05-20-checklist-activation-gamification.md`
- Shepherd.js integration: `research/external/2026-05-20-shepherdjs-react-integration.md`
- Driver.js integration: `research/external/2026-05-20-driverjs-react-integration.md`
- Tour analytics ROI: `research/external/2026-05-20-tour-analytics-effectiveness.md`

---

*Forged by stinger-forge from `product-tour-onboarding-ui-worker-bee-command-brief.md` and `research/`. Part of the Hive.*
