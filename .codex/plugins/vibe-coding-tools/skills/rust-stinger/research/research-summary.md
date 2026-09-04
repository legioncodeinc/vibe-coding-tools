# Research Summary: rust-stinger

- **Depth tier consumed:** deep, completed as a concise authoritative packet rather than an open-ended crawl
- **Time window:** 2026-01-24 through 2026-07-24 (6 months), with stable canonical reference pages used where the governing specification predates the window
- **Source notes:** 56
- **Research/control artifacts:** 4 (`research-plan.md`, `index.md`, `evidence-synthesis.md`, `research-summary.md`)
- **Total Markdown files:** 60
- **Primary-source posture:** 55 official/upstream sources and 1 upstream practitioner-maintained GitHub project note (`cargo-auditable`); no community forum/Reddit source was needed

## Files by subfolder

| Subfolder | Source files |
|---|---:|
| `async/` | 10 |
| `boundaries/` | 3 |
| `cli-tui/` | 5 |
| `observability/` | 2 |
| `persistence/` | 7 |
| `rust-cargo/` | 8 |
| `security/` | 3 |
| `supply-chain/` | 11 |
| `testing/` | 7 |
| **Total** | **56** |

## Coverage against the Command Brief

- Rust/Cargo workspace architecture, feature unification, MSRV, toolchain, platform tiers, Clippy, and unsafe policy: covered.
- Tokio/Axum/Tower task ownership, cancellation safety, bounded backpressure, readiness, graceful shutdown, streaming bodies, and service testing: covered.
- SQLite/SQLx transactions, `BEGIN IMMEDIATE`, busy behavior, WAL, checkpointing, durability, atomic commit/crash recovery, connection options, compile-checked queries, and migrations: covered.
- Typed boundaries/state machines, Serde strictness/tagging, structured errors, non-forgeable verification markers: covered.
- tracing/subscriber ownership, secret wrappers, rustls safe/dangerous configuration and typestate: covered.
- Clap CLI parsing/exit behavior and Ratatui lifecycle/test architecture: covered.
- proptest, Loom, deterministic Tokio time, nextest, Criterion, failure/concurrency/migration/fake-provider and eight-hour-soak evidence model: covered.
- cargo-dist, cargo-cyclonedx, cargo-auditable, cargo-deny, RustSec/cargo-audit, Cargo SBOM precursors/package verification, and Sigstore/Cosign: covered with peer-boundary caveats.

## Five most influential sources

1. [`async/2026-07-24-tokio-select-cancellation.md`](async/2026-07-24-tokio-select-cancellation.md) - establishes that cancellation safety is an operation-level property and identifies the central replay/data-loss review boundary.
2. [`async/2026-07-24-tower-service-readiness.md`](async/2026-07-24-tower-service-readiness.md) - makes backpressure a resource-reservation contract and exposes the readiness-to-call cancellation edge.
3. [`persistence/2026-07-24-sqlite-transactions.md`](persistence/2026-07-24-sqlite-transactions.md) plus [`persistence/2026-07-24-sqlx-custom-transactions.md`](persistence/2026-07-24-sqlx-custom-transactions.md) - together establish the one-writer rule and the SQLx 0.9 mechanism for tracked `BEGIN IMMEDIATE` transactions.
4. [`security/2026-07-24-rustls-verification-markers.md`](security/2026-07-24-rustls-verification-markers.md) - supplies upstream precedent for private proof tokens preventing skipped safety checks.
5. [`testing/2026-07-24-proptest-state-machines.md`](testing/2026-07-24-proptest-state-machines.md) - supplies the reference-model, invariant, shrinking, and regression-seed pattern for quota/breaker/promotion state.

## Open questions that survived research

- Final platform/installer matrix and minimum OS baselines.
- Declared MSRV after the real dependency graph and features exist.
- Required SQLite power-loss durability and busy/contended-write UX.
- Final durable state/event schema for replay prohibition and promotion.
- TUI inclusion in the first milestone.
- Signing/attestation identity and publication authorization.
- Numeric eight-hour-soak thresholds.

## Sources Forge should re-fetch at build time

- Rust release index and platform support (toolchain/target drift).
- Tokio current/LTS policy (1.53.1 and 1.51.x were current at retrieval).
- SQLx `Connection::begin_with` and migration/query docs against the selected SQLx version.
- rustls stable docs to avoid using 0.24 development APIs.
- cargo-dist configuration/changelog and GitHub attestation eligibility.
- RustSec advisory database immediately before any release recommendation.

## Blocked or incomplete research

- No subject area is blocked.
- Raw web-crawl JSON and ranked discovery records were not produced. Context7 plus direct official/upstream retrieval was used; the limitation is recorded in the plan and synthesis.
- No source establishes a universal off-the-shelf eight-hour Rust soak harness. The synthesis therefore records a composable evidence model and leaves numeric thresholds to the product/release owners.
