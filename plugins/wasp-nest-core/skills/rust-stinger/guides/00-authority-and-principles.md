# 00 - Authority and principles

## Purpose

Reconstruct why the change is authorized, which paths are owned, which gates are open, and where Rust implementation authority ends. This guide covers Command Brief action 1 and every critical directive.

## Procedure

1. Read the repository instructions, exact PRD/sub-PRD, ADRs, execution ledger, acceptance criteria, and current Security/Quality evidence before source code.
2. Inspect `git status`, active branch/worktree, and owned paths. Treat unrelated or concurrent edits as user work.
3. Build a scope table with columns `AC`, `owned path`, `gate`, `proof`, and `peer handoff`.
4. Mark any blocked or deferred slice `BLOCKED`; do not prepare implementation behind it.
5. Record each decision that cannot be made locally: protocol semantics, provider/product policy, threat acceptance, schema policy, dependency/license exceptions, CI topology, signing, publication, or final Quality.
6. Confirm that all external effects are either `none` or separately authorized.

## Fail-closed decision table

| Missing fact | Required response |
|---|---|
| Safety or egress boundary | Stop and hand to Security/platform owner. |
| Public protocol meaning | Stop and hand to protocol owner. |
| Live credentials, paid traffic, or subscription use | Keep fake/fixture route only. |
| Destructive/billable CLI policy | Keep command disabled. |
| Signing, publication, installer execution, or auto-update | Generate local evidence only. |
| Target matrix, MSRV, durability, or soak threshold | Record a revalidation/TODO decision; do not declare support. |

## Non-negotiable implementation posture

- Use typed, explicit state at boundaries. Serde ignores unknown fields by default, so strict local control/config inputs need an intentional rejection or validated-conversion policy ([research](../research/boundaries/2026-07-24-serde-container-attributes.md)).
- Treat cancellation safety as a property of each awaited operation, not of async code generally ([research](../research/async/2026-07-24-tokio-select-cancellation.md)).
- Default sensitive instrumentation to `skip_all` because `#[instrument]` otherwise records function arguments ([research](../research/observability/2026-07-24-tracing-instrument.md)).
- Default to safe Rust and isolate any `unsafe` proof obligation behind the smallest safe abstraction ([research](../research/rust-cargo/2026-07-24-unsafe-rust.md)).
- Never equate a passing license/advisory tool with final legal or security acceptance; cargo-deny itself documents limits to license discovery ([research](../research/supply-chain/2026-07-24-cargo-deny-license-limitations.md)).

## Gate exit

Proceed only when the assigned slice has authority, owned paths, acceptance proof, and peer handoffs. Otherwise populate `templates/implementation-handoff.md` as a precise blocker.

## Worked examples

See [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md) and [release evidence with closed gates](../examples/04-release-evidence-with-closed-gates.md).
