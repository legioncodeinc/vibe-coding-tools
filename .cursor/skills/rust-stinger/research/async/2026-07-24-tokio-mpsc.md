---
source_url: https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: backpressure
stinger: rust-stinger
---

# Tokio bounded MPSC channels

## Summary
Tokio's bounded MPSC channel supplies backpressure by suspending senders when capacity is exhausted. Clean shutdown closes the receiver and drains buffered values; dropping the receiver drains and drops unread messages. Unbounded channels have infinite logical capacity and therefore cannot express a memory/backpressure bound.

## Key quotations / statistics
- "the channel provides backpressure"
- "the receiver first calls `close`, which will prevent any further messages"

## Version/date caveat
Retrieved against Tokio 1.53.1. Allocation details are explicitly implementation details and may change.

## Annotations for stinger-forge
- Grounds bounded queue requirements and shutdown draining tests.
- Supports rejecting unbounded queues on stream/provider hot paths without a proven upper bound.

