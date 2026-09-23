# PRD-007: site-crawler (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-003. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W4, sync, needs stack type

---

## Overview

Platform-aware crawl to a depth of 100 pages, storing raw HTML and Markdown per page under `site-data/`, which every Wave-5 Drone then reads read-only.

---

## Goals

- Selects a crawl strategy from `target-profile.json`'s detected platform, per the build plan's platform guides (Shopify needs `/collections/` and `/products/` traversal; SvelteKit needs route-manifest discovery; WordPress needs `/wp-json/` and category pagination; and so on).
- Crawls up to 100 pages, respecting robots.txt and reasonable rate limits, storing each page's raw HTML and a Markdown extraction under `site-data/<slug>.html` / `<slug>.md`.
- Writes once; every Wave-5 Drone reads this folder read-only with no write contention.

## Non-Goals

- Does not crawl authenticated/gated areas, does not submit forms, does not exceed 100 pages without explicit user opt-in for a deeper crawl.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `target-profile.json` names a supported platform, when the crawl runs, then it uses that platform's specific traversal strategy rather than a generic link-follow. |
| AC-2 | Given the crawl completes, then `site-data/` contains up to 100 page pairs (`.html` + `.md`), each derived from a real fetch at crawl time, not reconstructed later. |
| AC-3 | Given `site-data/` is fully written, when any of the 9 Wave-5 Drones start, then none of them re-fetch pages already present in `site-data/`. |

---

## Shared workspace contract

**Reads:**
- `_shared/target-profile.json`.

**Writes:**
- `site-data/<slug>.html`, `site-data/<slug>.md` (up to 100 pages).

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-003-stack-fingerprint/prd-003-stack-fingerprint-index.md
