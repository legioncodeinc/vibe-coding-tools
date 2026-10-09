---
name: "code-structure-stinger"
license: AGPL-3.0-or-later
description: "Two-layer architecture discipline: actions orchestrate domain rules (the why and when) while a service layer centralizes reusable operational mechanics (the how). Use when multiple workflows duplicate the same operational logic, when deciding what belongs in actions versus shared services, when refactoring repeated operational blocks across domain flows, or when adding a feature that shares mechanics with existing ones."
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Language- and framework-agnostic; examples use TypeScript."
metadata:
  hive-tier: specialist
  paired-drone: code-structure-wasp-drone
  research-window: 2026-10-05
  provenance: "Layer model informed by the michaelshimeles/skills code-structure skill; body authored fresh for The Wasp Nest. See references/research/."
---

# Code Structure Stinger

One sentence: actions orchestrate domain rules, the service layer centralizes
reusable operational mechanics behind a composable, explicit-input API.

Read `guides/01-actions-vs-services.md` before judging any extraction or
placement question. It carries the layer table, the capability-block design
rules, the migration checklist, and the anti-pattern table.

## Standing rules

- Extraction trigger: the same operational chunk appears in 2 or more
  callers. Logic used by one caller stays in the action, however ugly.
- Actions own: business rules, state transitions, auth and ownership checks,
  failure classification, user-facing errors.
- Services own: provider and SDK interactions, command execution detail,
  health checks, retries as mechanics. Services never mutate domain state
  directly and never reach into the database uninvited.
- Service functions take explicit parameters and return structured results
  (`{ ready, previewUrl }`), never swallowed errors.
- Migrate one caller at a time: extract, replace one caller, verify
  (typecheck, lint, flow check), then migrate the rest. Never a big bang.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event that your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [code-review-pr-stinger](../code-review-pr-stinger/) - review-side enforcement when a PR introduces a god service or a leaky one
  - [best-practices siblings per stack: react-stinger](../react-stinger/) and [python-stinger](../python-stinger/) - stack-specific structure conventions once the layering is decided

## Ship Gate

Prior to committing any code you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each pass prepare a report in the repository's relevant library directory. All medium or above findings must be resolved followed by another thorough re-evaluation prior to proceeding. The user reviews and approves before commit or push.
