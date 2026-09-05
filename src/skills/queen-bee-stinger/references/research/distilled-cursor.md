# Cursor: distilled research (fetched 2026-08-14)

Sources reproduced verbatim where quoted. Raw files at `raw/cursor--*.md`. Official docs preferred on conflict.

## Rules

### Current state / deprecation

Cursor supports four rule types: Project Rules, User Rules, Team Rules, and `AGENTS.md` [raw/cursor--rules--cursor-docs-rules.md]. Rule contents inject at the start of model context when a rule applies [raw/cursor--rules--cursor-docs-rules.md]. **Legacy**: a single `.cursorrules` file at project root still works but is deprecated in favor of `.cursor/rules/*.mdc` [raw/cursor--rules--techsy-mdc-frontmatter.md] (official docs page doesn't itself use "deprecated," but this framing is consistent with its directory-based `.mdc` system) [raw/cursor--rules--cursor-docs-rules.md].

### File format

- Location: `.cursor/rules/`, version-controlled, scoped to the codebase; subfolders allowed (`.cursor/rules/frontend/components.mdc`) [raw/cursor--rules--cursor-docs-rules.md].
- Extension **must be `.mdc`**. A plain `.md` file in `.cursor/rules` is **ignored** (no frontmatter mechanism): use `AGENTS.md` for plain markdown instead [raw/cursor--rules--cursor-docs-rules.md].
- Also loadable as a plugin component under `rules/` (any `.md`/`.mdc`/`.markdown` via folder discovery) [raw/cursor--plugins--plugins-reference.md].

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `description` | string | No | Read by Agent to judge relevance when `alwaysApply: false` and no `globs` [raw/cursor--rules--cursor-docs-rules.md] |
| `globs` | string or array | No | Comma-separated string or list both valid per official docs and Plugins reference [raw/cursor--rules--cursor-docs-rules.md] [raw/cursor--plugins--plugins-reference.md] |
| `alwaysApply` | boolean | No | `true` = always included, globs/description ignored [raw/cursor--rules--cursor-docs-rules.md] |

**Conflict**: TECHSY types `globs` strictly as a YAML list (`string[]`) and warns brace syntax (`{src,lib}/**/*.ts`) "can fail silently" [raw/cursor--rules--techsy-mdc-frontmatter.md]. Official docs and the Plugins reference both show a working comma-separated string (`docs/**/*.md, docs/**/*.mdx`) [raw/cursor--rules--cursor-docs-rules.md] [raw/cursor--plugins--plugins-reference.md]. Prefer official (string or array both accepted); treat the "list only" claim as unconfirmed.

### Resolution table

| `alwaysApply` | `description` | `globs` | Behavior |
| --- | --- | --- | --- |
| `true` | - | - | Always included |
| `false` | - | provided | Auto-attached on matching file |
| `false` | provided | omitted | Agent decides from description |
| `false` | omitted | omitted | Manual: only via `@`-mention |

[raw/cursor--rules--cursor-docs-rules.md]

### Complete examples

```yaml
---
description: "React component patterns and conventions"
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
alwaysApply: false
---

# React Component Rules
Use named exports, not default. Keep components under 200 lines.
```
[raw/cursor--rules--techsy-mdc-frontmatter.md]

```md
---
alwaysApply: false
---

- Every database migration must have both `up` and `down` functions
- Never alter a column type in-place; add, backfill, then drop separately

@migration-template.sql
```
[raw/cursor--rules--cursor-docs-rules.md]

Glob quick reference: `*` one segment, `**` recursive dirs, `**/*.ts` all `.ts` anywhere, `src/**` everything under `src/`, `!pattern` excludes [raw/cursor--rules--cursor-docs-rules.md] [raw/cursor--rules--techsy-mdc-frontmatter.md]. Gotcha: `src/*` matches one level only; `*.js` doesn't match `.jsx`/`.ts` [raw/cursor--rules--techsy-mdc-frontmatter.md].

### Creation, best practices, precedence

Create via `/create-rule` in chat, or **Customize → Rules → Add Rule** [raw/cursor--rules--cursor-docs-rules.md]. Keep rules under 500 lines; reference files with `@filename` rather than copying; don't restate whole style guides (use a linter); codify a pattern as a rule only after the agent repeats a mistake three times ("Rule of Three") [raw/cursor--rules--cursor-docs-rules.md] [raw/cursor--rules--techsy-mdc-frontmatter.md]. Community, unverified: a project with 20 always-on rules can burn "2,000+ tokens per request" against a ~20,000-token standard chat context: treat as anecdotal, not official [raw/cursor--rules--techsy-mdc-frontmatter.md].

**Precedence (official)**: Team Rules → Project Rules → User Rules; all applicable rules merge, earlier sources win on conflict [raw/cursor--rules--cursor-docs-rules.md]. Within project rules, same-tier conflicts are undefined; community advice is to number files (`001-base.mdc`) for predictable load order since later-loaded rules "tend to" win [raw/cursor--rules--techsy-mdc-frontmatter.md].

Team Rules (Team/Enterprise only, dashboard-managed): free-form text, no folder structure, glob-scopable; "Enable this rule immediately" (active vs. draft) and "Enforce this rule" (can't be disabled per-user) are separate toggles [raw/cursor--rules--cursor-docs-rules.md]. Remote import: Customize → Rules → Add Rule → Remote Rule (GitHub) → scans all `.mdc` files, syncs into `.cursor/rules/imported/`, preserving relative paths [raw/cursor--rules--cursor-docs-rules.md]. User Rules apply only to Agent (Chat), **not** to Inline Edit (Cmd/Ctrl+K) [raw/cursor--rules--cursor-docs-rules.md].

### Cross-harness portability

`AGENTS.md` is plain markdown, no frontmatter, project-root alternative to `.cursor/rules`; **nested** `AGENTS.md` in subdirectories is supported and merges with parents, more-specific wins [raw/cursor--rules--cursor-docs-rules.md]. Cross-tool: Claude Code uses `CLAUDE.md`, Codex reads `AGENTS.md`, Copilot has instruction files, Windsurf its own format: "the underlying principle is identical" [raw/cursor--rules--techsy-mdc-frontmatter.md].

| | `.cursor/rules` | `CLAUDE.md` | `AGENTS.md` |
| --- | --- | --- | --- |
| Format | MDC + frontmatter | Plain markdown | Plain markdown |
| Glob scoping | Yes | No | Directory-level |
| Rule types | 4 | Always-on | Always-on |
| Works in | Cursor only | Claude Code | Multiple tools |

[raw/cursor--rules--techsy-mdc-frontmatter.md]

### Known bug

Rule edits can vanish in the UI; workaround: close Cursor fully, choose "Override" on the unsaved-changes popup, reopen [raw/cursor--rules--techsy-mdc-frontmatter.md].

---

## Plugins

### Current state

Plugins package **rules, skills, agents, commands, MCP servers, and hooks** into one install, discoverable via the Cursor Marketplace or `/add-plugin` [raw/cursor--plugins--plugins-reference.md] [raw/cursor--multiple--changelog-2-5-plugins-marketplace.md]. Shipped in **2.5** (Feb 17, 2026); launch partners: Amplitude, AWS, Figma, Linear, Stripe [raw/cursor--multiple--changelog-2-5-plugins-marketplace.md]. Template repo: `github.com/cursor/plugin-template` [raw/cursor--plugins--plugins-reference.md].

### Two manifest formats (portability)

| Format | Manifest | Components |
| --- | --- | --- |
| **Agent Plugins** (open standard, agent-plugins.org) | `plugin.json` at root | Skills, MCP servers |
| **Cursor Plugins** | `.cursor-plugin/plugin.json` | Skills, MCP servers, rules, agents, commands, hooks, variables |

A spec-conformant Agent Plugin loads in Cursor unmodified: this is the cross-harness path (skills + MCP only, portable to any compliant host) [raw/cursor--plugins--plugins-reference.md].

```text
my-plugin/                          my-plugin/ (Cursor Plugin)
├── plugin.json                     ├── .cursor-plugin/plugin.json
├── skills/code-reviewer/SKILL.md   ├── rules/*.mdc  skills/  agents/
└── mcp.json                        ├── commands/  hooks/hooks.json
                                     ├── mcp.json  assets/  scripts/  README.md
```
[raw/cursor--plugins--plugins-reference.md]

### `.cursor-plugin/plugin.json` fields

Required: `name` (string, kebab-case, alphanumeric start/end).

Optional: `description`, `version` (semver), `author` (object: `name` required, `email` optional), `homepage`, `repository`, `license`, `keywords` (array), `logo` (relative path → `raw.githubusercontent.com`, or absolute URL), `rules`/`agents`/`skills`/`commands` (string or array of paths), `hooks` (string or object), `mcpServers` (string, object, or array: overrides default `mcp.json` discovery), `variables` (JSON Schema declaring variable **names** only, no secrets) [raw/cursor--plugins--plugins-reference.md].

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
[raw/cursor--plugins--plugins-reference.md]

### Variables

Top level must be `{ "type": "object", "properties": {...} }`; only these JSON Schema keywords accepted: `type`, `title`, `description`, `default`, `enum`, `const`, `properties`, `required`, `items`, length/numeric constraints. Values are set by admins in dashboard **Plugins → Configure**, never stored in the repo [raw/cursor--plugins--plugins-reference.md]:
```json
{ "name": "example-plugin", "variables": { "type": "object",
  "properties": { "API_TOKEN": { "type": "string", "title": "API token" } },
  "required": ["API_TOKEN"] } }
```
```json
{ "mcpServers": { "example-api": { "url": "https://mcp.example.com/mcp",
  "headers": { "Authorization": "Bearer ${API_TOKEN}" } } } }
```
`${API_TOKEN}` here is a plugin-variable placeholder, distinct from shell-style `${env:...}` used in standalone `mcp.json` [raw/cursor--plugins--plugins-reference.md] [raw/cursor--plugins--mcp-docs.md].

### Component auto-discovery

| Component | Default folder | Rule |
| --- | --- | --- |
| Skills | `skills/` | each subdir with `SKILL.md` |
| Rules | `rules/` | all `.md`/`.mdc`/`.markdown` |
| Agents | `agents/` | all `.md`/`.mdc`/`.markdown` |
| Commands | `commands/` | all `.md`/`.mdc`/`.markdown`/`.txt` |
| Hooks | `hooks/hooks.json` | parsed for event names |
| MCP Servers | `mcp.json` | parsed for server entries |
| Root Skill | `SKILL.md` at plugin root | single-skill plugin (only if no `skills/` dir/field) |

An explicit manifest field **replaces** folder discovery for that type (default folder not also scanned) [raw/cursor--plugins--plugins-reference.md].

**Gap**: plugin `agents/` frontmatter is documented with only `name`/`description` [raw/cursor--plugins--plugins-reference.md], narrower than the standalone `.claude/agents/*.md` subagent format (`name`, `description`, `model`, `readonly`, `is_background`: see Agents section) [raw/cursor--agents--subagents-docs.md]. Raw research doesn't clarify whether plugin-distributed agents support the fuller set.

Skills frontmatter in plugin context: `name`, `description` [raw/cursor--plugins--plugins-reference.md]: a subset of the full `SKILL.md` schema (see Skills section). Commands frontmatter: `name`, `description`:
```markdown title="commands/deploy-staging.md"
---
name: deploy-staging
description: Deploy the current branch to the staging environment
---
# Deploy to staging
1. Run tests  2. Build the project  3. Push to staging branch
```
[raw/cursor--plugins--plugins-reference.md]

### Hooks (`hooks/hooks.json`)

```json
{ "hooks": { "afterFileEdit": [{ "command": "./scripts/format-code.sh" }],
  "beforeShellExecution": [{ "command": "./scripts/validate-shell.sh", "matcher": "rm|curl|wget" }],
  "sessionEnd": [{ "command": "./scripts/audit.sh" }] } }
```
Agent hooks: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought`. Tab hooks: `beforeTabFileRead`, `afterTabFileEdit`. App lifecycle: `workspaceOpen` [raw/cursor--plugins--plugins-reference.md]. Community source also documents `type: "prompt"` hooks (LLM-evaluated condition + `timeout`) as a script alternative [raw/cursor--multiple--theodoroskokosioulis-complete-guide.md].

### MCP inside a plugin vs. standalone `mcp.json`

Both plugin formats place `mcp.json` at plugin root. Agent Plugin form declares transport explicitly via the standard schema; Cursor Plugin form infers transport from `command`/`url` and supports Cursor variables [raw/cursor--plugins--plugins-reference.md]:
```json
{ "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": { "code-review": { "type": "stdio", "command": "./bin/code-review", "cwd": "${PLUGIN_ROOT}" } } }
```

Standalone locations: project `.cursor/mcp.json`, global `~/.cursor/mcp.json` [raw/cursor--plugins--mcp-docs.md]. Transports:

| Transport | Execution | Users | Auth |
| --- | --- | --- | --- |
| `stdio` | Local, Cursor-managed | Single user | Manual |
| `SSE` | Local/Remote | Multi-user | OAuth |
| `Streamable HTTP` | Local/Remote | Multi-user | OAuth |

Supported protocol extensions: Tools, Prompts, Resources, Roots, Elicitation, MCP Apps (interactive UI from tool responses) [raw/cursor--plugins--mcp-docs.md].

STDIO fields: `type` (required, `"stdio"`), `command` (required), `args`, `env`, `envFile` (STDIO-only, not for remote servers) [raw/cursor--plugins--mcp-docs.md]:
```json
{ "mcpServers": { "server-name": { "command": "npx", "args": ["-y", "mcp-server"], "env": { "API_KEY": "value" } } } }
```
Remote:
```json
{ "mcpServers": { "server-name": { "url": "http://localhost:3000/mcp", "headers": { "API_KEY": "value" } } } }
```
Static OAuth `auth` object: `CLIENT_ID` (required), `CLIENT_SECRET` (optional), `scopes` (optional, else discovered via `/.well-known/oauth-authorization-server`). Fixed redirect URLs: `https://www.cursor.com/agents/mcp/oauth/callback` (web/Agents), `http://localhost:8787/callback` (desktop) [raw/cursor--plugins--mcp-docs.md]. Config interpolation (`command`, `args`, `env`, `url`, `headers`): `${env:NAME}`, `${userHome}`, `${workspaceFolder}`, `${workspaceFolderBasename}`, `${pathSeparator}`/`${/}` [raw/cursor--plugins--mcp-docs.md].

Enterprise: Team MCP distribution via **Dashboard → Integrations & MCP**; **MCP Allowlist** (Team Settings → MCP Configuration) approves servers by command/URL pattern and can restrict tools per server (empty = all allowed); local server network modes: Allow all / Allowlist / Deny all / No sandbox [raw/cursor--plugins--mcp-docs.md].

### Multi-plugin repos

`.cursor-plugin/marketplace.json` at repo root: required `name`, `owner` (object), `plugins` (array, max 500); optional `metadata` (`description`, `version`, `pluginRoot`) [raw/cursor--plugins--plugins-reference.md].
```json
{ "name": "my-marketplace", "owner": { "name": "Your Org" },
  "plugins": [ { "name": "plugin-one", "source": "plugin-one" } ] }
```
Each `plugins[]` entry: `name`, `source` (string/object), plus the same optional fields as a standalone manifest (`description`, `version`, `author`, `homepage`, `repository`, `license`, `keywords`, `logo`, `category`, `tags`, component paths, `hooks`, `mcpServers`, `variables`) [raw/cursor--plugins--plugins-reference.md]. Resolution: parser looks for `<source>/.cursor-plugin/plugin.json`, merges with the marketplace entry (per-plugin values win), then runs component discovery inside that directory [raw/cursor--plugins--plugins-reference.md].

### Submission checklist (official)

Valid manifest; unique lowercase kebab-case `name`; clear `description`; valid files/frontmatter for all components; logo committed with relative path; `README.md`; Agent Plugins conform to agent-plugins.org schemas; every `${VAR}` in `mcp.json` declared in `variables`; all manifest paths relative and valid (no `..`, no absolute); tested locally; multi-plugin repos need `.cursor-plugin/marketplace.json` with unique names. Submit at `cursor.com/marketplace/publish` [raw/cursor--plugins--plugins-reference.md].

### Gotchas / security

Relative logo paths resolve to `raw.githubusercontent.com/<org>/<repo>/<sha>/<path>` [raw/cursor--plugins--plugins-reference.md]. MCP security: verify source, review permissions, use restricted API keys, audit code for critical integrations; a crashed/timed-out server shows an error and is isolated from other servers [raw/cursor--plugins--mcp-docs.md].

---

## Commands

### Current state: legacy, absorbed into Skills

As of July 2026 the standalone commands page is gone from `cursor.com/docs`; Agent Skills docs treat commands only as a migration source [raw/cursor--commands--learncursor-commands-to-skills.md]. The official **Plugins reference** still documents a `commands/` component type for plugin bundles, so commands remain first-class inside plugins even though hand-authored `.cursor/commands/` is legacy [raw/cursor--plugins--plugins-reference.md] [raw/cursor--commands--learncursor-commands-to-skills.md]. Existing `.cursor/commands/*.md` files **still load and work**; new workflows should be skills [raw/cursor--commands--learncursor-commands-to-skills.md].

### Legacy file format

Location: `.cursor/commands/` (project) or `~/.cursor/commands/` (global); Team-managed via dashboard [raw/cursor--multiple--theodoroskokosioulis-complete-guide.md] [raw/cursor--commands--learncursor-commands-to-skills.md]. One markdown file per command, **no required frontmatter**: just the prompt [raw/cursor--commands--learncursor-commands-to-skills.md]. Invoked only via `/command-name`: human-only trigger. Trailing text becomes extra context and commands can be chained: `/commit and /pr these changes to fix DX-523` [raw/cursor--multiple--theodoroskokosioulis-complete-guide.md].

```markdown
# Code review
Review the current changes with these criteria:
## Security
- Check for hardcoded secrets or credentials
- Look for SQL injection or XSS vulnerabilities
Provide specific line numbers and code suggestions for each issue found.
```
[raw/cursor--multiple--theodoroskokosioulis-complete-guide.md]

### Migration: `/migrate-to-skills`

Built-in skill, Cursor 2.4+. Converts **dynamic rules** (`alwaysApply: false`/undefined, no `globs`) into standard skills, and **slash commands** (user- and workspace-level) into skills with `disable-model-invocation: true` (preserves human-only invocation). Rules with `alwaysApply: true` or specific `globs` are **not** migrated (explicit triggers differ from skill semantics); User Rules aren't migrated either (not filesystem-stored) [raw/cursor--skills--skills-docs.md] [raw/cursor--commands--learncursor-commands-to-skills.md].

```markdown title=".claude/skills/open-pr/SKILL.md"
---
name: open-pr
description: Commit the current changes, push, and open a pull request.
disable-model-invocation: true
---
Commit the current changes with a conventional-commit message.
Push the branch and open a pull request. Reply with only the PR link.
```
[raw/cursor--commands--learncursor-commands-to-skills.md]

| Primitive | Trigger | Use for |
| --- | --- | --- |
| Rule | Always on (or by glob) | Conventions every prompt should respect |
| Skill | Agent decides by description, or you via slash menu | Capability reached for when relevant |
| Command (legacy) | You type it | Superseded by a skill with `disable-model-invocation: true` |
| Sub-agent | Spawned by another agent | Parallel role with its own context |

[raw/cursor--commands--learncursor-commands-to-skills.md]

### Gotchas

The most-skipped step is telling the command/skill *how to answer* (e.g., "reply with only the PR link") [raw/cursor--commands--learncursor-commands-to-skills.md]. `/create-skill` can capture a just-finished session as a reusable skill on the spot [raw/cursor--commands--learncursor-commands-to-skills.md]. **Council pattern**: a skill/command that fans a question to N sub-agents (`use Council n=15: <question>`) which each report through a file, then a final agent synthesizes one ranked answer [raw/cursor--commands--learncursor-commands-to-skills.md]. A published `de-slop` command strips AI-authored filler comments before human review [raw/cursor--commands--learncursor-commands-to-skills.md].

---

## Agents

Two concepts share "agents" in the raw research: the **Agents Window** (UI surface) and **Subagents** (delegatable agent configs).

### Agents Window (UI)

Cursor's agent-first workspace for building across repos/environments (local, cloud, remote SSH) [raw/cursor--agents--agents-window-docs.md]. GA with Cursor 3 (April 2, 2026); Enterprise Admins controlled per-team rollout for two weeks post-launch, then opened to all [raw/cursor--agents--agents-window-docs.md]. Open: Cmd+Shift+P → "Open Agents Window"; back to IDE: Cmd+Shift+P → "Open IDE." Exclusive features: multi-workspace agent management, new diffs view, parallel cloud agents (phone/web/Slack/GitHub/Linear), local↔cloud handoff (`/in-cloud`, `/babysit`), worktrees (isolated Git checkouts per task) [raw/cursor--agents--agents-window-docs.md].

### Timeline

- **2.0** (Oct 29, 2025): Multi-Agents sidebar, up to **8 parallel agents** per prompt via git worktrees/remote machines; Composer model; Browser GA; Sandboxed Terminals GA on macOS (auto-sandboxed, no internet unless allowlisted); Team Commands; Voice Mode; Plan Mode in Background; "Background Agents" renamed **Cloud Agents**; Notepads deprecated [raw/cursor--agents--changelog-2-0-composer-multiagent.md].
- **2.4** (Jan 22, 2026): **Subagents** introduced (parallel, own-context, custom prompt/tools/model; defaults for research/terminal/parallel work). **Skills** introduced. Image generation to `assets/`. Cursor Blame (Enterprise, per-line AI attribution). MCP definitions moved to JSON under `.cursor`, loaded only when needed [raw/cursor--multiple--changelog-2-4-subagents-skills.md].
- **2.5** (Feb 17, 2026): **Plugins** launched. Sandbox network controls (User config only / + defaults / Allow all; Enterprise enforceable). **Async subagents**: background execution without blocking parent, and **subagents can spawn child subagents** [raw/cursor--multiple--changelog-2-5-plugins-marketplace.md].

### Subagents: concept

Specialized assistants the main agent delegates to; own context window, returns result to parent; usable in editor, CLI, Cloud Agents [raw/cursor--agents--subagents-docs.md]. Foreground blocks until done (sequential); background returns immediately (long-running/parallel) [raw/cursor--agents--subagents-docs.md].

Built-in (no config needed): **Explore** (codebase search, faster model, many parallel searches), **Bash** (shell command series, isolates verbose output), **Browser** (MCP browser control, filters noisy DOM/screenshots) [raw/cursor--agents--subagents-docs.md].

Use subagents for: context isolation on long research, parallel workstreams, multi-step specialized expertise, independent verification. Use skills instead for: single-purpose one-shot tasks not needing a separate context window [raw/cursor--agents--subagents-docs.md].

### File locations

| Type | Location | Scope |
| --- | --- | --- |
| Project | `.claude/agents/` | current project |
| Project (Claude compat) | `.claude/agents/` | current project |
| Project (Codex compat) | `.codex/agents/` | current project |
| User | `~/.claude/agents/` | all projects |
| User (Claude compat) | `~/.claude/agents/` | all projects |
| User (Codex compat) | `~/.codex/agents/` | all projects |

Project subagents win on name conflicts; among project locations `.cursor/` beats `.claude/`/`.codex/` [raw/cursor--agents--subagents-docs.md]. Explicit cross-harness fallback: Cursor reads Claude Code's and Codex's native agent directories directly.

### File format and fields

```markdown
---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
readonly: true
---
You are a security expert auditing code for vulnerabilities.
When invoked: identify security-sensitive paths, check for injection/XSS/auth bypass,
verify no hardcoded secrets, review input validation.
Report findings by severity: Critical / High / Medium.
```
[raw/cursor--agents--subagents-docs.md]

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | string | No | from filename | lowercase, hyphens |
| `description` | string | No | - | drives delegation decisions |
| `model` | string | No | `inherit` | `inherit` or specific model ID |
| `readonly` | boolean | No | `false` | no file edits / state-changing commands |
| `is_background` | boolean | No | `false` | non-blocking |

[raw/cursor--agents--subagents-docs.md]

Model parameter syntax (bracketed `id=value`, comma-separated): `composer-2.5[]` (standard variant), `composer-2.5[fast=false]`, `claude-opus-5[effort=high]`, `claude-opus-5[context=300k]`, `claude-opus-5[effort=high,context=300k]` [raw/cursor--agents--subagents-docs.md]. Configured model is overridden if a team admin blocks it, a legacy plan needs Max Mode you lack, or your plan excludes it: Cursor falls back to a compatible model [raw/cursor--agents--subagents-docs.md].

### Invocation, cloud subagents, resuming

Automatic delegation weighs task complexity, `description` match, and available context; bias toward auto-delegation with phrases like "use proactively" [raw/cursor--agents--subagents-docs.md]. Explicit: `/name` syntax or natural language; parallel via multiple Task tool calls in one message [raw/cursor--agents--subagents-docs.md]. `/in-cloud` hands the next task to a subagent on its own VM+branch (Agents Window only); `/babysit` iterates a PR to merge-ready. Cloud subagents pull MCP servers from the **team's** `cursor.com/agents` config, not the local session [raw/cursor--agents--subagents-docs.md]. Each execution returns an agent ID for resuming (`Resume agent abc123...`); background subagents write state as they run and to `~/.cursor/subagents/`, readable by the parent for progress [raw/cursor--agents--subagents-docs.md].

### Example: verifier pattern

```markdown
---
name: verifier
description: Validates completed work. Use after tasks are marked done to confirm implementations are functional.
---
You are a skeptical validator. Your job is to verify that work claimed as complete actually works.
1. Identify what was claimed  2. Check the implementation exists and is functional
3. Run relevant tests  4. Look for missed edge cases
Do not accept claims at face value. Test everything.
```
[raw/cursor--agents--subagents-docs.md]

### Best practices, nesting, cost

Write focused single-responsibility subagents; invest in `description` (drives delegation); keep prompts concise; version-control `.claude/agents/`; let Agent draft, then customize [raw/cursor--agents--subagents-docs.md]. Avoid: dozens of vague generic subagents, 2,000-word prompts, duplicating a skill/command's job; start with 2-3 [raw/cursor--agents--subagents-docs.md]. Since 2.5, subagents can spawn children, but a child-of-a-subagent **cannot** spawn further (nesting cap = 2 levels below main agent); requires Task tool access, hooks/policies can block spawning [raw/cursor--agents--subagents-docs.md]. Trade-offs: context isolation costs startup overhead (own context gathering); parallel execution costs ~N× tokens for N subagents; specialized focus can mean higher latency than the main agent for simple tasks [raw/cursor--agents--subagents-docs.md].

---

## Skills

### Current state

Agent Skills is an **open standard** (agentskills.io) for portable agent capabilities [raw/cursor--skills--skills-docs.md]. Landed in Cursor's editor and CLI in **2.4** (Jan 22, 2026) [raw/cursor--multiple--changelog-2-4-subagents-skills.md]. Markdown-based, reusable, team-shareable, load progressively (only pulled into context when relevant) [raw/cursor--skills--help-customization-skills.md] [raw/cursor--skills--skills-docs.md].

### Directory locations

| Location | Scope |
| --- | --- |
| `.agents/skills/` | Project |
| `.claude/skills/` | Project |
| `~/.agents/skills/` | User (global) |
| `~/.claude/skills/` | User (global) |

Cross-harness fallback: also loads `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, `~/.codex/skills/` [raw/cursor--skills--skills-docs.md] [raw/cursor--skills--help-customization-skills.md].

Skills roots are walked **recursively**; category subfolders are purely organizational: identity comes from the immediate folder containing `SKILL.md` [raw/cursor--skills--skills-docs.md]. Nested per-package skill folders in a monorepo (e.g. `apps/web/.claude/skills/`) are auto-scoped to files under that directory, equivalent to setting `paths`, no manual scoping needed [raw/cursor--skills--skills-docs.md].

### Directory shape and frontmatter

```text
.agents/skills/deploy-app/
├── SKILL.md
├── scripts/deploy.sh
├── references/REFERENCE.md
└── assets/config-template.json
```
Optional dirs: `scripts/` (executable, any language), `references/` (docs loaded on demand), `assets/` (templates/data). Keep `SKILL.md` itself lean; push detail into `references/` for progressive loading [raw/cursor--skills--skills-docs.md].

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | lowercase/numbers/hyphens; **must match parent folder name** |
| `description` | Yes | what + when; agent reads this for relevance |
| `paths` | No | glob(s) scoping to matching files; comma-separated string or list; unset = always available |
| `disable-model-invocation` | No | `true` = only via explicit `/skill-name`, never auto-loaded |
| `metadata` | No | arbitrary key-value map |

Legacy `globs` field still works as a fallback but new skills should use `paths` [raw/cursor--skills--skills-docs.md]. Note: the Plugins reference lists only `name`/`description` for skill frontmatter [raw/cursor--plugins--plugins-reference.md]: narrower than this full schema; the dedicated Skills reference is authoritative for `SKILL.md` itself.

### Complete example

```markdown
---
name: my-skill
description: Short description of what this skill does and when to use it.
---
# My Skill
## When to Use
- Use this skill when...
## Instructions
- Step-by-step guidance for the agent
- Domain-specific conventions
- Use the ask questions tool if you need to clarify requirements with the user
```
File-scoped variant: `paths: ["**/*.tsx", "packages/ui/**/*.ts"]` or the comma-separated string form `paths: "**/*.py, scripts/**/*.py"` [raw/cursor--skills--skills-docs.md].

### Invocation

Agent auto-discovers at startup, judges relevance from `name`/`description`; manual: `/skill-name` (runs it) or `@skill-name` (attaches as context) [raw/cursor--skills--help-customization-skills.md] [raw/cursor--skills--skills-docs.md]. `disable-model-invocation: true` makes a skill behave like a legacy command: never auto-loaded [raw/cursor--skills--skills-docs.md].

| | Rules | Skills |
| --- | --- | --- |
| Purpose | Short guidelines/constraints | Multi-step workflows |
| Length | Lines to a few hundred | Often longer, detailed |
| Applied | Every/matching conversation | On demand |

[raw/cursor--skills--help-customization-skills.md]

### Converting rules/commands

Rule → skill: `/create-skill`, "turn `@my-rule` into a skill," review, delete old rule if unneeded [raw/cursor--skills--help-customization-skills.md]. Commands/dynamic-rules → skills: `/migrate-to-skills` (rules covered in Commands section above) [raw/cursor--skills--help-customization-skills.md] [raw/cursor--skills--skills-docs.md].

Selected built-ins: `/automate`, `/babysit`, `/canvas`, `/create-hook`, `/create-rule`, `/create-skill`, `/create-subagent`, `/cursor-blame`, `/migrate-to-skills`, `/review`, `/review-security`, `/shell`, `/split-to-prs`, `/statusline` [raw/cursor--skills--skills-docs.md].

### Viewing, gotchas, portability

Discovered skills appear under **Customize → Skills**, alongside rules in "Agent Decides" [raw/cursor--skills--skills-docs.md]. GitHub import reuses the rules importer flow (Customize → Rules → Add Rule → Remote Rule (GitHub)): the raw source doesn't explain why skill import lives under the rules panel [raw/cursor--skills--skills-docs.md].

Gotchas: `name` **must** exactly match its containing folder; progressive disclosure means the agent holds only name+description at boot, loading full content only when it reaches for the skill: unlike rules, which are paid for every turn they're in scope [raw/cursor--skills--skills-docs.md] [raw/cursor--commands--learncursor-commands-to-skills.md].

Portability: skills work across "any agent that supports the Agent Skills standard" [raw/cursor--skills--skills-docs.md]. Cursor's compatibility fallback paths (`.claude/skills/`, `.codex/skills/` and their global equivalents) mean a skill written for Claude Code or Codex loads unmodified in Cursor, and vice versa [raw/cursor--skills--skills-docs.md]. The Agent Plugins standard is the packaging-level analog: bundling skills + MCP servers for portable distribution beyond a single `skills/` folder [raw/cursor--plugins--plugins-reference.md].
