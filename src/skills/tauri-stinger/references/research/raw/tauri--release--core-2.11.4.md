# Tauri Core 2.11.4 Release
- URL: https://github.com/tauri-apps/tauri/releases/tag/tauri-v2.11.4
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-06-30
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `tauri-v2.11.4`
- Package: `tauri`
- Version: `2.11.4`
- Published: `2026-06-30`
- Dependency workaround commit: `0299da0d3`
- Runtime dependency: `tauri-runtime-wry@2.11.4`

> Pinning `time` to `<0.3.52` used by `cookie` to mitigate a compilation error.

## Archived evidence

The release temporarily constrained the `time` dependency to avoid an upstream `cookie` compilation failure and updated the Wry-backed runtime package.

## Archive interpretation

This is a build-compatibility workaround, not a security fix. Tauri 2.11.5 removed the pin after corrected `time` 0.3.53 became available.
