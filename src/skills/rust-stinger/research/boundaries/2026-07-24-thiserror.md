---
source_url: https://docs.rs/crate/thiserror/latest
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: errors
stinger: rust-stinger
---

# thiserror structured errors

## Summary
thiserror 2.0.19 derives standard error implementations without becoming part of the public API contract. `source`, `from`, and `transparent` preserve causal chains, while an opaque public wrapper can hide a private evolving representation. Redaction still depends on the chosen fields and Display text.

## Key quotations / statistics
- "Errors may use `error(transparent)` to forward the source and Display methods"
- "hiding implementation details ... behind an opaque error type"

## Version/date caveat
Version 2.0.19 was published six days before retrieval; pin and test formatting if machine parsing depends on it.

## Annotations for stinger-forge
- Supports domain error enums at crate boundaries and opaque public errors.
- Do not place secrets/prompts in source error values or formatted context.
