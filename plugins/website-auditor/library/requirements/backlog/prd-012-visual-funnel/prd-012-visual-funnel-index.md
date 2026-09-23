# PRD-012: visual-funnel (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P1
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-005. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

25-page-depth visual customer-funnel audit using real desktop (1440x900) and mobile (390x844, real mobile UA) Chrome sessions, representing genuine customer interaction end to end.

---

## Goals

- Walks the conversion funnel identified in `02-positioning/` (up to 25 pages: landing, category/product, cart/lead-form, checkout/submit steps, confirmation) as a real customer would.
- Captures a desktop screenshot (1440x900) and a mobile screenshot (390x844, real mobile Chrome user agent) at every instructed checkpoint, written at the moment of capture.
- Scores each funnel step's visual UX/UI and navigation/user-journey quality, feeding the Revenue-drivers category (build plan §4.2).

## Non-Goals

- Does not complete a real purchase or submit a real lead form by default; that is opt-in interactive mode (conduct rule 1, default OFF per Q16).

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given the funnel identified by prd-005, when the walk runs, then both a desktop and a mobile screenshot exist for every checkpoint, stored under `visual/desktop/` and `visual/mobile/` respectively. |
| AC-2 | Given interactive/stateful mode is OFF (the default), then the funnel walk stops short of any state-creating action (final submit/purchase) and scores what it can observe up to that point, with a note explaining why the last step wasn't captured. |
| AC-3 | Given interactive mode is explicitly opted into for this run, then the walk proceeds through the state-creating step using no real credentials and no real payment instrument, per conduct rule 1. |

---

## Shared workspace contract

**Reads:**
- `02-positioning/`.

**Writes:**
- `visual/desktop/`, `visual/mobile/`, `05-funnel/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped. This Drone is the primary owner of conduct rule 1's opt-in boundary.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-005-icp-positioning/prd-005-icp-positioning-index.md
