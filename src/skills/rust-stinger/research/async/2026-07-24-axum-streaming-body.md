---
source_url: https://docs.rs/axum/latest/axum/body/struct.Body.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: streaming
stinger: rust-stinger
---

# Axum streaming bodies

## Summary
Axum 0.8.9 wraps `http_body::Body` and can create a response body from a fallible `Stream`. Consumers pull frames asynchronously through `poll_frame`; converting to a data-only stream discards trailers. Backpressure therefore propagates through polling only if the upstream producer is itself bounded and cancellation-aware.

## Key quotations / statistics
- `from_stream`: "Create a new `Body` from a `Stream`."
- `poll_frame`: "Attempt to pull out the next data buffer of this stream."

## Version/date caveat
Axum 0.8.9, http-body 1.1.0 at retrieval. Frame/trailer behavior must match the selected HTTP contract.

## Annotations for stinger-forge
- Core source for streaming body construction and disconnect/cancellation tests.
- Do not collect unbounded streams into memory; test that dropping the body stops producer work and releases permits.
