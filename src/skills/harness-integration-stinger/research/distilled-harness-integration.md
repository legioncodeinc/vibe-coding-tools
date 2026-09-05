# Distilled Research: Cross-Harness Capability Integration

This is the source-of-truth research for `harness-integration-stinger` in its general form: wiring one capability (a skill, an agent, a hook-driven behavior, an MCP-backed tool) across The Hive's four harnesses - Claude Code, Cursor, ChatGPT Codex, Claude Cowork.

Two source families feed this document:
- **Reused**: material already archived and fact-checked in `.claude/skills/queen-bee-stinger/references/research/distilled-research-articles.md` (the canonical four-harness research digest for the whole Hive). Cited as `queen-bee-stinger distilled-research-articles.md, <section>`.
- **New**: six sources archived directly into this stinger's own `research/external/`, covering ground the queen-bee-stinger digest doesn't (capability negotiation as a general mechanism, the Agent Skills spec itself, the AGENTS.md standard itself, and three community projects that had already solved "ship one capability across N harnesses" and documented their degradation model). Cited by filename.

The old Hivemind-specific research (`research/research-plan.md`, `research/research-summary.md`, `research/index.md`, `research/external/2026-06-16-*.md`) stays in place and is not superseded - it is the worked case study for one product's six-host integration, referenced from `examples/case-study-hivemind-six-host-installer.md`.

---

## 1. Per-harness component placement

Every harness has five component types with different names, different file locations, and different levels of maturity. This table is the map a reader needs before wiring anything.

| Component | Claude Code | Cursor | Codex | Cowork |
|---|---|---|---|---|
| **Rules** | `CLAUDE.md` (project/user/local) + `.claude/rules/*.md` (path-scoped via `paths` frontmatter) | `.cursor/rules/*.mdc` (four rule types: Project/User/Team/`AGENTS.md`) | `AGENTS.md` (root + nested, concatenated root→cwd) + `config.toml` | Global instructions + Folder instructions, set via app UI, not committed files |
| **Commands** | Merged into Skills; `.claude/commands/*.md` still works but skills are current | Merged into Skills; `.cursor/commands/*.md` legacy, still loads | Deprecated in favor of Skills (`$CODEX_HOME/prompts`, migration-only) | No CLI-native commands surface; skills/plugins fill this role |
| **Agents** | `.claude/agents/*.md` subagents (managed > CLI flag > project > user > plugin, closest-cwd wins) | `.claude/agents/` (Claude-compat) / `.codex/agents/` (Codex-compat) subagents; project beats user | `agents.<role>` in `config.toml`, or `.codex/agents/*.toml` | Plugin-shipped agents only (no user-facing `.claude/agents/` equivalent); reduced frontmatter, `hooks`/`mcpServers`/`permissionMode` ignored |
| **Skills** | `.claude/skills/<name>/SKILL.md` (enterprise > personal > project > bundled); plugin skills namespaced | `.agents/skills/` or `.claude/skills/` (project/user), also falls back to `.codex/skills/` | `.agents/skills/` (REPO/USER/ADMIN/SYSTEM scopes, migrated off `.codex/skills/`) | Skills synced from the claude.ai account at session start, **not** read from local `~/.claude/skills/`; cloud sessions also load repo-committed `.claude/skills/` |
| **Plugins** | `.claude-plugin/plugin.json` + `skills/`/`agents/`/`hooks/`/`.mcp.json` at plugin root | `.cursor-plugin/plugin.json` (Cursor Plugin) or `plugin.json` (Agent Plugins open standard, skills+MCP only) | `.codex-plugin/plugin.json`, marketplace under `.agents/plugins/` | Shares the Claude Code `.claude-plugin/plugin.json` package format - "built for Cowork, also compatible with Claude Code" |

Sources: queen-bee-stinger distilled-research-articles.md, Claude Code §Rules/§Commands/§Agents/§Skills/§Plugins; Cursor §Rules/§Commands/§Agents/§Skills/§Plugins; ChatGPT Codex §Rules/§Commands/§Agents/§Skills/§Plugins; Claude Cowork §Rules/§Commands/§Agents/§Skills/§Plugins.

**Load-bearing consequences for an integration author:**
- Commands are a dead end on two of four harnesses (Codex deprecated them, Claude Code/Cursor merged them into skills). Author new invocable behavior as a skill, not a command, unless you specifically need Cowork's more-reliable `commands/`-directory slash-command registration (see §4 below).
- Cowork has no user-facing agent-authoring surface at all - the only way an agent reaches a Cowork session is inside an installed plugin, with `hooks`, `mcpServers`, and `permissionMode` silently dropped. Design any Cowork-targeted agent capability assuming those three fields never survive.
- "Rules" is the least portable component by file format (`.mdc` frontmatter vs. plain `CLAUDE.md`/`AGENTS.md` vs. UI-only Cowork instructions) but the most portable by *content* - see §5, AGENTS.md as shared baseline.

---

## 2. Hooks and lifecycle events per harness

| Harness | Hook surface | Event count / notable subset | Handler types |
|---|---|---|---|
| Claude Code | `settings.json` (user/project/local) + plugin `hooks/hooks.json` | 26 documented events (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SubagentStart/Stop, TaskCreated/Completed, FileChanged, PreCompact/PostCompact, Elicitation, etc.) | `command`, `http`, `mcp_tool`, `prompt`, `agent` (experimental) |
| Cursor | `hooks/hooks.json` (plugin) or agent-hook config | Agent hooks: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought`; Tab hooks: `beforeTabFileRead`, `afterTabFileEdit`; app lifecycle: `workspaceOpen` | script command; community docs also note `type: "prompt"` (LLM-evaluated condition) |
| Codex | `~/.codex/hooks.json` / `config.toml` `[hooks]` (user, project - trusted only) | 5 native events: `SessionStart`, `UserPromptSubmit`, `PreToolUse` (**Bash-only matcher**), `PostToolUse` (Bash-only native, Edit/Write approximated), `Stop`; plus `PermissionRequest`, `PreCompact`/`PostCompact`, `SubagentStart`/`SubagentStop`, `SessionEnd` | only `type: "command"` executes; `prompt`/`agent` types parsed but skipped; hooks require explicit trust review (hash-keyed) |
| Cowork | Plugin `hooks/` only | Undocumented exact event list; hooks are explicitly Cowork-only - grayed out/inert in plain Chat | Plugin-bundled, same package format as Claude Code |

Sources: queen-bee-stinger distilled-research-articles.md, Claude Code §Rules→Hooks; Cursor §Plugins→Hooks; ChatGPT Codex §Plugins→Hooks; Claude Cowork §Plugins ("What a plugin bundles").

**The gap is bigger than one caveat.** `2026-08-14-hookbridge-loss-report-pattern.md` independently confirms and quantifies this from working code (a compiler that generates both platforms' hook files from one source): "Claude Code supports 26 events. Codex supports 5." Of Claude Code's 26, **21 have no Codex equivalent at all** and are a hard limit, not an approximation. The harness-integration-stinger's Hivemind-era guide only flagged the Bash-only `PreToolUse` matcher; the real shared-event surface across Claude Code and Codex is `SessionStart`, `UserPromptSubmit`, `PreToolUse` (Bash-only), `PostToolUse` (Bash-only native, Edit/Write approximated), `Stop` - five events, matching Codex's own documented event count almost exactly. Design any hook-driven capability around that five-event intersection first, then treat everything else as a Claude-Code-only or Cursor-only enhancement, not a baseline.

Reusable severity vocabulary for documenting a hook gap (from `2026-08-14-hookbridge-loss-report-pattern.md`): **Native** (works as designed) / **Approximated** (a workaround exists but with a real limitation, e.g. firing at session end instead of in real time) / **Hard limit** (impossible, no workaround) / **Warning** (supported with a caveat, e.g. an `async` flag silently ignored on one harness). Use these four buckets instead of a blanket "not supported" when writing a harness-integration finding.

---

## 3. MCP server registration per harness

| Harness | Config location | Format | Notes |
|---|---|---|---|
| Claude Code | `~/.claude.json` (user), `.mcp.json` (project), plugin `.mcp.json` at plugin root | JSON, `mcpServers` key | Path vars like `${CLAUDE_PLUGIN_ROOT}` resolve inside plugin-bundled servers; `/reload-plugins` keeps live connections for unchanged configs |
| Cursor | `.cursor/mcp.json` (project), `~/.cursor/mcp.json` (global), or plugin `mcp.json` at plugin root | JSON, `mcpServers` key (standalone) - Agent Plugin form declares `type: stdio/http` explicitly; Cursor Plugin form infers transport from `command`/`url` | Supports `${env:NAME}`, `${userHome}`, `${workspaceFolder}` interpolation; Enterprise MCP Allowlist restricts by command/URL pattern |
| Codex | `~/.codex/config.toml` (user) or `.codex/config.toml` (trusted project only) | **TOML**, root key `mcp_servers` (underscore) - a pasted JSON `mcpServers` block silently fails | Shared by ChatGPT desktop app, Codex CLI, IDE extension; `codex mcp add/list/login`; **cloud has no MCP** - only CLI/IDE/desktop read the shared local config |
| Cowork | App-managed "connectors," installed via plugin or Customize > Connectors | Same underlying `.mcp.json` package format as Claude Code plugins | **Connectors reach external services through Anthropic's cloud, not the local network** - a custom connector must be reachable over the public internet from Anthropic's IP ranges; local MCP servers bundled in a plugin run with the same permissions as any other program on the machine and only work through the desktop app |

Sources: queen-bee-stinger distilled-research-articles.md, Claude Code §Plugins→Plugin MCP servers; Cursor §Plugins→MCP inside a plugin vs. standalone `mcp.json`; ChatGPT Codex §Plugins→MCP config location and structure; Claude Cowork §Plugins→"What a plugin bundles" and security gotcha.

**The single highest-impact gotcha across all four:** Codex uses TOML with an underscored root key (`mcp_servers`), not the JSON `mcpServers` shape every other harness uses - a copy-pasted config block from Claude Code or Cursor silently fails on Codex rather than erroring loudly. Any cross-harness MCP-registration guide or template must show the Codex TOML form as its own worked example, never assume the JSON shape translates.

**Capability negotiation is the mechanism underneath all four.** Per `2026-08-14-mcp-capability-negotiation.md` (official MCP specification): "clients and servers explicitly declare their supported features during initialization... capabilities determine which protocol features and primitives are available during a session." This is the standards-level reason a server registered identically in two harnesses can still behave differently - the *harness* (the MCP host/client) is what negotiates, not the server alone. When a registered server behaves inconsistently across harnesses, check what the harness declared as a client before assuming the server is broken.

---

## 4. Capability detection and graceful degradation

The Hivemind-specific version of this stinger treated "capability detection" narrowly as "does `hivemind install` find this host's home directory." The general version of the problem is bigger: **decide, per harness, whether a feature exists at all, and if it doesn't, decide explicitly what happens instead of silently failing.**

**Detection should be cheap, side-effect-free, and prefer live signals over static assumptions.** Two concrete, working patterns:
- Filesystem probing (existing Hivemind guidance, still valid): does the harness's home dir/binary exist? Never write, never spawn, during detection.
- MCP self-reporting (`2026-08-14-skills-compat-capability-detection.md`): "Platform detection happens automatically via the MCP handshake (`clientInfo.name`)... If your agent platform supports self-reporting via `capabilities.experimental["skills-compat:platform-tools"]` in the MCP initialize handshake, its capabilities are used directly and take priority over the static profile." Prefer a live capability signal from the harness over a hardcoded per-harness table whenever the harness offers one; fall back to the static table only when it doesn't.

**Concrete evidence that per-harness capability differs even on basics.** `2026-08-14-skills-compat-capability-detection.md`'s static profile table: Claude Code declares `bash file_read file_write web_search web_fetch python_runtime lsp notebook subagent monitor`; Cursor only `bash file_read file_write web_search` (partial confidence); Codex CLI `bash file_read file_write python_runtime` - **no `web_search`**, because "Codex CLI has network blocked by default in all sandbox modes." This independently corroborates the queen-bee-stinger Codex sandbox research (network access off by default under `workspace-write`) from the angle of a capability author: never assume outbound network access is available to a Codex-targeted capability just because it works in Claude Code or Cursor.

**When a harness genuinely lacks a feature, classify the gap before deciding what to do about it.** Two compatible vocabularies, pick whichever fits the situation:
- Build-time / compile-time gap (Hookbridge, Pluxx/OIAP - `2026-08-14-hookbridge-loss-report-pattern.md`, `2026-08-14-cross-host-compiler-degradation-model.md`): **preserve** (close native equivalent, no loss) / **translate** (different native surface expresses the same intent) / **degrade** (workflow's user-facing meaning survives in a weaker form) / **drop** (unsupported, not worth emulating).
- Run-time gap discovered mid-session (Skills Compat Manager - `2026-08-14-skills-compat-capability-detection.md`): **OK** / **DEGRADED** / **BLOCKED**, surfaced to the agent as a structured delta before the capability's own instructions load, so the agent (or user) can decide how to proceed rather than the capability silently misbehaving.

Concrete worked degradation example from Pluxx, directly relevant to Hive skill/command authoring: a `commands`-shaped capability "compile[s] natively for Claude, Cursor, OpenCode; degrade[s] into skills plus instruction routing for Codex" - because Codex has no native commands surface at all (see §1), the only faithful move is re-expressing the capability as a skill for that one harness, not skipping it or forcing a commands-shaped file Codex won't load.

**When degradation is allowed to happen automatically vs. requires a human.** From `2026-08-14-skills-compat-capability-detection.md`'s fix-classification matrix: tag every remediation path on two axes - `SAFE`/`MANUAL` (is it safe to run unattended) and `agent_or_user`/`user_only` (who is allowed to run it). A missing optional dependency with a `pip install` fix is `SAFE · agent_or_user`; a fix that requires editing the capability's own logic to swap approaches is `MANUAL · user_only`. Apply the same two-axis judgment when a harness-integration finding recommends a fix: say plainly whether the fix is something the agent can just do, or something that needs a human decision.

---

## 5. Cross-harness portability rules

### Agent Skills spec-six frontmatter is the portable skill format

Per `2026-08-14-agentskills-spec-six-fields.md` (the agentskills.io specification itself) and queen-bee-stinger distilled-research-articles.md's Claude Code §SUPPLEMENT ("Portability-critical rule"): **only six frontmatter fields are legal outside Claude Code's own extended dialect** - `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other field (`context: fork`, `disable-model-invocation`, `argument-hint`, `paths`, `hooks`, `arguments`, etc.) is a Claude-Code-only extension. A skill using only the six spec fields loads unmodified in Claude Code, Cursor, Codex, and (via account sync) Cowork; a skill using Claude-Code-only fields throws a hard packaging/upload error the moment it leaves Claude Code (claude.ai uploads, Skills API, `package_skill.py`, and therefore Cowork's own "Save skill" pipeline). **Author every Hive skill intended for cross-harness use against the six-field table first, and treat any richer frontmatter as an opt-in, Claude-Code-specific enhancement layered on top, never a requirement.**

Progressive disclosure (three-stage loading - metadata always resident, body loads on activation, `scripts/`/`references/`/`assets/` load only as needed) is identical across all four harnesses per both the spec itself and the harness-specific research already in queen-bee-stinger's digest. Keep `SKILL.md` bodies lean regardless of target harness - the token cost is paid identically everywhere a skill loads.

### AGENTS.md is the shared rules baseline

Per `2026-08-14-agentsmd-standard.md` (the agents.md standard itself): plain Markdown, no required frontmatter, "the closest AGENTS.md to the edited file wins; explicit user chat prompts override everything," officially stewarded by the Agentic AI Foundation / Linux Foundation as a vendor-neutral format - not an OpenAI/Codex artifact, even though Codex is its most visible native consumer. Codex reads it natively; Cursor treats it as a first-party, frontmatter-free rule type alongside `.cursor/rules/*.mdc`; Claude Code does not read it directly but can pull it in via `@AGENTS.md` import (or a symlink, admin/dev-mode permitting on Windows) at the top of `CLAUDE.md`, with Claude-specific instructions layered below. **For content that genuinely applies to every harness (build commands, test commands, code style, security considerations), author it once as a root `AGENTS.md` and layer harness-specific additions in each harness's own native mechanism, rather than maintaining separate near-duplicate rule files that drift.**

**One real, unresolved discrepancy to flag rather than paper over**: the base spec's FAQ states single-file "closest wins" resolution; Codex's actual documented CLI behavior is reported as **concatenating** every AGENTS.md from git root to cwd, with later (closer) files taking precedence in the resulting prompt order rather than being the *only* file loaded (open issue agentsmd/agents.md#53, no resolution recorded). Practical effect: a subdirectory-only AGENTS.md is invisible to Cursor and Claude Code's import path (neither implements Codex's nested-concatenation walk), but Codex will pick it up. Don't assume uniform behavior for a nested AGENTS.md across harnesses.

### Plugin manifest differences are real and must be handled per harness, not templated once

There is no single portable plugin manifest across all four harnesses. The closest thing to a portable subset is the **Agent Plugins open standard** (agent-plugins.org): a `plugin.json` at plugin root declaring only skills + MCP servers, which "loads in Cursor unmodified" and is the explicitly-named cross-harness path - but it is a strict subset (no rules, no hooks, no agents, no commands) of what Cursor's own richer `.cursor-plugin/plugin.json` supports. Claude Code and Cowork share one manifest format (`.claude-plugin/plugin.json` - "built for Cowork, also compatible with Claude Code," per queen-bee-stinger's Cowork research), which is a different, richer schema than either Cursor's or Codex's own `.codex-plugin/plugin.json`. Concretely:

| Manifest | Root key convention | Component references |
|---|---|---|
| Claude Code / Cowork `.claude-plugin/plugin.json` | flat top-level fields (`skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`, `outputStyles`) | strings or arrays of paths; only `name` strictly required if a manifest exists |
| Cursor `.cursor-plugin/plugin.json` | same shape family (`rules`, `agents`, `skills`, `commands`, `hooks`, `mcpServers`, plus Cursor-only `variables`) | folder auto-discovery if a field is omitted; an explicit field *replaces* discovery for that type |
| Cursor/agent-plugins.org `plugin.json` | minimal (`skills`, `mcpServers` only) | the actual cross-harness-portable subset |
| Codex `.codex-plugin/plugin.json` | `skills`, `mcpServers` (path to `.mcp.json`), `apps` (path to `.app.json` connector refs), `hooks`, plus a rich `interface.*` block for ChatGPT desktop UI metadata | paths, not inline component definitions |

**Practical rule**: when a capability needs to ship as a plugin across all four harnesses, write four manifests (or three, since Claude Code and Cowork share one), not one manifest hand-waved as "portable." If the capability is skills + MCP only, the Agent Plugins open-standard `plugin.json` is the one case where a single manifest genuinely works everywhere it's read.

Sources: queen-bee-stinger distilled-research-articles.md, Claude Code §Plugins ("plugin.json manifest," "Plugin directory structure"), Cursor §Plugins ("Two manifest formats (portability)," "`.cursor-plugin/plugin.json` fields"), ChatGPT Codex §Plugins ("Manifest field reference"), Claude Cowork §Plugins ("Complete working example," "Directory layout rule"); `2026-08-14-agentskills-spec-six-fields.md`; `2026-08-14-agentsmd-standard.md`; `2026-08-14-cross-host-compiler-degradation-model.md`.

---

## 6. Source list

**Reused (queen-bee-stinger distilled-research-articles.md sections cited above):** Claude Code §Rules, §Plugins, §Commands, §Agents, §Skills (including SUPPLEMENT); Cursor §Rules, §Plugins, §Commands, §Agents, §Skills; ChatGPT Codex §Rules, §Plugins, §Commands, §Agents, §Skills; Claude Cowork §Rules, §Plugins, §Commands, §Agents, §Skills.

**New, archived in this stinger's `research/external/`:**
1. `2026-08-14-mcp-capability-negotiation.md` - Model Context Protocol architecture/capability negotiation (official spec)
2. `2026-08-14-agentskills-spec-six-fields.md` - Agent Skills format specification (official, agentskills.io)
3. `2026-08-14-agentsmd-standard.md` - AGENTS.md standard (official, agents.md)
4. `2026-08-14-hookbridge-loss-report-pattern.md` - Hookbridge, cross-harness hook compiler (community, Claude Code + Codex event matrix and loss-report vocabulary)
5. `2026-08-14-skills-compat-capability-detection.md` - Skills Compat Manager (community, per-harness capability profiles and OK/DEGRADED/BLOCKED runtime model)
6. `2026-08-14-cross-host-compiler-degradation-model.md` - Pluxx / OIAP (community, preserve/translate/degrade/drop decision model)

**Old, retained as Hivemind case study (not superseded, see `examples/case-study-hivemind-six-host-installer.md`):** `research/research-plan.md`, `research/research-summary.md`, `research/index.md`, `research/external/2026-06-16-architecture-build.md`, `2026-06-16-capability-detection.md`, `2026-06-16-hook-lifecycle.md`, `2026-06-16-mcp-registration.md`, `2026-06-16-openclaw-clawhub.md`, `2026-06-16-pi-extension.md`, `2026-06-16-tool-contract.md`.
