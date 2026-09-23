# PRD-021: audit-reporting (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-020. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W8, sync, needs scores

---

## Overview

Generates the customer-facing and auditor-facing reports, each in Markdown and styled HTML, subtly Legion-branded.

---

## Goals

- Produces four documents per engagement: `reports/customer-report.md`, `.html`, `reports/auditor-report.md`, `.html`.
- Customer report: executive-level, plain-language, leads with the Executive Scorecard, omits raw technical evidence dumps, still discloses the AI-authorship probability bands and de-anonymization findings honestly rather than softening them into vague language.
- Auditor report: full technical detail, every finding with its evidence pointer, the verification log of rejected/reframed candidates, and direct links into the audit workspace.
- Both HTML variants carry the Legion Code Inc. brand system subtly (per the brand token rules: scarce primary-accent use, JetBrains Mono for technical strings, severity-semantic-only color) and the footer 'Audit tool created by Legion Code Inc.' with mark and website link.

## Non-Goals

- Does not invent findings not present in `scoring/findings-register.csv`; report generation is a rendering step, not an analysis step.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a completed `scoring/audit-scorecard.xlsx`, when reports generate, then all four files exist and the customer and auditor Markdown/HTML pairs render the same underlying findings at their respective level of detail, no finding present in one and silently absent from the other's data source. |
| AC-2 | Given the AI-authorship or de-anonymization findings exist, then the customer report states them plainly (probability band, method, error rate for AI-authorship; presence and category for de-anonymization tooling) rather than omitting or vaguing them out. |
| AC-3 | Given either HTML report renders, then the Legion Code Inc. footer, mark, and website link are present exactly once per document, applied per the brand system's scarcity rule, not repeated per section. |

---

## Shared workspace contract

**Reads:**
- `scoring/audit-scorecard.xlsx`, `scoring/findings-register.csv`, `_shared/evidence-index.md`.

**Writes:**
- `reports/customer-report.md`, `.html`, `reports/auditor-report.md`, `.html`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- [ ] Exact brand-token source file to import from (the AC Direct engagement's `brand/legion.css` and `brand/colors_and_type.css`) needs a decision on whether it's vendored into this repo or referenced externally, deferred to Stage 4 (References) of this pair's forge.

---

## Related

- ../prd-020-audit-scoring/prd-020-audit-scoring-index.md
