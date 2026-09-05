---
source_url: https://docs.rs/axum/latest/axum/serve/struct.Serve.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: axum
stinger: rust-stinger
---

# Axum server graceful shutdown

## Summary
Axum's `Serve::with_graceful_shutdown` binds server lifetime to a supplied future. It stops accepting new work when the signal resolves and waits for connections according to the server's graceful behavior. Application-owned background tasks still need separate ownership and joining.

## Key quotations / statistics
- "Prepares a server to handle graceful shutdown"
- The signal is a future "that resolves to `()`"

## Version/date caveat
Axum latest docs at retrieval; exact connection-drain semantics depend on the matching hyper/axum versions.

## Annotations for stinger-forge
- Use for the loopback listener shutdown path.
- Pair with Tokio task tracking; server shutdown alone does not prove all background work stopped.
