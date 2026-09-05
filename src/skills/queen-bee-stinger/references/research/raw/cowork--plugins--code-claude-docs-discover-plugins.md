# Discover and install prebuilt plugins through marketplaces - Claude Code Docs
- URL: https://code.claude.com/docs/en/discover-plugins
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins (also covers commands: /plugin CLI commands and namespaced skill invocation)

> Find and install plugins from marketplaces to extend Claude Code with new skills, agents, and capabilities.

Plugins extend Claude Code with skills, agents, hooks, and MCP servers. Plugin marketplaces are catalogs that help you discover and install these extensions without building them yourself.

## How marketplaces work

A marketplace is a catalog of plugins that someone else has created and shared. Using a marketplace is a two-step process: (1) register the catalog with Claude Code so you can browse what's available — no plugins are installed yet; (2) browse the catalog and install the plugins you want.

## Official Anthropic marketplace

Claude Code adds the official Anthropic marketplace (`claude-plugins-official`) automatically the first time you start it interactively. If it can't be added automatically, add it yourself with `/plugin marketplace add anthropics/claude-plugins-official`.

To browse what's available, run `/plugin` and go to the **Discover** tab, or view the catalog at claude.com/plugins.

To install a plugin from the official marketplace:

```shell
/plugin install github@claude-plugins-official
```

`/plugin` opens an interactive panel in the terminal CLI. If `/plugin` isn't available in an environment, use the plugin browser in the Claude desktop app, or declare the plugin under `enabledPlugins` in `.claude/settings.json` for cloud sessions.

The official marketplace is curated by Anthropic, and inclusion is at Anthropic's discretion. In-app submission forms add plugins to the community marketplace, not the official one.

### Official marketplace categories

**Code intelligence** — LSP-backed plugins (`clangd-lsp`, `csharp-lsp`, `gopls-lsp`, `jdtls-lsp`, `kotlin-lsp`, `lua-lsp`, `php-lsp`, `pyright-lsp`, `rust-analyzer-lsp`, `swift-lsp`, `typescript-lsp`) that require the corresponding language server binary to be installed separately.

**External integrations** — plugins bundling pre-configured MCP servers: `github`, `gitlab` (source control); `atlassian` (Jira/Confluence), `asana`, `linear`, `notion` (project management); `figma` (design); `vercel`, `firebase`, `supabase` (infrastructure); `slack` (communication); `sentry` (monitoring).

**Automatic security review** — the `security-guidance` plugin reviews each change Claude makes for common vulnerabilities.

**Development workflows** — `commit-commands` (git commit/push/PR skills), `pr-review-toolkit` (specialized review agents), `agent-sdk-dev` (Agent SDK tooling), `plugin-dev` (toolkit for creating your own plugins).

**Output styles** — `explanatory-output-style`, `learning-output-style`.

## Community marketplace

The community marketplace at `anthropics/claude-plugins-community` hosts third-party plugins that have passed Anthropic's automated validation and safety screening. Each plugin is pinned to a specific commit SHA in the catalog. Add it manually:

```shell
/plugin marketplace add anthropics/claude-plugins-community
```

Install plugins from it using the `claude-community` marketplace name:

```shell
/plugin install <plugin-name>@claude-community
```

## Try it: add the demo marketplace

Anthropic also maintains a demo plugins marketplace (`claude-code-plugins`) at `anthropics/claude-code` (in the `plugins/` folder) with example plugins. Add manually with `/plugin marketplace add anthropics/claude-code`.

Run `/plugin` to open the plugin manager — a tabbed interface (Discover / Installed / Marketplaces / Errors, cycled with Tab/Shift+Tab).

Selecting a plugin shows: a **Context cost** estimate (tokens added to context every turn), **Last updated** date, and a **Will install** section listing the plugin's commands, agents, skills, hooks, and MCP/LSP servers.

Choose an installation scope: **User** (all your projects), **Project** (all collaborators on this repo), or **Local** (yourself, this repo only).

Example: install `commit-commands` to user scope, then check the install summary — if it reports `Run /reload-plugins to activate.`, run that. Plugin skills are namespaced by the plugin name, e.g. `commit-commands` provides `/commit-commands:commit`.

## Add marketplaces

`/plugin marketplace add` accepts:

* **GitHub repositories**: `owner/repo` format
* **Git URLs**: any git repository URL (GitLab, Bitbucket, self-hosted)
* **Local paths**: directories or direct paths to `marketplace.json` files
* **Remote URLs**: direct URLs to hosted `marketplace.json` files

```shell
/plugin marketplace add anthropics/claude-code
/plugin marketplace add https://gitlab.com/company/plugins.git
/plugin marketplace add git@gitlab.com:company/plugins.git
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
/plugin marketplace add ./my-marketplace
/plugin marketplace add ./path/to/marketplace.json
/plugin marketplace add https://example.com/marketplace.json
```

## Install plugins

```shell
/plugin install plugin-name@marketplace-name
```

Opens the plugin's details, where you choose an installation scope (User / Project / Local). Non-interactive install:

```shell
claude plugin install <plugin> [options]
```

installs to user scope unless `--scope` is passed. Managed-scope plugins are installed by administrators via managed settings and can't be modified by users.

## Applicability note for Cowork

This page documents the Claude Code CLI's `/plugin` command surface (terminal interactive panel, `claude plugin install` shell command). Cowork does not expose this CLI; instead Cowork surfaces the equivalent marketplace/install flow through the graphical **Customize > Plugins** panel described in the companion files `cowork--plugins--claude-docs-cowork-guide-plugins.md` and `cowork--plugins--support-use-plugins-in-claude.md`. The underlying plugin package format (`.claude-plugin/plugin.json`, `skills/`, `commands/`, `agents/`, `.mcp.json`) is shared between Claude Code and Cowork — a plugin built for one works in the other, per Anthropic's official positioning ("Built for Claude Cowork, also compatible with Claude Code").
