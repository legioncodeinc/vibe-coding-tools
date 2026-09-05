# Mock Tauri APIs
- URL: https://v2.tauri.app/develop/tests/mocking/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```ts
mockIPC((cmd, args) => {});
clearMocks();
```

## Archived evidence

`@tauri-apps/api/mocks` can intercept IPC, mock events, and simulate window state for frontend tests. The examples use Vitest but do not require it.

Mocks must be cleared after every test so state does not leak between cases. WebdriverIO's Tauri service exposes equivalent IPC mocking for end-to-end and browser-mode tests.

## Archive interpretation

Mock success proves the frontend contract presented by the test double. Pair it with Rust command tests and at least one real Tauri binary path.
