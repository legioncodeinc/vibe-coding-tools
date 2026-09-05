# Current Rust development distillation

Research window: 2026-03-03 through 2026-09-03. Snapshot date: 2026-09-03. This article supplements the legacy 2026-07-24 packet under `../../research/` and controls current-version claims.

## Release baseline

| Decision area | Distilled finding |
|---|---|
| Current stable | Rust 1.98.1 is the current stable patch on 2026-09-03. It fixes a vtable-generation miscompilation introduced in 1.98.0 that could produce undefined behavior, so 1.98.0 should not remain a recommended build pin. [raw/rust--releases--rust-1-98-1.md] |
| Upgrade review | A safe upgrade review reads every intervening release's language, compiler, library, Cargo, Clippy, rustdoc, platform, and compatibility notes. The current six-month window runs from 1.94.0 through 1.98.1. [raw/rust--releases--stable-release-notes.md] |
| Rust 1.98 features | Rust 1.98.0 added algebraic float operations, buffered integer formatting, new FFI-adjacent lints, and several compatibility changes. Algebraic float operations permit result-changing reassociation and should not be introduced into reproducibility-sensitive paths without an explicit numeric contract. [raw/rust--releases--rust-1-98-0.md] [raw/rust--releases--stable-release-notes.md] |
| Toolchain manager | rustup 1.29.1 improves concurrent update/component work and warns about unnecessary implicit toolchain installation. Bootstrap and CI should install toolchains and components explicitly and record rustup separately from rustc. [raw/rust--toolchain--rustup-1-29-1.md] |

## Compatibility and MSRV

- `package.rust-version` is a declared support contract, not a measurement. Verify it across all supported targets, features, examples, tests, and benchmarks, and keep it distinct from the current build pin. [raw/rust--cargo--rust-version.md]
- Resolver v3 is the Rust 2024 edition default, but virtual workspaces must set it explicitly. Its fallback policy can still select an incompatible dependency when no compatible version satisfies the requirement, so a minimum-toolchain CI lane remains mandatory for an MSRV claim. [raw/rust--cargo--dependency-resolver.md]
- Cargo 1.97 stabilizes `build.warnings`. It can replace a blanket command-line `-D warnings` policy for local packages only when the project's toolchain floor supports it and its lint policy really is uniform. [raw/rust--cargo--build-warnings.md]
- Rust 1.97's v0 symbol-mangling default can change debugger, profiler, and backtrace output. Toolchain upgrades should include operator-tool and symbol-processing verification, not only compilation. [raw/rust--releases--stable-release-notes.md]

## Security-driven floors and incident response

| Scenario | Minimum or response |
|---|---|
| Authenticated third-party sparse registries | Use Cargo from Rust 1.96 or newer because earlier affected versions can leak registry credentials through incorrect `.git` URL normalization. This is a Cargo acquisition floor for that scenario, not the library's compiled-code MSRV. [raw/rust--cargo-security--cve-2026-5222.md] [raw/rust--releases--stable-release-notes.md] |
| Third-party registry crate archives | Use Cargo from Rust 1.96 or newer because earlier versions can let malicious symlinks overwrite another cached crate. crates.io blocked such archives, but alternate registries need their own assurance. [raw/rust--cargo-security--cve-2026-5223.md] [raw/rust--releases--stable-release-notes.md] |
| Alternate registries on older Cargo | Rust 1.94.1 patched Cargo's vulnerable archive dependency for CVE-2026-33056. Server-side crates.io mitigation did not make old alternate-registry clients safe. [raw/rust--cargo-security--cve-2026-33056.md] [raw/rust--releases--stable-release-notes.md] |
| Disclosed malicious crate | As a derived response policy, inspect lockfiles, resolved graphs, Cargo caches, build scripts, fetched artifacts, and build hosts. The 2026 arrayref incident demonstrated that short-lived compromised releases and malicious build scripts can require response beyond a dependency bump. [raw/rust--supply-chain--arrayref-incident.md] |

## Durable operating rules

1. Re-fetch `https://blog.rust-lang.org/releases/` before naming a current version. A number in this file is historical evidence after the snapshot date. [raw/rust--releases--release-index.md]
2. Pin the build toolchain deliberately, declare MSRV separately, and test both. A current-stable pin does not prove compatibility and an MSRV declaration does not prove the current release is safe. [raw/rust--cargo--rust-version.md]
3. Treat compiler point releases that fix miscompilation as rebuild triggers for artifacts produced by the affected compiler. The exact affected versions and remediation come from the release advisory, not from a generic patch policy. [raw/rust--releases--rust-1-98-1.md]
4. Use locked dependency resolution in verification, but investigate supply-chain incidents across caches and build hosts because a lockfile cannot prove that a build script never executed. [raw/rust--supply-chain--arrayref-incident.md]
5. Keep edition, resolver, package MSRV, CI toolchain, and release toolchain as separately reviewable fields. Cargo's resolver heuristics do not collapse them into one value. [raw/rust--cargo--dependency-resolver.md]

## AI-assisted upstream Rust contributions

- The Rust Forge LLM policy is scoped to `rust-lang/rust` and specific ratifying teams. It must not be presented as a Rust-ecosystem-wide rule. [raw/rust--project-policy--llm-usage.md]
- Within that scope, private analysis and review are broadly allowed, while LLM-created public comments, pull request descriptions, diagnostics, and non-trivial documentation are generally prohibited. The conditional code experiment normally requires disclosure, pre-arranged human review, non-critical scope, tests, quality, and human understanding; the policy states limited non-critical-clause exceptions for `rust-lang` organization members and pre-policy pull requests. [raw/rust--project-policy--llm-usage.md]
- The rustc contributor guide requires authors to personally write safety comments and soundness-critical code, prove regression tests fail before and pass after, and understand the invariants and edge cases of the change. [raw/rust--compiler-guide--llm-writing.md]
- LLM review is advisory. Prefer deterministic tools where available, avoid a same-model-only review loop, and verify each proposed finding before a human endorses it. [raw/rust--compiler-guide--llm-reviewing.md]

## Nightly and tooling watchlist

- Polonius Alpha and the next-generation trait solver became nightly defaults during August 2026, but neither is general Rust 1.98 stable behavior. Test them only in exact-date nightly canaries with stable comparison lanes and documented opt-outs. [raw/rust--nightly--polonius-alpha.md] [raw/rust--nightly--next-trait-solver.md]
- Clippy 1.98 adds and moves lints, including async coverage changes. A warnings-as-errors project must run Clippy on the proposed compiler and record the exact toolchain rather than assuming a compiler-only upgrade is lint-neutral. [raw/rust--linting--clippy-1-98.md]
- cargo-nextest 0.9.143 contains fixes for Cargo build-layout and dynamic-library behavior that matter to archives, cross-target tests, and nightly canaries. It is a tool update candidate, not an automatic version mandate. [raw/rust--testing--cargo-nextest-0-9-143.md]
- Cargo's living nightly changelog contained future-dated release sections at the cutoff. Treat those entries as provisional until the matching stable release and stable documentation confirm them. [raw/rust--cargo--nightly-changelog.md]
- Cargo `-Z` features are nightly experiments. This Stinger adds the derived reproducibility requirement to pin the exact nightly date and retain a stable comparison, fallback, and removal condition. [raw/rust--cargo--unstable-features.md]

## Research limits

- This refresh does not choose a universal MSRV, async runtime version, database policy, target tier, signing system, or release cadence. Those remain project decisions backed by the resolved dependency graph and product support promise. [raw/rust--cargo--rust-version.md]
- Nightly-only work announced during the window was excluded from stable recommendations. A task that explicitly targets nightly must run a separate current research pass and pin the exact nightly date. [raw/rust--releases--stable-release-notes.md]
- The Clippy source used for 1.98 is a moving `master` snapshot because the fetched release-tag changelog lagged. Preserve that source discrepancy and re-check the immutable release state before making a long-lived lint claim. [raw/rust--linting--clippy-1-98.md]
