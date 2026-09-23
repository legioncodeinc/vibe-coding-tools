# Refresh Current Tauri Information

## Purpose

Replace a stale version or behavior assumption with a dated, reproducible primary-source snapshot.

## Procedure

1. Set an observation date and a six-month release-change window. Never extend past twelve months without explicit user consent.
2. Inspect the target project first. A release is relevant only when it touches a package, platform, feature, or security boundary the project uses.
3. Read the official Tauri ecosystem release index to identify package names and candidate versions.
4. Open the official package-specific GitHub tag for every candidate core, CLI, runtime, bundler, plugin, and action version.
5. Check the official `tauri` and `plugins-workspace` security advisory pages.
6. If runtime behavior depends on Wry or Tao, inspect the immutable runtime manifest at the selected Tauri tag and the target project's `Cargo.lock`.
7. Read migration and breaking notes across every skipped release, not only the destination release.
8. Compare Rust and npm halves separately. Core API aligns by major and minor; each plugin pair aligns exactly. [../references/research/raw/tauri--docs--updating-dependencies.md](../references/research/raw/tauri--docs--updating-dependencies.md)
9. When a generated index and a package tag disagree, preserve both observations and prefer the package-specific official tag. This conflict occurred for multiple plugins on 2026-09-03. [../references/research/raw/tauri--release--ecosystem-index.md](../references/research/raw/tauri--release--ecosystem-index.md)
10. Record each fact in a raw note with URL, fetch date, source type, package identity, release date, and captured evidence.
11. Update the cited distillation before changing any guide, reference, or root-skill claim.
12. Label unresolved availability, source conflicts, or missing first-party examples as gaps.
13. Re-run the skill-local inspector self-test and Queen's cross-harness validator after maintaining this Stinger.

## Primary surfaces

- `https://v2.tauri.app/release/`
- `https://github.com/tauri-apps/tauri/releases`
- `https://github.com/tauri-apps/plugins-workspace/releases`
- `https://github.com/tauri-apps/tauri/security/advisories`
- `https://github.com/tauri-apps/plugins-workspace/security/advisories`
- `https://github.com/tauri-apps/tauri-action/releases`

## Output

For a consumer project, return a dated upgrade recommendation and source ledger. For this Stinger's maintenance, update [../references/CURRENT-TAURI-2.md](../references/CURRENT-TAURI-2.md), the raw archive, and [../references/research/distilled-tauri-2.md](../references/research/distilled-tauri-2.md) in forge order.
