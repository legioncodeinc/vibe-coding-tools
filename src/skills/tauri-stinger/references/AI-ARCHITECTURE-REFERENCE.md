# Derived AI Architecture Reference for Tauri 2

Every pattern in this file is derived from official Tauri primitives. Tauri did not publish a first-party AI reference application in the source sweep. [research/raw/tauri--research--first-party-ai-gap.md](research/raw/tauri--research--first-party-ai-gap.md)

## Choose a topology

| Topology | Choose when | Privileged owner | Stream | Main risks |
|---|---|---|---|---|
| Publisher service | The publisher owns provider credentials or enforces shared policy | Remote service | Service stream into Rust, then Channel | auth, tenancy, service availability, cost abuse |
| Hosted provider from Rust | The user supplies a key or local client can safely authenticate without a publisher secret | Rust Core process | Channel | local credential lifecycle, provider network errors, binary inspection |
| Desktop local sidecar | Offline/private inference or a non-Rust runtime is required | Rust Core process and named child | framed stdin/stdout into Channel | binary size, target triples, crash/restart, untrusted child output |
| Native Rust library | The model runtime has a suitable Rust API and packaging footprint | Rust Core process | Channel | memory, CPU/GPU, native dependencies, cancellation |
| Tauri plugin | The provider or inference bridge is reused or needs native mobile code | Plugin Rust plus Kotlin/Swift | command plus Channel or plugin event | permission design, multi-language versioning, platform divergence |

Official bases: [research/raw/tauri--docs--process-model.md](research/raw/tauri--docs--process-model.md) [research/raw/tauri--docs--sidecars.md](research/raw/tauri--docs--sidecars.md) [research/raw/tauri--docs--plugin-development.md](research/raw/tauri--docs--plugin-development.md)

## Hosted-provider flow

```text
WebView GenerateRequest
  -> generate_completion command
  -> validate model, prompt size, attachments, budget, and user context
  -> obtain user credential in Rust or call publisher service
  -> start provider request
  -> Channel<GenerationEvent>
  -> render event data, never execute it
```

Do not put publisher-owned provider keys in the Tauri bundle. A Rust boundary reduces WebView exposure, but it cannot make a credential secret from the owner of the installed binary. This is a derived security conclusion based on the documented process and trust boundaries. [research/raw/tauri--docs--process-model.md](research/raw/tauri--docs--process-model.md) [research/raw/tauri--docs--security-overview.md](research/raw/tauri--docs--security-overview.md)

## Local-sidecar flow

```text
Tauri startup or first generation
  -> resolve the packaged target-specific sidecar
  -> spawn from Rust with fixed arguments
  -> wait for a bounded ready message
  -> store child and protocol state in managed Rust state
  -> send length-bounded NDJSON requests over stdin
  -> require producer-side line limits or parse bounded raw stdout framing
  -> forward typed events through Channel
  -> cancel, drain, terminate, and reap on request or app shutdown
```

This protocol, readiness, backpressure, and recovery behavior is derived application design. Tauri supplies target-specific bundling, child events, stdin access, managed state, and Channels, but not an AI subprocess protocol. [research/raw/tauri--docs--sidecars.md](research/raw/tauri--docs--sidecars.md) [research/raw/tauri--docs--state-management.md](research/raw/tauri--docs--state-management.md) [research/raw/tauri--docs--calling-frontend.md](research/raw/tauri--docs--calling-frontend.md)

## Recommended stream contract

```rust
#[derive(Clone, serde::Serialize)]
#[serde(
    tag = "event",
    content = "data",
    rename_all = "camelCase",
    rename_all_fields = "camelCase"
)]
enum GenerationEvent {
    Started { request_id: String, model: String },
    Token { request_id: String, text: String },
    ToolProgress { request_id: String, tool: String, phase: String },
    Usage { request_id: String, input_tokens: u64, output_tokens: u64 },
    Completed { request_id: String, finish_reason: String },
    Cancelled { request_id: String },
    Failed { request_id: String, code: String, message: String },
}
```

The contract is derived. Keep terminal states mutually exclusive, never put credentials or raw provider responses in events, and bound token, error, and tool fields before sending them to the WebView. The tagged-enum transport pattern comes from Tauri's Channel example, while Serde documents the separate field-renaming attribute. [research/raw/tauri--docs--calling-frontend.md](research/raw/tauri--docs--calling-frontend.md) [research/raw/serde--docs--container-attributes.md](research/raw/serde--docs--container-attributes.md)

## Persistence classes

| Data | Default home | Reason |
|---|---|---|
| UI preferences, selected model, window choices | Store | Small non-secret key-value state |
| Conversations, messages, jobs, usage summaries | SQLite through SQL or a Rust-owned database layer | Structured data and migrations |
| User-supplied provider key | Stronghold or platform credential store | Secret-specific storage |
| Active provider client, child process, cancellation handle | Managed Rust state | Ephemeral process resource |
| Publisher provider key | Publisher-controlled service | Must not ship in the client |

This is a derived data-classification pattern grounded in [research/raw/tauri--docs--store-plugin.md](research/raw/tauri--docs--store-plugin.md), [research/raw/tauri--docs--sql-plugin.md](research/raw/tauri--docs--sql-plugin.md), [research/raw/tauri--docs--stronghold-plugin.md](research/raw/tauri--docs--stronghold-plugin.md), and [research/raw/tauri--docs--state-management.md](research/raw/tauri--docs--state-management.md).

## Failure modes to design first

- Provider timeout, rate limit, malformed stream, and partial response
- User cancellation before start, during network work, and during sidecar output
- Sidecar not executable, wrong target triple, protocol mismatch, startup timeout, crash, and stuck shutdown
- Database migration failure and rollback
- Credential store locked, missing, rotated, or revoked
- Application exit while a stream, database transaction, or updater is active
- Renderer reload with active Rust work and stale listeners
- Mobile app suspend and resume with an active provider request

These controls are derived application requirements. Verify them through the layered test and release strategy in [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md).
