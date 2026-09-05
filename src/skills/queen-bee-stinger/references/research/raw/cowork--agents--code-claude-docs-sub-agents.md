# Create custom subagents - Claude Code Docs
- URL: https://code.claude.com/docs/en/sub-agents
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

> Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.

Subagents are specialized AI assistants that handle specific types of tasks. Use one when a side task would flood your main conversation with search results, logs, or file contents you won't reference again: the subagent does that work in its own context and returns only the summary. Define a custom subagent when you keep spawning the same kind of worker with the same instructions.

Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions. When Claude encounters a task that matches a subagent's description, it delegates to that subagent, which works independently and returns results.

Subagents work within a single session. To run many independent sessions in parallel and monitor them from one place, see background agents (agent view). For separate sessions that pass messages to each other, see cross-session messaging. For a coordinated team of sessions Claude spawns and supervises, see agent teams.

Subagents help you:

* **Preserve context** by keeping exploration and implementation out of your main conversation
* **Enforce constraints** by limiting which tools a subagent can use
* **Reuse configurations** across projects with user-level subagents
* **Specialize behavior** with focused system prompts for specific domains
* **Control costs** by routing tasks to faster, cheaper models like Haiku

Claude uses each subagent's description to decide when to delegate tasks. When you create a subagent, write a clear description so Claude knows when to use it.

## Built-in subagents

Claude Code includes built-in subagents that Claude automatically uses when appropriate. Each inherits the parent conversation's permissions; most run with a restricted tool set.

Explore and Plan skip your CLAUDE.md files and the parent session's git status to keep research fast and inexpensive. Every other built-in and custom subagent loads both.

**Explore** — A fast, read-only agent optimized for searching and analyzing codebases.
* Model: inherits from the main conversation, capped at Opus on the Claude API
* Tools: read-only tools; Write and Edit are denied
* Purpose: file discovery, code search, codebase exploration
* When invoking Explore, Claude specifies a thoroughness level: quick, medium, or very thorough.

**Plan** — A research agent used during plan mode to gather context before presenting a plan.
* Model: inherits from the main conversation
* Tools: read-only tools; Write and Edit are denied
* Purpose: codebase research for planning

**general-purpose** — A capable agent for complex, multi-step tasks that require both exploration and action.
* Model: inherits from the main conversation
* Tools: every tool available to subagents
* Purpose: complex research, multi-step operations, code modifications

Additional helper agents (typically invoked automatically):

| Agent | Model | When Claude uses it |
| :---------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| claude | Inherits | When a task doesn't fit a more specialized agent. A catch-all with every tool available to subagents. Also the default agent for a dispatched background session |
| statusline-setup | Sonnet | When you run `/statusline` to configure your status line |
| claude-code-guide | Haiku | When you ask questions about Claude Code features |

To block a specific built-in type, add it to `permissions.deny`. To prevent Claude from delegating to any subagent, deny the `Agent` tool itself. To remove only the built-in `Explore` and `Plan` subagents, set `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1`. In non-interactive mode and the Agent SDK, set `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` to remove all built-in types and supply only your own.

## Quickstart: create your first subagent

Subagents are Markdown files with YAML frontmatter. As of v2.1.198, the `/agents` command no longer opens the interactive creation wizard; running it prints a reminder to ask Claude or edit `.claude/agents/` directly.

Example: ask Claude to write a subagent file for you, saved to `~/.claude/agents/code-improver.md`:

```markdown
---
name: code-improver
description: Scans files and suggests improvements for readability, performance, and best practices. Use after writing or modifying code.
tools: Read, Grep, Glob
model: sonnet
---

You are a code improvement specialist. For each issue you find, explain
the problem, show the current code, and provide an improved version.
```

Because the file lives in `~/.claude/agents/`, the subagent is available in every project on your machine. To scope it to one project instead, move it to that project's `.claude/agents/` directory.

If Claude can't find the new subagent, restart Claude Code and try again — this happens only when `~/.claude/agents/` didn't exist before the session started, because a running session doesn't detect a newly created `agents` directory.

## Configure subagents

### Choose the subagent scope

| Location | Scope | Priority | How to create |
| :--------------------------- | :---------------------- | :---------- | :--------------------------------------------- |
| Managed settings | Organization-wide | 1 (highest) | Deployed via managed settings |
| `--agents` CLI flag | Current session | 2 | Pass JSON when launching Claude Code |
| `.claude/agents/` | Current project | 3 | Ask Claude, or create the file manually |
| `~/.claude/agents/` | All your projects | 4 | Ask Claude, or create the file manually |
| Plugin's `agents/` directory | Where plugin is enabled | 5 (lowest) | Installed with plugins |

**Project subagents** (`.claude/agents/`) are ideal for subagents specific to a codebase. Check them into version control so your team can use and improve them collaboratively. Project subagents are discovered by walking up from the current working directory, so every `.claude/agents/` between there and the repository root is scanned. As of v2.1.178, when more than one of these nested directories defines the same `name`, Claude Code uses the definition closest to the working directory.

**User subagents** (`~/.claude/agents/`) are personal subagents available in all your projects. Claude Code scans `.claude/agents/` and `~/.claude/agents/` recursively.

**CLI-defined subagents** are passed as JSON when launching Claude Code (`claude --agents '{...}'`). They exist only for that session and aren't saved to disk. The `--agents` flag accepts JSON with the same frontmatter fields as file-based subagents: `description`, `prompt`, `tools`, `disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `skills`, `initialPrompt`, `memory`, `effort`, `background`, `isolation`, and `color`.

**Managed subagents** are deployed by organization administrators, placed as markdown files in `.claude/agents/` inside the managed settings directory. Managed definitions take precedence over project and user subagents with the same name.

**Plugin subagents** come from plugins you've installed. They load automatically alongside your custom subagents and appear in the @-mention typeahead under their scoped name (e.g. `my-plugin:code-reviewer`). For security reasons, plugin subagents don't support the `hooks`, `mcpServers`, or `permissionMode` frontmatter fields — those are ignored when loading agents from a plugin.

Subagent definitions from any of these scopes are also available to agent teams: when spawning a teammate, you can reference a subagent type and the teammate uses its `tools` and `model`, with the definition's body appended to the teammate's system prompt as additional instructions.

### Write subagent files

```markdown .claude/agents/code-reviewer.md
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

The frontmatter defines the subagent's metadata and configuration. The body becomes the system prompt that guides the subagent's behavior. Subagents receive only this system prompt plus basic environment details like the working directory, not the full Claude Code system prompt.

Claude Code watches `~/.claude/agents/` and `.claude/agents/`. When you add or edit a subagent file on disk, Claude Code detects the change within a few seconds and the next delegation uses the updated definition, with no restart needed — except when the watcher didn't cover a brand-new `agents` directory at session start, or when the session used `--disable-slash-commands`.

A subagent starts in the main conversation's current working directory. Within a subagent, `cd` commands don't persist between Bash/PowerShell tool calls. To give the subagent an isolated copy of the repository instead, set `isolation: worktree`.

#### Supported frontmatter fields

Only `name` and `description` are required.

| Field | Required | Description |
| :---------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Yes | Unique identifier using lowercase letters and hyphens. Hooks receive this value as `agent_type`. Names can't contain `:`, which is reserved for plugin-scoped identifiers such as `my-plugin:reviewer` |
| `description` | Yes | When Claude should delegate to this subagent |
| `tools` | No | Tools the subagent can use. Inherits every tool available to subagents if omitted. To preload Skills into context, use the `skills` field rather than listing `Skill` here |
| `disallowedTools` | No | Tools to deny, removed from inherited or specified list |
| `model` | No | `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit`. Defaults to `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, or `manual`. Ignored for plugin subagents |
| `maxTurns` | No | Maximum number of agentic turns before the subagent stops |
| `skills` | No | Skills to preload into the subagent's context at startup. Full skill content is injected, not only the description |
| `mcpServers` | No | MCP servers available to this subagent. Ignored for plugin subagents |
| `hooks` | No | Lifecycle hooks scoped to this subagent. Ignored for plugin subagents |
| `memory` | No | Persistent memory scope: `user`, `project`, or `local` |
| `background` | No | Set to `true` to keep this subagent in the background even when Claude asks to run it in the foreground |
| `effort` | No | Effort level: `low`, `medium`, `high`, `xhigh`, `max` |
| `isolation` | No | Set to `worktree` to run the subagent in a temporary git worktree, isolated copy of the repository |
| `color` | No | Display color: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, or `cyan` |

## How subagents relate to Cowork

Per the official Cowork get-started article and overview pages (archived separately in this research set), Cowork uses "the same agentic architecture that powers Claude Code" and its "sub-agent coordination" capability breaks complex work into smaller tasks and coordinates parallel workstreams. Cowork's plugin system can bundle "agents" (subagents) as one of four plugin component types (skills, connectors, agents, hooks) — see `cowork--plugins--claude-docs-cowork-guide-plugins.md`. Cowork itself does not expose a `.claude/agents/` directory to the end user the way Claude Code does; agents reach Cowork sessions primarily through installed plugins or Claude's own automatic subagent delegation during a task.
