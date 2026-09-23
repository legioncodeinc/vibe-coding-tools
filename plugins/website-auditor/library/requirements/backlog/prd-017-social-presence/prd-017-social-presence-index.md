# PRD-017: social-presence (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P2
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-005. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W5, parallel wave (9 Drones), reads site-data/ read-only, writes to its own subfolder

---

## Overview

Facebook, LinkedIn, and Instagram presence audit that uses the harness's own browser tooling and explicitly prompts the user to authenticate per platform if they want that data, defaulting to a silent no-op (never a score penalty) when authentication is declined or unavailable.

---

## Goals

- Attempts to locate the site's Facebook, LinkedIn, and Instagram presence from on-site links and structured data.
- For each platform, if deeper data (post cadence, engagement, follower count) requires login, prompts the user through the harness's own browser tool to authenticate for that platform specifically, per build-plan Q7.
- If the user declines or authentication isn't available in this harness, no-ops that platform silently: it is excluded from the score (weight 0, per the N/A rule) rather than scored as a failure.

## Non-Goals

- Does not scrape or authenticate to any platform without the user's explicit per-platform opt-in; does not penalize the score for a platform the user chose not to authenticate.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a detectable Facebook/LinkedIn/Instagram link, when the Drone runs, then it prompts the user, through the harness's own browser tool, whether to authenticate for that specific platform before attempting any login-walled data collection. |
| AC-2 | Given the user declines or the harness has no browser-authentication capability, then that platform's checkpoints are scored 0 (N/A/no-op) and excluded from both numerator and denominator, never scored as a failure. |
| AC-3 | Given the user authenticates for a platform, then the resulting findings are evidenced and scored normally like any other checkpoint. |

---

## Shared workspace contract

**Reads:**
- `02-positioning/` for on-site social links.

**Writes:**
- `10-social/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped. This Drone is the concrete implementation of Q7's harness-browser-per-platform-auth-prompt flow.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-005-icp-positioning/prd-005-icp-positioning-index.md
