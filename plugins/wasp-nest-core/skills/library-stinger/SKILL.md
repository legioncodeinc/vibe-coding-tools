---
name: "library-stinger"
license: AGPL-3.0-or-later
description: "Maintain Library Schema v2 docs. Use for PRDs, IRDs, knowledge docs, lifecycle moves, issue ingest, or drift audits. Read README.md for the guide map."
---

# library-stinger

Cursor-skill wrapper for the `library-wasp-drone` Drone's companion resource bundle. The full directory map, intent-routing tables, examples catalog, templates list, path conventions, and self-operation notes are in [`README.md`](README.md) - start there.

> **Agent entry point:** [`library-wasp-drone.md`](../../agents/library-wasp-drone.md) - deployed via the host repo's `.claude/agents/` folder.
>
> **Peer Drones:** [`quality-wasp-drone`](../../agents/quality-wasp-drone.md) owns QA report authorship. [`knowledge-wasp-drone`](../../agents/knowledge-wasp-drone.md) owns narrative knowledge docs under `library/knowledge/private/<domain>/`. [`contract-writing-wasp-drone`](../../agents/contract-writing-wasp-drone.md) owns shared contract records; Library owns their PRD links.

## Path conventions enforced (schema v2)

| Output | Location |
|---|---|
| Customer-facing docs | `library/knowledge/public/<domain>/<slug>.md` |
| Internal engineering/business docs | `library/knowledge/private/<domain>/<slug>.md` |
| Stable shared contracts | `library/knowledge/private/contracts/CTR-<###>-<slug>.md` |
| ADRs | `library/knowledge/private/architecture/ADR-<n>-<slug>.md` |
| PRD folder (backlog) | `library/requirements/backlog/prd-<###>-<slug>/` |
| PRD index | `library/requirements/backlog/prd-<###>-<slug>/prd-<###>-<slug>-index.md` |
| PRD sub-feature | `library/requirements/backlog/prd-<###>-<slug>/prd-<###><letter>-<slug>-<feature>.md` |
| PRD QA report | `library/requirements/backlog/prd-<###>-<slug>/qa/prd-<###>-<slug>-qa.md` |
| PRD in-work | `library/requirements/in-work/prd-<###>-<slug>/` (same structure) |
| Completed PRD | `library/requirements/completed/prd-<###>-<slug>/` |
| Routine scan report | `library/requirements/reports/<YYYY-MM-DD>-<type>-report.md` |
| IRD folder (backlog) | `library/issues/backlog/ird-<###>-<slug>/` |
| IRD index | `library/issues/backlog/ird-<###>-<slug>/ird-<###>-<slug>-index.md` |
| IRD QA report | `library/issues/backlog/ird-<###>-<slug>/qa/ird-<###>-<slug>-qa.md` |
| Completed IRD | `library/issues/completed/ird-<###>-<slug>/` |
| Notes (human only) | `library/notes/` - agents NEVER write here |

**NOT in `library/`:**

| Asset | Correct location |
|---|---|
| Brand assets (logos, fonts, colors) | Wherever the deployment stores shared brand assets (e.g. a `brands/` or `assets/` folder outside this repo) |
| Derived wiki / docs vault mirrors | Any aggregated wiki or docs vault that mirrors `library/` is derived - never edit it directly |
| Binary files (images, fonts, PDFs) | An `assets/` or `public/` folder appropriate to the deployment |

**Legacy v1 paths (do NOT create new content here):**

| v1 path | v2 replacement |
|---|---|
| `library/knowledge-base/` | `library/knowledge/private/` |
| `library/architecture/` | `library/knowledge/private/architecture/` |
| `library/requirements/features/` | `library/requirements/backlog/` |
| `library/requirements/issues/` | `library/issues/backlog/` |
| `library/qa/` | `library/requirements/reports/` |

See `guides/07-wiki-sync.md` for wiki synchronization rules.
