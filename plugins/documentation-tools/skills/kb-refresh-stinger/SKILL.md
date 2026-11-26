---
name: "kb-refresh-stinger"
description: "Full documentation refresh: inventory, writer fleet, grounded citations, adversarial verification, security and quality gates, one ready PR per unit, PDF plus markdown report, master suspect list."
license: AGPL-3.0-or-later
compatibility: "Claude Code 2.1 or newer with the Workflow tool. Cursor, Codex, and Cowork can load the knowledge but have no Workflow tool; the fleet falls back to their parallel-agent surface."
metadata:
  hive-drone: "kb-refresh-wasp-drone"
  domain: "documentation refresh"
  pair-drone: "kb-refresh-wasp-drone"
---

# kb-refresh-stinger

## Purpose

Turns a stale or thin `library/` into a current, receipt-carrying documentation set, end to end. It inventories what exists, splits the work into units, runs a write-and-attack fleet as wide as the machine and provider accept, gates every unit through security and quality with fix and recheck, ships one ready PR per unit, and closes with a work-accomplished report in markdown plus PDF, a drift report, and a master suspect list of code issues the fleet saw but never touched. Documentation is refreshed; code is never modified.

## Version 3 prerequisites

This capability belongs to `documentation-tools`. Keep Core installed and resolve `kb-refresh-stinger` through Core with the declared workflow key `kb-refresh full repository discovery` before a full refresh. That workflow also needs `code-audit-tools` for Swarm discovery. The repository's `refresh-repository-knowledge` installation profile selects all three packages.

The resolver reads `~/.wasp-nest/installed-plugins.json`, checks matching versions and refuses missing owners or dependencies. After a Claude Code marketplace install the resolver falls back to Claude's own `~/.claude/plugins/installed_plugins.json`; other native marketplace installs are not proven to populate the registry. See the [layout guide](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/learn/reference/PLUGIN-LAYOUT.md) for the required setup. Claude Code's native command is `/documentation-tools:kb-refresh`; a home installation also copies the flat command and generated command-wrapper skill. Use the host's actual skill or agent surface when native dispatch is unavailable.

## When to use

- "Refresh the docs", "kb refresh", "rebuild the knowledge base", "bring the library current with receipts".
- A handoff, audit, or incident showed the docs have drifted from the code and the fix is a rewrite at scale, not a patch to one page.
- A merge wave is coming and the manuals must be current before the owner merges.
- Track documentation freshness, distinguish missing source and runtime proof, or identify which claims actually need refresh.

## When not to use

- One doc needs writing or updating: that is `knowledge-stinger`.
- PRD, IRD, or library lifecycle work (scaffold, issue ingest, backwards-PRD): that is `library-stinger`. This stinger reads those paths and reports drift against them; it never edits them.
- A code audit with no documentation deliverable: that is `swarm-audit-stinger` or the audit-my-code pipeline.
- Customer-facing help center content: that is `knowledge-base-help-center-stinger`.

## Non-negotiables (the owner's directives)

1. **Grounding law.** Every behavioral claim in a doc cites `path:line` on the pinned ref, and the writer re-opened the file immediately before citing. Unverifiable claims are marked `(unverified)` inline. Nothing comes from model memory. The verbatim brief text every agent receives lives in `references/grounding-law.md`.
2. **Read-only fleet.** Fleet agents write only the docs they own, their own sus log, and run-workspace reports. No code changes, no repairs, no refactors, no state-changing git by writers. A suspected bug, security hole, or functional problem is logged in the sus log with `file:line` and moved past, never fixed.
3. **Fenced write scope.** Default target is `library/knowledge/private/**` plus whatever requirements docs the owner names. The repo's frozen set (contracts, ADRs, history, ledgers, anything the handoff freezes) is read-only.
4. **Secrets.** Environment variable names are fine. Secret values, tokens, keys, passwords, private hostnames, and customer data never enter docs, gate reports, PR bodies, or sus logs.
5. **Fleet width.** Spawn as many agents as the device and provider accept; shard into parallel workflows when one workflow's cap is the binding constraint. Caps on concurrency are logged, coverage is never silently cut. Check-in cadence, kill and respawn, and the coverage ledger come from `swarm-audit-stinger`.
6. **Ship ready, never draft.** One PR per unit, gate evidence in the PR body, and no push or PR without the owner's explicit yes.
7. **No em dashes or en dashes** in anything written.
8. **The sus list is mandatory even when empty.** An agent that found nothing appends a dated "nothing found" line; the master exists at the end regardless.

## Procedure

1. **Intake and inventory.** Read the assignment, pin the ref and record its commit, scout the repo (branches, library tree, commit and PR history facts, toolchains, hazards), classify every existing doc as keep, update, or write, and split the work into domain units with disjoint file sets. Present the plan, the shard layout, a projected cost, and a smaller alternative to the owner before any fleet spends. `guides/01-inventory-and-plan.md`. Before treating age as drift, use `guides/05-track-freshness-and-missing-proof.md` and `references/templates/documentation-freshness-receipts.md`. Record claim type, exact revision, source re-open, actual proof and unchecked coverage. Age is triage, not a semantic verdict.
2. **Write and attack.** Author the shard scripts, launch the fleet, run the 10 minute check-ins, and per unit run: writer, then adversarial verifier that independently re-opens every citation (up to 3 rounds), then fixer. Every brief embeds the grounding law verbatim. `guides/02-write-and-verify.md`.
3. **Gate.** Per unit: security gate (secrets scan of docs and PR body) with fix and recheck, then quality gate (completeness against the unit plan, citation sweep, dash sweep) with fix and recheck. A unit that cannot pass reports its residuals; residuals travel to the PR body, never get dropped silently. `guides/03-gates-and-ship.md`.
4. **Ship.** Per unit, from a throwaway detached worktree: branch from the pinned base ref, check out that unit's files from the docs branch, commit with explicit paths only, run the repo's validation script, push, open the ready PR with the gate summary in the body. Close with the batched PR list and the merge brief for whoever merges. `guides/03-gates-and-ship.md`.
5. **Report and suspects.** Assemble the work-accomplished report in markdown, render the PDF from the branded HTML, concatenate every agent's sus log into the master suspect list, and file the drift report. `guides/04-report-and-sus-list.md`.
6. **Close.** Deliver the six-field closing report and record what the run taught (memory note, re-measured thresholds). `guides/04-report-and-sus-list.md`.

## References map

- `references/grounding-law.md`, load when: briefing any agent (writer, verifier, fixer, gater) or judging whether a doc line is properly grounded. Contains the verbatim brief text and the secrets policy.
- `references/sus-log-protocol.md`, load when: starting a run (so agents log from the first hour) or concatenating the master suspect list at the end.
- `references/report-spec.md`, load when: writing the final work report or rendering the PDF. Contains the report structure, the HTML print-sheet recipe, and the exact Chrome command.
- `references/ops-notes.md`, load when: pausing, resuming, or amending a running fleet, or when the provider throttles or caps.
- `references/research/distilled-kb-refresh.md`, load when: a process claim needs its evidence or the reference run's numbers are needed; every statement cites a raw file.
- Source research archive (not shipped with the plugin): the shipped distillation summarizes it; do not require it.
- [Freshness and missing proof guide](guides/05-track-freshness-and-missing-proof.md), load when: deciding which material claims need refresh and what remains unsupported.
- [Claim receipt worksheet](references/templates/documentation-freshness-receipts.md), load when: recording exact source pins, re-opens, proof types and unchecked coverage.
- [Synthetic freshness examples](references/examples/documentation-freshness/worked-receipts.md), load when: distinguishing changed definitions, moved locators, missing receipts, historical formats and unresolved contradictions.
- `scripts/md-to-pdf.sh`, run when: rendering the report PDF from the print-styled HTML.
- `scripts/validate.py`, run when: after any edit to this stinger, before reporting done.

## Related drones and stingers

- [kb-refresh-wasp-drone](../../agents/kb-refresh-wasp-drone.md) - the paired Drone: plans the run, runs check-ins and gates, assembles the report, the merge brief, and the master suspect list; the orchestrator launches the Workflows at top level.
`swarm-audit-stinger` - the fleet mechanics donor: check-in cadence, observer protocol, kill and respawn, coverage ledger, workflow template skeleton.
`knowledge-stinger` - the doc format law: document template, domain taxonomy, progressive disclosure. Fleet writers work to it.
`library-stinger` - the library path law: where docs, PRDs, IRDs, and reports live. This pipeline writes docs paths it owns and only reads the rest.
`security-stinger` - the security gate's posture; the per-unit gate is a docs and PR body scan in that style.
`quality-stinger` - the quality gate's posture; the per-unit gate is a completeness and citation audit in that style.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - `swarm-audit-stinger` - fleet observation, coverage ledger, and the workflow template this pipeline shards from.
  - `knowledge-stinger` - narrative knowledge doc format and domain taxonomy the fleet writes to.
  - `library-stinger` - library schema v2 paths and the PRD/IRD lifecycle this pipeline reports drift against.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

In this pipeline the first two gates run per unit during step 3 (security, then quality, each with fix and recheck), and github-repo-health-stinger runs at orchestrator level once, before the final push wave. Nothing is committed or pushed without the owner reviewing the reports and giving the explicit yes.

The kb-refresh Drone is research-only and carries no Ship Gate of its own. This gate belongs to the orchestrator that runs the pipeline and ships the unit PRs, and it applies to the documentation commits and PRs that step produces.
