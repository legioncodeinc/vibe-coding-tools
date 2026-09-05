# Build, Sign, Update, and Distribute

## Purpose

Produce installable, signed, updateable Tauri artifacts with evidence from the final packages.

## Procedure

1. Record the source revision, toolchain, package manager, resolved Tauri graph, target operating system, architecture, and bundle type.
2. Review the base configuration plus target overlay. Arrays replace rather than extend under platform merge. [../references/research/raw/tauri--docs--configuration-files.md](../references/research/raw/tauri--docs--configuration-files.md)
3. Build on a runner with the target's native prerequisites. Cross-compilation does not remove signing and runtime validation obligations.
4. For every sidecar, verify target triple, architecture, executable permission, runtime dependencies, hash, and platform signature where applicable. [../references/research/raw/tauri--docs--sidecars.md](../references/research/raw/tauri--docs--sidecars.md)
5. On Windows, configure the selected certificate path or custom signing command and inspect signatures on the final executable, installer, and embedded DLLs. [../references/research/raw/tauri--docs--windows-signing.md](../references/research/raw/tauri--docs--windows-signing.md)
6. On macOS, verify application signing, notarization, stapling, and the final distribution artifact. [../references/research/raw/tauri--docs--macos-signing.md](../references/research/raw/tauri--docs--macos-signing.md)
7. Configure updater artifacts and the public verification key. Keep the updater private key and password in the protected release environment.
8. Treat updater signatures as a separate trust layer from operating-system code signing. Updater verification cannot be disabled. [../references/research/raw/tauri--docs--updater-plugin.md](../references/research/raw/tauri--docs--updater-plugin.md)
9. Verify static or dynamic metadata, actual signature content, target keys, URLs, valid update, invalid signature rejection, no update, offline, proxy, partial download, installation failure, relaunch policy, and rollback policy.
10. When using Tauri Action 1.x, review its breaking input and artifact-name changes. Mobile support builds artifacts but does not install store dependencies or upload to stores. [../references/research/raw/tauri--release--tauri-action-1.0.0.md](../references/research/raw/tauri--release--tauri-action-1.0.0.md)
11. Fill [../templates/release-evidence-manifest.yaml](../templates/release-evidence-manifest.yaml) with artifact paths, SHA-256 hashes, tests, signature evidence, device results, and gate reports.
12. Complete [../references/RELEASE-CHECKLIST.md](../references/RELEASE-CHECKLIST.md), then run Security, independent Quality, and orchestrator-level repository health in that order.

Use [../examples/06-signed-updater-flow.md](../examples/06-signed-updater-flow.md) for the configuration shape.

## Dated release hazards at the cutoff

- Bundler before 2.9.3 can produce the documented signed-NSIS defect. [../references/research/raw/tauri--release--bundler-2.9.3.md](../references/research/raw/tauri--release--bundler-2.9.3.md)
- An empty-password updater key created by CLI 2.9.3 through 2.10.0 must be regenerated. [../references/research/raw/tauri--release--cli-changelog.md](../references/research/raw/tauri--release--cli-changelog.md)
- Updater 2.11.0 changes Windows installer failure reporting, relaunch control, and system-proxy behavior. [../references/research/raw/tauri--release--updater-2.11.0.md](../references/research/raw/tauri--release--updater-2.11.0.md)

Refresh every version before using these as present-tense requirements.

