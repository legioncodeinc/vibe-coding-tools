---
name: "{stinger-name}"
description: "{One or two sentences: what this stinger does and exactly when Claude should reach for it. Front-load the trigger words, since Codex and Cursor both judge relevance from this text alone. Keep it under 200 characters if you want the same file to survive Cowork's stricter cap without editing.}"
license: MIT
compatibility: "{e.g. Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork. Avoid angle brackets here: Cowork rejects frontmatter containing them}"
metadata:
  hive-bee: "{paired-bee-name, or 'none' for orchestrator-level stingers}"
  domain: "{one or two words: what part of the Hive this covers}"
  pair-bee: "{same as hive-bee, kept for readability if your roster convention uses this key name instead}"
---

# {Stinger display name}

## Purpose

{One paragraph. What problem does this stinger solve, and what does it produce or change when it runs. Say what, not how, in this section: the how goes in the procedure below.}

## When to use

- {Trigger condition one, phrased the way a user or orchestrator would actually say it}
- {Trigger condition two}
- {Trigger condition three}

## When not to use

- {A related task this stinger should NOT claim, and which stinger owns it instead}
- {A case where this stinger would be premature or wasteful to invoke}

## Procedure

1. {First step. Be imperative: "Read X," "Run Y," "Confirm Z," not "you might want to."}
2. {Second step.}
3. {Third step.}
4. {Continue numbering for every step this stinger owns. If a step branches, say so explicitly rather than leaving it implicit.}

## References map

- `references/REFERENCE.md`, {load when: describe the trigger condition for pulling this file into context, e.g. "load when the task needs the full field list, not just the summary above"}
- `references/research/distilled-{topic}.md`, {load when: a domain claim needs verification or a dispute needs settling; this is the cited distillation of this stinger's own research archive}
- `references/research/raw/`, {load when: tracing a distilled claim back to its primary source}
- `scripts/validate.py`, {load/run when: describe when this script should actually execute, e.g. "run after every edit this stinger makes, before reporting done"}

Keep this section a map, not the content itself. Progressive disclosure means the root `SKILL.md` should stay lean; anything long or reference-heavy belongs in `references/`, and anything deterministic belongs in `scripts/`.

## Related bees and stingers

- [{related-stinger-name}](../{related-stinger-folder-path}) - {Description of skill and common use cases.}
- [{related-bee-name}](../../agents/{related-bee-file}) - {Description of the paired agent and when the orchestrator should delegate to it instead of running this stinger inline.}

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [related-stinger-name](../related-stinger-folder-path) - {Description of skill and common use cases.}

<!--
The Ship Gate block below applies to development-focused stingers only, meaning any stinger whose procedure results in code changes committed to the repository. If this stinger is research-only (produces a report, a plan, an analysis, or anything that never touches tracked source files), delete the Ship Gate section entirely and say so in this comment's place: "Ship Gate removed: research-only stinger, produces no committable code."
-->

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
