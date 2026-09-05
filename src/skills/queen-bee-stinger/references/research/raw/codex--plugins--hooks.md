# Hooks – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/hooks
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins

Hooks are an extensibility framework for Codex. They allow you to inject your own scripts into the agentic loop, enabling features such as:

- Send the chat to a custom logging/analytics engine
- Scan your team's prompts to block accidentally pasting API keys
- Summarize chats to create persistent memories automatically
- Run a custom validation check when a chat turn stops, enforcing standards
- Customize prompting when in a certain directory

Runtime behavior to keep in mind:

- Matching hooks from multiple files all run.
- Multiple matching command hooks for the same event are launched concurrently, so one hook can't prevent another matching hook from starting.
- Non-managed command hooks must be reviewed and trusted before they run.

Hooks run at different points in a conversation:

| When | Hooks |
| --- | --- |
| During a turn | `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop` |
| When a session or subagent starts | `SessionStart`, `SubagentStart` |
| When the main thread ends | `SessionEnd` (doesn't run for subagents) |

## Where Codex looks for hooks

Codex discovers hooks next to active config layers in either of these forms:

- `hooks.json`
- inline `[hooks]` tables inside `config.toml`

Installed plugins can also bundle lifecycle config through their plugin manifest or a default `hooks/hooks.json` file.

The four most useful locations:

- `~/.codex/hooks.json`
- `~/.codex/config.toml`
- `<project>/.codex/hooks.json`
- `<project>/.codex/config.toml`

If more than one hook source exists, Codex loads all matching hooks. Higher-precedence config layers don't replace lower-precedence hooks. If a single layer contains both `hooks.json` and inline `[hooks]`, Codex merges them and warns at startup.

Codex can also discover hooks bundled with enabled plugins; plugin-bundled hooks load alongside other hook sources and use the same trust-review flow.

Project-local hooks load only when the project `.codex/` layer is trusted. In untrusted projects, Codex still loads user and system hooks.

## Review and trust hooks

Before a non-managed command hook can run, Codex requires you to review and trust the exact hook definition. Codex records trust against the hook's current hash, so new or changed hooks are marked for review and skipped until trusted.

Use `/hooks` in the CLI to inspect hook sources, review new/changed hooks, trust hooks, or disable individual non-managed hooks. If hooks need review at startup, Codex prints a warning telling you to open `/hooks`.

Managed hooks from system, MDM, cloud, or `requirements.toml` sources are marked as managed, trusted by policy, and can't be disabled from the user hook browser.

For one-off automation, pass `--dangerously-bypass-hook-trust` to run enabled hooks without requiring persisted hook trust for that invocation.

## Config shape

Three levels: a hook event (e.g. `PreToolUse`), a matcher group, and one or more hook handlers.

```json
{
  "description": "Optional lifecycle hooks for this workspace.",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.codex/hooks/session_start.py",
            "statusMessage": "Loading session notes"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          { "type": "command", "command": "python3 ~/.codex/hooks/session_end.py", "timeout": 3 }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py\"",
            "statusMessage": "Checking Bash command"
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/permission_request.py\"",
            "statusMessage": "Checking approval request"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/post_tool_use_review.py\"",
            "statusMessage": "Reviewing Bash output"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          { "type": "command", "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/user_prompt_submit_data_flywheel.py\"" }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/stop_continue.py\"", "timeout": 30 }
        ]
      }
    ]
  }
}
```

Notes:

- `description` is optional top-level metadata; doesn't change which hooks run.
- `timeout` is in seconds. Default `600` seconds for most hooks; `SessionEnd` defaults to `1` second, max `3`.
- `statusMessage` is optional.
- `commandWindows` is an optional Windows-only command override (`command_windows` or `commandWindows` in TOML).
- The `async` option is parsed but asynchronous command hooks aren't supported yet.
- Only `type: "command"` handlers run today; `prompt` and `agent` handlers are parsed but skipped.
- Commands run with the session `cwd` as their working directory.
- Prefer resolving repo-local hooks from the git root rather than a relative path, since Codex may start from a subdirectory.

Equivalent inline TOML:

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = '/usr/bin/python3 "$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py"'
timeout = 30
statusMessage = "Checking Bash command"

[[hooks.PostToolUse]]
matcher = "^Bash$"

[[hooks.PostToolUse.hooks]]
type = "command"
command = '/usr/bin/python3 "$(git rev-parse --show-toplevel)/.codex/hooks/post_tool_use_review.py"'
timeout = 30
statusMessage = "Reviewing Bash output"
```

## Turn hooks off

```toml
[features]
hooks = false
```

`hooks` is the canonical feature key; `codex_hooks` is a deprecated alias. Admins can force hooks off in `requirements.toml` the same way.

## Managed hooks from `requirements.toml`

Enterprise-managed requirements can define hooks inline under `[hooks]`, useful when admins want to enforce hook config while delivering scripts via MDM. Pin `[features].hooks = true` in `requirements.toml` alongside `[hooks]` to enforce even for users who disabled hooks locally. Set `allow_managed_hooks_only = true` to ignore user/project/session/plugin hooks while still allowing admin-managed hooks.

```toml
allow_managed_hooks_only = true

[features]
hooks = true

[hooks]
managed_dir = "/enterprise/hooks"
windows_managed_dir = 'C:\enterprise\hooks'

[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = "python3 /enterprise/hooks/pre_tool_use_policy.py"
command_windows = 'py -3 C:\enterprise\hooks\pre_tool_use_policy.py'
timeout = 30
statusMessage = "Checking managed Bash command"
```

`managed_dir` (macOS/Linux), `windows_managed_dir` (Windows). Codex doesn't distribute the scripts; enterprise tooling installs/updates them separately.

## Plugin-bundled hooks

Default `hooks/hooks.json` inside the plugin root; a manifest `hooks` entry in `.codex-plugin/plugin.json` can override it (path, array of paths, inline object, or array of inline objects):

```json
{ "name": "repo-policy", "hooks": "./hooks/hooks.json" }
```

Manifest hook paths resolve relative to the plugin root and must stay inside it. Plugin hook commands receive `PLUGIN_ROOT`, `PLUGIN_DATA` (Codex-specific), plus `CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA` for compatibility. Installing/enabling a plugin doesn't auto-trust its hooks.

## Matcher patterns

`matcher` is a regex string. `"*"`, `""`, or omission matches every occurrence of a supported event.

| Event | What `matcher` filters | Notes |
| --- | --- | --- |
| `PermissionRequest` | tool name | `Bash`, `apply_patch`*, MCP tool names |
| `PostToolUse` | tool name | See Tool coverage |
| `PostCompact` / `PreCompact` | compaction trigger | `manual` or `auto` |
| `PreToolUse` | tool name | See Tool coverage |
| `SessionEnd` | end reason | Currently only `other` |
| `SessionStart` | start source | `startup`, `resume`, `clear`, `compact` |
| `SubagentStart` / `SubagentStop` | subagent type | Depends on subagent |
| `UserPromptSubmit` / `Stop` | not supported | matcher ignored |

*For `apply_patch`, `matcher` values can also use `Edit` or `Write`.

Examples: `Bash`, `^apply_patch$`, `Edit|Write`, `mcp__filesystem__read_file`, `mcp__filesystem__.*`, `startup|resume|clear|compact`, `manual|auto`.

### Tool coverage

| Tool path | `PreToolUse` | `PostToolUse` | Notes |
| --- | --- | --- | --- |
| Shell commands | Yes | Yes | Match as `Bash`. |
| Unified exec (`exec_command`) | Yes | Yes | Match as `Bash`. |
| `apply_patch` | Yes | Yes | Match as `apply_patch`, `Edit`, or `Write`. |
| MCP tools | Yes | Yes | Match the MCP tool name, e.g. `mcp__filesystem__read_file`. |
| Other local function tools | Yes | Yes | e.g. `update_plan`; `spawn_agent` also matches `Agent`. |
| Hosted tools (e.g. `WebSearch`) | No | No | Don't use the local function-tool hook path. |

## Common input fields (every command hook, JSON on stdin)

| Field | Type | Meaning |
| --- | --- | --- |
| `session_id` | string | Current session id (subagent hooks use parent session id) |
| `transcript_path` | string\|null | Path to session transcript file |
| `cwd` | string | Working directory for the session |
| `hook_event_name` | string | Current hook event name |
| `model` | string | Active model slug (Codex-specific) |

Turn-scoped hooks list `turn_id` as a Codex-specific extension. `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `SubagentStart`, `SubagentStop`, `Stop` also include `permission_mode` (`default`, `acceptEdits`, `plan`, `dontAsk`, `bypassPermissions`).

## Common output fields

```json
{ "continue": true, "stopReason": "optional", "systemMessage": "optional", "suppressOutput": false }
```

| Field | Effect |
| --- | --- |
| `continue` | If `false`, marks that hook run as stopped |
| `stopReason` | Recorded as the reason for stopping |
| `systemMessage` | Surfaced as a warning in the UI/event stream |
| `suppressOutput` | Parsed but not yet implemented |

Exit `0` with no output = success, Codex continues. `PreToolUse`/`PermissionRequest` support `systemMessage` only (not `continue`/`stopReason`/`suppressOutput` — unsupported fields cause the hook run to be marked failed). `PostToolUse` supports `systemMessage`, `continue: false`, `stopReason`.

### Large hook output

Codex limits each model-visible hook-output message to ~2,500 tokens. Overflow is saved to `<temp_dir>/hook_outputs/<session_id>/<hook>.txt` with a head-and-tail preview and file path given to the model. Avoid returning secrets in hook output since it may be written to disk.

## Per-event details (partial; SessionStart, SessionEnd, SubagentStart, PreToolUse shown)

### SessionStart
`matcher` applies to `source`. Extra field: `source` (`startup`, `resume`, `clear`, `compact`). Plain text on stdout is added as extra developer context. JSON supports:
```json
{ "hookSpecificOutput": { "hookEventName": "SessionStart", "additionalContext": "Load the workspace conventions before editing." } }
```

### SessionEnd
Runs for the main thread when archiving/deleting an open conversation, on normal close, or after 30 minutes idle with no connected client. Doesn't run for subagents. `matcher` filters `reason` (currently always `other`). Example input:
```json
{ "session_id": "thr_123", "transcript_path": "/workspace/.codex/rollout.jsonl", "cwd": "/workspace", "hook_event_name": "SessionEnd", "reason": "other" }
```
Advisory only — output won't steer Codex or keep the thread open.

### SubagentStart
`matcher` applies to `agent_type`. Extra fields: `turn_id`, `agent_id`, `agent_type`, `permission_mode`. JSON output supports `systemMessage` and:
```json
{ "hookSpecificOutput": { "hookEventName": "SubagentStart", "additionalContext": "Review the repository test conventions first." } }
```
`continue: false` is parsed for compatibility but doesn't stop the subagent from starting.

### PreToolUse
Can intercept Bash, `apply_patch` file edits, MCP tool calls, and other local function tools. `matcher` applies to `tool_name` and aliases; for `apply_patch`, matcher values can use `apply_patch`, `Edit`, or `Write` (hook input still reports `tool_name: "apply_patch"`).

(Remaining per-event field tables for PostToolUse, PreCompact/PostCompact, UserPromptSubmit, SubagentStop, Stop, and the full wire-format Schemas reference were present on the live page but not captured in this fetch pass — see the live URL for full detail.)
