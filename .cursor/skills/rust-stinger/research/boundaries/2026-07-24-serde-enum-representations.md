---
source_url: https://serde.rs/enum-representations.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: serde
stinger: rust-stinger
---

# Serde enum representations

## Summary
Serde supports externally, internally, adjacently, and untagged enum encodings. Tagged enums make the selected variant explicit before or alongside content; untagged enums try variants in order and accept the first successful parse. For safety-state and protocol boundaries, representation choice affects ambiguity, forward compatibility, and error quality.

## Key quotations / statistics
- Externally tagged data identifies "which variant we are dealing with before beginning to parse"
- Untagged "will try to match the data against each variant in order"

## Version/date caveat
Serde project documentation; specific derive behavior still depends on the pinned serde version and enabled `alloc` feature.

## Annotations for stinger-forge
- Supports explicit tagged enums for state/event boundaries where ambiguity is unacceptable.
- Protocol wire encoding remains the protocol peer's contract.

