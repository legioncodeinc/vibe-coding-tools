---
source_type: official-docs
authority: high
relevance: high
topic: sdk-api
url: https://cursor.com/docs/sdk/typescript.md
fetched: 2026-05-20
---

# Cursor SDK Official TypeScript Documentation

## Summary

The official SDK docs define the complete `@cursor/sdk` public API surface. The SDK entered public beta on April 29, 2026 (npm: `1.0.7` first published April 26, 2026). It exposes the same agent runtime that powers Cursor's desktop, CLI, and web app as a programmable TypeScript library.

**Core API:**
- `Agent.create(options: AgentOptions): Promise<SDKAgent>` - validates options, returns handle; pass `local` or `cloud` to pick runtime
- `Agent.prompt(message, options?)` - one-shot convenience: create, send, wait, dispose
- `Agent.resume(agentId, options?)` - resume across process boundaries
- `agent.send(message)` - returns a `Run`; agent retains conversation context across runs
- `run.stream()` - async generator of `SDKMessage` events (discriminated on `type`)
- `run.wait()` - resolves to terminal `RunResult`
- `run.cancel()`, `run.conversation()`, `run.supports(op)`, `run.unsupportedReason(op)`
- `Agent.list()`, `Agent.listRuns()`, `Agent.getRun()`, `Agent.messages.list()`

**Event types from `run.stream()`:** `system`, `user`, `assistant`, `thinking`, `tool_call`, `status`, `task`, `request` - plus `onDelta` and `onStep` callbacks for lower-level token/step events.

**Error hierarchy:** All extend `CursorAgentError { isRetryable, code, cause, protoErrorCode }`. Subtypes: `AuthenticationError`, `RateLimitError`, `ConfigurationError`, `AgentBusyError` (HTTP 409, code `agent_busy`, `isRetryable: false`), `IntegrationNotConnectedError`, `NetworkError`, `UnknownAgentError`.

**AgentBusyError note:** Cloud agents allow only one active run at a time. Local agents do not return `agent_busy`; use `send({ local: { force: true } })` as recovery.

**Runtime options:** `local: { cwd, settingSources }` vs `cloud: { repos, autoCreatePR, skipReviewerRequest }`. Model is required for local, optional for cloud.

## Key quotations

- "`Agent.create()` validates options and returns a handle immediately. Pass either `local` or `cloud` to pick a runtime."
- "All SDK errors extend `CursorAgentError`. Use `isRetryable` to drive retry logic."
- "Local agents do not return `agent_busy`. Use `send({ local: { force: true } })`"
- "`run.stream()` yields normalized `SDKMessage` events. For lower-level updates (per-token text, tool-call args streaming in, thinking deltas, step boundaries), pass `onDelta` and `onStep` callbacks to `send()`"

## Annotations for stinger-forge

- This is the primary source for `guides/04-sdk-api.md`. All API signatures should be derived from here.
- The `AgentBusyError` / cloud-one-run-at-a-time constraint is a critical gotcha for multi-run scripts - include a dedicated subsection.
- The `onDelta` + `onStep` callbacks for lower-level streaming are not widely documented - include them in guide 04.
- Confirm: streaming DOES include partial tool-call results via `tool_call` type events (answers the open question from the Command Brief).
- The `settingSources` field under `local` (not top-level) is a subtle API gotcha - mention in guide 04.
