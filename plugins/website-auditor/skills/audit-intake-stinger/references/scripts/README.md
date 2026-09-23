Most deterministic scripts for this audit domain live in the shared `shared/scripts/` folder at the plugin root, not duplicated per Stinger. See that folder's README for the full script list and which pairs use which script.

`audit-intake-wasp-drone` is a documented exception: folder-tree scaffolding is not covered by any of the eleven shared scripts (none of `fingerprint.py`, `crawl-extract.py`, `vendor-census.py`, `seo-technical.py`, `aeo-technical.py`, `a11y-scan.py`, `security-headers.py`, `cwv-collect.py`, `visual-capture.py`, `score-rollup.py`, or `xlsx-populate.py` scaffold a workspace), and this Drone is the only one that needs it. This folder therefore carries one pair-local script:

| Script | Purpose |
|---|---|
| `scaffold-workspace.py` | Deterministically creates `www.<domain>-audit/` with the full folder tree from the build plan's section 3, writes the `00-intake/answers.md`, `README.md`, `_shared/run-ledger.json`, `_shared/target-profile.json` stub, and `_shared/evidence-index.md` stub, all hydrated with the four intake answers. See `guides/02-workspace-scaffolding.md` for the procedure this implements. |
