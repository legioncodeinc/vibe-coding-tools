---
name: "audit-intake-stinger"
description: "Runs the four-question intake, scaffolds the shared audit workspace, hydrates every template with the answers. First Drone in every engagement, no authorization-capture step by design."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: audit-intake-wasp-drone
  research-window: "2026-08-18 (two sweeps: round 2 initial two sources, round 3 deeper pass adding three more)"
  primary-surface: external-website-audit
---

# Audit Intake Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final Drone/Stinger authorship). Stage 7 (Register: pairing into `pest-controller-suit`, deploy, reference sync) has not run yet.

You are equipping **audit-intake-wasp-drone**, the first Drone in every Website Auditor by Legion Code Inc. engagement (wave W0, sync, blocking). Full scope and acceptance criteria: [prd-002-audit-intake](../../library/requirements/backlog/prd-002-audit-intake/prd-002-audit-intake-index.md).

Every factual claim this skill makes traces to a downloaded primary source in `references/research/raw/`, or is explicitly flagged as an engineering judgment call where the archive is silent. Do not author an intake or scaffolding fact from training data - if it is not in the archive and not flagged as a judgment call, it is not ready to ship yet.

## Purpose

Collect exactly four answers (auditor name, audited-party contact name, audited-party business name, website URL), in that exact order, then scaffold the full `www.<domain>-audit/` workspace and hydrate every downstream template that carries those four fields, so no other Drone in the twenty-pair roster ever has to ask the user anything again.

## When to use this skill

- Starting a brand-new website-audit engagement. This is always the first Drone dispatched (wave W0), before `stack-fingerprint-wasp-drone` or `vendor-inventory-wasp-drone` run.
- The user says "start a new website audit," "audit `<url>`," or asks to run any SEO/AEO/security/accessibility audit on a site with no existing workspace.
- Resuming an interrupted run against an already-scaffolded `www.<domain>-audit/` workspace (detected via `_shared/run-ledger.json`).

## When not to use this skill

- Mid-engagement, against a workspace that already has a completed intake. Detect the existing ledger and resume instead of re-invoking this skill's question flow (`guides/01-intake-procedure.md`, Phase 1).
- To record or verify authorization to audit the target site. This skill never asks that question, by explicit design (PRD-002 non-goals, build plan Q17) - the audited party is assumed to already be the customer's own client or lead.
- To fetch or analyze the landing page itself. That is `stack-fingerprint-wasp-drone`'s and `vendor-inventory-wasp-drone`'s job in wave W1; this skill only records the URL.

## Procedure

1. **Check for an existing workspace first.** Before asking anything, look for `_shared/run-ledger.json`. If found, resume rather than re-ask. See [guides/01-intake-procedure.md](guides/01-intake-procedure.md), Phase 1.
2. **Ask the four questions, in order, one at a time**, refusing to advance past an unanswered or placeholder answer. See [guides/01-intake-procedure.md](guides/01-intake-procedure.md), Phase 2, and [references/templates/intake-questionnaire-template.md](references/templates/intake-questionnaire-template.md) for the exact prompt text.
3. **Derive and confirm the workspace domain** from the website URL, flagging any edge case (port, non-www subdomain, IP host) rather than guessing. See [guides/01-intake-procedure.md](guides/01-intake-procedure.md), Phase 3.
4. **Scaffold the full workspace tree**, every subfolder from the build plan's section 3, empty subfolders included. See [guides/02-workspace-scaffolding.md](guides/02-workspace-scaffolding.md) and run [references/scripts/scaffold-workspace.py](references/scripts/scaffold-workspace.py) to do this deterministically.
5. **Hydrate every downstream template** that carries the four intake fields (XLSX cover sheet, report headers) at scaffold time, not report time. See [guides/03-template-hydration.md](guides/03-template-hydration.md).
6. **Verify no `{placeholder}` token remains** for the four intake fields in any hydrated template before marking this Drone complete in `_shared/run-ledger.json` (PRD-002 AC-3).

## References map

| Path | Load when |
|---|---|
| `guides/01-intake-procedure.md` | Running the four-question flow, including the resume-detection check |
| `guides/02-workspace-scaffolding.md` | Creating the `www.<domain>-audit/` folder tree and the `_shared/` stub files |
| `guides/03-template-hydration.md` | Populating the four intake fields into downstream XLSX/report templates |
| `references/templates/intake-questionnaire-template.md` | The exact four-question prompt text and field keys |
| `references/templates/workspace-folder-tree-scaffold.md` | The annotated full folder tree and scaffolding rules |
| `references/templates/workspace-readme-template.md` | The `README.md` template written at workspace root |
| `references/templates/run-ledger-template.json` | The `_shared/run-ledger.json` schema and hydration shape |
| `references/templates/target-profile-stub-template.json` | The `_shared/target-profile.json` stub shape (unpopulated; hydrated later by stack-fingerprint) |
| `references/templates/evidence-index-stub-template.md` | The `_shared/evidence-index.md` stub shape and append rule |
| `references/scripts/scaffold-workspace.py` | Running the scaffold deterministically instead of hand-authoring each file |
| `references/research/distilled-audit-intake.md` | Verifying any claim in this skill fast, or tracing where it came from |
| `references/research/raw/` | Tracing a claim to its primary source |

## Related drones and stingers

- [audit-intake-wasp-drone](../../agents/audit-intake-wasp-drone.md) - this Stinger's paired Drone.
- [stack-fingerprint-stinger](../stack-fingerprint-stinger) - next in the run (wave W1a), reads the `_shared/target-profile.json` stub this Stinger writes and populates it.
- [vendor-inventory-stinger](../vendor-inventory-stinger) - runs in parallel with stack-fingerprint (wave W1b), also downstream of this workspace scaffold.
- [audit-scoring-stinger](../audit-scoring-stinger) - owns the `scoring/audit-scorecard.xlsx` template whose cover-sheet fields this Stinger hydrates at scaffold time.
- [audit-reporting-stinger](../audit-reporting-stinger) - owns the `reports/` templates whose headers this Stinger hydrates at scaffold time.
- [get-started-stinger](../get-started-stinger) - general repo-scaffolding conventions; consult if the workspace-scaffolding pattern here needs to be reconciled against this plugin repo's own bootstrap conventions (a different concern: that skill scaffolds this repo, this skill scaffolds an external customer's audit workspace).

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [audit-intake-wasp-drone](../../agents/audit-intake-wasp-drone.md) - this Stinger's paired Drone.

## Ship Gate

**Does not apply to this Stinger's own runtime procedure, and that is stated here explicitly rather than left to inference.** The Ship Gate (`security-stinger`, then `quality-stinger`, then `github-repo-health-stinger`, before any commit) gates changes committed to **this plugin repository's own source** (`website-auditor-by-legion-code-inc`). This Stinger's procedure does the opposite of that: it writes into an **external customer's** `www.<domain>-audit/` workspace, a folder this plugin creates on the auditor's machine or shared drive, outside this git repository entirely. Running an audit-intake pass against a customer's engagement never touches this repo's own tracked files, so there is nothing for the Ship Gate to gate.

The Ship Gate DOES apply, separately, to any change to this plugin's own source - for example, if a developer edits `references/scripts/scaffold-workspace.py` or this `SKILL.md` itself and wants to commit that change to this repo. That is ordinary plugin-development work, not this Stinger's audit procedure, and it should go through the full `security-stinger` -> `quality-stinger` -> `github-repo-health-stinger` sequence like any other commit to this repository, per the build plan's Q22 answer ("yes, full Ship Gate, with your approval before any commit or push").
