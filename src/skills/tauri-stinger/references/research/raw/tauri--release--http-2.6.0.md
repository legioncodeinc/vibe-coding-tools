# Tauri HTTP Plugin 2.6.0 Release
- URL: https://github.com/tauri-apps/plugins-workspace/releases/tag/http-v2.6.0
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-08-31
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `http-v2.6.0`
- Package: `tauri-plugin-http`
- Version: `2.6.0`
- Published: `2026-08-31`
- Feature commit: `19fb3926`

> Added `system-proxy` feature to replace the old `macos-system-configuration` feature flag.

## Archived evidence

The release replaces the former `macos-system-configuration` Cargo feature with `system-proxy` to match the current `reqwest` API. It also documents plugin Cargo feature flags.

## Archive interpretation

Treat feature-name changes as an upgrade review item. Do not infer HTTP behavior from a stale lockfile or documentation index.
