# Plugins reference | Cursor Docs
- URL: https://cursor.com/docs/reference/plugins
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins

# Plugins reference

Reference documentation for building, structuring, and submitting Cursor plugins. Plugins package rules, skills, agents, commands, MCP servers, and hooks into distributable bundles that work in the Cursor IDE.

If you're starting from scratch, use the [plugin template repository](https://github.com/cursor/plugin-template).

## Supported plugin formats

Cursor loads plugins in two formats, identified by their manifest location:

| Format | Manifest location | Components |
| :--------------------------------------------------------- | :------------------------------- | :------------------------------------------------------------- |
| [Agent Plugins](https://agent-plugins.org) (open standard) | `plugin.json` at the plugin root | Skills, MCP servers |
| Cursor Plugins | `.cursor-plugin/plugin.json` | Skills, MCP servers, rules, agents, commands, hooks, variables |

A plugin that conforms to the [Agent Plugins specification](https://github.com/agentplugins/agent-plugins-spec) loads in Cursor without changes. The rest of this reference documents the Cursor plugin format, which is developed in parallel with the standard and supports the full set of Cursor components.

## Plugin structure

A plugin is a directory with a manifest file and your plugin assets:

### Agent Plugin

```text
my-plugin/
├── plugin.json            # Required: Agent Plugins manifest
├── skills/                # Agent Skills
│   └── code-reviewer/
│       └── SKILL.md
└── mcp.json               # MCP server definitions
```

The Agent Plugins standard defines portable skills and MCP servers. See the
[Agent Plugins authoring guide](https://agent-plugins.org/plugin-authors) for
the full package and schema reference.

### Cursor Plugin

```text
my-plugin/
├── .cursor-plugin/
│   └── plugin.json        # Required: Cursor Plugin manifest
├── rules/                 # Cursor rules (.mdc files)
│   ├── coding-standards.mdc
│   └── review-checklist.mdc
├── skills/                # Agent skills
│   └── code-reviewer/
│       └── SKILL.md
├── agents/                # Custom agent configurations
│   └── security-reviewer.md
├── commands/              # Agent-executable commands
│   └── deploy.md
├── hooks/                 # Hook definitions
│   └── hooks.json
├── mcp.json               # MCP server definitions
├── assets/                # Logos and static assets
│   └── logo.svg
├── scripts/                # Hook and utility scripts
│   └── format-code.py
└── README.md
```

## Cursor Plugin manifest

Every Cursor Plugin requires a `.cursor-plugin/plugin.json` manifest file. The
sections below document Cursor Plugin fields, components, and marketplace
features. For a root Agent Plugins manifest, use the
[standard's manifest reference](https://agent-plugins.org/plugin-authors/manifest).

### Required fields

| Field | Type | Description |
| :----- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | string | Plugin identifier. Lowercase, kebab-case (alphanumerics, hyphens, and periods). Must start and end with an alphanumeric character. Examples: `my-plugin`, `prompts.chat` |

### Optional fields

| Field | Type | Description |
| :------------ | :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | string | Brief plugin description |
| `version` | string | Semantic version (e.g., `1.0.0`) |
| `author` | object | Author info: `name` (required), `email` (optional) |
| `homepage` | string | URL to plugin homepage |
| `repository` | string | URL to plugin repository |
| `license` | string | License identifier (e.g., `MIT`) |
| `keywords` | array | Tags for discovery and categorization |
| `logo` | string | Relative path to a logo file in the repo (e.g., `assets/logo.svg`), or an absolute URL. Relative paths resolve to `raw.githubusercontent.com` URLs. Preferred: commit the logo to your repo and use a relative path. |
| `rules` | string or array | Path(s) to rule files or directories |
| `agents` | string or array | Path(s) to agent files or directories |
| `skills` | string or array | Path(s) to skill directories |
| `commands` | string or array | Path(s) to command files or directories |
| `hooks` | string or object | Path to hooks config file, or inline hook config |
| `mcpServers` | string, object, or array | Path to MCP config file, inline MCP server config, or an array of either. Overrides default `mcp.json` discovery. |
| `variables` | object | JSON Schema that declares variable **names** (tokens, connection strings). The plugin does not store secret values; users set them in the dashboard (**Plugins** → **Configure**). Substituted into `${VAR}` placeholders. See [Variables](https://cursor.com/docs/reference/plugins.md#variables). |

### Example manifest

```json
{
  "name": "enterprise-plugin",
  "version": "1.2.0",
  "description": "Enterprise development tools with security scanning and compliance checks",
  "author": {
    "name": "ACME DevTools",
    "email": "devtools@acme.com"
  },
  "keywords": ["enterprise", "security", "compliance"],
  "logo": "assets/logo.svg"
}
```

## Variables

Use `variables` to declare the **names** (and types/descriptions) of user-specified configuration — for example an API token for an HTTP MCP server. The plugin only defines the schema; it does not include the secret values themselves.

Team admins set the actual values in the dashboard under **Plugins** (at install time, or later via **Configure** on the plugin).

Do not put secret values in the plugin repo. In `mcp.json` and other plugin config, include only `${VAR}` placeholders that match property names in the schema.

```json title=".cursor-plugin/plugin.json"
{
  "name": "example-plugin",
  "variables": {
    "type": "object",
    "properties": {
      "API_TOKEN": {
        "type": "string",
        "title": "API token",
        "description": "Bearer token for the example HTTP MCP"
      }
    },
    "required": ["API_TOKEN"]
  }
}
```

```json title="mcp.json"
{
  "mcpServers": {
    "example-api": {
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

The top level must be `{ "type": "object", "properties": { ... } }`. Only a fixed set of JSON Schema keywords is accepted (`type`, `title`, `description`, `default`, `enum`, `const`, `properties`, `required`, `items`, and common length/numeric constraints).

## Cursor Plugin component discovery

When the manifest does not specify explicit paths for a component type, the parser uses **automatic folder-based discovery**:

| Component | Default location | How it's discovered |
| :---------- | :------------------------ | :----------------------------------------------------------------------------------------- |
| Skills | `skills/` | Each subdirectory containing a `SKILL.md` file |
| Rules | `rules/` | All `.md`, `.mdc`, or `.markdown` files |
| Agents | `agents/` | All `.md`, `.mdc`, or `.markdown` files |
| Commands | `commands/` | All `.md`, `.mdc`, `.markdown`, or `.txt` files |
| Hooks | `hooks/hooks.json` | Parsed for hook event names |
| MCP Servers | `mcp.json` | Parsed for server entries |
| Root Skill | `SKILL.md` at plugin root | Treated as a single-skill plugin (only if no `skills/` dir and no manifest `skills` field) |

If a manifest field **is** specified (e.g., `"skills": "./my-skills/"`), it **replaces** folder discovery for that component. The default folder is not also scanned.

## Rules format

Rules are `.mdc` files providing persistent guidance to the AI. Place them in the `rules/` directory.

Rules require YAML frontmatter with metadata:

```markdown title="rules/prefer-const.mdc"
---
description: Prefer const over let for variables that are never reassigned
alwaysApply: true
---

prefer-const: Always use `const` for variables that are never reassigned.
Only use `let` when the variable needs to be reassigned. Never use `var`.
```

### Rule frontmatter fields

| Field | Type | Description |
| :------------ | :-------------- | :------------------------------------------------------------------------------ |
| `description` | string | Brief description of what the rule does |
| `alwaysApply` | boolean | If `true`, rule applies to all files. If `false`, rule is available on request. |
| `globs` | string or array | File patterns the rule applies to (e.g., `"**/*.ts"`) |

For full documentation, see [Rules](https://cursor.com/docs/rules.md).

## Skills format

Skills are specialized capabilities defined in `SKILL.md` files. Each skill lives in its own directory under `skills/`.

Skills require YAML frontmatter with metadata:

```markdown title="skills/api-designer/SKILL.md"
---
name: api-designer
description: Design RESTful APIs following OpenAPI 3.0 specification.
  Use when designing new API endpoints, reviewing API contracts,
  or generating API documentation.
---

# API Designer Skill

## When to use

- Designing new API endpoints
- Reviewing API contracts
- Generating API documentation

## Instructions

1. Follow REST conventions for resource naming
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
3. Include proper error responses with standard HTTP status codes
4. Document all endpoints with OpenAPI 3.0 specification
5. Use consistent naming conventions (kebab-case for URLs, camelCase for JSON)
```

### Skill frontmatter fields

| Field | Type | Description |
| :------------ | :----- | :---------------------------------------------------- |
| `name` | string | Skill identifier (lowercase, kebab-case) |
| `description` | string | Description of what the skill does and when to use it |

For full documentation, see [Skills](https://cursor.com/docs/skills.md).

## Agents format

Agents are markdown files defining custom agent behaviors and prompts. Place them in the `agents/` directory.

Agents require YAML frontmatter with metadata:

```markdown title="agents/security-reviewer.md"
---
name: security-reviewer
description: Security-focused code reviewer that checks for
  vulnerabilities and proven approaches
---

# Security Reviewer

You are a security-focused code reviewer. When reviewing code:

1. Check for injection vulnerabilities (SQL, XSS, command injection)
2. Verify proper authentication and authorization
3. Look for sensitive data exposure (API keys, passwords, PII)
4. Ensure secure cryptographic practices
5. Review dependency security and known vulnerabilities
6. Check for proper input validation and sanitization
```

### Agent frontmatter fields

| Field | Type | Description |
| :------------ | :----- | :--------------------------------------- |
| `name` | string | Agent identifier (lowercase, kebab-case) |
| `description` | string | Brief description of the agent's purpose |

## Commands format

Commands are markdown or text files defining agent-executable actions. Place them in the `commands/` directory.

Commands support `.md`, `.mdc`, `.markdown`, and `.txt` extensions. They can include YAML frontmatter:

```markdown title="commands/deploy-staging.md"
---
name: deploy-staging
description: Deploy the current branch to the staging environment
---

# Deploy to staging

Steps to deploy to staging:
1. Run tests
2. Build the project
3. Push to staging branch
```

### Command frontmatter fields

| Field | Type | Description |
| :------------ | :----- | :----------------------------------------- |
| `name` | string | Command identifier (lowercase, kebab-case) |
| `description` | string | Brief description of what the command does |

## Hooks format

Hooks are automation scripts triggered by agent, Tab, or workspace events. Define them in `hooks/hooks.json`:

```json title="hooks/hooks.json"
{
  "hooks": {
    "afterFileEdit": [
      {
        "command": "./scripts/format-code.sh"
      }
    ],
    "beforeShellExecution": [
      {
        "command": "./scripts/validate-shell.sh",
        "matcher": "rm|curl|wget"
      }
    ],
    "sessionEnd": [
      {
        "command": "./scripts/audit.sh"
      }
    ]
  }
}
```

### Available hook events

- **Agent hooks**: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought`
- **Tab hooks**: `beforeTabFileRead`, `afterTabFileEdit`
- **App lifecycle hooks**: `workspaceOpen`

For full documentation, see [Hooks](https://cursor.com/docs/hooks.md).

## MCP servers

Both formats place `mcp.json` at the plugin root. Agent Plugins use the
standard's schema and declare each server's transport. Cursor Plugins can use
Cursor variables and infer the transport from `command` or `url`.

### Agent Plugin

```json title="mcp.json"
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "code-review": {
      "type": "stdio",
      "command": "./bin/code-review",
      "cwd": "${PLUGIN_ROOT}"
    }
  }
}
```

See the [Agent Plugins MCP reference](https://agent-plugins.org/plugin-authors/mcp-servers)
for supported transports, paths, and data directories.

### Cursor Plugin

Cursor Plugins discover `mcp.json` automatically. Specify `mcpServers` in
`.cursor-plugin/plugin.json` only when using a custom path or inline config.

```json title="mcp.json"
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_URL}"
      }
    }
  }
}
```

`${POSTGRES_URL}` is a [plugin variable](https://cursor.com/docs/reference/plugins.md#variables) placeholder (not shell `${env:...}`). Declare the variable name under `variables` in `plugin.json`, put only the placeholder in plugin config, and set the value in the dashboard under **Plugins** → **Configure**. Plugin-managed MCP config is read-only in the dashboard.

For full documentation, see [MCP](https://cursor.com/docs/mcp.md).

## Logos

Commit logos to your repository and reference them using a relative path:

```json
{
  "name": "my-plugin",
  "logo": "assets/logo.svg"
}
```

Relative paths resolve to `raw.githubusercontent.com` URLs based on the repository and commit SHA. For example, `assets/logo.svg` in the `acme/plugins` repo at commit `abc123` resolves to:

```text
https://raw.githubusercontent.com/acme/plugins/abc123/my-plugin/assets/logo.svg
```

Absolute GitHub user content URLs (starting with `http://` or `https://`) are also accepted.

## Cursor multi-plugin repositories

A single Git repository can contain multiple plugins using a **marketplace manifest**. Place it at `.cursor-plugin/marketplace.json` in the repository root.

### Marketplace manifest format

```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Org",
    "email": "plugins@yourorg.com"
  },
  "metadata": {
    "description": "A collection of developer tool plugins"
  },
  "plugins": [
    {
      "name": "plugin-one",
      "source": "plugin-one",
      "description": "First plugin"
    },
    {
      "name": "plugin-two",
      "source": "plugin-two",
      "description": "Second plugin"
    }
  ]
}
```

### Marketplace manifest fields

| Field | Type | Description |
| :--------- | :----- | :------------------------------------------------------------------------------------ |
| `name` | string | **(required)** Marketplace identifier (kebab-case) |
| `owner` | object | **(required)** `name` (required), `email` (optional) |
| `plugins` | array | **(required)** Array of plugin entries (max 500) |
| `metadata` | object | Optional. `description`, `version`, `pluginRoot` (prefix path for all plugin sources) |

### Plugin entry fields

Each entry in the `plugins` array supports:

| Field | Type | Description |
| :-------------------------------------- | :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | string | **(required)** Plugin identifier (kebab-case) |
| `source` | string or object | Path to plugin directory, or object with `path` and options |
| `description` | string | Plugin description |
| `version` | string | Semantic version |
| `author` | object | Author info |
| `homepage` | string | URL |
| `repository` | string | URL |
| `license` | string | License identifier |
| `keywords` | array | Search tags |
| `logo` | string | Relative path or URL to logo |
| `category` | string | Plugin category |
| `tags` | array | Additional tags |
| `skills`, `rules`, `agents`, `commands` | string or array | Path(s) to component files |
| `hooks` | string or object | Path to hooks config or inline config |
| `mcpServers` | string or object | Path to MCP config or inline config |
| `variables` | object | JSON Schema that declares variable names (values set in dashboard **Plugins** → **Configure**). Prefer `plugin.json`; manifest values take precedence if both are set. See [Variables](https://cursor.com/docs/reference/plugins.md#variables). |

### How resolution works

For a marketplace entry with `"source": "my-plugin"`:

1. The parser looks for `my-plugin/.cursor-plugin/plugin.json`
2. If found, the per-plugin manifest is merged with the marketplace entry (manifest values take precedence)
3. Component discovery runs within the `my-plugin/` directory, using manifest paths if specified or folder-based discovery as fallback

### Example multi-plugin repo

```text
my-plugins/
├── .cursor-plugin/
│   └── marketplace.json       # Lists all plugins
├── eslint-rules/
│   ├── .cursor-plugin/
│   │   └── plugin.json        # Per-plugin manifest
│   └── rules/
│       ├── prefer-const.mdc
│       └── no-any.mdc
├── docker/
│   ├── .cursor-plugin/
│   │   └── plugin.json
│   ├── skills/
│   │   ├── containerize-app/
│   │   │   └── SKILL.md
│   │   └── setup-docker-compose/
│   │       └── SKILL.md
│   └── mcp.json
└── README.md
```

## Submitting a plugin

Plugins are reviewed by the Cursor team. To submit:

### Create your plugin

Add a valid root `plugin.json` for an Agent Plugin or
`.cursor-plugin/plugin.json` for a Cursor Plugin.

### Host in a Git repository

Push your plugin to a public Git repository. Commit your logo to the repo (optional but recommended).

### Submit your plugin

Go to [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) and submit your repository link.

### Submission checklist

- Plugin has a valid root `plugin.json` or `.cursor-plugin/plugin.json` manifest
- `name` is unique, lowercase, kebab-case (e.g., `my-awesome-plugin`)
- `description` clearly explains the plugin's purpose
- All included components have valid files and frontmatter
- Logo is committed to the repo and referenced by relative path (if provided)
- `README.md` documents usage and any configuration
- Agent Plugins conform to the [Agent Plugins schemas](https://agent-plugins.org/schemas)
- Cursor Plugins using variables declare every `${VAR}` from `mcp.json` in the manifest schema
- All paths in manifest are relative and valid (no `..`, no absolute paths)
- Plugin has been tested locally
- Cursor multi-plugin repositories have `.cursor-plugin/marketplace.json` at the repo root with unique plugin names
