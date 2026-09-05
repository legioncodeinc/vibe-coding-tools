---
source_url: https://doc.rust-lang.org/stable/cargo/reference/rust-version.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: msrv
stinger: rust-stinger
---

# Cargo `rust-version`

## Summary
Cargo's `rust-version` field declares the minimum supported compiler and participates in diagnostics and dependency resolution. Workspace members can have different policies, but shared dependencies and feature unification mean the lowest supported member can constrain the whole workspace. The declared value needs CI proof rather than being treated as descriptive metadata.

## Key quotations / statistics
- "The resolver may take Rust version into account when picking dependencies."
- "All functionality, including binaries and API, are available on the supported Rust versions under every feature."

## Version/date caveat
Stable Cargo documentation retrieved against the Rust 1.97 release line; resolver behavior depends on workspace resolver selection.

## Annotations for stinger-forge
- Grounds MSRV declaration and verification rules.
- Supports testing all public feature combinations claimed to work at MSRV.
