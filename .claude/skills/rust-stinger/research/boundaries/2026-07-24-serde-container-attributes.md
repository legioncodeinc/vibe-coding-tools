---
source_url: https://serde.rs/container-attrs.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: validation
stinger: rust-stinger
---

# Serde container boundary attributes

## Summary
Serde's container attributes allow unknown-field rejection, fallible conversion through `try_from`, transparent newtypes, defaults, and explicit tagging. Unknown fields are ignored by default in self-describing formats, so strict control/config inputs require an intentional choice rather than assuming fail-closed parsing.

## Key quotations / statistics
- `deny_unknown_fields` will "Always error during deserialization when encountering unknown fields."
- By default, "unknown fields are ignored"

## Version/date caveat
`deny_unknown_fields` cannot be combined with `flatten`; compatibility policy must account for that limitation.

## Annotations for stinger-forge
- Grounds strict config/control-plane parsing and validated newtypes.
- Use separate input DTOs when forward-compatible wire payloads must retain unknown fields.

