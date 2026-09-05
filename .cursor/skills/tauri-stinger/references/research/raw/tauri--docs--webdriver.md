# Tauri WebDriver Testing
- URL: https://v2.tauri.app/develop/tests/webdriver/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-06-29
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- Recommended service: `@wdio/tauri-service`
- Backend access API: `browser.tauri.execute()`
- Providers named by the source: `embedded`, `external`, `crabnebula`
- Renderer-only option named by the source: browser mode

## Archived evidence

Tauri recommends WebdriverIO with `@wdio/tauri-service` for Windows, Linux, and macOS. It can execute Tauri backend helpers, mock IPC, capture frontend and backend logs, and run multiremote tests.

The embedded WebDriver server avoids an external native driver and enables macOS support. Browser mode can test a plain frontend dev server with intercepted invokes, but it does not launch a Tauri binary. Direct `tauri-driver` remains limited to Windows and Linux on desktop.

## Archive interpretation

Record which provider and mode ran. Browser mode is valuable but is not native binary proof.
