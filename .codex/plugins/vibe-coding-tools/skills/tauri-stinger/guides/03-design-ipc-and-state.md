# Design IPC and Managed State

## Purpose

Give every WebView-to-Rust operation a typed contract, correct transport, bounded lifecycle, and testable state owner.

## Procedure

1. Start from the trust boundary: all WebView input is untrusted even when bundled with the application.
2. Use a command when the frontend requests work and needs a result or error. Commands deserialize inputs and serialize outputs. [../references/research/raw/tauri--docs--calling-rust.md](../references/research/raw/tauri--docs--calling-rust.md)
3. Use a Channel argument when one authorized command produces ordered, high-throughput output. Channels are Tauri's documented stream choice. [../references/research/raw/tauri--docs--calling-frontend.md](../references/research/raw/tauri--docs--calling-frontend.md)
4. Use an event for lifecycle or small fan-out notifications. Do not use events for token streams, large messages, response semantics, or business authorization.
5. Define owned request types with `serde::Deserialize`, explicit enums, size limits, normalized identifiers, and no open-ended command or path strings.
6. Define response and error types with `serde::Serialize`. Expose stable error codes and safe messages, not raw provider, SQL, filesystem, or sidecar errors.
7. For a stream, define a tagged enum and exactly one terminal state. Include a request identifier in every variant.
8. Define timeout, cancellation, Channel closure, renderer reload, application exit, and partial-output behavior before calling the provider or sidecar.
9. Register commands together in one `invoke_handler` and keep command names unique. [../references/research/raw/tauri--docs--calling-rust.md](../references/research/raw/tauri--docs--calling-rust.md)
10. Put active clients, pools, child handles, and cancellation registries in managed state. Use the exact registered wrapper type and a mutex suited to whether guards cross await points. [../references/research/raw/tauri--docs--state-management.md](../references/research/raw/tauri--docs--state-management.md)
11. Unregister frontend event listeners on component cleanup. A Promise for an unlisten function must be awaited before it can be called. [../references/research/raw/tauri--docs--calling-frontend.md](../references/research/raw/tauri--docs--calling-frontend.md)
12. Never pass model output or other untrusted text into direct JavaScript evaluation.

Use [../references/IPC-SECURITY-REFERENCE.md](../references/IPC-SECURITY-REFERENCE.md) for the full contract and [../examples/01-typed-ai-channel.md](../examples/01-typed-ai-channel.md) for a derived AI stream.

## Review questions

- Can the request be retried safely?
- Who owns cancellation and cleanup?
- What happens when the receiver disappears?
- Are messages bounded before serialization and after provider or child output?
- Can two commands mutate the same state concurrently?
- Does every error preserve a safe machine-readable category?
- Is a privileged action a command rather than an event?

