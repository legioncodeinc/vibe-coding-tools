# Harness support matrix

Decision-grade reference for where the five Hive component types (Rules, Plugins, Commands, Agents, Skills) stand across the four harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork). Every claim traces to `references/research/distilled-research-articles.md`, which itself cites `raw/` sources. Nothing here comes from training data. Where the distilled doc flags a gap or a source conflict, that gap is stated here, not smoothed over.

For the full authoring procedure (complete field tables, worked examples, gotchas) see `per-type-per-harness-specific-guide.md` in this same folder. This file is the map; that file is the manual.

## Hive term mapping

Hive naming is not harness naming. Use this table to translate before reading further.

| Hive term | Generic component type | Covered in section |
|---|---|---|
| Beekeeper and Tools | Commands | Commands |
| Bees | Agents (subagents) | Agents |
| Stingers | Skills | Skills |
| Repo-wide conventions | Rules | Rules |
| Bundled Bee + Stinger distribution | Plugins | Plugins |
| The Hive (whole framework) | (none) | Orchestrator level; see `beekeeper-suit`, `queen-bee-stinger`, and `get-started-stinger`, with no single generic-component equivalent |

## How to read this matrix

Each component section below has three parts: an **exact locations** table (every path a harness reads, with scope), a **format/precedence/deprecation** table (what goes in the file and which copy wins), and a **portability path** paragraph (what to author once to reach the most harnesses). The master matrix is the fast lookup; the per-component sections are where the actual paths and field names live.

---

## Master matrix

| Component | Harness | Supported | Native format | Status |
|---|---|---|---|---|
| Rules | Claude Code | Yes | `CLAUDE.md` + `.claude/rules/*.md` (optional `paths` frontmatter) | native |
| Rules | Cursor | Yes | `.cursor/rules/*.mdc` (frontmatter) + `AGENTS.md` (plain) | native |
| Rules | Codex | Yes | `AGENTS.md` (plain markdown) + `config.toml` | native |
| Rules | Cowork | Yes, non-file | Global instructions / Folder instructions, set in-app | native, no committed-file format |
| Plugins | Claude Code | Yes | `.claude-plugin/plugin.json` | native |
| Plugins | Cursor | Yes | `plugin.json` (Agent Plugins standard) or `.cursor-plugin/plugin.json` (Cursor Plugins) | native, dual-format |
| Plugins | Codex | Yes | `.codex-plugin/plugin.json` | native |
| Plugins | Cowork | Yes | `.claude-plugin/plugin.json` (shared with Claude Code) | native, shared format |
| Commands | Claude Code | Yes, legacy | `.claude/commands/<name>.md`, supports the same frontmatter as skills | legacy, superseded by skills |
| Commands | Cursor | Yes, legacy | `.cursor/commands/<name>.md`, no required frontmatter | legacy, superseded by skills via `/migrate-to-skills` |
| Commands | Codex | Yes, deprecated | `$CODEX_HOME/prompts/<name>.md` | deprecated, official guidance is "switch to skills" |
| Commands | Cowork | Yes, legacy but favored | Plugin `commands/<name>.md` (flat) | legacy, more reliable than plugin `skills/` for slash invocation (bug #46079) |
| Agents | Claude Code | Yes | `.claude/agents/<name>.md` (full frontmatter) | native |
| Agents | Cursor | Yes | `.claude/agents/<name>.md`, plus `.claude/agents/` and `.codex/agents/` fallback reads | native |
| Agents | Codex | Partial | `agents.<role>` keys in `config.toml`; no filesystem subagent-file format documented | native but config-only, file format is a research gap |
| Agents | Cowork | Via plugin only | Plugin `agents/<name>.md` (reduced field subset) | via-plugin-only, no user-facing `.claude/agents/` |
| Skills | Claude Code | Yes | `SKILL.md`, full Claude Code field set | native, primary extension mechanism |
| Skills | Cursor | Yes | `SKILL.md`, `name`/`description`/`paths`/`disable-model-invocation`/`metadata` | native |
| Skills | Codex | Yes | `SKILL.md`, `name` + `description` minimum | native, progressive-disclosure budget applies |
| Skills | Cowork | Yes, account-synced | `SKILL.md`, six spec fields only outside Claude Code | native, sourced from claude.ai sync not a local dir |

[raw/claude-code--rules--memory-official-docs.md, raw/cursor--rules--cursor-docs-rules.md, raw/codex--rules--agents-md-standard.md, raw/cowork--rules--support-claude-md-and-prompts.md, raw/claude-code--plugins--plugins-official-docs.md, raw/cursor--plugins--plugins-reference.md, raw/codex--plugins--build-plugins.md, raw/cowork--multiple--code-claude-docs-plugins-reference.md, raw/claude-code--skills--skills-official-docs.md, raw/cursor--skills--skills-docs.md, raw/codex--skills--build-skills.md, raw/cowork--skills--code-claude-docs-skills.md, raw/claude-code--agents--sub-agents-official-docs.md, raw/cursor--agents--subagents-docs.md, raw/cowork--agents--code-claude-docs-sub-agents.md]

---

## Rules

### Exact locations

| Harness | Path | Scope |
|---|---|---|
| Claude Code | `~/.claude/CLAUDE.md` | User, all projects |
| Claude Code | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Project, committed |
| Claude Code | `./CLAUDE.local.md` | Local, gitignored |
| Claude Code | Managed policy CLAUDE.md: macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux/WSL `/etc/claude-code/CLAUDE.md`, Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | Org-wide, IT-deployed |
| Claude Code | `.claude/rules/*.md` (recursive, optional `paths` frontmatter) | Project, topic files |
| Cursor | `.cursor/rules/*.mdc` (subfolders allowed) | Project |
| Cursor | `AGENTS.md` (project root, no frontmatter) | Project |
| Cursor | Team Rules (dashboard-managed) | Team/Enterprise |
| Cursor | User Rules (account-level, Agent/Chat only, not Inline Edit) | User, all projects |
| Codex | `~/.codex/AGENTS.md` | Global |
| Codex | `./AGENTS.md` | Project root |
| Codex | `<dir>/AGENTS.md` | Any nested directory |
| Codex | `AGENTS.override.md` (same dir; skips sibling `AGENTS.md` entirely) | Personal override |
| Codex | `~/.codex/config.toml` | User config |
| Codex | `.codex/config.toml` | Project config, trusted projects only |
| Cowork | Settings > Cowork > Global instructions | Every session, UI-set |
| Cowork | Folder instructions (auto-added when a local folder is selected on desktop) | Project/folder, UI-set or Claude-edited mid-session |

[raw/claude-code--rules--memory-official-docs.md, raw/cursor--rules--cursor-docs-rules.md, raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--config-basic.md, raw/cowork--agents--support-get-started-cowork.md]

### Format, precedence, deprecation

| Harness | Manifest/frontmatter format | Precedence | Deprecation status |
|---|---|---|---|
| Claude Code | Plain markdown; `.claude/rules/*.md` supports optional YAML `paths` frontmatter for glob-scoped loading | Files concatenate root→cwd (not override), `CLAUDE.local.md` appended after `CLAUDE.md` at each level; user-level `.claude/rules/` loads before project rules so project rules carry more weight; managed `claudeMdExcludes` can skip ancestor files by glob | Current, no deprecation. Claude Code reads `CLAUDE.md`, not `AGENTS.md`; bridge via `@AGENTS.md` import or a symlink |
| Cursor | `.mdc` YAML frontmatter: `description`, `globs`, `alwaysApply` | Team Rules → Project Rules → User Rules, all merge, earlier source wins on conflict; same-tier conflicts undefined (community convention: numbered filenames) | Legacy: single `.cursorrules` file at project root still works but is superseded by `.cursor/rules/*.mdc` |
| Codex | `AGENTS.md`: plain markdown, no frontmatter, no `@import`. `config.toml`: TOML | `config.toml`: CLI flags > project `.codex/config.toml` (root→cwd, closest wins, trusted only) > profile files > user config > system config > built-in defaults. `AGENTS.md`: **disputed**, see Conflicts section | Current, no deprecation. Untrusted projects skip all project-local `.codex/` layers entirely |
| Cowork | UI text field, no manifest, no frontmatter | Global instructions apply to every session; Folder instructions add project-specific context on top | Architecturally different, not a deprecation. Cowork does not read a project-root `CLAUDE.md` from disk the way the CLI does |

[raw/claude-code--rules--memory-official-docs.md, raw/cursor--rules--cursor-docs-rules.md, raw/cursor--rules--techsy-mdc-frontmatter.md, raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--config-basic.md, raw/cowork--rules--support-claude-md-and-prompts.md]

**Portability path.** `AGENTS.md` is the widest-reach baseline: read natively by Codex, read as one of Cursor's four rule types, and importable into Claude Code via `@AGENTS.md`. It reaches three of four harnesses with one file. Cowork has no rules-file surface at all. A Hive rules template can document the AGENTS.md/CLAUDE.md pairing, but Cowork rule content has to live in Global/Folder instructions set through the app, which is out of scope for a versioned file.

---

## Plugins

### Exact locations

| Harness | Path | Notes |
|---|---|---|
| Claude Code | `.claude-plugin/plugin.json` | Manifest only, never `commands/`/`agents/`/etc. inside it |
| Claude Code | `skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json` | All at plugin root |
| Cursor | `plugin.json` (plugin root) | Agent Plugins standard, skills + MCP only |
| Cursor | `.cursor-plugin/plugin.json` | Cursor Plugins, full component set |
| Cursor | `.cursor-plugin/marketplace.json` | Multi-plugin repo root, max 500 plugins |
| Codex | `.codex-plugin/plugin.json` | Manifest |
| Codex | `$REPO_ROOT/.agents/plugins/marketplace.json` | Repo marketplace, plugins under `$REPO_ROOT/plugins/` |
| Codex | `~/.agents/plugins/marketplace.json` | Personal marketplace, plugins under `~/.codex/plugins/` |
| Codex | `$REPO_ROOT/.claude-plugin/marketplace.json` | Legacy-compatible marketplace, also read by ChatGPT desktop app |
| Cowork | `.claude-plugin/plugin.json` | Same directory-layout rule as Claude Code |

[raw/claude-code--plugins--plugins-official-docs.md, raw/cursor--plugins--plugins-reference.md, raw/codex--plugins--build-plugins.md, raw/cowork--multiple--code-claude-docs-plugins-reference.md]

### Format, precedence, deprecation

| Harness | Manifest fields | Precedence | Deprecation status |
|---|---|---|---|
| Claude Code | `name` (required), `description`, `version`, `author` | Standalone project/user agents override same-named plugin agents; plugin skills are always namespaced (`plugin-name:skill-name`) so they never conflict | Current. `commands/` marked legacy in favor of `skills/` for new plugins |
| Cursor | Agent Plugins: open agent-plugins.org schema. Cursor Plugins: `name` required; `description`, `version`, `author`, `homepage`, `repository`, `license`, `keywords`, `logo`, component-path fields, `hooks`, `mcpServers`, `variables` optional | An explicit manifest field replaces folder discovery for that component type; multi-plugin repos resolve via `.cursor-plugin/marketplace.json`, per-plugin values win over marketplace entry | Current, launched Cursor 2.5 (Feb 17, 2026). A spec-conformant Agent Plugin loads in Cursor unmodified: this is the cross-harness path |
| Codex | `name` (kebab-case, required), `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, `skills`, `mcpServers`, `apps`, `hooks`, `interface.*` (display metadata) | Marketplace entry `policy.installation`/`policy.authentication` governs install behavior | Current. `openai/skills` examples repo deprecated in favor of `openai/plugins` |
| Cowork | Identical schema to Claude Code's `plugin.json`; only `name` strictly required if a manifest is present | Managed org-required plugins install automatically and can't be user-removed; auto-installed non-required plugins can be uninstalled | Current, research-preview launch Jan 30, 2026. "Built for Claude Cowork, also compatible with Claude Code" per Anthropic's own framing |

[raw/claude-code--plugins--plugins-reference-official-docs.md, raw/cursor--multiple--changelog-2-5-plugins-marketplace.md, raw/cursor--plugins--plugins-reference.md, raw/codex--plugins--build-plugins.md, raw/codex--skills--build-skills.md, raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--code-claude-docs-discover-plugins.md, raw/cowork--plugins--github-knowledge-work-plugins.md]

**Portability path.** The Agent Plugins standard (`plugin.json` at root, skills + MCP servers only) is the widest floor. It loads unmodified in Cursor and covers the skills/MCP subset that Codex and Cowork also support. For full-fidelity Claude ecosystem reach (Claude Code + Cowork, which share the exact same manifest and directory-layout rule), author `.claude-plugin/plugin.json` at root with components at plugin root. A plugin author targeting all four harnesses in one shot has to accept two manifests: one Claude-family (`.claude-plugin/plugin.json`) and one Cursor/Codex-family (`plugin.json` or `.cursor-plugin/plugin.json` / `.codex-plugin/plugin.json`), because none of the four manifest shapes is byte-identical across every harness.

---

## Commands

### Exact locations

| Harness | Path |
|---|---|
| Claude Code | `.claude/commands/<name>.md` |
| Cursor | `.cursor/commands/` (project) |
| Cursor | `~/.cursor/commands/` (global, community-documented [raw/cursor--multiple--theodoroskokosioulis-complete-guide.md]); Team Commands managed via the Cursor dashboard [raw/cursor--agents--changelog-2-0-composer-multiagent.md] |
| Codex | `$CODEX_HOME/prompts` (default `~/.codex/prompts`), top-level `.md` files only |
| Cowork | Plugin `commands/<name>.md` (flat, legacy shape); no standalone `.claude/commands/` exposed to the end user |

[raw/claude-code--skills--skills-official-docs.md, raw/cursor--commands--learncursor-commands-to-skills.md, raw/codex--commands--custom-prompts.md, raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md]

### Format, precedence, deprecation

| Harness | Manifest/frontmatter format | Precedence | Deprecation status |
|---|---|---|---|
| Claude Code | Supports the same frontmatter as skills; frontmatter optional, simplest form is a bare markdown prompt | If a skill and a `.claude/commands/` file share a name, the skill wins | Merged into skills. `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and behave the same; existing files keep working |
| Cursor | No required frontmatter, just the prompt body | `/command-name` invocation is human-only; commands can be chained (`/commit and /pr...`) | Legacy. Standalone commands page removed from docs as of July 2026; `/migrate-to-skills` converts slash commands into skills with `disable-model-invocation: true` |
| Codex | `description`, `argument-hint` frontmatter; `$NAME`/`$1`-`$9`/`$ARGUMENTS`/`$$` argument syntax | Restart Codex after editing prompt files; no directory precedence documented (single location) | Deprecated. Maintainer confirmation on GitHub issue #7047: "We have decided to deprecate support for custom prompts. We recommend switching to skills, which provide all of the functionality of custom prompts and more." |
| Cowork | Same flat-file shape as Claude Code's legacy commands | Plugin `skills/*/SKILL.md` entries appear in the `/` menu but as of GitHub issue #46079 return "Unknown skill" when invoked; `commands/` entries register reliably | Legacy by the general standard, but currently the **more reliable** path for slash invocation in Cowork due to bug #46079 (duplicate of CLI-side #41842, fixed there in v2.1.98 but recurring in Cowork's separate resolution path) |

[raw/claude-code--commands--slash-commands-official-docs.md, raw/cursor--commands--learncursor-commands-to-skills.md, raw/codex--commands--custom-prompts.md, raw/cowork--commands--github-issue-plugin-skills-slash-command-bug.md]

**Portability path.** There is no clean single-file portability story for commands: each harness is actively migrating commands into skills, and Cowork's live bug inverts the recommended direction (favor `commands/` over `skills/` there, for now). The Hive convention sidesteps this: author every Hive command as a skill with `disable-model-invocation: true` where the harness supports it, and keep the underlying instructions short enough that a flat legacy-command copy is a trivial fallback if a harness's skill-slash-command path is broken.

---

## Agents

### Exact locations

| Harness | Path | Scope |
|---|---|---|
| Claude Code | `.claude/agents/` (discovered walking up to repo root, closest-to-cwd wins) | Project |
| Claude Code | `~/.claude/agents/` | User, all projects |
| Claude Code | Managed settings `.claude/agents/` | Org-wide, highest priority |
| Claude Code | Plugin `agents/` (namespaced `plugin-name:agent-name`) | Plugin, lowest priority |
| Cursor | `.claude/agents/` | Project |
| Cursor | `~/.claude/agents/` | User, all projects |
| Cursor | `.claude/agents/` (fallback read) | Project, Claude-compat |
| Cursor | `.codex/agents/` (fallback read) | Project, Codex-compat |
| Cursor | `~/.claude/agents/`, `~/.codex/agents/` (fallback read) | User equivalents |
| Codex | `config.toml` `agents.<role>.description`/`.config_file` keys | No filesystem per-agent definition format documented |
| Cowork | Plugin `agents/<name>.md` | Only path into Cowork; no user-facing `.claude/agents/` |

[raw/claude-code--agents--sub-agents-official-docs.md, raw/cursor--agents--subagents-docs.md, raw/codex--rules--config-reference.md, raw/cowork--agents--code-claude-docs-sub-agents.md]

### Format, precedence, deprecation

| Harness | Frontmatter/config format | Precedence | Deprecation status |
|---|---|---|---|
| Claude Code | Full subagent frontmatter: `name`, `description` required; `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt` optional | Managed (1) > `--agents` CLI flag (2) > project `.claude/agents/` (3, closest-to-cwd wins) > user `~/.claude/agents/` (4) > plugin agents (5) | Current. Plugin agents support only a subset (`hooks`/`mcpServers`/`permissionMode` ignored for security) |
| Cursor | `name`, `description`, `model` (default `inherit`), `readonly`, `is_background` | Project subagents win on name conflicts; among project locations `.cursor/` beats `.claude/`/`.codex/` | Current, introduced Cursor 2.4 (Jan 22, 2026). Plugin-bundled agents document only `name`/`description` in the Plugins reference, narrower than the standalone format, unclear if the fuller set is supported |
| Codex | TOML config keys, not a per-agent markdown file: `agents.enabled`, `agents.max_concurrent_threads_per_session`, `agents.default_subagent_model`, `agents.default_subagent_reasoning_effort`, `agents.interrupt_message` | Three delegation mechanisms instead of a location hierarchy: `codex exec` (non-interactive), in-session subagents, `codex cloud` | Current, but this is a **research gap**: how an individual subagent's system prompt/tools are authored as a file was not captured |
| Cowork | Plugin agent frontmatter subset: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (`worktree` only). `hooks`, `mcpServers`, `permissionMode` silently ignored | Agents appear in the @-mention typeahead under scoped name (`my-plugin:agent-name`) once the plugin is enabled | Current, via-plugin-only by design, not a deprecation |

[raw/claude-code--agents--sub-agents-official-docs.md, raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md, raw/cursor--agents--subagents-docs.md, raw/codex--agents--noninteractive-exec.md, raw/cowork--agents--code-claude-docs-sub-agents.md]

**Portability path.** No single agent-definition file loads unmodified in all four harnesses. The closest thing to a floor is the plugin-agent field subset shared by Claude Code and Cowork (`name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation: worktree`): author to that subset and the same file works, unmodified, wherever a Hive plugin installs. Cursor requires its own file under `.claude/agents/` (though it will fall back to reading a `.claude/agents/` file directly, so a Claude-shaped agent file often "just works" in Cursor with zero changes). Codex has no documented file-based equivalent at all; a Codex Bee has to be expressed as `agents.<role>` config plus a referenced `config_file`, and that file's shape is undocumented in the current research.

---

## Skills

### Exact locations

| Harness | Path | Scope |
|---|---|---|
| Claude Code | `~/.claude/skills/<name>/SKILL.md` | Personal, all projects |
| Claude Code | `.claude/skills/<name>/SKILL.md` (nested dirs load lazily, get directory-qualified names) | Project |
| Claude Code | `<plugin>/skills/<name>/SKILL.md` | Plugin, namespaced |
| Claude Code | Enterprise via managed settings | Org-wide |
| Cursor | `.agents/skills/`, `.claude/skills/` | Project |
| Cursor | `~/.agents/skills/`, `~/.claude/skills/` | User, all projects |
| Cursor | `.claude/skills/`, `.codex/skills/` (fallback read) | Project, cross-harness |
| Cursor | `~/.claude/skills/`, `~/.codex/skills/` (fallback read) | User, cross-harness |
| Codex | `$CWD/.agents/skills` up to `$REPO_ROOT/.agents/skills` (scanned in every directory in between) | REPO |
| Codex | `$HOME/.agents/skills` | USER |
| Codex | `/etc/codex/skills` | ADMIN, machine-wide |
| Codex | Bundled with Codex (e.g. `skill-creator`) | SYSTEM |
| Cowork | claude.ai account, synced at session start (no local dir read) | Every session |
| Cowork | Cloud sessions additionally read repo `.claude/skills/` | Cloud sessions only |

[raw/claude-code--skills--skills-official-docs.md, raw/cursor--skills--skills-docs.md, raw/codex--skills--build-skills.md, raw/cowork--skills--code-claude-docs-skills.md]

### Format, precedence, deprecation

| Harness | Frontmatter fields | Precedence | Deprecation status |
|---|---|---|---|
| Claude Code | Only `description` is recommended/required. Full optional set: `name`, `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context` (`fork`), `agent`, `background`, `hooks`, `paths`, `shell`, `metadata`, `license`, `compatibility` | Enterprise > personal > project > bundled; any of these beats a same-named bundled skill; plugin skills always namespaced so never conflict; a skill beats a same-named `.claude/commands/` file; any local/plugin skill beats a same-named claude.ai-synced skill | Current, primary extension mechanism. **Outside Claude Code** (claude.ai uploads, Skills API, Cowork account sync) only the six Agent Skills spec fields are allowed: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other field is a hard packaging error |
| Cursor | `name` (required, **must match parent folder name**), `description` (required), `paths` (glob scoping, string or list), `disable-model-invocation`, `metadata`. Legacy `globs` still works as a fallback | Skills roots walked recursively; identity comes from the immediate folder containing `SKILL.md`, not subfolder nesting | Current, introduced Cursor 2.4. Plugin-context skill frontmatter documents only `name`/`description`, narrower than the full `SKILL.md` schema |
| Codex | `name` and `description` required minimum. Optional `agents/openai.yaml` sidecar for `interface.*` display metadata, `policy.allow_implicit_invocation`, `dependencies.tools` (MCP) | Same-`name` skills in different scope locations are **not merged**: both appear in selectors, no override | Current, but `.codex/skills/` (old repo-scope path) is deprecated in favor of `.agents/skills/` (still loads, slated for removal) |
| Cowork | Required: `name` (64 chars max), `description` (**200 chars max** per official support doc). Optional: `dependencies`. Outside Claude Code proper, only the six spec fields are legal | Skills stack: Cowork applies every relevant active skill to a task, not just one | Current. `.skill` zip must have the skill folder as its own root, not a subfolder. Every `` !`command` `` line in a skill body is replaced with a `disableSkillShellExecution` placeholder. Shell dynamic injection does not execute in Cowork |

[raw/claude-code--skills--skills-official-docs.md, raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md, raw/cursor--skills--skills-docs.md, raw/cursor--plugins--plugins-reference.md, raw/codex--skills--build-skills.md, raw/cowork--skills--code-claude-docs-skills.md, raw/cowork--skills--support-create-custom-skills.md, raw/cowork--skills--community-ryanandmatt-cowork-skills.md]

**Portability path.** This is the one component type with a real, documented, cross-harness open standard: Agent Skills (agentskills.io), consumed by Claude Code, Cursor, Codex, and (through claude.ai sync) Cowork, plus a longer list of third-party hosts the distilled doc doesn't verify field-by-field. The floor that survives everywhere, including claude.ai upload and Cowork packaging, is the **six spec fields**: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. This is the locked Hive decision: every `queen-bee-stinger` and Stinger `SKILL.md` uses only these six fields so one file loads in all four harnesses. Anything harness-specific (Claude Code's `context: fork`, Cursor's `paths`, Codex's `agents/openai.yaml`) goes in a documented opt-in extension block, never in the baseline file.

---

## Conflicts and open questions

Every source conflict the distilled research explicitly flags, plus the preferred official reading.

| Conflict | Sources | Preferred reading |
|---|---|---|
| **AGENTS.md concat-vs-closest.** The agents.md base-spec FAQ says "the closest AGENTS.md to the edited file wins... explicit user chat prompts override everything" (single-file selection). OpenAI's own Codex CLI docs, per community quotation, say Codex concatenates every AGENTS.md from Git root to cwd, joined by blank lines, with later (closer) files winning by appearing later in the combined prompt. | [raw/codex--rules--agents-md-standard.md, raw/codex--rules--agents-md-hierarchy-community.md] | Unresolved even upstream: open GitHub issue agentsmd/agents.md#53 records no resolution. For Hive authoring: assume Codex CLI's actual shipped behavior (concatenation, later-wins) since that's what a Codex session will do regardless of what the base spec says it should do. Don't rely on a subdirectory `AGENTS.md` silently overriding the root file elsewhere. Cursor and Claude Code don't implement Codex's nested-concatenation model, and a subdirectory-only `AGENTS.md` is invisible to them. |
| **AGENTS.md size cap.** One community source (agentconfig.ing) states the default is 64KB. A second (ccmd.dev) states the base-spec cap is 32 KiB. | [raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--agents-md-standard.md] | Unresolved in the raw research, no official-docs source settles it. Author Hive AGENTS.md content to stay comfortably under the stricter figure (32 KiB) so it's safe under either reading. |
| **Cowork skill description cap.** Official Cowork support article states 200 characters maximum for `description`. A community deep-dive gives a looser "under 1,024 characters" figure. | [raw/cowork--skills--support-create-custom-skills.md, raw/cowork--skills--community-ryanandmatt-cowork-skills.md] | Prefer the official support article: 200 characters. The Agent Skills spec elsewhere allows description up to 1,024 chars, so a description written for spec-six portability could still be too long for Cowork's stricter enforcement. Write Hive skill descriptions to fit inside 200 characters to be safe everywhere, even though the wider spec cap would tolerate more. |
| **Cursor `globs` type.** TECHSY (community) types `globs` strictly as a YAML list and warns brace-expansion syntax "can fail silently." Official Cursor docs and the official Plugins reference both show a working comma-separated string form. | [raw/cursor--rules--techsy-mdc-frontmatter.md, raw/cursor--rules--cursor-docs-rules.md, raw/cursor--plugins--plugins-reference.md] | Prefer official: both string and array are accepted. Treat the "list only" claim as unconfirmed, but avoid brace-expansion syntax (`{src,lib}/**/*.ts`) regardless, since even the source recommending strict lists flags it as risky. |
| **Cowork plugins in Chat.** One official doc states plugins "aren't used in Chat." A second, more specific and more recently dated official support article states plugins install and work "in chat on the web, the Chat tab in Claude Desktop, and Claude Cowork," with hooks and sub-agents specifically Cowork-only (grayed out in chat). | [raw/cowork--plugins--claude-docs-cowork-guide-plugins.md, raw/cowork--plugins--support-use-plugins-in-claude.md] | Prefer the more specific, more recent support article: skills work in both chat and Cowork; hooks and sub-agents are Cowork-only. |

**Gaps flagged as thin rather than papered over:**

- Codex has no documented file-based subagent-definition format (only `agents.<role>` config keys pointing at a `.config_file` of undocumented shape). [raw/codex--rules--config-reference.md, raw/codex--agents--noninteractive-exec.md]
- Cowork's raw sources never enumerate which hook event types actually fire inside a Cowork session versus being CLI-only, beyond "hooks are Cowork-only, not Chat." [raw/cowork--plugins--support-use-plugins-in-claude.md]
- The Claude Code `commands-reference-official-docs.md` fetch was contaminated with unrelated page content and cuts off after `/diff`. The full built-in command list past that point wasn't captured. [raw/claude-code--commands--commands-reference-official-docs.md]
- Claude Code's full `settings.json` key table cuts off mid-row at `autoCompactWindow`; a longer key list clearly exists but wasn't captured. [raw/claude-code--rules--settings-official-docs.md]
- Codex's `config.toml` reference captures only "the majority" of a 150+ key live page. [raw/codex--rules--config-reference.md]
- Codex hooks per-event field tables for `PostToolUse`, `PreCompact`/`PostCompact`, `UserPromptSubmit`, `SubagentStop`, and `Stop` were not captured. [raw/codex--plugins--hooks.md]
- Cursor's plugin `agents/` frontmatter is documented with only `name`/`description`, and the raw research doesn't clarify whether the fuller standalone-agent field set (`model`, `readonly`, `is_background`) is also honored inside a plugin. [raw/cursor--plugins--plugins-reference.md, raw/cursor--agents--subagents-docs.md]
- The subagent frontmatter table in the Claude Code base fetch cuts off mid-row at `initialPrompt`; the SUPPLEMENT refetch fills most of it in, but exact `initialPrompt` semantics are still light. [raw/claude-code--agents--sub-agents-official-docs.md, raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md]
