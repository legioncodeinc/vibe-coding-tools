# PRD-008: technical-seo (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P1
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

100-page-depth SEO audit: technical structure, keyword-frequency analysis, long-tail semantic analysis, and deep-linking analysis, scored against the current published SEO standard.

---

## Goals

- Audits technical structure: title/meta/canonical/robots/sitemap/structured-data correctness across the full crawled set, not a sample.
- Runs keyword-frequency analysis against the `content-targets/keywords.md` list from prd-006.
- Runs long-tail semantic analysis, identifying topical coverage gaps against the `content-targets/questions.md` list.
- Runs deep-linking analysis, cross-linked with prd-011's internal-linking graph rather than duplicating it.

## Non-Goals

- Does not re-crawl; reads only from `site-data/` written by prd-007.
- Does not duplicate `seo-aeo-wasp-drone`'s SvelteKit-specific internal-repo remediation scope; cross-links its research archive instead where the underlying SEO standard overlaps.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `site-data/` is populated, when the audit runs, then every crawled page's technical SEO elements are scored on the 0-6 scale with evidence pointers into `site-data/`. |
| AC-2 | Given `content-targets/keywords.md`, then the keyword-frequency and long-tail semantic findings reference specific keyword/question entries by ID, not a generic summary. |

---

## Shared workspace contract

**Reads:**
- `site-data/`, `content-targets/keywords.md`, `content-targets/questions.md`.

**Writes:**
- `03-seo/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
- ../prd-006-keyword-intelligence/prd-006-keyword-intelligence-index.md
