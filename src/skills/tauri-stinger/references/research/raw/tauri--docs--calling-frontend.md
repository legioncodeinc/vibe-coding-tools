# Calling the Frontend from Rust
- URL: https://v2.tauri.app/develop/calling-frontend/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-05-12
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```rust
fn download(app: AppHandle, url: String, on_event: Channel<DownloadEvent>)
```

```ts
const onEvent = new Channel<DownloadEvent>();
```

## Archived evidence

Events are intended for small data streams, lifecycle messages, state changes, and multi-producer or multi-consumer cases. They are not designed for low latency or high throughput, provide weaker type support than commands, and use JSON payloads.

Global events reach all listeners; targeted emission uses `emit_to`. Frontend listeners return an unlisten function that must be called during cleanup. Rapid events with async handlers can complete out of order.

Channels are fast and ordered. Tauri uses them internally for download progress, child output, and WebSocket messages. A tagged serializable Rust enum can map to a TypeScript discriminated union.

The page also documents direct JavaScript evaluation. Its presence is an API fact, not permission to evaluate model output. Any input interpolated into evaluated JavaScript requires safe serialization.
