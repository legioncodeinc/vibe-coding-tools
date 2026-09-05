# Cargo dependency resolution
- URL: https://doc.rust-lang.org/cargo/reference/resolver.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Stable-source snapshot: Cargo commit `797e8a9bca276c1c9f9f738d2a20f484fa4eea9d` bundled with Rust 1.98.1, source blob `26530990f4fe21015d44db5cbb261efcf4fd647c`
- Resolver field: `"3"`
- Edition default: Rust 2024
- Toolchain requirement: Rust 1.84 or newer
- Incompatible-Rust-version default: `fallback`
- Scope field: the top-level package or virtual workspace controls the resolver for the whole workspace
- Lock enforcement flags: `--locked`, `--frozen`
- Fallback behavior field: prefer a dependency compatible with the declared Rust version; select an incompatible version if no compatible release satisfies the requirement

## Archived facts

- Resolver version 3 is the Rust 2024 edition default and requires Rust 1.84 or newer.
- Resolver version is a top-level workspace setting. Dependency manifests cannot override it.
- A virtual workspace should declare its resolver explicitly in the `[workspace]` table.
- With incompatible Rust versions set to `fallback`, Cargo prefers compatible dependency releases.
- If no compatible release matches the dependency requirement, Cargo may still select an incompatible release.
- `--locked` and `--frozen` prevent commands from silently rewriting the existing lock resolution.

## Stinger relevance

Resolver v3 improves MSRV-aware selection but does not replace an MSRV CI lane. Inspect the resolved graph under the declared minimum toolchain and every supported feature set.
