# Research Plan: rust-stinger

- **Depth tier:** deep
- **Time window:** 2026-07-24 back to 2026-01-24 (6 months)
- **Page budget target:** 1,000 page-equivalents across official documentation sets, upstream repositories, release notes, and standards/tooling references
- **Source breadth target:** official language/toolchain documentation, upstream crate documentation, upstream GitHub repositories, SQLite specifications, security advisories, release/changelog material, standards/provenance specifications
- **Discovery caveat:** The initial queries below are reconstructed from the Command Brief's primary research targets and research questions. Research used Context7 documentation retrieval and direct official/upstream pages; this limitation is preserved in the final summary.

## Initial queries (derived from the Command Brief)

- "Rust Cargo workspace architecture MSRV feature unification platform support 2026"
- "Tokio Axum Tower cancellation backpressure graceful shutdown streaming testing 2026"
- "SQLite SQLx transactions locking WAL durability migrations concurrent reservations 2026"
- "Rust typed state machines replay prohibition safe promotion error boundaries 2026"
- "Rust tracing secrets rustls redaction TLS operational diagnostics 2026"
- "Clap Ratatui scriptable CLI terminal lifecycle testing accessibility 2026"
- "Rust proptest Loom nextest Criterion deterministic time soak testing 2026"
- "Rust packaging reproducible builds cargo-dist SBOM signing RustSec cargo-deny cargo-auditable 2026"

## Expansion queries

### Branch from "Rust Cargo workspace architecture MSRV feature unification platform support 2026"

- "Cargo resolver version 3 workspace dependency inheritance feature unification official"
- "Rust MSRV policy rust-version Cargo official platform support tier policy"
- "Cargo workspace compile time crate boundaries feature flags official guidance"
- "Rust API Guidelines unsafe code guidelines Clippy rustfmt official"

### Branch from "Tokio Axum Tower cancellation backpressure graceful shutdown streaming testing 2026"

- "Tokio task cancellation safety JoinSet CancellationToken graceful shutdown official"
- "Tokio bounded mpsc backpressure reserve Permit shutdown channel official"
- "Axum with_graceful_shutdown streaming Body cancellation official"
- "Tower Service readiness load shed concurrency limit timeout buffer backpressure official"
- "Tokio time pause advance deterministic tests tracing official"

### Branch from "SQLite SQLx transactions locking WAL durability migrations concurrent reservations 2026"

- "SQLite BEGIN IMMEDIATE transaction locking WAL busy timeout synchronous official"
- "SQLite atomic commit crash recovery WAL checkpoint durability official"
- "SQLx SQLite transaction acquire begin immediate migrations official"
- "SQLite concurrent reservation budget oversubscription conditional update RETURNING official"
- "SQLx offline mode compile checked queries migrations locking upstream"

### Branch from "Rust typed state machines replay prohibition safe promotion error boundaries 2026"

- "Rust enum typestate state machine exhaustive matching official"
- "Rust ownership newtype sealed traits visibility architecture boundaries official"
- "Serde tagged enums deny unknown fields boundary validation official"
- "thiserror source transparent structured error official"

### Branch from "Rust tracing secrets rustls redaction TLS operational diagnostics 2026"

- "tracing instrument skip fields redaction EnvFilter JSON official"
- "secrecy SecretString expose_secret Debug redaction official"
- "rustls dangerous configuration certificate verification official"
- "Rust TLS certificate roots platform verifier rustls official"

### Branch from "Clap Ratatui scriptable CLI terminal lifecycle testing accessibility 2026"

- "Clap derive value enum exit codes JSON output shell completion official"
- "Clap error handling try_parse_from CommandFactory official"
- "Ratatui terminal init restore panic hook test backend official"
- "Ratatui snapshot testing event loop cancellation official"

### Branch from "Rust proptest Loom nextest Criterion deterministic time soak testing 2026"

- "proptest state machine strategy shrinking persistence official"
- "Loom model concurrency atomics Arc Mutex limitations official"
- "cargo-nextest retries slow timeout archive junit official"
- "Criterion benchmark statistical confidence regression official"
- "Tokio test start_paused timeout cancellation fake server soak evidence official"

### Branch from "Rust packaging reproducible builds cargo-dist SBOM signing RustSec cargo-deny cargo-auditable 2026"

- "cargo-dist installers checksums GitHub releases provenance official"
- "cargo-cyclonedx SBOM Rust official upstream"
- "cargo-auditable binary dependency metadata official upstream"
- "cargo-deny advisories licenses bans sources official"
- "RustSec advisory database cargo-audit withdrawn unmaintained official"
- "Sigstore cosign sign blob attest SBOM keyless official"

## Research order and rationale

1. Establish language, Cargo, MSRV, and platform constraints because every later recommendation depends on the supported compiler and target contract.
2. Resolve runtime/service ownership and failure behavior across Tokio, Axum, and Tower.
3. Resolve SQLite/SQLx transaction, locking, and crash-durability semantics.
4. Collect type-boundary, serialization, error, observability, secret, and TLS sources.
5. Collect operator-surface sources for Clap and Ratatui.
6. Collect deterministic, property, model-concurrency, benchmark, and soak-test evidence.
7. Close with packaging, provenance, SBOM, signature, advisory, and release evidence while preserving dependency/release/security peer ownership.
