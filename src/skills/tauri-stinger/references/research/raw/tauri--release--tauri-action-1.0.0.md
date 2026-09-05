# Tauri Action 1.0.0 Release
- URL: https://github.com/tauri-apps/tauri-action/releases/tag/action-v1.0.0
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-06-29
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `action-v1.0.0`
- Package: `tauri-action`
- Version: `1.0.0`
- Published: `2026-06-29`
- Tauri 1 removal commit: `9b64567`
- Mobile build commit: `acc588b`

Exact input changes captured from the release:

- Removed: `includeRelease`, `includeDebug`, `updaterJsonKeepUniversal`
- Renamed: `assetNamePattern` to `releaseAssetNamePattern`
- Renamed: `includeUpdaterJson` to `uploadUpdaterJson`

Captured changelog fragments:

- `Drop support for Tauri v1 and unstable v2`
- `.app.tar.gz` and `.app.tar.gz.sig` files include the app version
- `Added initial Android & iOS support`

## Archived evidence

The action drops Tauri 1 and unstable Tauri 2 prerelease support. It adds initial Android and iOS build support but leaves dependency installation and store upload to the workflow owner.

Breaking changes include versioned `.app.tar.gz` updater artifact names, removing `includeRelease` and `includeDebug`, renaming `assetNamePattern` to `releaseAssetNamePattern`, renaming `includeUpdaterJson` to `uploadUpdaterJson`, removing automatic Tauri project initialization, and failing when `draft: true` targets a non-draft release.

The release also changes `latest.json` URLs to GitHub URLs and searches upward for a frontend lockfile.

## Archive interpretation

Read the 1.0.0 notes before changing a workflow from `@v0` to `@v1`. Building mobile packages does not prove store readiness or device behavior.
