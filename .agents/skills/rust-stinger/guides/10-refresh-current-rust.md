# 10 - Refresh current Rust guidance

## Purpose

Answer "what is current?" without confusing a dated release snapshot with a project decision. Use this guide for toolchain upgrades, edition/resolver review, MSRV policy, new compiler or Cargo behavior, and Rust security notices.

## Procedure

1. Read `../references/research/distilled-rust-current.md` and `../references/CURRENT-RUST.md`.
2. Re-fetch the Rust release index and complete stable release notes. Record the date, current stable patch, and every release between the project's pin and the proposed pin.
3. Capture the repository's actual version boundaries with `rustc -Vv`, `cargo -V`, `rustup -V`, `rustup show active-toolchain`, manifests, `rust-toolchain*`, Cargo config, lockfile, workflows, and release manifests.
4. Resolve `scripts/inspect-rust-workspace.py` relative to this loaded Stinger's `SKILL.md`, then run `python <resolved-script-path> <repository>` to produce a deterministic first-pass inventory. Treat it as discovery, not proof of semantic correctness.
5. Separate required security upgrades from optional language/library features. If a Cargo acquisition vulnerability affects the configured registry, record the patched Cargo floor independently from the crate's MSRV.
6. Build an impact ledger for language, compiler, standard library, Cargo, Clippy, rustdoc, platform, and compatibility changes. Include FFI, layout, debugger/profiler, golden-output, and artifact-rebuild effects where applicable.
7. Patch the smallest version boundary first and run the verification ladder in `08-verify-and-package-evidence.md` plus project-specific target, feature, FFI, migration, and packaging proofs.
8. Test the declared MSRV independently. Do not let the current stable compiler or resolver fallback stand in for a minimum-toolchain lane.
9. Update current-version documentation with a snapshot date and source link. Never write an unqualified "latest" claim into long-lived guidance.
10. Route dependency/advisory disposition, security acceptance, CI topology, and final Quality to their owning Bees.

## Current snapshot

On 2026-09-03, official Rust sources identify 1.98.1 as stable. It supersedes 1.98.0 with a compiler miscompilation fix. This sentence expires as soon as the official release index changes; the procedure above does not.

## Evidence to return

- from version, to version, and source/fetch date;
- toolchain, Cargo, edition, resolver, and MSRV inventory;
- intervening release-note impact ledger;
- security notices and affected workflow analysis;
- exact commands and results for current and minimum toolchains;
- rebuilt artifact hashes where a compiler advisory applies;
- unresolved platform, dependency, security, CI, or release decisions.

## Sources

- Current release and compiler fix: `../references/research/raw/rust--releases--rust-1-98-1.md`.
- Intervening release inventory: `../references/research/raw/rust--releases--stable-release-notes.md`.
- MSRV contract: `../references/research/raw/rust--cargo--rust-version.md`.
- Resolver behavior: `../references/research/raw/rust--cargo--dependency-resolver.md`.
- Recent Cargo and supply-chain security notices: `../references/research/distilled-rust-current.md`.
