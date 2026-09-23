# 02. Critical-security-override mechanics

## 1. The rule, sourced

Build plan section 4.3, Question 9, adopted as-is (default answer, per prd-020's binding
scope): "Any leaf scoring 1 inside the Security category caps the final grade at C regardless
of arithmetic. A site with an active critical security finding should not be able to present
an A because everything else is tidy." prd-020 AC-3 makes this an acceptance criterion: "Given
any Security leaf scores 1, then the final letter grade is capped at C and the Executive
Scorecard sheet's override banner names the triggering finding."

This is a **ceiling, not a floor.** A final score that is already below the C band is left
alone; the override only ever pulls a score DOWN toward C, never up. `MIN()` is the correct
primitive for a ceiling, and that is exactly what the implementation uses.

## 2. Why this is a genuine formula, not documentation of one

The task requirement (and AC-3) is explicit that this must be an actual rule the workbook
enforces, not prose describing what a human should remember to do. The implementation lives
entirely on the `Executive Scorecard` sheet as live formulas, verified by a real LibreOffice
recalculation pass (see `01-rollup-procedure.md` section 5 for the verification method):

```
override_active   = IF(AND(SecurityOverrideEnabled, COUNTIFS(Scorecard!$E$<sec_first>:$E$<sec_last>,1)>0), TRUE, FALSE)
trigger_leaf_id    = IFERROR(INDEX(Scorecard!$C$<sec_first>:$C$<sec_last>, MATCH(1, Scorecard!$M$<sec_first>:$M$<sec_last>, 0)), "")
trigger_desc       = IFERROR(INDEX(Scorecard!$D$<sec_first>:$D$<sec_last>, MATCH(1, Scorecard!$M$<sec_first>:$M$<sec_last>, 0)), "")
effective_pct      = IF(override_active, MIN(final_raw_pct, SecurityOverrideCapPct), final_raw_pct)
final_letter_grade = VLOOKUP(effective_pct, GradeTable, 2, TRUE)
override_banner    = IF(override_active, "CRITICAL SECURITY OVERRIDE ACTIVE - final grade capped at " & VLOOKUP(SecurityOverrideCapPct, GradeTable, 2, TRUE) & ". Triggering finding: " & trigger_leaf_id & " - " & trigger_desc, "No critical security override active.")
```

`<sec_first>:<sec_last>` is the Security category's own full block on `Scorecard` (its
category-header row through its category-rollup row inclusive). Scanning the whole block
rather than only the leaf rows is safe and deliberate: non-leaf rows (sub-audit headers,
sub-audit rollups, the mirror block, the category rollup) always leave column E (score) blank,
and Excel's `COUNTIFS(range,1)` and the `M`-column trigger-helper formula both treat a blank
cell as not-equal-to-1, so mixing row types in the scanned range cannot produce a false
positive. This positional-range design, and the reason mixing rollup values into the SAME
column as leaf scores would have been a real bug (a sub-audit rolled up to exactly 100%, i.e.
the float `1.0`, would then be indistinguishable from a leaf literally scored `1`), is this
Stinger's own engineering decision - see `03-nesting-structure-design.md` for the full column
layout rationale. Nothing in the research archive addresses this; it follows from ordinary
spreadsheet-formula hygiene, not from a cited source.

## 3. Where the "1" (helper trigger column) formula lives

Every leaf row on `Scorecard` carries, in column M, `=IF(E{row}=1,1,0)`. This is deliberately a
plain per-row helper column rather than an array formula built from a compound boolean
expression, so that `MATCH(1, M-range, 0)` works as an ordinary exact-match lookup in every
Excel/LibreOffice/Google Sheets version, with no Ctrl+Shift+Enter array-entry requirement and
no dependency on dynamic-array behavior only present in newer Excel builds. This portability
choice is this Stinger's own design judgement, made because the plugin's stated compatibility
target is four different harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork) and the
resulting `.xlsx` may be opened in any spreadsheet application the auditor or client has, not
only a specific modern Excel build.

## 4. What triggers it, and what does not

- Triggers: any leaf inside the `security` category (`category_key: "security"` in a
  `leaf-finding.schema.json` record) scored exactly `1`.
- Does NOT trigger: a leaf scored `1` in any other category (Revenue Drivers, Mission
  Critical, etc.) - only Security leaves are scanned, per the rule's own scope.
- Does NOT trigger: a Security leaf scored `0` (N/A) - N/A means "not applicable," never
  "critically failing." Confusing the two would misfire the override on sites where a
  Security sub-audit's checkpoint legitimately does not apply.
- Does NOT trigger: a Security sub-audit or category rollup that happens to compute to a low
  percentage without any single leaf actually scoring `1` (e.g. several leaves at 2 or 3
  averaging low). The rule as sourced from build plan Q9 is leaf-triggered, not
  threshold-triggered on the rolled-up percentage - implemented faithfully here as a leaf-row
  scan, not a rollup-value comparison.

## 5. Retuning without touching a formula

Two `Rubric`-sheet named ranges govern this rule and can both be retuned per engagement
without editing any formula (see `04-retuning-weights.md` for the general retuning
discipline):

- `SecurityOverrideEnabled` (boolean cell): set `FALSE` to disable the override entirely for
  an engagement, e.g. if a client explicitly wants the pre-remediation grade shown without the
  cap for internal tracking purposes. Defaults to `TRUE`.
- `SecurityOverrideCapPct` (numeric cell, default `0.7699`, just under the C+ threshold of
  `0.77` from `GradeTable`): the ceiling itself. Lowering it (e.g. to `0.6999`, just under the
  C- threshold) would tighten the cap to D; raising it would loosen it. The default sits at
  the top of the C band specifically so a capped score can still land anywhere from C- through
  C depending on its own uncapped value, and never spills into C+ - matching "caps... at C" as
  literally stated in build plan Q9, not "forces to C" or "forces to exactly the top of C."

## 6. What the demo in the generated template proves

The template's illustrative example data deliberately scores one Security leaf
(`SECURITY-HEADERS-01`, "Strict-Transport-Security header absent") at `1` while every other
leaf across all 8 categories scores strongly. The verified, recalculated result: a raw final
score of 99.2% (an A-band score by `GradeTable`), capped by the override to an effective 77.0%,
resolving to a final letter grade of **C**, with the override banner correctly naming
`SECURITY-HEADERS-01` as the trigger. This is the "would have been an A, capped to a C"
scenario the rule exists to prevent, and it is verified against a real recalculation, not
asserted.
