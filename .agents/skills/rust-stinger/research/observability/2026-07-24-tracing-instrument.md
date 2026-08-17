---
source_url: https://docs.rs/tracing/latest/tracing/attr.instrument.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: tracing
stinger: rust-stinger
---

# `tracing::instrument` field capture

## Summary
`#[instrument]` records function arguments by default, using `Value` or `Debug`. `skip` and `skip_all` explicitly exclude arguments, and replacement fields can record safe identifiers. This default makes unreviewed instrumentation a direct secret/prompt leakage risk at sensitive boundaries.

## Key quotations / statistics
- "By default, all arguments to the function are included as fields"
- `skip_all` can "skip all arguments"

## Version/date caveat
Retrieved against tracing 0.1.44; macro capture policy is current at access time.

## Annotations for stinger-forge
- Critical source for a `skip_all`-first rule on provider, prompt, credential, and SQL boundaries.
- Add explicit allowlisted correlation/state fields rather than relying on Debug.

