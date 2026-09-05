# Updating Tauri Dependencies
- URL: https://v2.tauri.app/develop/updating-dependencies/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-05-07
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
pnpm update @tauri-apps/cli @tauri-apps/api --latest
cd src-tauri
cargo update
```

The source requires the same minor for `@tauri-apps/api` and `tauri`, and exact versions for each plugin's npm and Rust pair.

## Archived evidence

Tauri instructs applications to keep npm `@tauri-apps/api` and Cargo `tauri` on the same minor version. Their patch numbers do not have to match.

For each plugin, the npm guest binding and Rust crate must use the exact same version because coordinated changes can occur in plugin patch releases.

The update flow changes manifest constraints and then updates lockfiles, for example with the package manager and `cargo update` from `src-tauri/`. The page also names `cargo upgrade` from `cargo-edit` as an option.

## Archive interpretation

Do not force every Tauri ecosystem package to one version number. Apply the two documented alignment rules by package family and inspect the resolved lockfiles.
