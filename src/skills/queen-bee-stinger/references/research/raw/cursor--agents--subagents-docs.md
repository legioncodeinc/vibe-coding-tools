# Subagents | Cursor Docs
- URL: https://cursor.com/docs/subagents
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

# Subagents

Subagents are specialized AI assistants that Cursor's agent can delegate tasks to. Each subagent operates in its own context window, handles specific types of work, and returns its result to the parent agent. Use subagents to break down complex tasks, do work in parallel, and preserve context in the main conversation.

You can use subagents in the editor, CLI, and [Cloud Agents](https://cursor.com/docs/cloud-agent.md).

### Context isolation

Each subagent has its own context window. Long research or exploration tasks don't consume space in your main conversation.

### Parallel execution

Launch multiple subagents simultaneously. Work on different parts of your codebase without waiting for sequential completion.

### Specialized expertise

Configure subagents with custom prompts, tool access, and models for domain-specific tasks.

### Reusability

Define custom subagents and use them across projects.

## How subagents work

When Agent encounters a complex task, it can launch a subagent automatically. The subagent receives a prompt with all necessary context, works autonomously, and returns a final message with its results.

Subagents start with a clean context. The parent agent includes relevant information in the prompt since subagents don't have access to prior conversation history.

### Foreground vs background

Subagents run in one of two modes:

| Mode | Behavior | Best for |
| :------------- | :------------------------------------------------------------------- | :------------------------------------------ |
| **Foreground** | Blocks until the subagent completes. Returns the result immediately. | Sequential tasks where you need the output. |
| **Background** | Returns immediately. The subagent works independently. | Long-running tasks or parallel workstreams. |

## Built-in subagents

Cursor includes three built-in subagents that handle context-heavy operations automatically. These subagents were designed based on analysis of agent conversations where context window limits were hit.

| Subagent | Purpose | Why it's a subagent |
| :---------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Explore** | Searches and analyzes codebases | Codebase exploration generates large intermediate output that would bloat the main context. Uses a faster model to run many parallel searches. |
| **Bash** | Runs series of shell commands | Command output is often verbose. Isolating it keeps the parent focused on decisions, not logs. |
| **Browser** | Controls browser via MCP tools | Browser interactions produce noisy DOM snapshots and screenshots. The subagent filters this down to relevant results. |

### Why these subagents exist

These three operations share common traits: they generate noisy intermediate output, benefit from specialized prompts and tools, and can consume significant context. Running them as subagents solves several problems:

- **Context isolation** — Intermediate output stays in the subagent. The parent only sees the final summary.
- **Model flexibility** — The explore subagent uses a faster model by default. This enables running 10 parallel searches in the time a single main-agent search would take.
- **Specialized configuration** — Each subagent has prompts and tool access tuned for its specific task.
- **Cost efficiency** — Faster models cost less. Isolating token-heavy work in subagents with appropriate model choices reduces overall cost.

You don't need to configure these subagents. Agent uses them automatically when appropriate.

## When to use subagents

| Use subagents when... | Use skills when... |
| :-------------------------------------------------------- | :------------------------------------------------------ |
| You need context isolation for long research tasks | The task is single-purpose (generate changelog, format) |
| Running multiple workstreams in parallel | You want a quick, repeatable action |
| The task requires specialized expertise across many steps | The task completes in one shot |
| You want an independent verification of work | You don't need a separate context window |

If you find yourself creating a subagent for a simple, single-purpose task like "generate a changelog" or "format imports," consider using a [skill](https://cursor.com/docs/skills.md) instead.

## Quick start

Agent automatically uses subagents when appropriate. You can also create a custom subagent by asking Agent:

Create a subagent file at .cursor/agents/verifier.md with YAML frontmatter (name, description) followed by the prompt. The verifier subagent should validate completed work, check that implementations are functional, run tests, and report what passed vs what's incomplete.

For more control, create custom subagents manually in your project or user directory.

## Custom subagents

Define custom subagents to encode specialized knowledge, enforce team standards, or automate repetitive workflows.

### File locations

| Type | Location | Scope |
| :-------------------- | :------------------ | :--------------------------------------------------- |
| **Project subagents** | `.cursor/agents/` | Current project only |
| | `.claude/agents/` | Current project only (Claude compatibility) |
| | `.codex/agents/` | Current project only (Codex compatibility) |
| **User subagents** | `~/.cursor/agents/` | All projects for current user |
| | `~/.claude/agents/` | All projects for current user (Claude compatibility) |
| | `~/.codex/agents/` | All projects for current user (Codex compatibility) |

Project subagents take precedence when names conflict. When multiple locations contain subagents with the same name, `.cursor/` takes precedence over `.claude/` or `.codex/`.

### File format

Each subagent is a markdown file with YAML frontmatter:

```markdown
---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
readonly: true
---

You are a security expert auditing code for vulnerabilities.

When invoked:
1. Identify security-sensitive code paths
2. Check for common vulnerabilities (injection, XSS, auth bypass)
3. Verify secrets are not hardcoded
4. Review input validation and sanitization

Report findings by severity:
- Critical (must fix before deploy)
- High (fix soon)
- Medium (address when possible)
```

### Configuration fields

| Field | Type | Required | Default | Description |
| :-------------- | :------ | :------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `name` | string | No | Derived from filename | Display name and identifier. Use lowercase letters and hyphens. |
| `description` | string | No | — | Short description shown in Task tool hints. Agent reads this to decide delegation. |
| `model` | string | No | `inherit` | Model to use: `inherit` or a specific model ID. See model configuration. |
| `readonly` | boolean | No | `false` | If `true`, the subagent runs with restricted write permissions (no file edits, no state-changing shell commands). |
| `is_background` | boolean | No | `false` | If `true`, the subagent runs in the background without blocking the parent. |

### Model configuration

The `model` field controls which model a subagent uses. There are two options:

| Value | Behavior |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inherit` | Uses the same model as the parent agent. This is the default. |
| A specific model ID | Uses the exact model you specify, such as `composer-2` or `gpt-5.6-sol`. See the models reference for available IDs. |

Choose `inherit` when the subagent needs the same reasoning power as the parent. Use a specific model ID when you need a particular model's capabilities regardless of what the parent uses.

#### Model parameters

Append square brackets to a model ID to set per-model options like speed, reasoning effort, and context window. Write options as `id=value` pairs, and separate multiple options with commas.

| Example | Behavior |
| :---------------------------------------- | :--------------------------------------------------------------------------------------- |
| `composer-2.5[]` | Pins the base model. Empty brackets select the standard variant instead of the fast one. |
| `composer-2.5[fast=false]` | Selects the standard (non-fast) variant explicitly. |
| `claude-opus-5[effort=high]` | Sets reasoning effort to `high`. |
| `claude-opus-5[context=300k]` | Sets the context window to 300k tokens. |
| `claude-opus-5[effort=high,context=300k]` | Combines options. |

Available options depend on the model, and use the same `id=value` pairs as the SDK's model parameters.

```markdown
---
name: planner
description: Plans complex changes before implementation.
model: claude-opus-5[effort=high]
---

Break the task into a clear, ordered implementation plan.
```

#### When the configured model won't be used

Cursor honors the `model` field in your subagent frontmatter unless one of these conditions applies:

- **Team admin restrictions** — Your organization's admin has blocked the specified model.
- **Legacy Max Mode setting** — On a legacy request-based plan, the model requires Max Mode and you don't have it enabled.
- **Plan limitations** — The model isn't available on your current plan.

In these cases, Cursor falls back to a compatible model. If you're seeing unexpected model behavior, check your plan and model settings.

## Using subagents

### Automatic delegation

Agent proactively delegates tasks based on:

- The task complexity and scope
- Custom subagent descriptions in your project
- Current context and available tools

Include phrases like "use proactively" or "always use for" in your description field to encourage automatic delegation.

### Explicit invocation

Request a specific subagent by using the `/name` syntax in your prompt:

```text
> /verifier confirm the auth flow is complete
> /debugger investigate this error
> /security-auditor review the payment module
```

You can also invoke subagents by mentioning them naturally:

```text
> Use the verifier subagent to confirm the auth flow is complete
> Have the debugger subagent investigate this error
> Run the security-auditor subagent on the payment module
```

### Parallel execution

Launch multiple subagents concurrently for maximum throughput:

```text
> Review the API changes and update the documentation in parallel
```

Agent sends multiple Task tool calls in a single message, so subagents run simultaneously.

## Cloud subagents

From a local agent session, you can hand off work to a cloud subagent that runs on its own VM and branch. Your local workspace stays clean and responsive while long-running or parallel work happens in the cloud. The parent agent keeps running locally or in the cloud without interruption. Cloud subagents run from the Agents Window in the Cursor desktop app.

### Start a cloud subagent with /in-cloud

Type `/in-cloud` and the next task you submit runs as a cloud subagent. It spins up its own VM and branch to work on the task.

This is useful for isolating long-running or parallel work, such as fixing CI, investigating an issue, or exploring a codebase while you keep working locally.

### Babysit a PR with /babysit

Ask a cloud subagent to babysit a pull request with `/babysit` or by clicking the quick-action pill. The cloud agent iterates remotely to prepare the PR for merge without tying up your local session.

Cloud subagents use the environment configured for your repo and follow the same model and capability rules as other Cloud Agents. Because they run on a cloud VM, their MCP servers come from your team's configuration at cursor.com/agents, not from your local session.

## Resuming subagents

Subagents can be resumed to continue previous conversations. This is useful for long-running tasks that span multiple invocations.

Each subagent execution returns an agent ID. Pass this ID to resume the subagent with full context preserved:

```text
> Resume agent abc123 and analyze the remaining test failures
```

Background subagents write their state as they run. You can resume a subagent after it completes to continue the conversation with preserved context.

## Common patterns

### Verification agent

A verification agent independently validates whether claimed work was actually completed. This addresses a common issue where AI marks tasks as done but implementations are incomplete or broken.

```markdown
---
name: verifier
description: Validates completed work. Use after tasks are marked done to confirm implementations are functional.
---

You are a skeptical validator. Your job is to verify that work claimed as complete actually works.

When invoked:
1. Identify what was claimed to be completed
2. Check that the implementation exists and is functional
3. Run relevant tests or verification steps
4. Look for edge cases that may have been missed

Be thorough and skeptical. Report:
- What was verified and passed
- What was claimed but incomplete or broken
- Specific issues that need to be addressed

Do not accept claims at face value. Test everything.
```

This pattern is useful for:

- Validating that features work end-to-end before marking tickets complete
- Catching partially implemented functionality
- Ensuring tests actually pass (not just that test files exist)

### Orchestrator pattern

For complex workflows, a parent agent can coordinate multiple specialist subagents in sequence:

1. **Planner** analyzes requirements and creates a technical plan
2. **Implementer** builds the feature based on the plan
3. **Verifier** confirms the implementation matches requirements

Each handoff includes structured output so the next agent has clear context.

## Example subagents

### Debugger

```markdown
---
name: debugger
description: Debugging specialist for errors and test failures. Use when encountering issues.
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach

Focus on fixing the underlying issue, not symptoms.
```

### Test runner

```markdown
---
name: test-runner
description: Test automation expert. Use proactively to run tests and fix failures.
---

You are a test automation expert.

When you see code changes, proactively run appropriate tests.

If tests fail:
1. Analyze the failure output
2. Identify the root cause
3. Fix the issue while preserving test intent
4. Re-run to verify

Report test results with:
- Number of tests passed/failed
- Summary of any failures
- Changes made to fix issues
```

## Best practices

- **Write focused subagents** — Each subagent should have a single, clear responsibility. Avoid generic "helper" agents.
- **Invest in descriptions** — The `description` field determines when Agent delegates to your subagent. Spend time refining it. Test by making prompts and checking if the right subagent gets triggered.
- **Keep prompts concise** — Long, rambling prompts dilute focus. Be specific and direct.
- **Add subagents to version control** — Check `.cursor/agents/` into your repository so the team benefits.
- **Start with Agent-generated agents** — Let Agent help you draft the initial configuration, then customize.
- **Use hooks for file output** — If you need subagents to produce structured output files, consider using hooks to process and save their results consistently.

### Anti-patterns to avoid

**Don't create dozens of generic subagents.** Having 50+ subagents with vague instructions like "helps with coding" is ineffective. Agent won't know when to use them, and you'll waste time maintaining them.

- **Vague descriptions** — "Use for general tasks" gives Agent no signal about when to delegate. Be specific: "Use when implementing authentication flows with OAuth providers."
- **Overly long prompts** — A 2,000-word prompt doesn't make a subagent smarter. It makes it slower and harder to maintain.
- **Duplicating slash commands** — If a task is single-purpose and doesn't need context isolation, use a skill or command instead.
- **Too many subagents** — Start with 2-3 focused subagents. Add more only when you have clear, distinct use cases.

## Managing subagents

### Creating subagents

The easiest way to create a subagent is to ask Agent to create one for you, or create subagents manually by adding markdown files to `.cursor/agents/` (project) or `~/.cursor/agents/` (user).

### Viewing subagents

Agent includes all custom subagents in its available tools. You can see which subagents are configured by checking the `.cursor/agents/` directory in your project.

## Performance and cost

Subagents have trade-offs. Understanding them helps you decide when to use them.

| Benefit | Trade-off |
| :----------------- | :------------------------------------------------------------ |
| Context isolation | Startup overhead (each subagent gathers its own context) |
| Parallel execution | Higher token usage (multiple contexts running simultaneously) |
| Specialized focus | Latency (may be slower than main agent for simple tasks) |

### Token and cost considerations

- **Subagents consume tokens independently** — Each subagent has its own context window and token usage. Running five subagents in parallel uses roughly five times the tokens of a single agent.
- **Evaluate the overhead** — For quick, simple tasks, the main agent is often faster. Subagents shine for complex, long-running, or parallel work.
- **Subagents can be slower** — The benefit is context isolation, not speed. A subagent doing a simple task may be slower than the main agent because it starts fresh.

## FAQ

### What are the built-in subagents?

Cursor includes three built-in subagents: `explore` for codebase search, `bash` for running shell commands, and `browser` for browser automation via MCP. These handle context-heavy operations automatically. You don't need to configure them.

### Can subagents launch other subagents?

Yes, within a nesting limit. Since Cursor 2.5, subagents can launch child subagents to create a tree of coordinated work. The main agent and its direct subagents can launch subagents, but a subagent launched by another subagent can't launch further ones.
Nested launches also need Task tool access in the current mode, and hooks or tool policies can block spawning.

### How do I see what a subagent is doing?

Background subagents write output to `~/.cursor/subagents/`. The parent agent can read these files to check progress.

### What happens if a subagent fails?

The subagent returns an error status to the parent agent. The parent can retry, resume with additional context, or handle the failure differently.

### Can I use MCP tools in subagents?

Yes. Subagents inherit all tools from the parent, including MCP tools from configured servers. Cloud subagents are the exception: they run on a cloud VM and use the MCP servers configured for your team at cursor.com/agents, not the servers from your local session.

### How do I debug a misbehaving subagent?

Check the subagent's description and prompt. Ensure the instructions are specific and unambiguous. You can also test the subagent by invoking it explicitly with a simple task.

### Why is my subagent using a different model?

Cursor overrides the configured model when your team admin blocks it, your plan doesn't include it, or a legacy request-based plan requires Max Mode and you don't have it enabled. On legacy request-based plans without Max Mode, subagents run using Composer regardless of any `model` configuration. If your team admin has blocked Composer, subagents can run only when Max Mode is enabled. On usage-based plans and legacy request-based plans with Max Mode, subagents default to the parent model.
