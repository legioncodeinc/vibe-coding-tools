# Current Tauri 2 Snapshot

Snapshot cutoff: 2026-09-03. This file records what was current at that date. It must never be treated as a timeless install manifest.

## Package versions observed

| Package | Version | Release evidence |
|---|---:|---|
| `tauri` | 2.11.5 | 2026-07-01 official tag |
| Rust `tauri-cli` | 2.11.4 | 2026-06-28 official tag |
| npm `@tauri-apps/cli` | 2.11.4 | 2026-06-28 official tag |
| npm `@tauri-apps/api` | 2.11.1 | 2026-06-17 official tag |
| `tauri-runtime` | 2.11.3 | 2026-06-17 official tag |
| `tauri-runtime-wry` | 2.11.4 | 2026-06-30 official tag |
| `tauri-bundler` | 2.9.4 | 2026-06-28 official tag |
| Updater plugin, Rust and npm | 2.11.0 | 2026-08-31 package tags |
| HTTP plugin, Rust and npm | 2.6.0 | 2026-08-31 package tags |
| Filesystem plugin, Rust and npm | 2.5.2 | 2026-08-31 package tags and advisory |
| Shell plugin, Rust and npm | 2.3.6 | 2026-08-31 package tags |
| Store plugin, Rust and npm | 2.4.4 | 2026-07-18 package tags |
| SQL plugin, Rust and npm | 2.4.1 | 2026-08-31 package tags |
| `tauri-action` | 1.0.0 | 2026-06-29 official tag |

Evidence: [research/distilled-tauri-2.md](research/distilled-tauri-2.md), section "Dated package snapshot."

## Update notes that change engineering decisions

- Core 2.11.0 is the main in-window feature release, including command renaming, mobile lifecycle/multiwindow support, and `eval_with_callback`. Treat evaluation as a privileged escape hatch and never execute model-produced JavaScript. [research/raw/tauri--release--core-2.11.0.md](research/raw/tauri--release--core-2.11.0.md)
- Core 2.11.1 is the remote-content security floor in this snapshot because it fixes CVE-2026-42184 and an additional remote-origin custom-command ACL bypass. [research/raw/tauri--advisory--cve-2026-42184.md](research/raw/tauri--advisory--cve-2026-42184.md) [research/raw/tauri--release--core-2.11.1.md](research/raw/tauri--release--core-2.11.1.md)
- Core 2.11.2 fixes the macOS Window-menu setter calling the Help-menu setter. [research/raw/tauri--release--core-2.11.2.md](research/raw/tauri--release--core-2.11.2.md)
- Core 2.11.3 fixes deadlocks in Channel delivery, filesystem scope initialization, and Android plugin responses. Streaming AI applications should include stress and cancellation coverage when moving from an earlier 2.11 patch. [research/raw/tauri--release--core-2.11.3.md](research/raw/tauri--release--core-2.11.3.md)
- Core 2.11.4 temporarily pins `time` for build compatibility; 2.11.5 removes that pin after the corrected upstream release. [research/raw/tauri--release--core-2.11.4.md](research/raw/tauri--release--core-2.11.4.md) [research/raw/tauri--release--core-2.11.5.md](research/raw/tauri--release--core-2.11.5.md)
- Filesystem plugin 2.5.2 repairs affected default and deny scopes, including WebView data protection. [research/raw/tauri--release--fs-2.5.2.md](research/raw/tauri--release--fs-2.5.2.md)
- Bundler 2.9.3 repairs signed NSIS packages that could embed unsigned stock DLLs. [research/raw/tauri--release--bundler-2.9.3.md](research/raw/tauri--release--bundler-2.9.3.md)
- CLI 2.10.1 says empty-password updater keys created by CLI 2.9.3 through 2.10.0 must be regenerated. [research/raw/tauri--release--cli-changelog.md](research/raw/tauri--release--cli-changelog.md)
- Updater 2.11.0 surfaces Windows installer startup failures, adds relaunch control, and enables system proxy support on Windows and macOS. [research/raw/tauri--release--updater-2.11.0.md](research/raw/tauri--release--updater-2.11.0.md)
- HTTP 2.6.0 renames the prior macOS proxy feature to `system-proxy`. [research/raw/tauri--release--http-2.6.0.md](research/raw/tauri--release--http-2.6.0.md)
- Tauri Action 1.0.0 removes Tauri 1 support, changes artifact names and inputs, and adds build-only mobile support. [research/raw/tauri--release--tauri-action-1.0.0.md](research/raw/tauri--release--tauri-action-1.0.0.md)

## Known provenance conflict

The generated Tauri release index still showed older updater, HTTP, filesystem, shell, and SQL versions after official package-specific releases appeared on 2026-08-31. Use package-specific immutable GitHub tags when this conflict recurs. [research/raw/tauri--release--ecosystem-index.md](research/raw/tauri--release--ecosystem-index.md)

## Refresh protocol

Before changing versions or saying "latest":

1. Read the target project's `package.json`, package lockfile, `src-tauri/Cargo.toml`, and `Cargo.lock`.
2. Check the official Tauri release index for package identity, then open each package-specific official tag.
3. Check official security advisories for `tauri` and `plugins-workspace`.
4. For runtime behavior, inspect the immutable `Cargo.toml` at the selected Tauri tag and the project's resolved lockfile.
5. Record the observation date, exact Rust and npm identities, target platforms, migration notes, and source URLs.
6. Preserve alignment: same core minor for `tauri` and `@tauri-apps/api`; exact version for each plugin's Rust and npm halves.
7. Run project tests and package-level smoke tests before accepting a lockfile update.

Primary refresh surfaces:

- https://v2.tauri.app/release/
- https://github.com/tauri-apps/tauri/releases
- https://github.com/tauri-apps/plugins-workspace/releases
- https://github.com/tauri-apps/tauri/security/advisories
- https://github.com/tauri-apps/plugins-workspace/security/advisories
- https://github.com/tauri-apps/tauri-action/releases
