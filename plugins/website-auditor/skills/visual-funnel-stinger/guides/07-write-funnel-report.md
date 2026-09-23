# Guide 07: Write the funnel report

## What this guide covers

Final assembly and handoff, once every checkpoint is captured (guides 01-03), checklisted (guide 04), and scored with evidence (guides 05-06).

## Procedure

1. Assemble `05-funnel/funnel-report.md` from `references/templates/funnel-report-template.md`: run metadata (date, interactive-mode state), the ordered checkpoint list, the full score table, the "where the walk stopped" section if applicable, subjective findings, and the verification log.
2. Cross-check that `visual/desktop/` and `visual/mobile/` each contain one file per checkpoint listed in `checkpoint-log.md`, with matching checkpoint IDs. A checkpoint present in the log but missing a screenshot in either folder is an incomplete run for that checkpoint; note it in the report rather than silently dropping the row.
3. Append this Drone's completion to the run's `_shared/run-ledger.json` entry (per-Drone status, timestamps, artifact paths, per build plan section 3), and add every screenshot and the funnel report itself to `_shared/evidence-index.md`.
4. Hand off to `audit-scoring-wasp-drone`: this Drone's job ends at a scored, evidenced `05-funnel/funnel-report.md`; it does not populate the XLSX scorecard itself.
5. If the walk stopped early under interactive mode OFF (guide 05), make sure that stopping point is visible in the report's opening summary, not buried at the end. A reader (including `audit-reporting-wasp-drone`, downstream) should not have to infer why fewer than 25 checkpoints were captured.

## Report is not optional output

Per the paired Drone's Reporting expectations, this report is the record of what this Drone found and did. It is what downstream Drones and the user review; a funnel walk with screenshots but no assembled report is not a complete run.
