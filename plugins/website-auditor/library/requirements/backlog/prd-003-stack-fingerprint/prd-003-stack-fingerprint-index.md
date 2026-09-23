# PRD-003: stack-fingerprint (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** M
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-002. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W1a, parallel with prd-004

---

## Overview

Fingerprints the audited site's technology stack and render mode from the landing page alone, no crawl required, so downstream Drones (especially prd-007's crawler) know how to navigate the site.

---

## Goals

- Classifies the stack into one of: React+Vite/Postgres, Next.js/Postgres, SvelteKit/Postgres (the three 'vibe-code' stacks), WordPress+PHP+MySQL, Shopify, or Magento+PHP+MySQL, with a stated confidence level per classification.
- Detects render mode: server-side rendered, client-side rendered, or a named hybrid/other, from response body plus a single headless-browser load, not from documentation claims.
- Writes `target-profile.json` (platform, rendering, stack, confidence) that every later Drone reads instead of re-detecting.

## Non-Goals

- Does not crawl beyond the landing page and its immediately linked static assets.
- Does not attempt to fingerprint a stack this Stinger's research archive doesn't cover; an unrecognized stack is reported as `unknown` with the raw signals that failed to match, not forced into the nearest known category.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a landing page fetch, when fingerprinting completes, then `target-profile.json` contains a non-null `stack`, `rendering`, and `confidence` field. |
| AC-2 | Given a site this Stinger cannot classify, then `stack` is explicitly `unknown` with the collected raw signals attached, never a best-guess label presented as fact. |
| AC-3 | Given the fingerprint completes, when prd-007's site-crawler reads `target-profile.json`, then it can select the correct platform-specific crawl guide (build plan §6) without re-detecting anything itself. |

---

## Shared workspace contract

**Reads:**
- `00-intake/` for the target URL.

**Writes:**
- `_shared/target-profile.json`, `01-recon/stack-fingerprint.md`.

---

## Conduct rules applied

Findings here are quantified (detected header, detected build artifact signature, detected meta-generator tag), not subjective; any inference weaker than direct evidence is reported at reduced confidence, never upgraded to certainty.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-002-audit-intake/prd-002-audit-intake-index.md
- prd-006 (Q6 keyword source ordering references stack context indirectly via ICP, not this Drone directly)
