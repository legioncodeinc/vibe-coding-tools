# Filesystem Default Hardening Advisory GHSA-9g54-6x48-9vpw
- URL: https://github.com/tauri-apps/plugins-workspace/security/advisories/GHSA-9g54-6x48-9vpw
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Published: 2026-08-31
- Source type: official-docs
- Material: repository security advisory

## Captured source material

- Advisory: `GHSA-9g54-6x48-9vpw`
- Affected npm: `@tauri-apps/plugin-fs >=2.0, <2.5.2`
- Affected Rust: `tauri-plugin-fs >=2.0.0, <2.5.2`
- Patched: `2.5.2`

> The Tauri `fs` plugin shipped with default permissions intended to prevent access to local WebView folders.

## Archived evidence

The advisory affects npm `@tauri-apps/plugin-fs` from 2.0.0 before 2.5.2 and Rust `tauri-plugin-fs` from 2.0.0 before 2.5.2. Both are patched in 2.5.2.

The predefined denial for WebView data could be ineffective when an application explicitly exposed `$APPLOCALDATA` and descendants. Exploitation also requires a way to control arbitrary filesystem command arguments, such as another authorization flaw or arbitrary script execution in the WebView.

## Archive interpretation

Default permission names are not proof of an effective filesystem boundary. Inspect resolved scopes and test denied paths.
