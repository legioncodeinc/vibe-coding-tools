---
source_type: official-docs
authority: high
relevance: high
topic: modes-and-agents
url: https://cursor.com/docs/agent/subagents
fetched: 2026-05-20
---

# Subagents - Cursor Official Documentation

## Summary

Official documentation for Cursor subagents. Subagents run in foreground (blocks, returns result) or background (returns immediately, works independently) mode. Three built-in subagents: `explore` (codebase search), `bash` (shell commands), `browser` (browser automation). Since Cursor 2.5, subagents can launch child subagents (nested tree of coordinated work).

**Custom subagent file format** (`.claude/agents/<name>.md`):
YAML frontmatter fields:
- `name` (string, optional, default from filename): display name and identifier; use lowercase + hyphens
- `description` (string, optional): short description shown in Task tool hints; agent reads this to decide delegation
- `model` (string, optional, default `inherit`): `inherit` or specific model ID
- `readonly` (boolean, optional, default `false`): restricted write permissions if true
- `is_background` (boolean, optional, default `false`): run in background without blocking parent

**Scope locations:**
- Project: `.claude/agents/` (also `.claude/agents/` and `.codex/agents/` for compatibility)
- User: `~/.claude/agents/` (all projects)
- Project takes precedence over user; `.cursor/` takes precedence over `.claude/` and `.codex/`

**Background behavior:** Background subagents write state to `~/.cursor/subagents/`. Parent agent can read these files to check progress. Can resume after completion with preserved context.

**Parallel execution:** Multiple background subagents run simultaneously; parent agent can coordinate results.

## Key quotations

- "Create a subagent file at .claude/agents/verifier.md with YAML frontmatter (name, description) followed by the prompt."
- "Since Cursor 2.5, subagents can launch child subagents to create a tree of coordinated work."
- "Project subagents take precedence when names conflict. When multiple locations contain subagents with the same name, `.cursor/` takes precedence over `.claude/` or `.codex/`."
- "Background subagents write output to `~/.cursor/subagents/`. The parent agent can read these files to check progress."

## Annotations for stinger-forge

- The subagent file format (`.claude/agents/*.md`) is the same format used to create Hive Bees - this is a key connection to document in guide 05.
- The `is_background` frontmatter field enables fire-and-forget subagent delegation - important for the background agent workflow in guide 05.
- The `.claude/agents/` and `.codex/agents/` compatibility locations mean subagents defined for Claude Code also work in Cursor - note this for teams migrating.
- The `readonly` flag is important for safe delegation of research/audit tasks that should not modify files.
- Built-in `explore`, `bash`, `browser` subagents should be mentioned in guide 05 as zero-config capabilities.
