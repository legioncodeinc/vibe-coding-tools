# Enabling the next iteration of the borrow checker on nightly
- URL: https://blog.rust-lang.org/2026/08/04/enabling-polonius-alpha-on-nightly/
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Published: 2026-08-04
- Channel and state: enabled on nightly for testing; stable NLL remains available through the opt-out
- Capability field: flow-sensitive borrow checking of lifetime outlives relationships
- Feedback areas named by the source: performance regressions, unsoundness, and diagnostics
- Documented opt-out configuration:

```toml
[target.x86_64-unknown-linux-gnu]
rustflags = ["-Zpolonius=off"]
```

## Archived facts

- Polonius Alpha became the default borrow checker on the nightly channel for testing in August 2026.
- The Alpha work adds flow-sensitive analysis of lifetime outlives relationships and accepts some sound programs rejected by the current stable checker.
- The rollout requested feedback on performance, soundness, and diagnostics.
- The documented opt-out is `-Zpolonius=off`.
- The feature was not stable on the fetch date.

## Stinger relevance

Use a separately pinned nightly canary if the project wants advance compatibility evidence. Do not teach Polonius Alpha behavior as Rust 1.98 stable behavior.
