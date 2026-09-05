# Tauri Filesystem Plugin 2.5.2 Release
- URL: https://github.com/tauri-apps/plugins-workspace/releases/tag/fs-v2.5.2
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-08-31
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `fs-v2.5.2`
- Package: `tauri-plugin-fs`
- Version: `2.5.2`
- Published: `2026-08-31`
- Scope fix commits: `685610ae`, `3fb27bf1`

Captured changelog fragments:

- `fs:default` and `fs:read-app-specific-dirs-recursive` not giving any command scopes
- `deny-webview-data` has no effect

## Archived evidence

The release fixes `fs:default` and `fs:read-app-specific-dirs-recursive` failing to grant command scopes. It also fixes `deny-webview-data` not taking effect and narrows the Linux denial to WebView data rather than all of `$APPLOCALDATA`. Android packaging gains the missing Gradle 9 `consumer-rules.pro` file.

## Archive interpretation

Projects relying on these predefined scope sets need 2.5.2 or later and must re-test both allowed application data and denied WebView data paths.
