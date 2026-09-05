# Plugin authoring and distribution reference across the four harnesses

This file tells you what a plugin package actually needs, per harness: manifest fields, directory layout, marketplace format, install flow, and the gotchas that break a plugin silently. Every claim traces back to `references/research/distilled-research-articles.md` (the distilled doc), which cites `raw/` sources directly. Cited inline below the same way.

If you only remember one thing from this file: a plugin is a directory with components at the root and a manifest tucked one folder deep. Get that backwards and nothing loads.

---

## Claude Code

### `.claude-plugin/plugin.json` manifest

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```
[raw/claude-code--plugins--plugins-official-docs.md]

| Field | Purpose |
|---|---|
| `name` | Unique ID and skill namespace (`/plugin-name:skill`) |
| `description` | Shown in the plugin manager |
| `version` | Optional. If set, users only get updates on a version bump, except `command` sources. If unset, falls back to per-source version-management rules |
| `author` | Optional, attribution |

[raw/claude-code--plugins--plugins-official-docs.md]

### The manifest-in-.claude-plugin, components-at-root rule

**Common mistake**: only `plugin.json` goes inside `.claude-plugin/`. Everything else, `commands/`, `agents/`, `skills/`, `hooks/`, lives at the plugin root, never nested inside `.claude-plugin/` [raw/claude-code--plugins--plugins-official-docs.md]. This same rule holds for Cowork, since Cowork reads the identical package format [raw/cowork--multiple--code-claude-docs-plugins-reference.md].

### Full directory table

| Directory | Purpose |
|---|---|
| `.claude-plugin/` | `plugin.json` manifest only |
| `skills/` | `<name>/SKILL.md` directories (preferred) |
| `commands/` | flat `.md` skill files (legacy, use `skills/` for new plugins) |
| `agents/` | subagent definitions |
| `hooks/` | `hooks.json` |
| `.mcp.json` | MCP server configs |
| `.lsp.json` | LSP server configs |
| `monitors/` | `monitors.json`, background monitors (experimental) |
| `bin/` | executables added to the Bash tool's `PATH` while the plugin is enabled |
| `settings.json` | default settings applied when the plugin is enabled (`agent`, `subagentStatusLine` keys only) |

[raw/claude-code--plugins--plugins-official-docs.md, raw/claude-code--plugins--plugins-reference-official-docs.md]

A plugin shipping exactly one skill can put `SKILL.md` at the plugin root instead of nesting a `skills/` folder. Set frontmatter `name` explicitly in that case, or the invocation name falls back to the install directory name, which is an unstable version string for marketplace installs [raw/claude-code--plugins--plugins-reference-official-docs.md].

### Plugin-agent field restrictions

Plugin agents accept a narrower frontmatter subset than a full CLI subagent file:

```markdown
---
name: agent-name
description: What this agent specializes in and when Claude should invoke it
model: sonnet
effort: medium
maxTurns: 20
disallowedTools: Write, Edit
---

Detailed system prompt...
```

Supported fields: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (only valid value `"worktree"`). **Not supported for plugin agents**: `hooks`, `mcpServers`, `permissionMode`, dropped for security reasons. Copy the file into `.claude/agents/` if you actually need those fields [raw/claude-code--plugins--plugins-reference-official-docs.md, raw/claude-code--agents--sub-agents-official-docs.md].

### Plugin hooks and plugin MCP servers

`hooks/hooks.json` at plugin root uses the same event set as user hooks. Path variables like `${CLAUDE_PLUGIN_ROOT}` are supported in both hooks and `.mcp.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}\"/scripts/format-code.sh" }
        ]
      }
    ]
  }
}
```
[raw/claude-code--plugins--plugins-reference-official-docs.md]

Plugin hooks targeting the plugin's own bundled MCP server need scoped names: `mcp__plugin_<plugin>_<server>__<tool>` for a matcher/`if`, `plugin:<plugin>:<server>` for an `mcp_tool` hook's `server` field [raw/claude-code--plugins--plugins-reference-official-docs.md].

`.mcp.json` at plugin root starts automatically when the plugin is enabled; `/reload-plugins` keeps live connections for unchanged server configs [raw/claude-code--plugins--plugins-reference-official-docs.md].

### marketplace.json full schema

```json
{
  "name": "company-tools",
  "owner": { "name": "DevTools Team", "email": "devtools@example.com" },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": { "name": "DevTools Team" }
    },
    {
      "name": "deployment-tools",
      "source": { "source": "github", "repo": "company/deploy-plugin" },
      "description": "Deployment automation tools"
    }
  ]
}
```
[raw/claude-code--plugins--plugin-marketplaces-official-docs.md]

Required top-level fields: `name` (kebab-case, one registration per name), `owner` (`name` required, `email`/`url` optional), `plugins`. Optional: `$schema`, `description`, `version`, `metadata.pluginRoot`, `allowCrossMarketplaceDependenciesOn`, `renames` (map old to new name, or `null` for removed, v2.1.193+) [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

Plugin entry required fields: `name`, `source`. Optional metadata: `displayName`, `description`, `version`, `author`, `homepage`, `repository`, `license`, `keywords`, `metadata` (free-form, ignored by Claude Code), `category`, `tags`, `strict` (default `true`), `relevance`, `defaultEnabled` (default `true`). Optional component-path overrides: `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers` (string or array of custom paths) [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

Plugin source types:

| Source | Fields | Notes |
|---|---|---|
| relative path | `"./my-plugin"` | must start with `./`, resolved from marketplace root, no `../` |
| `github` | `repo`, `ref?`, `sha?` | `owner/repo` |
| `url` | `url`, `ref?`, `sha?` | full git URL, `.git` optional |
| `git-subdir` | `url`, `path`, `ref?`, `sha?` | sparse clone of a monorepo subdir |
| `npm` | `package`, `version?`, `registry?` | `npm install` |
| `archive` | `url`, `sha256?` | zip over HTTPS, no git/npm needed (v2.1.224+) |
| `command` | `command`, `timeout?`, `mode?` | local command produces the plugin dir, re-run per session (v2.1.229+) |

[raw/claude-code--plugins--plugin-marketplaces-official-docs.md]

When both `ref` and `sha` are set on a git-based source, `sha` is the effective pin. Marketplace source (where `marketplace.json` itself comes from) and plugin source (where each listed plugin comes from) are independent and pinned separately [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

### Reserved marketplace names, re-checked on every load

Sixteen reserved names are blocked for third parties, including `claude-code-marketplace`, `claude-plugins-official`, `claude-plugins-community`, `anthropic-marketplace`, `agent-skills`, `healthcare`, and Anthropic-vertical names like `claude-for-legal`. These are re-checked on **every load**, not just at add time, so a marketplace that was fine yesterday can start failing later if a name becomes reserved [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

### Cache behavior

Installed plugins get copied into `~/.claude/plugins/cache`, except `command` sources in link mode, which are used in place. Copied plugins can't reference files outside their own directory via `../`, no escaping the cache dir. Use symlinks to share files across plugins instead [raw/claude-code--plugins--plugin-marketplaces-official-docs.md, raw/claude-code--plugins--plugins-official-docs.md].

### Test and install workflow

```bash
claude --plugin-dir ./my-plugin          # local dev, repeatable
claude --plugin-dir ./my-plugin.zip      # also accepts a zip
claude --plugin-url https://example.com/my-plugin.zip   # remote zip, session-only
```

`/reload-plugins` picks up changes without a restart (skills, agents, hooks, plugin MCP/LSP servers). `claude plugin init my-tool` scaffolds a plugin directly in `~/.claude/skills/my-tool/`, auto-loaded next session as `my-tool@skills-dir`, no marketplace step needed. `claude plugin validate ./your-plugin` runs the same check used by the community-marketplace review pipeline; `--strict` turns warnings into failures. A local marketplace round trip looks like `/plugin marketplace add ./my-marketplace` then `/plugin install quality-review-plugin@my-plugins`, then `/reload-plugins` if the install summary asks for it, then invoke the skill as `/quality-review-plugin:quality-review` [raw/claude-code--plugins--plugins-official-docs.md, raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

### Namespacing

Plugin skills are namespaced `/plugin-name:skill-name`, auto-discovered on install whether they live under `skills/<name>/SKILL.md` (preferred) or flat `commands/<name>.md` (legacy). `$ARGUMENTS` captures trailing user text passed into the skill body [raw/claude-code--plugins--plugins-official-docs.md].

### Standalone-vs-plugin conflict rules

| | Standalone (`.claude/`) | Plugin |
|---|---|---|
| Skill name | `/hello` | `/plugin-name:hello` |
| Best for | personal/project-specific, quick iteration | sharing, versioned releases, reuse |
| Hooks location | `settings.json` | `hooks/hooks.json` |
| Sharing | manual copy | `/plugin install` |

[raw/claude-code--plugins--plugins-official-docs.md]

**Standalone agents override same-name plugin agents.** After migrating standalone `.claude/agents/` to a plugin, remove the originals: project/user agent definitions override same-named plugin agents, so the plugin copy stays inert until the standalone one is deleted. **Plugin skills coexist instead of conflicting**, because they're namespaced (`/plugin-name:skill-name`), so the original and the plugin copy both stay available at once [raw/claude-code--plugins--plugins-official-docs.md].

---

## Cursor

### Current state and launch timeline

Plugins package rules, skills, agents, commands, MCP servers, and hooks into one install, discoverable via the Cursor Marketplace or `/add-plugin`. Shipped in **Cursor 2.5, February 17, 2026**; launch partners included Amplitude, AWS, Figma, Linear, Stripe. Template repo: `github.com/cursor/plugin-template` [raw/cursor--plugins--plugins-reference.md, raw/cursor--multiple--changelog-2-5-plugins-marketplace.md].

### Two manifest formats

| Format | Manifest | Components |
|---|---|---|
| **Agent Plugins** (open standard, agent-plugins.org) | `plugin.json` at root | Skills, MCP servers only |
| **Cursor Plugins** | `.cursor-plugin/plugin.json` | Skills, MCP servers, rules, agents, commands, hooks, variables |

A spec-conformant Agent Plugin loads in Cursor unmodified, this is the cross-harness path (skills + MCP only, portable to any compliant host) [raw/cursor--plugins--plugins-reference.md]:

```text
my-plugin/                          my-plugin/ (Cursor Plugin)
├── plugin.json                     ├── .cursor-plugin/plugin.json
├── skills/code-reviewer/SKILL.md   ├── rules/*.mdc  skills/  agents/
└── mcp.json                        ├── commands/  hooks/hooks.json
                                     ├── mcp.json  assets/  scripts/  README.md
```

### `.cursor-plugin/plugin.json` fields

Required: `name` (kebab-case, alphanumeric start/end). Optional: `description`, `version` (semver), `author` (object, `name` required, `email` optional), `homepage`, `repository`, `license`, `keywords` (array), `logo` (relative path resolves to `raw.githubusercontent.com`, or an absolute URL), `rules`/`agents`/`skills`/`commands` (string or array of paths), `hooks` (string or object), `mcpServers` (string, object, or array, overrides default `mcp.json` discovery), `variables` (JSON Schema declaring variable **names** only, never secrets) [raw/cursor--plugins--plugins-reference.md].

```json
{
  "name": "enterprise-plugin",
  "version": "1.2.0",
  "description": "Enterprise development tools with security scanning",
  "author": { "name": "ACME DevTools", "email": "devtools@acme.com" },
  "keywords": ["enterprise", "security"],
  "logo": "assets/logo.svg"
}
```

### Component auto-discovery table

| Component | Default folder | Rule |
|---|---|---|
| Skills | `skills/` | each subdir with `SKILL.md` |
| Rules | `rules/` | all `.md`/`.mdc`/`.markdown` |
| Agents | `agents/` | all `.md`/`.mdc`/`.markdown` |
| Commands | `commands/` | all `.md`/`.mdc`/`.markdown`/`.txt` |
| Hooks | `hooks/hooks.json` | parsed for event names |
| MCP Servers | `mcp.json` | parsed for server entries |
| Root Skill | `SKILL.md` at plugin root | single-skill plugin, only if no `skills/` dir/field |

[raw/cursor--plugins--plugins-reference.md]

### Explicit-field-replaces-discovery rule

An explicit manifest field **replaces** folder discovery for that type; the default folder is not also scanned once you name the field explicitly [raw/cursor--plugins--plugins-reference.md]. Plugin `agents/` frontmatter is documented with only `name`/`description`, narrower than the standalone `.claude/agents/*.md` subagent format (`name`, `description`, `model`, `readonly`, `is_background`). The raw research doesn't clarify whether plugin-distributed agents actually support the fuller set, flag this as a gap rather than assuming [raw/cursor--plugins--plugins-reference.md, raw/cursor--agents--subagents-docs.md].

### Variables (admin-configured, never secrets in repo)

Top level must be `{ "type": "object", "properties": {...} }`. Only these JSON Schema keywords are accepted: `type`, `title`, `description`, `default`, `enum`, `const`, `properties`, `required`, `items`, length/numeric constraints. Values are set by admins in the dashboard under **Plugins → Configure**, never stored in the repo [raw/cursor--plugins--plugins-reference.md]:

```json
{ "name": "example-plugin", "variables": { "type": "object",
  "properties": { "API_TOKEN": { "type": "string", "title": "API token" } },
  "required": ["API_TOKEN"] } }
```
```json
{ "mcpServers": { "example-api": { "url": "https://mcp.example.com/mcp",
  "headers": { "Authorization": "Bearer ${API_TOKEN}" } } } }
```
`${API_TOKEN}` here is a plugin-variable placeholder, distinct from the shell-style `${env:...}` used in a standalone `mcp.json` [raw/cursor--plugins--plugins-reference.md, raw/cursor--plugins--mcp-docs.md].

### hooks/hooks.json event list

```json
{ "hooks": { "afterFileEdit": [{ "command": "./scripts/format-code.sh" }],
  "beforeShellExecution": [{ "command": "./scripts/validate-shell.sh", "matcher": "rm|curl|wget" }],
  "sessionEnd": [{ "command": "./scripts/audit.sh" }] } }
```

Agent hooks: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought`. Tab hooks: `beforeTabFileRead`, `afterTabFileEdit`. App lifecycle: `workspaceOpen` [raw/cursor--plugins--plugins-reference.md]. This is a completely different event-name vocabulary from Claude Code's/Codex's `PreToolUse`/`PostToolUse` family, don't try to reuse one `hooks.json` across harnesses without a rename pass.

### marketplace.json for multi-plugin repos

`.cursor-plugin/marketplace.json` at repo root: required `name`, `owner` (object), `plugins` (array, **max 500**); optional `metadata` (`description`, `version`, `pluginRoot`) [raw/cursor--plugins--plugins-reference.md]:

```json
{ "name": "my-marketplace", "owner": { "name": "Your Org" },
  "plugins": [ { "name": "plugin-one", "source": "plugin-one" } ] }
```

Each `plugins[]` entry: `name`, `source` (string/object), plus the same optional fields as a standalone manifest. Resolution: the parser looks for `<source>/.cursor-plugin/plugin.json`, merges with the marketplace entry (per-plugin values win), then runs component discovery inside that directory [raw/cursor--plugins--plugins-reference.md].

### Submission checklist

Valid manifest; unique lowercase kebab-case `name`; clear `description`; valid files/frontmatter for all components; logo committed with a relative path; `README.md`; Agent Plugins conform to agent-plugins.org schemas; every `${VAR}` in `mcp.json` declared in `variables`; all manifest paths relative and valid (no `..`, no absolute); tested locally; multi-plugin repos need `.cursor-plugin/marketplace.json` with unique names. Submit at `cursor.com/marketplace/publish` [raw/cursor--plugins--plugins-reference.md].

### Launch timeline

Plugins shipped in **2.5 (Feb 17, 2026)**, alongside sandbox network controls and async subagents. Skills landed earlier, in **2.4 (Jan 22, 2026)**, so a Cursor plugin author working before Feb 17 2026 had skills but not the plugin packaging layer around them [raw/cursor--multiple--changelog-2-4-subagents-skills.md, raw/cursor--multiple--changelog-2-5-plugins-marketplace.md].

---

## Codex

### Skills vs. plugins framing

Skills are the **authoring format**, plugins are the **installable distribution unit**. Iterate locally as a skill folder; package as a plugin to share across teams, bundle MCP config, ship lifecycle hooks, or publish a stable version [raw/codex--plugins--build-plugins.md, raw/codex--multiple--customization-overview.md].

### `.codex-plugin/plugin.json`

Scaffold with the built-in `@plugin-creator`, or by hand:

```bash
mkdir -p my-first-plugin/.codex-plugin
```
`my-first-plugin/.codex-plugin/plugin.json` (minimal):
```json
{ "name": "my-first-plugin", "version": "1.0.0", "description": "Reusable greeting workflow", "skills": "./skills/" }
```
[raw/codex--plugins--build-plugins.md]

| Field | Purpose |
|---|---|
| `name` (kebab-case) | Plugin identifier / namespace |
| `version`, `description` | Basic identity |
| `author.{name,email,url}`, `homepage`, `repository`, `license`, `keywords` | Publisher/discovery metadata |
| `skills` | Path to the skills dir, `./`-prefixed |
| `mcpServers` | Path to `.mcp.json` bundle |
| `apps` | Path to `.app.json` connector references |
| `hooks` | Path(s) or inline object(s); default `./hooks/hooks.json` auto-detected |
| `interface.*` | Desktop-app metadata: `displayName`, `shortDescription`, `longDescription`, `developerName`, `category`, `capabilities`, URLs, `defaultPrompt` (array), `brandColor`, `composerIcon`, `logo`, `screenshots` |

Full working example:
```json
{
  "name": "my-plugin", "version": "0.1.0", "description": "Bundle reusable skills and connectors.",
  "author": { "name": "Your team", "email": "team@example.com", "url": "https://example.com" },
  "homepage": "https://example.com/plugins/my-plugin", "repository": "https://github.com/example/my-plugin",
  "license": "MIT", "keywords": ["research", "crm"],
  "skills": "./skills/", "mcpServers": "./.mcp.json", "apps": "./.app.json", "hooks": "./hooks/hooks.json",
  "interface": {
    "displayName": "My Plugin", "shortDescription": "Reusable skills and connectors",
    "category": "Productivity", "capabilities": ["Read", "Write"],
    "defaultPrompt": ["Use My Plugin to summarize new CRM notes."],
    "brandColor": "#10A37F", "composerIcon": "./assets/icon.png", "logo": "./assets/logo.png"
  }
}
```
[raw/codex--plugins--build-plugins.md]

### Marketplace locations, including the legacy-compat path

| Marketplace | Path | Plugins live under |
|---|---|---|
| Repo | `$REPO_ROOT/.agents/plugins/marketplace.json` | `$REPO_ROOT/plugins/` |
| Personal | `~/.agents/plugins/marketplace.json` | `~/.codex/plugins/` |
| Legacy-compatible | `$REPO_ROOT/.claude-plugin/marketplace.json` | also read by the ChatGPT desktop app |

[raw/codex--plugins--build-plugins.md]

That legacy-compatible path is the reason a `.claude-plugin/marketplace.json` you built for Claude Code doesn't need a Codex-specific twin, Codex and the ChatGPT desktop app read it directly.

```json
{
  "name": "local-example-plugins",
  "interface": { "displayName": "Local Example Plugins" },
  "plugins": [
    { "name": "my-plugin", "source": { "source": "local", "path": "./plugins/my-plugin" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" }, "category": "Productivity" }
  ]
}
```
Top-level `name` identifies the marketplace, `interface.displayName` is the shown title, `source.path` is relative and `./`-prefixed, local `source` can be a plain string, and always set `policy.installation` (`AVAILABLE`|`INSTALLED_BY_DEFAULT`|`NOT_AVAILABLE`), `policy.authentication`, `category` [raw/codex--plugins--build-plugins.md].

### Source types

`"local"` (plain string or path), `"git-subdir"` (`url`, `path`, `ref`/`sha`) for a plugin in a subdirectory of a git repo, `"url"` for one at repo root, `"npm"` (`package` required, `version` optional range/tag, `registry` optional HTTPS, **no lifecycle scripts run**, requires local `npm`) [raw/codex--plugins--build-plugins.md].

### `codex plugin marketplace` CLI

```bash
codex plugin marketplace add owner/repo [--ref main]
codex plugin marketplace add https://github.com/example/plugins.git --sparse .agents/plugins
codex plugin marketplace add ./local-marketplace-root
codex plugin marketplace list | upgrade [name] | remove name
```
[raw/codex--plugins--build-plugins.md]

### Plugin cache path

`~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/` (`local` in place of a version for local plugins). Enable/disable state lives in `~/.codex/config.toml`. Admins can disable sharing entirely: `requirements.toml` → `features.plugin_sharing = false` [raw/codex--plugins--build-plugins.md].

### Per-plugin MCP tuning in config.toml

A plugin's `.mcp.json` accepts a flat map (`{ "docs": {...} }`) or a wrapped `{ "mcp_servers": {...} }`. Users tune on/off state and approval policy per plugin without editing the plugin itself:

```toml
[plugins."my-plugin".mcp_servers.docs]
enabled = true
default_tools_approval_mode = "prompt"
enabled_tools = ["search"]

[plugins."my-plugin".mcp_servers.docs.tools.search]
approval_mode = "approve"
```
[raw/codex--plugins--build-plugins.md, raw/codex--plugins--mcp.md]

Remember the **TOML trap**: Codex config is TOML, not JSON. Pasting a Claude Code/Cursor-style `mcpServers` JSON block into `config.toml` silently fails. The correct root key is `mcp_servers` (underscore), not `mcp.servers` or `mcp-servers` [raw/codex--plugins--mcp.md].

### Plugin hooks: default hooks.json, cross-compat env vars, no auto-trust

Plugin-bundled hooks default to `hooks/hooks.json` in the plugin root; a manifest `hooks` entry overrides that default. Hook commands receive both `PLUGIN_ROOT`/`PLUGIN_DATA` and `CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA` env vars, the second pair exists purely for cross-compat with hook scripts written against Claude Code's variable names [raw/codex--plugins--hooks.md, raw/codex--plugins--build-plugins.md].

**Installing a plugin does not auto-trust its hooks.** Non-managed command hooks require explicit review/trust through `/hooks` in the CLI, keyed to the hook's content hash; editing the hook re-triggers review. Managed hooks (system/MDM/cloud/`requirements.toml`) are auto-trusted and can't be user-disabled. A one-off bypass exists: `--dangerously-bypass-hook-trust` [raw/codex--plugins--hooks.md].

---

## Cowork

### Same package format as Claude Code

Cowork uses the identical `.claude-plugin/plugin.json` + `skills/`/`commands/`/`agents/`/`.mcp.json` package format as Claude Code. Anthropic's own framing: "Built for Claude Cowork, also compatible with Claude Code" [raw/cowork--plugins--code-claude-docs-discover-plugins.md, raw/cowork--plugins--github-knowledge-work-plugins.md]. Cowork does not expose the CLI's terminal-interactive `/plugin` panel; the equivalent flow is a graphical **Customize > Plugins** panel instead [raw/cowork--plugins--code-claude-docs-discover-plugins.md].

Plugin support launched **January 30, 2026** as a research preview, available to all paid Claude users. At launch, plugins were "saved locally to your machine," with org-wide sharing called out as coming later [raw/cowork--plugins--blog-cowork-plugins-launch.md].

### What bundles, and where it works

| Component | What it adds | Where it works |
|---|---|---|
| Skills | Reusable instructions that teach Claude a workflow | Chat + Cowork |
| Connectors | MCP servers giving access to an external service | Chat + Cowork, but routed through Anthropic's cloud, so a custom connector must be reachable over the public internet from Anthropic's IP ranges, no local-network servers |
| Agents | Specialized subagents Claude can delegate to | Cowork-only, grayed out in chat |
| Hooks | Scripts that run at defined points in a session | Cowork-only, grayed out in chat |

[raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md]

**Conflict noted in the research**: one doc says plugins "aren't used in Chat" at all; a more specific and more recent support article says skills work in chat too, and only hooks/sub-agents are Cowork-only. Prefer the more specific, more recent framing: skills in chat + Cowork, hooks and agents Cowork-only [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md].

### Install flows

**Browse:** Open **Customize** in the sidebar (in Cowork, open the "Cowork" tab first, then Customize), then **Plugins** > **Browse plugins**. Default marketplace is Anthropic's official catalog. Select a plugin, click **Install**; a connector needing auth prompts a sign-in. Open the installed plugin to see skills/connectors/agents/hooks and enable or disable individual components.

**Upload a file:** use the upload option on the Plugins page instead of browsing.

**Owner/repo shorthand:** on the Plugins page, **Add marketplace**, enter the repository URL. Cowork accepts either `https://github.com/owner/repo` or the bare `owner/repo` shorthand for GitHub. GitHub Enterprise is supported; public GitLab and Bitbucket repos also work. Click **Update** on a marketplace to pull the latest plugins.

[raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md]

### Limits table

| Limit | Value |
|---|---|
| Plugin package size (uncompressed) | 200 MB |
| Files per plugin package | 5,000 |
| Marketplace repository archive | 512 MB |
| Plugins per marketplace | 500 |
| Marketplaces you can add | 25 |
| In-app skill viewer file preview | up to 1 MB per file (larger files still work at runtime, just show "too large to preview") |

[raw/cowork--plugins--claude-docs-cowork-guide-plugins.md]

### Org-managed plugins, skill scanning, and update behavior

On Team/Enterprise, admins can require certain plugins for everyone. Required plugins install automatically, show "This plugin is required by your organization," and users can't remove them; auto-installed but non-required plugins CAN be uninstalled by the user. Organization-managed plugins in general can only be removed by an administrator [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md].

On Enterprise plans with skill scanning turned on, plugins get checked for malicious content at install and at update time. A plugin flagged with malicious content is blocked outright; one that may carry risk shows a caution banner instead of a hard block [raw/cowork--plugins--support-use-plugins-in-claude.md].

Cowork checks for plugin updates from the marketplace a plugin came from. If you've edited a plugin's files locally, Cowork detects the change and warns you before an update would silently overwrite it [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md].

### The #46079 slash-invocation bug and the commands/ mitigation

GitHub issue #46079 (closed, auto-closed as a duplicate of #41842): skills defined in `skills/*/SKILL.md` inside a custom org plugin appear correctly in the Cowork slash command menu under a "Plugin name" section, but invoking them (click or typed `/skill-name`) returns `Unknown skill: plugin-name:skill-name`. Only `anthropic-skills:*` skills worked via the Skill tool at the time of the report. This is the same class of bug that hit the Claude Code CLI earlier (duplicate #41842): plugin skills loaded as Agent Skills for model invocation but were not reliably registered as user-invocable `/plugin-name:skill-name` slash commands; only files under `commands/` reliably registered. The CLI-side fix landed in Claude Code CLI v2.1.98; this Cowork report is the same class of bug recurring in Cowork's separate resolution path [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].

**Mitigation for Hive plugins**: ship a matching flat file under `commands/` alongside any `skills/` directory you want reliably slash-invocable in Cowork. A plugin's `commands/` directory (legacy flat markdown) is more reliably invocable as a slash command across both CLI and Cowork than a `skills/` directory skill, even though `skills/` is the officially recommended format going forward [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md, raw/cowork--multiple--code-claude-docs-plugins-reference.md]. That's why the Hive `reference-plugin/commands/example-command.md` template in this folder exists: it's the reliability fallback, not a redundant duplicate.

### Security gotcha

Plugins may include local MCP servers that run on your computer with the same permissions as any other program you run. Only install plugins from trusted sources. Enterprise admins may restrict installable plugins or disable local MCP servers entirely [raw/cowork--plugins--support-use-plugins-in-claude.md].

---

## Cross-harness portability strategy

One plugin tree, built to work everywhere, without four separate plugin folders:

1. **Manifest**: use `.claude-plugin/plugin.json` as the primary manifest. Claude Code, Cowork, and Codex (via its legacy-compat marketplace path) all read this format directly, no translation needed [raw/claude-code--plugins--plugins-official-docs.md, raw/cowork--plugins--code-claude-docs-discover-plugins.md, raw/codex--plugins--build-plugins.md].
2. **Cursor needs its own manifest file**, `.cursor-plugin/plugin.json`, alongside `.claude-plugin/plugin.json`. Cursor does not read `.claude-plugin/plugin.json` per the research; if full Cursor plugin support (rules, agents, commands, hooks, variables) matters, add the second manifest rather than assuming one file covers Cursor too. A spec-conformant Agent Plugin (`plugin.json` at plugin root, skills + MCP only) is the one shape that's genuinely cross-harness by design, per the agent-plugins.org open standard [raw/cursor--plugins--plugins-reference.md].
3. **Components stay at the plugin root** in every harness that documents the rule explicitly (Claude Code, Cowork): `skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json` sit next to the manifest folder, never inside it. Codex's manifest instead points at paths (`"skills": "./skills/"`), so root-level placement satisfies Codex too as long as the manifest's path fields agree with where the folders actually are.
4. **Spec-six skill frontmatter inside every `SKILL.md`.** Keep skill frontmatter to the six portable Agent Skills fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`), documented in `templates/skills/harness-specific-reference.md`. That's what survives claude.ai upload, the Skills API, and Cowork account sync, and it's a strict subset of what Claude Code, Cursor, and Codex all accept, so nothing is lost by staying inside it.
5. **Ship both `skills/` and `commands/`** for anything that needs reliable slash invocation in Cowork, per the #46079 mitigation above. This is a small amount of duplication for a real reliability gain, not premature optimization.
6. **No `!` command injection** anywhere in a bundled skill body. It's a Claude Code-only extension that Cowork actively disables (`disableSkillShellExecution` placeholder), so a plugin that depends on it breaks silently the moment it lands in Cowork. Instruct the model to run the command itself via a tool call instead.
7. **Hook event names are not portable.** Claude Code and Codex share a `PreToolUse`/`PostToolUse`-family vocabulary; Cursor uses an entirely different set (`beforeShellExecution`, `afterFileEdit`, and so on). A single `hooks/hooks.json` written for Claude Code will not mean anything to Cursor's hook runner. If a Hive plugin needs hooks in both, that's two separate hook files, not one shared one.
