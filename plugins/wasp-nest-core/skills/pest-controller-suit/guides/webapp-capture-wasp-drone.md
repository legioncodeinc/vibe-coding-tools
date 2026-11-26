# webapp-capture-wasp-drone

**Plugin owner:** `browser-and-app-testing-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain

Captures a running web application from the browser, producing demo videos, route screenshots, component inventories, design tokens, Claude Design handoffs, shadcn maps, and visual or code inconsistency reports. It does not implement fixes in the application source.

## Paired Stinger

`webapp-capture-stinger` in the optional `browser-and-app-testing-tools` plugin. Confirm the pack is installed before dispatch.

## Trigger phrases

- "Record a walkthrough of this app"
- "Screenshot every page"
- "Capture our component library from the live site"
- "Find visual and code inconsistencies in this running app"
- "Package the captured UI for Claude Design"

## Do NOT route when

- The request is to write Playwright tests or debug traces: use `browser-automation-wasp-drone`.
- The request is to build a design system from a brief without a running app: use `design-system-wasp-drone`.
- The request is to fix the app's UI after capture: use the owning implementation Drone.
- The user has not supplied an app origin or authorized any required interactive setup.

## Inputs the Drone needs

- App origin, environment, real post-login landing page, theme, output location, and sensitive regions to mask.
- The route to run: screenshots, demo, component library, inconsistency audit, shadcn map, or all.
- A human-led login session for authenticated apps and explicit approval before any stateful onboarding or demo interaction, including each demo write declared in `writes[]` and any retake that would repeat one.

## Outputs

- Capture artifacts under the target repository's Library design paths and a report naming route coverage, blind spots, and verification evidence. Demo runs add `writes-report.json`, a privacy review, and `findings.md` entries for any scene that failed or did not verify.

## Commonly sequenced with

- `impeccable-wasp-drone` or another UI owner only after the capture report identifies an implementation change.
