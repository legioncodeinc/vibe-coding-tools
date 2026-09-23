# Inspect and Align a Tauri Project

## Purpose

Build an evidence-backed project inventory before choosing an upgrade, migration, or implementation path.

## Procedure

1. Resolve `scripts/inspect-tauri-project.py` relative to the loaded Stinger's `SKILL.md`, then run the deterministic inspector without changing the consumer repository's working directory:

   ```text
   python <resolved-script-path> <project-root> --pretty
   ```

2. Save or summarize its JSON in the target repository's implementation report. Treat its limitations as required manual follow-up, not ignorable noise.
3. Read `package.json` and the active frontend lockfile. Record `@tauri-apps/api`, the CLI package, every `@tauri-apps/plugin-*` package, scripts, frontend framework, and package manager.
4. Read `src-tauri/Cargo.toml` and `Cargo.lock`. Record `tauri`, `tauri-build`, plugin crates, features, target-specific sections, Rust edition and MSRV policy, and the resolved runtime graph.
5. Read the base Tauri configuration and every platform overlay. Platform arrays replace their base arrays under JSON Merge Patch; they do not append. [../references/research/raw/tauri--docs--configuration-files.md](../references/research/raw/tauri--docs--configuration-files.md)
6. Read `src-tauri/src/lib.rs`, command modules, state types, plugin initialization, and shutdown handlers. The shared mobile-ready entry point belongs in `lib.rs`. [../references/research/raw/tauri--docs--project-structure.md](../references/research/raw/tauri--docs--project-structure.md)
7. Inventory `capabilities/`, `permissions/`, `gen/schemas/`, and custom command declarations in `build.rs`.
8. Inventory Store, SQL, Stronghold, sidecars, resources, mobile native modules, updater settings, signing settings, and release workflows.
9. Apply version alignment rules:
   - Cargo `tauri` and npm `@tauri-apps/api` share a major and minor.
   - Each plugin's Rust and npm halves resolve to the exact same version.
   - Core package patch numbers may differ.
   - Wry and Tao behavior comes from the selected Tauri release or resolved lockfile.

   The official dependency guide defines the first two rules. [../references/research/raw/tauri--docs--updating-dependencies.md](../references/research/raw/tauri--docs--updating-dependencies.md)

10. Fill [../templates/inspection-report.md](../templates/inspection-report.md) and mark unsupported configuration formats, unresolved workspace dependencies, or missing lockfile data as OPEN.

## Alignment decisions

| Observation | Action |
|---|---|
| Core/API minor mismatch | Stop feature work, design a coordinated upgrade, and test both sides |
| Plugin exact version mismatch | Align the Rust and npm pair before debugging behavior |
| Broad manifest range but no lockfile proof | Inspect resolved versions before declaring alignment |
| Generated release index conflicts with package tag | Use the package-specific official tag and record the discrepancy |
| New standalone Wry or Tao API requested | Verify the selected Tauri runtime manifest admits it |
| Platform overlay repeats an array | Review the complete replacement result on that target |

## Deliverable

Return the inspection report, the smallest next implementation slice, its owner, and its verification target. Do not mutate the repository when the request is inspection-only.
