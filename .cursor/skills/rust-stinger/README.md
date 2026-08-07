# Rust Stinger

Rust Stinger equips `rust-worker-bee` to implement and review production Cargo workspaces, async services, durable local state, operator surfaces, tests, and release evidence. It operationalizes the approved Command Brief while preserving protocol, Security, dependency, release, and Quality peer ownership. Its technical rules are traceable to [`research/research-summary.md`](research/research-summary.md) and the underlying primary-source notes.

## Layout

- `SKILL.md` — trigger, procedure, directives, outputs, and decision boundaries.
- `guides/` — numbered procedures matching every Command Brief action.
- `examples/` — worked happy-path and failure-boundary handoffs.
- `templates/` — reusable implementation, decision, and release-evidence stubs.
- `reports/` — report-shape template and future run archive.
- `research/` — immutable scripture-historian evidence packet.

## Maintenance

Update the research packet before changing version-sensitive guidance. The current packet marks Rust/Cargo, Tokio, SQLx, rustls, cargo-dist, platform support, and RustSec as explicit revalidation points; current-at-retrieval values are evidence snapshots, not defaults.
