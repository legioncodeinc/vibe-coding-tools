# Tauri Process Model
- URL: https://v2.tauri.app/concept/process-model/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- Process roles named by the source: `Core`, `WebView`
- Core-owned examples: global state, settings, database connections
- Frontend secret directive: never handle secrets in frontend code

## Archived evidence

The Core process owns application-wide state, settings, and database connections. WebView processes render the user interface and communicate with the Core through IPC. The page directs applications not to handle secrets in frontend code.

## Archive interpretation

Provider credentials and privileged network clients belong behind Rust commands. A key compiled into a desktop binary is still present on a user-controlled machine, so publisher-owned provider secrets require a publisher-controlled service.
