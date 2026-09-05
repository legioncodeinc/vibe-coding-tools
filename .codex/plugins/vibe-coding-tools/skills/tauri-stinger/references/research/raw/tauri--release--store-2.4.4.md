# Tauri Store Plugin 2.4.4 Release
- URL: https://github.com/tauri-apps/plugins-workspace/releases/tag/store-v2.4.4
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-07-18
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `store-v2.4.4`
- Package: `tauri-plugin-store`
- Version: `2.4.4`
- Published: `2026-07-18`

> Fix `StoreOptions` requires `defaults` field.

## Archived evidence

The release fixes a JavaScript type and API regression that incorrectly made `StoreOptions.defaults` required. The npm binding is archived separately in `tauri--release--store-js-2.4.4.md`.

## Archive interpretation

Do not make a default object mandatory solely to satisfy types from an affected plugin release.
