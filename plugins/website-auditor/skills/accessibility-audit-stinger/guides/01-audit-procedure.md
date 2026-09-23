# Audit procedure

End-to-end procedure for one engagement. Read this guide in full before starting a pass; do not skip to the checklist directly.

## 1. Preconditions

- `site-data/` exists and is non-empty (written by `site-crawler-wasp-drone` in W4). If it is missing or empty, stop and report a blocking dependency failure; do not fabricate findings from a partial or absent crawl.
- This Drone only reads `site-data/`, per its shared-workspace contract (PRD-013). It does not re-fetch pages, does not crawl further, and does not write outside `06-accessibility/`.

## 2. Run the scope gate first

Work through `references/templates/microenterprise-and-scope-gate-checklist.md` before scoring anything. Write the result to `06-accessibility/scope-gate.md`. This determines the legal-framing language used later in the accessibility statement, not whether the audit itself runs; score every engagement regardless of the gate's outcome (see the checklist's own note on this).

## 3. Run the automated pass

```
python3 shared/scripts/a11y-scan.py --site-data <workspace>/site-data --out <workspace>/06-accessibility/a11y-scan-findings.json
```

This covers a small, deterministic subset of the checklist (page language, page title, image alt presence, form-label association, link-purpose text, heading order), each already scored 1-6 on the build plan's zero-to-six scale (section 4.1) with an evidence pointer baked into the script's own output. Read `guides/05-manual-vs-automated-confidence-and-non-goals.md` before treating this output as more complete than it is; it is roughly a sixth of the checklist's rows, not the whole audit.

## 4. Walk the full checklist

Open `references/templates/wcag-2.1-aa-checklist-scoring-table.md`. For every row not already filled by the automated pass, read the relevant pages in `site-data/` (and the crawl's Markdown extraction, when the raw HTML alone is insufficient to judge, e.g. reading order) and score it 0-6 with an evidence pointer and one-line justification. Read `guides/02-eaa-and-wcag-version-selection.md` first if any question arises about which WCAG version a specific criterion belongs to. Label every visually/design-judgment-driven row `[subjective]` per conduct rule 3.

## 5. Score the WCAG 2.2 forward-looking additions separately

The three criteria named in `wcag-2.1-aa-checklist-scoring-table.md`'s WCAG 2.2 section. Report as its own labelled band, not folded into the AA baseline percentage.

## 6. Roll up the score and assign the rating band

Follow `references/templates/a11y-score-rollup-and-rating-bands.md` exactly: reuse the build plan's N/A-aware sub-audit formula, then map the result to a band per that template's table. Never skip straight to a band label without the underlying percentage on record.

## 7. Write the accessibility statement

Fill `references/templates/eaa-conformance-statement-template.md` with the actual engagement's scores, evidence, and scope-gate result. Read `guides/04-scoring-and-rating-bands.md` for the legal-claim-language rule this statement enforces before writing it.

## 8. Write output and hand off

Follow `guides/06-report-and-handoff-to-scoring.md` for the exact files, their locations, and the evidence-index update. This is the last step; do not consider the pass complete until `06-accessibility/summary.md` exists with every leaf score, its evidence, and the open category-placement question named.
