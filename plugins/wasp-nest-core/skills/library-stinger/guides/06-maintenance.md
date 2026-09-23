# Guide 06 - Sync Audit / Maintenance

Covers detecting and fixing drift between the library structure and schema v2.

## Trigger phrases

- "run a sync audit"
- "check for drift"
- "is everything in the right folder?"
- "audit the library"

## Drift types to check

### 1. v1 path remnants

These should not exist in any repo. Flag every one found:

| Stale path | Fix |
|---|---|
| `library/knowledge-base/` | Migrate to `library/knowledge/private/` per the map in `guides/00-initialize.md` |
| `library/architecture/` | Migrate to `library/knowledge/private/architecture/` |
| `library/requirements/features/` | Migrate to `library/requirements/backlog/` |
| `library/requirements/issues/` | Migrate to `library/issues/backlog/` |
| `library/qa/` | Migrate to `library/requirements/reports/` |

### 2. PRD/IRD naming violations

Check that all folders under `requirements/backlog/`, `requirements/in-work/`, `requirements/completed/`, `issues/backlog/`, `issues/in-work/`, `issues/completed/` follow the naming rules:

- PRD folders: `prd-<###>-<slug>/`
- IRD folders: `ird-<###>-<slug>/`
- Old naming like `feature-007-...` or `issue-042-...` should not exist.

### 3. Missing index files

Every PRD folder must contain `prd-<###>-<slug>-index.md`. Every IRD folder must contain `ird-<###>-<slug>-index.md`. Flag folders missing their index.

### 4. Missing qa/ subfolders

Every PRD and IRD folder should have a `qa/` subfolder (even if empty). Create missing ones.

### 5. Missing README.md files

Every v2 folder should have a seeded `README.md` with the correct YAML headmatter. Seed any missing ones from this skill's `templates/` folder.

### 6. Stale wiki pages

`wiki-wasp-drone` derives knowledge pages from the source tree. Flag any page under `library/knowledge/` whose cited source path no longer exists, and recommend re-running `wiki-wasp-drone` rather than hand-patching the page (see `guides/07-wiki-sync.md`).

### 7. Shared contract drift

For new or changed PRDs, compare their shared boundaries with accepted `CTR` records. Flag missing contract links, nonexistent revision pins, active PRDs still pinned to superseded agreements, broken relative links after lifecycle moves, and accepted terms contradicted by native schemas or implementation. Completed historical PRDs retain their original accepted pin. Run the contract-writing Stinger's read-only `scripts/validate_contracts.py` for structural links, then route semantic differences to `contract-writing-wasp-drone`. Library repairs PRD links; the contract-writing Drone owns the record.

## Audit procedure

1. Walk the `library/` tree and compare it against the v2 target in `guides/00-initialize.md`. Any folder off-map or missing its `README.md` is drift.
2. Grep for old naming patterns:
   ```bash
   rg "knowledge-base|/features/|/issues/" <repo>/library/ --files-with-matches
   rg "feature-[0-9]{3}|issue-[0-9]{3}" <repo>/library/ --files-with-matches
   ```
3. Check PRD and IRD folder names, indexes, and `qa/` directories against sections 2 through 4.
4. For changed PRDs, inspect `## Contract dependencies` and run `python3 <contract-writing-stinger>/scripts/validate_contracts.py <repo>` to check accepted CTR structure and known links.
5. Report every semantic contract mismatch with the exact record, revision, PRD, and source path. Route record changes to `contract-writing-wasp-drone` and PRD link repairs to `library-wasp-drone`.
