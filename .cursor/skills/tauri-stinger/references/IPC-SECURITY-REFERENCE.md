# Tauri IPC and Security Reference

## Boundary model

```text
WebView input
  -> Runtime Authority origin and capability check
  -> command permission and applicable scope
  -> Rust command validation and business authorization
  -> provider, filesystem, database, sidecar, or OS operation
  -> typed result or ordered Channel stream
```

Runtime Authority performs the framework-level dispatch check. Application code still owns data validation, tenant or user authorization, safe path handling, rate limits, and secret policy. [research/raw/tauri--docs--runtime-authority.md](research/raw/tauri--docs--runtime-authority.md) [research/raw/tauri--docs--command-scopes.md](research/raw/tauri--docs--command-scopes.md)

## Command contract

For each privileged command, document and implement:

1. A specific verb and resource, such as `generate_completion`, not `run_action`.
2. Owned, serializable input types with length and enum limits.
3. Authentication and business authorization when the app has identities or tenants.
4. Capability permission through `AppManifest::commands` when custom command restriction is required.
5. Scope retrieval and enforcement when policy varies by resource.
6. A structured serializable error enum with stable machine codes and non-secret messages.
7. Cancellation and timeout behavior for long-running work.
8. Bounded output and logs with secrets and prompt content redacted by policy.

Tauri command and capability facts: [research/raw/tauri--docs--calling-rust.md](research/raw/tauri--docs--calling-rust.md) [research/raw/tauri--docs--capabilities.md](research/raw/tauri--docs--capabilities.md)

## Commands, events, and Channels

| Property | Command | Event | Channel |
|---|---|---|---|
| Direction | Request and response | Fire and forget | Stream associated with a command |
| Ordering | One response per invocation | Async handlers can finish out of order | Ordered delivery |
| Throughput | Normal request payloads | Small notifications | High-throughput stream |
| Type contract | Serde input and output | Weaker, JSON payload | Serde item type and frontend generic |
| Capability role | Command access can be permissioned | Event API permission, not business authorization | Authorize the command that creates the Channel |
| AI fit | Start, cancel, save, list | Model-ready or lifecycle notification | Tokens, tool progress, usage, terminal result |

Source: [research/raw/tauri--docs--calling-rust.md](research/raw/tauri--docs--calling-rust.md) [research/raw/tauri--docs--calling-frontend.md](research/raw/tauri--docs--calling-frontend.md)

## Capability review

- Inventory every capability file and the windows, WebViews, platforms, local setting, remote URL patterns, and permissions it contributes.
- Compute privilege as a union for every window or WebView referenced by more than one capability.
- Replace wildcard windows with labels where the application has different trust levels.
- Keep `remote.urls` absent unless remote content is a requirement, then use the narrowest origin and path patterns.
- Keep window creation with a high-trust window.
- Declare custom commands in `AppManifest::commands` when they must be permissioned.
- Confirm every custom scope is checked in Rust and that deny wins.
- Treat Linux and Android iframe origin ambiguity as part of the threat model.
- Use generated desktop, mobile, and remote schemas while editing capability files.

Source: [research/raw/tauri--docs--capabilities.md](research/raw/tauri--docs--capabilities.md) [research/raw/tauri--docs--command-scopes.md](research/raw/tauri--docs--command-scopes.md)

## Secret boundary

- Never put updater private keys, signing passwords, provider credentials, refresh tokens, or database administrator credentials in frontend code or frontend-readable configuration.
- Never return a provider key to the WebView after Rust loads it.
- Treat frontend local storage, Store, and ordinary SQLite as non-secret unless a separate encryption design proves otherwise.
- Use Stronghold or a platform credential integration for user-owned secrets.
- Keep publisher-owned provider keys behind a publisher-controlled service because a distributed desktop binary runs on a user-controlled machine.
- Scan final frontend assets and packaged resources for secret identifiers and test canaries as a derived release safeguard.

Source and derived policy: [research/raw/tauri--docs--process-model.md](research/raw/tauri--docs--process-model.md) [research/raw/tauri--docs--stronghold-plugin.md](research/raw/tauri--docs--stronghold-plugin.md) [research/raw/tauri--docs--content-security-policy.md](research/raw/tauri--docs--content-security-policy.md) [research/raw/vite--docs--environment-variables.md](research/raw/vite--docs--environment-variables.md)

## Sidecar boundary

Prefer a Rust-owned lifecycle with no WebView shell permissions. If JavaScript must spawn a sidecar, permit only the named sidecar, the required method, and exact or validated arguments. Never use `args: true` for model-controlled or user-controlled input. [research/raw/tauri--docs--sidecars.md](research/raw/tauri--docs--sidecars.md) [research/raw/tauri--docs--shell-plugin.md](research/raw/tauri--docs--shell-plugin.md)

Sidecar stdout, stderr, and protocol messages are untrusted process input. Deserialize into bounded tagged messages, reject unknown protocol versions, cap retained diagnostics, surface read errors, and never execute returned text. Tauri Shell's default line reader buffers a complete line before emitting an event, so a post-event size guard limits retention and IPC only, not allocation. Require producer-side line limits or implement bounded framing over raw output. This is a derived hardening pattern. [research/raw/tauri--docs--sidecars.md](research/raw/tauri--docs--sidecars.md) [research/raw/tauri--source--shell-command-child-2.3.6.md](research/raw/tauri--source--shell-command-child-2.3.6.md)

## CSP and untrusted output

Configure a restrictive CSP. A Rust-owned hosted-provider call normally keeps the provider origin out of WebView `connect-src`. Never feed model output to `WebviewWindow::eval`; render it as data through the frontend framework. [research/raw/tauri--docs--content-security-policy.md](research/raw/tauri--docs--content-security-policy.md) [research/raw/tauri--docs--calling-frontend.md](research/raw/tauri--docs--calling-frontend.md)
