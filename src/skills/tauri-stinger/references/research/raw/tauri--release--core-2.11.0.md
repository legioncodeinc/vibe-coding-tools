# Tauri Core 2.11.0 Release
- URL: https://github.com/tauri-apps/tauri/releases/tag/tauri-v2.11.0
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-04-30
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `tauri-v2.11.0`
- Package: `tauri`
- Version: `2.11.0`
- Published: `2026-04-30`
- `#[tauri::command]` rename commit: `c00a3dbff`
- WebView callback evaluation commit: `b27be063f`
- Mobile file association and `RunEvent::Opened` commit: `cc5c97602`
- Mobile multiwindow and Linux `dbus` commit: `093e2b47c`

Short release entries:

> Add support for the `rename` attribute in the `tauri::command` macro.

> Support creating multiple windows on Android (activity embedding) and iOS (scenes).

## Archived evidence

The release adds command renaming, `eval_with_callback`, deeper drag regions, mobile file associations, Android `RunEvent::Opened`, mobile suspend/resume propagation, Android/iOS multiwindow support, and web-content-process termination handling. It also enables the Linux `dbus` feature by default for theme detection.

## Archive interpretation

This is the main core feature tranche in the six-month update window. Never feed model-produced text into direct WebView evaluation; AI integrations should transport model output as typed data.
