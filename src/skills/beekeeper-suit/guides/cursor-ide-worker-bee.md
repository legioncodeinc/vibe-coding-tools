# cursor-ide-worker-bee

## Domain
This Bee owns the Cursor IDE platform surface: everything about configuring and extending Cursor as a dev tool, not the code Cursor agents produce. That covers project rules (`.cursorrules` migration and `.cursor/rules/*.mdc` authoring), MCP server registration and tool authoring, the `@cursor/sdk` API for programmatic agent automation, custom modes, the Agents Window, Cloud Agents, and productivity patterns like slash commands and keybindings. In this repo, that means anyone touching `.cursor/` config or building Cursor SDK scripts routes here.

## Paired Stinger
[cursor-ide-stinger](../../cursor-ide-stinger) - the master index for rule authoring, MCP integration, SDK API reference, modes, and extension development, including the MDC-first imperative and context budget rules.

## Trigger phrases
- "review my rules"
- "migrate my .cursorrules"
- "add an MCP tool"
- "build a Cursor SDK script"
- "Agent.create"
- "create a custom mode"
- "set up cloud agents"
- "Cursor keybindings"

## Do NOT route when
- The task is about code quality produced by a Cursor agent, not the Cursor config itself: that goes to the relevant language worker-bee.
- The task is prompt engineering for an external LLM: that's mind-worker-bee.
- The task is a CI/CD pipeline that happens to run an SDK job: this Bee writes the SDK code, devops-worker-bee owns the pipeline wiring around it.
- The task is a security review of MCP credential handling: that's security-worker-bee.
- The task is React components inside a canvas or webview: that's react-worker-bee.

## Inputs the Bee needs
- The user's Cursor version (feature availability is version-gated)
- Whether the project already uses `.cursor/rules/` vs legacy `.cursorrules`
- The specific surface in play: rule file, MCP config, SDK script, mode, or extension

## Outputs
- A `.mdc` rule file, `mcp.json` config, or TypeScript SDK script
- A custom mode definition or extension stub
- An advisory finding on Cursor platform behavior

## Commonly sequenced with
- devops-worker-bee: after SDK code is written, for the CI/CD workflow that runs it
- security-worker-bee: for MCP server credential and tool-output review
- react-worker-bee: for canvas or webview components inside a Cursor extension
