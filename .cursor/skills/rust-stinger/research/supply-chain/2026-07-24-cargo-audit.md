---
source_url: https://github.com/rustsec/rustsec/blob/main/cargo-audit/README.md
retrieved_on: 2026-07-24
source_type: github-readme
authority: official
relevance: critical
topic: cargo-audit
stinger: rust-stinger
---

# RustSec cargo-audit

## Summary
cargo-audit checks Cargo.lock against RustSec and can inspect binaries built with cargo-auditable. Its experimental `fix` command modifies manifests, while ignore entries require application-specific justification. The README states binary scanning is incomplete for ordinary optimized binaries but accurate when auditable metadata is embedded.

## Key quotations / statistics
- "Audit your dependencies for crates with security vulnerabilities"
- Without auditable metadata it may miss "roughly half of the Rust dependencies"

## Version/date caveat
README currently requires Rust 1.74 or later; pin cargo-audit independently from the product MSRV.

## Annotations for stinger-forge
- Supports lockfile and shipped-binary audit evidence.
- Never run automatic fix as part of an evidence-only release gate without review.
