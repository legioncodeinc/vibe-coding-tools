# Scoring and rating bands, procedural detail

Companion to `references/templates/a11y-score-rollup-and-rating-bands.md`; that file is the reference table, this guide is the walk-through and the reasoning behind the one rule that must never be broken.

## 1. Compute the 0-100% score exactly once, from the full checklist

After every row in `references/templates/wcag-2.1-aa-checklist-scoring-table.md` (excluding the WCAG 2.2 forward-looking section) is scored, apply:

```
a11y_pct = SUMPRODUCT(scores, weights, --(scores>0))
         / (6 * SUMPRODUCT(weights, --(scores>0)))
```

with weight 1 per criterion (this Stinger's own default, see the reference file for why). Do this once per engagement, from the final scored checklist, not incrementally as rows get filled; a partial-checklist percentage is not the headline number.

## 2. Map to a band, never skip to the label

Use the table in `references/templates/a11y-score-rollup-and-rating-bands.md` section 3. The percentage is the primary deliverable; the band label is a convenience for the reader, not a replacement for it. Every report that states a band must also state the underlying percentage in the same breath.

## 3. The one rule that must never be broken: no unqualified compliance verdict

This is the single most load-bearing instruction in this Stinger's entire archive, sourced directly to the vendor-blog author's argument about FTC enforcement against accessiBe turning on claim-shape rather than site-state. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] Concretely:

- Never write "This site is WCAG 2.1 AA compliant" or "This site meets AAA accessibility standards" as a standalone sentence.
- Always pair a band label with: the assessment date, the assessment method (automated-plus-heuristic, not exhaustive), and the specific outstanding issues found, however few.
- Use `references/templates/eaa-conformance-statement-template.md` verbatim for this pairing; do not write an ad hoc compliance sentence elsewhere in the report that bypasses the template's structure.

## 4. Handling the WCAG 2.2 forward-looking band

Report separately from the 0-100% AA baseline, as "N/3 additions met, forward-looking indicator only." Do not fold its result into the AA-baseline percentage or the AA/AAA-style band; doing so would misrepresent which standard's presumption-of-conformity route the score actually maps to, per `guides/02-eaa-and-wcag-version-selection.md`.

## 5. Category-weight placement stays an open handoff item

Do not attempt to independently decide which of the build plan's eight top-level categories (section 4.2) this Drone's leaves roll into. Write the leaves with evidence, flag the gap explicitly in `06-accessibility/summary.md` per `references/templates/accessibility-findings-output-template.md`, and let `audit-scoring-wasp-drone`'s own forge resolve it.
