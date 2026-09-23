---
name: "swarm-audit-stinger"
description: "Swarm audit of a repository: Workflow fleet of single-lens Sonnet investigators, adversarial verification, Opus interpreters and critic, 10-minute check-ins, kill and respawn, nothing unreviewed."
license: AGPL-3.0-or-later
compatibility: "Claude Code 2.1 or newer with the Workflow tool and an ultracode opt-in. Cursor, Codex, and Cowork can load the knowledge but have no Workflow tool; the swarm falls back to their parallel-agent surface."
metadata:
  hive-drone: "swarm-audit-wasp-drone"
  domain: "swarm audits"
  pair-drone: "swarm-audit-wasp-drone"
---

# swarm-audit-stinger

## Purpose

Answers a broad question about a repository (every branch local and remote, the state of the union, where delivery failed, what to do next) by running a Workflow fleet: one Sonnet 5 investigator per lens, two adversarial refuters per material finding with an Opus 5 judge on splits, Opus 5 batch interpreters that each write one report, a completeness critic loop with gap investigators and revisions, and an editor that assembles the master. An observer checks in every 10 minutes, stops and respawns agents that stop making progress, and a coverage ledger guarantees that no workstream or work product goes unreviewed because an agent failed. It produces a master report with every fact labeled VERIFIED, REPORTED, or UNVERIFIABLE-HERE, filed under `library/requirements/reports/<domain>/`. It changes no code.

## When to use

- "Swarm audit", "state of the union", "audit every branch local and remote", "where did the team screw up", "launch an ultracode fleet on this repo", "maximum effort audit".
- A handoff, ledger, or PRD set makes claims that need independent re-verification at scale.
- The question spans more lenses than one agent can hold (git, docs, code, infra, security, product, data, dependencies, timeline).

## When not to use

- A single-lens question (one file, one bug, one PR): dispatch the domain Drone instead.
- The user has not opted into multi-agent orchestration: the Workflow tool needs the word "ultracode", a workflow requested in the user's own words, or ultracode on for the session. Ask, do not assume.
- Plan-versus-implementation QA of one change: that is `quality-stinger`; a security pass of one change is `security-stinger`; repository hygiene alone is `github-repo-health-stinger`.

## Non-negotiables (the owner's directives)

1. At most 100 in-flight agents across every running workflow and spawn. One workflow runs at the runtime cap of min(16, CPUs - 2); wider fan-out shards across parallel workflows and never exceeds the sum of 100.
2. A check-in every 10 minutes from launch to closing report, reading actual output (journal events, transcript growth, expected files), never claimed status.
3. An agent with no progress for 10 minutes, or past its role threshold, is stopped and respawned with a narrower brief. Stop, edit the persisted script, resume from the run id; cached work is never re-paid.
4. No workstream or work product goes unreviewed because an agent failed. Every product has a ledger row with a producer and a reviewer; a null return is a re-dispatch, never a drop; anything still missing at the end is printed under "unreviewed" with its resume command.
5. Cap concurrency, not coverage. Any cap on verification is logged and returned, never silent.
6. Deliver files before any gated action; never route around a permission denial.
7. No em dashes or en dashes in anything written.

## Procedure

1. Confirm the opt-in and the ceilings, read the clock, then scout the repository inline (branches, PRs, docs, toolchains, hazards, live endpoints, upstream provenance) and fix shared prerequisites once. `guides/01-scout-and-plan.md`.
2. Choose lenses (one investigator per concern, single owner for every mutating command), project agents and minutes from the measured medians, and present the plan and a smaller alternative to the owner before launching. `guides/01-scout-and-plan.md`.
3. Author the script from `references/templates/swarm-audit-workflow.js`: replace the brief, constraints, lenses, and report specs; keep `withRetry`, the coverage ledger, the checkpoints, the critic loop, and the reconciliation step. Launch with the args JSON (date included). `guides/02-author-the-fleet-script.md`.
4. Start the 10-minute cadence immediately, confirm the fleet spawned, and at each check-in run `scripts/fleet-status.js`, act on FAILED and STALLED agents (stop, re-brief, resume), and post one status line with the cost signal. `guides/03-run-and-observe.md` and `references/observer-protocol.md`.
5. Let verification, interpretation, and the critic loop run to ready or to the round budget; every finding carries its verification status and corrected wording. `guides/04-verify-interpret-critique.md`.
6. Assemble the master (editor, or the latest checkpoint if the run was cut), run the dash sweep and the single-H1 check, deliver the files, then file into the library and open the PR only with the owner's authorization. `guides/05-assemble-and-deliver.md`.
7. Close with the six-field report and record what the run taught (memory note, re-measured thresholds). `guides/05-assemble-and-deliver.md`.

## References map

- `references/observer-protocol.md`, load when: starting the check-in cadence, deciding whether an agent is stalled, or planning a stop, re-brief, resume.
- `references/templates/swarm-audit-workflow.js`, load when: authoring or editing the fleet script; it is the runnable reference implementation of the non-negotiables.
- `references/research/distilled-swarm-audit.md`, load when: a claim about durations, caps, failure modes, or the critic needs its evidence; every statement cites a raw file.
- `references/research/raw/`, load when: tracing a distilled claim to its source (the exact script that ran, the measured statistics, the failure modes, the critic's findings, the owner's directives, the harness's Workflow contract).
- `scripts/fleet-status.js`, run when: every check-in; prints envelope, per-role medians, failed and stalled agents, and expected-output presence from a transcript directory.
- `scripts/validate.py`, run when: after any edit to this stinger, before reporting done.

## Related drones and stingers

- [quality-stinger](../quality-stinger) - plan-versus-implementation QA of one change; the swarm audit's critic borrows its evidence-over-opinion rule.
- [security-stinger](../security-stinger) - security pass of one change; a swarm audit's security lens is a survey, not a substitute for this gate.
- [github-repo-health-stinger](../github-repo-health-stinger) - repository hygiene audit; the swarm's branch and governance lens overlaps it and hands hygiene fixes to it.
- [swarm-audit-wasp-drone](../../agents/swarm-audit-wasp-drone.md) - the paired Drone: scouts and briefs the fleet, runs each check-in, and assembles the master; the orchestrator launches the Workflow at top level.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [quality-stinger](../quality-stinger) - plan-versus-implementation QA with severity-classified findings.
  - [security-stinger](../security-stinger) - security audit and remediation, first gate of the Ship Gate.
  - [github-repo-health-stinger](../github-repo-health-stinger) - branching, protection, CI density, and repository settings audit.
  - [time-blocked-turns](../time-blocked-turns) - the owner's operating protocol that governs the orchestrator and every worker during a run.

Ship Gate removed: research-only stinger, produces reports and no committable code.
