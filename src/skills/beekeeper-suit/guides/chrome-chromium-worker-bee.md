# chrome-chromium-worker-bee

## Domain

This Bee owns Chrome DevTools Protocol work, safe developer profiles, remote debugging, Chromium checkout and build orientation, and browser-engine diagnosis. It treats debugger WebSocket endpoints and separate browser profiles as security-sensitive development infrastructure.

## Paired Stinger

[chrome-chromium-stinger](../../chrome-chromium-stinger) - current primary-source guidance for CDP inspection and Chromium development workflows.

## Trigger phrases

- "Chrome DevTools Protocol"
- "remote debugging Chrome"
- "Chromium build"
- "Chrome user data dir"
- "debug Chromium"

## Do NOT route when

- The task writes Playwright or Puppeteer tests, which belongs to browser-automation-worker-bee.
- The task builds Electron process boundaries, which belongs to electron-app-worker-bee.
- The task is ordinary Chrome extension or web application product work without CDP or engine concerns.

## Inputs the Bee needs

- Browser channel, isolated profile path, debugging exposure boundary, protocol target, source checkout status, target platform, available disk and memory, and the expected evidence.

## Outputs

- Safe development setup, protocol or source-build diagnosis, command and artifact evidence, security notes, and a report under `library/`.
