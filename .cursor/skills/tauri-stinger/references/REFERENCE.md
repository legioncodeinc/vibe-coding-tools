# Tauri 2 Engineering Reference

Load this file when a task needs the full operating model instead of one focused guide. All version claims are dated in [CURRENT-TAURI-2.md](CURRENT-TAURI-2.md), and all domain claims trace through [research/distilled-tauri-2.md](research/distilled-tauri-2.md).

## Inspect before deciding

Read these inputs before changing a Tauri project:

| Concern | Primary files | What to establish |
|---|---|---|
| Frontend dependencies | `package.json` and the active package-manager lockfile | `@tauri-apps/api`, CLI, plugin bindings, scripts, framework, build output |
| Rust dependencies | `src-tauri/Cargo.toml` and `Cargo.lock` | `tauri`, `tauri-build`, plugins, features, target-specific dependencies, resolved graph |
| Application config | `tauri.conf.json`, `tauri.conf.json5`, or `Tauri.toml`, plus platform overlays | identifier, version source, frontend commands, windows, CSP, bundle targets, resources, sidecars, updater |
| Runtime | `src-tauri/src/lib.rs`, `main.rs`, command modules, state types | command registration, async work, state ownership, plugin setup, shutdown behavior |
| Authority | `src-tauri/capabilities/`, `permissions/`, `gen/schemas/`, `build.rs` | effective window permissions, remote origins, custom command manifest, scope enforcement |
| Persistence | Store, SQL, Stronghold setup and migrations | data class, migration ownership, credentials, capabilities, backup and recovery |
| Delivery | workflow files, signing config, updater metadata | target matrix, secret injection, artifact names, signatures, notarization, install and update proof |

Resolve `scripts/inspect-tauri-project.py` relative to this Stinger's loaded `SKILL.md`, then run `python <resolved-script-path> <project-root> --pretty` for a deterministic first pass. The report is evidence, not a substitute for reading files that the parser marks unsupported.

## Version alignment rules

| Pair | Required relationship | Why |
|---|---|---|
| Cargo `tauri` and npm `@tauri-apps/api` | Same major and minor | The JavaScript API depends on matching Rust-side behavior. |
| `tauri-plugin-<name>` and `@tauri-apps/plugin-<name>` | Exact same resolved version | Plugin changes can be coordinated in patch releases. |
| Core, CLI, build, runtime, and bundler crates | Follow their own compatible release lines | Their patch and sometimes minor numbers are intentionally independent. |
| Wry and Tao | Use what the target Tauri release resolves | A newer standalone tag does not imply Tauri exposes it. |

Source: [research/distilled-tauri-2.md](research/distilled-tauri-2.md), sections "Dated package snapshot" and "Project inspection and version alignment."

## IPC selection

| Need | Primitive | Contract |
|---|---|---|
| Frontend asks Rust to do privileged work | Command | Validate input in Rust, return typed data or a structured error |
| One request returns an ordered stream | Channel argument on a command | Use a tagged event enum and explicit terminal states |
| Lifecycle or small fan-out notification | Event | Target the narrowest WebView and clean up listeners |
| Large binary response | `tauri::ipc::Response` | Avoid JSON serialization for raw bytes |
| Direct JavaScript evaluation | Rare escape hatch | Never insert model output or untrusted strings |

See [IPC-SECURITY-REFERENCE.md](IPC-SECURITY-REFERENCE.md) for the complete trust-boundary checklist.

## Platform boundaries

| Capability | Desktop | Mobile | Notes |
|---|---|---|---|
| Commands, Channels, managed state | Yes | Yes | Share the `lib.rs` entry point and branch only where platform behavior differs |
| Shell sidecar | Windows, Linux, macOS | No | Mobile needs a hosted service or native plugin/library |
| Built-in updater plugin | Windows, Linux, macOS | No | Mobile updates go through platform distribution systems |
| Native plugin bridge | Rust plus desktop implementation | Kotlin/Java and Swift | Keep the shared JavaScript API and permission contract explicit |
| WebDriverIO Tauri service | Windows, Linux, macOS | Separate mobile tooling | Browser mode is not a native-binary test |

Source: [research/distilled-tauri-2.md](research/distilled-tauri-2.md), sections "Derived AI application topologies" and "Verification and delivery."

## Escalation boundaries

- General Rust architecture, ownership, async runtimes, Cargo policy, or unsafe code belongs to `rust-stinger`.
- Frontend framework components and reactivity belong to that framework's Stinger.
- A formal review of IPC authorization, filesystem exposure, shell execution, remote origins, credentials, or updater trust belongs to `security-stinger`.
- Workflow architecture, build matrices, provenance, and release automation belong to `ci-release-stinger` or `devops-stinger`.
- Dependency vulnerability triage, lockfile policy, and SBOMs belong to `dependency-audit-stinger`.

## Non-negotiable red flags

- Remote content on Tauri core earlier than 2.11.1 at the research cutoff.
- Filesystem plugin earlier than 2.5.2 when relying on affected predefined scopes.
- Signed NSIS production output built through bundler earlier than 2.9.3.
- Updater key generated without a password by CLI 2.9.3 through 2.10.0.
- Updater or provider secrets present in frontend code, frontend-readable configuration, or built frontend assets.
- Arbitrary shell command or arbitrary sidecar arguments reachable from the WebView.
- Custom scope data defined but not enforced in the command.
- One window receiving multiple capabilities without reviewing the merged privilege set.
- Model output passed into direct JavaScript evaluation.
- Claims of release readiness based only on mock or browser-mode tests.

These red flags are grounded in [research/distilled-tauri-2.md](research/distilled-tauri-2.md) and are still subject to a current-source refresh before implementation.
