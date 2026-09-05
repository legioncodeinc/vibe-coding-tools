# Tauri Inter-Process Communication
- URL: https://v2.tauri.app/concept/inter-process-communication/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-08-20
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- IPC style: `Asynchronous Message Passing`
- Primitives named by the source: `Events`, `Commands`
- Frontend command API: `invoke`

## Archived evidence

Tauri uses asynchronous message passing between the Core process and WebView. The recipient can reject a request before executing the corresponding function.

Events are one-way, fire-and-forget messages for lifecycle and state changes. Commands are request-response IPC exposed through frontend `invoke`. Command arguments and return data are serializable through a JSON-RPC-like protocol.

## Archive interpretation

Treat every WebView-to-Rust message as an external request boundary even though both processes ship in one product.
