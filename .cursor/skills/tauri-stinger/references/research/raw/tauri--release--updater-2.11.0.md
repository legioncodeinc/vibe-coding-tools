# Tauri Updater Plugin 2.11.0 Release
- URL: https://github.com/tauri-apps/plugins-workspace/releases/tag/updater-v2.11.0
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-08-31
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `updater-v2.11.0`
- Package: `tauri-plugin-updater`
- Version: `2.11.0`
- Published: `2026-08-31`
- Installer error commit: `622f02bf`
- Relaunch option commit: `ab7489c9`
- System proxy commit: `2371be83`

Captured changelog fragments:

- `failed to spawn the installer` through `ShellExecuteW`
- `restartAfterInstall` and `restart_after_install`
- `system-proxy` enabled by default

## Archived evidence

The Rust plugin adds `restart_after_install`, exposed as `restartAfterInstall` in JavaScript, for controlling relaunch after Windows installation. Windows installer startup through `ShellExecuteW` now reports failure as an error.

The release adds a default-enabled `system-proxy` Cargo feature that uses Windows and macOS system proxy settings through `reqwest`.

## Archive interpretation

The plugin reached 2.11.0 after the generated Tauri release website snapshot. Test proxy-dependent enterprise environments and relaunch behavior when adopting it.
