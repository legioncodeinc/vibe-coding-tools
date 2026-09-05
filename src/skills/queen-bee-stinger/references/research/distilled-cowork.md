# Claude Cowork: distilled research (fetched 2026-08-14)

Scope: this file distills only the `cowork--*.md` raw sources (15 files). It does not pull from the Claude Code CLI, Cursor, or Codex raw files except where a cowork-- file itself quotes or cross-references them for context. Every claim below traces to a specific raw file in brackets.

---

## Rules

### Current state and how Cowork differs from CLI

Cowork does not read a project-root `CLAUDE.md` from disk the way Claude Code CLI does. Cowork's rules mechanism is a different pair of surfaces: **Global instructions** and **Folder instructions**, set through the app UI rather than committed files [raw/cowork--rules--support-claude-md-and-prompts.md]. Cowork sessions run in cloud/VM sandboxes (paths like `/sessions/.../mnt/...`); a `.claude/CLAUDE.md`-style file is not the standard persistent-instruction unit there, skills and plugins are [raw/cowork--rules--support-claude-md-and-prompts.md].

### Global instructions: exact flow

Standing instructions applied to every Cowork session (tone, output format, background on your role). Set via:
1. Navigate to **Settings > Cowork**.
2. Click **"Edit"** next to Global instructions.
3. Type instructions in the text box, click **"Save."**
[raw/cowork--agents--support-get-started-cowork.md]

### Folder instructions: exact flow

Folder instructions add project-specific context when you select a local folder on desktop. Claude can also update these on its own during a session (no manual-edit flow documented beyond that) [raw/cowork--agents--support-get-started-cowork.md].

| Mechanism | Where set | Scope | Who can edit |
|---|---|---|---|
| Global instructions | Settings > Cowork > Global instructions | Every Cowork session | User only |
| Folder instructions | Auto-added when a local folder is selected on desktop | That project/folder | User, or Claude itself mid-session |

[raw/cowork--agents--support-get-started-cowork.md]

### Availability and modes (context for how "rules" interact with session behavior)

Cowork is available on Pro, Max, Team, Enterprise plans, with surface-specific availability: Desktop macOS/Windows (all paid plans), web at claude.ai (Pro/Max/Team, and Enterprise where admin-enabled), Mobile (Pro/Max/Team, Enterprise where enabled), Chrome side panel (Max/Team, rolling out to Pro, Enterprise where enabled) [raw/cowork--agents--support-get-started-cowork.md].

Three approval modes govern how much Claude checks in before acting, which interacts with anything a rule/instruction tells Claude to do:

| | Connector "Always allow" | Connector "Needs approval" | Connector "Blocked" |
|---|---|---|---|
| Manual mode | Approved | Asks for permission | Denied |
| Auto mode* | Read-only tools approved; write/delete Claude decides | Claude decides | Denied |
| Skip mode | Approved | Approved | Denied |

*Auto mode currently Pro/Max only. [raw/cowork--agents--support-get-started-cowork.md]

Deletion protection is a hard rule regardless of mode: Cowork requires explicit "Allow" permission before permanently deleting any files [raw/cowork--agents--support-get-started-cowork.md].

### Known limitations relevant to "rules"/memory

- Chat memory does not carry into Cowork sessions yet; within Cowork, memory is supported in **projects only** [raw/cowork--agents--support-get-started-cowork.md].
- No session sharing (live artifacts can be shared org-wide on Team/Enterprise) [raw/cowork--agents--support-get-started-cowork.md].
- Live artifacts and plugins with local MCP servers work through the desktop app only [raw/cowork--agents--support-get-started-cowork.md].

### Gotcha: don't assume the CLI CLAUDE.md guidance applies verbatim

The general CLAUDE.md guide (loading behavior, prompt caching, `/init`, `/memory`, `/compact`, subdirectory files) is written for Claude Code CLI and explicitly does NOT describe Cowork's mechanism: it's included here only as a documented contrast, not as Cowork behavior [raw/cowork--rules--support-claude-md-and-prompts.md].

---

## Plugins

### Current state and launch timeline

Plugin support in Cowork launched **January 30, 2026** as a **research preview**, available to all paid Claude users [raw/cowork--plugins--blog-cowork-plugins-launch.md]. At launch, plugins were "saved locally to your machine," with org-wide sharing/management (private marketplaces, etc.) called out as "coming in the weeks ahead" [raw/cowork--plugins--blog-cowork-plugins-launch.md]. A later related post dated Aug 12, 2026 notes "The Claude in Chrome side panel is now Claude Cowork," indicating the Chrome side-panel surface folded into the Cowork product line by mid-2026 [raw/cowork--plugins--blog-cowork-plugins-launch.md].

Plugins are available in **Cowork and Code**. They are **not used in Chat**, but note a partial contradiction below [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md].

**Conflict noted:** `cowork--plugins--claude-docs-cowork-guide-plugins.md` states plugins "aren't used in Chat," while `cowork--plugins--support-use-plugins-in-claude.md` says "You can install and use plugins in chat on the web, the Chat tab in Claude Desktop, and Claude Cowork... Hooks and sub-agents run only in Cowork, so they appear grayed out in chat." These two official-docs sources disagree on whether plugin *skills* function in Chat. Prefer the more specific and more recent support-article framing: skills work across chat + Cowork, but hooks/sub-agents are Cowork-only [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md].

### How Cowork differs from the Claude Code CLI for plugins

Claude Code CLI exposes plugin management through a terminal-interactive `/plugin` panel (Discover/Installed/Marketplaces/Errors tabs, `claude plugin install`, etc.). Cowork does **not** expose this CLI. Instead Cowork surfaces the equivalent flow through a graphical **Customize > Plugins** panel [raw/cowork--plugins--code-claude-docs-discover-plugins.md]. The underlying plugin package format (`.claude-plugin/plugin.json`, `skills/`, `commands/`, `agents/`, `.mcp.json`) is shared between Claude Code and Cowork: "a plugin built for one works in the other," per Anthropic's official positioning: "Built for Claude Cowork, also compatible with Claude Code" [raw/cowork--plugins--code-claude-docs-discover-plugins.md, raw/cowork--plugins--github-knowledge-work-plugins.md].

### What a plugin bundles (Cowork framing)

| Component | What it adds | Notes |
|---|---|---|
| Skills | Reusable instructions that teach Claude a workflow | Work across chat + Cowork |
| Connectors | MCP servers giving access to an external service | In Cowork, connectors reach external services through Anthropic's cloud, not your local network: a custom connector must be reachable over the public internet from Anthropic's IP ranges |
| Agents | Specialized subagents Claude can delegate to | Cowork-only (grayed out in chat) |
| Hooks | Scripts that run at defined points in a session | Cowork-only (grayed out in chat) |

[raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md]

After installing, open the plugin to see what it provides: skills and agents appear as tabs; connectors and hooks have their own pages [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md].

### Install flow (Cowork UI)

1. Open **Customize** in the sidebar (in Cowork, open the "Cowork" tab first, then Customize), then **Plugins**.
2. Select **Browse plugins**: default marketplace is Anthropic's official catalog; add other marketplaces by URL.
3. Select a plugin, click **Install**. If it includes a connector needing auth, you're prompted to sign in.
4. Open the installed plugin to see skills/connectors/agents/hooks; enable/disable individual components.

To install from a file instead, use the upload option on the Plugins page [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md].

### Marketplace install flow (Git repo as marketplace)

A Git repository containing plugin packages can serve as a marketplace: the typical way teams distribute their own plugins without publishing to the public catalog. GitHub (including GitHub Enterprise) is supported; public GitLab and Bitbucket repos also work.
1. On the Plugins page, select **Add marketplace**, enter the repository URL. Cowork accepts `https://github.com/owner/repo` or the `owner/repo` shorthand for GitHub.
2. Plugins from that repo appear alongside plugins from other marketplaces; install the same way.
3. Click **Update** on a marketplace to pull the latest plugins.
[raw/cowork--plugins--claude-docs-cowork-guide-plugins.md]

Adding a marketplace via the app's "+" flow: Customize > Plugins > Personal plugins section > "+" > "Add marketplace" > either **Browse Anthropic sources** (curated marketplaces: Knowledge Work [added by default], Life Sciences, Financial Services, Legal: click "Add" then "Done") or **Add from a repository** (sync from GitHub repo or git URL). Remove a marketplace (including the default Knowledge Work one) via its menu button > "Remove" [raw/cowork--plugins--support-use-plugins-in-claude.md].

### Plugin limits (Cowork defaults)

| Limit | Value |
|---|---|
| Plugin package size (uncompressed) | 200 MB |
| Files per plugin package | 5,000 |
| Marketplace repository archive | 512 MB |
| Plugins per marketplace | 500 |
| Marketplaces you can add | 25 |
| In-app skill viewer file preview | up to 1 MB per file (larger files show "too large to preview" but are still available to Claude at runtime) |

[raw/cowork--plugins--claude-docs-cowork-guide-plugins.md]

### Complete working example: `.claude-plugin/plugin.json` schema

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
Only `name` is required if you include a manifest (kebab-case, no spaces); it's used for namespacing components, e.g. agent `agent-creator` in plugin `plugin-dev` becomes `plugin-dev:agent-creator`. Unrecognized top-level fields are ignored, so `plugin.json` can double as other manifest formats [raw/cowork--multiple--code-claude-docs-plugins-reference.md].

### Directory layout rule (common mistake)

Only `plugin.json` goes inside `.claude-plugin/`. `commands/`, `agents/`, `skills/`, `hooks/`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json` all live at the **plugin root**, not inside `.claude-plugin/` [raw/cowork--multiple--code-claude-docs-plugins-reference.md].

| Directory | Location | Purpose |
|---|---|---|
| `.claude-plugin/` | Plugin root | Contains `plugin.json` manifest only |
| `skills/` | Plugin root | Skills as `<name>/SKILL.md` directories |
| `commands/` | Plugin root | Skills as flat markdown files (legacy; use `skills/` for new plugins) |
| `agents/` | Plugin root | Custom agent definitions |
| `hooks/` | Plugin root | Event handlers in `hooks.json` |
| `.mcp.json` | Plugin root | MCP server configurations |
| `bin/` | Plugin root | Executables added to Bash tool's PATH while plugin enabled |
| `settings.json` | Plugin root | Default settings applied when plugin enabled |

[raw/cowork--multiple--code-claude-docs-plugins-reference.md]

### Real-world example plugin layout (from Anthropic's open-source repo)

```
plugin-name/
├── .claude-plugin/plugin.json   # Manifest
├── .mcp.json                    # Tool connections
├── commands/                    # Slash commands you invoke explicitly
└── skills/                      # Domain knowledge Claude draws on automatically
```
Every component is file-based (markdown + JSON), no code, no infrastructure, no build steps [raw/cowork--plugins--github-knowledge-work-plugins.md].

### Anthropic's open-sourced plugin catalog (11 plugins)

| Plugin | How it helps | Example connectors |
|---|---|---|
| productivity | Tasks, calendars, daily workflows, personal context | Slack, Notion, Asana, Linear, Jira, Monday, ClickUp, Microsoft 365 |
| sales | Prospect research, call prep, pipeline review, outreach, battlecards | Slack, HubSpot, Close, Clay, ZoomInfo, Notion, Jira, Fireflies, Microsoft 365 |
| customer-support | Ticket triage, drafted responses, escalations, KB articles | Slack, Intercom, HubSpot, Guru, Jira, Notion, Microsoft 365 |
| product-management | Specs, roadmaps, research synthesis, stakeholder updates | Slack, Linear, Asana, Monday, ClickUp, Jira, Notion, Figma, Amplitude, Pendo, Intercom, Fireflies |
| marketing | Content, campaigns, brand voice, competitor briefs, reporting | Slack, Canva, Figma, HubSpot, Amplitude, Notion, Ahrefs, SimilarWeb, Klaviyo |
| legal | Contract review, NDA triage, compliance, risk, templated responses | Slack, Box, Egnyte, Jira, Microsoft 365 |
| finance | Journal entries, reconciliation, financial statements, variance, close, audits | Snowflake, Databricks, BigQuery, Slack, Microsoft 365 |
| data | SQL, statistical analysis, dashboards, validation | Snowflake, Databricks, BigQuery, Definite, Hex, Amplitude, Jira |
| enterprise-search | Cross-tool search (email, chat, docs, wikis) | Slack, Notion, Guru, Jira, Asana, Microsoft 365 |
| bio-research | Preclinical research tools/databases | PubMed, BioRender, bioRxiv, ClinicalTrials.gov, ChEMBL, Synapse, Wiley, Owkin, Open Targets, Benchling |
| cowork-plugin-management | Create/customize plugins for your org | - |

[raw/cowork--plugins--blog-cowork-plugins-launch.md, raw/cowork--plugins--github-knowledge-work-plugins.md]

### Claude Code CLI equivalent commands (for reference/portability: not exposed directly in Cowork)

```bash
# Add the marketplace first
claude plugin marketplace add anthropics/knowledge-work-plugins

# Then install a specific plugin
claude plugin install sales@knowledge-work-plugins
```
Once installed, plugins activate automatically; skills fire when relevant, slash commands become available (e.g., `/sales:call-prep`, `/data:write-query`) [raw/cowork--plugins--github-knowledge-work-plugins.md].

### Customizing a plugin (Cowork-specific flow)

While viewing an installed plugin, click **"Customize"** in the upper right corner. This opens a new Cowork task with a prompt asking Claude to customize the plugin. Click **"Let's go"** to start working with Claude to adjust the plugin's skills and connectors [raw/cowork--plugins--support-use-plugins-in-claude.md]. To build one from scratch, the **"Plugin Create"** plugin walks you through the process, starting from any Anthropic-built template [raw/cowork--plugins--support-use-plugins-in-claude.md].

### Update/remove and org-managed behavior

Cowork checks for plugin updates from the marketplace they came from. If you've edited a plugin's files locally, Cowork detects the change and warns you before an update would overwrite it. To remove a plugin, open it under Customize > Plugins and click **"Uninstall."** Organization-managed plugins can only be removed by an administrator [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md].

On Team/Enterprise, admins can require certain plugins for everyone: required plugins install automatically and show "This plugin is required by your organization"; users can't remove them. Auto-installed (non-required) plugins CAN be uninstalled by the user [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md]. On Enterprise plans with skill scanning turned on, plugins are checked for malicious content at install/update; a plugin with malicious content is blocked, one that may carry risk shows a caution banner [raw/cowork--plugins--support-use-plugins-in-claude.md].

### Security gotcha

Plugins may include local MCP servers that run on your computer with the same permissions as any other program you run. Only install plugins from trusted sources. Enterprise admins may restrict installable plugins or disable local MCP servers entirely [raw/cowork--plugins--support-use-plugins-in-claude.md].

---

## Commands

### Current state and how Cowork differs from CLI

Cowork has **no `/plugin` CLI panel** the way Claude Code CLI does; its command/skill surfacing is a GUI, not a terminal-interactive tool [raw/cowork--plugins--code-claude-docs-discover-plugins.md]. Critically, Cowork implements its **own slash-command/Skill-tool resolution path**, separate from (and not perfectly in sync with) the Claude Code CLI's plugin-skill loader: even though both consume the same `.claude-plugin/plugin.json` + `skills/*/SKILL.md` package format [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].

### Slash command naming convention (shared format, referenced by Cowork raw files)

| Skill location | Command name source | Example |
|---|---|---|
| Skill directory under `~/.claude/skills/` or `.claude/skills/` | Directory name | `.claude/skills/deploy-staging/SKILL.md` → `/deploy-staging` |
| Nested `.claude/skills/` directory (name clash) | Subdirectory path + skill directory name | `apps/web/.claude/skills/deploy/SKILL.md` → `/apps/web:deploy` |
| File under `.claude/commands/` | File name without extension | `.claude/commands/deploy.md` → `/deploy` |
| Plugin `skills/` subdirectory | Frontmatter `name` or directory name, namespaced by plugin | `my-plugin/skills/review/SKILL.md` → `/my-plugin:review` |
| Plugin root `SKILL.md` | Frontmatter `name`, plugin dir name as fallback | `my-plugin/SKILL.md` with `name: review` → `/my-plugin:review` |

Cowork's `/` menu uses the same `plugin-name:skill-name` namespacing convention confirmed directly against Cowork's UI (skills appear "in the Cowork slash command menu under a 'Plugin name' section") [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].

### Documented bug: plugin skills discoverable but not invocable via Skill tool (GitHub issue #46079)

- **State:** closed, auto-closed as duplicate of #41842. Filed 2026-04-10 by carbonfix-tech, labels: `duplicate`, `area:skills`, `area:plugins`, `area:cowork`, `platform:web` [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].
- **Symptom:** Skills defined in `skills/*/SKILL.md` within a custom org plugin appear correctly in the Cowork slash command menu under a "Plugin name" section. Invoking them (clicking in the menu OR typing `/skill-name`) returns `Unknown skill: plugin-name:skill-name`. Only `anthropic-skills:*` skills work via the Skill tool [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].
- **Repro:** (1) Create an org plugin with skills in standard `skills/*/SKILL.md` structure with valid YAML frontmatter, (2) Deploy via Claude Team Plan admin as an org plugin, (3) Open Cowork: skills appear in the `/` menu under the plugin name, (4) Click any skill or type `/skill-name`, (5) Result: "Unknown skill: plugin-name:skill-name" [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].
- **Workaround:** Add a skills table to the plugin's CLAUDE.md mapping trigger phrases to file paths. Claude reads the SKILL.md directly via the Read tool when the Skill tool fails. Works but adds an unnecessary failure/retry step to every skill invocation [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].
- **Related CLI-side bug:** Duplicate #41842 documents the same class of gap from the Claude Code CLI: plugin skills in `skills/*/SKILL.md` loaded as Agent Skills (Skill-tool/model invocation worked) but historically were NOT registered as user-invocable `/plugin-name:skill-name` slash commands: only files in `commands/` reliably registered as slash commands. Docs mark `commands/` as "legacy; use `skills/` for new skills" while acknowledging this gap. The CLI-side fix landed in Claude Code CLI **v2.1.98**. This Cowork report (#46079, filed April 2026) is the **same class of bug recurring in Cowork's separate resolution path** [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md].

**Portability takeaway:** a plugin's `commands/` directory (legacy flat markdown files) is more reliably invocable as a slash command across both CLI and Cowork than a `skills/` directory skill, at least as of the versions covered by this bug report: even though `skills/` is the officially recommended format going forward [raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md, raw/cowork--multiple--code-claude-docs-plugins-reference.md].

---

## Agents

### Current state and how Cowork differs from Claude Code CLI's richer agent surfaces

Cowork's official documentation describes only **"sub-agent coordination"** as a first-class, user-facing capability: Cowork "breaks complex work into smaller tasks and coordinates parallel workstreams to complete them" and "may coordinate multiple sub-agents working simultaneously" [raw/cowork--agents--support-get-started-cowork.md]. No official Cowork documentation in this research set confirms that **agent view**, **agent teams**, or **dynamic workflows** (all CLI/IDE concepts) are exposed in the Cowork desktop/web/mobile UI [raw/cowork--agents--code-claude-docs-run-agents-parallel.md]. Cowork's parallelism is presented to end users simply as automatic sub-agent coordination during a task, with no user-facing controls to pick between coordination modes [raw/cowork--agents--code-claude-docs-run-agents-parallel.md].

### How Cowork runs a task (the visible lifecycle)

1. Analyzes your request and creates a plan.
2. Breaks complex work into subtasks when needed.
3. Runs code and shell commands in an isolated environment on Anthropic's servers.
4. Coordinates multiple workstreams in parallel if appropriate.
5. Delivers finished outputs to your session for preview/download.

You retain visibility into what Claude is planning/doing and can steer mid-task or let it run independently [raw/cowork--agents--support-get-started-cowork.md]. Deletion protection applies: Claude requires explicit "Allow" permission before permanently deleting files [raw/cowork--agents--support-get-started-cowork.md].

### Reference: Claude Code CLI subagent frontmatter (for building plugin agents portable to Cowork)

Plugin agents (which DO reach Cowork sessions when a plugin is installed) support this frontmatter: note the reduced field set versus a full CLI subagent file:

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
Plugin agents support `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (only valid value: `"worktree"`). For security reasons, `hooks`, `mcpServers`, and `permissionMode` are **not supported** for plugin-shipped agents: they're silently ignored. Agents appear in the @-mention typeahead under their scoped name, e.g. `my-plugin:code-reviewer`, once the plugin is enabled [raw/cowork--agents--code-claude-docs-sub-agents.md].

The fuller CLI-native subagent frontmatter (the superset plugin agents draw from) additionally documents `permissionMode`, `mcpServers`, `hooks`, and `color`. Only `hooks`, `mcpServers`, and `permissionMode` are documented as ignored for plugin-shipped agents; whether `color` or a `memory` value of `local` survives plugin packaging is not stated either way in the sources [raw/cowork--agents--code-claude-docs-sub-agents.md].

### Cowork's relationship to `.claude/agents/`

Cowork does **not** expose a `.claude/agents/` directory to the end user the way Claude Code CLI does. Agents reach Cowork sessions primarily through **installed plugins** or **Claude's own automatic subagent delegation** during a task: there is no documented user-facing way in Cowork to hand-author a standalone subagent file the way you would in a CLI project [raw/cowork--agents--code-claude-docs-sub-agents.md].

### Cross-harness portability table (agents component)

| Claude Code plugin agent field | Works in Cowork? |
|---|---|
| `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation: worktree` | Yes: loads with the plugin |
| `hooks` | No: ignored for plugin-shipped agents |
| `mcpServers` | No: ignored for plugin-shipped agents |
| `permissionMode` | No: ignored for plugin-shipped agents |

[raw/cowork--agents--code-claude-docs-sub-agents.md]

### Gap in the raw research

None of the cowork-- raw files describe a Cowork-native UI equivalent to `claude agents` (agent view), `/tasks`, `/workflows`, or cross-session messaging. The only confirmed parallel-work control surface in Cowork is the plan-then-execute flow and the three approval modes (Manual/Auto/Skip) described under "Rules" above [raw/cowork--agents--support-get-started-cowork.md, raw/cowork--agents--code-claude-docs-run-agents-parallel.md].

---

## Skills

### Current state and how Cowork differs from Claude Code CLI

**Cowork sessions and cloud sessions (including routines) do NOT read `~/.claude/skills/` on your machine.** Both interactive and scheduled Cowork sessions instead load the skills enabled for your claude.ai account, **synced at session start**; manage them from **Customize** in the Desktop app sidebar or from skills settings on claude.ai. Cloud sessions additionally load project skills committed to the cloned repository's `.claude/skills/` [raw/cowork--skills--code-claude-docs-skills.md].

If a skill exists only in `~/.claude/skills/` locally, a routine invoking it reports "not found," because each routine run starts as a fresh remote session. To make a personal skill available: (a) for Cowork/cloud sessions, enable the skill for your claude.ai account; (b) for cloud sessions specifically, you can instead commit the skill to the repo's `.claude/skills/` or ship it in a plugin declared in the repo's `.claude/settings.json`. **Desktop scheduled tasks are different**: they run locally and load skills from the same locations as any other local session [raw/cowork--skills--code-claude-docs-skills.md].

### Skills synced from claude.ai account: mechanics

If skills are enabled for your claude.ai account, Cowork and cloud sessions load them with **no setup on your machine**. In any *other* (local CLI) session, Claude Code loads them only after turning syncing on with an env var in a non-interactive run:
```bash
CLAUDE_CODE_SYNC_SKILLS=1 claude -p "List the skills you have available"
```
Claude Code downloads synced skills into `~/.claude/skills/synced/` [raw/cowork--skills--code-claude-docs-skills.md].

### Cowork-specific behavior for the body of a synced skill (dynamic injection gotcha)

- In a **cloud session**, the skill body behaves exactly like a local skill (isolated container).
- **In a Cowork session on desktop**, the skill body behaves like a local skill **EXCEPT** every `!` command line is replaced with a `disableSkillShellExecution` placeholder, for every skill supplied there. **This means shell-command dynamic context injection (the `` !`command` `` syntax) does NOT execute in Cowork** the way it does in local Claude Code CLI sessions [raw/cowork--skills--code-claude-docs-skills.md].
- In any other unsynced local session, Claude Code doesn't run `!` commands, doesn't attach `@`-referenced files, and doesn't substitute `${CLAUDE_PROJECT_DIR}`/`${CLAUDE_SESSION_ID}` placeholders: they reach Claude as literal text [raw/cowork--skills--code-claude-docs-skills.md].

This is the single most important gotcha for anyone authoring a skill meant to run inside Cowork: **do not rely on `` !`git diff HEAD` `` -style dynamic injection**: write the skill to have Claude run the equivalent command itself via a tool call instead.

### Access points inside the Cowork app (community deep-dive, cross-checked against official docs)

Three places to find/manage skills: **Plugins**, the **Customize menu**, and the **examples panel**.
- **Via Plugins:** click "+" in the Cowork sidebar → Plugins. Each plugin bundles one or more skills; selecting one from a plugin activates it immediately and starts a guided prompt.
- **Via Customize menu:** Customize → Skills tab. Uploaded/created skills live under **My Skills**; pre-built options are under **Examples**. From here: turn skills on/off, edit with Claude, download, replace with an updated version, or delete.
- **Built-in background skills:** run silently at the system level: creating/editing Word docs, Excel spreadsheets, PowerPoint presentations, PDFs. Not visible/editable. The one visible-but-not-editable built-in skill is the **Skill Creator**.
[raw/cowork--skills--community-ryanandmatt-cowork-skills.md]

**Conflict noted:** the community article states "Skills only work in the Cowork desktop app, not on claude.ai" and its own FAQ answer flags this as possibly stale ("no, per this article... cross-check against official docs, which describe skills syncing from a claude.ai account"). The official docs source (`cowork--skills--code-claude-docs-skills.md`) is authoritative here: skills ARE synced from and managed via a claude.ai account and load into Cowork sessions regardless of surface. **Prefer the official-docs source**: skill *authoring/management* can happen on claude.ai or desktop; skill *execution* happens in whatever surface the Cowork session runs on [raw/cowork--skills--community-ryanandmatt-cowork-skills.md, raw/cowork--skills--code-claude-docs-skills.md].

### Stacking multiple skills

Cowork can use more than one skill per task. Cowork looks at all active skills and decides which apply: e.g., cleaning up an Excel file might auto-apply the built-in spreadsheet skill, a data-validation skill from a Data plugin, and a data-exploration skill simultaneously, without the user specifying which [raw/cowork--skills--community-ryanandmatt-cowork-skills.md].

### Updating a skill via the Skill Creator (exact flow)

1. Customize > Skills, find the skill, three-dot menu > **"Edit with Claude."** Opens a chat session with the Skill Creator and the current skill already loaded.
2. Tell Claude what to change (example prompt: "Do not make any changes until I approve them. I want to add a fifth section to the email newsletter skill...").
3. Once approved, Claude runs through the changes, packages the updated skill, prompts to install.
4. Click **"Copy to Your Skills"**, choose **"Upload and Replace"** to swap the old version.
[raw/cowork--skills--community-ryanandmatt-cowork-skills.md]

### Skill Creator workflow: building a new skill from scratch (exact flow)

1. **Describe the skill you want.** Example: "I want you to build out a new skill for running... Ask me as many questions as you want before we build the skill." Ending with that permission phrase lets Claude dig into details before writing.
2. **Answer Claude's clarifying questions** (structured list: e.g., what counts as the tracked activity, target frequency, log format, passive vs. proactive behavior).
3. **Review the eval results.** After building, Claude runs a quick evaluation: test prompts simulating real usage, shown as two columns (output with skill active vs. without). Documented example: a running-log skill scored 100% pass rate with-skill vs. 56% without-skill.
4. **Install the skill.** Click **"Copy to Your Skills."** Appears immediately under My Skills.
[raw/cowork--skills--community-ryanandmatt-cowork-skills.md]

### "Record a skill": macOS-only Cowork flow (official docs, exact steps)

Availability: **Pro, Max, Team plans, in Cowork in Claude for Mac only.** Not available in chat, on Windows, or on Free/Enterprise plans [raw/cowork--skills--support-create-custom-skills.md].

Instead of writing a skill by hand, record yourself doing the task; Claude builds a proposed skill from the recording.

**Before recording:**
- Update to the latest Claude for Mac.
- Grant macOS permissions on first use: Accessibility (mouse/keyboard tracking), Screen recording (screen visibility).
- Close any files/apps/conversations you don't want captured.
- **Warning:** don't type passwords/secrets or display sensitive info while recording: everything on screen is captured for the session length, plus anything you say.

**Recording:**
1. Open Cowork in Claude for Mac.
2. Start recording: click "+" in the composer → "Record a skill," **or** go to Customize > Skills > "Add" > "Record your screen."
3. Click "Start recording." Leave microphone on to narrate.
4. Do the task normally. Capture bar shows recording is in progress and counts captured steps.
5. Click "Done" (or "Discard" to throw it away).
6. Max recording length: ~10 minutes, with a countdown appearing when ~1 minute remains.

**After clicking Done:** Claude starts a Cowork task, reviews the recording, and proposes:
- A **new skill**, marked NEW on the proposal card: "Save" to keep, "Dismiss" to discard.
- An **update** to an existing skill if the recording overlaps one you already have: "Update" to apply, "Dismiss" otherwise.
- Expand "Content" on the proposal card to read the skill before deciding.

Saved skills appear in Customize > Skills and work like any other skill.

**What's retained:** video/audio are NOT retained. What's saved is a set of screenshots from the session, viewable by expanding the "Recorded demonstration" step in the task. Because those screenshots live in the Cowork task, deleting the task removes them [raw/cowork--skills--support-create-custom-skills.md].

### SKILL.md format: required and optional metadata

Required frontmatter fields:
- `name`: human-friendly name, 64 characters max. Example: `Brand Guidelines`.
- `description`: what the skill does and when to use it: critical, since Claude uses this to decide invocation. **200 characters maximum** per this official support article [raw/cowork--skills--support-create-custom-skills.md]. (Note: the community article gives a looser "under 1,024 characters" figure for description length [raw/cowork--skills--community-ryanandmatt-cowork-skills.md]: the two sources disagree on the exact character cap; prefer the official support article's 200-character figure but treat both as evidence the limit is short and enforced.)

Optional: `dependencies`: software packages required, e.g. `python>=3.8, pandas>=1.5.0` [raw/cowork--skills--support-create-custom-skills.md].

Additional naming rules (community source, not contradicted elsewhere): name must be kebab-case; cannot include "claude" or "anthropic" (reserved); cannot use XML angle brackets anywhere in frontmatter (security restriction) [raw/cowork--skills--community-ryanandmatt-cowork-skills.md].

### Complete working example: a full SKILL.md body

```
## Metadata
name: Brand Guidelines
description: Apply Acme Corp brand guidelines to all presentations and documents

## Overview
This skill provides Acme Corp's official brand guidelines for creating consistent, professional materials. When creating presentations, documents, or marketing materials, apply these standards to ensure all outputs match Acme's visual identity.

## Brand Colors
Our official brand colors are:
- Primary: #FF6B35 (Coral)
- Secondary: #004E89 (Navy Blue)
- Accent: #F7B801 (Gold)
- Neutral: #2E2E2E (Charcoal)

## Typography
Headers: Montserrat Bold
Body text: Open Sans Regular
Size guidelines:
- H1: 32pt
- H2: 24pt
- Body: 11pt

## Logo Usage
Always use the full-color logo on light backgrounds. Use the white logo on dark backgrounds. Maintain minimum spacing of 0.5 inches around the logo.

## When to Apply
Apply these guidelines whenever creating:
- PowerPoint presentations
- Word documents for external sharing
- Marketing materials
- Reports for clients

## Resources
See the resources folder for logo files and font downloads.
```
[raw/cowork--skills--support-create-custom-skills.md]

### Folder structure

```
my-skill/
├── SKILL.md           # required
├── scripts/            # optional — executable code (Python, Bash, validation tools)
├── references/         # optional — docs/reference material loaded only when needed
└── assets/             # optional — templates, fonts, logos, static files
```
[raw/cowork--skills--community-ryanandmatt-cowork-skills.md, raw/cowork--skills--support-create-custom-skills.md]

If there's too much to fit in SKILL.md, add a `REFERENCE.md` (or similarly named file) for supplemental material, and reference it from SKILL.md so Claude knows when to load it [raw/cowork--skills--support-create-custom-skills.md].

### .skill zip packaging: EXACT rule

Once the skill folder is complete:
1. Ensure the folder name matches the skill's name.
2. Create a ZIP of the folder.
3. **The ZIP must contain the skill folder as its root: not a subfolder.**

Correct:
```
my-skill.zip
└── my-skill/
    ├── skill.md
    └── resources/
```
Incorrect:
```
my-skill.zip
└── (files directly in ZIP root)
```
[raw/cowork--skills--support-create-custom-skills.md]

### Progressive disclosure (three-level loading)

1. Frontmatter: always in context, every session, every skill.
2. Full SKILL.md body: loads only when Claude decides the skill is relevant.
3. `references/` and `assets/` files: load only if specifically needed.

This means many installed skills don't all consume context at once [raw/cowork--skills--community-ryanandmatt-cowork-skills.md].

### Portability

A skill built for Cowork works identically in Claude Code and the Claude API: the file format is the same across all three surfaces [raw/cowork--skills--community-ryanandmatt-cowork-skills.md]. Claude Code skills more broadly follow the Agent Skills open standard (agentskills.io), which works across multiple AI tools; Claude Code extends the standard with invocation control, subagent execution, and dynamic context injection (the `!` syntax that Cowork specifically disables, see above) [raw/cowork--skills--code-claude-docs-skills.md].

### Known bug: "Save skill" install pipeline silently truncates SKILL.md (GitHub issue #47016)

- **State:** closed, auto-closed as duplicate of #40231. Filed 2026-04-12 by alexbtrase. Labels: `duplicate`, `area:cowork`, `area:skills`, `platform:windows` [raw/cowork--skills--github-issue-skill-truncation-bug.md].
- **Symptom:** the "Save skill" install button in Cowork silently truncates SKILL.md during installation. The `.skill` zip package contains the complete file; the version written to the read-only skills FUSE mount is shorter. No error shown.
- **Environment:** Windows 11 (Microsoft Store version of Claude); skills mount is a read-only FUSE mount (`ro,nosuid,nodev,relatime`).
- **Evidence (reproduced 3+ times):**
  - `shared-trase-reference`: source 192 lines complete; inside `.skill` zip 192 lines complete; after "Save skill" install, 178 lines, last line ends mid-word ("Alex's direc").
  - `skill-creator-master`: source 500 lines ending "Good luck!"; inside zip 500 lines complete; after install, 482 lines, last line garbled.
- **Key observations:** truncation does NOT correlate with file size (a 33KB/485-line file installed fine; a 16KB/192-line file truncated every time); truncation is deterministic (repeat installs of the same package truncate identically); the FUSE mount caches aggressively, so manual repair via Windows filesystem doesn't immediately reflect in sessions; multiple other installed skills showed truncation signs.
- **Repro commands (from inside a Cowork session):**
```shell
$ wc -l /sessions/*/mnt/.claude/skills/shared-trase-reference/SKILL.md
178
$ tail -1 /sessions/*/mnt/.claude/skills/shared-trase-reference/SKILL.md
...traces to a primary source (email, transcript, Notion page, Slack message, or Alex's direc
$ unzip -o pkg-shared-trase-reference.skill -d /tmp/verify/
$ wc -l /tmp/verify/pkg-shared-trase-reference/SKILL.md
192
```
- **Workaround:** manually copy the correct SKILL.md to the Windows filesystem skills directory via PowerShell, then restart sessions to clear the FUSE cache. Windows skills path: `C:\Users\[user]\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\local-agent-mode-sessions\skills-plugin\[workspace-id]\[account-id]\skills\[skill-name]\SKILL.md`.
- **Related bug:** referenced by issue #51435, "[BUG] Cowork: skill upload truncates files >99 KB and leaves null-byte tail on re-upload."
- **What this independently confirms about Cowork's architecture:** (1) `.skill` is a zip archive containing a `SKILL.md`; (2) Cowork sessions read installed skills from a mounted path under `/sessions/*/mnt/.claude/skills/<skill-name>/SKILL.md` inside the sandboxed session VM; (3) on Windows, the desktop app also stores a local copy under `%LocalAppData%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\local-agent-mode-sessions\skills-plugin\[workspace-id]\[account-id]\skills\[skill-name]\SKILL.md`; (4) the skills mount inside a Cowork session is **read-only** (FUSE) from the agent's perspective.
[raw/cowork--skills--github-issue-skill-truncation-bug.md]

### Security guidance

Skills run with the same access level as Claude in your session: a skill can instruct Claude to read files, run code, make API calls, or use connected services. Only install skills from trusted sources; audit contents before use (a skill is a plain text file, so you can read exactly what it does) [raw/cowork--skills--community-ryanandmatt-cowork-skills.md]. Don't hardcode sensitive information (API keys, passwords) in a skill; review any downloaded skills before enabling [raw/cowork--skills--support-create-custom-skills.md].

### Skill vs. plugin: the distinction (FAQ answer, cross-checked and consistent with plugins section above)

A skill is a single instruction file for one specific workflow. A plugin is a bundle of skills combined with connectors and other tools. Plugins install as a package; skills can be installed one at a time [raw/cowork--skills--community-ryanandmatt-cowork-skills.md].

### Testing a skill (official checklist)

Before uploading: review SKILL.md for clarity, check the description accurately reflects when to use it, verify all referenced files exist, test with example prompts. After uploading: enable in Customize > Skills, try several prompts that should trigger it, review Claude's thinking to confirm it's loading the skill, iterate on the description if Claude isn't using it when expected [raw/cowork--skills--support-create-custom-skills.md].

### Open gap

No raw file gives an exact list of which hook event types (SessionStart, PreToolUse, etc.) actually fire inside a Cowork session versus being CLI-only, beyond the general statement that hooks are Cowork-only (not Chat) [raw/cowork--plugins--support-use-plugins-in-claude.md]. No raw file documents Cowork-side rate limits or per-skill usage-cost specifics beyond the generic "Cowork consumes more usage allocation than chat" statement [raw/cowork--agents--support-get-started-cowork.md]. No cowork-- file confirms whether Claude Code CLI's agent view, agent teams, or dynamic workflows have a Cowork-native equivalent: see the Agents section above for what's confirmed absent.
