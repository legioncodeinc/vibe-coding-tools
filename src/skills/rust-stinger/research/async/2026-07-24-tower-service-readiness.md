---
source_url: https://docs.rs/tower/latest/tower/trait.Service.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: readiness
stinger: rust-stinger
---

# Tower `Service` readiness contract

## Summary
Tower separates readiness from dispatch. Callers must observe `poll_ready` before `call`; readiness may reserve shared resources, which implementations must release if dispatch never occurs or the response future is dropped. Capacity is therefore an ownership contract, not merely a performance hint.

## Key quotations / statistics
- "Before dispatching a request, `poll_ready` must be called"
- readiness "may reserve shared resources"

## Version/date caveat
Tower latest docs at retrieval; middleware can alter readiness semantics by layer order.

## Annotations for stinger-forge
- Core evidence for backpressure-aware Tower services and adapters.
- Supports tests that cancel between readiness and call and assert permit/resource release.
