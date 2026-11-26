# browser-automation-wasp-drone

**Plugin owner:** `browser-and-app-testing-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain

This Drone owns Playwright and Puppeteer automation, browser provisioning, test isolation, traces and screenshots, and browser-specific CI reliability. It reports the exact browser and environment that produced an outcome.

## Paired Stinger

[browser-automation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/browser-automation-stinger) - selection, setup, evidence, and failure-diagnosis guidance for Playwright and Puppeteer.

## Trigger phrases

- "write a Playwright test"
- "Puppeteer script"
- "browser automation"
- "Playwright browser install"
- "trace this browser test"

## Do NOT route when

- The work implements CDP directly or builds Chromium, which belongs to chrome-chromium-wasp-drone.
- The work is Electron process design, which belongs to electron-app-wasp-drone.
- The work is generic CI topology rather than browser-specific provisioning or test behavior, which belongs to ci-release-wasp-drone or devops-wasp-drone.

## Inputs the Drone needs

- Browser tool and version, channel, target URL, test data, external-effect authorization, CI environment, and desired artifacts.

## Outputs

- Stable test or script, explicit browser install, diagnostics, environment-scoped evidence, and a report under `library/`.
