# PRD-002: audit-intake (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-001. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W0, sync, blocking

---

## Overview

The single entry point for a new engagement. Asks four questions, scaffolds the shared workspace, and hydrates every downstream template with the answers so no other Drone has to ask the user anything again.

---

## Goals

- Collects exactly four answers in order: auditor name, audited-party contact name, audited-party business name, website URL.
- Scaffolds `www.<domain>-audit/` (derived from the URL) with the full folder tree, `README.md` run manifest, `_shared/run-ledger.json`, `_shared/target-profile.json` stub, and `_shared/evidence-index.md` stub, before any other Drone runs.
- Hydrates every template that carries auditor/business/domain fields (report headers, XLSX cover sheet) at scaffold time, not at report time, so a mid-run failure doesn't lose intake data.

## Non-Goals

- Does NOT record or verify authorization/permission to audit the site. Per the user's explicit instruction (build-plan Q17), the audited party is assumed to already be the customer's own client or lead; no authorization-capture step exists anywhere in this Drone.
- Does not fetch the landing page itself (that's prd-003's job); intake only records the URL.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a new engagement, when audit-intake runs, then it asks the four questions in the exact stated order and refuses to proceed past question N until question N-1 has a non-empty answer. |
| AC-2 | Given the four answers, when scaffolding completes, then `www.<domain>-audit/` exists with every subfolder from the build plan's §3 tree, even the ones later Drones will write into (empty is fine, missing is not). |
| AC-3 | Given the scaffold step completes, when any downstream template (XLSX cover, report headers) is inspected, then the auditor name, contact name, business name, and domain are already populated, with no `{placeholder}` tokens remaining for those four fields. |
| AC-4 | Given the skill is re-run against an already-scaffolded workspace, then it detects the existing `_shared/run-ledger.json` and offers to resume rather than re-asking the four questions or clobbering existing artifacts. |

---

## Shared workspace contract

**Reads:**
- None (first Drone in the graph).

**Writes:**
- `www.<domain>-audit/README.md`, `_shared/run-ledger.json`, `_shared/target-profile.json` (stub), `_shared/evidence-index.md` (stub), `00-intake/` (the four recorded answers, engagement reference).

---

## Conduct rules applied

No authorization-recording step exists in this Drone, by explicit user instruction (Q17); this is a deliberate scope exclusion, not an oversight, and should not be re-added without the user revisiting Q17.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-001-website-auditor-plugin/prd-001-website-auditor-plugin-index.md
