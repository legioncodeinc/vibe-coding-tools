# Announcing rustup 1.29.1
- URL: https://blog.rust-lang.org/2026/09/01/Rustup-1.29.1/
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Published: 2026-09-01
- Release tag: `1.29.1` at `3b0a80f56f91d9c1f102d431d853de9fac3fc444`
- Concurrency fields: parallel update checks; concurrent installation when adding multiple components
- Deprecation field: unnecessary implicit installation of the active toolchain now warns
- Command field: `rustup doc --serve`
- Compatibility field: `i686-pc-windows-*` host installations on 64-bit Windows require `--force-non-host`
- New host field: `aarch64-pc-windows-gnullvm`
- Update commands recorded by the source: `rustup self update` and `rustup update`

## Archived facts

- The Rustup Team published rustup 1.29.1 on 2026-09-01.
- Update checks and multi-component installs gained more concurrency.
- Unnecessary implicit installation of an active toolchain is deprecated and now warns. Explicit `rustup install` is the documented direction.
- `rustup doc --serve` can serve installed documentation over local HTTP.
- Installing 32-bit Windows host toolchains on a 64-bit Windows host now requires `--force-non-host`.
- The release added official host support for `aarch64-pc-windows-gnullvm` and fixed cleanup and Windows installation issues.

## Stinger relevance

Bootstrap and CI instructions should install required toolchains and components explicitly. Do not rely on an unrelated rustup command to provision a missing toolchain as a side effect.

## Refresh caveat

Rustup and Rust compiler versions advance independently. Capture both in reproducibility evidence.
