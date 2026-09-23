# EAA-aware accessibility statement template

Copy-ready. Directly grounded in the vendor-blog source's recommendation: a dated, specific compliance statement naming known outstanding issues and a contact channel, in preference to a blanket "AA compliant" claim, because enforcement action in this space has turned on the shape of the claim made rather than the underlying state of the site. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] Use this as the accessibility-statement section of the customer-facing report, paired with the rating band from `a11y-score-rollup-and-rating-bands.md`; never substitute the band label alone.

---

## Accessibility statement

**Assessed:** `{engagement_date}`
**Assessed against:** WCAG 2.1 Level AA (the version currently cited by EN 301 549 V3.2.1, the harmonised standard referenced under EAA Article 15(1) as of this assessment date; re-verify currency before relying on this statement, see `wcag-2.1-aa-checklist-scoring-table.md` provenance note)
**Assessment method:** Automated-plus-heuristic pass over `{page_count}` crawled pages. This is not a substitute for a full manual accessibility audit including assistive-technology user testing.
**Overall result:** `{a11y_pct}`% (`{rating_band}`, see `a11y-score-rollup-and-rating-bands.md` for the band definition and its caveats)

### Known outstanding issues as of this assessment

List every non-N/A criterion scoring below 6, most severe first, each with its evidence pointer:

| Criterion | Score | Issue | Evidence |
|---|---|---|---|
| `{sc_ref}` | `{score}` | `{one_line_description}` | `{evidence_pointer}` |

### What this statement is not

This statement does not assert legal conformance with the European Accessibility Act or any other accessibility regulation. It reports the state of `{page_count}` crawled pages as observed on `{engagement_date}`, at automated-plus-heuristic confidence. Legal conformance is a determination for the audited party's own counsel to make, informed by this and any further findings.

### Contact for accessibility feedback

`{business_name}` should publish its own contact channel for accessibility feedback here once this statement is adopted into the live site; this audit does not create one on the business's behalf.

---

## Usage notes

- Fill every `{placeholder}` from the actual engagement; do not ship a statement with unresolved placeholders.
- Do not omit the "known outstanding issues" table even when short; an empty table with the header intact is the honest way to say "none found at this confidence level," which is itself a claim worth dating.
- Re-generate this statement per engagement; do not reuse a prior engagement's statement for a re-audit, since the dated-and-specific framing this template exists for depends on the date being current.
