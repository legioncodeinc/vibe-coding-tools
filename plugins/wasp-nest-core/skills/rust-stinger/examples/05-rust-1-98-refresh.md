# Example: refresh a Rust 1.97.1 workspace to 1.98.1

This is an evidence pattern, not a universal instruction to upgrade every project.

## Request

The workspace pins Rust 1.97.1. A maintainer asks whether it should move to the newest stable Rust and wants a reviewable upgrade.

## Authority and boundaries

- Allowed: edit the toolchain pin, adjust code required by compiler/Cargo compatibility changes, and update version-specific docs.
- Not allowed: change the declared MSRV, migrate editions, refresh all dependencies, sign artifacts, or publish a release.
- Current source check: official Rust release sources fetched on 2026-09-03 identify 1.98.1 as stable and 1.98.0 as affected by a vtable miscompilation. See [`CURRENT-RUST.md`](../references/CURRENT-RUST.md) and the [1.98.1 source note](../references/research/raw/rust--releases--rust-1-98-1.md).

## Baseline capture

```text
rustc -Vv
cargo -V
rustup -V
rustup show active-toolchain
cargo metadata --format-version 1 --locked
```

Record the `Cargo.lock` hash and run the repository's existing checks before editing. If the baseline fails, separate that failure from the toolchain change.

## Impact ledger

| Surface | Finding | Required proof |
|---|---|---|
| Compiler patch | 1.98.1 fixes a miscompilation introduced in 1.98.0. [source](../references/research/raw/rust--releases--rust-1-98-1.md) | Confirm no artifacts remain attributed only to 1.98.0; rebuild distributed binaries if any exist. |
| FFI/runtime symbols | 1.98 adds lints around runtime symbol definitions and `c_void` returns. [source](../references/research/raw/rust--releases--rust-1-98-0.md) | Run full check and Clippy; review any custom symbols or FFI crates directly. |
| Layout | 1.98 tightens some `repr(transparent)` and transmute checks. [source](../references/research/raw/rust--releases--stable-release-notes.md) | Run compile tests and any ABI/layout assertions. |
| Diagnostics/tooling | Recent releases changed symbol mangling and escaped display in some outputs. [source](../references/research/raw/rust--releases--stable-release-notes.md) | Verify debugger/profiler symbol handling and intentional golden snapshots. |
| Numeric code | New algebraic floating-point methods permit reassociation. [source](../references/research/raw/rust--releases--rust-1-98-0.md) | Do not adopt them inside this upgrade unless a separate numeric-accuracy contract authorizes it. |

## Small patch

Change only the pinned channel:

```toml
# rust-toolchain.toml
[toolchain]
channel = "1.98.1"
profile = "minimal"
components = ["clippy", "rustfmt"]
```

Do not also change `package.rust-version`. That field is a user-facing compatibility promise and needs its own evidence.

## Verification

```text
cargo fmt --all -- --check
cargo check --workspace --all-targets --locked
cargo clippy --workspace --all-targets --all-features --locked -- -D warnings
cargo test --workspace --locked
cargo test --workspace --doc --locked
cargo metadata --format-version 1 --locked
cargo tree --workspace -e features --locked
```

Add every target and feature combination the project promises. Run the existing MSRV lane on its original compiler. If release binaries were ever built with 1.98.0, rebuild them on 1.98.1 and record replacement hashes.

## Handoff outcome

- VERIFIED: workspace passes its declared checks on 1.98.1.
- VERIFIED: existing MSRV lane still passes without changing the declared support floor.
- VERIFIED or NOT APPLICABLE: no surviving release artifact was built only with affected 1.98.0.
- OPEN: platform-specific smoke tests not run locally.
- EXTERNAL: signing and publication remain closed.

The final handoff includes the official source URLs and 2026-09-03 fetch date so the reader can tell when the "current" claim was true.
