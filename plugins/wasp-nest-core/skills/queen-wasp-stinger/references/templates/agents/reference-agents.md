# Wasp Nest Drone template: reference-agents.md

Fill-in-the-blanks template for a Drone agent. A Drone is the Wasp Nest's agent component. Every Drone pairs with exactly one Stinger (the Wasp Nest's skill component) except `pest-controller-suit`, `queen-wasp-stinger`, and `get-started-stinger`, which operate at orchestrator level with no paired agent.

Glossary: Pest Controller and Tools are commands. Drones are agents. Stingers are skills. The Wasp Nest is the whole framework. Vibe Coding Tools is the repository that distributes it.

Copy the block below, replace every `{placeholder}`, delete the comments once you've decided on the optional fields, and drop the result into whichever harness-specific location applies (see "Per-harness deployment" at the end of this file).

---

```markdown
---
name: {drone-name}
description: {What this Drone specializes in and when it should be invoked. Use when...}
tools: {Read, Grep, Glob, Edit, Write, Bash - trim to what this Drone actually needs}
model: {sonnet | opus | haiku | fable | inherit}
# memory: {user | project | local}       # persistent cross-session learning for this Drone; omit unless the Drone needs to remember things between runs
# isolation: worktree                    # runs this Drone in an isolated git worktree, auto-cleaned if it makes no changes; use for any Drone that edits files
# effort: {low | medium | high | xhigh | max}   # overrides session effort for this Drone specifically; omit to inherit
# color: {red | blue | green | yellow | purple | orange | pink | cyan}   # cosmetic, helps distinguish this Drone in multi-agent output
---

## Critical Directive

- You must load your core skill now in advance of any planning or execution. Your core skill is: [{insert-stinger-name}](../skills/{insert-stinger-folder-path}).
- You must read all files and context contained within your skill.
- In the event your core skill does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [{related-stinger-name}]({../skills/related-stinger-folder-path}) - {Description of skill and common use cases.}

## Persona and mission

{One or two paragraphs. Who is this Drone, what does it exist to do, what does success look like for the person who invoked it. Write it like you'd brief a new hire, not like a spec.}

## Scope boundaries

**This Drone owns:**
- {File paths, directories, or task types this Drone is responsible for.}

**This Drone must NOT touch:**
- {File paths, directories, or task types explicitly out of scope, even if they look related.}

Respect agent work boundaries: never modify or delete another agent's active work. During parallel or multi-agent sessions, stay inside the files and scope this Drone owns. If a task requires touching something outside scope, stop and hand it back to the orchestrating agent rather than reaching past the boundary.

## Related drones and stingers

- [{related-drone-name}](../agents/{related-drone-file}.md) - {when to hand off to this Drone instead}
- [{related-stinger-name}](../skills/{related-stinger-folder}) - {when this Stinger is relevant even though it isn't this Drone's core skill}

## Reporting expectations

Write reports to the repository's `library/` directory, filed under the path associated with this Drone and its paired Stinger, following Library Schema v2. A report is not optional output. It's the record of what this Drone found and did, and it's what the user reviews before anything gets committed.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
```

---

## Notes on the placeholders

- `{drone-name}`: lowercase, hyphens only, unique across the Wasp Nest. This is also the file's invocation name in Claude Code and Cursor.
- `description`: this is what the orchestrator reads to decide whether to delegate here. Front-load the trigger words. "Use when..." phrasing reads as an explicit invitation to auto-delegate.
- `tools`: don't leave this as a blanket inherit unless the Drone genuinely needs the full toolset. A Drone that only reads and reports should not carry `Write`/`Edit`.
- Every commented-out optional field has a one-line reason attached in the comment itself. Delete the ones you don't use, don't just leave them commented.
- `{insert-stinger-name}` and `{insert-stinger-folder-path}` in the Critical Directive must point at this Drone's paired Stinger, not a related one. The related-skills bullet list under the Critical Directive is for supplementary Stingers only.

## Per-harness deployment

The same file, unmodified in the common case, serves multiple harnesses:

- **Claude Code**: drop into `.claude/agents/{drone-name}.md` (project scope) or `~/.claude/agents/{drone-name}.md` (user scope). Full field set above is honored [raw/claude-code--agents--sub-agents-official-docs.md].
- **Cursor**: use `.cursor/agents/` for a Cursor-specific file. Cursor also reads Claude-shaped agent files as a fallback, but its documented frontmatter fields are only `name`, `description`, `model`, `readonly`, and `is_background`. The Wasp Nest build projects canonical Claude Drones into Cursor files so unsupported fields do not travel into Cursor. Preserve the Claude source when a `tools` allowlist or worktree isolation matters there. [raw/cursor--agents--subagents-docs.md].
- **Cowork**: strip to the plugin-agent field subset (`name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory` without `local`, `background`, `isolation: worktree`) and ship it inside `agents/` at the plugin root. `hooks`, `mcpServers`, `permissionMode`, and `color` are silently dropped for plugin-shipped agents, so don't rely on them for a Drone that needs to reach Cowork [raw/cowork--agents--code-claude-docs-sub-agents.md].
- **Codex**: there is no markdown agent file in Codex. Convert this Drone into an `agents.<role>` entry in `config.toml`, pointing `config_file` at a TOML file that carries the equivalent of this Drone's persona/mission/scope as free-form instructions, since Codex has no native concept of the Critical Directive or Ship Gate blocks. The Critical Directive's "load your skill first" instruction still applies in spirit, it just has to be spelled out as prose inside that config file rather than expressed as a Claude Code skill preload [raw/codex--rules--config-reference.md, raw/codex--multiple--customization-overview.md].

See `references/templates/agents/harness-specific-reference.md` for the full per-harness field tables and the source citations behind every claim above.
