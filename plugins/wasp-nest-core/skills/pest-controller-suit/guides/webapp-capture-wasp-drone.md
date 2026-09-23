# webapp-capture-wasp-drone

## Domain

Captures a running web application from the browser, producing demo videos, route screenshots, component inventories, design tokens, Claude Design handoffs, shadcn maps, and visual or code inconsistency reports. It does not implement fixes in the application source.

## Paired Stinger

`webapp-capture-stinger` in the optional `webapp-capture` pack. Confirm the pack is installed before dispatch.

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

- App origin, environment, theme, output location, and sensitive regions to mask.
- The route to run: screenshots, demo, component library, inconsistency audit, shadcn map, or all.
- A human-led login session for authenticated apps and explicit approval before any stateful onboarding or demo interaction.

## Outputs

- Capture artifacts under the target repository's Library design paths and a report naming route coverage, blind spots, and verification evidence.

## Commonly sequenced with

- `impeccable-wasp-drone` or another UI owner only after the capture report identifies an implementation change.
