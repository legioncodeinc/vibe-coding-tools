# Tauri Shell Plugin
- URL: https://v2.tauri.app/plugin/shell/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-02-22
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
windows: child processes
linux: child processes
macos: child processes
android: open URLs only
ios: open URLs only
```

Permission identifiers include `shell:allow-execute`, `shell:allow-spawn`, `shell:allow-kill`, and `shell:allow-stdin-write`.

## Archived evidence

The Shell plugin runs child processes on Windows, Linux, and macOS. Its supported-platform table includes Android and iOS only for opening URLs, not for spawning or executing child processes.

Potentially dangerous commands and scopes are blocked by default. Separate permissions exist for execute, spawn, stdin writes, and process termination. The default permission is limited to opening predefined URL schemes rather than arbitrary command execution.

## Archive interpretation

Local AI sidecars are a desktop topology. Mobile applications need a native plugin, embedded library, or hosted service instead of assuming child-process support from the mobile Shell plugin.
