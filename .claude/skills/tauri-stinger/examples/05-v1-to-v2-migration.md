# Example: Reviewable Tauri 1 to Tauri 2 Migration

Run the current compatible Tauri 2 CLI migration command on a feature branch, then review the resulting slices instead of accepting one large generated diff.

## Slice 1: shared entry point

`src-tauri/src/lib.rs`:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
```

`src-tauri/src/main.rs`:

```rust
fn main() {
    app_lib::run();
}
```

Confirm `[lib]` in Cargo matches the called library name and includes the crate types required by the migration guide.

## Slice 2: configuration keys

Review each generated move rather than replacing the full file blindly:

| Tauri 1 | Tauri 2 |
|---|---|
| `package.productName` | top-level `productName` |
| `package.version` | top-level `version` |
| `tauri` | `app` |
| `tauri.bundle` | top-level `bundle` |
| `build.distDir` | `build.frontendDist` |
| `build.devPath` | `build.devUrl` |
| `build.withGlobalTauri` | `app.withGlobalTauri` |
| `tauri.updater` | `plugins.updater` plus updater artifacts |

## Slice 3: pluginified APIs

Change frontend imports, Rust initialization, dependencies, and capabilities together. For example:

```ts
import { invoke } from '@tauri-apps/api/core';
```

Filesystem, HTTP, shell, updater, dialog, notification, clipboard, CLI, OS, process, and global-shortcut APIs moved into plugins. Do not add each plugin's broad default permission without checking the real UI need.

## Slice 4: allowlist to capabilities

The migration command translates the v1 allowlist to a generated capability. Review:

- window and WebView labels
- desktop versus mobile platforms
- remote origins
- default permission sets
- filesystem, HTTP, and shell scopes
- custom commands that need `AppManifest::commands`

## Slice 5: events and updater compatibility

Review `emit`, `emit_to`, `listen_any`, and WebView listener target changes. If v1 installations already exist, build updater artifacts in `v1Compatible` mode until the installed base has crossed the migration boundary.

## Verification

Run after every slice:

1. Frontend typecheck and unit tests.
2. Cargo format, lint, and test commands used by the repository.
3. Capability schema validation.
4. A native application launch and IPC smoke test.
5. Existing v1-to-v2 update-path test when users already have v1.

Source basis: [Official migration guide](../references/research/raw/tauri--docs--v1-to-v2-migration.md).

