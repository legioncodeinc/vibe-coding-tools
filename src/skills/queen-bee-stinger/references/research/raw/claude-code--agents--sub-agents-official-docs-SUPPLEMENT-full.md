# Claude Code Sub-agents (full refetch supplement)
- URL: https://code.claude.com/docs/en/sub-agents
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

# sub-agents
URL: https://code.claude.com/docs/en/sub-agents

> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Create custom subagents

> Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.

Subagents are specialized AI assistants that handle specific types of tasks. Use one when a side task would flood your main conversation with search results, logs, or file contents you won't reference again: the subagent does that work in its own context and returns only the summary. Define a custom subagent when you keep spawning the same kind of worker with the same instructions.

Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions. When Claude encounters a task that matches a subagent's description, it delegates to that subagent, which works independently and returns results. To see the context savings in practice, the [context window visualization](/docs/en/context-window) walks through a session where a subagent handles research in its own separate window.


 Subagents work within a single session. To run many independent sessions in parallel and monitor them from one place, see [background agents](/docs/en/agent-view). For separate sessions that pass messages to each other, see [cross-session messaging](/docs/en/cross-session-messaging). For a coordinated team of sessions Claude spawns and supervises, see [agent teams](/docs/en/agent-teams).


Subagents help you:

* **Preserve context** by keeping exploration and implementation out of your main conversation
* **Enforce constraints** by limiting which tools a subagent can use
* **Reuse configurations** across projects with user-level subagents
* **Specialize behavior** with focused system prompts for specific domains
* **Control costs** by routing tasks to faster, cheaper models like Haiku

Claude uses each subagent's description to decide when to delegate tasks. When you create a subagent, write a clear description so Claude knows when to use it.

## Built-in subagents

Claude Code includes built-in subagents that Claude automatically uses when appropriate. Each inherits the parent conversation's permissions; most run with a restricted tool set.

Explore and Plan skip your CLAUDE.md files and the parent session's git status to keep research fast and inexpensive. Every other built-in and [custom subagent](#configure-subagents) loads both. For the full breakdown of what reaches a subagent, see [what loads at startup](#what-loads-at-startup).



 A fast, read-only agent optimized for searching and analyzing codebases.

 * **Model**: inherits from the main conversation, capped at Opus on the Claude API, so Explore never runs on a more expensive model than the one you already chose for the session
 * **Tools**: read-only tools; Write and Edit are denied
 * **Purpose**: file discovery, code search, codebase exploration

 As of v2.1.198, Explore inherits the main conversation's model instead of always running on Haiku. On the Claude API, the inherited model is capped at Opus: a main conversation on a higher tier runs Explore on Opus, and a main conversation on Sonnet or Haiku runs Explore on that same model. On any other provider, such as [Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, or Claude Platform on AWS](/docs/en/third-party-integrations), Explore inherits the main conversation's model directly.

 A [user or project subagent](#choose-the-subagent-scope) named `Explore` overrides the built-in and keeps its own `model` field, so define one with `model: haiku` to keep exploration on a lower-cost model.

 Claude delegates to Explore when it needs to search or understand a codebase without making changes. This keeps exploration results out of your main conversation context.

 When invoking Explore, Claude specifies a thoroughness level: **quick** for targeted lookups, **medium** for balanced exploration, or **very thorough** for comprehensive analysis.



 A research agent used during [plan mode](/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode) to gather context before presenting a plan.

 * **Model**: inherits from the main conversation
 * **Tools**: read-only tools; Write and Edit are denied
 * **Purpose**: codebase research for planning

 When you're in plan mode and Claude needs to understand your codebase, it delegates research to the Plan subagent so that exploration output stays in a separate context window while the main conversation remains read-only.



 A capable agent for complex, multi-step tasks that require both exploration and action.

 * **Model**: inherits from the main conversation
 * **Tools**: every tool [available to subagents](#available-tools)
 * **Purpose**: complex research, multi-step operations, code modifications

 Claude delegates to general-purpose when the task requires both exploration and modification, complex reasoning to interpret results, or multiple dependent steps.



 Claude Code includes additional helper agents for specific tasks. These are typically invoked automatically, so you don't need to use them directly.

 | Agent | Model | When Claude uses it |
 | :---------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 | claude | Inherits | When a task doesn't fit a more specialized agent. A catch-all with every tool [available to subagents](#available-tools). Also the [default agent](/docs/en/agent-view#permission-mode-model-and-effort) for a dispatched [background session](/docs/en/agent-view), which runs with your settings' permission mode rather than a parent conversation's |
 | statusline-setup | Sonnet | When you run `/statusline` to configure your status line |
 | claude-code-guide | Haiku | When you ask questions about Claude Code features |



Built-in subagents are registered by default in interactive sessions. To restrict them:

* To block a specific built-in type, add it to `permissions.deny` as shown in [Disable specific subagents](#disable-specific-subagents).
* To prevent Claude from delegating to any subagent, deny the `Agent` tool itself with [`permissions.deny`](/docs/en/permissions#tool-specific-permission-rules).
* To remove only the built-in `Explore` and `Plan` subagents, set [`CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1`](/docs/en/env-vars). Claude reads and explores files directly instead of delegating to them. Requires Claude Code v2.1.198 or later.
* In [non-interactive mode](/docs/en/headless) and the [Agent SDK](/docs/en/agent-sdk/overview), set [`CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`](/docs/en/env-vars) to remove all built-in types and supply only your own.

Beyond these built-in subagents, you can create your own with custom prompts, tool restrictions, permission modes, hooks, and skills. The following sections show how to get started and customize subagents.

## Quickstart: create your first subagent

Subagents are Markdown files with YAML frontmatter. To create one, ask Claude to write it for you, or [write the file yourself](#write-subagent-files).

As of v2.1.198, the `/agents` command no longer opens the interactive creation wizard; running it prints a reminder to ask Claude or edit `.claude/agents/` directly. Subagent files, frontmatter fields, and the `.claude/agents/` and `~/.claude/agents/` locations are unchanged; only the terminal wizard is removed.

This walkthrough creates a user-level subagent that reviews code and suggests improvements.



 In Claude Code, describe the subagent you want and where to save it:

    ```text wrap theme={null}
    Create a personal code-improver subagent in ~/.claude/agents/ that scans
    files and suggests improvements for readability, performance, and best
    practices. It should explain each issue, show the current code, and
    provide an improved version. Make it read-only and have it use Sonnet.
    ```

 Claude writes the file with a `name`, a `description`, a `tools` list, a `model`, and a system prompt.



 Open `~/.claude/agents/code-improver.md` and confirm the frontmatter matches what you asked for. The result looks like this:

    ```markdown theme={null}
    ---
    name: code-improver
    description: Scans files and suggests improvements for readability, performance, and best practices. Use after writing or modifying code.
    tools: Read, Grep, Glob
    model: sonnet
    ---

    You are a code improvement specialist. For each issue you find, explain
    the problem, show the current code, and provide an improved version.
    ```

 Because the file lives in `~/.claude/agents/`, the subagent is available in every project on your machine. To scope it to one project instead, move it to that project's `.claude/agents/` directory. [Choose the subagent scope](#choose-the-subagent-scope) compares the two.



 Ask Claude to delegate to the new subagent:

    ```text wrap theme={null}
    Use the code-improver agent to suggest improvements in this project
    ```

 Claude delegates to your new subagent, which scans the codebase and returns improvement suggestions. In the transcript, the delegation appears as a tool call row showing the subagent's name followed by a short task description, such as `code-improver (Suggest code improvements)`.

 If Claude can't find the new subagent, restart Claude Code and try again. This happens only when `~/.claude/agents/` didn't exist before the session started, because a running session doesn't detect a newly created `agents` directory.



You now have a subagent you can use in any project on your machine to analyze codebases and suggest improvements.

You can also write subagent files by hand, define them via CLI flags, or distribute them through plugins. The following sections cover all configuration options.


 On Claude Code v2.1.197 and earlier, `/agents` opens an interactive wizard with a **Running** tab that lists live subagents and a **Library** tab for creating, editing, and deleting them.


## Configure subagents

A subagent's file location determines who it's available to, and its frontmatter determines what it can do. This section covers where subagent files live and every field they support.

### Choose the subagent scope

Store subagent files in different locations depending on scope. When multiple subagents share the same name, Claude Code uses the one from the higher-priority location.

| Location | Scope | Priority | How to create |
| :--------------------------- | :---------------------- | :---------- | :-------------------------------------------- |
| Managed settings | Organization-wide | 1 (highest) | Deployed via [managed settings](/docs/en/settings) |
| `--agents` CLI flag | Current session | 2 | Pass JSON when launching Claude Code |
| `.claude/agents/` | Current project | 3 | Ask Claude, or create the file manually |
| `~/.claude/agents/` | All your projects | 4 | Ask Claude, or create the file manually |
| Plugin's `agents/` directory | Where plugin is enabled | 5 (lowest) | Installed with [plugins](/docs/en/plugins) |

**Project subagents** (`.claude/agents/`) are ideal for subagents specific to a codebase. Check them into version control so your team can use and improve them collaboratively.

Project subagents are discovered by walking up from the current working directory, so every `.claude/agents/` between there and the repository root is scanned. As of v2.1.178, when more than one of these nested directories defines the same `name`, Claude Code uses the definition closest to the working directory.

Directories added with `--add-dir` are also scanned: a `.claude/agents/` folder inside an added directory loads alongside project subagents. See [Additional directories](/docs/en/permissions#additional-directories-grant-file-access-not-configuration) for which other configuration types load from `--add-dir`. To share subagents across projects without `--add-dir`, use `~/.claude/agents/` or a [plugin](/docs/en/plugins).

**User subagents** (`~/.claude/agents/`) are personal subagents available in all your projects.

Claude Code scans `.claude/agents/` and `~/.claude/agents/` recursively, so you can organize definitions into subfolders such as `agents/review/` or `agents/research/`. The subdirectory path doesn't affect how a subagent is identified or invoked, because identity comes only from the `name` frontmatter field.

Keep `name` values unique across the whole tree: if two files under the same `.claude/agents/` directory, including its subfolders, declare the same name, Claude Code loads only one of them, chosen by filesystem read order rather than a documented precedence. Across nested project directories, the definition closest to the working directory wins, as described above. The [`/doctor`](/docs/en/commands#all-commands) setup checkup reports files in the same directory that share a name and proposes renaming or removing all but one. Before v2.1.205, `/doctor` opened a diagnostics screen that listed duplicates and showed which definition was active.

Plugin `agents/` directories are also scanned recursively. Unlike project and user scopes, a subfolder inside a plugin's `agents/` directory becomes part of the [scoped identifier](#invoke-subagents-explicitly): a file at `agents/review/security.md` in plugin `my-plugin` registers as `my-plugin:review:security`.

**CLI-defined subagents** are passed as JSON when launching Claude Code. They exist only for that session and aren't saved to disk, making them useful for quick testing or automation scripts. You can define multiple subagents in a single `--agents` call:



    ```bash theme={null}
    claude --agents '{
      "code-reviewer": {
        "description": "Expert code reviewer. Use proactively after code changes.",
        "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
        "tools": ["Read", "Grep", "Glob", "Bash"],
        "model": "sonnet"
      },
      "debugger": {
        "description": "Debugging specialist for errors and test failures.",
        "prompt": "You are an expert debugger. Analyze errors, identify root causes, and provide fixes."
      }
    }'
    ```



    ```powershell theme={null}
    claude --agents @'
    {
      "code-reviewer": {
        "description": "Expert code reviewer. Use proactively after code changes.",
        "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
        "tools": ["Read", "Grep", "Glob", "Bash"],
        "model": "sonnet"
      },
      "debugger": {
        "description": "Debugging specialist for errors and test failures.",
        "prompt": "You are an expert debugger. Analyze errors, identify root causes, and provide fixes."
      }
    }
    '@
    ```



The `--agents` flag accepts JSON with the same [frontmatter](#supported-frontmatter-fields) fields as file-based subagents: `description`, `prompt`, `tools`, `disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `skills`, `initialPrompt`, `memory`, `effort`, `background`, `isolation`, and `color`. Use `prompt` for the system prompt, equivalent to the markdown body in file-based subagents.

**Managed subagents** are deployed by organization administrators. Place markdown files in `.claude/agents/` inside the [managed settings directory](/docs/en/settings#settings-files), using the same frontmatter format as project and user subagents. Managed definitions take precedence over project and user subagents with the same name.

**Plugin subagents** come from [plugins](/docs/en/plugins) you've installed. They load automatically alongside your custom subagents and appear in the @-mention typeahead under their scoped name. See the [plugin components reference](/docs/en/plugins-reference#agents) for details on creating plugin subagents.


 For security reasons, plugin subagents don't support the `hooks`, `mcpServers`, or `permissionMode` frontmatter fields. These fields are ignored when loading agents from a plugin. If you need them, copy the agent file into `.claude/agents/` or `~/.claude/agents/`. You can also add rules to [`permissions.allow`](/docs/en/settings#permission-settings) in `settings.json` or `settings.local.json`, but these rules apply to the entire session, not only the plugin subagent.


Subagent definitions from any of these scopes are also available to [agent teams](/docs/en/agent-teams#use-subagent-definitions-for-teammates): when spawning a teammate, you can reference a subagent type and the teammate uses its `tools` and `model`, with the definition's body appended to the teammate's system prompt as additional instructions. See [agent teams](/docs/en/agent-teams#use-subagent-definitions-for-teammates) for which frontmatter fields apply on that path.

### Write subagent files

Subagent files use YAML frontmatter for configuration, followed by the system prompt in Markdown:


 Claude Code watches `~/.claude/agents/` and `.claude/agents/`. When you add or edit a subagent file on disk, or ask Claude to write one for you, Claude Code detects the change within a few seconds and the next delegation uses the updated definition, with no restart needed.

 Two cases still need a restart:

 * The watcher covers only directories that existed when the session started, so after creating a scope's first agent file in a new `agents` directory, restart to load it.
 * Sessions started with `--disable-slash-commands` don't watch these directories at all.


```markdown .claude/agents/code-reviewer.md theme={null}
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

In [non-interactive mode](/docs/en/headless), the [`--append-subagent-system-prompt`](/docs/en/cli-reference#cli-flags) flag appends the text you provide to the end of every subagent's system prompt, including nested subagents. Requires Claude Code v2.1.205 or later.

A subagent starts in the main conversation's current working directory. Within a subagent, `cd` commands don't persist between Bash or PowerShell tool calls and don't affect the main conversation's working directory. To give the subagent an isolated copy of the repository instead, set [`isolation: worktree`](#supported-frontmatter-fields).

A subagent with `isolation: worktree` runs its Bash and PowerShell commands inside its worktree. A command whose working directory resolves to your main checkout instead, for example because the worktree directory was removed while the subagent was running, fails with an error. Before v2.1.203, such a command could run in the main checkout.

This working-directory check covers the whole repository containing the directory you launched Claude Code from. When your session runs in a linked [worktree](/docs/en/worktrees) of its own, the check also covers the main checkout that worktree is linked from. Before v2.1.210, the check covered only the launch directory itself. A command whose working directory resolved elsewhere in the same repository, such as the repository root when you launched Claude Code from a monorepo subdirectory, ran there instead of failing.

For Bash commands, Claude Code also checks the command itself in two ways:

* It blocks a command that redirects git into the main checkout.
* It refuses a command whose shape it can't verify stays inside the worktree. This refusal applies even to a command that runs no git.

The redirect vectors and the shape rules are listed under [How Claude Code enforces isolation](/docs/en/worktrees#how-claude-code-enforces-isolation). PowerShell commands get only the working-directory check.

[Monitor](/docs/en/tools-reference#monitor-tool) commands go through the same working-directory and command-content checks as Bash commands.

When the main conversation itself runs isolated in a worktree, Claude Code applies the same checks to the session and to every subagent it spawns, including subagents without `isolation: worktree`; see [How Claude Code enforces isolation](/docs/en/worktrees#how-claude-code-enforces-isolation).

#### Supported frontmatter fields

The following fields can be used in the YAML frontmatter. Only `name` and `description` are required.

| Field | Required | Description |
| :---------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Yes | Unique identifier using lowercase letters and hyphens. [Hooks](/docs/en/hooks#subagentstart) receive this value as `agent_type`. The filename doesn't have to match. Names can't contain `:`, which is reserved for [plugin-scoped identifiers](/docs/en/plugins) such as `my-plugin:reviewer`. Claude Code doesn't load a file whose name contains one and logs an error to the debug log. Before v2.1.218, such names were accepted |
| `description` | Yes | When Claude should delegate to this subagent |
| `tools` | No | [Tools](#available-tools) the subagent can use. Inherits every tool available to subagents if omitted. If no entry in the list resolves to a tool, the subagent usually [fails to launch](/docs/en/errors#agent-would-be-spawned-with-zero-tools) with an error naming the entries. To preload Skills into context, use the `skills` field rather than listing `Skill` here |
| `disallowedTools` | No | Tools to deny, removed from inherited or specified list |
| `model` | No | [Model](#choose-a-model) to use: `sonnet`, `opus`, `haiku`, `fable`, a full model ID (for example, `claude-opus-5`), or `inherit`. Defaults to `inherit` |
| `permissionMode` | No | [Permission mode](#permission-modes): `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, or `manual` as an alias for `default`. The `manual` alias requires Claude Code v2.1.200 or later. Ignored for [plugin subagents](#choose-the-subagent-scope) |
| `maxTurns` | No | Maximum number of agentic turns before the subagent stops |
| `skills` | No | [Skills](/docs/en/skills) to preload into the subagent's context at startup. The full skill content is injected, not only the description. Subagents can still invoke unlisted project, user, and plugin skills through the Skill tool |
| `mcpServers` | No | [MCP servers](/docs/en/mcp) available to this subagent. Each entry is either a server name referencing an already-configured server (e.g., `"slack"`) or an inline definition with the server name as key and a full [MCP server config](/docs/en/mcp#installing-mcp-servers) as value. Ignored for [plugin subagents](#choose-the-subagent-scope) |
| `hooks` | No | [Lifecycle hooks](#define-hooks-for-subagents) scoped to this subagent. Ignored for [plugin subagents](#choose-the-subagent-scope) |
| `memory` | No | [Persistent memory scope](#enable-persistent-memory): `user`, `project`, or `local`. Enables cross-session learning |
| `background` | No | Set to `true` to keep this subagent in the background even when Claude asks to run it in the foreground. Where [fork mode](#turn-fork-mode-on-or-off) is on, Claude Code already runs the subagents Claude spawns [in the background](#run-subagents-in-foreground-or-background) |
| `effort` | No | Effort level when this subagent is active. Overrides the session effort level. Default: inherits from session. Options: `low`, `medium`, `high`, `xhigh`, `max`; available levels depend on the model |
| `isolation` | No | Set to `worktree` to run the subagent in a temporary [git worktree](/docs/en/worktrees), giving it an isolated copy of the repository branched by default from your [default branch](/docs/en/worktrees#choose-the-base-branch) rather than the parent session's `HEAD`. The worktree is automatically cleaned up if the subagent makes no changes |
| `color` | No | Display color for the subagent in the task list and transcript. Accepts `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, or `cyan` |
| `initialPrompt` | No | Auto-submitted as the first user turn when this agent runs as the main session agent (via `--agent` or the `agent` setting). [Commands](/docs/en/commands) and [skills](/docs/en/skills) are processed. Prepended to any user-provided prompt |

### Choose a model

The `model` field controls which [AI model](/docs/en/model-config) the subagent uses:

* **Model alias**: use one of the available aliases: `sonnet`, `opus`, `haiku`, or `fable`
* **Full model ID**: use a full model ID such as `claude-opus-5` or `claude-sonnet-5`. Accepts the same values as the `--model` flag
* **inherit**: use the same model as the main conversation
* **Omitted**: defaults to `inherit` and uses the same model as the main conversation

When Claude invokes a subagent, it can also pass a `model` parameter for that specific invocation. Claude Code resolves the subagent's model in this order:

1. The [`CLAUDE_CODE_SUBAGENT_MODEL`](/docs/en/model-config#environment-variables) environment variable, when set to a model alias or model ID
2. The per-invocation `model` parameter
3. The subagent definition's `model` frontmatter
4. The main conversation's model

As of v2.1.196, setting `CLAUDE_CODE_SUBAGENT_MODEL` to `inherit` is the same as leaving it unset: resolution continues with the per-invocation `model` parameter, then the frontmatter. In earlier versions, `inherit` forced subagents onto the main conversation's model and ignored both of those sources.

Claude Code checks the environment variable, per-invocation parameter, and frontmatter values against your organization's [`availableModels`](/docs/en/model-config#restrict-model-selection) allowlist. For a blocked value, it substitutes another model:

* When the blocked value is a family alias such as `opus`, Claude Code runs the subagent on the newest version of that family the allowlist permits, following the same [substitution rules and provider scope](/docs/en/model-config#restrict-model-selection) as `/model`. Before v2.1.222, Claude Code ran the subagent on the inherited model for a blocked family alias as well.
* For any other blocked value, on providers where that substitution doesn't operate, or when the allowlist permits no version of the family, Claude Code runs the subagent on the inherited model instead.

In interactive sessions, Claude Code shows a warning naming the requested model and the model the subagent runs on, for either substitution.

A per-invocation `model` parameter also applies when the subagent is [resumed or sent a follow-up message](#resume-subagents), so the subagent stays on that model. Before v2.1.211, resuming dropped the per-invocation value and the subagent reverted to its definition's `model` field or, without one, the main conversation's model.

As of v2.1.198, subagents also inherit the main conversation's [extended thinking](/docs/en/model-config#extended-thinking) configuration: if thinking is on in your session, it's on for the subagent, and if it's off, it stays off. There is no per-subagent thinking setting. Before v2.1.198, subagents ran with extended thinking disabled regardless of the main conversation's setting.

### Control subagent capabilities

You can control what subagents can do through tool access, permission modes, and conditional rules.

#### Available tools

Subagents inherit the [built-in tools](/docs/en/tools-reference) and MCP tools available in the main conversation, narrowed by two filters: the first removes a short list of tools from every subagent, and the second reduces the built-in tool set for subagents that run in the [background](#run-subagents-in-foreground-or-background), which is the default. [Forks](#fork-the-current-conversation) skip both filters and receive the main conversation's exact tool pool. The first filter removes these tools, even when listed in the `tools` field:

* `Agent`, when the subagent is at the [depth limit](#let-subagents-spawn-their-own-subagents); in a [fork](#fork-the-current-conversation) the tool stays listed but returns an error instead of spawning
* `AskUserQuestion`
* `EndConversation`, which can end only the main conversation; see [EndConversation tool behavior](/docs/en/tools-reference#endconversation-tool-behavior)
* `EnterPlanMode`
* `ExitPlanMode`, unless the subagent's [`permissionMode`](#permission-modes) is `plan`
* `ScheduleWakeup`
* `TaskOutput`
* `WaitForMcpServers`
* `Workflow`

The second filter applies to subagents running in the background. Apart from `Agent` and `ExitPlanMode`, which follow the first filter's conditions wherever the subagent runs, a background subagent keeps every MCP tool but only these built-in tools: `Read`, `Grep`, `Glob`, `Bash`, `PowerShell`, `Edit`, `Write`, `NotebookEdit`, `WebFetch`, `WebSearch`, `TodoWrite`, `Skill`, `ToolSearch`, `EnterWorktree`, `ExitWorktree`, `Monitor`, `TaskStop`, `SendMessage`, and `Artifact`. Claude Code removes every other built-in tool from a background subagent, whether inherited or listed in the `tools` field, so the same definition can resolve to different tools in the foreground and the background. The removal reports no error unless it leaves the `tools` list [resolving to nothing](/docs/en/errors#agent-would-be-spawned-with-zero-tools). [`ListAgents`](/docs/en/cross-session-messaging) follows these filters like any built-in tool: a foreground subagent inherits it in sessions where cross-session messaging is enabled, and a background subagent doesn't keep it.

Teammates in [agent teams](/docs/en/agent-teams) additionally keep the task tools and cron tools: `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate`, `CronCreate`, `CronDelete`, and `CronList`.

To restrict tools, use the `tools` field as an allowlist or the `disallowedTools` field as a denylist. This example uses `tools` to allow only Read, Grep, Glob, and Bash. The subagent can't edit files, write files, or use any MCP tools:

```yaml theme={null}
---
name: safe-researcher
description: Research agent with restricted capabilities
tools: Read, Grep, Glob, Bash
---
```

This example uses `disallowedTools` to inherit the subagent's tool pool except Write and Edit. The subagent keeps Bash, MCP tools, and the rest of its pool:

```yaml theme={null}
---
name: no-writes
description: Inherits the available tools except file writes
disallowedTools: Write, Edit
---
```

If both are set, `disallowedTools` is applied first, then `tools` is resolved against the remaining pool. A tool listed in both is removed.

When nothing in the `tools` list resolves to a tool, for example because every entry is misspelled or names a tool that isn't available to subagents, Claude Code usually refuses to launch the subagent and the Agent tool returns an error naming the unresolved entries; see [Agent would be spawned with zero tools](/docs/en/errors#agent-would-be-spawned-with-zero-tools) for the message and how to fix each entry. Before v2.1.208, that subagent launched with no tools and could return an empty or confusing result.

Both fields accept MCP server-level patterns in addition to exact tool names: `mcp__ ` or `mcp__ __*` grants or removes every tool from the named server. In `disallowedTools`, `mcp__*` also removes every MCP tool from any server. This example removes every tool from the `github` MCP server while keeping tools from other servers and the built-in tools in its pool:

```yaml theme={null}
---
name: local-only
description: Inherits every tool except those from the github MCP server
disallowedTools: mcp__github
---
```

#### Restrict which subagents can be spawned

When an agent runs as the main thread with `claude --agent`, it can spawn subagents using the Agent tool. To restrict which subagent types it can spawn, use `Agent(agent_type)` syntax in the `tools` field.

 In version 2.1.63, the Task tool was renamed to Agent. Existing `Task(...)` references in settings and agent definitions still work as aliases.

```yaml theme={null}
---
name: coordinator
description: Coordinates work across specialized agents
tools: Agent(worker, researcher), Read, Bash
---
```

This is an allowlist: only the `worker` and `researcher` subagents can be spawned. If the agent tries to spawn any other type, the request fails and the agent sees only the allowed types in its prompt. To block specific agents while allowing all others, use [`permissions.deny`](#disable-specific-subagents) instead.

To allow spawning any subagent without restrictions, use `Agent` without parentheses:

```yaml theme={null}
tools: Agent, Read, Bash
```

If you omit `Agent` from the `tools` list entirely, the agent can't spawn any subagents with the Agent tool.

The `Agent(agent_type)` allowlist syntax applies only to an agent running as the main thread with `claude --agent`. In a subagent definition, listing `Agent` in `tools` lets that subagent spawn subagents of its own while the [depth limit](#let-subagents-spawn-their-own-subagents) allows it, but any type list inside the parentheses is ignored.

#### Scope MCP servers to a subagent

Use the `mcpServers` field to give a subagent access to [MCP](/docs/en/mcp) servers that aren't available in the main conversation. Inline servers defined here are connected when the subagent starts and disconnected when it finishes. String references share the parent session's connection.


 The `mcpServers` field applies in both contexts where an agent file can run:

 * As a subagent, spawned through the Agent tool or an @-mention
 * As the main session, launched with [`--agent`](#invoke-subagents-explicitly) or the `agent` setting

 When the agent is the main session, inline server definitions connect at startup alongside servers from [`.mcp.json`](/docs/en/mcp) and settings files. In `/mcp`, a remote (HTTP or SSE) server you've used before can show the [`cached` status](/docs/en/mcp#managing-your-servers) instead; Claude Code connects it when Claude first calls one of its tools.


Each entry in the list is either an inline server definition or a string referencing an MCP server already configured in your session:

```yaml theme={null}
---
name: browser-tester
description: Tests features in a real browser using Playwright
mcpServers:
  # Inline definition: scoped to this subagent only
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  # Reference by name: reuses an already-configured server
  - github
---

Use the Playwright tools to navigate, screenshot, and interact with pages.
```

Inline definitions use the same schema as `.mcp.json` server entries, keyed by the server name, and support the `stdio`, `http`, `sse`, and `ws` types.

To keep an MCP server out of the main conversation entirely and avoid its tool descriptions consuming context there, define it inline here rather than in `.mcp.json`. The subagent gets the tools; the parent conversation doesn't.

As of v2.1.153, the MCP restrictions that apply to the main session also cover servers declared in subagent frontmatter:

* [`--strict-mcp-config`](/docs/en/cli-reference) and [`--bare`](/docs/en/cli-reference)
* [Enterprise managed MCP configuration](/docs/en/managed-mcp)
* [`allowedMcpServers` and `deniedMcpServers` policies](/docs/en/managed-mcp#policy-based-control-with-allowlists-and-denylists)

When one of these blocks a server, Claude Code skips it and shows a warning naming the blocked servers.

Managed-settings restrictions apply to every subagent regardless of how it is defined. `--strict-mcp-config` doesn't filter servers you pass inline via `--agents` or the SDK `agents` option, since those are explicit caller input.

#### Permission modes

The `permissionMode` field controls how the subagent handles permission prompts. Subagents inherit the permission context from the main conversation and can override the mode, except in the cases described below.

| Mode | Behavior |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept file edits and common filesystem commands for paths in the working directory or `additionalDirectories` |
| `auto` | [Auto mode](/docs/en/permission-modes#eliminate-prompts-with-auto-mode): a background classifier reviews commands and protected-directory writes |
| `dontAsk` | Auto-deny permission prompts. Explicitly allowed tools still work; `AskUserQuestion`, connector tools [your organization set to `ask`](/docs/en/mcp#organization-controls-on-connector-tools), and MCP tools marked [`requiresUserInteraction`](/docs/en/mcp#require-approval-for-a-specific-tool) are denied even if you've allowed them |
| `bypassPermissions` | Skip permission prompts |
| `plan` | Plan mode (read-only exploration) |


 Use `bypassPermissions` with caution. It skips permission prompts, allowing the subagent to execute operations without approval, including writes to `.git`, `.config/git`, `.claude`, `.vscode`, `.idea`, `.husky`, `.cargo`, `.devcontainer`, `.yarn`, and `.mvn`.

 Even in this mode, some operations still prompt:

 * Explicit [`ask` rules](/docs/en/permissions#manage-permissions)
 * Connector tools [your organization set to `ask`](/docs/en/mcp#organization-controls-on-connector-tools)
 * MCP tools marked [`requiresUserInteraction`](/docs/en/mcp#require-approval-for-a-specific-tool)
 * Root and home directory removals such as `rm -rf /`
 * The [`isolatePeerMachines`](/docs/en/settings#available-settings) approval for messages beyond this machine

 See [permission modes](/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode) for details.


If the parent uses `bypassPermissions` or `acceptEdits`, this takes precedence and can't be overridden. If the parent uses [auto mode](/docs/en/permission-modes#eliminate-prompts-with-auto-mode), the subagent inherits auto mode and any `permissionMode` in its frontmatter is ignored: the classifier evaluates the subagent's tool calls with the same block and allow rules as the parent session.

If bypass mode is disabled by [`permissions.disableBypassPermissionsMode`](/docs/en/permissions#managed-settings), Claude Code ignores `permissionMode: bypassPermissions` in the frontmatter and the subagent runs with the parent session's mode. Before v2.1.223, Claude Code applied the frontmatter mode even with bypass disabled.

#### Preload skills into subagents

Use the `skills` field to inject skill content into a subagent's context at startup. This gives the subagent domain knowledge without requiring it to discover and load skills during execution.

```yaml theme={null}
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---

Implement API endpoints. Follow the conventions and patterns from the preloaded skills.
```

The full content of each listed skill is injected into the subagent's context at startup. This field controls which skills are preloaded, not which skills the subagent can access: without it, the subagent can still discover and invoke project, user, and plugin skills through the Skill tool during execution. To prevent a subagent from invoking skills entirely, omit `Skill` from the [`tools`](#available-tools) list or add it to `disallowedTools`.

You can't preload skills that set [`disable-model-invocation: true`](/docs/en/skills#control-who-invokes-a-skill), since preloading draws from the same set of skills Claude can invoke. This includes the bundled `/verify` skill: only you can run it, so it can't be preloaded either.

If a listed skill is missing or disabled, for example by your organization's policy, Claude Code skips it and logs a warning to the debug log.


 This is the inverse of [running a skill in a subagent](/docs/en/skills#run-skills-in-a-subagent). With `skills` in a subagent, the subagent controls the system prompt and loads skill content. With `context: fork` in a skill, the skill content is injected into the agent you specify. Both use the same underlying system.


#### Enable persistent memory

The `memory` field gives the subagent a persistent directory that survives across conversations. The subagent uses this directory to build up knowledge over time, such as codebase patterns, debugging insights, and architectural decisions.

```yaml theme={null}
---
name: code-reviewer
description: Reviews code for quality and best practices
memory: user
---

You are a code reviewer. As you review code, update your agent memory with
patterns, conventions, and recurring issues you discover.
```

Choose a scope based on how broadly the memory should apply:

| Scope | Location | Use when |
| :-------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `user` | `~/.claude/agent-memory/ /` | the subagent should remember learnings across all projects |
| `project` | `.claude/agent-memory/ /` | the subagent's knowledge is project-specific and shareable via version control |
| `local` | `.claude/agent-memory-local/ /` | the subagent's knowledge is project-specific but shouldn't be checked into version control |

Subagent memory is part of [auto memory](/docs/en/memory#auto-memory): if you turn auto memory off, with the `autoMemoryEnabled` setting or `CLAUDE_CODE_DISABLE_AUTO_MEMORY`, the `memory` field has no effect and the subagent launches without the memory instructions or the memory tool access described below.

When memory is enabled:

* The subagent's system prompt includes instructions for reading and writing to the memory directory.
* The subagent's system prompt also includes the first 200 lines or 25KB of `MEMORY.md` in the memory directory, whichever comes first, with instructions to curate `MEMORY.md` if it exceeds that limit.
* Read, Write, and Edit tools are automatically enabled so the subagent can manage its memory files.

##### Persistent memory tips

* `project` is the recommended default scope. It makes subagent knowledge shareable via version control.
* Ask the subagent to consult its memory before starting work: "Review this PR, and check your memory for patterns you've seen before."
* Ask the subagent to update its memory after completing a task: "Now that you're done, save what you learned to your memory." Over time, this builds a knowledge base that makes the subagent more effective.
* Include memory instructions directly in the subagent's markdown file so it proactively maintains its own knowledge base:

  ```markdown theme={null}
  Update your agent memory as you discover codepaths, patterns, library
  locations, and key architectural decisions. This builds up institutional
  knowledge across conversations. Write concise notes about what you found
  and where.
  ```

#### Conditional rules with hooks

For more dynamic control over tool usage, use `PreToolUse` hooks to validate operations before they execute. This is useful when you need to allow some operations of a tool while blocking others.

This example creates a subagent that only allows read-only database queries. The `PreToolUse` hook runs the script specified in `command` before each Bash command executes:

```yaml theme={null}
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

Claude Code [passes hook input as JSON](/docs/en/hooks#pretooluse-input) via stdin to hook commands. The validation script reads this JSON, extracts the Bash command, and [exits with code 2](/docs/en/hooks#exit-code-2-behavior-per-event) to block write operations:

```bash theme={null}
#!/bin/bash
# .
