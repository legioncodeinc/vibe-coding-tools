---
source_url: https://docs.rs/tokio/latest/tokio/macro.select.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: cancellation
stinger: rust-stinger
---

# Tokio `select!` cancellation safety

## Summary
Tokio defines cancellation safety as dropping and recreating an incomplete future without observable loss. The docs enumerate safe and unsafe operations and warn that loops using non-cancellation-safe futures can lose data when another branch wins. This must be checked per awaited operation, not assumed because code is async.

## Key quotations / statistics
- "it must be a no-op to drop that future and recreate it"
- "The lists in this section are not exhaustive."

## Version/date caveat
Retrieved against Tokio 1.53.1; method-level cancellation guarantees may change and should be linked directly in code review.

## Annotations for stinger-forge
- Core source for cancellation audits around streams, writes, queues, and database work.
- Supports focused tests for the exact boundary where visible output makes replay forbidden.
