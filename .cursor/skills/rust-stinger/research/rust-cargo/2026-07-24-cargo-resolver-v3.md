---
source_url: https://doc.rust-lang.org/cargo/reference/resolver.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: resolver
stinger: rust-stinger
---

# Cargo dependency resolver

## Summary
Cargo resolver version 3 is the Rust 2024 default and changes incompatible-Rust-version handling from `allow` to `fallback`. Resolver choice is global to the top-level workspace and dependency manifests cannot override it; virtual workspaces must set it explicitly. This is a workspace architecture constraint, not a per-crate preference.

## Key quotations / statistics
- "`3` (`edition = `2024` default, requires Rust 1.84+)"
- "The resolver is a global option that affects the entire workspace."

## Version/date caveat
Stable Cargo docs as of retrieval. Resolver v3 sets selection behavior but does not prove every selected dependency actually honors its MSRV.

## Annotations for stinger-forge
- Inform the workspace manifest checklist and feature/MSRV audit.
- Warn that a virtual workspace must explicitly declare `resolver = "3"`.
