# Current Rust release and upgrade reference

Load this reference when a task asks for the newest Rust information, proposes a toolchain change, sets an MSRV, or interprets a compiler/Cargo security notice.

## Snapshot

Verified on 2026-09-03 from official Rust project sources:

| Surface | Current observation | Engineering consequence |
|---|---|---|
| Stable compiler | Rust 1.98.1 | Do not leave a production pin on 1.98.0. The patch fixes a compiler miscompilation that could produce undefined behavior. |
| rustup | rustup 1.29.1 | Install required toolchains and components explicitly. Do not rely on unrelated commands to provision them implicitly. |
| Edition | Rust 2024 is the current edition | In a virtual workspace, declare `resolver = "3"` explicitly. |
| Cargo warning policy | `build.warnings` is stable from Cargo 1.97 | Use it only if the project's toolchain floor supports it and a workspace-wide local warning policy is intended. |
| Third-party registry security | Cargo from Rust 1.96 or newer addresses CVE-2026-5222 and CVE-2026-5223 | Treat this as a toolchain floor for affected registry workflows, separate from the crate's MSRV. |

All values are dated observations, not permanent defaults. Source-by-source support is in `research/distilled-rust-current.md`.

## Six-month release ledger

| Release | Date | Review focus | Sources |
|---|---:|---|---|
| 1.94.0 | 2026-03-05 | Start of this research window. Review normal language, library, Cargo, Clippy, rustdoc, and compatibility sections. | [release index](research/raw/rust--releases--release-index.md) |
| 1.94.1 | 2026-03-26 | Cargo archive extraction security patch and other fixes. | [release index](research/raw/rust--releases--release-index.md), [CVE-2026-33056](research/raw/rust--cargo-security--cve-2026-33056.md) |
| 1.95.0 | 2026-04-16 | Normal stable release. Read the complete release notes for affected code. | [release index](research/raw/rust--releases--release-index.md), [stable notes](research/raw/rust--releases--stable-release-notes.md) |
| 1.96.0 | 2026-05-28 | Cargo fixes for authenticated sparse registries and third-party registry archives. | [release index](research/raw/rust--releases--release-index.md), [CVE-2026-5222](research/raw/rust--cargo-security--cve-2026-5222.md), [CVE-2026-5223](research/raw/rust--cargo-security--cve-2026-5223.md) |
| 1.96.1 | 2026-06-30 | Cargo retry fixes, libssh2 vulnerability patches, and a compiler MIR miscompilation fix. | [release index](research/raw/rust--releases--release-index.md), [stable notes](research/raw/rust--releases--stable-release-notes.md) |
| 1.97.0 | 2026-07-09 | `build.warnings`, `resolver.lockfile-path`, rustdoc output changes, v0 symbol mangling, and compatibility changes. | [release index](research/raw/rust--releases--release-index.md), [stable notes](research/raw/rust--releases--stable-release-notes.md) |
| 1.97.1 | 2026-07-16 | Compiler miscompilation fix. | [release index](research/raw/rust--releases--release-index.md), [stable notes](research/raw/rust--releases--stable-release-notes.md) |
| 1.98.0 | 2026-08-20 | New APIs, float optimization controls, FFI-adjacent lints, layout and import compatibility changes. | [1.98.0 announcement](research/raw/rust--releases--rust-1-98-0.md) |
| 1.98.1 | 2026-09-03 | Compiler vtable miscompilation fix for 1.98.0. | [1.98.1 announcement](research/raw/rust--releases--rust-1-98-1.md) |

The ledger is an index, not an upgrade assessment. Follow the linked official release notes in the research archive and inspect every intervening section relevant to the project.

## Version fields that must stay separate

| Field | Meaning | Proof |
|---|---|---|
| Developer toolchain | What contributors use locally | `rustc -Vv`, `cargo -V`, `rustup show active-toolchain` |
| CI build pin | What builds and tests the main branch | workflow plus job transcript |
| Release toolchain | What produced distributed artifacts | artifact manifest plus `rustc -Vv` |
| `package.rust-version` | Minimum compiler the package promises to support | dedicated CI lane across advertised features and targets |
| Edition | Language migration boundary per package | each manifest and `cargo fix --edition` evidence when migrating |
| Resolver | Workspace dependency selection behavior | top-level workspace manifest and locked graph |

Never replace this table with a single statement such as "the project uses Rust 1.98.1." That sentence hides compatibility and reproducibility boundaries.

## Upgrade procedure

1. Capture `rustc -Vv`, `cargo -V`, `rustup -V`, the active toolchain, every `rust-toolchain*` file, manifest edition/MSRV/resolver fields, and the current `Cargo.lock` hash.
2. Identify the exact from and to versions. Open the official release notes for every intervening version and build a project-specific impact list.
3. Search the Rust security blog and RustSec data at the decision point. A compiler or Cargo security fix can raise the operational build floor without changing a published library's MSRV.
4. Change one toolchain boundary at a time. Do not combine an edition migration, resolver change, dependency refresh, and compiler upgrade unless the acceptance criteria explicitly require that combined blast radius.
5. Run format, check, Clippy, tests, doctests, feature combinations, target builds, examples, benchmarks, and any FFI/layout/golden-output tests affected by compatibility notes.
6. Run the declared minimum-toolchain lane separately. Resolver v3's fallback preference is not proof that every resolved dependency supports the MSRV.
7. Rebuild release artifacts made by a compiler named in a miscompilation advisory. Record old and new artifact hashes and the exact patched compiler.
8. Pass dependency findings to `dependency-audit-worker-bee`, security implications to `security-worker-bee`, CI topology to `ci-release-worker-bee`, and final plan conformance to `quality-worker-bee`.

If the request is an upstream `rust-lang/rust` contribution made with AI assistance, also load `UPSTREAM-RUST-LLM-POLICY.md`. If the request asks what may land next, load `NIGHTLY-WATCHLIST.md` and keep every item explicitly experimental.

## Stable configuration example

For a repository whose tested minimum Cargo version is 1.97 or newer and whose policy is to fail on all adjustable local-package warnings:

```toml
# .cargo/config.toml
[build]
warnings = "deny"
```

Do not add this to a crate that promises an older Cargo toolchain without testing how that toolchain handles the setting. Keep targeted lint policy in manifest lint tables where broad warning denial would hide intentional distinctions.

## Security response split

- Compiler miscompilation: upgrade the build toolchain, rebuild affected artifacts, rerun semantic tests, and preserve provenance showing which compiler produced each binary.
- Cargo acquisition vulnerability: upgrade Cargo or constrain and audit the registry workflow. This affects how source is fetched even if the code could compile on an older rustc.
- Malicious crate incident: inspect the resolved dependency graph, Cargo caches, build-script execution, artifacts, and build hosts. As a derived incident-response step, rotate credentials or rebuild hosts only when the actual exposure analysis requires it.
- RustSec advisory: record advisory database time and lockfile/artifact hash, then route risk acceptance to the dependency and security owners.

## Sources

Every claim above is distilled in `research/distilled-rust-current.md`, which cites the individual files in `research/raw/`.
