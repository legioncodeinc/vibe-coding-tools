# Tauri Core 2.11.3 Release
- URL: https://github.com/tauri-apps/tauri/releases/tag/tauri-v2.11.3
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-06-17
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `tauri-v2.11.3`
- Package: `tauri`
- Version: `2.11.3`
- Published: `2026-06-17`
- Filesystem scope deadlock commit: `7af245c60`
- Nested once-listener commit: `4c8bb98cd`
- Channel and Android response deadlock commit: `66f873d62`
- Async custom-protocol commit: `e6083a111`

Short release entries:

> Fix `tauri::scope::fs::Scope::once` deadlocks.

> Adjust mutex locking in `send_channel_data_handler`, `handle_android_plugin_response`, `send_channel_data` to avoid deadlocks.

## Archived evidence

The release fixes deadlocks in filesystem scope initialization, Channel delivery, and Android plugin responses. It also prevents a nested emission from calling a `Listener::once` handler more than once and makes `tauri://` custom-protocol loading asynchronous.

## Archive interpretation

The Channel deadlock fix is directly relevant to streaming AI output. Projects on earlier 2.11 patches should include high-volume stream and cancellation tests when upgrading.
