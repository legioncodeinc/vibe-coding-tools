# Current Rust research

This directory records the Queen forge research refresh for `rust-stinger`.

## Topic lock

- Component type: development-focused Stinger paired with `rust-worker-bee`.
- Domain: production Rust development and review across Cargo workspaces, async services, persistence, CLI/TUI code, tests, dependency hygiene, and release evidence.
- Current-information duty: identify the current stable Rust release, security-driven minimums, compatibility notes, and Cargo/rustup changes without turning a dated snapshot into a timeless default.
- Harness reach: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork through the portable Agent Skills format and generated harness trees.
- Research window: 2026-03-03 through 2026-09-03.
- Source policy: Rust Project primary sources plus first-party upstream maintainer sources for tools such as cargo-nextest. The earlier 2026-07-24 domain packet remains under `../../research/` as a legacy evidence corpus.

## Layout

- `raw/` contains one dated source note per official source.
- `distilled-rust-current.md` is the claim-by-claim synthesis used by current-release guidance.

The current release number is a dated observation. Re-fetch the official release index and security blog before recommending a pin, changing an MSRV, or approving a release.
