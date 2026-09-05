# Guide 02: Drift Audit

A drift audit compares the state of the codebase to the state of the Universal Asset Registry and reports every mismatch. Run on demand, on CI, and before every production release.

## What counts as drift

Six classes of drift, each with a canonical resolution:

| Class | Meaning | Default resolution |
|---|---|---|
| **Unregistered** | Asset exists in code; no registry row. | Create a `draft` row via the matching per-asset guide. |
| **Orphaned** | Registry row exists; no backing code found at `code_path`. | Mark `status: orphaned`, file a drift item. |
| **Stale** | Registry row's `file_hash` no longer matches the file. | Re-detect and upsert; the generator overwrites generator fields. |
| **Mismatched** | Human fields conflict with generator fields (e.g., `owner` says Team A, code's annotation says Team B). | Flag for human; do not auto-resolve. |
| **Unlinked** | Feature-bearing asset with no `feature_key`. | Block production deploy; require a human to assign. |
| **Debt** | `deprecated` row past `sunset_at` with `usage_count > 0`. | Escalate to the asset's owner; extend sunset or schedule removal. |

## When to run

- **On every PR**: in CI, fail if any new `unregistered`, `mismatched`, or `unlinked` drift appears in the diff.
- **Nightly**: scheduled job, emits a full drift report to `library/requirements/reports/asset-registry/<YYYY-MM-DD>-drift-audit.md`.
- **Pre-release**: gate a production deploy on zero `unregistered` + zero `unlinked` for any asset touched in the release.
- **On demand**: when a human (or a top-tier orchestrator) asks "check registry drift."

## How to run

The sync generator (see `guides/03-sync-generator-spec.md`) has a `--check` mode that produces machine-readable drift output. In this guide, you translate that output into a human report.

### Inputs

1. **Generator's JSON report** (`dist/registry-drift.json`): produced by `pnpm registry:check` or equivalent.
2. **Registry snapshot**: SELECT from the platform DB (read-only replica recommended).
3. **Git context**: `git rev-parse HEAD`, the PR URL if running in CI, the branch name.

### Outputs

- **A drift report.** Two placement options:
  - **Standalone** (nightly, pre-release, ad-hoc): `library/requirements/reports/asset-registry/<YYYY-MM-DD>-<slug>-drift-audit.md`
  - **Feature-tied** (when the audit was scoped to a specific feature): `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<YYYY-MM-DD>-asset-drift.md`
- **A PR comment** (for CI runs) summarizing drift introduced by the PR.
- **A summary printed to stdout** for ad-hoc runs.

Follow the shape in `examples/drift-audit-report-example.md`.

## Report structure

```markdown
# Drift Report — <YYYY-MM-DD> (<trigger>)

**Commit:** <sha>
**Branch / PR:** <branch or PR#>
**Registry snapshot:** <timestamp>
**Generator version:** <semver>

## Summary

| Class | Count | Delta vs prior run |
|---|---|---|
| Unregistered | X | +N |
| Orphaned | X | +N |
| Stale | X | +N |
| Mismatched | X | +N |
| Unlinked | X | +N |
| Debt | X | +N |

## Critical (blocks deploy)

- [ ] <Unregistered asset — `code_path` + proposed per-asset guide>
- [ ] <Unlinked feature-bearing asset — `key` + missing `feature_key`>

## Warnings (fix this week)

- [ ] <Stale row — `key` + file hash mismatch>
- [ ] <Mismatched row — `key` + conflicting field + proposed resolution>

## Informational

- [ ] <Orphaned row — `key` + last-seen date>
- [ ] <Debt row — `key` + sunset date + usage count>

## Per-asset breakdown

### Features
| Key | Class | Details | Resolution |
|---|---|---|---|
| ... | ... | ... | ... |

### Pages
...

### Routes
...

(etc. for each asset type)

## Proposed patches

For each drift item the generator can auto-resolve, include the generated SQL or Prisma mutation. A human must approve before execution.
```

## Severity rules

| Drift class | Severity | Blocks deploy? |
|---|---|---|
| Unregistered (feature-bearing) | **Critical** | Yes |
| Unregistered (design primitive) | Warning | No |
| Orphaned (active) | **Critical** | Yes |
| Orphaned (deprecated) | Informational | No |
| Stale | Warning | No |
| Mismatched (human vs generator) | Warning | No |
| Unlinked (feature-bearing) | **Critical** | Yes |
| Debt (past sunset, usage_count > 0) | Warning | No |
| Debt (past sunset, usage_count = 0) | Informational | No, eligible for hard delete |

## Resolution playbook

### Unregistered

1. Identify the asset class (feature, page, route, surface, etc.).
2. Open the matching per-asset guide.
3. Follow `guides/01-registration-workflow.md` to create a `draft` row.
4. Assign `feature_key` (Principle 5) if feature-bearing.
5. Re-run the audit; confirm the item clears.

### Orphaned

1. Confirm the code was intentionally removed (check git log, ask the owner).
2. If intentional → `status: deprecated`, `deprecated_at: NOW()`, `sunset_at: NOW() + 90d`.
3. If unintentional (e.g., a file move that broke the `code_path`) → update `code_path` and re-run the audit.

### Stale

1. The generator's `file_hash` doesn't match the catalog's stored hash. Let the generator upsert.
2. If upsert would overwrite human fields (it shouldn't, see Principle 7), stop and escalate.

### Mismatched

1. Identify which field conflicts.
2. Open a conversation with the asset's owner. Decide: does the code need to change, or the registry?
3. Apply the resolution manually; the generator will never touch human fields.

### Unlinked

1. The feature-bearing asset has no `feature_key`. Block the deploy.
2. Ask the owner which feature owns this asset.
3. Set `feature_key` on the registry row. Re-run the audit.

### Debt

1. Notify the feature owner.
2. Either: extend `sunset_at` (with justification in `notes`), or plan the removal work as a PRD.

## Escalation

If you find **cross-worker-bee drift** (e.g., a UX/UI token used in code that has no `DesignTokenDefinition` catalog row, but `ux-ui-svelte-worker-bee`'s brief says it *should* exist), file the drift *and* ping `ux-ui-svelte-worker-bee` via a cross-link in the report. You do not fix cross-worker-bee drift alone.

## History

Every drift report is checked into one of:

- `library/requirements/reports/asset-registry/` for standalone reports
- `library/requirements/<lifecycle>/prd-<###>-<title>/reports/` for feature-tied reports

Reports are never deleted; the monotonic history is the audit trail.

Naming (standalone): `<YYYY-MM-DD>-<slug>-drift-audit.md`. Slug is `nightly`, `pre-release-<version>`, or `ad-hoc-<short-description>`.

Naming (feature-tied): `<YYYY-MM-DD>-asset-drift.md` inside the feature folder's `reports/` subfolder.
