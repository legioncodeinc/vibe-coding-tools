# PRD-011: internal-linking (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P2
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

Deep-linking and internal link-graph analysis across the crawled page set.

---

## Goals

- Builds an internal link graph from `site-data/`, identifying orphan pages, link-depth outliers, and anchor-text quality.
- Feeds a summary back for prd-008's deep-linking sub-check rather than duplicating the full graph analysis there.

## Non-Goals

- Does not crawl; reads only `site-data/`.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `site-data/`, when the graph builds, then every crawled page's inbound/outbound link count and depth-from-home are computed and orphan pages are flagged explicitly. |

---

## Shared workspace contract

**Reads:**
- `site-data/`.

**Writes:**
- `03-seo/internal-linking.md`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
