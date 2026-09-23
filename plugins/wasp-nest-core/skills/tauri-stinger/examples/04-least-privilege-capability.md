# Example: Restrict an Application AI Command

Application commands registered only with `invoke_handler` are available to every application window and WebView by default. The following pattern opts selected commands into Tauri's permission model.

## Declare commands in the application manifest

`src-tauri/build.rs`:

```rust
fn main() {
    tauri_build::try_build(
        tauri_build::Attributes::new().app_manifest(
            tauri_build::AppManifest::new()
                .commands(&["generate_completion", "cancel_generation"]),
        ),
    )
    .expect("failed to run Tauri build script");
}
```

## Define named permissions

`src-tauri/permissions/ai-commands.toml`:

```toml
[[permission]]
identifier = "allow-generate-completion"
description = "Allows the main WebView to start a validated generation request."
commands.allow = ["generate_completion"]

[[permission]]
identifier = "allow-cancel-generation"
description = "Allows the main WebView to cancel one owned generation request."
commands.allow = ["cancel_generation"]
```

## Bind to one WebView and platform set

`src-tauri/capabilities/main-ai.json`:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-ai",
  "description": "AI commands for the bundled main WebView only",
  "windows": ["main"],
  "platforms": ["linux", "macOS", "windows"],
  "permissions": [
    "allow-generate-completion",
    "allow-cancel-generation"
  ]
}
```

Keep `remote` absent. If another capability also names `main`, inspect the merged permission union. If a command receives a custom scope, retrieve and enforce the scope inside Rust.

Source basis: [Capabilities](../references/research/raw/tauri--docs--capabilities.md), [Permissions](../references/research/raw/tauri--docs--permissions.md), and [Scopes](../references/research/raw/tauri--docs--command-scopes.md).

