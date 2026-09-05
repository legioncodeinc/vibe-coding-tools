# Tauri Configuration Files
- URL: https://v2.tauri.app/develop/configuration-files/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-08-17
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
tauri.windows.conf.json
tauri.macos.conf.json
tauri.linux.conf.json
tauri.android.conf.json
tauri.ios.conf.json
```

The source identifies JSON Merge Patch, RFC 7396, as the platform configuration merge rule.

## Archived evidence

The default configuration is `tauri.conf.json`. JSON5 requires `config-json5` on `tauri` and `tauri-build`; TOML requires `config-toml` and uses `Tauri.toml`.

Platform-specific files exist for Linux, Windows, macOS, Android, and iOS. They merge through JSON Merge Patch semantics. Objects merge by key, while arrays replace their base arrays in full. This makes `bundle.resources` and `app.windows` especially easy to replace accidentally.

The CLI `--config` option can merge additional raw JSON or a configuration file for build flavors. Field names remain case-sensitive across formats.
