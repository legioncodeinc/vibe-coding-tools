# Guide 04: Cursor SDK API

Reference guide for `@cursor/sdk`: programmatic agent automation built on the same runtime powering Cursor's IDE.

**Package:** `@cursor/sdk` (public beta since April 29, 2026, npm first published April 26, 2026).
**Install:** `npm install @cursor/sdk`

## Agent lifecycle

```typescript
import { Agent } from "@cursor/sdk";

// Create
const agent = await Agent.create({
  local: {
    cwd: "/path/to/project",
    model: "claude-sonnet-4-5",     // required for local runtime
    settingSources: ["user"],        // optional: which Cursor settings to inherit
  }
});

// Send and stream
const run = agent.send("Refactor the auth module to use JWT");
for await (const msg of run.stream()) {
  switch (msg.type) {
    case "assistant": process.stdout.write(msg.text ?? ""); break;
    case "tool_call": console.log(`Tool: ${msg.name} [${msg.status}]`); break;
    case "status":    console.log(`Status: ${msg.text}`); break;
  }
}
const result = await run.wait(); // RunResult

// Dispose
await agent.dispose();
```

## `Agent.create(options)`: option reference

### Local runtime

```typescript
{
  local: {
    cwd: string,              // project root (required)
    model: string,            // model identifier (required for local)
    settingSources?: string[] // e.g. ["user", "project"]
  }
}
```

Note: `settingSources` is nested under `local`, NOT at the top level. This is a subtle API gotcha.

### Cloud runtime

```typescript
{
  cloud: {
    repos?: string[],           // GitHub repos to give the agent access to
    autoCreatePR?: boolean,     // auto-open PR on task completion
    skipReviewerRequest?: boolean
  }
}
```

Cloud agents: one active run at a time per agent. Watch for `AgentBusyError`.

## Convenience methods

```typescript
// One-shot: create, send, wait, dispose
const result = await Agent.prompt("Fix the failing tests", {
  local: { cwd: "/project", model: "claude-sonnet-4-5" }
});

// Resume across process boundaries
const agent = await Agent.resume(agentId, {
  local: { cwd: "/project", model: "claude-sonnet-4-5" }
});
```

## `run.stream()`: event types

`run.stream()` is an async generator yielding `SDKMessage` events discriminated on `type`:

| Type | Key fields | Description |
|---|---|---|
| `system` | `text` | System-level messages |
| `user` | `text` | User messages echoed back |
| `assistant` | `text` | Agent prose output |
| `thinking` | `text` | Chain-of-thought (models that support it) |
| `tool_call` | `callId`, `name`, `status`, `args`, `result` | Tool invocations; `status` is `running` or `completed` |
| `status` | `text` | Progress updates |
| `task` | `text` | Sub-task tracking |
| `request` | - | Awaiting user input (rarely seen in SDK flows) |

`tool_call` events ARE streamed incrementally: partial tool-call results are available before the tool completes. This resolves the Command Brief's open question.

### Lower-level callbacks

For per-token streaming and step boundaries, pass callbacks to `agent.send()`:

```typescript
const run = agent.send("do X", {
  onDelta: (delta) => process.stdout.write(delta.text ?? ""),
  onStep: (step) => console.log("Step:", step.type),
});
```

`onDelta` fires on every token; `onStep` fires at tool/thought/response boundaries. Use these when you need lower latency than batch `SDKMessage` events.

## Error handling

All SDK errors extend `CursorAgentError`:

```typescript
try {
  const result = await run.wait();
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error(`Code: ${err.code}, Retryable: ${err.isRetryable}`);
    if (err.isRetryable) {
      // back off and retry
    }
  }
}
```

### Error subclass catalog

| Class | HTTP | Code | Retryable | Notes |
|---|---|---|---|---|
| `AuthenticationError` | 401 | `authentication_error` | false | Check `CURSOR_API_KEY` / login state |
| `RateLimitError` | 429 | `rate_limit_error` | true | Exponential back-off |
| `ConfigurationError` | 400 | `configuration_error` | false | Bad options in `Agent.create` |
| `AgentBusyError` | 409 | `agent_busy` | false | Cloud only; one run at a time |
| `IntegrationNotConnectedError` | 4xx | `integration_not_connected` | false | MCP or GitHub integration missing |
| `NetworkError` | - | `network_error` | true | Transient connectivity |
| `UnknownAgentError` | 404 | `unknown_agent` | false | `agentId` not found for `Agent.resume` |

**AgentBusyError recovery pattern (cloud agents):**

```typescript
} catch (err) {
  if (err instanceof AgentBusyError) {
    // Cloud agents allow only one active run; wait and poll
    await new Promise(r => setTimeout(r, 5000));
    const activeRun = (await Agent.listRuns(agentId)).find(r => r.status === "running");
    // handle or cancel activeRun before retrying
  }
}
```

For local agents, `agent_busy` never fires. Use `send({ local: { force: true } })` to override any local lock.

## Listing and inspection

```typescript
const agents = await Agent.list();
const runs = await Agent.listRuns(agentId);
const run = await Agent.getRun(runId);
const messages = await Agent.messages.list(runId);
```

## Capability guards

```typescript
if (run.supports("stream")) {
  for await (const msg of run.stream()) { ... }
} else {
  console.log(run.unsupportedReason("stream"));
}
```

## Open question: plan tier detection

There is no documented public API for detecting the active Cursor plan tier (Free / Pro / Business / Enterprise) from within an SDK run. Guard features by testing them with `run.supports()` or catching `ConfigurationError` rather than inspecting the plan tier directly.

## CI/CD usage (handoff note)

Providing the SDK code that runs agents is `cursor-ide-worker-bee`'s job. Wiring it into GitHub Actions or Docker containers is `devops-worker-bee`'s job. After writing the SDK script, hand off to `devops-worker-bee` for pipeline integration.
