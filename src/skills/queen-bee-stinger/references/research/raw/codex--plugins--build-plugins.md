# Build plugins – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/plugins/build
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins

This page is for plugin authors. If you want to browse, install, and use plugins with ChatGPT Work on the web or with ChatGPT Work or Codex in the ChatGPT desktop app, see Plugins. If you are still iterating on one repo or one personal workflow, start with a local skill. Build a plugin when you want to share that workflow across teams, bundle connectors or MCP config, package lifecycle hooks, or publish a stable package.

A plugin can include skills, an MCP-backed app, or both. If your plugin needs to connect to a service or expose tools through an MCP server, see Build an app.

## Create a plugin with `@plugin-creator`

For the fastest setup, use the built-in `@plugin-creator` skill. It scaffolds the required `.codex-plugin/plugin.json` manifest and can also generate a local marketplace entry for testing. If you already have a plugin folder, you can still use `@plugin-creator` to wire it into a local marketplace.

### Create and test a plugin locally that points to an MCP-server-backed dev-mode app

Enable developer mode in ChatGPT (Settings → Security and login → Developer mode). Then create the app in developer mode (Settings → Plugins → + → complete modal), copy the app ID (starts with `plugin_asdk_app`), and give it to `@plugin-creator` (ChatGPT Work) or `$plugin-creator` (Codex):

```
@plugin-creator create a Codex plugin for my ChatGPT app.
Use plugin_asdk_app_6a4c0062f3b88191855c0a80eac5d53d and name it Acme Support.
Include a personal marketplace entry so I can test it locally.
```

After creation: review `.app.json` (points at the correct `plugin_asdk_app...` ID), review `.codex-plugin/plugin.json` (`apps` field points to `./.app.json`), add bundled skills under `skills/` if needed, refresh ChatGPT and install from the local source in the Plugins Directory.

### Build your own curated plugin list

A marketplace is a JSON catalog of plugins. Use `$REPO_ROOT/.agents/plugins/marketplace.json` for a repo-scoped list or `~/.agents/plugins/marketplace.json` for a personal list. Add one entry per plugin under `plugins[]`, point each `source.path` at the plugin folder with a `./`-prefixed path relative to the marketplace root, set `interface.displayName`. Restart the ChatGPT desktop app to pick up changes.

### Add a marketplace from the CLI

```bash
codex plugin marketplace add owner/repo
codex plugin marketplace add owner/repo --ref main
codex plugin marketplace add https://github.com/example/plugins.git --sparse .agents/plugins
codex plugin marketplace add ./local-marketplace-root
```

Marketplace sources: GitHub shorthand (`owner/repo` or `owner/repo@ref`), HTTP/HTTPS Git URLs, SSH Git URLs, or local marketplace root directories. `--ref` pins a Git ref; `--sparse PATH` (repeatable) uses sparse checkout (Git sources only).

```bash
codex plugin marketplace list
codex plugin marketplace upgrade
codex plugin marketplace upgrade marketplace-name
codex plugin marketplace remove marketplace-name
```

### Create a plugin manually

1. Create a plugin folder with a manifest at `.codex-plugin/plugin.json`:

```bash
mkdir -p my-first-plugin/.codex-plugin
```

`my-first-plugin/.codex-plugin/plugin.json`:

```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "description": "Reusable greeting workflow",
  "skills": "./skills/"
}
```

Use a stable plugin `name` in kebab-case — it's the plugin identifier and component namespace.

2. Add a skill under `skills/<name>/SKILL.md`:

```bash
mkdir -p my-first-plugin/skills/hello
```

`my-first-plugin/skills/hello/SKILL.md`:

```md
---
name: hello
description: Greet the user with a friendly message.
---

Greet the user warmly and ask how you can help.
```

3. Add the plugin to a marketplace (via `@plugin-creator` or manually).

### Install a local plugin manually

Repo marketplace: `$REPO_ROOT/.agents/plugins/marketplace.json`, plugins under `$REPO_ROOT/plugins/`.

```json
{
  "name": "local-repo",
  "plugins": [
    {
      "name": "my-plugin",
      "source": { "source": "local", "path": "./plugins/my-plugin" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

Personal marketplace: `~/.agents/plugins/marketplace.json`, plugins under `~/.codex/plugins/`.

### Share a local plugin with your workspace

Open Plugins in the ChatGPT desktop app → Created by you → plugin details → Share → add workspace members/groups or copy a share link. Shared plugins stay within the workspace/org boundary. Workspace admins can disable plugin sharing via `requirements.toml`:

```toml
features.plugin_sharing = false
```

### Marketplace metadata

```json
{
  "name": "local-example-plugins",
  "interface": { "displayName": "Local Example Plugins" },
  "plugins": [
    {
      "name": "my-plugin",
      "source": { "source": "local", "path": "./plugins/my-plugin" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    },
    {
      "name": "research-helper",
      "source": { "source": "local", "path": "./plugins/research-helper" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

Rules: top-level `name` identifies the marketplace; `interface.displayName` is the shown title; one object per plugin under `plugins`; `source.path` relative to marketplace root, `./`-prefixed; `source` can be a plain string path for local entries; always include `policy.installation` (`AVAILABLE`, `INSTALLED_BY_DEFAULT`, `NOT_AVAILABLE`), `policy.authentication`, and `category`.

Git-backed sources:

```json
{
  "name": "remote-helper",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/example/codex-plugins.git",
    "path": "./plugins/remote-helper",
    "ref": "main"
  },
  "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
  "category": "Productivity"
}
```

Use `"source": "url"` when the plugin lives at repo root, `"source": "git-subdir"` for a subdirectory. Selectors: `ref` or `sha`.

npm-backed sources:

```json
{
  "name": "npm-helper",
  "source": {
    "source": "npm",
    "package": "@example/codex-plugin",
    "version": "^1.2.0",
    "registry": "https://registry.npmjs.org"
  },
  "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
  "category": "Productivity"
}
```

`package` required; `version` optional (versions/dist-tags/ranges, not path/URL selectors); `registry` optional (HTTPS URL, no embedded credentials/query/fragment). Codex downloads without running lifecycle scripts; requires local `npm` CLI.

### How the ChatGPT desktop app uses marketplaces

Reads from: the curated marketplace powering the official Plugins Directory; repo marketplace at `$REPO_ROOT/.agents/plugins/marketplace.json`; legacy-compatible `$REPO_ROOT/.claude-plugin/marketplace.json`; personal `~/.agents/plugins/marketplace.json`.

Installs into `~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/`. For local plugins `$VERSION` is `local`. Per-plugin enable/disable state stored in `~/.codex/config.toml`.

## Package and distribute plugins

### Plugin structure

Manifest at `.codex-plugin/plugin.json`. Can also include `skills/`, `hooks/` (lifecycle hooks), `.app.json` (connector references), `.mcp.json` (bundled MCP servers), and `assets/`. Only `plugin.json` belongs in `.codex-plugin/`.

Complete manifest example:

```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "description": "Bundle reusable skills and connectors.",
  "author": {
    "name": "Your team",
    "email": "team@example.com",
    "url": "https://example.com"
  },
  "homepage": "https://example.com/plugins/my-plugin",
  "repository": "https://github.com/example/my-plugin",
  "license": "MIT",
  "keywords": ["research", "crm"],
  "skills": "./skills/",
  "mcpServers": "./.mcp.json",
  "apps": "./.app.json",
  "hooks": "./hooks/hooks.json",
  "interface": {
    "displayName": "My Plugin",
    "shortDescription": "Reusable skills and connectors",
    "longDescription": "Distribute skills and connectors together.",
    "developerName": "Your team",
    "category": "Productivity",
    "capabilities": ["Read", "Write"],
    "websiteURL": "https://example.com",
    "privacyPolicyURL": "https://example.com/privacy",
    "termsOfServiceURL": "https://example.com/terms",
    "defaultPrompt": [
      "Use My Plugin to summarize new CRM notes.",
      "Use My Plugin to triage new customer follow-ups."
    ],
    "brandColor": "#10A37F",
    "composerIcon": "./assets/icon.png",
    "logo": "./assets/logo.png",
    "screenshots": ["./assets/screenshot-1.png"]
  }
}
```

`.codex-plugin/plugin.json` is the required entry point; other fields optional but common in published plugins.

### Manifest fields

- `name`, `version`, `description` identify the plugin.
- `author`, `homepage`, `repository`, `license`, `keywords`: publisher/discovery metadata.
- `skills`, `mcpServers`, `apps`, `hooks`: bundled components relative to plugin root.
- `interface`: install-surface presentation (`displayName`, `shortDescription`, `longDescription`, `developerName`, `category`, `capabilities`, URLs, `defaultPrompt`, `brandColor`, `composerIcon`, `logo`, `screenshots`).

### Path rules

- Keep manifest paths relative to plugin root, `./`-prefixed.
- Store visual assets under `./assets/`.
- Use `skills` for skill folders, `apps` for `.app.json`, `mcpServers` for `.mcp.json`, `hooks` for lifecycle hooks.
- Default hook file `./hooks/hooks.json` is auto-detected; no manifest entry needed if using the default path.

### Bundled MCP servers and lifecycle hooks

`mcpServers` can point to `.mcp.json` with either a direct server map or a wrapped `mcp_servers` object:

```json
{ "docs": { "command": "docs-mcp", "args": ["--stdio"] } }
```
or
```json
{ "mcp_servers": { "docs": { "command": "docs-mcp", "args": ["--stdio"] } } }
```

Users can enable/disable a bundled MCP server and tune tool approval policy without editing the plugin:

```toml
[plugins."my-plugin".mcp_servers.docs]
enabled = true
default_tools_approval_mode = "prompt"
enabled_tools = ["search"]

[plugins."my-plugin".mcp_servers.docs.tools.search]
approval_mode = "approve"
```

Installing/enabling a plugin doesn't auto-trust its hooks — plugin-bundled hooks are non-managed hooks and are skipped until reviewed and trusted.

Default plugin hook file `hooks/hooks.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${PLUGIN_ROOT}/hooks/session_start.py",
            "statusMessage": "Loading plugin context"
          }
        ]
      }
    ]
  }
}
```

If `hooks` is defined in `.codex-plugin/plugin.json`, that overrides the default file. Can be a single path, array of paths, inline object, or array of inline objects:

```json
{
  "name": "repo-policy",
  "hooks": ["./hooks/session.json", "./hooks/tools.json"]
}
```

Plugin hook commands receive `PLUGIN_ROOT` and `PLUGIN_DATA` (Codex-specific), plus `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` for compatibility with existing Claude-style plugin hooks.

### Publish official public plugins

Submit through the plugin submission portal for public review and publishing.
