# Plugins reference - Claude Code Docs
- URL: https://code.claude.com/docs/en/plugins-reference
- Fetched: 2026-08-14
- Source type: official-docs
- Component: multiple (plugins, skills, agents, commands technical schema)

> Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications.

A **plugin** is a self-contained directory of components that extends Claude Code with custom functionality. Plugin components include skills, agents, hooks, MCP servers, LSP servers, and monitors.

## Plugin components reference

### Skills

Plugins add skills to Claude Code, creating `/name` shortcuts that you or Claude can invoke.

**Location**: `skills/` or `commands/` directory in plugin root, or a single `SKILL.md` file at the plugin root

**File format**: Skills are directories with `SKILL.md`; commands are simple markdown files

**Skill structure**:

```text
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

Skills and commands are automatically discovered when the plugin is installed.

If a plugin has no `skills/` directory and no `skills` manifest field, a `SKILL.md` at the plugin root is loaded as a single skill. Set the frontmatter `name` field to control the skill's invocation name. Without it, Claude Code falls back to the install directory name, which for marketplace-installed plugins is a version string that changes on every update. For plugins that ship more than one skill, use the `skills/` directory layout.

### Agents

Plugins can provide specialized subagents for specific tasks that Claude can invoke automatically when appropriate.

**Location**: `agents/` directory in plugin root

**File format**: Markdown files describing agent capabilities

```markdown
---
name: agent-name
description: What this agent specializes in and when Claude should invoke it
model: sonnet
effort: medium
maxTurns: 20
disallowedTools: Write, Edit
---

Detailed system prompt for the agent describing its role, expertise, and behavior.
```

Plugin agents support `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, and `isolation` frontmatter fields. The only valid `isolation` value is `"worktree"`. For security reasons, `hooks`, `mcpServers`, and `permissionMode` are not supported for plugin-shipped agents.

Agents appear in the @-mention typeahead under their scoped name, such as `my-plugin:code-reviewer`, once the plugin is enabled.

### Hooks

**Location**: `hooks/hooks.json` in plugin root, or inline in plugin.json

**Format**: JSON configuration with event matchers and actions

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}\"/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

Hook events include: SessionStart, Setup, UserPromptSubmit, UserPromptExpansion, PreToolUse, PermissionRequest, PermissionDenied, PostToolUse, PostToolUseFailure, PostToolBatch, Notification, MessageDisplay, SubagentStart, SubagentStop, TaskCreated, TaskCompleted, Stop, StopFailure, TeammateIdle, InstructionsLoaded (fires when a CLAUDE.md or `.claude/rules/*.md` file is loaded into context), ConfigChange, CwdChanged, DirectoryAdded, FileChanged, WorktreeCreate, WorktreeRemove, PreCompact, PostCompact, Elicitation, ElicitationResult, SessionEnd.

Hook types: `command` (shell), `http` (POST to a URL), `mcp_tool` (call an MCP server tool), `prompt` (evaluate with an LLM), `agent` (agentic verifier).

### MCP servers

**Location**: `.mcp.json` in plugin root, or inline in plugin.json

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": { "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data" }
    }
  }
}
```

Plugin MCP servers start automatically when the plugin is enabled and appear as standard MCP tools in Claude's toolkit.

### LSP servers

**Location**: `.lsp.json` in plugin root, or inline in `plugin.json`. Requires `command` and `extensionToLanguage` fields. Optional fields include `args`, `transport`, `env`, `initializationOptions`, `settings`, `workspaceFolder`, `startupTimeout`, `shutdownTimeout`, `restartOnCrash`, `maxRestarts`, `diagnostics`.

### Monitors

Plugins can declare background monitors that Claude Code starts automatically when the plugin is active — each runs a shell command for the lifetime of the session and delivers stdout lines to Claude as notifications.

**Location**: `monitors/monitors.json` in the plugin root, or inline in `plugin.json` under `experimental.monitors`.

```json
[
  {
    "name": "deploy-status",
    "command": "\"${CLAUDE_PLUGIN_ROOT}\"/scripts/poll-deploy.sh",
    "description": "Deployment status changes"
  },
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log",
    "when": "on-skill-invoke:debug"
  }
]
```

### Themes

Plugins can ship color themes: a JSON file in `themes/` with a `base` preset and a sparse `overrides` map of color tokens.

---

## Plugin installation scopes

| Scope | Settings file | Use case |
| :-------- | :---------------------------------------------- | :--------------------------------------------------------------------------- |
| `user` | `~/.claude/settings.json` | Personal plugins available across all projects (default) |
| `project` | `.claude/settings.json` | Team plugins shared via version control |
| `local` | `.claude/settings.local.json` | Project-specific plugins, gitignored |
| `managed` | Managed settings | Managed plugins (read-only, update only) |

## Skills-directory plugins

Any folder under a skills directory that contains a `.claude-plugin/plugin.json` manifest is loaded as a plugin named `<dir>@skills-dir` on the next session, with no marketplace and no install step.

| What you have | What it is |
| :-------------------------------------------- | :---------------------------------------------------------------------------------- |
| `<dir>/foo/SKILL.md` with no manifest | A plain skill named `foo` |
| `<dir>/foo/.claude-plugin/plugin.json` | A plugin `foo@skills-dir`, which can bundle its own skills, agents, hooks, and more |
| `<dir>/skills/bar/SKILL.md` | A skill `bar` packaged inside a plugin |

## Plugin manifest schema

The `.claude-plugin/plugin.json` file defines your plugin's metadata and configuration. The manifest is optional — if omitted, Claude Code auto-discovers components in default locations.

### Complete schema

```json
{
  "name": "plugin-name",
  "displayName": "Plugin Name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "metadata": { "catalogId": "cat-123", "tier": "pro" },
  "skills": "./custom/skills/",
  "commands": ["./custom/commands/special.md"],
  "agents": ["./custom/agents/reviewer.md"],
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json",
  "experimental": {
    "themes": "./themes/",
    "monitors": "./monitors.json"
  },
  "dependencies": [
    "helper-lib",
    { "name": "secrets-vault", "version": "~2.1.0" }
  ]
}
```

If you include a manifest, `name` is the only required field (kebab-case, no spaces). This name is used for namespacing components: e.g. the agent `agent-creator` for the plugin with name `plugin-dev` appears as `plugin-dev:agent-creator`.

Claude Code ignores top-level fields it does not recognize, so `plugin.json` can double as a VS Code/Cursor extension manifest, npm `package.json`, or MCPB/DXT bundle manifest.

## Directory layout (common mistake note)

Don't put `commands/`, `agents/`, `skills/`, or `hooks/` inside the `.claude-plugin/` directory. Only `plugin.json` goes inside `.claude-plugin/`. All other directories must be at the plugin root level.

| Directory | Location | Purpose |
| :---------------- | :---------- | :----------------------------------------------------------------------------- |
| `.claude-plugin/` | Plugin root | Contains `plugin.json` manifest (optional if components use default locations) |
| `skills/` | Plugin root | Skills as `<name>/SKILL.md` directories |
| `commands/` | Plugin root | Skills as flat Markdown files (legacy; use `skills/` for new plugins) |
| `agents/` | Plugin root | Custom agent definitions |
| `hooks/` | Plugin root | Event handlers in `hooks.json` |
| `.mcp.json` | Plugin root | MCP server configurations |
| `.lsp.json` | Plugin root | LSP server configurations |
| `monitors/` | Plugin root | Background monitor configurations |
| `bin/` | Plugin root | Executables added to Bash tool's PATH while plugin enabled |
| `settings.json` | Plugin root | Default settings applied when the plugin is enabled |
