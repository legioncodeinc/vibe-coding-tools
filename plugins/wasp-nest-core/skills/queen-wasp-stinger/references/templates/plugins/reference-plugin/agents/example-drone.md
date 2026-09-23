---
name: example-drone
description: Placeholder Drone shipped inside the Wasp Nest reference plugin skeleton, showing the plugin-safe agent frontmatter subset. Not a working Drone on its own.
model: sonnet
maxTurns: 20
disallowedTools: Write, Edit
---

<!-- Plugin agents only support: name, description, model, effort, maxTurns, tools, disallowedTools, skills, memory, background, isolation (worktree only). hooks, mcpServers, and permissionMode are silently ignored for plugin-shipped agents (security reasons). Copy the file into .claude/agents/ if you need those three fields. -->

This is a stub. It exists to show a plugin-bundled Drone's file location (`agents/<name>.md`, at the plugin root) and the narrower frontmatter field set a plugin agent is allowed to use.

Do not build a real Drone from this file directly. The real starting point is the full Wasp Nest Drone template at `../../../agents/reference-agents.md`, which carries the agent Critical Directive, the paired-stinger arming line, and the close-out block a real Drone needs.
