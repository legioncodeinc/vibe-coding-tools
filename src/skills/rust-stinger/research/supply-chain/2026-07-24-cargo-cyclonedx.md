---
source_url: https://docs.rs/crate/cargo-cyclonedx/0.5.9/source/CHANGELOG.md
retrieved_on: 2026-07-24
source_type: changelog
authority: official
relevance: critical
topic: sbom
stinger: rust-stinger
---

# cargo-cyclonedx 0.5.9 changelog

## Summary
cargo-cyclonedx 0.5.9, released 2026-03-19, added `SOURCE_DATE_EPOCH` support for reproducible SBOM timestamps and honors `CARGO_BUILD_TARGET` for target identity. It also fixed sparse-registry and package-URL correctness. SBOM generation still requires validation against the shipped artifact and selected features/target.

## Key quotations / statistics
- "Support for the `SOURCE_DATE_EPOCH` environment variable"
- "`CARGO_BUILD_TARGET` ... determine[s] the target platform"

## Version/date caveat
Version 0.5.9 is the current release reported at retrieval; coverage/format support should be checked before freezing.

## Annotations for stinger-forge
- Strong 2026 source for reproducible target-specific CycloneDX generation.
- Final SBOM completeness/policy judgment belongs to dependency/release peers.
