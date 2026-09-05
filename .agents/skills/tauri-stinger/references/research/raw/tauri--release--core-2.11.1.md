# Tauri Core 2.11.1 Release
- URL: https://github.com/tauri-apps/tauri/releases/tag/tauri-v2.11.1
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-05-06
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `tauri-v2.11.1`
- Package: `tauri`
- Version: `2.11.1`
- Published: `2026-05-06`
- Remote ACL fix commit: `1b26769f9`
- Local-origin fix commit: `ba025588f`

> Enforce ACL checks for IPC requests from remote origins even when no `AppManifest` is configured.

> Correctly handle `.localhost` suffix in local origins on Windows and Android.

## Archived evidence

The release added mobile monitor APIs and fixed an Android `requestPermission` crash.

It contains two security-labeled fixes. First, remote-origin IPC requests are now subject to ACL resolution even when no `AppManifest` is configured. Before the fix, custom non-plugin commands could bypass ACL resolution in that configuration. Second, local-origin classification now handles the `.localhost` suffix correctly on Windows and Android so a remote host beginning with a registered scheme is not mistaken for a local origin.

## Archive interpretation

Treat 2.11.1 as the minimum core release for applications that load remote content. Prefer the later compatible stable patch after inspecting the project and current releases.
