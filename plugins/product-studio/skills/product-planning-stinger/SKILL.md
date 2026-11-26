---
name: "product-planning-stinger"
description: "Turn an approved strategy and UX package into a PRD map, saved wave plan, project Definition of Done and handoff packet. Use to plan the build order. Read README.md for the guide map."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Python 3.9+ for the wave plan checker."
metadata:
  hive-tier: specialist
  hive-drone: product-planning-wasp-drone
  pair-drone: product-planning-wasp-drone
  domain: product-planning
  research-window: 2026-04-12 to 2026-10-12
---

# Product Planning Stinger

Start with [README.md](README.md) for the guide map.

## Purpose

Plan the build before anyone builds. From the approved Product Strategy (`library/knowledge/private/product/product-strategy.md`) and UX package (`library/knowledge/private/product/design/`), produce four owner-approved artifacts:

1. **PRD Map** (`library/requirements/plans/prd-map.md`): every PRD to write, each with a one-line scope, size budget, dependencies and the shared boundaries that need CTR contracts.
2. **Wave Plan** (`library/requirements/plans/wave-plan.md`): dependency-ordered waves with pass/fail entry and exit criteria and a Mermaid graph, so `/smoke-it` and TARS read it instead of inventing one.
3. **Definition of Done** (`library/knowledge/private/standards/definition-of-done.md`): the project floor every PRD inherits, plus a PRD-level checklist.
4. **Handoff Packet** (`library/requirements/plans/handoff-packet.md`): which boundaries `contract-writing-stinger` drafts and which PRDs `library-stinger` writes.

This Stinger does not write PRDs, IRDs or CTRs, and does not build.

## When to use

- "Plan the build", "what order do we build in", "break this into PRDs".
- "Make a wave plan", "write our Definition of Done" for a whole project.
- The planning stage of `/product-studio:plan-product`.

## When not to use

- Writing PRDs or IRDs: `library-stinger`.
- Writing or accepting contracts: `contract-writing-stinger`.
- Executing PRDs: `/smoke-it`. Running sessions: TARS.
- New feature ideas mid-build: TARS's Feature Desk (KIPP).
- Sprint ceremonies or a team-level sprint DoD: `agile-scrum-stinger`. Date forecasts: `estimation-stinger`.

## Procedure

1. Read the inputs with [guides/01-read-inputs.md](guides/01-read-inputs.md). Stop if the strategy is missing; ask before planning without the UX package.
2. Build the PRD Map with [guides/02-map-features.md](guides/02-map-features.md) and flag boundaries with [guides/03-flag-boundaries.md](guides/03-flag-boundaries.md). Get approval.
3. Write the Definition of Done with [guides/05-set-definition-of-done.md](guides/05-set-definition-of-done.md). Keep the five core items. Get approval.
4. Order the waves with [guides/04-plan-waves.md](guides/04-plan-waves.md). Run `python3 scripts/check_wave_plan.py <wave-plan> --prd-map <prd-map>` and fix every error. Get approval.
5. Write the Handoff Packet with [guides/06-write-handoff.md](guides/06-write-handoff.md). Acceptance criteria follow the PRD template's ID table with Given/When/Then. Get approval.
6. Approve and revise only through [guides/07-approve-and-revise.md](guides/07-approve-and-revise.md). Approval binds one exact revision.
7. Report the four paths, revisions, approval state, open decisions and the checker result.

## References map

| Path | Load when |
|---|---|
| [references/artifact-paths.md](references/artifact-paths.md) | Checking paths, owners, status or dependency words |
| `references/templates/` | Starting any artifact |
| `references/examples/` | Seeing a complete map and plan that pass the checker |
| [references/research/distilled-product-planning.md](references/research/distilled-product-planning.md) | Checking why a rule exists, or its limits |
| Source research archive (not shipped with the plugin) | Source-repository only; the shipped distillation summarizes it, do not require it |
| [scripts/check_wave_plan.py](scripts/check_wave_plan.py) | After any change to the map or plan |

## Related drones and stingers

- [library-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger/SKILL.md) writes the PRDs from the Handoff Packet.
- [contract-writing-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/contract-writing-stinger/SKILL.md) drafts CTRs for the flagged boundaries.
- `product-strategy-stinger` and `product-design-stinger` (this pack) produce the inputs.
- [smoke-it](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/commands/smoke-it.md) executes the approved Wave Plan.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [library-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger) - PRD authoring, PRD template and lifecycle.
  - [contract-writing-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/contract-writing-stinger) - shared boundary contracts and acceptance.
  - [estimation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/business-and-product-tools/skills/estimation-stinger) - time and cost forecasts for the plan.
  - [agile-scrum-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/business-and-product-tools/skills/agile-scrum-stinger) - team and sprint Definition of Done practice.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
