---
source_url: https://proptest-rs.github.io/proptest/proptest/state-machine.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: proptest
stinger: rust-stinger
---

# Proptest state-machine testing

## Summary
Proptest state-machine testing generates sequences of valid transitions from a reference model, applies them to the system under test, checks postconditions/invariants, and shrinks failures to a minimal reproducer. It persists regression seeds. Current upstream support is sequential; concurrency behavior needs another technique such as Loom or explicit multi-client integration tests.

## Key quotations / statistics
- "checking properties of a system under test ... against an abstract reference state machine"
- "only sequential strategy is supported"

## Version/date caveat
State-machine support lives in the separate `proptest-state-machine` crate and may not version-lock with all proptest releases.

## Annotations for stinger-forge
- Primary evidence for quota, reservation, reconciliation, breaker, pin, and promotion model tests.
- Pair with deterministic persistence fixtures and independent concurrency evidence.
