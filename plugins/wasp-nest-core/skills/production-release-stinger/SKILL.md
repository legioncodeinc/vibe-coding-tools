---
name: "production-release-stinger"
description: "Execute the complete production release for any project, adapting to its tier (push-to-main through freeze-gated owner dispatch). Use for production-release, ship to production, deploy to live."
license: AGPL-3.0-or-later
compatibility: "Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork"
metadata:
  hive-tier: specialist
  paired-drone: production-release-wasp-drone
  domain: release-execution
---

# Production Release Stinger

## Purpose

Executes a production release end to end for any project: authorization check, pipeline completion to an exact main SHA, tier detection, the dispatch preflight, dispatch, run-watch, and verified thaw. Replaces the historical five-attempt dispatch gauntlet with a one-pass preflight. Produces a run-watch report with real run URLs as evidence.

## When to use

- "production-release", "ship to production", "deploy to live" for this or any named project
- A release dispatch just failed with a preflight refusal code and needs the correct fix
- Post-dispatch closure: live-marker verification, freeze thaw, branch re-locking

## When not to use

- Designing or installing a release pipeline for a repo that lacks one: that is production-release-build-stinger
- CI workflow design review generally: that is ci-release-stinger (this pair executes releases; it does not design workflows)
- Changelog/release-notes prose: changelog-release-notes-stinger

## Procedure

1. Confirm the owner authorization reference for this task; an authorization to ship is never an authorization to skip gates.
2. Load `guides/adapt-to-tier.md` and detect the project's release tier from live signals (workflows, protection endpoint, repo variables, platform settings).
3. Execute per tier using `guides/execute-release.md`: Tier 3 runs the full 7-step preflight (`references/dispatch-preflight-checklist.md`), dispatch, and watch; lower tiers run the merge-and-verify path. Treat every refusal code as a stop-and-fix via `references/refusal-code-lookup.md`, never a retry loop.
4. Complete `guides/verify-and-thaw.md`: live release-marker match, freeze variables cleared, branches re-locked, read-backs live.
5. Write the run-watch report from `references/run-watch-report-template.md`. Shipped means verified-shipped: a live releaseSha match, not a green workflow.

## References map

- `guides/execute-release.md`, load when performing the release pipeline and dispatch
- `guides/adapt-to-tier.md`, load when first touching a project, before executing anything
- `guides/verify-and-thaw.md`, load after dispatch succeeds
- `references/dispatch-preflight-checklist.md`, load when running the 7-step preflight (Tier 3)
- `references/refusal-code-lookup.md`, load when any refusal code or failure signature appears
- `references/run-watch-report-template.md`, load when writing the release report
- `references/research/distilled-production-release-execution.md`, load when a domain claim needs verification; shared raw archive at `../../../production-release/command/references/research/raw/`

## Related drones and stingers

- [production-release-build-stinger](../production-release-build-stinger) - audits CI-to-deploy posture and builds/installs the right tier of release flow; the execution gap findings from this stinger feed it
- [ci-release-stinger](../ci-release-stinger) - workflow DESIGN; this pair executes what it designs

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

## Lock lifecycle (resting state unlocked)

Branch locks are dispatch-scoped, not resting state. Between releases, main and staging are UNLOCKED so sessions can merge PRs normally (lock_branch=true blocks all merges absolutely, including admin). The release sequence locks both branches as a dispatch preflight step and the thaw procedure after the release receipt decides the post-release posture: unlock for normal work unless an operator explicitly holds a freeze. Never leave branches locked after a completed release without an active freeze reason recorded in the freeze variables.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [production-release-build-stinger](../production-release-build-stinger) - audits posture and installs release flows when the execution path reveals missing machinery
  - [security-stinger](../security-stinger) - first gate of the Ship Gate this stinger closes with
