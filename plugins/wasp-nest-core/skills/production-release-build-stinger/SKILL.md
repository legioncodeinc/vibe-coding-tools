---
name: "production-release-build-stinger"
description: "Audit a project's CI-to-deploy posture and build the right tier of release flow (Tier 0 git-push through Tier 3 freeze/dispatch/verified smoke); recommends and installs upgrades."
license: AGPL-3.0-or-later
compatibility: "Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork"
metadata:
  hive-tier: specialist
  paired-drone: production-release-build-wasp-drone
  domain: release-pipeline-installation
---

# Production Release Build Stinger

## Purpose

Audits a repository's CI-to-deploy posture against the tier taxonomy (0: push-to-main deploys; 1: gated push-to-main; 2: staged/promoted deploys; 3: freeze-gated owner dispatch), recommends the right upgrade on the ladder, and installs the chosen tier's flow into the target repo. Produces an evidence-backed audit report, an upgrade recommendation memo, and (when installation is owner-approved) a verified, documented release flow.

## When to use

- "Audit our release pipeline", "what tier is our deploy process", "should we add a staging/promote step"
- Installing or upgrading a release flow: required checks, staged promotions, freeze-gated dispatch
- A repo just shipped its first paying-customer feature and the push-to-main habit needs gating

## When not to use

- Executing an existing release: that is production-release-stinger
- CI workflow design for its own sake (lanes, caching, sharding): ci-release-stinger
- Branch protection hygiene audits not tied to the deploy pipeline: github-repo-health-stinger

## Procedure

1. Run `guides/audit-posture.md` with `references/audit-questionnaire.md`; score the tier against `references/tier-taxonomy-and-install-runbooks.md`. Read live signals (protection endpoint, environments, concurrency, platform settings), never advisory local files.
2. Deliver the audit report: assigned tier, findings with evidence, blast-radius notes.
3. If an upgrade is on the table, write the recommendation memo per `guides/recommend-upgrade.md` and stop for the owner's decision. One ladder step at a time.
4. Only on explicit owner approval, install per `guides/install-tier.md` and the per-tier runbooks in `references/tier-taxonomy-and-install-runbooks.md`. Inventory pins/hashes/contracts before touching any shared surface; keep check names unique per branch.
5. Verify the install end to end at the smallest safe scale, write the required-check posture doc and release runbook into the repo, and record run URLs as evidence.

## References map

- `guides/audit-posture.md`, load when auditing a repo
- `guides/install-tier.md`, load when installing or upgrading a tier (owner-approved only)
- `guides/recommend-upgrade.md`, load when turning an audit into an upgrade decision
- `references/tier-taxonomy-and-install-runbooks.md`, load when classifying a tier or executing an install
- `references/audit-questionnaire.md`, load when running the audit itself
- `references/research/distilled-ci-to-deploy-posture-and-tiers.md`, load when a taxonomy or platform claim needs verification; shared raw archive at `../../../production-release/command/references/research/raw/`

## Related drones and stingers

- [production-release-stinger](../production-release) - executes the release flows this stinger installs; its machinery-gap findings feed this stinger's audits
- [ci-release-stinger](../ci-release-stinger) - owns workflow design inside the flows this stinger assembles

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [production-release-stinger](../production-release) - the execution pair for flows this stinger builds
  - [security-stinger](../security-stinger) - first gate of the Ship Gate this stinger closes with
