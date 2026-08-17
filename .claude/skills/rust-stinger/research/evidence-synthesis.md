# Rust Stinger Evidence Synthesis

This is an evidence map for Stinger Forge, not a replacement for the product ADR, protocol contract, Security review, dependency/license decision, release authorization, or Quality report. The 56 indexed source notes are authoritative inputs; this file connects them to the Command Brief's research questions and records the remaining decisions honestly.
Snapshot: 2026-07-24. Version-sensitive values are evidence snapshots, not timeless defaults; revalidate at the point of use.

Snapshot: 2026-07-24. Version-sensitive values are evidence snapshots, not timeless defaults; revalidate at the point of use.

## Current anchors at retrieval

| Surface | Current evidence snapshot | Caveat |
|---|---|---|
| Rust | 1.97.1 released 2026-07-16 | Current stable is not automatically the product MSRV. |
| Cargo | Rust 2024 resolver v3; `rust-version`-aware fallback | Virtual workspaces must declare the resolver; CI must prove MSRV. |
| Tokio | 1.53.1 released 2026-07-20; 1.51.x LTS through March 2027 | Tokio's MSRV does not establish the whole graph's MSRV. |
| Axum | 0.8.9 docs snapshot | Pin compatible hyper/http-body/tower versions together. |
| SQLx | 0.9.0 docs snapshot | `begin_with` is version-specific; verify before applying to SQLx 0.8. |
| Clap / Ratatui | 4.6.2 / 0.30.2 | Human rendering and TUI APIs can change across minor versions. |
| rustls | 0.23.42 stable docs; 0.24 development docs also visible | Avoid accidental dependency on development APIs. |
| Testing | Loom 0.7.2; Criterion 0.8.2 | Model and benchmark results have explicit coverage/environment limits. |
| SBOM | cargo-cyclonedx 0.5.9 (2026-03-19) | Cargo native SBOM precursors remain unstable/nightly. |

## 1. Tokio, Axum, and Tower ownership, cancellation, streaming, and shutdown

The sources converge on a verifiable lifecycle made of distinct obligations:

1. A root owner detects shutdown, signals cooperative cancellation, stops admission, and waits for every owned task. Tokio's shutdown guide explicitly separates trigger, notification, and joining.
2. Bounded MPSC channels express a capacity contract. Clean shutdown closes the receiver and drains it. `send` inside `select!` may lose the message; `reserve` obtains capacity first and makes that boundary testable.
3. Every `select!` branch needs method-level cancellation review. "Async" alone does not imply cancellation safety.
4. Tower readiness is a resource reservation. `poll_ready` must precede `call`, and capacity must be released if dispatch or its future is dropped. Concurrency-limit, buffer, timeout, and load-shed layer order changes observable behavior.
5. Axum can serve a fallible stream as a response body. HTTP consumers pull frames; the upstream producer must still be bounded and cancellation-aware. Dropping/disconnecting the body should stop producer work and release permits in focused tests.
6. `with_graceful_shutdown` owns listener/connection admission, not arbitrary background work. Background task ownership remains in Tokio task tracking.
7. Most router/middleware contracts can be tested by invoking the Router as a Tower service without binding a port. A narrower loopback integration test proves bind address, shutdown, and disconnect behavior.

Primary notes: [Tokio shutdown](async/2026-07-24-tokio-graceful-shutdown.md), [MPSC](async/2026-07-24-tokio-mpsc.md), [`select!`](async/2026-07-24-tokio-select-cancellation.md), [reserve](async/2026-07-24-tokio-send-reserve.md), [Tower readiness](async/2026-07-24-tower-service-readiness.md), [Tower layers](async/2026-07-24-tower-service-builder.md), [Axum shutdown](async/2026-07-24-axum-graceful-shutdown.md), [Axum streaming](async/2026-07-24-axum-streaming-body.md), and [service testing](async/2026-07-24-axum-service-testing.md).

## 2. SQLite and SQLx transactions, locking, and durability

SQLite permits a single writer. `BEGIN DEFERRED` can read a stale budget view and then fail during write upgrade; `BEGIN IMMEDIATE` acquires write intent before the read-modify-write sequence. SQLx 0.9's `Connection::begin_with` provides a tracked custom transaction start, enabling `BEGIN IMMEDIATE` while preserving explicit commit/rollback and rollback-on-drop behavior.

Evidence-supported invariants for reservations/reconciliations/breakers/migrations:

- Acquire the write transaction before reading mutable budget/quota state.
- Keep eligibility check, reservation insert/update, aggregate update, and idempotency record in one transaction.
- Use conditional SQL constraints/updates as the final oversubscription guard; application locks are not sufficient across processes.
- Treat `SQLITE_BUSY` as a bounded, observable contention result. A busy timeout is not permission for invisible unbounded retry.
- Configure and verify journal mode, synchronous level, foreign keys, busy timeout, and checkpoint policy through one connection-options path.
- WAL improves reader/writer concurrency but does not allow multiple writers. Long readers can starve checkpoints and grow the WAL.
- WAL plus `synchronous=NORMAL` can lose recent committed transactions after power loss. Product durability language must match the chosen PRAGMA contract.
- Crash evidence should kill/restart at transaction and checkpoint boundaries and verify all-or-none invariants. Preserve the database and its WAL/SHM/journal companions during recovery.
- Embedded migrations improve delivery but do not replace forward-only migration, old-binary/new-schema compatibility, and interruption tests.

Primary notes: [transactions](persistence/2026-07-24-sqlite-transactions.md), [WAL](persistence/2026-07-24-sqlite-wal.md), [atomic commit](persistence/2026-07-24-sqlite-atomic-commit.md), [PRAGMAs](persistence/2026-07-24-sqlite-pragma-durability.md), [SQLx options](persistence/2026-07-24-sqlx-connect-options.md), [custom transactions](persistence/2026-07-24-sqlx-custom-transactions.md), and [queries/migrations](persistence/2026-07-24-sqlx-migrations-queries.md).

## 3. Typed state machines and replay/promotion proof

Rust's enums, newtypes, privacy, exhaustive matching, and ownership can make invalid transitions difficult to express. The strongest upstream example in this corpus is rustls: private marker values bind the fact that verification occurred and prevent skipping required checks before entering the traffic state.

Evidence-supported design constraints for Forge to encode:

- Persist durable facts as an explicit tagged enum/event schema; avoid ambiguous untagged parsing for safety state.
- Reject unknown fields on strict local control/config inputs unless an explicit compatibility contract requires otherwise.
- Use private constructors and non-forgeable capability/marker types for facts such as `NoVisibleOutput`, `NoToolCall`, `ReservationHeld`, or `SafeTurnReviewed`.
- Consume one-shot proof values on transition so replay/promotion cannot accidentally reuse authorization.
- Keep provider events and harness events in edge crates, normalize them into protocol-neutral domain facts, and let the state machine depend only on those facts.
- Represent terminal/irreversible states explicitly and test every transition plus serialization round trip against a reference model.
- Keep user-visible error codes separate from internal causal chains; neither should contain prompts, raw credentials, or headers.

Primary notes: [Serde enums](boundaries/2026-07-24-serde-enum-representations.md), [strict attributes](boundaries/2026-07-24-serde-container-attributes.md), [thiserror](boundaries/2026-07-24-thiserror.md), [rustls builder typestate](security/2026-07-24-rustls-config-builder.md), and [verification markers](security/2026-07-24-rustls-verification-markers.md).

## 4. Cargo workspace and MSRV evidence

Resolver v3 is global at the top-level workspace. Features remain additive and can unify through dependency paths, so crate boundaries and feature design must prevent provider/TUI/TLS choices from leaking into protocol, policy, and state cores.

A reviewable dependency direction for the accepted architecture is:

```text
protocol/types <- policy/state <- provider adapters
        ^             ^              ^
        |             |              |
   daemon/control ----+--------------+
        ^
      CLI  <- optional TUI

test-support/evaluation may depend on public seams;
production crates must not depend on test-support.
```

This is a research-derived dependency constraint, not approval of exact crate names. Workspace review should look for:

- one owner per invariant rather than a crate per noun;
- `resolver = "3"` in a virtual workspace;
- shared dependency versions/features declared centrally where that reduces drift;
- provider and TUI features default-off unless the product requires otherwise;
- `cargo tree -e features`, all-target/all-feature checks, and representative minimal-feature checks;
- public types flowing inward only from the approved protocol/domain crate, never harness/provider SDK types;
- a documented unsafe inventory, defaulting to `forbid(unsafe_code)` where possible.

For a new removable local daemon, the credible starting toolchain is a pinned current stable release (1.97.1 at retrieval), with `package.rust-version` declared only after the full resolved graph and advertised features pass MSRV CI. Tokio 1.51.x is an available 2026 LTS line with MSRV 1.71, but that fact alone is not a reason to choose Rust 1.71 for the product. Re-check stable, platform tiers, and dependency MSRVs immediately before Forge freezes guidance.

Primary notes: [current Rust](rust-cargo/2026-07-24-rust-release-1-97.md), [`rust-version`](rust-cargo/2026-07-24-cargo-rust-version.md), [resolver v3](rust-cargo/2026-07-24-cargo-resolver-v3.md), [features](rust-cargo/2026-07-24-cargo-features.md), [platform tiers](rust-cargo/2026-07-24-platform-support.md), [Cargo CI](rust-cargo/2026-07-24-cargo-ci-msrv.md), [Clippy](rust-cargo/2026-07-24-clippy-ci.md), and [Tokio release policy](async/2026-07-24-tokio-release-policy.md).

## 5. Tracing, secrets, and TLS

- `#[instrument]` captures all arguments by default, including Debug output. Sensitive functions should start from `skip_all` and add allowlisted identifiers/state fields.
- Libraries emit structured spans/events; binaries own subscriber/filter/sink initialization. Libraries should not set the global subscriber.
- Secret wrappers reduce accidental exposure and require explicit access, but do not replace a secret store and cannot prevent every copy during deserialization.
- rustls stable builders encode mandatory verifier/certificate choices and use safe defaults. Custom verifier APIs are deliberately marked dangerous and require Security review.
- TLS/provider selection, certificate roots, egress/redirect/DNS/SSRF controls, redaction acceptance, and crash-dump policy remain Security/platform decisions.

Primary notes: [instrument capture](observability/2026-07-24-tracing-instrument.md), [subscriber ownership](observability/2026-07-24-tracing-subscriber.md), [secrecy](security/2026-07-24-secrecy.md), and [rustls](security/2026-07-24-rustls-config-builder.md).

## 6. CLI and TUI evidence

Clap supports typed subcommands, constrained enums, introspection, and non-exiting parse paths. Human help/error formatting should not become the machine protocol; define stable JSON/stdout schemas and a separate domain exit-code taxonomy. Destructive or billable commands need an explicit confirmation/noninteractive policy above Clap.

Ratatui 0.30's `run` owns terminal initialization and restoration, including panic cleanup. Fallible init/restore APIs exist for explicit error handling. `TestBackend` provides deterministic integration rendering; direct buffer/widget tests are preferred for units. The TUI should remain feature-gated and depend on the same authenticated control client as the CLI rather than becoming a second authority.

Primary notes: [Clap parser](cli-tui/2026-07-24-clap-parser.md), [Clap errors](cli-tui/2026-07-24-clap-errors.md), [terminal lifecycle](cli-tui/2026-07-24-ratatui-lifecycle.md), [TestBackend](cli-tui/2026-07-24-ratatui-test-backend.md), and [Ratatui architecture](cli-tui/2026-07-24-ratatui-architecture.md).

## 7. Verification stack, including eight-hour soak evidence

| Evidence layer | Primary mechanism | What it proves | Main limitation |
|---|---|---|---|
| Unit/contract | `cargo test`, direct Axum/Tower service calls | Pure logic, types, HTTP/service contracts | Does not prove listener/process behavior. |
| Deterministic time | Tokio `start_paused`, injected clocks | Timeouts, retry schedules, breakers, pins, promotion windows | Only controlled clocks advance. |
| Property/state | proptest + persisted seeds | Invariants across generated values/transition sequences | Current state-machine helper is sequential. |
| Model concurrency | Loom on small primitives | Explored synchronization interleavings | Requires Loom types; state explosion; not DB/process proof. |
| Persistence/concurrency | real temp SQLite, multiple connections/processes, fault injection | Write contention, idempotency, migration and crash recovery | Needs platform/filesystem coverage. |
| Provider/stream | fake HTTP servers and transcript fixtures | chunk ordering, cancellation, replay boundary, error normalization | Fixture drift must be managed; no live credentials. |
| Suite execution | cargo-nextest profiles, timeouts, JUnit | Isolation, classification, evidence export | Doctests remain separate; retries can mask flaws. |
| Microbenchmark | Criterion on controlled hosts | throughput/latency trends with confidence intervals | Noisy shared CI can mislead. |
| Eight-hour soak | purpose-built release harness under nextest/process supervisor | bounded memory/queues, handle/task cleanup, WAL growth/checkpoints, reconnect stability | No single crate proves this; requires explicit invariants and periodic telemetry. |

An eight-hour soak should use fake providers and local fixtures, emit periodic bounded metrics (RSS, task count, queue depth, DB/WAL size, open handles, request/error counters), assert no monotonic leak or invariant breach, capture start/end versions/config/seeds, and fail on flaky retry. It is separate from Criterion and from Loom.

Primary notes: [proptest state machines](testing/2026-07-24-proptest-state-machines.md), [Loom](testing/2026-07-24-loom.md), [Tokio time](testing/2026-07-24-tokio-time-testing.md), [nextest](testing/2026-07-24-nextest.md), [flaky retries](testing/2026-07-24-nextest-retries.md), and [Criterion](testing/2026-07-24-criterion-analysis.md).

## 8. Packaging, SBOM, signing, and advisory evidence

A credible 2026 release-evidence packet can contain target-specific archives/installers, hashes, install/uninstall transcripts, SBOM, embedded dependency metadata, advisory/license/source scan results, and provenance/signature verification. The tools have complementary roles:

- cargo-dist builds target archives/installers and hashes; generated output and tool version must be pinned/reviewed.
- cargo-cyclonedx generates standardized SBOMs and supports `SOURCE_DATE_EPOCH`/target-aware output as of 0.5.9.
- cargo-auditable embeds dependency information in binaries for later scanning.
- cargo-deny supplies advisory/license/ban/source policy evidence but does not prove legal clearance.
- RustSec/cargo-audit produces point-in-time lockfile/binary advisory findings; record database time and lockfile/artifact hash.
- Cosign signs blobs and emits verification bundles; signing/publishing is an explicitly authorized external effect.
- Cargo's native SBOM precursor is still unstable/nightly and should remain supplemental for a stable baseline.
- `cargo package` verifies crate contents/buildability but explicitly does not prove provenance.

Primary notes: [dist config](supply-chain/2026-07-24-cargo-dist-config.md), [dist attestations](supply-chain/2026-07-24-cargo-dist-attestations.md), [cargo-cyclonedx](supply-chain/2026-07-24-cargo-cyclonedx.md), [cargo-auditable](supply-chain/2026-07-24-cargo-auditable.md), [cargo-deny](supply-chain/2026-07-24-cargo-deny-checks.md), [license limits](supply-chain/2026-07-24-cargo-deny-license-limitations.md), [RustSec](supply-chain/2026-07-24-rustsec.md), [cargo-audit](supply-chain/2026-07-24-cargo-audit.md), [Cosign](supply-chain/2026-07-24-sigstore-cosign-blob.md), [Cargo SBOM](supply-chain/2026-07-24-cargo-sbom-unstable.md), and [cargo package](supply-chain/2026-07-24-cargo-package-verification.md).

## Peer-boundary map

| Area | Rust Bee may implement/prove | Peer retains final authority |
|---|---|---|
| HTTP/MCP/provider protocol | Approved types, adapters, fixtures, streaming behavior | Protocol semantics and compatibility |
| Security/TLS/secrets/logs | Safe defaults, redaction mechanics, tests | Threat model and acceptance |
| SQLite/SQLx | Transactions, migrations, concurrency/crash tests | Schema/data architecture review |
| Dependencies/SBOM/licenses | Generate exact reports/artifacts | Exceptions, license/advisory disposition |
| Release/CI | Rust build/package configuration and local proof | CI topology, signing identity, publication |
| Quality | Acceptance-linked implementation evidence | Final PRD implementation audit |

## Open decisions for the user/orchestrator

1. Exact supported OS/architecture/install matrix and minimum OS/glibc baselines.
2. Whether the initial toolchain pins current stable or a selected older stable after the dependency graph exists; no evidence supports claiming an MSRV before that graph is tested.
3. Required power-loss durability: WAL `FULL`, WAL `NORMAL`, or another documented contract.
4. Maximum writer wait/busy timeout and user-visible contention behavior.
5. Exact state/event schema for visible output, tool calls, reservation, replay prohibition, and safe-turn promotion.
6. Whether the optional TUI is inside the first executable milestone.
7. Release signing identity/attestation platform and which installer formats are authorized.
8. Quantitative pass/fail thresholds for the eight-hour soak (RSS slope, WAL growth, task/handle counts, throughput/error rate).

## Tool provenance limitation

The research packet uses the configured Context7 service plus current direct official/upstream documentation retrieval. No raw web-crawl JSON exists; this limitation is explicit so Forge does not mistake the corpus for a web-crawl corpus.

