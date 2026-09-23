---
name: "contract-writing-stinger"
description: "Find and write stable shared contracts before parallel PRDs. Use for cross-PRD APIs, events, data shapes, permissions, or state transitions, and for contract drift."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork"
metadata:
  hive-drone: "contract-writing-wasp-drone"
  domain: "shared contracts"
  pair-drone: "contract-writing-wasp-drone"
---

# Contract Writing Stinger

## Purpose

Identify observable agreements shared by independently authored PRDs, document them once, obtain explicit acceptance, and hand their exact revisions to Library so PRD authors can finish in parallel. Accepted records live at `library/knowledge/private/contracts/CTR-<###>-<slug>.md`; PRDs link them from `## Contract dependencies`. A PRD depending on a Draft contract remains incomplete on that boundary.

## When to use

- Before Library assigns or finalizes parallel PRDs with shared boundaries.
- When asked to freeze an API, event, data shape, permission rule, or state transition for multiple consumers.
- When a contract changes or PRDs and implementation appear to disagree.

## When not to use

- General PRD or IRD authorship belongs to `library-wasp-drone`.
- A closed architectural choice belongs to `adr-writing-wasp-drone`; link the accepted ADR as source.
- Legal agreements belong to `legal-docs-wasp-drone`.
- Protocol-specific implementation and testing belong to the relevant engineering Drone.

## Procedure

1. Read `guides/01-identify-boundaries.md` and inventory the shared boundaries, owners, existing agreements, and blockers.
2. For each missing agreement, use `guides/02-draft-and-accept.md` and `templates/contract-template.md`. Keep it Draft until Mario accepts its exact terms.
3. For every accepted agreement, use `guides/03-handoff-to-library.md` to pin the revision in each affected PRD and identify the provider and consumer checks.
4. On any changed behavior or routine drift scan, use `guides/04-revise-and-audit.md`; report affected PRDs and compatibility before repinning.
5. Run `python3 scripts/validate_contracts.py <repository-root>` after contract or PRD link changes. Report actual findings and remaining blocked work.

## References map

- `references/contract-field-reference.md`: load when selecting fields for a specific boundary.
- `templates/boundary-inventory.md`: use for the pre-PRD boundary scan and author handoff.
- `examples/prd-parallel-handoff.md`: load for an end-to-end PRD handoff example.
- `references/research/distilled-contract-writing.md`: load to verify the domain reasoning and its limitations.
- `references/research/raw/`: load to trace a domain claim to an official source.
- `scripts/validate_contracts.py`: run after writing or relinking records.

## Related drones and stingers

- [library-stinger](../library-stinger) and [library-wasp-drone](../../agents/library-wasp-drone.md) own PRD authoring, structure, and lifecycle.
- [adr-writing-stinger](../adr-writing-stinger) and [adr-writing-wasp-drone](../../agents/adr-writing-wasp-drone.md) own closed architecture decisions.
- [api-docs-stinger](../api-docs-stinger) owns API reference publication and SDK documentation.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [library-stinger](../library-stinger) - PRD authoring and contract dependency links.
  - [adr-writing-stinger](../adr-writing-stinger) - accepted architectural decisions.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
