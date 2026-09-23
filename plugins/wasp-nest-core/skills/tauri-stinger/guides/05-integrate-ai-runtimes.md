# Integrate AI Runtimes

## Purpose

Choose and implement a hosted, local, or native AI topology while keeping the WebView boundary narrow and the design honest.

## Procedure

1. State that the design is derived. The official research contains no first-party Tauri AI reference application. [../references/research/raw/tauri--research--first-party-ai-gap.md](../references/research/raw/tauri--research--first-party-ai-gap.md)
2. Fill [../templates/ai-architecture-decision.md](../templates/ai-architecture-decision.md) with supported platforms, data classification, offline needs, credential ownership, model size, and update strategy.
3. Choose one primary topology:
   - Publisher service when the publisher owns the provider credential or needs centralized usage and tenant policy.
   - Hosted provider from Rust when the user supplies a credential and local direct access is acceptable.
   - Desktop sidecar when offline inference or a non-Rust runtime is required.
   - Native Rust library when packaging and platform support are suitable.
   - Tauri plugin when reuse or Kotlin and Swift platform bridges justify a plugin contract.
4. Define narrow commands and one stream schema before adding a provider SDK or model runtime.
5. Put provider clients, child handles, runtime readiness, and cancellation handles in managed Rust state. [../references/research/raw/tauri--docs--state-management.md](../references/research/raw/tauri--docs--state-management.md)
6. Stream ordered output with a Channel tied to an authorized command. Use events only for small lifecycle notifications. [../references/research/raw/tauri--docs--calling-frontend.md](../references/research/raw/tauri--docs--calling-frontend.md)
7. Validate provider name, model identifier, prompt and attachment sizes, file paths, generation budget, and user context in Rust.
8. Define terminal states, timeout, retry, cancellation, renderer reload, app exit, and partial-output persistence before implementation.
9. Keep model output as data. Never pass it into JavaScript evaluation, a shell, SQL text, file paths, or updater fields.
10. Test provider and local-runtime failures with deterministic fakes before adding live evidence.

Use [../references/AI-ARCHITECTURE-REFERENCE.md](../references/AI-ARCHITECTURE-REFERENCE.md) and [../examples/01-typed-ai-channel.md](../examples/01-typed-ai-channel.md).

## Hosted-provider branch

1. Decide credential ownership.
2. Keep publisher-owned credentials at a publisher-controlled service.
3. For user-owned keys, acquire and unlock them through a local secret store, use them only in Rust, and never return them to the WebView.
4. Keep the provider origin out of WebView CSP when Rust or the publisher service owns provider traffic. [../references/research/raw/tauri--docs--content-security-policy.md](../references/research/raw/tauri--docs--content-security-policy.md)
5. Use [../examples/02-hosted-ai-command-boundary.md](../examples/02-hosted-ai-command-boundary.md).

## Local-sidecar branch

1. Confirm desktop-only scope for child processes. The Shell plugin limits Android and iOS support to opening URLs rather than spawning or executing children. [../references/research/raw/tauri--docs--shell-plugin.md](../references/research/raw/tauri--docs--shell-plugin.md)
2. Produce one verified executable per target triple and include it in `bundle.externalBin`. [../references/research/raw/tauri--docs--sidecars.md](../references/research/raw/tauri--docs--sidecars.md)
3. Prefer Rust-owned spawn, arguments, stdin, stdout, cancellation, restart, and shutdown over frontend shell permissions.
4. Use a versioned framed protocol with bounded requests and accepted messages. The default Tauri Shell line reader allocates a complete line before emitting an event, so require the sidecar to enforce a maximum line size or implement bounded framing over raw output.
5. Handle missing binary, wrong architecture, readiness timeout, protocol mismatch, malformed output, backpressure, crash, and stuck shutdown.
6. Decide whether model files ship, download after install, or are user-selected. Record integrity and disk-space policy.
7. Use [../examples/03-local-ai-sidecar.md](../examples/03-local-ai-sidecar.md).

## Native or mobile branch

1. Keep the shared JavaScript and Rust contract stable while adding platform implementations.
2. Use a plugin only when reuse or native bridging justifies the extra package, permission, and language surfaces.
3. Android commands run through Kotlin or Java plugin code; iOS commands bridge through Swift. [../references/research/raw/tauri--docs--mobile-plugin-development.md](../references/research/raw/tauri--docs--mobile-plugin-development.md)
4. Gate native commands and events with plugin permissions and platform capabilities.
5. Test permission denial, backgrounding, suspend, resume, resource pressure, and physical devices.
