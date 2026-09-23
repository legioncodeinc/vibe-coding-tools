# PRD-019: ecommerce-catalog (Drone + Stinger, bonus/conditional)

> **Status:** Backlog
> **Priority:** P2
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W6b, conditional, parallel with prd-018, runs only if commerce is detected

---

## Overview

Bonus audit of up to 25 products across categories: metadata completeness, on-page copy quality, and subjective conversion-potential analysis.

---

## Goals

- Runs only when commerce (Shopify, Magento, or headless-commerce per `shared-headless-commerce.md`) is detected; silently skipped otherwise.
- Samples up to 25 products across distinct categories (not all from one category) from `site-data/`.
- Scores metadata completeness (title, price, availability, structured-data product markup) as quantified findings; scores on-page copy quality and conversion potential as `[subjective]` findings, kept separate.

## Non-Goals

- Does not place an order or add-to-cart by default (conduct rule 1); does not run if no commerce is detected.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given no commerce platform is detected, then this Drone's checkpoints resolve to 0 (N/A) and are excluded from the score. |
| AC-2 | Given commerce is detected, then up to 25 products are sampled across multiple categories, each scored for metadata completeness (quantified) and copy/conversion quality (`[subjective]`, clearly separated). |

---

## Shared workspace contract

**Reads:**
- `site-data/`, `_shared/target-profile.json`.

**Writes:**
- `12-ecommerce/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
