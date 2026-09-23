# PRD-009: aeo-audit (Drone + Stinger)

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

100-page-depth Answer Engine Optimization audit: technical AEO standards (llms.txt, citation-friendly structure, crawler access) and semantic/subjective alignment to AEO-relevant topics.

---

## Goals

- Audits technical AEO standards: `llms.txt` presence and correctness, AI-crawler access rules, citation-friendly content structure (clear Q&A framing, extractable facts).
- Assesses semantic and subjective alignment between the crawled content and the AEO-relevant topics implied by `content-targets/questions.md`, clearly labelling the subjective portion.

## Non-Goals

- Does not duplicate prd-008's technical SEO scope; shares `site-data/` and `content-targets/` but scores distinct AEO-specific checkpoints.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `site-data/`, when the audit runs, then `llms.txt` presence/correctness and AI-crawler access are scored with direct evidence (file fetch result, robots directives). |
| AC-2 | Given the subjective alignment assessment, then every subjective finding is labelled `[subjective]` and kept in a distinct section from the quantified technical findings. |

---

## Shared workspace contract

**Reads:**
- `site-data/`, `content-targets/questions.md`.

**Writes:**
- `04-aeo/`.

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
