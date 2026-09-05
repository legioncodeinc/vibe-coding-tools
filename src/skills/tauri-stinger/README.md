# Tauri Stinger

`tauri-stinger` is the Tauri 2 engineering knowledge package for `tauri-worker-bee`. It covers desktop and mobile project structure, dependency alignment, Tauri 1 migration, typed IPC, capabilities, sidecars, AI runtime designs, persistence, native verification, signing, updater integration, and distribution.

The root `SKILL.md` is intentionally lean. Detailed work lives here:

- `guides/` contains one procedure per major engineering verb.
- `references/` contains the dated version snapshot, IPC and security model, derived AI architecture choices, and release checklist.
- `references/research/raw/` archives one primary-source note per official or upstream source.
- `references/research/distilled-tauri-2.md` ties every factual claim to that archive.
- `examples/` contains six practical AI-oriented and migration/update examples.
- `templates/` contains inspection, architecture, capability, upgrade, and release-evidence artifacts.
- `scripts/inspect-tauri-project.py` performs a deterministic, read-only first pass over a target project and emits JSON.

## Research posture

The primary release and advisory sweep covers 2026-03-03 through 2026-09-03. Mutable official documentation fetched at the cutoff supplies supplemental baseline behavior and is not presented as an in-window release.

The generated Tauri release website lagged several official package-specific GitHub releases dated 2026-08-31. The dated snapshot therefore records both the discrepancy and the package-specific tags used to resolve it. Runtime users must refresh current versions before changing a consumer project.

No first-party Tauri AI reference application was found in the official source sweep. Every hosted-provider, local-sidecar, native-runtime, stream-protocol, and AI persistence pattern is labeled as a derived application design.

## Inspector

Run from the Stinger directory:

```text
python scripts/inspect-tauri-project.py <project-root> --pretty
```

Run its deterministic in-memory check:

```text
python scripts/inspect-tauri-project.py --self-test --pretty
```

The inspector performs no network requests, project commands, or file writes. It parses strict JSON, `package.json`, and common one-line Cargo dependency forms. It reports JSON5, TOML, lockfiles, and complex glob overlap as manual-review limitations.

## Validation

From the repository root:

```text
python .claude/skills/queen-bee-stinger/references/scripts/per-type-validation.py .claude/skills/tauri-stinger --type skill --harness all
```

The required bar is zero validation errors, no non-portable frontmatter, no dynamic shell injection, no broken internal links, no unmarked mutable version defaults, and no em dash or en dash characters in authored prose.

## Scope boundary

This Stinger owns Tauri-specific integration. General Rust belongs to `rust-stinger`; frontend framework details belong to the relevant framework Stinger; formal security audit belongs to `security-stinger`; CI topology and release automation belong to `ci-release-stinger` or `devops-stinger`; dependency vulnerability triage belongs to `dependency-audit-stinger`.
