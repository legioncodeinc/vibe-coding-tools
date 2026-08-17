---
source_url: https://docs.rs/rustls/latest/rustls/struct.ConfigBuilder.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: tls
stinger: rust-stinger
---

# rustls configuration typestate

## Summary
rustls 0.23.42 uses builder typestates to require protocol/provider, peer verification, and certificate decisions in order. Normal builders select safe default protocol versions; custom verifiers sit behind a deliberately dangerous API. The builder demonstrates compile-time enforcement of required configuration steps.

## Key quotations / statistics
- "use rustls' default cryptographic provider and safe defaults"
- Builder state "ensure[s] at compile time that each required configuration item is provided exactly once"

## Version/date caveat
The stable docs reported rustls 0.23.42; rustls.dev also exposed 0.24.0-dev.0, so do not code to development APIs accidentally.

## Annotations for stinger-forge
- Strong upstream example for typestate and TLS-safe defaults.
- Custom certificate verification requires explicit Security review.

