# 08 — Verify and package evidence

## Purpose

Run the complete owned Rust gate and generate reviewable package evidence without claiming peer acceptance or performing unauthorized external effects. This guide covers Command Brief action 9.

## Verification ladder

Adapt exact commands to the repository and record every result.

```bash
cargo fmt --all -- --check
cargo check --workspace --all-targets
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace
cargo test --workspace --doc
cargo metadata --format-version 1
cargo tree --workspace -e features
```

Add declared minimal/default/all-feature builds, MSRV checks, target builds, migration/concurrency/crash/fake-provider tests, property/model tests, benchmarks, and soak checks. Clippy guidance recommends `-Dwarnings` with the same compiler toolchain as compilation; new lints make the result toolchain-specific ([research](../research/rust-cargo/2026-07-24-clippy-ci.md)). Nextest does not run doctests, so retain a separate doc-test step ([research](../research/testing/2026-07-24-nextest.md)).

## Evidence layers

- Unit/contract: pure logic and direct Tower/Axum calls.
- Deterministic time: Tokio paused clock for time-driven behavior ([research](../research/testing/2026-07-24-tokio-time-testing.md)).
- Property/state: proptest with saved seeds.
- Model concurrency: Loom only for small primitives expressed with Loom types ([research](../research/testing/2026-07-24-loom.md)).
- Persistence/process: real SQLite, multiple writers, fault injection, kill/restart.
- Provider/stream: fake servers and transcript fixtures.
- Benchmark: Criterion on a controlled host; statistics do not remove noisy-host risk ([research](../research/testing/2026-07-24-criterion-analysis.md)).
- Soak: purpose-built fake-provider run with periodic RSS, task, queue, DB/WAL, handle, throughput, and error telemetry.

> TODO: human decision before release qualification — define quantitative soak thresholds; no universal off-the-shelf eight-hour harness or product threshold exists in the research packet.

## Release evidence packet

Populate `templates/release-evidence-manifest.yaml` with target artifacts, hashes, toolchain/lockfile, tests, SBOM, advisory/license/source scans, install/uninstall transcripts, and verification commands.

- Revalidate cargo-dist before generating archives/installers; it supports target artifacts, checksums, and several installers, while checksums alone are unsigned integrity values ([research](../research/supply-chain/2026-07-24-cargo-dist-config.md)).
- Generate target/feature-aware SBOM evidence and record tool version; cargo-cyclonedx added reproducible timestamp and target support in its retrieval-time release ([research](../research/supply-chain/2026-07-24-cargo-cyclonedx.md)).
- Record advisory database time and lockfile/artifact hash because RustSec findings are point-in-time ([research](../research/supply-chain/2026-07-24-rustsec.md)).
- Treat cargo-deny output as evidence for the dependency owner, not license/legal clearance ([research](../research/supply-chain/2026-07-24-cargo-deny-license-limitations.md)).
- Treat Cargo's native SBOM precursor as optional/nightly until stabilized ([research](../research/supply-chain/2026-07-24-cargo-sbom-unstable.md)).
- Do not confuse `cargo package` verification with provenance; Cargo states provenance is not verified ([research](../research/supply-chain/2026-07-24-cargo-package-verification.md)).
- Do not sign or publish. Cosign signing can create identity/transparency-log effects and needs explicit authorization ([research](../research/supply-chain/2026-07-24-sigstore-cosign-blob.md)).

## Open decision checkpoints

> TODO: human decisions before release — supported targets/baselines, MSRV, installer formats, signing/attestation identity, and publication authorization.

## Worked examples

See [release evidence with closed gates](../examples/04-release-evidence-with-closed-gates.md) and [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md).
