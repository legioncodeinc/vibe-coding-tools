---
description: "Execute the complete production release for this project, at its sophistication tier, from authorization to verified-shipped."
argument-hint: "[project-or-repo (default: current repo)]"
---

# /production-release

## Mandatory process

1. Load the pest-controller-suit skill and consult its roster before making any routing decision. This is the first instruction, always, no exceptions. This command dispatches `production-release-wasp-drone`; confirm it is registered before proceeding and note that `ci-release-wasp-drone` is workflow DESIGN, not execution.
2. Confirm the owner authorization on record for THIS task: an explicit instruction to deliver to production authorizes the default pipeline, never a skip of its gates. If absent, stop and ask.
3. Dispatch `production-release-wasp-drone` (top level, not nested), armed per the pest-controller contract: "You are production-release-wasp-drone. Before doing anything else, read your paired Stinger in full at ../production-release-stinger/SKILL.md and follow it as your operating manual. Then: [target repo, current pipeline state, definition of done = live releaseSha match plus completed thaw, verification = run-watch report with real run URLs]."
4. The Drone detects the project's release tier, runs the matching execution path (full 7-step dispatch preflight at Tier 3; merge-and-verify at lower tiers), resolves any refusal code via the lookup table, and completes verify-and-thaw.
5. Report back: the run-watch report (template in the Stinger's references), tier detected, refusals encountered and resolved, and any machinery gaps flagged for production-release-build-wasp-drone.

## Arguments

`$1` optionally names the target project/repo; default is the current repository. The command executes production side effects only under the owner authorization confirmed in step 2.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
