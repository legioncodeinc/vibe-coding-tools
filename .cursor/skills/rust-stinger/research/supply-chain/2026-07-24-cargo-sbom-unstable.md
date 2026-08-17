---
source_url: https://doc.rust-lang.org/cargo/reference/unstable.html#sbom
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: cargo-sbom
stinger: rust-stinger
---

# Cargo unstable SBOM precursors

## Summary
Nightly Cargo's `-Z sbom` emits per-artifact JSON precursor files containing dependencies, target, features, and compiler data. These are inputs for SBOM tools, not complete standardized SBOMs. Because the feature is unstable and requires nightly, a stable release pipeline should treat it as supplemental unless explicitly approved.

## Key quotations / statistics
- "generate so-called SBOM pre-cursor files"
- Files contain "dependencies, target, features and the used rustc compiler"

## Version/date caveat
Unstable Cargo feature tracked by issue/RFC; schema and availability may change without stable guarantees.

## Annotations for stinger-forge
- Record as optional deeper artifact evidence.
- Prefer stable cargo-cyclonedx/cargo-auditable paths for baseline release guidance.

