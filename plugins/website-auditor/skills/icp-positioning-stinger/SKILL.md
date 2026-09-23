---
name: "icp-positioning-stinger"
description: "Niche/ICP/goal assessment, conversion-action taxonomy, two-stage buyer-readiness model. Owns the run's hard focus-undeterminable gate: halts and asks rather than guessing."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: icp-positioning-wasp-drone
  research-window: "2026-08-18 (two sweeps: round 2 initial two sources, round 3 deeper pass adding three more)"
  primary-surface: external-website-audit
---

# Icp Positioning Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final Drone/Stinger authorship). Stage 7 (Register: pairing into `pest-controller-suit`, deploy, reference sync) has not run yet.

You are equipping **icp-positioning-wasp-drone**, wave W2 of the Website Auditor by Legion Code Inc. engagement (sync, HARD GATE). Full scope and acceptance criteria: [prd-005-icp-positioning](../../library/requirements/backlog/prd-005-icp-positioning/prd-005-icp-positioning-index.md).

Every factual claim this skill makes traces to a downloaded primary source in `references/research/raw/`, or is explicitly flagged as an engineering judgment call where the archive is silent - most notably the two-stage buyer-readiness model (see [guides/03-buyer-readiness-model.md](guides/03-buyer-readiness-model.md)) and the hard-stop gate's exact firing threshold (see [guides/04-hard-stop-gate.md](guides/04-hard-stop-gate.md)), neither of which is independently sourced in this archive.

## Purpose

Determine the audited site's niche, ideal customer profile, primary business goal, and conversion-action taxonomy from external observation alone, apply a two-stage buyer-readiness framing, and enforce this run's one hard stop: halt and ask rather than guess when the site's focus cannot be determined.

## When to use this skill

- Wave W2 of every audit run, always after both `stack-fingerprint-wasp-drone` (W1a) and `vendor-inventory-wasp-drone` (W1b) complete.
- Any time downstream content, keyword, or funnel work needs a grounded ICP rather than an assumption - `keyword-intelligence-wasp-drone` (W3) reads this Drone's output and must not re-derive niche or ICP itself (PRD-005 AC-3).
- Deciding whether the run should halt on a critical focus-undeterminable failure.

## When not to use this skill

- Before W1a/W1b complete. This skill reads `01-recon/stack-fingerprint.md` and `01-recon/vendor-inventory.md`; running early means working from nothing.
- To build an ICP from a company's own CRM/closed-won data. That is a fundamentally different problem than this Drone solves (external inference from a third-party site, not internal sales-data mining) - see [guides/01-icp-assessment-procedure.md](guides/01-icp-assessment-procedure.md) Phase 2 for why the two ICP-methodology sources in this archive only supply vocabulary, not procedure, for this Drone's actual task.
- To continue past the hard gate on a low-confidence guess. A stated low-confidence output is acceptable; silent continuation past an undeterminable focus is not (PRD-005 non-goals).

## Procedure

1. **Read the required inputs**: `01-recon/stack-fingerprint.md` and `01-recon/vendor-inventory.md`. See [guides/01-icp-assessment-procedure.md](guides/01-icp-assessment-procedure.md), Phase 1.
2. **Infer niche and ICP from external observation** (landing-page copy, navigation, detected integrations), stating a confidence level for each output section. See [guides/01-icp-assessment-procedure.md](guides/01-icp-assessment-procedure.md), Phase 2, and [references/templates/icp-assessment-output-template.md](references/templates/icp-assessment-output-template.md).
3. **Build the conversion-action taxonomy** (macro / process-milestone micro / secondary-action micro), before the buyer-readiness step. See [guides/02-conversion-taxonomy.md](guides/02-conversion-taxonomy.md) and [references/templates/conversion-action-taxonomy-worksheet.md](references/templates/conversion-action-taxonomy-worksheet.md).
4. **Apply the two-stage buyer-readiness framing**, built as an explicit, stated collapse of the sourced three-stage awareness/consideration/decision model, never presented as independently sourced. See [guides/03-buyer-readiness-model.md](guides/03-buyer-readiness-model.md) and [references/templates/buyer-readiness-scoring-worksheet.md](references/templates/buyer-readiness-scoring-worksheet.md).
5. **Evaluate the hard-stop gate**, after attempting steps 2-4, not before. See [guides/04-hard-stop-gate.md](guides/04-hard-stop-gate.md).
6. **If the gate passes**: write `02-positioning/niche-icp-assessment.md`, `conversion-taxonomy.md`, and `buyer-readiness.md`; mark this Drone complete in `_shared/run-ledger.json`; allow the run to proceed to wave W3.
7. **If the gate fails**: do not write those three files as completed output. Follow the halt procedure in [guides/04-hard-stop-gate.md](guides/04-hard-stop-gate.md) - report a critical failure, ask the user, and block every later wave from starting against this workspace.

## References map

| Path | Load when |
|---|---|
| `guides/01-icp-assessment-procedure.md` | Running the full W2 pass end to end, including the input-reading and output-routing steps |
| `guides/02-conversion-taxonomy.md` | Classifying detected conversion actions as macro / process-milestone micro / secondary-action micro |
| `guides/03-buyer-readiness-model.md` | Applying the two-stage awareness/decision framing and understanding its collapse-rule grounding |
| `guides/04-hard-stop-gate.md` | Deciding whether the site's focus is determinable, and the halt procedure if it is not |
| `references/templates/icp-assessment-output-template.md` | The `02-positioning/niche-icp-assessment.md` output shape, confidence fields included |
| `references/templates/conversion-action-taxonomy-worksheet.md` | The `02-positioning/conversion-taxonomy.md` working worksheet |
| `references/templates/buyer-readiness-scoring-worksheet.md` | The `02-positioning/buyer-readiness.md` working worksheet, with the collapse rule spelled out |
| `references/research/distilled-icp-positioning.md` | Verifying any claim in this skill fast, or tracing where it came from |
| `references/research/raw/` | Tracing a claim to its primary source |

## Related drones and stingers

- [icp-positioning-wasp-drone](../../agents/icp-positioning-wasp-drone.md) - this Stinger's paired Drone.
- [audit-intake-stinger](../audit-intake-stinger) - upstream, wave W0; scaffolds the workspace this Stinger writes `02-positioning/` into.
- [stack-fingerprint-stinger](../stack-fingerprint-stinger) - upstream, wave W1a; this Stinger reads its `01-recon/stack-fingerprint.md` output.
- [vendor-inventory-stinger](../vendor-inventory-stinger) - upstream, wave W1b; this Stinger reads its `01-recon/vendor-inventory.md` output.
- [keyword-intelligence-stinger](../keyword-intelligence-stinger) - downstream, wave W3; reads this Stinger's `02-positioning/` output and must not re-derive niche or ICP itself (PRD-005 AC-3).
- [seo-aeo-stinger](../seo-aeo-stinger) - a related, non-paired Stinger from the existing Wasp Nest roster; consult where a keyword-relevance or content-targeting question overlaps with this pair's ICP output, per the build plan's note that new pairs cite existing Stingers as related skills rather than duplicating their catalogs.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [icp-positioning-wasp-drone](../../agents/icp-positioning-wasp-drone.md) - this Stinger's paired Drone.

## Ship Gate

**Does not apply to this Stinger's own runtime procedure, and that is stated here explicitly rather than left to inference.** The Ship Gate (`security-stinger`, then `quality-stinger`, then `github-repo-health-stinger`, before any commit) gates changes committed to **this plugin repository's own source** (`website-auditor-by-legion-code-inc`). This Stinger's procedure writes into an **external customer's** `www.<domain>-audit/` workspace (`02-positioning/`), never into this repo's own tracked files, so a normal audit run never touches anything the Ship Gate is built to protect.

The Ship Gate DOES apply, separately, to any change to this plugin's own source - for example, editing this `SKILL.md`, its guides, or its templates and committing that change to this repository. That is ordinary plugin-development work, not this Stinger's audit procedure, and it goes through the full `security-stinger` -> `quality-stinger` -> `github-repo-health-stinger` sequence like any other commit to this repository, per the build plan's Q22 answer.
