# Derived Example: Rust-Owned Local AI Sidecar

This desktop-only pattern uses Tauri's documented sidecar transport. The NDJSON protocol, readiness state, size limits, and recovery policy are application designs.

## Bundle declaration

```json
{
  "bundle": {
    "externalBin": ["binaries/ai-runtime"]
  }
}
```

Produce one correctly named executable per target triple, for example `ai-runtime-x86_64-pc-windows-msvc.exe` or `ai-runtime-aarch64-apple-darwin`. Do not rename a host build and assume it is a cross-compiled target.

## Rust-owned process contract

This is a design contract, not a copy-paste command. A local-model sidecar has process, protocol, cancellation, and application-exit behavior that belongs in managed Rust state and must be tested with the actual binary. Do not turn the outline into a detached task that drops its child handle or join handle.

| Boundary | Required behavior |
|---|---|
| Request | Validate a nonempty, bounded, unique request ID and bounded prompt. Serialize the full NDJSON request before spawning. Reject an over-limit request before a child exists. |
| Spawn | Start the target-specific sidecar with `set_raw_out(true)`. Never use Tauri Shell's default line events for an untrusted child because its reader allocates a full line before the application can check a limit. |
| Read | Keep separate bounded byte accumulators for stdout frames and retained stderr diagnostics. Split only on LF, reject a frame that exceeds its limit before appending more input, require strict UTF-8, then decode a typed JSON envelope. |
| Protocol | Require protocol version, exact request correlation, known message type, one readiness frame before generation, and exactly one terminal frame. Treat malformed JSON, duplicate terminal frames, unexpected request IDs, invalid UTF-8, and nonzero exit as terminal failures. |
| Lifecycle | Store `CommandChild`, receiver-task join handle, startup deadline, operation deadline, and cancellation state in managed Rust state keyed by request ID. Every terminal branch consumes the child once, waits a bounded interval, and records a redacted outcome. App exit drains the same state. |
| Frontend | Emit a small typed `Started`, `Token`, `Completed`, `Cancelled`, or `Failed` Channel event. Never forward raw stderr or unparsed sidecar data to the WebView. |

The critical raw-output boundary is deliberately small:

```rust
let (events, child) = app
    .shell()
    .sidecar("ai-runtime")?
    .args(["serve", "--stdio", "--protocol", "1"])
    .set_raw_out(true)
    .spawn()?;
```

The receiver must pass `CommandEvent::Stdout` chunks to a tested bounded frame accumulator, not decode each chunk as a complete message. The accumulator must reject the operation when `buffered_bytes + chunk.len()` exceeds the configured maximum, before extending the buffer. Use a second, smaller accumulator for stderr only to create a redacted diagnostic code. The managed operation owns `child` and the receiver task until a readiness, completion, cancellation, timeout, malformed-frame, Channel-closure, output-error, or application-exit branch consumes them.

## Minimal envelope to test

```json
{"protocol":1,"type":"ready","requestId":"same-request-id"}
{"protocol":1,"type":"token","requestId":"same-request-id","text":"hello"}
{"protocol":1,"type":"completed","requestId":"same-request-id"}
```

The application must reject a missing or changed `requestId`, a protocol other than `1`, a `token` before `ready`, invalid UTF-8, a frame above the configured size, more than one terminal frame, or a nonzero child exit. These are derived application protocol rules, not behavior supplied by Tauri.

## Capability posture

The WebView invokes only the application command. Do not add `shell:allow-spawn` or arbitrary argument permissions to its capability when Rust owns the child lifecycle.

## Production proof

- Verify every target-specific binary hash and runtime dependency.
- Sign the sidecar where the platform requires it.
- Exercise wrong architecture, missing executable permission, malformed output, oversized lines, startup timeout, crash, cancellation, and shutdown.
- Bound stderr retention and strip prompts, tokens, paths, and credentials from diagnostics.

Source basis: [Sidecars](../references/research/raw/tauri--docs--sidecars.md), [Shell plugin](../references/research/raw/tauri--docs--shell-plugin.md), [tagged Serde fields](../references/research/raw/serde--docs--container-attributes.md), [CommandChild and output reader source](../references/research/raw/tauri--source--shell-command-child-2.3.6.md), and [managed state](../references/research/raw/tauri--docs--state-management.md).
