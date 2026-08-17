---
source_url: https://github.com/rust-secure-code/cargo-auditable
retrieved_on: 2026-07-24
source_type: github-readme
authority: practitioner
relevance: high
topic: auditability
stinger: rust-stinger
---

# cargo-auditable

## Summary
cargo-auditable embeds Cargo dependency version information in production binaries so deployed artifacts can be scanned later. It integrates with cargo-dist and experimental Cargo SBOM precursor output. The project recommends recording artifact hash, Cargo.lock, compiler/LLVM versions, and build date alongside binaries because embedded dependency metadata alone is not complete provenance.

## Key quotations / statistics
- "Make production Rust binaries auditable"
- record "the hash of every executable" with build metadata.

## Version/date caveat
The upstream README mentions nightly `-Z sbom`; nightly Cargo features are not a stable release foundation without explicit approval.

## Annotations for stinger-forge
- Supports artifact-to-lockfile traceability and post-build `cargo audit bin` checks.
- Treat it as complementary to external SBOMs and attestations.

