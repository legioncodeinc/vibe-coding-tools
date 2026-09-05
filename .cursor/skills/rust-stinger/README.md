# Rust Stinger

Rust Stinger equips `rust-worker-bee` to implement and review production Cargo workspaces, async services, durable local state, operator surfaces, tests, upgrades, and release evidence. It preserves protocol, Security, dependency, release, and Quality peer ownership. Current claims trace to [`references/research/distilled-rust-current.md`](references/research/distilled-rust-current.md); the broader original corpus remains indexed by [`research/research-summary.md`](research/research-summary.md).

## Layout

- `TOPIC.md` - locked domain, exclusions, harness targets, research window, and required forge outcomes.
- `SKILL.md` - trigger, procedure, directives, outputs, and decision boundaries.
- `guides/` - numbered procedures matching every Command Brief action.
- `examples/` - worked happy-path and failure-boundary handoffs.
- `templates/` - reusable implementation, decision, and release-evidence stubs.
- `reports/` - reusable report-shape templates only; actual runs belong in the target repository's root `library/` hierarchy.
- `references/` - current release, nightly, upstream AI-policy, and claim-level research references built with the Queen forge structure.
- `scripts/inspect-rust-workspace.py` - deterministic static inventory for Cargo/version/unsafe discovery.
- `research/` - legacy 2026-07-24 evidence packet retained for its deep architecture coverage.

## Maintenance

Update the Queen research archive before changing version-sensitive guidance. The current refresh covers 2026-03-03 through 2026-09-03 and records Rust 1.98.1 as a dated snapshot. Rust/Cargo, Tokio, SQLx, rustls, cargo-dist, platform support, RustSec, nightly experiments, and upstream contribution policy remain explicit revalidation points; retrieval-time values are evidence, not defaults.
