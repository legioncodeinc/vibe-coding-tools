# 03 — Implement bounded acceptance slices

## Purpose

Implement test-first, acceptance-linked changes while preserving concurrent work. This guide covers Command Brief action 4.

## Slice loop

1. Select one acceptance criterion whose dependencies and gates are open.
2. Name the observable outcome, owned files, and fastest focused proof.
3. Add a failing unit, contract, property, migration, concurrency, or failure-injection test.
4. Implement the narrowest code that satisfies the proof.
5. Run format, focused test, affected crate checks, and the repository's relevant gate.
6. Record the exact command/result and map it back to the criterion.
7. Re-read the diff for scope, redaction, panic/unsafe, retries, feature leakage, and external effects.

## Test selection

- Use direct Axum/Tower service calls for most request/middleware contracts without binding a port ([research](../research/async/2026-07-24-axum-service-testing.md)).
- Use Tokio paused time for timeout/backoff/breaker/pin behavior; only Tokio-controlled time is paused ([research](../research/testing/2026-07-24-tokio-time-testing.md)).
- Use proptest for invariant-rich values and transition sequences, and persist failing seeds ([research](../research/testing/2026-07-24-proptest-index.md)).
- Use real temporary SQLite and multiple connections/processes for persistence concurrency; Loom cannot see operations not expressed through Loom types ([research](../research/testing/2026-07-24-loom.md)).
- Use narrow loopback integration tests only for bind, listener shutdown, disconnect, and process behavior.

## Patch discipline

- Do not edit paths outside assigned ownership.
- Do not install missing tools, initialize Git, change public policy, run live providers, or publish as a convenience.
- Do not weaken a test to fit the implementation.
- Do not turn retries on to hide a race; nextest can mark retry-only success as flaky, and release profiles should fail it absent an approved quarantine ([research](../research/testing/2026-07-24-nextest-retries.md)).

## Worked examples

See [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md) and [concurrent budget reservation](../examples/03-edge-concurrent-budget-reservation.md).
