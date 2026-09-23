# PRD-015: analytics-stack (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P1
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-004. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

Foundational analytics, industry-specific analytics, and de-anonymization tooling (where legal) audit, built on top of `vendor-inventory`'s census.

---

## Goals

- Assesses foundational analytics coverage (e.g. GA4-class tooling) presence and basic correctness.
- Assesses industry-specific analytics tooling appropriate to the site's niche (from `02-positioning/`).
- Identifies de-anonymization/visitor-identification tooling where legally permissible in the site's apparent jurisdiction, flagged distinctly and never assumed to be malicious by default.

## Non-Goals

- Does not judge consent/privacy-law compliance in depth; flags what's present, `web-security-posture` and the customer's own counsel own the legal read.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `01-recon/vendor-inventory.md`, when the audit runs, then every analytics-classified vendor is scored for foundational coverage, industry fit, and (where detected) de-anonymization capability, each with its own evidence pointer. |

---

## Shared workspace contract

**Reads:**
- `01-recon/vendor-inventory.md`, `02-positioning/`.

**Writes:**
- `08-analytics/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-004-vendor-inventory/prd-004-vendor-inventory-index.md
