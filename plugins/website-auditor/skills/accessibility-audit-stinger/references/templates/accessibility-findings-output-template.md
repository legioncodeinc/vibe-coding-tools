# Accessibility findings output template

Copy-ready skeleton for what `accessibility-audit-wasp-drone` writes to `06-accessibility/` (build plan section 3). Structured to satisfy `audit-scoring-wasp-drone`'s mandatory-evidence rule (PRD-020 AC-5: a leaf finding without an evidence pointer or justification is rejected and returned to this Drone) on every leaf.

## Files this Drone writes

```
06-accessibility/
├── scope-gate.md              output of microenterprise-and-scope-gate-checklist.md
├── checklist-results.md       every row of wcag-2.1-aa-checklist-scoring-table.md, filled in
├── a11y-scan-findings.json    raw output of shared/scripts/a11y-scan.py, unmodified
├── accessibility-statement.md filled eaa-conformance-statement-template.md
└── summary.md                 this Drone's own handoff summary, see below
```

## `summary.md` skeleton

```markdown
# Accessibility audit summary

**Engagement:** {domain}, {engagement_date}
**Pages assessed:** {page_count} of {crawled_total} crawled

## Headline

- **0-100% score:** {a11y_pct}
- **Rating band:** {rating_band} (see a11y-score-rollup-and-rating-bands.md)
- **Scope gate result:** {exempt|not-exempt}, see scope-gate.md
- **WCAG 2.2 forward-looking check:** {n}/3 additions met (informational only, not part of the AA baseline score)

## Category-weight placement, open question for audit-scoring-wasp-drone

This Drone's leaf scores below are written with individual evidence and justification, ready for cross-category rollup. Per `a11y-score-rollup-and-rating-bands.md` section 2, the build plan's eight-category weight table (section 4.2) does not name an explicit "Accessibility" line item; this Drone does not resolve that placement, it is named here as an open handoff item for `audit-scoring-wasp-drone`'s own forge (PRD-020) to settle.

## Leaf findings

| SC | Level | Score | Weight | Evidence | Justification | Subjective? |
|---|---|---|---|---|---|---|
| {sc_ref} | {level} | {score} | 1 | {evidence_pointer} | {justification} | {yes/no} |

## Rejected/reframed candidates (verification log)

Per conduct rule 4, every candidate finding that failed verification is recorded here with the reason, not silently dropped.

| Candidate | Reason rejected/reframed |
|---|---|
| {candidate} | {reason} |
```

## Evidence-index update

Append every artifact this Drone produced (the four files above) to `_shared/evidence-index.md`, per the shared-workspace contract, with the artifact path, what produced it, and when.
