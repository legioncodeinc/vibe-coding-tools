# PRD-022: orchestration: perform-website-audit command + master-website-auditor skill

> **Status:** Backlog
> **Priority:** P0
> **Effort:** XL
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-002, prd-020, prd-021. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** Spans the whole run, W0 through W8

---

## Overview

The two entry points that drive the entire audit: the `perform-website-audit` command (for harnesses with native command/agent dispatch) and the `master-website-auditor` fallback skill (for harnesses without it), both sequencing the same 20 Drone/Stinger pairs the same way.

---

## Goals

- Command `perform-website-audit` loads `pest-controller-suit` first (per the closed-loop convention) and dispatches all 20 pairs in the exact order and parallelism of the build plan's dependency graph (build plan §2): W0 intake sync, W1a/W1b parallel, W2 ICP sync with hard gate, W3 keywords sync, W4 crawl sync, W5 nine-wide parallel wave plus independent social-presence, W6a/W6b conditional parallel, W7 scoring sync, W8 reporting sync.
- Skill `master-website-auditor` activates the identical 20 Drone/Stinger pairs as an orchestrator when the harness lacks command/agent support, producing identical outputs in the identical shared workspace.
- Both entry points instruct every dispatched sub-agent/skill to write into the shared `www.<domain>-audit/` workspace (build plan §3), never into an ad-hoc location.
- Both target all four harnesses per Q19: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork, per the harness-support-matrix's per-harness command/agent/skill placement rules.

## Non-Goals

- Does not implement any audit logic itself; this pair is pure sequencing and dispatch, all domain logic lives in the 20 pairs it orchestrates.
- Does not silently fall back to sequential execution where the dependency graph allows parallelism, i.e. Wave 5's nine Drones must genuinely run concurrently, not merely be listed together and executed one at a time.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given `perform-website-audit example.com` on a harness with native dispatch, when the run completes, then every wave executed in the graph's stated order, Wave 5's Drones ran concurrently (verified by overlapping timestamps in `_shared/run-ledger.json`), and the ICP hard gate halted the run on a test site engineered to have no determinable focus. |
| AC-2 | Given the same domain on a harness without native command/agent dispatch, when `master-website-auditor` is invoked instead, then the resulting `www.<domain>-audit/` workspace is structurally identical to AC-1's output (same folders populated, same dependency order honored). |
| AC-3 | Given all four target harnesses, when the plugin is installed on each, then both entry points are reachable using that harness's native invocation method per the harness-support-matrix (Claude Code slash command, Cursor equivalent, Codex prompt/skill equivalent, Cowork's flat `commands/` + `skills/` layout for the slash-invocation bug workaround). |

---

## Shared workspace contract

**Reads:**
- `_shared/run-ledger.json` (to sequence and verify wave completion before dispatching the next wave).

**Writes:**
- Nothing directly; orchestration only dispatches, the dispatched pairs write their own outputs.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped. This pair is also the sole owner of enforcing the dependency-graph's sync/parallel split at runtime; get it wrong and every downstream conduct-rule guarantee about evidence-at-finding-time still holds per-Drone, but the wall-clock benefit of the 9-wide wave is lost.

---

## Open questions

- None outstanding; all scope questions were resolved in the build plan's 22 recorded answers.

---

## Related

- ../prd-002-audit-intake/prd-002-audit-intake-index.md
- ../prd-020-audit-scoring/prd-020-audit-scoring-index.md
- ../prd-021-audit-reporting/prd-021-audit-reporting-index.md
