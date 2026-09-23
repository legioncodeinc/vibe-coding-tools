# PRD-014: web-security-posture (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-007, prd-004. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

External, passive security-posture audit: headers, TLS, cookies, CSP, platform exposure, client-side injection, and payment-path integrity, the single highest-weighted category in the final score (20%, build plan §4.2).

---

## Goals

- Audits security headers, TLS configuration, cookie flags, CSP, and platform-version exposure from the outside, with no exploitation.
- Cross-references `01-recon/vendor-inventory.md` for third-party script risk and client-side injection surface.
- Assesses payment-path integrity at a passive/observational level only (no real payment instrument, no order placement).

## Non-Goals

- Does not duplicate `security-wasp-drone`'s internal-repo vulnerability catalog; that Drone improves a codebase you own, this Drone externally assesses a deployed site you do not, and cross-links to `security-wasp-drone`'s research archive where the underlying OWASP/header guidance overlaps rather than re-researching it from scratch.
- Does not perform any exploitation, authentication bypass, or file-upload testing by default.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given the landing page and crawled set, when the audit runs, then every security checkpoint resolves to a 0-6 score (or 1/6 boolean for pass/fail checks like HSTS presence) with a header/response evidence pointer. |
| AC-2 | Given any leaf in this category scores 1 (critical), then per the scoring engine's override rule (prd-020, build plan Q9), the final grade is capped at C regardless of arithmetic, and this Drone's output explicitly flags which finding triggered the cap. |
| AC-3 | Given payment-path integrity is assessed, then no real payment instrument or order is used unless interactive mode is explicitly opted into for this run. |

---

## Shared workspace contract

**Reads:**
- `site-data/`, `01-recon/vendor-inventory.md`.

**Writes:**
- `07-security/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-007-site-crawler/prd-007-site-crawler-index.md
- ../prd-004-vendor-inventory/prd-004-vendor-inventory-index.md
