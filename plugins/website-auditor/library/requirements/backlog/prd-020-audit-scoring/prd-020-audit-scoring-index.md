# PRD-020: audit-scoring (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** XL
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-008, prd-009, prd-010, prd-011, prd-012, prd-013, prd-014, prd-015, prd-016, prd-017, prd-018, prd-019. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W7, sync, needs all findings from every prior wave

---

## Overview

The rubric engine: rolls every leaf finding up through sub-audit, category, and final scores using the N/A-aware weighted formulas, and populates the branded XLSX scorecard.

---

## Goals

- Implements the 0-6 leaf scale exactly as specified (0=N/A/excluded, 1=F/Critical through 6=A/None, boolean checkpoints resolve only to 1 or 6, build plan §4.1).
- Implements the three-tier rollup formula exactly as specified: leaf-to-sub-audit SUMPRODUCT with an N/A mask in both numerator and denominator, sub-audit-to-category, category-to-final (build plan §4.3).
- Applies the category weight table in the user's exact stated descending order: Security (20%) > Revenue drivers (18%, split Visual UX/UI 7 / Nav-journey 6 / On-page copy 5) > Mission critical (14%, sub-audit rollup) > Analytics and insight (12%, split Foundational 5 / Industry-specific 4 / De-anonymization 3) > Technical deployment (11%, split CDN 3 / Caching 4 / CWV 4) > Foundational completeness (10%, sub-audit rollup) > Search presence (9%, split Tech SEO 3.5 / Tech AEO 3.5 / Subjective copy 2) > Content score (6%, sub-audit rollup).
- Applies the critical-security-override: any Security-category leaf scoring 1 caps the final letter grade at C regardless of arithmetic (build plan Q9, adopted as-is).
- Populates the full XLSX per build plan §4.4: Cover, Executive Scorecard, Rubric (named-range-driven, editable), Audit Tree, one sheet per category, Findings Register, Evidence Index, Config, with the Legion Code Inc. footer on every sheet.

## Non-Goals

- Does not re-score or second-guess an upstream Drone's leaf finding; if a leaf lacks a required evidence pointer or justification, this Drone rejects it back to the originating Drone rather than scoring it anyway (build plan §4.1's mandatory-evidence rule).

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given every leaf score with its evidence and justification, when rollup runs, then N/A (0) leaves are excluded from both numerator and denominator at every rollup level, verified against a hand-computed example in this PRD's QA pass. |
| AC-2 | Given the category weight table, when the final score computes, then the eight category percentages sum to exactly 100% and the final formula matches build plan §4.3 exactly. |
| AC-3 | Given any Security leaf scores 1, then the final letter grade is capped at C and the Executive Scorecard sheet's override banner names the triggering finding. |
| AC-4 | Given the XLSX populates, then every sheet listed in build plan §4.4 exists, the `Rubric` sheet's named ranges are the sole source of every weight used in every formula (retuning a named range changes the final grade without touching a formula), and the Legion Code Inc. footer with mark and link appears on every sheet. |
| AC-5 | Given a leaf finding arrives without an evidence pointer or justification, then this Drone rejects it and returns it to the originating Drone rather than silently scoring it. |

---

## Shared workspace contract

**Reads:**
- Every category folder's output (`03-seo/` through `12-ecommerce/`), `_shared/evidence-index.md`.

**Writes:**
- `scoring/audit-scorecard.xlsx`, `scoring/findings-register.csv`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- [ ] Exact XLSX visual/brand styling beyond the footer mark and link: to be resolved against the Legion Code Inc. brand system (`brand/colors_and_type.css`, `brand/legion.css` from the AC Direct engagement) during Stage 4 (References) of this pair's own forge.

---

## Related

- ../prd-014-web-security-posture/prd-014-web-security-posture-index.md
