# PRD-010: content-semantics (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P2
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007, prd-005. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

Subjective copy interpretation: reading-level estimate and ICP-relevancy scoring for the crawled content set, clearly separated from the quantified audits.

---

## Goals

- Computes a quantified reading-level estimate (a standard formula, e.g. Flesch-Kincaid) per page and in aggregate.
- Produces a subjective ICP-relevancy score per page against `02-positioning/`'s ICP, labelled `[subjective]`.

## Non-Goals

- Does not overlap prd-008/prd-009's technical scope; this Drone is the subjective-copy-quality specialist, they own technical structure.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `site-data/`, then every page gets a quantified reading-level score with the formula and inputs shown. |
| AC-2 | Given `02-positioning/`, then every page gets a `[subjective]` ICP-relevancy score, kept in a clearly separate section from the reading-level numbers. |

---

## Shared workspace contract

**Reads:**
- `site-data/`, `02-positioning/`.

**Writes:**
- `03-seo/content-semantics.md` (cross-linked from `03-seo/` since content quality is part of the search-presence category per the build plan's weight table).

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
