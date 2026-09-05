# Cargo build warnings configuration
- URL: https://doc.rust-lang.org/cargo/reference/config.html#buildwarnings
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Stable-source snapshot: Cargo commit `797e8a9bca276c1c9f9f738d2a20f484fa4eea9d` bundled with Rust 1.98.1, source blob `2a2f94376b831ca405a1150b1f15eaab7c563446`
- Deployed page last modified: 2026-09-03T12:57:23Z
- Field: `build.warnings`
- Type: string
- Default: `"warn"`
- Environment: `CARGO_BUILD_WARNINGS`
- Allowed values: `warn`, `allow`, `deny`
- MSRV marker: respected as of Cargo 1.97
- Source-backed configuration:

```toml
[build]
warnings = "deny"
```

## Archived facts

- Cargo 1.97 and newer respect `build.warnings` in Cargo configuration.
- Allowed values are `warn`, `allow`, and `deny`; the default is `warn`.
- `deny` makes adjustable lint warnings from local packages fail the build.
- Non-lint warnings and dependency warnings have separate display behavior and are not all converted into errors by this setting.
- The environment equivalent is `CARGO_BUILD_WARNINGS`.

## Stinger relevance

`build.warnings = "deny"` can centralize a warning-free local-package policy on a Rust 1.97 or newer toolchain. It is not a drop-in replacement when the declared MSRV is older or when a project intentionally treats selected lints differently.
