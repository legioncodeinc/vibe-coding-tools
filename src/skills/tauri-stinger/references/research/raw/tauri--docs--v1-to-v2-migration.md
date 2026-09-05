# Upgrade from Tauri 1.0
- URL: https://v2.tauri.app/start/migrate/from-tauri-1/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-06-15
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
pnpm update @tauri-apps/cli@latest
pnpm tauri migrate
```

```ts
import { invoke } from '@tauri-apps/api/core';
```

## Archived evidence

The Tauri 2 CLI provides `tauri migrate`, but the guide says automation is not a substitute for reading the complete migration instructions.

Mobile preparation moves the shared `run()` function to `lib.rs`, adds `#[cfg_attr(mobile, tauri::mobile_entry_point)]`, and configures library crate types. Configuration changes include top-level package metadata, `tauri` becoming `app`, `bundle` moving to the top level, `build.distDir` becoming `build.frontendDist`, and `build.devPath` becoming `build.devUrl`.

The v1 allowlist becomes capabilities, permissions, and scopes. The migration command generates a capability from the allowlist, but that output still needs manual least-privilege review.

Many former built-in APIs become plugins. Frontend `@tauri-apps/api/tauri` moves to `@tauri-apps/api/core`; sidecars move to the shell plugin; the updater moves under `plugins.updater`; already-distributed v1 applications need `v1Compatible` updater artifacts during transition.

The event system changes target semantics, including `emit_to`, `listen_any`, and webview-specific listeners.
