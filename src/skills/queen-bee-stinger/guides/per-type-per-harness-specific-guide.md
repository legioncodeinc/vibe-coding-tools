# Per-type, per-harness authoring guide

The deep reference. For each of the five Hive component types (Rules, Plugins, Commands, Agents, Skills), and within each, for each of the four harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork): where the file goes, the complete field table, one minimal working example, and the gotchas that will burn you if you skip them.

Everything here is grounded in `references/research/distilled-research-articles.md`, which cites `raw/` sources. Nothing is pulled from training data about harness behavior. Where an example is quoted verbatim from the research, its citation says so. Where an example is constructed to fill a documented but unillustrated format, that is stated plainly rather than presented as a quote.

For the fast lookup table (paths, status, precedence, without the full field tables and examples) see `harness-support-matrix.md` in this same folder. That file is the map; this file is the manual.

Working templates for each type live under `../references/templates/<type>/`. This guide explains the fields and gotchas; it does not duplicate the full template files, it points at them.

---

# Rules

## Claude Code

**Where it goes.** `~/.claude/CLAUDE.md` (user, all projects), `./CLAUDE.md` or `./.claude/CLAUDE.md` (project, committed), `./CLAUDE.local.md` (local, gitignore it), managed policy CLAUDE.md at OS-specific system paths, and `.claude/rules/*.md` for topic files (discovered recursively).

**Field table.**

| Field | Location | Required | Notes |
|---|---|---|---|
| (body) | `CLAUDE.md` | Yes | Plain markdown, no frontmatter. Target under 200 lines; longer files reduce adherence |
| `paths` | `.claude/rules/*.md` frontmatter | No | YAML list of globs. Rule loads only when Claude reads/edits a matching file. Whole `paths` list shares a budget of 1,000 expanded patterns and 4 MiB |
| `@path/to/file` | Import syntax, in body | No | Relative (resolved against the containing file) or absolute. Max recursion depth 4. External imports trigger a one-time approval dialog in project-scope files |

[raw/claude-code--rules--memory-official-docs.md]

**Minimal working example.** A path-scoped rule under `.claude/rules/`:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
```
[raw/claude-code--rules--memory-official-docs.md]

Bridging a shared `AGENTS.md` into Claude Code (since Claude Code reads `CLAUDE.md`, not `AGENTS.md`):

```markdown
@AGENTS.md

## Claude Code

Use plan mode for changes under `src/billing/`.
```
[raw/claude-code--rules--memory-official-docs.md]

**Gotchas.**
- Claude Code never reads a project's `AGENTS.md` on its own. Import it (`@AGENTS.md`) or symlink it to `CLAUDE.md` (the symlink needs admin/dev-mode on Windows, so prefer the import there).
- `.claude/rules/*.md` files without `paths` frontmatter load unconditionally, at the same priority as `.claude/CLAUDE.md`. Only add `paths` when you actually want glob-scoped loading.
- CLAUDE.md files concatenate, they do not override. A subdirectory CLAUDE.md does not replace the root one, it adds to it, and loads lazily only once Claude reads a file in that subdirectory.
- Bad bracket expressions like `photos [2024/**` used to break the Read tool for every file the rule touched (fixed v2.1.207); an unreadable pattern now just matches nothing.
[raw/claude-code--rules--memory-official-docs.md]

## Cursor

**Where it goes.** `.cursor/rules/*.mdc` (project, subfolders allowed), `AGENTS.md` (project root, no frontmatter), Team Rules (dashboard-managed, Team/Enterprise), User Rules (account-level, applies to Agent/Chat only, not Inline Edit).

**Field table.**

| Field | Type | Required | Notes |
|---|---|---|---|
| `description` | string | No | Read by the Agent to judge relevance when `alwaysApply: false` and no `globs` |
| `globs` | string or array | No | Comma-separated string shown in the rules doc [raw/cursor--rules--cursor-docs-rules.md]; array form documented in the plugins reference [raw/cursor--plugins--plugins-reference.md] (see Conflicts in `harness-support-matrix.md`) |
| `alwaysApply` | boolean | No | `true` means always included, `globs`/`description` ignored |

[raw/cursor--rules--cursor-docs-rules.md]

**Minimal working example.**

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

**Gotchas.**
- The rules directory only reads `.mdc`. A plain `.md` file dropped into `.cursor/rules/` is silently ignored, since there is no frontmatter mechanism for it. Use `AGENTS.md` for plain markdown instead.
- Precedence is Team Rules, then Project Rules, then User Rules, all merging, with earlier sources winning on conflict. Same-tier conflicts are undefined; the community workaround is numbering files (`001-base.mdc`) for predictable load order.
- Keep rules under 500 lines and reference files with `@filename` instead of pasting them in. Codify a pattern as a rule only after the agent repeats the same mistake three times (the "Rule of Three").
- Known bug: rule edits can vanish in the UI. Workaround is closing Cursor fully, choosing "Override" on the unsaved-changes popup, and reopening.
[raw/cursor--rules--cursor-docs-rules.md, raw/cursor--rules--techsy-mdc-frontmatter.md]

## Codex

**Where it goes.** `~/.codex/AGENTS.md` (global), `./AGENTS.md` (project root), `<dir>/AGENTS.md` (any nested directory), `AGENTS.override.md` (personal override, same directory, skips the sibling `AGENTS.md` entirely). Separately, `config.toml` at `~/.codex/config.toml`, `.codex/config.toml` (trusted projects only), profile files, and `/etc/codex/config.toml`.

**Field table.** `AGENTS.md` has no frontmatter and no required fields; it's plain markdown. Popular section headings, none required: Dev environment tips, Testing instructions, PR instructions, Code Review Rules (with `###` subheadings per check group).

[raw/codex--rules--agents-md-standard.md, raw/codex--agents--github-code-review.md]

**Minimal working example.**

```md
# Sample AGENTS.md file
## Dev environment tips
- Use `pnpm dlx turbo run where <project_name>` to jump to a package instead of scanning with `ls`.
## Testing instructions
- Find the CI plan in the .github/workflows folder.
- Fix any test or type errors until the whole suite is green.
## PR instructions
- Title format: [<project_name>] <Title>
- Always run `pnpm lint` and `pnpm test` before committing.
```
[raw/codex--rules--agents-md-standard.md]

**Gotchas.**
- Filename must be exact uppercase `AGENTS.md`. Migration shim from the old `AGENT.md` name: `mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md`.
- Two sources disagree on whether nested `AGENTS.md` files concatenate (later wins, per Codex CLI docs) or the closest single file wins (per the base spec). This is unresolved even upstream. See the Conflicts section of `harness-support-matrix.md` and assume concatenation for anything you author.
- Size cap is disputed between two community sources: 64KB versus 32 KiB. Stay under 32 KiB to be safe under either reading.
- If a project is untrusted, Codex skips all project-local `.codex/` layers (config, hooks, rules together). User/system config still loads.
- Project-local `.codex/config.toml` cannot override machine-local/auth/telemetry keys (`openai_base_url`, `model_provider`, `notify`, `otel`, and others). Those silently get ignored if set there; put them in user-level config.
[raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--agents-md-standard.md, raw/codex--rules--config-basic.md, raw/codex--rules--config-reference.md]

## Cowork

**Where it goes.** No disk file. Global instructions live at Settings > Cowork > Global instructions. Folder instructions are auto-added when a local folder is selected on desktop, and can be edited by the user or by Claude itself mid-session.

**Field table.** None. This is a UI text field, not a manifest or frontmatter format.

**Minimal working example.** The exact flow for setting Global instructions:
1. Navigate to Settings > Cowork.
2. Click "Edit" next to Global instructions.
3. Type instructions in the text box, click "Save."
[raw/cowork--agents--support-get-started-cowork.md]

**Gotchas.**
- Cowork does not read a project-root `CLAUDE.md` from disk the way the CLI does. A committed CLAUDE.md or AGENTS.md in the repo is not automatically read as a rules file by Cowork itself.
- Deletion protection is a hard rule regardless of instructions: Cowork requires explicit "Allow" permission before permanently deleting any files, no matter what a Global or Folder instruction says.
- Three approval modes (Manual, Auto, Skip) govern how much a connector action needs sign-off, independent of anything written in Global/Folder instructions. Auto mode is currently Pro/Max only.
[raw/cowork--rules--support-claude-md-and-prompts.md, raw/cowork--agents--support-get-started-cowork.md]

## Hive conventions: rules

The build plan does not define a Critical Directive or close-out block for Rules. Rules are always-loaded context, not an invoked component, so neither convention applies here, and this guide says so plainly rather than inventing one. A Hive rule file (`.mdc`, `CLAUDE.md` snippet, or `AGENTS.md` section) should stay short, scoped, and point at the relevant Stinger for anything procedural. Working template: `../references/templates/rules/reference-rules.mdc` plus the CLAUDE.md/AGENTS.md equivalents documented inline as comments in that same file.

---

# Plugins

## Claude Code

**Where it goes.** `.claude-plugin/plugin.json` (manifest only). `skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json` all live at the plugin root, never nested inside `.claude-plugin/`.

**Field table.**

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Unique ID and skill namespace (`/plugin-name:skill`) |
| `description` | No | Shown in plugin manager |
| `version` | No | If set, users only get updates on version bump (except `command` sources) |
| `author` | No | Attribution object |

[raw/claude-code--plugins--plugins-official-docs.md]

**Minimal working example.**

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```
[raw/claude-code--plugins--plugins-official-docs.md]

**Gotchas.**
- The single most common mistake: only `plugin.json` goes inside `.claude-plugin/`. `commands/`, `agents/`, `skills/`, `hooks/` all live at the plugin root. Nesting them inside `.claude-plugin/` breaks discovery.
- Standalone project/user agents override same-named plugin agents. After migrating standalone `.claude/agents/` into a plugin, delete the originals, or the plugin copy is inert.
- Plugin skills are always namespaced (`plugin-name:skill-name`), so they never conflict the way agents can.
- A plugin shipping exactly one skill can put `SKILL.md` at the plugin root, but set `name` explicitly in frontmatter, since the fallback (install directory name) is an unstable version string for marketplace installs.
[raw/claude-code--plugins--plugins-official-docs.md, raw/claude-code--plugins--plugins-reference-official-docs.md]

## Cursor

**Where it goes.** Two competing formats. Agent Plugins standard: `plugin.json` at plugin root (skills + MCP servers only). Cursor Plugins: `.cursor-plugin/plugin.json` (skills, MCP, rules, agents, commands, hooks, variables).

**Field table (Cursor Plugins format).**

| Field | Required | Type | Notes |
|---|---|---|---|
| `name` | Yes | string | kebab-case, alphanumeric start/end |
| `description` | No | string | |
| `version` | No | string | semver |
| `author` | No | object | `name` required, `email` optional |
| `homepage`, `repository`, `license`, `keywords` | No | string/array | |
| `logo` | No | string | Relative path resolves to `raw.githubusercontent.com`, or an absolute URL |
| `rules`, `agents`, `skills`, `commands` | No | string or array | Overrides folder auto-discovery for that component type |
| `hooks` | No | string or object | |
| `mcpServers` | No | string, object, or array | Overrides default `mcp.json` discovery |
| `variables` | No | JSON Schema object | Names only, no secrets, set by admins in the dashboard |

[raw/cursor--plugins--plugins-reference.md]

**Minimal working example.**

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

**Gotchas.**
- A spec-conformant Agent Plugin (`plugin.json` at root, skills + MCP only) loads in Cursor unmodified. This is the actual cross-harness path, not the fuller Cursor Plugins format.
- Component auto-discovery: `skills/` (subdirs with `SKILL.md`), `rules/` (all `.md`/`.mdc`/`.markdown`), `agents/` (same), `commands/` (same plus `.txt`), `hooks/hooks.json`, `mcp.json`. An explicit manifest field replaces folder discovery for that type; the default folder is then not also scanned.
- Plugin `agents/` frontmatter is documented with only `name`/`description`, narrower than the standalone `.claude/agents/*.md` format. Whether the fuller field set (`model`, `readonly`, `is_background`) works inside a plugin is not confirmed in the research.
- Every `${VAR}` used in a plugin's `mcp.json` must be declared in `variables`, or the marketplace submission check fails.
[raw/cursor--plugins--plugins-reference.md]

## Codex

**Where it goes.** `.codex-plugin/plugin.json` at plugin root. `skills` field points at a skills directory, `mcpServers` at a `.mcp.json` bundle, `hooks` at `hooks/hooks.json` (auto-detected default if omitted).

**Field table.**

| Field | Notes |
|---|---|
| `name` | kebab-case, plugin identifier/namespace |
| `version`, `description` | Basic identity |
| `author.{name,email,url}`, `homepage`, `repository`, `license`, `keywords` | Publisher/discovery metadata |
| `skills` | Path to skills dir, `./`-prefixed |
| `mcpServers` | Path to `.mcp.json` bundle |
| `apps` | Path to `.app.json` connector references |
| `hooks` | Path(s) or inline object(s) |
| `interface.*` | `displayName`, `shortDescription`, `longDescription`, `developerName`, `category`, `capabilities`, URLs, `defaultPrompt` (array), `brandColor`, `composerIcon`, `logo`, `screenshots` |

[raw/codex--plugins--build-plugins.md]

**Minimal working example.**

```json
{ "name": "my-first-plugin", "version": "1.0.0", "description": "Reusable greeting workflow", "skills": "./skills/" }
```
with `skills/hello/SKILL.md`:
```md
---
name: hello
description: Greet the user with a friendly message.
---
Greet the user warmly and ask how you can help.
```
[raw/codex--plugins--build-plugins.md]

**Gotchas.**
- Codex uses TOML, not JSON, for MCP config. Pasting a Claude Code or Cursor-style `mcpServers` JSON block into `config.toml` silently fails. The correct root key is `mcp_servers` (underscore), not `mcp.servers` or `mcp-servers`.
- MCP does not work in Codex cloud as of the research date. Only the CLI, IDE extension, and desktop app read the shared local `config.toml`.
- Marketplace resolution: repo marketplace at `$REPO_ROOT/.agents/plugins/marketplace.json` (plugins under `$REPO_ROOT/plugins/`), personal at `~/.agents/plugins/marketplace.json`, and a legacy-compatible path at `$REPO_ROOT/.claude-plugin/marketplace.json` also read by the ChatGPT desktop app.
- Installing a plugin does not auto-trust its hooks. Non-managed command hooks still require explicit review via `/hooks`.
[raw/codex--plugins--build-plugins.md, raw/codex--plugins--mcp.md, raw/codex--plugins--hooks.md]

## Cowork

**Where it goes.** `.claude-plugin/plugin.json`, identical directory-layout rule to Claude Code: only `plugin.json` inside `.claude-plugin/`, everything else (`skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json`, `bin/`, `settings.json`) at plugin root.

**Field table.** Same schema as Claude Code's `plugin.json`. Only `name` is strictly required if a manifest is included (kebab-case, no spaces). Unrecognized top-level fields are ignored, so `plugin.json` can double as other manifest formats.

[raw/cowork--multiple--code-claude-docs-plugins-reference.md]

**Minimal working example.**

```json
{
  "name": "plugin-name",
  "description": "Brief plugin description",
  "version": "1.2.0",
  "skills": "./skills/"
}
```
Adapted from the full schema in [raw/cowork--multiple--code-claude-docs-plugins-reference.md], which also documents `displayName`, `author`, `homepage`, `repository`, `license`, `keywords`, `metadata`, `commands`, `agents`, `hooks`, `mcpServers`, `outputStyles`, `lspServers`, `experimental.{themes,monitors}`, `dependencies`.

**Gotchas.**
- A plugin built for Claude Code works in Cowork and vice versa, per Anthropic's own framing: "Built for Claude Cowork, also compatible with Claude Code." The manifest and layout rule are shared.
- Skills and connectors work across chat and Cowork; agents and hooks are Cowork-only and appear grayed out in chat.
- Plugin limits: 200 MB uncompressed package, 5,000 files per package, 512 MB marketplace archive, 500 plugins per marketplace, 25 marketplaces addable.
- Plugins may bundle local MCP servers that run on the user's machine with the same permissions as any other program. Only install from trusted sources; Enterprise admins can restrict this or disable local MCP servers entirely.
[raw/cowork--plugins--code-claude-docs-discover-plugins.md, raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md]

## Hive conventions: plugins

No dedicated Critical Directive or close-out block applies to the plugin manifest itself; the build plan defines those conventions for Skills, Agents, and dev-focused Commands, not for `plugin.json`. What matters for a Hive plugin bundle is that every Bee and Stinger packaged inside it still carries its own convention (agent Critical Directive on Bees, Critical Directive on Stingers) exactly as if it were standalone. The plugin wrapper is a distribution mechanism, not a component with its own Hive-specific closing block. Working template: `../references/templates/plugins/reference-plugin/` (folder skeleton: `.claude-plugin/plugin.json` plus `skills/`, `agents/`, `hooks/`, `.mcp.json` stubs).

---

# Commands

## Claude Code

**Where it goes.** `.claude/commands/<name>.md`.

**Field table.** None required, and a bare markdown prompt works. But files in `.claude/commands/` support the same frontmatter as skills (`description`, `argument-hint`, and the rest of the skill frontmatter set), so a legacy command can carry metadata if you want it. If a skill and a `.claude/commands/` file share a name, the skill wins.

[raw/claude-code--skills--skills-official-docs.md]

**Minimal working example.** The simplest Claude Code command is a bare prompt with no frontmatter, identical in shape to Cursor's legacy commands below (add skill-style frontmatter on top when you need it):

```markdown
# Code review
Review the current changes with these criteria:
## Security
- Check for hardcoded secrets or credentials
- Look for SQL injection or XSS vulnerabilities
Provide specific line numbers and code suggestions for each issue found.
```
Example content reused from the Cursor legacy-command example in [raw/cursor--multiple--theodoroskokosioulis-complete-guide.md]. Note the frontmatter difference between the harnesses: Claude Code's `.claude/commands/` files support the full skill frontmatter set [raw/claude-code--skills--skills-official-docs.md], while Cursor's legacy commands document no required frontmatter at all [raw/cursor--commands--learncursor-commands-to-skills.md].

**Gotchas.**
- Commands have been merged into skills. `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and behave the same; existing `.claude/commands/` files keep working, but skills are the modern path.
- A command/skill invocation is only recognized at the start of a message; trailing text becomes its arguments.
- The official `/docs/en/slash-commands` URL now redirects to the skills page, which is itself evidence of the merge.
[raw/claude-code--skills--skills-official-docs.md, raw/claude-code--commands--slash-commands-official-docs.md, raw/claude-code--commands--commands-reference-official-docs.md]

## Cursor

**Where it goes.** `.cursor/commands/` (project) or `~/.cursor/commands/` (global). Team-managed via dashboard.

**Field table.** None required, just the prompt.

[raw/cursor--commands--learncursor-commands-to-skills.md]

**Minimal working example.**

```markdown
# Code review
Review the current changes with these criteria:
## Security
- Check for hardcoded secrets or credentials
- Look for SQL injection or XSS vulnerabilities
Provide specific line numbers and code suggestions for each issue found.
```
[raw/cursor--multiple--theodoroskokosioulis-complete-guide.md]

**Gotchas.**
- The standalone commands page is gone from Cursor's docs as of July 2026. Existing `.cursor/commands/*.md` files still load and work; new workflows should be skills.
- `/migrate-to-skills` (Cursor 2.4+) converts slash commands into skills with `disable-model-invocation: true`, which preserves human-only invocation.
- The most-skipped authoring step: telling the command how to answer (for example, "reply with only the PR link"). Skipping it produces verbose, unpredictable output.
- Invocation is human-only via `/command-name`; commands can be chained (`/commit and /pr these changes to fix DX-523`).
[raw/cursor--commands--learncursor-commands-to-skills.md, raw/cursor--multiple--theodoroskokosioulis-complete-guide.md]

## Codex

**Where it goes.** `$CODEX_HOME/prompts` (default `~/.codex/prompts`). Only top-level `.md` files load; subdirectories are not scanned. Filename minus `.md` becomes the command name, invoked `/prompts:<name>`.

**Field table.**

| Field | Notes |
|---|---|
| `description` | Shown in the popup |
| `argument-hint` | Documents `KEY=<value>` params |
| `$NAME` | Named arg, `[A-Z][A-Z0-9_]*`, invoked `key=value` (shlex-parsed) |
| `$1`-`$9`, `$ARGUMENTS` | Positional args, joined by space |
| `$$` | Literal `$` |

[raw/codex--commands--custom-prompts.md]

**Minimal working example.**

```md
---
description: Prep a branch, commit, and open a draft PR
argument-hint: [FILES=<paths>] [PR_TITLE="<title>"]
---
Create a branch named `dev/<feature_name>` for this work.
If files are specified, stage them first: $FILES.
Commit the staged changes with a clear message.
Open a draft PR on the same branch. Use $PR_TITLE when supplied; otherwise write a concise summary yourself.
```
Invoke: `/prompts:draftpr FILES="src/pages/index.astro" PR_TITLE="Add hero animation"`. [raw/codex--commands--custom-prompts.md]

**Gotchas.**
- Custom prompts are deprecated. Maintainer confirmation on GitHub issue #7047: "We have decided to deprecate support for custom prompts. We recommend switching to skills, which provide all of the functionality of custom prompts and more." This format is documented here for migration and portability only.
- Restart Codex after editing prompt files; changes are not picked up live.
- Known bug (issue #7047): `$ARGUMENTS` fails to resolve when a pasted argument collapses into a `[Pasted Content N chars]` composer indicator. Known bug (issue #15941, secondhand): prompts reportedly not appearing after some CLI updates.
[raw/codex--commands--custom-prompts.md]

## Cowork

**Where it goes.** Plugin `commands/<name>.md` (flat, legacy shape). No standalone `.claude/commands/` surface is exposed to the end user.

**Field table.** Same flat-file shape as Claude Code's legacy commands, no required frontmatter.

[raw/cowork--multiple--code-claude-docs-plugins-reference.md]

**Minimal working example.** Same content shape as the Claude Code/Cursor legacy command example above; Cowork's plugin `commands/` format is documented as identical to Claude Code's legacy shape.

**Gotchas.**
- This is the one place where the "legacy is worse" story inverts. Plugin `skills/*/SKILL.md` entries appear correctly in the Cowork `/` menu under a "Plugin name" section, but clicking them or typing `/skill-name` returns `Unknown skill: plugin-name:skill-name` (GitHub issue #46079, filed 2026-04-10, closed as duplicate of #41842). Only `anthropic-skills:*` skills reliably work via the Skill tool as of the research date.
- Workaround documented in the bug report: add a skills table to the plugin's CLAUDE.md mapping trigger phrases to file paths, so Claude reads the `SKILL.md` directly via the Read tool when the Skill tool fails. This adds a retry step to every invocation.
- The CLI-side version of this same bug class (#41842) was fixed in Claude Code CLI v2.1.98; Cowork's separate resolution path has its own recurrence of it.
- Practical consequence for Hive authoring: until this is fixed, prefer packaging a Hive command as a plugin `commands/<name>.md` file for reliable slash invocation in Cowork, even though `skills/` is the officially recommended format going forward.
[raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md]

## Hive conventions: commands

Every Hive command loads beekeeper-suit first, before anything else. Argument handling follows the `$ARGUMENTS`/`$1` family where the harness supports it (Claude Code, Codex custom prompts). Development-focused commands end with the Ship Gate close-out block: security-stinger, then quality-stinger, then github-repo-health-stinger, in that order, reporting to the library directory after each pass, resolving medium-or-higher findings and re-evaluating before moving on. github-repo-health-stinger runs at orchestrator level. The user reviews every report and approves before commit or push. Full template with the beekeeper-suit load step and close-out block spelled out: `../references/templates/commands/reference-commands.md`.

---

# Agents

## Claude Code

**Where it goes.** `.claude/agents/` (project, discovered walking up to repo root, closest-to-cwd wins on name collision), `~/.claude/agents/` (user), managed settings `.claude/agents/` (org, highest priority), plugin `agents/` (namespaced `plugin-name:agent-name`, lowest priority).

**Field table.**

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | lowercase + hyphens, unique, can't contain `:` |
| `description` | Yes | When Claude should delegate here |
| `tools` | No | Inherits all subagent-available tools if omitted |
| `disallowedTools` | No | Removes from inherited/specified list |
| `model` | No | `sonnet`, `opus`, `haiku`, `fable`, full model ID, or `inherit` (default) |
| `permissionMode` | No | `default`/`manual`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`; ignored for plugin agents |
| `maxTurns` | No | Cap on agentic turns |
| `skills` | No | Preloads full skill content (not just description) at startup |
| `mcpServers` | No | Server name ref or inline config; ignored for plugin agents |
| `hooks` | No | Scoped to this subagent; ignored for plugin agents |
| `memory` | No | `user`, `project`, or `local`, persistent cross-session learning |
| `background` | No | Force background even if Claude requests foreground |
| `effort` | No | `low`/`medium`/`high`/`xhigh`/`max` |
| `isolation` | No | `worktree`, isolated git worktree, auto-cleaned if no changes |
| `color` | No | `red`/`blue`/`green`/`yellow`/`purple`/`orange`/`pink`/`cyan` |
| `initialPrompt` | No | Exact behavior not fully captured in the research |

[raw/claude-code--agents--sub-agents-official-docs.md, raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md]

**Minimal working example.**

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```
[raw/claude-code--agents--sub-agents-official-docs.md]

**Gotchas.**
- Plugin agents support only a subset of fields: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation`. `hooks`, `mcpServers`, `permissionMode` are dropped for security. Copy the file into `.claude/agents/` if you need those.
- Standalone project/user agents override same-named plugin agents entirely. Duplicate `name` within the same directory tree resolves by undocumented filesystem read order; `/doctor` flags duplicates.
- Explore and Plan (built-in agents) skip CLAUDE.md and parent git status for speed. Every other subagent, built-in or custom, loads both.
- Subagents receive only their system prompt body plus basic environment, not the full Claude Code system prompt.
[raw/claude-code--agents--sub-agents-official-docs.md, raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md]

## Cursor

**Where it goes.** `.claude/agents/` (project), `~/.claude/agents/` (user). Fallback reads: `.claude/agents/` and `.codex/agents/` (project), `~/.claude/agents/` and `~/.codex/agents/` (user).

**Field table.**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | No | from filename | lowercase, hyphens |
| `description` | string | No | (none) | Drives delegation decisions |
| `model` | string | No | `inherit` | `inherit` or specific model ID, supports bracketed params like `[effort=high]` |
| `readonly` | boolean | No | `false` | No file edits or state-changing commands |
| `is_background` | boolean | No | `false` | Non-blocking |

[raw/cursor--agents--subagents-docs.md]

**Minimal working example.**

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

**Gotchas.**
- Because Cursor reads `.claude/agents/` and `.codex/agents/` directly as fallback locations, a Claude Code-shaped agent file usually works in Cursor with zero changes, so long as project subagents win on name conflicts (`.cursor/` beats `.claude/`/`.codex/` when both exist).
- Since Cursor 2.5, subagents can spawn child subagents, but a child-of-a-subagent cannot spawn further. Nesting cap is 2 levels below the main agent.
- Avoid dozens of vague generic subagents and 2,000-word prompts. Start with 2-3, invest in a sharp `description` since that drives delegation.
- Plugin-context agent frontmatter documents only `name`/`description`. Whether `model`/`readonly`/`is_background` also work inside a plugin is unconfirmed.
[raw/cursor--agents--subagents-docs.md, raw/cursor--plugins--plugins-reference.md]

## Codex

**Where it goes.** No filesystem subagent-definition format is documented in the research. Configuration lives in `config.toml` under `agents.<role>.description` and `agents.<role>.config_file` (relative paths resolve from the declaring config file).

**Field table.**

| Key | Notes |
|---|---|
| `agents.enabled` | Turns the subsystem on |
| `agents.max_concurrent_threads_per_session` | Legacy alias `agents.max_threads` |
| `agents.default_subagent_model` | Default model for delegated roles |
| `agents.default_subagent_reasoning_effort` | Default effort level |
| `agents.interrupt_message` | Message shown when interrupting a subagent |
| `agents.<role>.description` | Per-role description |
| `agents.<role>.config_file` | Points at a role-specific config file, whose internal shape is not documented in the research |

[raw/codex--rules--config-reference.md]

**Minimal working example.** Constructed from the documented key names, since the research does not include a full worked `config.toml` agent-role example:

```toml
[agents.reviewer]
description = "Reviews diffs for security issues before merge"
config_file = "agents/reviewer.toml"
```
This is inferred from documented key names, not a quoted example. The internal shape of `reviewer.toml` (what fields it accepts, whether it mirrors a system prompt file) is a documented gap in the research.
[raw/codex--rules--config-reference.md]

**Gotchas.**
- This is the weakest-documented corner of the whole matrix. Three delegation mechanisms exist (`codex exec` for non-interactive scripting, in-session subagents, `codex cloud`), but none of them ship a file-based per-agent definition format comparable to Claude Code's or Cursor's markdown-plus-frontmatter subagent files.
- MCP-backed skill dependencies for a subagent's tooling are declared in `agents/openai.yaml`, not in the agent's own config, per the customization overview.
- `codex exec` defaults to a read-only sandbox. Automation should set explicit least privilege (`--sandbox workspace-write`) rather than relying on `--full-auto`, which is deprecated.
[raw/codex--multiple--customization-overview.md, raw/codex--agents--noninteractive-exec.md]

## Cowork

**Where it goes.** No user-facing `.claude/agents/` surface. Agents reach Cowork sessions only through installed plugins (`agents/<name>.md`) or Claude's own automatic subagent delegation during a task.

**Field table.** Plugin agent frontmatter subset: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (only valid value `"worktree"`). `hooks`, `mcpServers`, `permissionMode` are silently ignored.

[raw/cowork--multiple--code-claude-docs-plugins-reference.md, raw/cowork--agents--code-claude-docs-sub-agents.md]

**Minimal working example.**

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
[raw/cowork--agents--code-claude-docs-sub-agents.md]

**Gotchas.**
- This file, once shipped in a plugin, is identical to a Claude Code plugin agent file. Author once, use in both, since the field subset is the same.
- Agents appear in the @-mention typeahead under their scoped name (`my-plugin:code-reviewer`) once the plugin is enabled. There is no other way to reach an agent in Cowork.
- Cowork's official documentation only describes "sub-agent coordination" as a first-class user-facing capability. No documented Cowork-native equivalent exists for agent view, agent teams, or dynamic workflows.
[raw/cowork--agents--code-claude-docs-sub-agents.md, raw/cowork--agents--support-get-started-cowork.md]

## Hive conventions: agents

Every Bee file carries the agent Critical Directive: load your core Stinger now, before planning or execution (`[stinger-name](../skills/path)`), read every file in it, supplement via internet or knowledge base search if that is insufficient, and list related Stingers as markdown links. A dev-focused Bee ends with the Ship Gate close-out block (same sequence as Commands above: security-stinger, quality-stinger, github-repo-health-stinger, reporting to the library directory, resolving medium-or-higher findings, user approval before commit or push). Bees always pair with Stingers; the only exceptions in the Hive are `beekeeper-suit`, `queen-bee-stinger`, and `get-started-stinger`, which operate at orchestrator level with no paired agent. Full template: `../references/templates/agents/reference-agents.md`.

---

# Skills

## Claude Code

**Where it goes.** `~/.claude/skills/<name>/SKILL.md` (personal), `.claude/skills/<name>/SKILL.md` (project, nested dirs load lazily and register as directory-qualified names), `<plugin>/skills/<name>/SKILL.md` (plugin, namespaced), enterprise via managed settings.

**Field table.** Only `description` is recommended/required. Full optional set, all fields optional:

| Field | Notes |
|---|---|
| `name` | Defaults to directory name; for plugin skills sets the last command segment |
| `description` | Combined with `when_to_use`, truncated at 1,536 chars in listing |
| `when_to_use` | Supplementary trigger text |
| `argument-hint`, `arguments` | Named positional args for `$name` substitution |
| `disable-model-invocation` | bool, `true` blocks auto-trigger, invoke only via `/name` |
| `user-invocable` | bool, default `true` |
| `allowed-tools` | Space/comma/YAML list, pre-approved for the invoking turn only |
| `disallowed-tools` | Denylist |
| `model` | Alias, full ID, or `inherit` |
| `effort` | `low`\|`medium`\|`high`\|`xhigh`\|`max` |
| `context` | `fork` runs the skill in its own subagent |
| `agent` | Subagent type when `context: fork` |
| `background` | bool, with `fork`, default `true` |
| `hooks` | Lifecycle hooks scoped to this skill |
| `paths` | Glob activation scoping |
| `shell` | `bash`\|`powershell` |
| `metadata` | Free-form YAML map |
| `license` | |
| `compatibility` | String, max 500 chars |

[raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md]

**Portability-critical rule.** Outside Claude Code (claude.ai uploads, Skills API, `package_skill.py` packaging, and therefore Cowork account-synced skills), only six fields are allowed: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other field causes a hard error: "Unexpected key(s) in SKILL.md frontmatter." Claude Code accepts all fields above, so spec-compliant six-field frontmatter loads everywhere. This is why every Hive `SKILL.md` uses only the six spec fields as its baseline.
[raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md]

**Minimal working example.**

```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```
[raw/claude-code--skills--skills-official-docs.md]

**Gotchas.**
- Boolean fields (like `disable-model-invocation`) accept `yes`/`no`/`on`/`off`/`1`/`0` in any letter case, in addition to `true`/`false` (v2.1.218+ for plugin skills/commands).
- Skill bodies stay in context across turns once loaded. Every line is a recurring token cost, so state what to do, not how or why.
- Name-conflict resolution: enterprise beats personal beats project beats bundled; any of these beats a same-named bundled skill; plugin skills are always namespaced so they never conflict; a skill beats a same-named `.claude/commands/` file; any local or plugin skill beats a same-named claude.ai-synced skill.
- A community source (agentskills.io breakdown) claims five non-negotiable fields including a 1,024-char description cap and `version`/`author`/`triggers`. The raw file itself flags this as describing the general agentskills.io spec, not Claude Code's minimum. Prefer the official-docs source: only `description` is truly required in Claude Code.
[raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md, raw/claude-code--skills--agentskills-io-production-guide.md]

## Cursor

**Where it goes.** `.agents/skills/` and `.claude/skills/` (project), `~/.agents/skills/` and `~/.claude/skills/` (user). Cross-harness fallback also reads `.claude/skills/`, `.codex/skills/`, and their `~/` equivalents.

**Field table.**

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Lowercase/numbers/hyphens, **must match the parent folder name exactly** |
| `description` | Yes | What plus when, the agent reads this for relevance |
| `paths` | No | Glob(s) scoping to matching files, comma-separated string or list, unset means always available |
| `disable-model-invocation` | No | `true` means only via explicit `/skill-name`, never auto-loaded |
| `metadata` | No | Arbitrary key-value map |

Legacy `globs` field still works as a fallback but new skills should use `paths`.
[raw/cursor--skills--skills-docs.md]

**Minimal working example.**

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
[raw/cursor--skills--skills-docs.md]

**Gotchas.**
- `name` must exactly match its containing folder. A mismatch breaks discovery; this is the single most common Cursor skill-authoring mistake.
- Skills roots are walked recursively; category subfolders are purely organizational, identity comes from the immediate folder containing `SKILL.md`, not the subfolder path.
- Progressive disclosure: the agent holds only name plus description at boot, loading full content only when it reaches for the skill. Rules, by contrast, are paid for on every turn they're in scope. This is the core reason to prefer a skill over an always-on rule for anything long.
- Plugin-context skill frontmatter documents only `name`/`description`, narrower than this full schema. The dedicated Skills reference above is authoritative for a standalone `SKILL.md`.
[raw/cursor--skills--skills-docs.md, raw/cursor--commands--learncursor-commands-to-skills.md, raw/cursor--plugins--plugins-reference.md]

## Codex

**Where it goes.** `$CWD/.agents/skills` up through `$REPO_ROOT/.agents/skills` (scanned in every directory in between, REPO scope), `$HOME/.agents/skills` (USER scope), `/etc/codex/skills` (ADMIN scope), bundled with Codex (SYSTEM scope, e.g. `skill-creator`).

**Field table.** `name` and `description` required minimum. Optional `agents/openai.yaml` sidecar:

| Key | Notes |
|---|---|
| `interface.display_name`, `interface.short_description`, `interface.brand_color`, `interface.default_prompt` | Desktop-app UI metadata |
| `policy.allow_implicit_invocation` | bool, default `true`; `false` disables auto-selection, explicit `$skill` still works |
| `dependencies.tools` | Array of MCP tool dependencies (`type: "mcp"`, `value`, `transport`, `url`) |

[raw/codex--skills--build-skills.md]

**Minimal working example.**

```md
---
name: commit
description: Stage and commit changes in semantic groups. Use when the user wants to commit, organize commits, or clean up a branch before pushing.
---
1. Do not run `git add .`. Stage files in logical groups by purpose.
2. Group into separate commits: feat, test, docs, refactor, chore.
3. Write concise commit messages that match the change scope.
4. Keep each commit focused and reviewable.
```
Adapted from [raw/codex--skills--build-skills.md, raw/codex--multiple--customization-overview.md] (original numbers arrow-separated commit types; rewritten here as a comma list to avoid non-hyphen dash characters).

**Gotchas.**
- Codex loads only name, description, and file path for every discoverable skill up front, capped at 2% of the model's context window, or 8,000 characters when the context window is unknown. If many skills are installed, Codex shortens descriptions first, then may omit skills entirely, with a warning. Front-load the key use case and trigger words in `description` so matching still works if it gets shortened.
- Repo-scoped skills moved from `.codex/skills/` to `.agents/skills/` (PR #10317) to align with the shared cross-vendor `.agents/` convention. The old path still loads but is deprecated and slated for removal.
- Same-`name` skills in different scope locations are not merged. Both appear in selectors, with no override.
- Codex scans `.agents/skills` in every directory from cwd up to the repo root, not just root and cwd, unlike a typical single-location lookup.
[raw/codex--skills--build-skills.md]

## Cowork

**Where it goes.** No local directory read by Cowork sessions. Skills are enabled for the claude.ai account and synced at session start. Cloud sessions additionally load project skills committed to the cloned repo's `.claude/skills/`.

**Field table.**

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Human-friendly, 64 characters max |
| `description` | Yes | **200 characters max** per the official support article (a community source gives a looser ~1,024 figure; prefer 200, see Conflicts in `harness-support-matrix.md`) |
| `dependencies` | No | Software packages required, e.g. `python>=3.8, pandas>=1.5.0` |

Additional naming rules (community source): kebab-case; cannot include "claude" or "anthropic" (reserved); no XML angle brackets anywhere in frontmatter (security restriction).
[raw/cowork--skills--support-create-custom-skills.md, raw/cowork--skills--community-ryanandmatt-cowork-skills.md]

**Minimal working example.**

```
## Metadata
name: Brand Guidelines
description: Apply Acme Corp brand guidelines to all presentations and documents

## Overview
This skill provides Acme Corp's official brand guidelines for creating consistent, professional materials.

## Brand Colors
Our official brand colors are:
- Primary: #FF6B35 (Coral)
- Secondary: #004E89 (Navy Blue)

## When to Apply
Apply these guidelines whenever creating:
- PowerPoint presentations
- Word documents for external sharing
```
Trimmed from the full worked example in [raw/cowork--skills--support-create-custom-skills.md].

**Gotchas.**
- Every `` !`command` `` line in a skill body is replaced with a `disableSkillShellExecution` placeholder in a Cowork session. Shell-command dynamic context injection does not execute. Write the skill to have Claude run the equivalent command itself via a tool call, never rely on inline shell injection.
- The `.skill` zip must contain the skill folder as its own root, not a subfolder. `my-skill.zip` containing `my-skill/SKILL.md` is correct; files directly at the zip root is not.
- Known bug (GitHub issue #47016, closed as duplicate of #40231): the "Save skill" install pipeline can silently truncate `SKILL.md` on Windows, with no error shown, independent of file size. Related issue #51435 covers files over 99 KB leaving a null-byte tail on re-upload. If an installed skill behaves oddly, check line counts against the source `.skill` zip before assuming the content itself is wrong.
- Skills stack. Cowork applies every relevant active skill to a task at once, not just the single best match, so a Hive skill's `description` needs to stay precise enough not to false-trigger alongside others.
[raw/cowork--skills--code-claude-docs-skills.md, raw/cowork--skills--support-create-custom-skills.md, raw/cowork--skills--github-issue-skill-truncation-bug.md]

## Hive conventions: skills

Every Hive Stinger's `SKILL.md` ends with the Critical Directive: read every file and all context inside the skill first; if that is insufficient, search the internet, the knowledge base, and other resources before proceeding; list related Stingers as markdown links with descriptions. A dev-focused Stinger additionally ends with the Ship Gate close-out block (same sequence described under Commands and Agents above). Stingers always pair with Bees, with the same three orchestrator-level exceptions (`beekeeper-suit`, `queen-bee-stinger`, `get-started-stinger`). Author every Hive `SKILL.md` to the six spec fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) as the baseline, with any harness-specific extension documented as an opt-in block, never mixed into the baseline file. Full templates: `../references/templates/skills/harness-specific-reference.md` for the field-support-per-harness reference, and `../references/templates/skills/reference-template/` for the working folder skeleton (`SKILL.md` plus `references/` and `scripts/` stubs) with the Critical Directive and close-out block already in place.

---

## Summary: what to author once

| Type | Widest-reach single file | Reaches |
|---|---|---|
| Rules | `AGENTS.md` | Codex natively, Cursor as one of four rule types, Claude Code via `@AGENTS.md` import. Not Cowork (no rules-file surface) |
| Plugins | Agent Plugins `plugin.json` (skills + MCP only) | Cursor natively; covers the subset Codex and Cowork also support. Full-fidelity Claude Code/Cowork reach needs the separate `.claude-plugin/plugin.json` |
| Commands | None cleanly. Author as a skill with `disable-model-invocation: true` where supported | Falls back to a flat legacy-command copy where a harness's skill-slash-command path is broken (currently Cowork, bug #46079) |
| Agents | Plugin-agent field subset (`name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation: worktree`) | Claude Code and Cowork identically via a plugin; Cursor via its `.claude/agents/` fallback read with zero changes; not Codex (no documented file format) |
| Skills | Six spec fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) | Claude Code, Cursor, Codex, and Cowork (via claude.ai sync), plus claude.ai upload and the Skills API |
