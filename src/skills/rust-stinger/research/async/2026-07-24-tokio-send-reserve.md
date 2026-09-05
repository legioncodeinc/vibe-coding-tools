---
source_url: https://docs.rs/tokio/latest/src/tokio/sync/mpsc/bounded.rs.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: permits
stinger: rust-stinger
---

# Tokio MPSC reserve and cancellation

## Summary
The bounded-channel source documentation says cancelling `send` loses the message and the sender's queue position. Reserving capacity first returns a permit so message construction can occur only after capacity is secured. Outstanding permits also delay a receiver from observing final closure.

## Key quotations / statistics
- "the message is dropped and will be lost"
- "To avoid losing messages, use `reserve`"

## Version/date caveat
Source documentation for Tokio latest (1.53.1 at retrieval); treat internal implementation as unstable while relying on documented public behavior.

## Annotations for stinger-forge
- Supports reserve-before-expensive-work and cancellation-focused queue tests.
- Shutdown code must account for outstanding permits, not only sender handles.
