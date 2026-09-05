# Rust version field
- URL: https://doc.rust-lang.org/stable/cargo/reference/rust-version.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Stable-source snapshot: Cargo commit `797e8a9bca276c1c9f9f738d2a20f484fa4eea9d` bundled with Rust 1.98.1, source blob `b1d7167da716660335fe42e34c6efdcc9cee470c`
- Deployed page last modified: 2026-09-03T12:57:23Z
- Field: `package.rust-version`
- MSRV marker: respected as of Cargo 1.56
- Override flag: `--ignore-rust-version`
- Affected target fields: binaries, examples, test suites, and benchmarks
- Tool consumers named by the source: Cargo diagnostics, `cargo add`, the resolver, and Clippy's `incompatible_msrv` lint
- Source configuration fragment:

```toml
[package]
rust-version = "1.56"
```

## Archived facts

- `package.rust-version` declares the minimum Rust toolchain a package claims to support.
- Cargo uses the field for clearer unsupported-toolchain diagnostics and can consider it when adding or resolving dependencies.
- The support expectation covers all advertised functionality, including binaries, examples, tests, and benchmarks under supported features.
- A declared value should be verified in automated testing; the field is not proof by itself.
- Workspaces with different member MSRVs can force lowest-common shared dependency versions and let one member's policy affect another member's resolution.
- Cargo documents compatibility policies such as an N-release window, but each project must choose and state its own policy.

## Stinger relevance

Separate the build toolchain used today, the declared MSRV, and the tested compatibility policy. Do not infer one from another.
