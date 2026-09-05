---
source_url: https://nexte.st/docs/features/retries/
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: flakiness
stinger: rust-stinger
---

# Nextest retries and flaky results

## Summary
Nextest labels tests that pass only after retry as flaky and can make flaky outcomes fail the profile. JUnit output distinguishes flaky and rerun failures. This supports visibility while preserving a strict default for correctness/concurrency tests.

## Key quotations / statistics
- "If a test succeeds during a retry, the test is marked flaky."
- "Flaky test detection is integrated with nextest's JUnit support."

## Version/date caveat
Behavior described includes versioned JUnit changes; confirm the pinned nextest release's config schema.

## Annotations for stinger-forge
- Require `flaky-result = "fail"` for release evidence unless a peer-approved quarantine exists.
- Never use retries to mask model, migration, or cancellation races.
