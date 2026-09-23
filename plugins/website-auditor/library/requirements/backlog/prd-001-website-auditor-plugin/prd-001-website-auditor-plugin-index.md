# PRD-001: Website Auditor by Legion Code Inc. (master)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** XL
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** nothing (first component in the graph).

**Execution wave:** N/A: this is the umbrella PRD for all sub-PRDs below.

---

## Overview

A distributable Wasp Nest plugin, `website-auditor-by-legion-code-inc`, that turns the ad-hoc AC Direct audit process (AEO/SEO, Magento security, checkout/registration, Legion branding) into a repeatable, harness-portable audit tool for any website. Ships a command (`perform-website-audit`), a fallback orchestrator skill (`master-website-auditor`), 20 Drone/Stinger pairs, a branded XLSX scoring template, and branded Markdown+HTML report templates for both customer and auditor audiences.

---

## Goals

- One command or one skill invocation runs a full audit of a given domain end to end, writing every artifact into a shared `www.<domain>-audit/` workspace.
- The plugin installs and functions across all four target harnesses: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork (build-plan Q19).
- Every scored checkpoint carries a numeric value, an evidence pointer, and a justification; N/A checkpoints never drag down a score.
- The XLSX and both report formats carry the Legion Code Inc. footer mark and link, applied subtly per the brand system's scarcity rule.
- The 6 conduct rules (read-only default, evidence-at-finding-time, quantified-unless-subjective, verification log, confidence-stated-not-implied, hard-gate-holds) are enforced across every sub-component, not just documented once.

## Non-Goals

- Does not exploit, authenticate as, or place orders on the audited site by default.
- Does not duplicate the existing repo-improvement Drones (`seo-aeo-wasp-drone`, `security-wasp-drone`, `lighthouse-pagespeed-wasp-drone`): those improve a repo you own, this plugin externally assesses a site you do not, and cross-links rather than forks their research archives where the domain overlaps.
- Does not build the Google Search Console MCP server itself, that is a separate project the user owns; this plugin only consumes it when present (see prd-006).

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a fresh clone of this repo with no prior audit run, when `perform-website-audit example.com` (or the equivalent Cowork/Cursor/Codex invocation) is issued, then a `www.example.com-audit/` workspace is created with the folder tree in prd-001's related build plan section 3, and every applicable sub-Drone's output lands in its assigned subfolder. |
| AC-2 | Given the harness lacks native command/agent dispatch (per harness-support-matrix.md), when the user instead invokes the `master-website-auditor` skill, then the same 20 Drone/Stinger pairs run in the same dependency order with the same outputs. |
| AC-3 | Given the ICP/positioning gate (prd-005) cannot determine the site's focus, when the run reaches wave 2, then the run halts, reports a critical failure, and asks the user for clarification rather than guessing and continuing. |
| AC-4 | Given a completed run, when the final XLSX and both report pairs are opened, then all carry the Legion Code Inc. footer, and the XLSX `Rubric` sheet's named ranges alone determine every formula's weights (retunable without touching a formula). |

---

## Shared workspace contract

**Reads:**
- N/A at the master level; see individual sub-PRDs.

**Writes:**
- N/A at the master level; see individual sub-PRDs.

---

## Conduct rules applied

This PRD is the single point where all 6 conduct rules are declared binding on every descendant component; sub-PRDs reference this section rather than restating it in full.

---

## Open questions

- [ ] Public GitHub distribution vs. internal-only (build plan Q2): still undecided, does not block build, blocks the eventual `org`/`repo_url`/`license_name` fields in the repo scaffold from step 1.
- [ ] Exact category weight percentages (build plan §4.2) are the author's proposal; the user adopted them as-is per Q9 but may retune later via the XLSX `Rubric` sheet's named ranges without a rebuild.

---

## Related

- ../../../plan/website-auditor-build-plan.md (Stage-1 Topic document, full component inventory, dependency graph, scoring rubric, folder spec, and the 22 recorded Q&A answers this PRD set implements)
