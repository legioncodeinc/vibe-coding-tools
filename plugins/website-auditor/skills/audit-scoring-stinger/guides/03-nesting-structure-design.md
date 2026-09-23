# 03. The leaf-to-sub-audit-to-category nesting structure: an explicit engineering decision

`references/research/distilled-audit-scoring.md` sections 4 and 8 are explicit that the
multi-level nesting structure this Drone implements - leaf rolls into sub-audit, sub-audit rolls
into category, category rolls into final score - is **not directly grounded in any raw
source** in this pair's research archive. The archive grounds two building blocks (the
masked, N/A-aware weighted-average formula itself, and a positive/negative-weight
normalization variant of it from an adjacent LLM-rubric-evaluation domain), and states plainly
that "applying the formula recursively level-by-level is an architectural inference... not
something any raw source states explicitly for a spreadsheet context."

This guide is the honest record of that inference, made explicit as this Stinger's own
design, per the task instruction that grounding notes distinguish sourced formula mechanics
from invented structure. Read this before `01-rollup-procedure.md` if you have not already.

## 1. What IS sourced, and where

| Design element | Status | Source |
|---|---|---|
| The 0-6 leaf scale and its band definitions | Sourced | build plan section 4.1 |
| Boolean checkpoints resolve only to 1 or 6 | Sourced | build plan section 4.1 |
| The 8 category names, in the exact descending order (Security > Revenue drivers > Mission critical > Analytics and insight > Technical deployment > Foundational completeness > Search presence > Content score) | Sourced | build plan section 4.2, prd-020 Goals |
| The 8 category weights (20/18/14/12/11/10/9/6, summing to 100) | Sourced | build plan section 4.2 |
| Revenue Drivers' 3 sub-audit names AND weights (Visual UX/UI 7, Navigation & User Journey 6, On-Page Copy 5) | Sourced | build plan section 4.2 |
| Analytics and Insight's 3 sub-audit names AND weights (Foundational 5, Industry-specific 4, De-anonymization 3) | Sourced | build plan section 4.2 |
| Technical Deployment's 3 sub-audit names AND weights (CDN 3, Caching 4, CWV 4) | Sourced | build plan section 4.2 |
| Search Presence's 3 sub-audit names AND weights (Technical SEO 3.5, Technical AEO 3.5, Subjective copy 2) | Sourced | build plan section 4.2 |
| Security's 7 sub-audit NAMES (Headers, TLS, cookies, CSP, platform exposure, client-side injection, payment-path integrity) | Sourced (names only, no split given) | build plan section 4.2 "Contains" column |
| Content Score's 3 sub-audit NAMES (depth, freshness, coverage) | Sourced (names only, no split given) | build plan section 4.2 |
| The masked SUMPRODUCT formula shape at each level | Sourced | `distilled-audit-scoring.md` sections 1-2, [raw/datacamp-com-tutorial-sumproduct.md], [raw/exceljet-net-formulas-weighted-average.md], corroborated by [raw/autorubric-org-docs-api.md] |
| Critical-security-override rule (Security leaf=1 caps final grade at C) | Sourced | build plan section 4.3 Q9, prd-020 Goals and AC-3 |
| Letter grade thresholds (93/90/87/83/80/77/73/70/60) | Sourced | build plan section 4.3 |

## 2. What is THIS STINGER'S OWN engineering design, explicitly flagged

- **Equal-weighted sub-audits where no split was given.** Security's 7 named sub-audits,
  Mission Critical's sub-audits, Foundational Completeness's sub-audits, and Content Score's
  3 named sub-audits all get an equal share of their category's own weight
  (`category_weight / count_of_subaudits`) purely because no finer split exists in any source.
  This is an arbitrary but defensible default, not a researched number, and it is the first
  thing to revisit once a real engagement's leaf inventory reveals that (for example) TLS
  findings matter more than cookie findings within Security.
- **Mission Critical's 3 sub-audit NAMES are invented outright.** The PRD/build plan give only
  the one-line gloss "does the site do the one job it exists to do." This template names three
  illustrative sub-audits - Primary Conversion Path Integrity, Core Function Reliability, Trust
  & Credibility Signals - as placeholders. These are NOT sourced and should be treated as a
  strawman to refine, not a specification.
- **Foundational Completeness's 3 sub-audit NAMES are invented outright.** The gloss given is
  "the table stakes." This template names three illustrative sub-audits - Core Pages & Contact
  Info, Legal & Policy Presence, Basic Technical Hygiene - equally unsourced placeholders.
- **4 example leaf rows per sub-audit.** An arbitrary illustrative capacity chosen to keep the
  generated template a manageable size (112 leaf rows total across 28 sub-audits) while still
  demonstrating every mechanic (a strong score, an N/A exclusion, and - once, deliberately -
  the override trigger). A real engagement's actual leaf count per sub-audit is owned by each
  upstream Drone's own Stinger, not by this one, and will not match 4 in general - see section 4
  below for how to extend the template's row range when a real leaf inventory is larger.
- **The column layout on `Scorecard`** (leaf score confined to column E, every rollup value
  confined to column L, a positional block-scan rather than a text-match for the
  security-override scan, the "compact mirror" block that turns a scattered rollup column into
  a SUMPRODUCT-able contiguous range) is pure spreadsheet-engineering design, worked out to
  make the sourced formula shapes buildable across a real multi-level hierarchy. None of it is
  claimed to be sourced. `01-rollup-procedure.md` section 3 and `02-critical-security-override.md`
  section 2 explain why each choice was necessary.
- **The `leaf-finding.schema.json` envelope fields** (`category_key`, `subaudit_key`,
  `originating_bee`, `severity`, `remediation`, `effort_hours_band`, `captured_at`) beyond the
  three build-plan-mandatory fields (score, evidence pointer, justification) are this
  Stinger's own design, needed to route a finding to the right cell and to route a rejection
  back to the right Drone.

## 3. Why recursive application of the same formula, specifically

`distilled-audit-scoring.md` section 4's "practical implication" row states this plainly: "A
multi-level rollup can likely be implemented by applying the Section 1/2 formula (masked,
N/A-aware SUMPRODUCT-style weighted average) recursively, i.e. treat each sub-audit's rolled-up
score as one more weighted 'leaf' value feeding into its parent category's own weighted
average, and so on up to a final score." That is exactly what this template does: a sub-audit
rollup value is, from the category rollup formula's point of view, indistinguishable in shape
from a leaf score - both are just a number between 0 and 1 (or 0 and 6, in the leaf case)
multiplied by a weight and summed. Choosing recursion over inventing a different formula shape
for each level keeps the workbook auditable: there is exactly one formula pattern to verify by
hand (the masked SUMPRODUCT with the `/SUM(weights)` divisor and the zero-guard), applied
three times, rather than three different formula designs to separately trust.

## 4. Extending the template beyond its designed row range

Per [raw/python-excel-automation-com-generating-excel-reports-from-templates.md]'s guidance on
extending a template beyond its pre-built formula range: if a real engagement produces more
than 4 leaf findings for a given sub-audit, do not hand-insert rows into the generated
`.xlsx` and hand-patch the SUMPRODUCT ranges. Instead, edit `LEAVES_PER_SUBAUDIT` (and, if a
specific sub-audit needs an exceptional count, the `CATEGORIES` data table) in
`references/scripts/generate-scorecard-xlsx.py` and re-run it. The generator recomputes every
row number, named range, and formula range from the data table, so the workbook regenerates
internally consistent rather than accumulating hand-edited drift. This mirrors that source's
own stated preference for "the formula itself must be extended in code... or the range should
be computed dynamically from the actual row count" over manual `.xlsx` surgery.
