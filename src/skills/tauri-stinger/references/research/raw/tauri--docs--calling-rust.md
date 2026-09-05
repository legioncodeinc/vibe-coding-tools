# Calling Rust from the Frontend
- URL: https://v2.tauri.app/develop/calling-rust/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-06-08
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```rust
#[tauri::command]
fn my_custom_command() {}
```

```ts
import { invoke } from '@tauri-apps/api/core';
```

## Archived evidence

Rust commands use `#[tauri::command]`, have unique names, and are registered together through `invoke_handler(tauri::generate_handler![...])`. A command declared directly in `lib.rs` must not be public because of generated symbol collisions, while a command in a separate module should be public.

Frontend calls import `invoke` from `@tauri-apps/api/core`. Arguments are a JSON object whose keys default to camelCase. Inputs implement `serde::Deserialize`; outputs and errors implement `serde::Serialize`. A `Result` maps to Promise resolution or rejection.

Async commands are preferred for heavy work. They use Tauri's async runtime, while synchronous commands otherwise run on the main thread. Owned inputs avoid borrowed-argument limitations in async commands.

Channels are the recommended way to stream data such as an HTTP response. Rust accepts `tauri::ipc::Channel<T>` and sends values; the frontend creates `Channel<T>`, assigns `onmessage`, and passes it to `invoke`.
