# Tauri 2 Release Checklist

Use this checklist for release planning and artifact evidence. It does not replace `security-stinger`, `quality-stinger`, `github-repo-health-stinger`, or user approval.

## Versions and inputs

- [ ] Record observation date and immutable release URLs.
- [ ] Confirm Cargo `tauri` and npm `@tauri-apps/api` share a major and minor.
- [ ] Confirm every plugin's Rust and npm halves resolve to the exact same version.
- [ ] Review all migration and breaking notes between old and new versions.
- [ ] Confirm Wry and Tao behavior from the chosen Tauri tag or project lockfile.
- [ ] Regenerate any empty-password updater key created by CLI 2.9.3 through 2.10.0.
- [ ] For remote content, confirm core meets the current security floor.
- [ ] For affected filesystem scopes, confirm the plugin meets the current patched floor.
- [ ] For signed NSIS output, confirm the bundler includes the signed-plugin fix.

Evidence basis: [CURRENT-TAURI-2.md](CURRENT-TAURI-2.md).

## Application verification

- [ ] Frontend unit tests clear Tauri mocks between cases.
- [ ] Rust unit and integration tests exercise validation, authorization, state, cancellation, and persistence.
- [ ] IPC contract tests cover success, structured errors, invalid input, cancellation, and terminal Channel states.
- [ ] Native WebDriver or equivalent exercises at least one actual Tauri binary per supported desktop family.
- [ ] Browser-mode results are labeled as renderer-only.
- [ ] Sidecar tests cover missing binary, wrong protocol, malformed and oversized messages, unexpected exit, restart, and shutdown.
- [ ] Mobile changes run on a simulator where useful and a physical supported device before release.
- [ ] Platform-specific configuration arrays are checked after merge.

Evidence basis: [research/raw/tauri--docs--tests-overview.md](research/raw/tauri--docs--tests-overview.md) and [research/raw/tauri--docs--webdriver.md](research/raw/tauri--docs--webdriver.md). Physical-device and package checks are derived release policy.

## Authority and secrets

- [ ] Review the resolved capability union for every window and WebView.
- [ ] Review every remote URL pattern and iframe implication.
- [ ] Confirm custom commands that need restriction are declared in `AppManifest::commands`.
- [ ] Audit custom scope enforcement in Rust.
- [ ] Confirm shell and sidecar rules name only required binaries and bounded arguments.
- [ ] Scan built frontend assets and packaged resources for credential names and test canaries.
- [ ] Confirm model output is rendered as data and never evaluated as code.
- [ ] Run the formal Security gate and resolve medium or higher findings before Quality.

Evidence basis: [IPC-SECURITY-REFERENCE.md](IPC-SECURITY-REFERENCE.md).

## Desktop artifacts

- [ ] Build each supported operating-system and architecture target on an appropriate runner.
- [ ] Install the final Windows installer and inspect signatures on the application, installer, and embedded DLLs.
- [ ] Launch, update, roll back or reject an invalid update, and uninstall on Windows.
- [ ] Verify the macOS application signature, notarization result, stapling result, DMG or App Store artifact, and first launch.
- [ ] Install and launch each supported Linux package type in a representative environment.
- [ ] Confirm every bundled sidecar has the correct target triple, executable permissions, signature where applicable, and runtime dependency set.

Evidence basis: [research/raw/tauri--docs--windows-signing.md](research/raw/tauri--docs--windows-signing.md), [research/raw/tauri--docs--macos-signing.md](research/raw/tauri--docs--macos-signing.md), and [research/raw/tauri--docs--sidecars.md](research/raw/tauri--docs--sidecars.md).

## Updater

- [ ] Keep updater private key and password out of frontend-visible variables and logs.
- [ ] Generate updater artifacts and preserve signatures for every supported target.
- [ ] Verify static or dynamic metadata schema, URLs, SemVer, and embedded signature content.
- [ ] Test valid update, invalid signature, no update, offline, proxy, partial download, installer-start failure, and relaunch policy.
- [ ] Verify operating-system signing separately from updater signing.
- [ ] Preserve the updater key securely and document recovery and rotation limits.

Evidence basis: [research/raw/tauri--docs--updater-plugin.md](research/raw/tauri--docs--updater-plugin.md) and [research/raw/tauri--release--updater-2.11.0.md](research/raw/tauri--release--updater-2.11.0.md).

## Mobile and publication

- [ ] Build Android and iOS with the intended release identities and current store requirements.
- [ ] Test native permission denial, prompt, grant, settings changes, background, suspend, resume, and offline behavior.
- [ ] Verify Android page-size compatibility and platform privacy declarations where required.
- [ ] Treat Tauri Action mobile output as build evidence only, not store submission or acceptance evidence.
- [ ] Complete the applicable app-store review workflow with the store specialist.

Evidence basis: [research/raw/tauri--docs--mobile-plugin-development.md](research/raw/tauri--docs--mobile-plugin-development.md) and [research/raw/tauri--release--tauri-action-1.0.0.md](research/raw/tauri--release--tauri-action-1.0.0.md).

## Evidence bundle

- [ ] Completed [release-evidence-manifest.yaml](../templates/release-evidence-manifest.yaml)
- [ ] Test reports and exact commands
- [ ] Artifact names, sizes, and SHA-256 hashes
- [ ] Signature and notarization output
- [ ] Installer and updater smoke-test records
- [ ] Device and operating-system matrix
- [ ] Known limitations and unsupported targets
- [ ] Security, Quality, and repository-health reports
- [ ] User approval before commit or push
