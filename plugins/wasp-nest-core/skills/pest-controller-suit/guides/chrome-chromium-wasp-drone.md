# chrome-chromium-wasp-drone

**Plugin owner:** `browser-and-app-testing-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain

This Drone owns Chrome DevTools Protocol work, safe developer profiles, remote debugging, Chromium checkout and build orientation, and browser-engine diagnosis. It treats debugger WebSocket endpoints and separate browser profiles as security-sensitive development infrastructure.

## Paired Stinger

[chrome-chromium-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/chrome-chromium-stinger) - current primary-source guidance for CDP inspection and Chromium development workflows.

## Trigger phrases

- "Chrome DevTools Protocol"
- "remote debugging Chrome"
- "Chromium build"
- "Chrome user data dir"
- "debug Chromium"

## Do NOT route when

- The task writes Playwright or Puppeteer tests, which belongs to browser-automation-wasp-drone.
- The task builds Electron process boundaries, which belongs to electron-app-wasp-drone.
- The task is ordinary Chrome extension or web application product work without CDP or engine concerns.

## Inputs the Drone needs

- Browser channel, isolated profile path, debugging exposure boundary, protocol target, source checkout status, target platform, available disk and memory, and the expected evidence.

## Outputs

- Safe development setup, protocol or source-build diagnosis, command and artifact evidence, security notes, and a report under `library/`.
