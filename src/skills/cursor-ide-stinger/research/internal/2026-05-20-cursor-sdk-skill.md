---
source_type: internal-artifact
authority: high
relevance: high
topic: sdk-api
url: C:/Users/mario/.cursor/plugins/cache/cursor-public/cursor-sdk/d1cdb88a9eb33cf392395c87e3fd76419fc1010e/skills/cursor-sdk/SKILL.md
fetched: 2026-05-20
---

# Installed cursor-sdk Skill (Cursor Plugin)

## Summary

The workspace has the official Cursor SDK plugin installed, which includes a `cursor-sdk` SKILL.md. This is the authoritative in-IDE reference for `@cursor/sdk` and defines the three invocation patterns, top five traps, local vs cloud runtime distinction, auth setup, model selection, and production best practices. `cursor-ide-stinger`'s `guides/04-sdk-api.md` should align with and extend this skill - not duplicate it.

## Key quotations

- "Three Invocation Patterns: (1) `Agent.prompt()` - one-shot, (2) `Agent.create()` + `agent.send()` - durable with follow-ups, (3) `Agent.resume()` - pick up an existing agent later."
- "Top Five Traps: (1) Missing `cloud: { repos }` silently defaults to local, (2) Two different kinds of failure (CursorAgentError vs result.status === 'error'), (3) Forgetting `await agent[Symbol.asyncDispose]()` leaks resources, (4) Streaming is optional but `wait()` is (almost) required, (5) Not every run operation is supported on every runtime."
- "Inline `mcpServers` are not persisted across resume - pass them again on the resume call."
- "The SDK holds handles to local executors, persisted run stores, and cloud API clients."

## Key SDK API surface

- `Agent.create(options)` - returns `SDKAgent` immediately
- `agent.send(message)` - returns a `Run`
- `run.stream()` - async generator of `SDKMessage` events
- `run.wait()` - resolves to terminal `RunResult`
- `run.cancel()` - cancels if supported
- `run.supports("cancel"|"stream"|"wait"|"conversation")` - capability check
- `Agent.prompt(message, options)` - one-shot convenience
- `Agent.resume(agentId, options)` - resume across process boundaries
- `Agent.list()`, `Agent.listRuns()`, `Agent.getRun()`, `Agent.messages.list()` - inspection

## Annotations for stinger-forge

- `guides/04-sdk-api.md` should explicitly cross-reference the cursor-sdk skill rather than re-authoring the same content.
- The skill's "What This Skill Doesn't Cover" section (Cloud Agents REST API, `.cursor/hooks.json`, private workers, non-TS SDKs) should be mirrored as a "handoff boundaries" section in guide 04.
- The `run.supports()` guard pattern is critical for `stinger-forge` to include in examples - runtime capabilities differ.
- The `CursorAgentError` subclass taxonomy (AuthenticationError, RateLimitError, ConfigurationError, AgentBusyError, IntegrationNotConnectedError, NetworkError, UnknownAgentError) from the official docs should be the authoritative list in guide 04.
