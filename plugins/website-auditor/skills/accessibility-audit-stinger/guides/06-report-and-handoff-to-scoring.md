# Report writing and handoff to audit-scoring-wasp-drone

Final step of every pass. Read `references/templates/accessibility-findings-output-template.md` alongside this guide; that file has the exact file skeleton, this guide has the ordering and the handoff contract.

## 1. Write order

1. `06-accessibility/scope-gate.md`, from `guides/03-scope-gate-microenterprise-and-applicability.md`.
2. `06-accessibility/a11y-scan-findings.json`, the unmodified `a11y-scan.py` output.
3. `06-accessibility/checklist-results.md`, the fully-scored checklist.
4. `06-accessibility/accessibility-statement.md`, from the EAA statement template.
5. `06-accessibility/summary.md`, last, since it references the other four.

Writing in this order means a partial/interrupted run leaves an inspectable trail rather than a single missing file with no context, consistent with conduct rule 2 (evidence at the moment of finding, not reconstructed later).

## 2. What `audit-scoring-wasp-drone` needs from this Drone

Per PRD-020's mandatory-evidence rule (AC-5): every leaf score in `summary.md`'s findings table must carry a numeric 0-6 value, an evidence pointer, and a one-line justification, or `audit-scoring-wasp-drone` will reject it and return it to this Drone. Before considering a pass complete, re-read `summary.md`'s findings table and confirm no row has an empty evidence or justification cell.

## 3. Flag the category-placement gap explicitly

Per `guides/04-scoring-and-rating-bands.md` section 5, this Drone does not decide which of the build plan's eight categories its leaves roll into. `summary.md`'s skeleton already includes a dedicated section for this; do not remove it, and do not fill it in with a guessed category assignment.

## 4. Update the evidence index

Append all five files above to `_shared/evidence-index.md`: path, what produced it (this Drone, and which script/template if applicable), and the timestamp of when it was written. This is the only file other Drones might touch concurrently; append, do not overwrite.

## 5. Definition of done for this pass

- Every non-N/A checklist row has a 0-6 score, evidence pointer, and justification.
- The 0-100% score and rating band are computed and recorded, paired with the dated statement per `guides/04-scoring-and-rating-bands.md` section 3.
- The scope gate ran and its result is recorded, independent of whether it changed the report's legal framing.
- The rejected/reframed candidates table is present, even if empty (an intentionally empty table with its header intact is itself the honest record that none were rejected).
- `_shared/evidence-index.md` was updated.

Only then is the pass complete and ready for `audit-scoring-wasp-drone` to read `06-accessibility/` in wave W7.
