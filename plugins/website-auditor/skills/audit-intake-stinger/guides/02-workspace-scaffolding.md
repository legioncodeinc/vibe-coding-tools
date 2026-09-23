# 02. Workspace scaffolding

How `audit-intake-wasp-drone` creates `www.<domain>-audit/` once the four intake answers are recorded and confirmed. This guide is the depth layer for Phase 4 of `01-intake-procedure.md`.

## What must exist when this phase completes (PRD-002 AC-2)

Every subfolder in `references/templates/workspace-folder-tree-scaffold.md`'s tree, reproduced from the build plan section 3, must exist - including subfolders later Drones own and will write into. Empty is fine. Missing is not; that is the exact wording of AC-2. This is a product-decision mechanic sourced to the build plan, not a research question, so there is no `[raw/...]` citation for the tree shape itself.

## Procedure

1. **Create the root folder** `www.<domain>-audit/` using the confirmed domain from Phase 3 of `01-intake-procedure.md`. If it already exists, stop - this should never happen if Phase 1's resume check ran correctly; if it does, surface the conflict to the user rather than overwriting.
2. **Create every subfolder** listed in `references/templates/workspace-folder-tree-scaffold.md`, including the conditional `11-blog/` and `12-ecommerce/` folders. Conditionality (per the build plan's W6a/W6b wave) governs whether a *later Drone runs*, not whether the folder exists at scaffold time - AC-2's "even the ones later Drones will write into" wording applies directly here.
3. **Write `00-intake/answers.md`** with the four recorded answers and the engagement reference, using the shape in `references/templates/intake-questionnaire-template.md`'s field keys.
4. **Write `_shared/run-ledger.json`** from `references/templates/run-ledger-template.json`, hydrated with the four answers, the domain, and a completed status entry for `audit-intake-wasp-drone` itself. This file's schema is this Stinger's own construct (see that template's `_comment` field for the grounding gap); no source in the archive describes a run-ledger schema.
5. **Write `_shared/target-profile.json`** as an unpopulated stub from `references/templates/target-profile-stub-template.json`. Do not populate `platform`, `rendering`, `stack`, or `confidence` here - that is `stack-fingerprint-wasp-drone`'s job in wave W1a, out of scope for this Drone.
6. **Write `_shared/evidence-index.md`** as a stub from `references/templates/evidence-index-stub-template.md`, seeded with this Drone's own four artifact rows.
7. **Write `README.md`** at the workspace root from `references/templates/workspace-readme-template.md`, hydrated with all four intake answers plus the derived domain and engagement reference.

`references/scripts/scaffold-workspace.py` implements steps 1 through 7 deterministically in one pass, given the four confirmed answers; prefer running it over hand-authoring each file, since it guarantees the folder tree, JSON shapes, and hydrated values stay consistent with the templates above. It is a pair-local script (not one of the eleven shared `shared/scripts/` scripts, since none of those cover scaffolding).

## Ordering matters

Write `_shared/run-ledger.json` and the `00-intake/` content before anything else that reads them. A mid-run failure after step 3 but before step 7 should still leave a workspace where Phase 1's resume check (in `01-intake-procedure.md`) finds a valid ledger and can resume correctly, rather than a half-scaffolded workspace with no ledger to detect.

## What this Drone must NOT do here

- Must not write into `01-recon/`, `02-positioning/`, `content-targets/`, `site-data/`, `visual/`, `03-seo/` through `12-ecommerce/`, `scoring/`, or `reports/` beyond creating the empty folder. Those are other Drones' subfolders; touching their contents here would violate the shared-workspace contract in `prd-002-audit-intake-index.md`.
- Must not fetch the landing page. Confirming the URL is well-formed (Phase 3 of `01-intake-procedure.md`) is not the same as fetching it; fetching belongs to wave W1.
