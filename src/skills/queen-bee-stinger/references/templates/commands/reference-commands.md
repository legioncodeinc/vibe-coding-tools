<!--
This is a Hive command template. It is a flat markdown file, not a folder,
so it works in three placements without modification:

  1. .claude/commands/{command-name}.md         (Claude Code, legacy but supported)
  2. <plugin-root>/commands/{command-name}.md    (any plugin bundle: Claude Code,
                                                   Cursor, Cowork all read commands/
                                                   at plugin root the same way)
  3. Converted into a skill folder: copy this body into
     skills/{command-name}/SKILL.md, add disable-model-invocation: true to the
     frontmatter to preserve the human-only invocation this file assumes.

See templates/commands/harness-specific-reference.md for why Cowork plugins in
particular should ship this flat-file form alongside a skills/ folder rather
than skills/ alone (bug #46079, unresolved as of this research pass).
-->

---
description: "{One line: what this command does. Shown in the invocation popup/menu in every harness that has one.}"
argument-hint: "{e.g. [target] or <file-path> <optional-flag>, documents what goes after the command name}"
---

# /{command-name}

## Mandatory process

1. Load the beekeeper-suit skill and consult its roster before making any routing decision. This is the first instruction, always, no exceptions. Every Hive command starts here because the roster is what tells you which bee and stinger this command actually needs, and routing around it produces work that doesn't match the Hive's conventions.
2. {placeholder step two: what this command confirms or gathers before acting}
3. {placeholder step three: the core action this command performs}
4. {placeholder step four: what this command reports back, and in what form}
5. {Add or remove numbered steps as the command needs. Keep every step imperative: "Confirm X," "Run Y," "Report Z."}

## Arguments

Trailing text after the command name is available as `$ARGUMENTS` (the whole trailing string) or positionally as `$1`, `$2`, and so on. Example: `/{command-name} some-target extra-flag` makes `$1` = `some-target` and `$2` = `extra-flag`, with `$ARGUMENTS` = `some-target extra-flag`.

{Describe what this specific command expects in its arguments, and what happens if none are given. If the command has no arguments, delete this section.}

<!--
The Ship Gate block below applies because Hive commands are dev-focused by
default: they change or ship something in the repository. If this command is
research-only (produces a report, an analysis, a plan, nothing committed),
delete the Ship Gate section and note here instead: "Ship Gate removed:
research-only command, produces no committable code."
-->

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
