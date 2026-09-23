# PRD-004: vendor-inventory (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-002. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W1b, parallel with prd-003

---

## Overview

Full third-party vendor census of the landing page, including scripts hydrated dynamically through Google Tag Manager and content-injection/metadata-manipulation tools such as Search Atlas.

---

## Goals

- Enumerates every third-party script, tag, pixel, and iframe present after a real headless-browser load (not just static HTML), including anything GTM injects at runtime.
- Specifically detects content-injection/metadata-manipulation tooling (Search Atlas and peer products) as its own flagged category, since these tools alter what an SEO/AEO audit sees.
- Classifies each vendor by function (analytics, tag manager, chat, payments, CRO/testing, SEO-injection, ads, consent/CMP, other) with the evidence (request URL, script src, or DOM node).

## Non-Goals

- Does not judge whether a vendor is 'good' or 'bad'; that interpretation is analytics-stack's (prd-015) and web-security-posture's (prd-014) job, this Drone only inventories.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a landing-page load with JS execution enabled, when the census completes, then every network request to a third-party origin is captured and classified. |
| AC-2 | Given a content-injection/metadata-manipulation tool is present (e.g. Search Atlas), then it is flagged in its own category, distinct from ordinary analytics, and cross-referenced in `01-recon/vendor-inventory.md` for prd-008/prd-009 to account for when interpreting on-page metadata. |

---

## Shared workspace contract

**Reads:**
- `00-intake/` for the target URL, `_shared/target-profile.json` for render-mode context.

**Writes:**
- `01-recon/vendor-inventory.md`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-002-audit-intake/prd-002-audit-intake-index.md
