---
source_url: https://docs.rs/axum/latest/src/axum/routing/mod.rs.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: testing
stinger: rust-stinger
---

# Axum router testing as a Tower service

## Summary
Axum routers can be converted to borrowed or owned Tower services and invoked directly with requests. This avoids binding a real socket for most contract and middleware tests, making state, status, headers, and body behavior deterministic while reserving live-listener tests for integration boundaries.

## Key quotations / statistics
- "Use `as_service` to get a borrowed `Service` from a `Router`."
- "Use `into_service` to get an owned `Service`"

## Version/date caveat
Source docs for Axum latest; test helpers and body collection APIs vary across axum/http-body-util releases.

## Annotations for stinger-forge
- Supports in-process HTTP contract tests without network flakiness.
- Loopback bind and shutdown still require a smaller dedicated integration test.

