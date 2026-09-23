# PRD-013: accessibility-audit (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P1
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

Accessibility audit scored out of 100%, with an AA/AAA-style rating against current WCAG guidance.

---

## Goals

- Scores the crawled page set against WCAG success criteria, producing a single 0-100% score and an AA/AAA-style rating band.
- Every finding cites the specific success criterion and the page/element evidence.

## Non-Goals

- Does not replace a full manual accessibility audit; this is an automated-plus-heuristic pass, reported at the confidence level that implies.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `site-data/`, when the audit runs, then a single aggregate 0-100% score and an AA/AAA-style rating are produced, each backed by per-criterion findings with evidence. |

---

## Shared workspace contract

**Reads:**
- `site-data/`.

**Writes:**
- `06-accessibility/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
