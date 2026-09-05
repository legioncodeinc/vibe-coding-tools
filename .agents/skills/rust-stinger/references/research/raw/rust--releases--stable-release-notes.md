# Rust release notes
- URL: https://doc.rust-lang.org/stable/releases.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Moving-source snapshot: stable docs banner `Rust 1.98.1`, docs commit `48a229ceaefd4985c50990b14116b6d856af0985`, fetched 2026-09-03
- Release headings in the bounded window: `1.94.0` (2026-03-05), `1.94.1` (2026-03-26), `1.95.0` (2026-04-16), `1.96.0` (2026-05-28), `1.96.1` (2026-06-30), `1.97.0` (2026-07-09), `1.97.1` (2026-07-16), `1.98.0` (2026-08-20), `1.98.1` (2026-09-03)
- Rust 1.94.1 field: Cargo updated `tar` to 0.4.45, resolving CVE-2026-33055 and CVE-2026-33056
- Rust 1.96.0 field: Cargo fixed CVE-2026-5222 and CVE-2026-5223
- Cargo 1.97 fields: `build.warnings`, `resolver.lockfile-path`, guarded `cargo clean --target-dir`
- Rustdoc 1.97 fields: stabilized `--emit` and `--remap-path-prefix`
- Rust 1.96.1 fields: Cargo timeout and retry fix, libssh2 CVE patches, rustc MIR miscompilation fix
- Rust 1.98.0 fields: `invalid_runtime_symbol_definitions`, `suspicious_runtime_symbol_definitions`, `c_void_returns`, stricter `repr(transparent)` handling, corrected `transmute` size checks, consistent `unsafe_code` lint coverage, and `cfg_select!` module discovery in rustfmt
- Rust 1.98.1 field: rustc vtable-generation miscompilation fix

## Archived facts

- The stable documentation identified itself as Rust 1.98.1 on the fetch date.
- The six-month window contains releases 1.94.0 through 1.98.1, including patch releases 1.94.1, 1.96.1, 1.97.1, and 1.98.1.
- Rust 1.95.0 was published on 2026-04-16.
- Cargo 1.97 stabilized `build.warnings` and `resolver.lockfile-path` configuration.
- Rust 1.97 switched default symbol mangling to v0, which can affect older debuggers, profilers, and backtrace presentation.
- Rust 1.97 also stabilized rustdoc `--emit` and `--remap-path-prefix` support.
- Rust 1.97.1 fixed an LLVM-related compiler miscompilation.
- Rust 1.96.1 included Cargo retry fixes, libssh2 vulnerability patches, and a rustc MIR miscompilation fix.
- Rust 1.98.0 includes compatibility changes for layout, imports, FFI-adjacent lints, formatting coverage, and unsafe attributes.

## Stinger relevance

Use the complete release notes for a from-version-to-version review. A headline blog post is not a substitute for reviewing intervening compiler, Cargo, Clippy, rustdoc, platform, and compatibility sections.

## Refresh caveat

The page follows the latest stable toolchain. Record the fetch date and exact versions in any generated upgrade report.
