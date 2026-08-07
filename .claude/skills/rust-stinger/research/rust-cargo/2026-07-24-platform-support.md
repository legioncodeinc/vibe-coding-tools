---
source_url: https://doc.rust-lang.org/rustc/platform-support.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: targets
stinger: rust-stinger
---

# Rust platform support

## Summary
Rust classifies targets into three tiers with materially different build and test guarantees. Tier 1 targets build and pass tests in Rust CI; Tier 2 targets are guaranteed to build but may not be tested. A product target matrix therefore needs its own runtime/install/uninstall proof even when the compiler labels a target supported.

## Key quotations / statistics
- "Tier 1 targets can be thought of as `guaranteed to work`."
- Tier 2 targets "can be thought of as `guaranteed to build`."

## Version/date caveat
Target tiers and OS baselines can change between Rust releases; re-check during release planning.

## Annotations for stinger-forge
- Use to separate compiler support from product support evidence.
- Supports explicit macOS/Linux/Windows target triples and host-tool requirements.

