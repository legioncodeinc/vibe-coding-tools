# Hive Bee template: reference-agents.md

Fill-in-the-blanks template for a Bee agent. A Bee is the Hive's agent component. Every Bee pairs with exactly one Stinger (the Hive's skill component) except `beekeeper-suit`, `queen-bee-stinger`, and `get-started-stinger`, which operate at orchestrator level with no paired agent.

Glossary: Beekeeper and Tools are commands. Bees are agents. Stingers are skills. The Hive is the whole framework. Vibe Coding Tools is the repository that distributes it.

Copy the block below, replace every `{placeholder}`, delete the comments once you've decided on the optional fields, and drop the result into whichever harness-specific location applies (see "Per-harness deployment" at the end of this file).

---

```markdown
---
name: {bee-name}
description: {What this Bee specializes in and when it should be invoked. Use when...}
tools: {Read, Grep, Glob, Edit, Write, Bash - trim to what this Bee actually needs}
model: {sonnet | opus | haiku | fable | inherit}
# memory: {user | project | local}       # persistent cross-session learning for this Bee; omit unless the Bee needs to remember things between runs
# isolation: worktree                    # runs this Bee in an isolated git worktree, auto-cleaned if it makes no changes; use for any Bee that edits files
# effort: {low | medium | high | xhigh | max}   # overrides session effort for this Bee specifically; omit to inherit
# color: {red | blue | green | yellow | purple | orange | pink | cyan}   # cosmetic, helps distinguish this Bee in multi-agent output
---

## Critical Directive

- You must load your core skill now in advance of any planning or execution. Your core skill is: [{insert-stinger-name}](../skills/{insert-stinger-folder-path}).
- You must read all files and context contained within your skill.
- In the event your core skill does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [{related-stinger-name}]({../skills/related-stinger-folder-path}) - {Description of skill and common use cases.}

## Persona and mission

{One or two paragraphs. Who is this Bee, what does it exist to do, what does success look like for the person who invoked it. Write it like you'd brief a new hire, not like a spec.}

## Scope boundaries

**This Bee owns:**
- {File paths, directories, or task types this Bee is responsible for.}

**This Bee must NOT touch:**
- {File paths, directories, or task types explicitly out of scope, even if they look related.}

Respect agent work boundaries: never modify or delete another agent's active work. During parallel or multi-agent sessions, stay inside the files and scope this Bee owns. If a task requires touching something outside scope, stop and hand it back to the orchestrating agent rather than reaching past the boundary.

## Related bees and stingers

- [{related-bee-name}](../agents/{related-bee-file}.md) - {when to hand off to this Bee instead}
- [{related-stinger-name}](../skills/{related-stinger-folder}) - {when this Stinger is relevant even though it isn't this Bee's core skill}

## Reporting expectations

Write reports to the repository's `library/` directory, filed under the path associated with this Bee and its paired Stinger, following Library Schema v2. A report is not optional output. It's the record of what this Bee found and did, and it's what the user reviews before anything gets committed.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
```

---

## Notes on the placeholders

- `{bee-name}`: lowercase, hyphens only, unique across the Hive. This is also the file's invocation name in Claude Code and Cursor.
- `description`: this is what the orchestrator reads to decide whether to delegate here. Front-load the trigger words. "Use when..." phrasing reads as an explicit invitation to auto-delegate.
- `tools`: don't leave this as a blanket inherit unless the Bee genuinely needs the full toolset. A Bee that only reads and reports should not carry `Write`/`Edit`.
- Every commented-out optional field has a one-line reason attached in the comment itself. Delete the ones you don't use, don't just leave them commented.
- `{insert-stinger-name}` and `{insert-stinger-folder-path}` in the Critical Directive must point at this Bee's paired Stinger, not a related one. The related-skills bullet list under the Critical Directive is for supplementary Stingers only.

## Per-harness deployment

The same file, unmodified in the common case, serves multiple harnesses:

- **Claude Code**: drop into `.claude/agents/{bee-name}.md` (project scope) or `~/.claude/agents/{bee-name}.md` (user scope). Full field set above is honored [raw/claude-code--agents--sub-agents-official-docs.md].
- **Cursor**: `.claude/agents/` is Cursor's native location, but Cursor also reads `.claude/agents/` directly as a compatibility fallback, so one copy in `.claude/agents/` can serve both Claude Code and Cursor without duplication. Cursor only understands `name`, `description`, `model`, `readonly`, `is_background` from the frontmatter above - it ignores the rest rather than erroring [raw/cursor--agents--subagents-docs.md].
- **Cowork**: strip to the plugin-agent field subset (`name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory` without `local`, `background`, `isolation: worktree`) and ship it inside `agents/` at the plugin root. `hooks`, `mcpServers`, `permissionMode`, and `color` are silently dropped for plugin-shipped agents, so don't rely on them for a Bee that needs to reach Cowork [raw/cowork--agents--code-claude-docs-sub-agents.md].
- **Codex**: there is no markdown agent file in Codex. Convert this Bee into an `agents.<role>` entry in `config.toml`, pointing `config_file` at a TOML file that carries the equivalent of this Bee's persona/mission/scope as free-form instructions, since Codex has no native concept of the Critical Directive or Ship Gate blocks. The Critical Directive's "load your skill first" instruction still applies in spirit, it just has to be spelled out as prose inside that config file rather than expressed as a Claude Code skill preload [raw/codex--rules--config-reference.md, raw/codex--multiple--customization-overview.md].

See `references/templates/agents/harness-specific-reference.md` for the full per-harness field tables and the source citations behind every claim above.
