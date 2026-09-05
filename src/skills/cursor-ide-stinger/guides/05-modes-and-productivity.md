# Guide 05: Modes and Productivity

Custom modes, the Agents Window, slash commands, and keybindings: the Cursor productivity layer.

## Custom modes

Custom modes let you configure a dedicated agent persona: a system prompt, a tool allowlist, and a display name. Use cases: a "Migration Reviewer" mode that only has read tools and always starts with your migration checklist; a "Security Auditor" mode that runs `security-worker-bee`-aligned rules by default.

### Creating a custom mode

Currently UI-only (as of May 2026; a `.cursor/modes.json` file was under consideration but not yet shipped):

1. Open Cursor Settings > Features > Chat > Custom Modes.
2. Click "Add custom mode".
3. Fill in: **Name** (shown in mode selector), **System prompt** (the mode's persona and directives), **Enabled tools** (subset of standard Cursor tools: codebase search, file operations, terminal, web search, etc.).
4. Save. The mode appears in the agent panel's mode dropdown.

### System prompt design

Effective mode system prompts:

- State the persona in the first sentence: "You are a security auditor reviewing this PR for OWASP Top 10 vulnerabilities."
- List the tools explicitly: "You have access to codebase search and file read. Do not write to disk."
- State what NOT to do: "Do not suggest refactors outside the security scope."
- Reference a rule file: "Treat the directives in `.cursor/rules/security-rules.mdc` as mandatory."

Keep system prompts under 300 tokens; they burn context budget on every invocation.

## The Agents Window (Cursor 3, April 2026)

The Agents Window is the primary agent interface introduced in Cursor 3. It replaces "Background Agents" (now called Cloud Agents) as the canonical multi-agent surface.

### What it shows

A unified sidebar listing all agents regardless of origin:
- Local agents (running in the IDE)
- Cloud Agents (isolated Ubuntu VMs)
- Mobile-initiated agents
- Agents started from Slack, GitHub, or Linear integrations

### When to use each surface

| Surface | Best for |
|---|---|
| Classic editor agent panel | Focused, single-feature work; flexible screen splitting; viewing many files |
| Agent Tabs (tiled layout) | Comparing two approaches side-by-side |
| Agents Window | Long-running cloud agents; multi-repo orchestration; managing many parallel agents |
| `/multitask` | Single task that decomposes naturally (cross-file refactors, parallel test fixes) |

### Cloud Agents setup

1. Cursor Settings > Beta > Background Agent (now "Cloud Agent") > enable.
2. Connect your GitHub account (Settings > Integrations > GitHub).
3. Set a spend limit at cursor.com/dashboard (Cloud Agents consume credits).
4. Trigger: from the Agents Window, click "New Cloud Agent" or use the `@cloud` prefix.

Cloud Agents run in isolated Ubuntu VMs, work on a dedicated `agent/` branch, and auto-open a PR on completion. Email, desktop, and Slack notifications available. Privacy Mode must be disabled.

### Local-to-cloud handoff

Mid-task, you can move an agent from local to cloud: in the Agents Window, select the local agent and choose "Continue in Cloud". The conversation history and context transfer.

## Slash commands

| Command | What it does |
|---|---|
| `/multitask` | Spawns async parallel subagents within the current task. Best for work that decomposes into independent subtasks. |
| `/worktree` | Creates an isolated git worktree for the agent's work, leaving your main checkout untouched. |
| `/best-of-n` | Runs N parallel attempts and lets you pick the best result. |
| `/create-rule` | Creates a new `.cursor/rules/*.mdc` file interactively. |

## Essential keybindings

Default shortcuts (macOS / Windows):

| Action | macOS | Windows |
|---|---|---|
| Open/close agent panel | `Cmd+L` | `Ctrl+L` |
| Open inline chat | `Cmd+K` | `Ctrl+K` |
| Accept inline suggestion | `Tab` | `Tab` |
| Reject inline suggestion | `Esc` | `Esc` |
| Open file search | `Cmd+P` | `Ctrl+P` |
| Open command palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| New agent tab | `Cmd+Shift+L` | `Ctrl+Shift+L` |
| Toggle Agents Window | (via sidebar icon) | (via sidebar icon) |

Cursor's keybindings are VS Code-compatible. All standard VS Code shortcuts work; check Preferences > Keyboard Shortcuts for the full list and to rebind.

## Inline chat vs agent panel vs Agents Window vs SDK

Decision tree for choosing the right interaction surface:

```
Do you need the agent to take actions (write files, run commands)?
  └── Yes → Are you comfortable with it working autonomously for minutes?
              └── Yes → Agent panel or Agents Window (Cloud Agent for long-running)
              └── No  → Inline chat (Cmd+K) for tight, fast feedback loops
  └── No  → Inline chat or Chat panel (information only, no side-effects)

Do you want to automate this workflow in a script or CI?
  └── Yes → @cursor/sdk (see guides/04-sdk-api.md)

Do you want to run the same task many ways in parallel?
  └── Yes → /multitask or /best-of-n
```

## Productivity patterns

- **Rule-first development:** before starting a new feature, create a scoped rule file for the feature's conventions. This primes every agent invocation with the right context automatically.
- **Worktree-per-task:** use `/worktree` for each significant change so your main branch stays clean and agents work in isolation.
- **SDK for repeatables:** any task you do more than twice is a candidate for the SDK. A 20-line TypeScript script with `Agent.prompt` can run the same audit, refactor, or review on every PR.
- **Mode-per-role:** maintain separate custom modes for common roles (reviewer, migrator, security auditor) so you don't have to re-prompt context every time.
