---
source_url: https://tokio.rs/tokio/topics/testing
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: faketime
stinger: rust-stinger
---

# Tokio deterministic time testing

## Summary
Tokio test utilities pause the runtime clock and advance timer-driven futures when no other work can progress. `#[tokio::test(start_paused = true)]` makes backoff, timeout, breaker, pin, and promotion timing tests fast and deterministic, provided production time access is routed through Tokio time or an injected clock.

## Key quotations / statistics
- "Pausing time has the effect that any time-related future may become ready early."
- `start_paused` requires the `test-util` feature.

## Version/date caveat
Only Tokio's clock is paused; `std::time` and external systems do not automatically follow it.

## Annotations for stinger-forge
- Critical source for fake-clock tests and avoiding wall-clock sleeps.
- Explicitly yield/advance and assert temporal ordering, not elapsed host time.
