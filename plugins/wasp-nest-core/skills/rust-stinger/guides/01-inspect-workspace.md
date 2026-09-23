# 01 - Inspect the Rust workspace

## Purpose

Inventory the current workspace before changing it. This guide covers Command Brief action 2.

## Inventory commands

Run only commands supported by the repository, and record unavailable tools as blockers rather than installing them implicitly.

```bash
git status --short --branch
cargo metadata --format-version 1 --no-deps
cargo tree --workspace -e features
cargo tree --workspace -e normal,build,dev
cargo test --workspace --no-run
```

Also inspect `Cargo.toml`, `Cargo.lock`, `rust-toolchain*`, `.cargo/config*`, `build.rs`, migrations, release profiles, `deny.toml`, nextest configuration, and CI/release manifests.

## Inspection checklist

- Draw the crate dependency direction and identify public type owners.
- Record workspace edition, resolver, toolchain pin, declared `rust-version`, default features, optional providers/TUI, targets, and binary entry points.
- Find all `unsafe`, panic/unwrap/expect paths in daemon/adapter/state/migration boundaries, global mutable state, spawned tasks, channels, `select!`, retries, time access, raw SQL, logging macros, secret exposure, TLS customization, and migrations.
- Locate every task owner and shutdown join path; Axum listener shutdown does not join arbitrary background tasks ([research](../research/async/2026-07-24-axum-graceful-shutdown.md)).
- Locate every bounded and unbounded queue; bounded Tokio MPSC expresses backpressure while unbounded channels do not encode a memory limit ([research](../research/async/2026-07-24-tokio-mpsc.md)).
- Verify effective SQLite journal, synchronous, foreign-key, busy-timeout, and checkpoint policy; SQLx does not select a journal mode by default ([research](../research/persistence/2026-07-24-sqlx-connect-options.md)).
- Separate current stable from declared MSRV. Cargo's `rust-version` participates in resolution but still needs CI proof across advertised features ([research](../research/rust-cargo/2026-07-24-cargo-rust-version.md)).
- Treat compiler target tiers as compiler guarantees, not product install/runtime proof ([research](../research/rust-cargo/2026-07-24-platform-support.md)).

## Revalidation record

Create or update `templates/rust-decision-log.md` for values likely to drift: toolchain, MSRV, target matrix, Tokio line, SQLx API, rustls stable API, package generator, and advisory snapshot. Do not copy current-at-retrieval numbers from research without rechecking.

## Worked examples

See [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md) and [release evidence with closed gates](../examples/04-release-evidence-with-closed-gates.md).
