Deterministic scripts for this pair.

| Script | Purpose |
|---|---|
| `generate-scorecard-xlsx.py` | Generates `references/templates/website-audit-scorecard-template.xlsx` from scratch via `openpyxl`. Real, working generator, not a spec document - run it and it produces an openable workbook with live formulas. Re-run this after any change to the category/sub-audit weighting design instead of hand-editing the `.xlsx`. See the module docstring for exactly which design choices are sourced from `plan/website-auditor-build-plan.md` / `prd-020-audit-scoring-index.md` versus this Stinger's own engineering design (the leaf-to-sub-audit-to-category nesting structure). Usage: `python3 generate-scorecard-xlsx.py [output_path]`. |

The shared, per-audit-run scripts `score-rollup.py` and `xlsx-populate.py` (build plan section 6) live in the plugin-root `shared/scripts/` folder, not here, since they are invoked at run time against a live engagement's `scoring/` folder rather than at template-generation time. They are step-3 folder-tree placeholders as of this pair's own forge; wiring them to call the rollup logic this template's formulas encode is future work tracked against those scripts' own owning pairs, not duplicated here.
