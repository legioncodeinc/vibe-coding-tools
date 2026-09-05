# Hooks reference
- URL: https://code.claude.com/docs/en/hooks
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

# Hooks reference

> Reference for Claude Code hook events, configuration schema, JSON input/output formats, exit codes, async hooks, HTTP hooks, prompt hooks, and MCP tool hooks.


 For a quickstart guide with examples, see [Automate actions with hooks](/docs/en/hooks-guide).


Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. Hooks run wherever Claude Code runs: sessions in the terminal, IDE extensions, the [Desktop app](/docs/en/desktop-quickstart), and [Claude Code on the web](/docs/en/claude-code-on-the-web) all fire the same hook events. Use this reference to look up event schemas, configuration options, JSON input/output formats, and advanced features like async hooks, HTTP hooks, and MCP tool hooks.

## Hook lifecycle

Claude Code runs hooks at specific points during a session. When an event fires and a matcher matches, Claude Code passes JSON context about the event to your hook handler. For command hooks, input arrives on stdin. For HTTP hooks, it arrives as the POST request body. Your handler can then inspect the input, take action, and optionally return a decision.

Events fall into three cadences:

* once per session: `SessionStart` and `SessionEnd`
* once per turn: `UserPromptSubmit`, `Stop`, and `StopFailure`
* on every tool call inside the agentic loop: `PreToolUse` and `PostToolUse`, except [`EndConversation`](/docs/en/tools-reference#endconversation-tool-behavior) calls, which skip both









The table below summarizes when each event fires. The [Hook events](#hook-events) section documents the full input schema and decision control options for each one.

| Event | When it fires |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionStart` | When a session begins or resumes |
| `Setup` | When you start Claude Code with `--init-only`, or with `--init` or `--maintenance` in `-p` mode. For one-time preparation in CI or scripts |
| `UserPromptSubmit` | When you submit a prompt, before Claude processes it |
| `UserPromptExpansion` | When a user-typed command expands into a prompt, before it reaches Claude. Can block the expansion |
| `PreToolUse` | Before a tool call executes. Can block it |
| `PermissionRequest` | When a tool call needs a permission decision |
| `PermissionDenied` | When auto mode denies a tool call, including denials without a classifier verdict. Use JSON `hookSpecificOutput.retry: true` to tell the model it may retry the denied tool call. Claude Code ignores `retry` when the classifier produced no verdict |
| `PostToolUse` | After a tool call succeeds |
| `PostToolUseFailure` | After a tool call fails |
| `PostToolBatch` | After a full batch of parallel tool calls resolves, before the next model call |
| `Notification` | When Claude Code sends a notification |
| `MessageDisplay` | While assistant message text is displayed |
| `SubagentStart` | When a subagent is spawned |
| `SubagentStop` | When a subagent finishes |
| `TaskCreated` | When a task is being created via `TaskCreate` |
| `TaskCompleted` | When a task is being marked as completed |
| `Stop` | When Claude finishes responding |
| `StopFailure` | When the turn ends due to an API error |
| `TeammateIdle` | When an [agent team](/docs/en/agent-teams) teammate is about to go idle |
| `InstructionsLoaded` | When a CLAUDE.md or `.claude/rules/*.md` file is loaded into context. Fires at session start and when files are lazily loaded during a session |
| `ConfigChange` | When a configuration file changes during a session |
| `CwdChanged` | When the working directory changes, for example when Claude executes a `cd` command. Useful for reactive environment management with tools like direnv |
| `DirectoryAdded` | When a working directory is added mid-session via `/add-dir` or the SDK `register_repo_root` control request |
| `FileChanged` | When a watched file changes on disk. The `matcher` field specifies which filenames to watch |
| `WorktreeCreate` | When a worktree is being created via `--worktree`, `isolation: "worktree"`, or for a background session. Replaces default git behavior |
| `WorktreeRemove` | When a worktree is being removed at session exit, when a subagent finishes, or when you delete a background session |
| `PreCompact` | Before context compaction |
| `PostCompact` | After context compaction completes |
| `Elicitation` | When an MCP server requests user input during a tool call |
| `ElicitationResult` | After a user responds to an MCP elicitation, before the response is sent back to the server |
| `SessionEnd` | When a session terminates |

### How a hook resolves

To see how these pieces fit together, consider this `PreToolUse` hook that blocks destructive shell commands.



 The `matcher` narrows to Bash tool calls and the `if` condition narrows further to Bash subcommands matching `rm *`, so `block-rm.sh` only spawns when both filters match:

    ```json theme={null}
    {
      "hooks": {
        "PreToolUse": [
          {
            "matcher": "Bash",
            "hooks": [
              {
                "type": "command",
                "if": "Bash(rm *)",
                "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
                "args": []
              }
            ]
          }
        ]
      }
    }
    ```

 The script reads the JSON input from stdin, extracts the command, and returns a `permissionDecision` of `"deny"` if it contains `rm -rf`. Save it to `.claude/hooks/block-rm.sh` in your project and make it executable with `chmod +x .claude/hooks/block-rm.sh` so Claude Code can run it:

    ```bash theme={null}
    #!/bin/bash
    # .claude/hooks/block-rm.sh
    COMMAND=$(jq -r '.tool_input.command')

    if echo "$COMMAND" | grep -q 'rm -rf'; then
      jq -n '{
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "Destructive command blocked by hook"
        }
      }'
    else
      exit 0  # no decision; normal permission flow applies
    fi
    ```

 This script, like the other Bash examples on this page that parse JSON input, uses `jq`, so install `jq` and make sure it is on your `PATH` before trying them.



 The matcher `Bash|PowerShell` covers the [PowerShell tool](#powershell) as well as Bash. A single `if` rule matches only one tool's calls, so each tool gets its own handler: the first narrows to Bash subcommands matching `rm *`, the second to PowerShell commands matching `Remove-Item *`. Both run the same script through `powershell.exe`:

    ```json theme={null}
    {
      "hooks": {
        "PreToolUse": [
          {
            "matcher": "Bash|PowerShell",
            "hooks": [
              {
                "type": "command",
                "if": "Bash(rm *)",
                "command": "powershell.exe",
                "args": [
                  "-NoProfile",
                  "-ExecutionPolicy",
                  "Bypass",
                  "-File",
                  "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.ps1"
                ]
              },
              {
                "type": "command",
                "if": "PowerShell(Remove-Item *)",
                "command": "powershell.exe",
                "args": [
                  "-NoProfile",
                  "-ExecutionPolicy",
                  "Bypass",
                  "-File",
                  "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.ps1"
                ]
              }
            ]
          }
        ]
      }
    }
    ```

 The `-NoProfile` flag skips loading your PowerShell profile so the hook starts fast, and `-ExecutionPolicy Bypass` lets PowerShell run the local script file.

 The script reads the JSON input from stdin, extracts the command, and returns a `permissionDecision` of `"deny"` if it contains `rm -rf` or `Remove-Item` followed by `-Recurse`. Save it to `.claude/hooks/block-rm.ps1` in your project:

    ```powershell theme={null}
    # .claude/hooks/block-rm.ps1
    $callInput = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $command = $callInput.tool_input.command

    if ($command -match 'rm -rf|Remove-Item.*-Recurse') {
      @{
        hookSpecificOutput = @{
          hookEventName = "PreToolUse"
          permissionDecision = "deny"
          permissionDecisionReason = "Destructive command blocked by hook"
        }
      } | ConvertTo-Json
    } else {
      exit 0  # no decision; normal permission flow applies
    }
    ```



Now suppose Claude Code decides to run `Bash "rm -rf /tmp/build"` against the macOS/Linux config. Here's what happens:









 The `PreToolUse` event fires. Claude Code sends the tool input as JSON on stdin to the hook:

    ```json theme={null}
    { "tool_name": "Bash", "tool_input": { "command": "rm -rf /tmp/build" }, ... }
    ```



 The matcher `"Bash"` matches the tool name, so this hook group activates. If you omit the matcher or use `"*"`, the group activates on every occurrence of the event.



 The `if` condition `"Bash(rm *)"` matches because `rm -rf /tmp/build` is a subcommand matching `rm *`, so this handler spawns. If the command had been `npm test`, the `if` check would fail and `block-rm.sh` would never run, avoiding the process spawn overhead. The `if` field is optional; without it, every handler in the matched group runs.



 The script inspects the full command and finds `rm -rf`, so it prints a decision to stdout:

    ```json theme={null}
    {
      "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": "Destructive command blocked by hook"
      }
    }
    ```

 If the command had been a safer `rm` variant like `rm file.txt`, the script would hit `exit 0` instead. Exit code 0 with no output means the hook has no decision to report, so the tool call continues through the normal [permission flow](/docs/en/permissions). The hook can deny the call, but staying silent doesn't approve it.



 Claude Code reads the JSON decision, blocks the tool call, and shows Claude the reason.



The [Configuration](#configuration) section below documents the full schema, and each [hook event](#hook-events) section documents what input your command receives and what output it can return.

## Configuration

Hooks are defined in JSON settings files. The configuration has three levels of nesting:

1. Choose a [hook event](#hook-events) to respond to, like `PreToolUse` or `Stop`
2. Add a [matcher group](#matcher-patterns) to filter when it fires, like "only for the Bash tool"
3. Define one or more [hook handlers](#hook-handler-fields) to run when matched

See [How a hook resolves](#how-a-hook-resolves) above for a complete walkthrough with an annotated example.


 This page uses specific terms for each level: **hook event** for the lifecycle point, **matcher group** for the filter, and **hook handler** for the shell command, HTTP endpoint, MCP tool, prompt, or agent that runs. "Hook" on its own refers to the general feature.


### Hook locations

Where you define a hook determines its scope:

| Location | Scope | Shareable |
| :--------------------------------------------------------- | :---------------------------- | :---------------------------------------------------- |
| `~/.claude/settings.json` | All your projects | No, local to your machine |
| `.claude/settings.json` | Single project | Yes, can be committed to the repo |
| `.claude/settings.local.json` | Single project | No, gitignored when Claude Code saves a setting to it |
| Managed policy settings | Organization-wide | Yes, admin-controlled |
| [Plugin](/docs/en/plugins) `hooks/hooks.json` | When plugin is enabled | Yes, bundled with the plugin |
| [Skill](/docs/en/skills) or [agent](/docs/en/sub-agents) frontmatter | While the component is active | Yes, defined in the component file |

Cloud sessions on [Claude Code on the web](/docs/en/claude-code-on-the-web) don't read your local `~/.claude/settings.json`; hooks there come from the repo and from your organization's server-managed settings. See [what carries over from your setup](/docs/en/cloud-environments#what-carries-over-from-your-setup) for which files reach a cloud session.

For details on settings file resolution, see [settings](/docs/en/settings).

Hooks from settings files, managed policy settings, and plugins also run inside [subagents](/docs/en/sub-agents). When a subagent calls a tool, tool events such as `PreToolUse` and `PostToolUse` fire the same configured hooks as in the main conversation, and the input carries the `agent_id` and `agent_type` [common input fields](#common-input-fields) that identify the subagent.

Enterprise administrators can use `allowManagedHooksOnly` to restrict which hooks run:

* Your user, project, local, and plugin hooks are blocked. Hooks from plugins force-enabled in managed settings `enabledPlugins` are exempt
* Claude Code also narrows your [`statusLine`](/docs/en/statusline), [`fileSuggestion`](/docs/en/settings#file-suggestion-settings), and [`subagentStatusLine`](/docs/en/statusline#subagent-status-lines) settings to managed settings
* Claude Code also disables plugins with a [`command` source](/docs/en/plugin-marketplaces#command-sources), including plugins force-enabled in managed settings `enabledPlugins`, unless [`disableCommandPluginSources`](/docs/en/settings#available-settings) is explicitly set to `false`

See [Hook configuration](/docs/en/settings#hook-configuration).

Hook entries merge across settings levels rather than replacing each other: user, project, and local settings add their own hooks without removing managed ones, and the [`disableAllHooks`](#disable-or-remove-hooks) setting can't disable managed hooks from outside managed settings.

The [HTTP hook allowlists](/docs/en/settings#hook-configuration) apply to hooks from every source, including managed policy settings:

* `allowedHttpHookUrls`: when defined at any settings level, Claude Code runs an HTTP hook handler only if its URL matches the merged allowlist
* `httpHookAllowedEnvVars`: when defined, Claude Code interpolates only the environment variables on that list into hook headers

### Matcher patterns

The `matcher` field filters when hooks fire. How a matcher is evaluated depends on the characters it contains:

| Matcher value | Evaluated as | Example |
| :---------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `"*"`, `""`, or omitted | Match all | fires on every occurrence of the event |
| Only letters, digits, `_`, `-`, spaces, `,`, and `\|` | Exact string, or list of exact strings separated by `\|` or `,` with optional surrounding whitespace | `Bash` matches only the Bash tool; `Edit\|Write` and `Edit, Write` each match either tool exactly; `code-reviewer` matches only that agent type |
| Contains any other character | JavaScript regular expression, unanchored | `^Notebook` matches any tool whose name starts with `Notebook`; `mcp__memory__.*` matches every tool from the `memory` server |

A matcher on the regular-expression path is tested with JavaScript's `RegExp.prototype.test`, which succeeds on a match anywhere in the value. `Edit.*` matches both `Edit` and `NotebookEdit`; wrap the pattern in `^` and `$`, as in `^Edit$`, when you need a whole-string match.

Comma separators and the surrounding whitespace tolerance require Claude Code v2.1.191 or later.

Hyphens in the exact-match set require Claude Code v2.1.195 or later. On earlier versions a hyphenated name like `code-reviewer` is evaluated as an unanchored regular expression, so it also fires for `senior-code-reviewer`; anchor it as `^code-reviewer$` on those versions to match only that name.

`FileChanged` and `StopFailure` use a narrower exact-match set of letters, digits, `_`, and `|` only. A hyphen, space, or comma in a matcher for those two events keeps it on the regular-expression path, and only `|` separates alternatives. Every other event with matcher support in the table that follows accepts `|` or `,`.

The `FileChanged` event doesn't follow these rules when building its watch list. See [FileChanged](#filechanged).

Each event type matches on a different field:

| Event | What the matcher filters | Example matcher values |
| :------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied` | tool name | `Bash`, `Edit\|Write`, `mcp__.*` |
| `SessionStart` | how the session started | `startup`, `resume`, `clear`, `compact`, `fork` |
| `Setup` | which CLI flag triggered setup | `init`, `maintenance` |
| `SessionEnd` | why the session ended | `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other` |
| `Notification` | notification type | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`, `elicitation_url_dialog`, `elicitation_complete`, `elicitation_response`, `agent_needs_input`, `agent_completed` |
| `SubagentStart` | agent type | `general-purpose`, `Explore`, `Plan`, custom agent names, or plugin-scoped names like `^my-plugin:reviewer$` |
| `PreCompact`, `PostCompact` | what triggered compaction | `manual`, `auto` |
| `SubagentStop` | agent type | same values as `SubagentStart` |
| `ConfigChange` | configuration source | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` |
| `CwdChanged` | no matcher support | always fires on every directory change |
| `DirectoryAdded` | how the directory was added | `slash_command`, `register_repo_root` |
| `FileChanged` | literal filenames to watch (see [FileChanged](#filechanged)) | `.envrc\|.env` |
| `StopFailure` | error type | `rate_limit`, `overloaded`, `authentication_failed`, `oauth_org_not_allowed`, `billing_error`, `invalid_request`, `model_not_found`, `server_error`, `max_output_tokens`, `unknown` |
| `InstructionsLoaded` | load reason | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact` |
| `UserPromptExpansion` | command name | your skill or command names |
| `Elicitation` | MCP server name | your configured MCP server names |
| `ElicitationResult` | MCP server name | same values as `Elicitation` |
| `UserPromptSubmit`, `PostToolBatch`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `MessageDisplay` | no matcher support | always fires on every occurrence |

The matcher runs against a field from the [JSON input](#hook-input-and-output) that Claude Code sends to your hook on stdin. For tool events, that field is `tool_name`. Each [hook event](#hook-events) section lists the full set of matcher values and the input schema for that event.

This example runs a linting script only when Claude writes or edits a file:

```json theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/lint-check.sh"
          }
        ]
      }
    ]
  }
}
```

If you add a `matcher` field to an event without matcher support, it is silently ignored.

For tool events, you can filter more narrowly by setting the [`if` field](#common-fields) on individual hook handlers. `if` uses [permission rule syntax](/docs/en/permissions) to match against the tool name and arguments together, so `"Bash(git *)"` runs when any subcommand of the Bash input matches `git *` and `"Edit(*.ts)"` runs only for TypeScript files.

#### Match MCP tools

[MCP](/docs/en/mcp) server tools appear as regular tools in tool events (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`), so you can match them the same way you match any other tool name.

MCP tools follow the naming pattern `mcp__ __ `, for example:

* `mcp__memory__create_entities`: Memory server's create entities tool
* `mcp__filesystem__read_file`: Filesystem server's read file tool
* `mcp__github__search_repositories`: GitHub server's search tool

To match every tool from a server, append `.*` to the server prefix. The `.*` is required: a matcher like `mcp__memory` or `mcp__brave-search` contains only exact-match characters, so it is compared as an exact string and matches no tool.

* `mcp__memory__.*` matches all tools from the `memory` server
* `mcp__brave-search__.*` matches all tools from a server whose name contains a hyphen
* `mcp__.*__write.*` matches any tool whose name starts with `write` from any server

Hyphens in the exact-match set require Claude Code v2.1.195 or later. On earlier versions a bare hyphenated prefix like `mcp__brave-search` is evaluated as an unanchored regular expression and matches every tool from that server. The `mcp__brave-search__.*` form works on every version.

Tools from a [plugin-bundled MCP server](/docs/en/mcp#plugin-provided-mcp-servers) use a scoped server segment that includes the plugin name: `mcp__plugin_ _ __ `. A matcher written against the bare server key never fires for these tools. For a plugin named `my-plugin` that bundles a server under the key `db`, a `query` tool appears as `mcp__plugin_my-plugin_db__query`, so the matcher for every tool from that server is `mcp__plugin_my-plugin_db__.*`. Use the same scoped tool name in a handler's [`if` field](#common-fields). See [Plugin-provided MCP servers](/docs/en/mcp#plugin-provided-mcp-servers) for how the scoped name is built.

This example logs all memory server operations and validates write operations from any MCP server:

```json theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

### Hook handler fields

Each object in the inner `hooks` array is a hook handler: the shell command, HTTP endpoint, MCP tool, LLM prompt, or agent that runs when the matcher matches. There are five types:

* **[Command hooks](#command-hook-fields)** (`type: "command"`): run a shell command. Your script receives the event's [JSON input](#hook-input-and-output) on stdin and communicates results back through exit codes and stdout.
* **[HTTP hooks](#http-hook-fields)** (`type: "http"`): send the event's JSON input as an HTTP POST request to a URL. The endpoint communicates results back through the response body using the same [JSON output format](#json-output) as command hooks.
* **[MCP tool hooks](#mcp-tool-hook-fields)** (`type: "mcp_tool"`): call a tool on an already-connected [MCP server](/docs/en/mcp). The tool's text output is treated like command-hook stdout.
* **[Prompt hooks](#prompt-and-agent-hook-fields)** (`type: "prompt"`): send a prompt to a Claude model for single-turn evaluation. The model returns a yes/no decision as JSON. See [Prompt-based hooks](#prompt-based-hooks).
* **[Agent hooks](#prompt-and-agent-hook-fields)** (`type: "agent"`): spawn a subagent that can use tools like Read, Grep, and Glob to verify conditions before returning a decision. Agent hooks are experimental and may change. See [Agent-based hooks](#agent-based-hooks).

All matching hooks run in parallel. If you define the same handler in more than one settings file, it runs once. A plugin's or skill's copy of the same handler stays separate.

Handlers run in the current directory with Claude Code's environment. The `$CLAUDE_CODE_REMOTE` environment variable is set to `"true"` in remote web environments and not set in the local CLI. As of v2.1.199, [`$CLAUDE_CODE_BRIDGE_SESSION_ID`](/docs/en/env-vars) is set to the [Remote Control](/docs/en/remote-control) session ID while the local session has
