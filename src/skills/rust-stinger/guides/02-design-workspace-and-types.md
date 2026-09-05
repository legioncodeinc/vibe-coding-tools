# 02 - Design workspace and types

## Purpose

Establish the smallest coherent design without inventing peer-owned semantics. This guide covers Command Brief action 3.

## Workspace rules

1. Keep one owner per invariant; do not create a crate per noun.
2. Keep protocol/domain types inward, policy/state above them, provider adapters at edges, daemon/control as composition, and CLI/TUI as clients.
3. Keep test-support out of production dependency paths.
4. Declare `resolver = "3"` explicitly in a virtual Rust 2024 workspace; resolver choice is global, and version 3 is the Rust 2024 default ([research](../research/rust-cargo/2026-07-24-cargo-resolver-v3.md)).
5. Keep features additive, inspect feature unification, and make optional providers/TUI default-off unless the product contract requires otherwise ([research](../research/rust-cargo/2026-07-24-cargo-features.md)).
6. Centralize shared dependency versions/features only when it reduces drift without making edge features leak inward.

## Typed boundary rules

- Convert edge DTOs into validated domain newtypes before use.
- Prefer explicit tagged enums for durable safety state; untagged Serde enums try variants in order and can be ambiguous ([research](../research/boundaries/2026-07-24-serde-enum-representations.md)).
- Use private constructors and consumable marker/capability values for completed checks such as `NoVisibleOutput`, `ReservationHeld`, or `SafeTurnReviewed`. rustls uses non-constructible verification markers to prevent omitted-check control flow ([research](../research/security/2026-07-24-rustls-verification-markers.md)).
- Keep provider and harness SDK types in edge crates; normalize into protocol-neutral facts.
- Use structured errors with redacted public display and preserved internal sources; `thiserror` supports opaque public wrappers and causal chains, but redaction still depends on selected fields ([research](../research/boundaries/2026-07-24-thiserror.md)).

## Minimal typestate pattern

```rust
pub struct NoVisibleOutput(());

impl NoVisibleOutput {
    fn after_preflight(trace: &TurnTrace) -> Option<Self> {
        (!trace.visible_output && !trace.tool_call).then_some(Self(()))
    }
}

pub fn authorize_replay(proof: NoVisibleOutput) -> ReplayAuthorized {
    let _consumed = proof;
    ReplayAuthorized
}
```

Keep constructors private to the state-owning crate. Persist the underlying facts and rebuild proof only through the validated transition path.

## Architecture test ideas

- Compile-fail tests for private marker construction.
- Feature-matrix builds proving core crates do not acquire provider/TUI dependencies.
- Public API inspection confirming no harness/provider SDK types cross inward.
- `forbid(unsafe_code)` at crate roots where dependencies allow it; otherwise maintain an explicit inventory.

## Worked examples

See [visible-output cancellation](../examples/02-edge-visible-output-cancellation.md) and [concurrent budget reservation](../examples/03-edge-concurrent-budget-reservation.md).
