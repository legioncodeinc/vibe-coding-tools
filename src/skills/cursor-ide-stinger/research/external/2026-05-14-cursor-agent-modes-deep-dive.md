---
source_type: blog
authority: high
relevance: high
topic: modes-and-agents
url: https://developertoolkit.ai/en/cursor-ide/advanced-techniques/agent-modes-deep-dive/
fetched: 2026-05-20
---

# Agent Modes Deep Dive | Developer Toolkit

## Summary

Published May 18, 2026. Comprehensive guide to Cursor's four primary modes (Agent, Ask, Plan, Debug) plus Custom Modes, with Cursor 3.0 context. Since Cursor 3.0 (April 2, 2026), modes run inside the Agents Window. Each agent tab can hold its own mode, model, and worktree - enabling parallel workflows like Opus 4.7 in Plan mode + Composer 2 in Agent mode simultaneously.

**Mode decision framework:**
- **Agent mode**: Default, most powerful. Read, edit, run terminal commands, search codebase, iterate until done. Enable auto-run for terminal commands so agent can run its own tests. Key insight: "Agent mode becomes dramatically more useful when it can run your test suite after making changes."
- **Ask mode**: Read-only codebase exploration. "Plan with Ask mode and implement with Agent mode" is the recommended pattern from official docs.
- **Plan mode**: Creates detailed implementation plans before writing any code. Agent researches codebase, asks clarifying questions, generates reviewable plan (editable Markdown). Click "Build" to execute in Agent mode. Best for complex features, multi-file changes, unclear requirements.
- **Debug mode**: Systematic bug investigation with runtime evidence.
- **Custom modes**: User-defined modes with specific instruction set and tool permissions (e.g., dedicated code-review mode).

**Power user workflow:**
1. Ask mode to understand architecture and constraints
2. Plan mode to create detailed, reviewable implementation plan
3. Agent mode to execute the plan with auto-run enabled

**Agents Window navigation shortcuts:**
- Open: `Cmd+Shift+P -> Agents Window`
- Tiled layout (v3.1): split view into panes, persistent across sessions
- `/worktree`: spin agent into isolated git worktree
- `/best-of-n`: run same prompt across N models in separate worktrees and compare
- `/multitask`: async parallel subagents

## Key quotations

- "Since Cursor 3.0, modes run inside the Agents Window — `Cmd+Shift+P → Agents Window`."
- "Each agent tab can hold its own mode, model, and worktree."
- "The most effective Cursor users do not stay in one mode. They switch modes as the nature of their work changes within a single task."
- "Agent mode edits too many files. This happens when the prompt is too broad."

## Annotations for stinger-forge

- The three-step workflow (Ask -> Plan -> Agent) should be the recommended pattern in `guides/05-modes-and-productivity.md`.
- `/worktree`, `/best-of-n`, `/multitask` are important slash commands to document in guide 05.
- The "one model per mode" pattern (e.g., Opus 4.7 for Plan, Composer 2 for Agent) is a power-user tip worth including.
- "Agent mode edits too many files" is a common failure mode - include the remedy (narrow prompts + file-scoped context) in guide 05.
- The Agents Window keyboard shortcut (`Cmd+Shift+P -> Agents Window`) should be in the shortcuts table.
