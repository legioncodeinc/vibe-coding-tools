# PRD-016: performance-cwv (Drone + Stinger)

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

CDN/caching strategy and Core Web Vitals audit, cross-linked with `lighthouse-pagespeed-wasp-drone` rather than duplicated.

---

## Goals

- Audits CDN/edge-delivery presence and caching-header strategy across the crawled set.
- Collects Core Web Vitals (lab data at minimum; field data where CrUX coverage exists for the domain) and scores against current published thresholds.

## Non-Goals

- Does not re-derive Lighthouse/PageSpeed methodology from scratch; cross-links `lighthouse-pagespeed-wasp-drone`'s research archive for the CWV threshold research, this Drone's own archive covers only what's specific to an external, unauthenticated audit context.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `site-data/`, when the audit runs, then CDN/caching-header findings and CWV scores are produced for the sampled page set, each with a raw-response or lab-run evidence pointer. |

---

## Shared workspace contract

**Reads:**
- `site-data/`.

**Writes:**
- `09-performance/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
