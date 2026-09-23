# 01. Dual-audience structuring procedure

Grounded in [references/research/distilled-audit-reporting.md sections 1-3](../references/research/distilled-audit-reporting.md).

## Why two documents, not one with two modes

Three independent sources converge on the same split: a decision-maker/budget-holder audience that will only ever read the front matter, and a technical implementer audience that needs precise, unambiguous detail to act. The IIA toolkit names this formally: internal audit Standard 2420 requires content and detail "determined by the needs of the audience," and explicitly licenses producing a condensed executive-summary version alongside the full detailed report. This plugin follows that pattern as two separate rendered documents (`reports/customer-report.md`/`.html` and `reports/auditor-report.md`/`.html`) rather than one document with a fold, per prd-021's own Goals section.

**Non-negotiable per prd-021 AC-1:** both pairs render from the same underlying data (`scoring/findings-register.csv`, `scoring/audit-scorecard.xlsx`, `_shared/evidence-index.md`). No finding may exist in one document's data source and be silently absent from the other's. What differs is level of detail and framing, never the underlying fact set.

## Procedure

1. **Load the findings register once.** Read `scoring/findings-register.csv` and `scoring/audit-scorecard.xlsx` a single time per run. Both report pairs are rendered from this one in-memory data set, not two separate reads that could drift.
2. **Classify every finding as `finding` or `observation`.** Per ForensicSpot's vocabulary (distilled-audit-reporting.md section 4): a `finding` is evidence-backed and violates a specific checkpoint; an `observation` is a noted issue that lacks sufficient evidence or does not violate a specific requirement, and carries less remediation weight. This distinction is rendered explicitly in the auditor report's "Type" column and folded into plain language for the customer report (observations are not hidden, but are not framed with the same urgency as findings).
3. **Render the auditor pair first.** It is the full-fidelity document; the customer pair's content (translated language, grouped-by-business-area findings, cost/effort framing) is derived FROM the same finding objects, not authored independently. This keeps AC-1's "no silent absence" guarantee mechanical rather than a manual cross-check.
4. **Write the executive summary last, place it first.** Per ForensicSpot: the executive summary should be drafted only after every finding is graded and verified (so it can state severities and priority order accurately), but it appears as the first section of the rendered document. In practice: render the findings body and scorecard rollup first, then generate the executive-summary paragraph and top-three-priorities list from that already-final data, then assemble the document with the summary at the top.
5. **Apply the audience-specific content rule, never the audience-specific fact rule.** Technical jargon, raw evidence dumps, and file/URL-level pointers are omitted from the customer report (structure, not fact, differs). The customer register never states a milder version of a fact than the auditor register - see guide 03 and prd-021 AC-2 for the specific case (AI-authorship and de-anonymization disclosure) where this is a binding acceptance criterion, not a style preference.
6. **Group findings differently per audience.** Auditor report: grouped by category/sub-audit as scored (Security, Revenue drivers, etc., matching the rubric structure in build plan section 4.2). Customer report: grouped by the business area they affect (a security header issue and a checkout-flow issue may both roll into "protecting customer trust" for the reader, even though they are different rubric categories). This regrouping is presentation only; the underlying finding IDs are identical.

## Section shape used by each template

See `references/templates/customer-report-template.md` and `references/templates/auditor-report-template.md` for the full realized structure. Summary:

- **Customer:** Executive Summary -> How the score is calculated -> Key findings (business-language, grouped by business area) -> AI-authorship/de-anonymization disclosure -> Prioritized recommendations -> Next steps.
- **Auditor:** Scope & Methodology -> Executive Summary -> Summary of Findings (table) -> Detailed Findings (full write-up per finding) -> Management Responses -> Verification Log -> Appendices.

The auditor structure is adapted from ForensicSpot's six-section security-audit-report shape (distilled-audit-reporting.md section 2), extended with a seventh section (Verification Log) required by this plugin's own conduct rule 4 - see guide 04.

## What NOT to do

- Do not author the customer report from a fresh read of raw findings; it must derive from the same finding objects the auditor report used, or AC-1 breaks silently over time as the two renderers drift.
- Do not omit a finding from the customer report because it is unflattering or hard to explain in plain language - translate it, do not drop it. The only content genuinely exclusive to the auditor report is raw technical evidence and file/URL-level detail, not entire findings.
