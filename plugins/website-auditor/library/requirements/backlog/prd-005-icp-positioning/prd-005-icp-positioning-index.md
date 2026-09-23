# PRD-005: icp-positioning (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-003, prd-004. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W2, sync, HARD GATE

---

## Overview

Determines the site's niche, ideal customer profile, and business goal; builds a conversion-action taxonomy and a two-stage buyer-readiness model. Contains the run's one hard stop: if the site's focus cannot be determined, the run halts rather than guessing.

---

## Goals

- Produces a written ICP/niche assessment with a confidence level, grounded in landing-page copy, navigation structure, and detected conversion actions, not assumption.
- Builds an explicit conversion-action taxonomy (e.g. purchase, lead-form submit, phone call, newsletter signup, account creation, booking) specific to this site.
- Applies a two-stage buyer-readiness model (e.g. awareness-stage visitor vs. decision-stage visitor) to frame later content and funnel analysis.
- Implements the HARD GATE: if the site's purpose/focus cannot be determined with reasonable confidence after landing-page and nav analysis, the run stops, reports a critical failure, and asks the user for clarification rather than continuing on a guess.

## Non-Goals

- Does not proceed past the gate on a low-confidence guess; low confidence with a stated reason is acceptable output, silent continuation is not.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given stack-fingerprint and vendor-inventory outputs, when positioning analysis runs, then it produces a niche, an ICP description, a conversion-action taxonomy, and a buyer-readiness framing, each with a stated confidence level. |
| AC-2 | Given a site whose purpose cannot be determined (e.g. a broken landing page, a holding page, or genuinely ambiguous copy), when confidence falls below the Stinger's stated threshold, then the run halts with a critical-failure gate message and does not proceed to prd-006 or any later wave. |
| AC-3 | Given the gate passes, when prd-006 (keyword-intelligence) reads `02-positioning/`, then it has everything it needs to generate ICP-relevant keywords without re-deriving niche or ICP itself. |

---

## Shared workspace contract

**Reads:**
- `01-recon/stack-fingerprint.md`, `01-recon/vendor-inventory.md`.

**Writes:**
- `02-positioning/` (niche, ICP, conversion actions, buyer stages).

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped. The hard gate itself is conduct rule 6 made concrete: a critical failure, not a low-confidence guess, per the build plan's explicit instruction.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-003-stack-fingerprint/prd-003-stack-fingerprint-index.md
- ../prd-004-vendor-inventory/prd-004-vendor-inventory-index.md
