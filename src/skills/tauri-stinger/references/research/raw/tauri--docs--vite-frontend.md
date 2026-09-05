# Tauri Vite Frontend Configuration
- URL: https://v2.tauri.app/start/frontend/vite/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```js
envPrefix: ['VITE_', 'TAURI_ENV_*'],
```

```js
const host = process.env.TAURI_DEV_HOST;
```

## Archived evidence

The current Tauri Vite example exposes `VITE_` and the narrower `TAURI_ENV_*` prefix through `envPrefix`. It uses `TAURI_DEV_HOST` in Vite configuration for physical iOS development and uses `TAURI_ENV_PLATFORM` and `TAURI_ENV_DEBUG` to adjust build targets and debug settings.

The example does not expose the broad `TAURI_` prefix.

## Archive interpretation

An inspector should distinguish the literal broad prefix `TAURI_` from the documented narrower `TAURI_ENV_*` pattern.
