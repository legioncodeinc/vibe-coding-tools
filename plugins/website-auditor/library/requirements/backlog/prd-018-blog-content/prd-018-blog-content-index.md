# PRD-018: blog-content (Drone + Stinger, bonus/conditional)

> **Status:** Backlog
> **Priority:** P2
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W6a, conditional, parallel with prd-019, runs only if a blog is detected

---

## Overview

Bonus audit of the 10 most recent blog posts: word count, per-post semantic/subjective analysis, and AI-authorship-probability/watermark analysis, reported strictly as a probability band, never a verdict.

---

## Goals

- Runs only when a blog/content-marketing section is detected during crawl or fingerprinting; silently skipped (not scored, not penalized) otherwise.
- For the 10 most recent posts: computes word count, runs per-post semantic/subjective quality analysis (labelled `[subjective]`), and runs AI-authorship-probability analysis.
- AI-authorship findings are reported ONLY as a probability band with the stated detection method and its documented error rate, e.g. 'moderate probability (55-70%) of AI involvement, method X, false-positive rate Y%', never as 'this post was AI-written.'

## Non-Goals

- Does not assert AI authorship as fact under any circumstance, per the honesty constraint in the build plan's research-plan section.
- Does not run if no blog exists; this is not a forced checkpoint.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given no blog is detected, then this Drone's checkpoints resolve to 0 (N/A) and are excluded from the score entirely, not counted as a missed opportunity. |
| AC-2 | Given a blog is detected, then exactly the 10 most recent posts (by published date) are analyzed, each with word count and a `[subjective]`-labelled quality read. |
| AC-3 | Given AI-authorship analysis runs on any post, then the report language is a probability band plus method plus error rate, and a static check rejects any output phrased as a flat verdict ('this is/isn't AI-written'). |

---

## Shared workspace contract

**Reads:**
- `site-data/`.

**Writes:**
- `11-blog/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped. This Drone is the concrete implementation of the AI-content-detection epistemic-honesty constraint (build plan §5, and Q14).

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
