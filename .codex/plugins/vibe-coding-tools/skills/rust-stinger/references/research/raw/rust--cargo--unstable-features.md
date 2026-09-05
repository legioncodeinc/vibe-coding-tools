# Cargo unstable features
- URL: https://doc.rust-lang.org/cargo/reference/unstable.html
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Stable-source snapshot: Cargo commit `797e8a9bca276c1c9f9f738d2a20f484fa4eea9d` bundled with Rust 1.98.1, source blob `06eaf2943f221a2d35c24cb731f558fcf800f363`
- Short source excerpt: "Experimental Cargo features are only available on the nightly channel."
- Activation forms listed by the source: `cargo-features`, `-Z unstable-options`, feature-specific `-Z` flags, and the `[unstable]` configuration table
- Source command fragment:

```text
cargo +nightly build --artifact-dir=out -Z unstable-options
```

- Source configuration fragment:

```toml
[unstable]
mtime-on-use = true
build-std = ["core", "alloc"]
```

- Stable behavior varies by feature: the source says `hint-msrv` is silently ignored by stable Cargo, while other feature documentation can specify different handling.

## Archived facts

- Cargo unstable features are documented for the nightly channel and are activated with `-Z` flags or matching unstable configuration.
- Individual experimental features can change or disappear before stabilization.
- Stable Cargo may silently ignore an unstable setting or warn about it, depending on the feature's documented compatibility behavior.

## Stinger relevance

A production experiment must name the exact nightly toolchain, feature flag, stable comparison lane, fallback, and removal condition. This operating rule is a derived reproducibility policy based on the official nightly-only contract.
