---
source_url: https://doc.rust-lang.org/stable/cargo/reference/features.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: features
stinger: rust-stinger
---

# Cargo features and feature unification

## Summary
Cargo features are additive and can be unified across dependency paths. Resolver v2 and later avoid several unwanted unifications for target-specific, build/proc-macro, and inactive dev dependencies, but feature coupling still requires deliberate crate boundaries and CI combinations. Default features are part of the public dependency contract unless callers disable them consistently.

## Key quotations / statistics
- "Features should be additive."
- Resolver v2 "avoids unifying features" across several dependency categories.

## Version/date caveat
Stable Cargo documentation; individual dependency feature sets can change without a workspace architecture change.

## Annotations for stinger-forge
- Supports feature hygiene, `cargo tree -e features`, and targeted feature-matrix checks.
- Relevant to keeping TUI/provider/TLS capabilities out of core crates by default.

