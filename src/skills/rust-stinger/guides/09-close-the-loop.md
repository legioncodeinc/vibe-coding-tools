# 09 - Close the loop

## Purpose

Return acceptance-linked implementation evidence, limitations, recovery notes, and peer handoffs in the required order. This guide covers Command Brief action 10.

## Completion procedure

1. Re-read the requested acceptance criteria and current ledger/gates.
2. Run the final relevant Rust commands against the current tree; do not reuse stale results.
3. Populate `templates/implementation-handoff.md` with exact outcomes and changed paths.
4. For each criterion, cite a command, test, artifact, and result.
5. State external effects exactly: `none` or the recorded authorization/effect.
6. Explain migration, rollback, restart, and data recovery, including any irreversible step.
7. Explain prompt/secret/log/diagnostic handling and remaining Security questions.
8. Route the implemented state to Security. If fixes land, rerun affected implementation gates.
9. Route the post-Security state to Quality for final implementation-to-PRD audit.
10. Leave protocol, platform, dependency/license, CI/release, signing, publication, and other gates with their actual owners.

## Evidence honesty rules

- A current-stable toolchain is not a proven MSRV; Cargo requires verification of declared `rust-version` across supported functionality ([research](../research/rust-cargo/2026-07-24-cargo-rust-version.md)).
- A compiler-supported target is not a product-supported install/runtime target ([research](../research/rust-cargo/2026-07-24-platform-support.md)).
- Passing Loom is not general concurrency proof because unmodeled operations are invisible and state spaces are bounded ([research](../research/testing/2026-07-24-loom.md)).
- A retry-only test success is flaky evidence, not a clean pass ([research](../research/testing/2026-07-24-nextest-retries.md)).
- A generated checksum, SBOM, advisory scan, or license scan does not by itself prove signed provenance or peer acceptance ([research](../research/supply-chain/2026-07-24-cargo-dist-config.md), [research](../research/supply-chain/2026-07-24-cargo-deny-license-limitations.md)).

## Blocked checkpoint

When blocked, provide the smallest safe compilable/testable checkpoint if one exists, then name:

- blocker and owning gate;
- affected acceptance criteria;
- files/tests completed;
- commands that passed, failed, or were unavailable;
- first authorized next action.

Never call a partial checkpoint shipped or release-ready.

## Worked examples

See all four examples, especially [release evidence with closed gates](../examples/04-release-evidence-with-closed-gates.md) and [visible-output cancellation](../examples/02-edge-visible-output-cancellation.md).
