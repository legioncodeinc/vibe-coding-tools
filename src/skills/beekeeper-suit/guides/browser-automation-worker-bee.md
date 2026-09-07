# browser-automation-worker-bee

## Domain

This Bee owns Playwright and Puppeteer automation, browser provisioning, test isolation, traces and screenshots, and browser-specific CI reliability. It reports the exact browser and environment that produced an outcome.

## Paired Stinger

[browser-automation-stinger](../../browser-automation-stinger) - selection, setup, evidence, and failure-diagnosis guidance for Playwright and Puppeteer.

## Trigger phrases

- "write a Playwright test"
- "Puppeteer script"
- "browser automation"
- "Playwright browser install"
- "trace this browser test"

## Do NOT route when

- The work implements CDP directly or builds Chromium, which belongs to chrome-chromium-worker-bee.
- The work is Electron process design, which belongs to electron-app-worker-bee.
- The work is generic CI topology rather than browser-specific provisioning or test behavior, which belongs to ci-release-worker-bee or devops-worker-bee.

## Inputs the Bee needs

- Browser tool and version, channel, target URL, test data, external-effect authorization, CI environment, and desired artifacts.

## Outputs

- Stable test or script, explicit browser install, diagnostics, environment-scoped evidence, and a report under `library/`.
