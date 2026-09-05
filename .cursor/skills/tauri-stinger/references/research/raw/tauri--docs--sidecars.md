# Embedding External Binaries
- URL: https://v2.tauri.app/develop/sidecar/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-06-15
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```json
{ "bundle": { "externalBin": ["binaries/my-sidecar"] } }
```

```rust
let sidecar_command = app.shell().sidecar("my-sidecar").unwrap();
let (mut rx, mut child) = sidecar_command.spawn().expect("Failed to spawn sidecar");
```

## Archived evidence

Tauri calls bundled external executables sidecars. They are declared in `bundle.externalBin`; relative paths resolve from the Tauri configuration directory. Each supported architecture requires a binary with its Rust target triple suffix. A host triple rename script is only a starting point and is wrong for cross-target builds.

Rust uses `tauri_plugin_shell::ShellExt`, receives command events including stdout, and can write to child stdin. Rust `sidecar()` expects the filename rather than the configured full path.

Frontend execution uses `Command.sidecar` and requires a matching `shell:allow-execute` or `shell:allow-spawn` permission. The capability can restrict sidecar identity and require exact or regex-validated arguments. Allowing all arguments with `true` widens the boundary.

## Archive interpretation

The page supplies subprocess primitives, not an AI model protocol. A local inference topology built from these primitives is a derived design.
