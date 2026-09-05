---
source_url: https://docs.rs/tracing/latest/tracing/
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: subscriber
stinger: rust-stinger
---

# tracing library/subscriber ownership

## Summary
Tracing libraries emit spans/events but executables install subscribers that collect and format them. The docs warn libraries not to set a global default because that conflicts with downstream executables. This creates a clean crate boundary: libraries describe structured events; daemon/CLI binaries own filtering, sinks, and output format.

## Key quotations / statistics
- "Libraries should link only to the `tracing` crate"
- "libraries should not call `set_global_default()`"

## Version/date caveat
Tracing 0.1.44 documentation; subscriber features and ecosystem layers vary independently.

## Annotations for stinger-forge
- Grounds observability dependency direction and binary-owned initialization.
- Security/redaction review remains a peer gate even when field ownership is correct.
