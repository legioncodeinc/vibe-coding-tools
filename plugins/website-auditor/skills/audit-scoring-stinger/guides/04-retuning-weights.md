# 04. Retuning weights via named ranges, without touching a formula

prd-020 AC-4 is explicit: "the `Rubric` sheet's named ranges are the sole source of every
weight used in every formula (retuning a named range changes the final grade without touching
a formula)." This guide is the procedure for doing that retune correctly, and the reasoning
for why the workbook is built to make it safe.

## 1. Grounding for the named-range-as-integrity-mechanism pattern

The research archive's closest direct precedent for using an Excel named range (rather than a
plain absolute cell reference) as the source of a weight is
[raw/exceljet-net-formulas-weighted-average.md]'s worked weighted-average example, which uses
a named range called `weights` in its formula rather than a bare `D2:D10`-style reference.
`distilled-audit-scoring.md` section 3's own honesty note states plainly that none of this
pair's three openpyxl/formula-mechanics sources specifically discuss workbook-level named
ranges as a branding/integrity mechanism beyond that one worked example - so the DECISION to
make every weight in this workbook a named range, and to make that the single retuning
surface, is this Stinger's own design choice built on top of that one precedent and on AC-4's
own binding requirement, not a fully-sourced pattern in its own right.

## 2. What is, and is not, a named range in this workbook

**Is a named range** (retunable on `Rubric`, listed in full on the `Config` sheet):

- `Wt_security`, `Wt_revenue`, `Wt_mission`, `Wt_analytics`, `Wt_technical`,
  `Wt_foundational`, `Wt_search`, `Wt_content` - each category's own weight, one named range
  per category, single cell.
- `CategoryWeights` - the same 8 cells as a single contiguous named range, used directly in
  the final SUMPRODUCT on `Executive Scorecard`.
- `SubWt_security`, `SubWt_revenue`, `SubWt_mission`, `SubWt_analytics`, `SubWt_technical`,
  `SubWt_foundational`, `SubWt_search`, `SubWt_content` - each category's own sub-audit weight
  column, one named range per category, used in that category's own rollup formula on
  `Scorecard`.
- `GradeTable` - the letter-grade threshold lookup table.
- `SecurityOverrideEnabled`, `SecurityOverrideCapPct` - the override's own two retunable
  inputs, see `02-critical-security-override.md` section 5.

**Is deliberately NOT a named range** (a plain per-row cell value instead):

- **Leaf weight** (`Scorecard` column H, defaults to `1` for every leaf). A workbook cannot
  hold a bounded set of named ranges for an unbounded, per-engagement-variable number of
  leaves - a real audit's leaf count is not knowable at template-generation time, and is
  exactly what audit-scoring-wasp-drone populates at run time from the leaf findings it
  receives. AC-4's own language is about "every weight used in every formula" at the
  structural level the PRD actually specifies numbers for - the 8-category order and its
  splits - not about a hypothetical per-leaf named range that could not exist for a template
  meant to be reused across arbitrarily many engagements. This is stated here as an explicit
  engineering judgement call, not a claim that AC-4 requires it.

## 3. How to retune a category weight

1. Open `references/templates/website-audit-scorecard-template.xlsx` (or a copied, live
   engagement's `scoring/audit-scorecard.xlsx`) in Excel or LibreOffice Calc.
2. Go to the `Rubric` sheet, "Category Weights" table.
3. Edit the numeric value in the "Weight" column for the category you want to change (e.g.
   change Security from `20` to `25`).
4. Check the "Check: should equal 100" cell directly below the table. It is conditionally
   formatted red if the 8 weights no longer sum to 100 - a visible integrity check, the same
   discipline [raw/portfoliohub-io-blog-project-prioritization-template.md] recommends
   ("weight-check formula... doubles as a visible integrity check"). The rollup formulas will
   still compute a mathematically valid answer even if the check goes red (the `/SUM(weights)`
   divisor is self-correcting, per `01-rollup-procedure.md` section 2), but a red check means
   the weights no longer literally match the PRD's stated 100%-summing table, which should be
   a deliberate choice, not an accident.
5. Every formula that reads this category's weight - the final SUMPRODUCT on
   `Executive Scorecard` via `CategoryWeights`, and the category's own display cell wherever it
   appears - updates automatically on recalculation. No formula cell needs to be opened or
   edited.

## 4. How to retune a sub-audit weight within a category

Same procedure, in the "Sub-audit Weights" section of `Rubric`, under that category's own
sub-heading. Editing a sub-audit's weight cell updates that category's `SubWt_<key>` named
range automatically (the named range's `refers_to` is the whole column of cells, so any value
change inside that column is picked up without redefining the range itself), which flows into
the category rollup formula on `Scorecard` on next recalculation.

## 5. How to retune the letter-grade thresholds or the override cap

Same procedure, in `Rubric`'s "Letter Grade Thresholds" table (for `GradeTable`) or "Critical
Security Override" section (for `SecurityOverrideEnabled` / `SecurityOverrideCapPct`, see
`02-critical-security-override.md` section 5 for what each one controls).

## 6. What NOT to do

Per [raw/python-excel-automation-com-generating-excel-reports-from-templates.md]'s explicit
warning, never overwrite a formula cell with a value. Every cell in column L on `Scorecard`,
every category-summary "Rollup %" cell on `Executive Scorecard`, the "FINAL SCORE" /
"Effective %" / "FINAL LETTER GRADE" cells, and every named-range cell described in section 2
above as a formula target should never be hand-typed over with a static number - doing so
silently freezes that cell at whatever value it happened to hold, and every cell downstream of
it keeps computing from a formula that is not being fed live data. If a computed value is
needed as a static snapshot (e.g. for a point-in-time comparison sheet, per build plan
Question 10's proposed re-audit trend feature), copy the value out to a different sheet or
cell with paste-special-values-only, never in place.
