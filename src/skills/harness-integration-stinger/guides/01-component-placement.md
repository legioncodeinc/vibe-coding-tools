# Guide 01: Per-Harness Component Placement

**Sources:** `research/distilled-harness-integration.md` §1; queen-bee-stinger distilled-research-articles.md, Claude Code §Rules/§Commands/§Agents/§Skills/§Plugins; Cursor §Rules/§Commands/§Agents/§Skills/§Plugins; ChatGPT Codex §Rules/§Commands/§Agents/§Skills/§Plugins; Claude Cowork §Rules/§Commands/§Agents/§Skills/§Plugins

---

## The five component types and where each harness puts them

| Component | Claude Code | Cursor | Codex | Cowork |
|---|---|---|---|---|
| **Rules** | `CLAUDE.md` (project/user/local) + `.claude/rules/*.md` (path-scoped via `paths` frontmatter) | `.cursor/rules/*.mdc` (four rule types: Project/User/Team/`AGENTS.md`) | `AGENTS.md` (root + nested, concatenated root→cwd) + `config.toml` | Global instructions + Folder instructions, set via app UI, not committed files |
| **Commands** | Merged into Skills; `.claude/commands/*.md` still works but skills are current | Merged into Skills; `.cursor/commands/*.md` legacy, still loads | Deprecated in favor of Skills (`$CODEX_HOME/prompts`, migration-only) | No CLI-native commands surface; skills/plugins fill this role |
| **Agents** | `.claude/agents/*.md` subagents (managed > CLI flag > project > user > plugin, closest-cwd wins) | `.claude/agents/` (Claude-compat) / `.codex/agents/` (Codex-compat) subagents; project beats user | `agents.<role>` in `config.toml`, or `.codex/agents/*.toml` | Plugin-shipped agents only; reduced frontmatter, `hooks`/`mcpServers`/`permissionMode` silently ignored |
| **Skills** | `.claude/skills/<name>/SKILL.md` (enterprise > personal > project > bundled); plugin skills namespaced | `.agents/skills/` or `.claude/skills/` (project/user), also falls back to `.codex/skills/` | `.agents/skills/` (REPO/USER/ADMIN/SYSTEM scopes, migrated off deprecated `.codex/skills/`) | Skills synced from the claude.ai account at session start, **not** read from local `~/.claude/skills/`; cloud sessions also load repo-committed `.claude/skills/` |
| **Plugins** | `.claude-plugin/plugin.json` + `skills/`/`agents/`/`hooks/`/`.mcp.json` at plugin root | `.cursor-plugin/plugin.json` (Cursor Plugin) or `plugin.json` (Agent Plugins open standard, skills+MCP only) | `.codex-plugin/plugin.json`, marketplace under `.agents/plugins/` | Shares the Claude Code `.claude-plugin/plugin.json` package format |

---

## Load-bearing consequences

1. **Commands are a dead end on two of four harnesses.** Codex deprecated custom prompts entirely ("we recommend switching to skills"); Claude Code and Cursor merged commands into skills and treat a skill of the same name as winning on conflict. Author new invocable behavior as a skill unless you specifically need Cowork's more reliable flat-`commands/`-directory slash-command registration - see the known Cowork bug in `guides/05-portability-and-contracts.md` where `skills/*/SKILL.md` plugin skills sometimes fail to register as slash commands but flat `commands/*.md` files do.

2. **Cowork has no user-facing agent-authoring surface at all.** The only way an agent reaches a Cowork session is inside an installed plugin, and three fields are silently dropped for plugin-shipped agents: `hooks`, `mcpServers`, `permissionMode`. Design any Cowork-targeted agent capability assuming those three fields never survive - put the equivalent behavior in a hook the *plugin* ships (Cowork-only, works) or in the skill body itself (works everywhere) instead.

3. **Rules is the least format-portable component, but the most content-portable.** File formats diverge completely (`.mdc` frontmatter vs. plain `CLAUDE.md`/`AGENTS.md` vs. UI-only Cowork instructions), but three of four harnesses (Claude Code via import, Cursor natively, Codex natively) can converge on the same `AGENTS.md` content as a shared baseline - see `guides/05-portability-and-contracts.md`.

4. **Skills is the most portable component by design**, provided the frontmatter stays inside the six-field Agent Skills spec (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) - see `guides/05-portability-and-contracts.md` for why any richer field is a Claude-Code-only extension that breaks packaging elsewhere.

5. **Plugins are the only component type where "one manifest, four harnesses" is mostly false.** Claude Code and Cowork share a manifest format; Cursor and Codex each have their own, incompatible schema. The one genuinely portable case is the Agent Plugins open standard (`plugin.json`, skills + MCP only) - see `guides/05-portability-and-contracts.md` for the manifest comparison table.

---

## Precedence and conflict resolution, briefly

Every harness resolves same-name conflicts differently, and getting this wrong is a common source of "my capability isn't loading" bugs:

- **Claude Code**: enterprise (managed settings) > personal (`~/.claude/skills/`) > project (`.claude/skills/`) > bundled, for skills; for agents, managed > `--agents` CLI JSON > project > user > plugin (lowest). A skill beats a same-name `.claude/commands/` file; plugin skills are always namespaced (`plugin-name:skill-name`) so they never conflict with an unqualified local skill.
- **Cursor**: Team Rules → Project Rules → User Rules, earlier source wins on conflict; for agents, project beats user, and among project locations `.cursor/` beats `.claude/`/`.codex/` fallback paths.
- **Codex**: closest-to-cwd `AGENTS.md` wins per the base spec; Codex's own CLI documented behavior is closer to concatenation with recency precedence (see `guides/05-portability-and-contracts.md` for the unresolved discrepancy). Repo-scoped skills in different `.agents/skills/` directories along the cwd→root path are **not** merged - same-name skills in different locations both appear as separate selector entries.
- **Cowork**: no local precedence to reason about for skills (synced from the claude.ai account at session start, not resolved against a local tree); plugin components install/enable per-plugin, with organization-managed plugins taking precedence over anything a user could remove.

Verify placement against the harness's actual precedence rule before assuming a capability "isn't working" - often it loaded, just from a different location than the one just edited.
