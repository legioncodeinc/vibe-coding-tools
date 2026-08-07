---
source_url: https://docs.rs/tower/latest/tower/builder/struct.ServiceBuilder.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: middleware
stinger: rust-stinger
---

# Tower concurrency, buffering, and load shedding

## Summary
`ServiceBuilder` exposes concurrency limits, buffers, timeouts, and load shedding as composable layers. Concurrency limits count in-flight requests through response-future completion. Load shedding converts lack of readiness into an immediate error rather than waiting. Layer order changes which work is bounded and which errors are visible.

## Key quotations / statistics
- "Limit the max number of in-flight requests."
- "`LoadShed` immediately responds with an error"

## Version/date caveat
Feature-gated Tower APIs; selected crate features and layer order must be recorded in the workspace.

## Annotations for stinger-forge
- Supports explicit capacity/timeout/load-shed policy and layer-order tests.
- Protocol error mapping remains a peer decision; this source only establishes middleware behavior.

