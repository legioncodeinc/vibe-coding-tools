---
source_type: internal-artifact
authority: high
relevance: high
topic: stinger-scope
url: ai-tools/command-briefs/cursor-ide-worker-bee-command-brief.md
fetched: 2026-05-20
---

# cursor-ide-worker-bee Command Brief Analysis

## Summary

The Command Brief establishes `cursor-ide-worker-bee` as the Hive's resident expert on Cursor IDE itself (not on the code Cursor produces). The Bee owns six surface areas: project rules (`.cursorrules` legacy + `.cursor/rules/*.mdc` modern), custom modes, MCP server registration, agent-panel and background-agent workflows, keybindings and productivity patterns, and the `@cursor/sdk` API. The paired Stinger `cursor-ide-stinger` encodes all six areas as a knowledge repository the Bee reads before acting.

The brief calls for six guide files:
1. `guides/01-principles.md` - rule file philosophy, alwaysApply vs glob-scoped, context window cost
2. `guides/02-rule-file-authoring.md` - full frontmatter spec, glob patterns, migration from `.cursorrules`
3. `guides/03-mcp-integration.md` - mcp.json schema, tool JSON Schema authoring, stdio vs SSE, gotchas
4. `guides/04-sdk-api.md` - Agent lifecycle, run.stream, CursorAgentError, local vs cloud runtime
5. `guides/05-modes-and-productivity.md` - custom mode JSON, keybindings, inline chat vs agent panel decision tree
6. `guides/06-extension-development.md` - manifest structure, plugin quality gates, marketplace submission

## Key quotations

- "Never write `.cursorrules` for a project that already uses `.cursor/rules/`.": the two formats are not additive; the modern format takes precedence and having both causes confusing precedence behaviour."
- "Prefer `alwaysApply: false` with narrow globs over `alwaysApply: true` for all new rules. Why: `alwaysApply: true` rules inflate every agent context window."
- "When scaffolding MCP servers, always include a `tools` array with explicit JSON Schema for every parameter. Why: Cursor will silently reject tools with malformed schemas, and the error is not surfaced in the UI."

## Annotations for stinger-forge

- The five critical directives (lines 50-55) should become a numbered checklist in `guides/01-principles.md`.
- Open question: "Does Cursor SDK support streaming partial tool-call results, or only final assistant messages?" - research confirms: yes, `run.stream()` yields `SDKMessage` events including `assistant`, `thinking`, `tool_call`, `status`, `task`, `request` types - partial tool-call results ARE streamed.
- Open question: "Is there a stable way to detect which Cursor plan tier is active from within an SDK agent run?" - NOT answered by research; should be flagged as open question for stinger-forge.
- The suggested worked example of an MCP server exposing `run_security_scan` bridging `security-worker-bee` via SDK should be included in `guides/03-mcp-integration.md` as a capstone example.
