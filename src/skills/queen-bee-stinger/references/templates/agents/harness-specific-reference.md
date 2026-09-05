# Agent (subagent) authoring reference, per harness

Grounding: `references/research/distilled-research-articles.md`, which cites raw sources in `references/research/raw/`. Every claim below carries its citation. Where the research has a gap or a conflict, it says so instead of guessing.

This file is a reference for building Bee agents (Claude Code calls them subagents, Cursor calls them subagents, Codex calls them agent roles, Cowork calls them plugin agents). Read it before writing `references/templates/agents/reference-agents.md`-style files for a new Bee.

---

## Claude Code

### Full subagent frontmatter field table

Only `name` and `description` are required. Everything else is optional.

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | lowercase + hyphens, unique, cannot contain `:` (reserved for plugin scoping) |
| `description` | Yes | tells Claude when to delegate here |
| `tools` | No | allowlist; if omitted, inherits every subagent-available tool; also supports `Agent(type)` restriction syntax for `--agents` main threads |
| `disallowedTools` | No | denylist, applied after `tools` |
| `model` | No | `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit` (default) |
| `permissionMode` | No | `default`/`manual` (alias, v2.1.200+), `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | cap on agentic turns |
| `skills` | No | preloads full skill content (not just description) at startup; cannot preload a skill with `disable-model-invocation: true` |
| `mcpServers` | No | inline server config or a name reference, scoped to this subagent |
| `hooks` | No | lifecycle hooks scoped to this subagent |
| `memory` | No | `user`, `project`, or `local` - persistent learning under `.claude/agent-memory/` |
| `background` | No | forces background execution even if Claude requests foreground |
| `effort` | No | `low`/`medium`/`high`/`xhigh`/`max`, overrides session effort |
| `isolation` | No | only valid value is `worktree` - isolated git worktree, auto-cleaned if no changes made |
| `color` | No | `red`/`blue`/`green`/`yellow`/`purple`/`orange`/`pink`/`cyan` |
| `initialPrompt` | No | seeds the first turn (exact behavior not fully captured in raw research, see gap note below) |

[raw/claude-code--agents--sub-agents-official-docs.md, raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md]

Subagents receive only their own system prompt body plus a basic environment, not the full Claude Code system prompt [raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md].

**Gap:** the original raw fetch cut off mid-definition of `initialPrompt`. A full refetch (the SUPPLEMENT file) confirmed the field exists and its rough purpose (seed the first turn) but the raw research still does not give exact substitution/precedence rules against a user-supplied prompt. Treat `initialPrompt` as usable but under-specified.

Minimal working example:

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

### Scope and priority table

| Location | Priority | Notes |
|---|---|---|
| Managed settings `.claude/agents/` | 1 (highest) | org-wide, IT-deployed |
| `--agents` CLI flag (JSON) | 2 | session-only, not saved to disk |
| `.claude/agents/` | 3 | project scope; discovered walking up to repo root; closest-to-cwd wins on name collision (v2.1.178+) |
| `~/.claude/agents/` | 4 | user scope, all projects |
| Plugin `agents/` | 5 (lowest) | scoped identifier `plugin-name:agent-name`, or `plugin-name:folder:agent-name` for subfolders |

[raw/claude-code--agents--sub-agents-official-docs.md]

A duplicate `name` within the same directory tree resolves to only one definition, chosen by undocumented filesystem read order; `/doctor` flags duplicates so you can catch this [raw/claude-code--agents--sub-agents-official-docs.md].

### Recursive scanning and plugin scoped IDs

Subagent directories are scanned recursively. A plugin's `agents/` subfolder path becomes part of the scoped ID, e.g. `my-plugin:review:security` for `my-plugin/agents/review/security.md` [raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md].

### Plugin-agent restrictions

Plugin agents support a narrower field set than a full project/user subagent file:

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

Supported fields: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (only `worktree`). **Not supported for plugin agents**: `hooks`, `mcpServers`, `permissionMode` - dropped for security reasons. If a Bee needs those fields, ship it as a project `.claude/agents/` file instead of inside a plugin [raw/claude-code--plugins--plugins-reference-official-docs.md, raw/claude-code--agents--sub-agents-official-docs.md].

After migrating standalone `.claude/agents/` to a plugin, delete the standalone originals: project/user agent definitions override same-named plugin agents, so the plugin copy stays inert until the standalone file is removed [raw/claude-code--plugins--plugins-official-docs.md].

### Built-in subagents

| Agent | Model | Tools | Purpose |
|---|---|---|---|
| Explore | inherits main conversation, capped at Opus on the Claude API (v2.1.198+; was fixed Haiku before) | read-only (no Write/Edit) | file discovery, code search |
| Plan | inherits | read-only | codebase research during plan mode |
| general-purpose | inherits | every subagent-available tool | complex multi-step research and modification |
| claude | inherits | every subagent-available tool | catch-all; default agent for dispatched background sessions |
| statusline-setup | Sonnet | - | `/statusline` configuration |
| claude-code-guide | Haiku | - | questions about Claude Code itself |

[raw/claude-code--agents--sub-agents-official-docs.md]

A user or project subagent named `Explore` overrides the built-in and keeps its own `model` field (pin it to `haiku` for cost control). `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` removes just Explore/Plan; `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` removes all built-ins in non-interactive/SDK mode. Explore and Plan skip CLAUDE.md and parent git status for speed; every other subagent, built-in or custom, loads both [raw/claude-code--agents--sub-agents-official-docs.md].

### Agent teams (experimental)

Disabled by default. Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (settings.json `env` key or shell env var) [raw/claude-code--agents--agent-teams-orchestration-official-docs.md]:

```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

One session is team lead; teammates run fully independent sessions with their own context windows and message each other directly, not just report to the lead. Subagent definitions from any scope are reusable as team members - spawning a teammate can reference a subagent `type`, inheriting its `tools`/`model` with the file body appended as extra system-prompt instructions [raw/claude-code--agents--agent-teams-orchestration-official-docs.md, raw/claude-code--agents--sub-agents-official-docs.md]. For the Hive, this means a Bee agent file is reusable as a teammate config without rewriting anything.

---

## Cursor

### File fields

Location: `.claude/agents/*.md` (project) or `~/.claude/agents/` (user). Frontmatter:

```markdown
---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
readonly: true
---
You are a security expert auditing code for vulnerabilities.
```
[raw/cursor--agents--subagents-docs.md]

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | No | filename | lowercase, hyphens |
| `description` | string | No | - | drives delegation decisions |
| `model` | string | No | `inherit` | `inherit` or a specific model ID |
| `readonly` | boolean | No | `false` | no file edits or state-changing commands |
| `is_background` | boolean | No | `false` | non-blocking execution |

[raw/cursor--agents--subagents-docs.md]

### Model bracket syntax

Bracketed `id=value` pairs, comma-separated, attach to the model string: `composer-2.5[]` (standard variant), `composer-2.5[fast=false]`, `claude-opus-5[effort=high]`, `claude-opus-5[context=300k]`, `claude-opus-5[effort=high,context=300k]`. The configured model is overridden if a team admin blocks it, a legacy plan needs Max Mode you lack, or your plan excludes it - Cursor falls back to a compatible model [raw/cursor--agents--subagents-docs.md].

### Compat fallback reads

Cursor reads more than its own directory. Project scope, in priority order: `.claude/agents/` beats `.claude/agents/` beats `.codex/agents/`. User scope, same order: `~/.claude/agents/`, `~/.claude/agents/`, `~/.codex/agents/`. Project subagents win over user subagents on name conflicts [raw/cursor--agents--subagents-docs.md].

| Type | Location | Scope |
|---|---|---|
| Project | `.claude/agents/` | current project |
| Project (Claude compat) | `.claude/agents/` | current project |
| Project (Codex compat) | `.codex/agents/` | current project |
| User | `~/.claude/agents/` | all projects |
| User (Claude compat) | `~/.claude/agents/` | all projects |
| User (Codex compat) | `~/.codex/agents/` | all projects |

[raw/cursor--agents--subagents-docs.md]

This is the load-bearing fact for Hive portability: a Bee agent file written for `.claude/agents/` loads in Cursor without modification, as long as it stays inside the field set Cursor understands (`name`, `description`, `model`, `readonly`, `is_background`) - extra Claude-only fields are simply ignored, not an error.

### Built-ins

No config needed: **Explore** (codebase search, faster model, many parallel searches), **Bash** (shell command series, isolates verbose output), **Browser** (MCP browser control, filters noisy DOM/screenshots) [raw/cursor--agents--subagents-docs.md].

### Nesting cap

Since Cursor 2.5, subagents can spawn child subagents, but a child-of-a-subagent cannot spawn further - nesting is capped at 2 levels below the main agent. Spawning requires Task tool access; hooks/policies can block it [raw/cursor--agents--subagents-docs.md, raw/cursor--multiple--changelog-2-5-plugins-marketplace.md].

### `/in-cloud` and `/babysit`

`/in-cloud` hands the next task to a subagent on its own VM and branch (Agents Window only). `/babysit` iterates a PR to merge-ready. Cloud subagents pull MCP servers from the team's `cursor.com/agents` config, not the local session [raw/cursor--agents--subagents-docs.md].

### Resume by agent ID

Each execution returns an agent ID for resuming: `Resume agent abc123...`. Background subagents write state as they run, including to `~/.cursor/subagents/`, readable by the parent for progress [raw/cursor--agents--subagents-docs.md].

### Best practices, cost

Write focused single-responsibility subagents; invest in `description` since it drives delegation; keep prompts concise; version-control `.claude/agents/`; start with 2-3 rather than dozens of vague generic ones. Trade-offs: context isolation costs startup overhead, parallel execution costs roughly N times the tokens for N subagents, and a specialized subagent can have higher latency than the main agent for a simple task [raw/cursor--agents--subagents-docs.md].

---

## Codex

### No markdown agent files

Codex has no `.md` agent-definition format at all. Subagent roles are configured entirely in `config.toml`, not as files an author hand-writes per agent [raw/codex--rules--config-reference.md, raw/codex--multiple--customization-overview.md]. This is the single biggest structural difference from the other three harnesses when porting a Bee: there is no file to drop in, only config to translate.

### `agents.<role>` config surface

```toml
agents.enabled = true
agents.max_concurrent_threads_per_session = 4   # legacy alias: agents.max_threads
agents.default_subagent_model = "gpt-5.6"
agents.default_subagent_reasoning_effort = "medium"
agents.interrupt_message = "Stopping current subagent work."

[agents.security-reviewer]
description = "Reviews diffs for security issues before merge"
config_file = "./.codex/agents/security-reviewer.toml"
```

`agents.<role>.description` and `agents.<role>.config_file` define a named role; relative `config_file` paths resolve from the declaring config file, not from cwd [raw/codex--rules--config-reference.md]. MCP-backed skill dependencies for an agent are declared separately in `agents/openai.yaml`, not in `config.toml` [raw/codex--multiple--customization-overview.md].

### `multi_agent` feature flag

`multi_agent` is one of the stable-by-default feature flags under `[features]`, alongside `apps`, `goals`, `hooks`, `fast_mode`, `personality`, `remote_plugin`, `shell_snapshot`, `shell_tool`. Enable/disable explicitly with `feature_name = true` under `[features]` or `codex --enable feature_name` [raw/codex--rules--config-basic.md].

### Three delegation tiers

1. **`codex exec`** - non-interactive scripting, for CI pipelines, pre-merge checks, scheduled jobs, or piping output into other tools. Defaults to a read-only sandbox; give it explicit least privilege (`--sandbox workspace-write`) rather than the deprecated `--full-auto` [raw/codex--agents--noninteractive-exec.md].
2. **In-session subagents** - the `agents.<role>` config above, invoked during an interactive session.
3. **`codex cloud`** - a remote, OpenAI-managed environment browsable from the terminal. All three surfaces (CLI, IDE, web) share one agent and the same Codex Cloud [raw/codex--agents--noninteractive-exec.md].

### Cloud two-phase lifecycle and secrets-only-in-setup

1. Create container, checkout branch/SHA.
2. Run setup script, plus an optional maintenance script on cache resume. Setup runs in a **separate Bash session** from the agent phase - `export` in the setup script does not persist into the agent phase; use `~/.bashrc` or environment settings instead.
3. Apply internet-access settings: setup has internet access, the agent phase is offline by default.
4. Agent loop edits/runs/validates, using `AGENTS.md` for lint/test commands.
5. Show diff, offer a PR.

Secrets are distinct from env vars: extra encryption, **only available to setup scripts**, and removed before the agent phase starts. Caching lasts up to 12 hours and invalidates on setup/maintenance script, env var, or secret changes; on Business/Enterprise, caches are shared across every user with environment access, so invalidation affects everyone [raw/codex--agents--cloud-environments.md].

This secrets-only-in-setup rule is the load-bearing security fact for any Bee that needs credentials in a Codex cloud run: put the credential-consuming step in the setup script, not in agent-phase instructions.

### `@codex review` reading `## Code Review Rules` in AGENTS.md

Setup: enable Codex cloud for the repo, turn on "Code review" in Codex settings, optionally add an AGENTS.md review-rules section. Trigger: `@codex review` as a PR comment - Codex reacts, then posts a standard GitHub review restricted to P0/P1 issues only. "Automatic reviews" runs this on every new PR without the manual mention [raw/codex--agents--github-code-review.md].

Add a `## Code Review Rules` section to AGENTS.md, using `###` subheadings per check group. Root-wide rules go in the root AGENTS.md; service-specific rules go in a nested AGENTS.md (e.g. `services/experiment_reporting/AGENTS.md`); Codex applies root plus the closest more-specific file per changed file:

```md
## Code Review Rules
### Experiment cohorts
- Do not filter treatment comparisons on post-exposure behavior, including conversion or retention.
  Safe path: build cohorts from assignment or exposure; report conversion as an outcome.
```
[raw/codex--agents--github-code-review.md]

`@codex fix the P1 issue` starts a cloud chat with the PR as context and can push a fix if permitted. Review rules guide Codex but explicitly do not replace tests, branch protections, or required approvals [raw/codex--agents--github-code-review.md].

For the Hive: a Bee's Ship Gate expectations cannot be enforced through Codex's review agent the way a Claude Code hook can enforce them. The closest Codex equivalent is a `## Code Review Rules` block in AGENTS.md, which is advisory, not a blocking gate.

---

## Cowork

### Plugin-shipped agents only

Cowork does not expose a `.claude/agents/` directory to the end user the way Claude Code CLI does. Agents reach a Cowork session only through an installed plugin, or through Claude's own automatic subagent delegation during a task - there is no documented user-facing way to hand-author a standalone subagent file [raw/cowork--agents--code-claude-docs-sub-agents.md]. For the Hive, this means a Bee only reaches Cowork if it ships inside the queen-bee-stinger plugin package (or whatever plugin wraps it); a loose `.claude/agents/` file dropped into a Cowork-mounted folder is not picked up.

### Supported field subset

Plugin agents that do reach Cowork support the same reduced frontmatter as any Claude Code plugin agent:

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

Supported: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (only `worktree`). Not supported, silently ignored: `hooks`, `mcpServers`, `permissionMode` [raw/cowork--agents--code-claude-docs-sub-agents.md]. The documented plugin-agent supported list does not mention `color`, and no source states whether `color` or a `memory` value of `local` survives plugin packaging; treat both as unverified rather than unsupported.

| Claude Code plugin agent field | Works in Cowork? |
|---|---|
| `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation: worktree` | Yes - loads with the plugin |
| `hooks` | No - ignored for plugin-shipped agents |
| `mcpServers` | No - ignored for plugin-shipped agents |
| `permissionMode` | No - ignored for plugin-shipped agents |

[raw/cowork--agents--code-claude-docs-sub-agents.md]

Agents appear in the @-mention typeahead under their scoped name, e.g. `my-plugin:code-reviewer`, once the plugin is enabled [raw/cowork--agents--code-claude-docs-sub-agents.md].

### Sub-agent coordination is automatic

Cowork's own documentation describes only "sub-agent coordination" as a first-class user-facing capability: it "breaks complex work into smaller tasks and coordinates parallel workstreams to complete them" and "may coordinate multiple sub-agents working simultaneously." No official Cowork documentation confirms that Claude Code's agent view, agent teams, or dynamic workflows have a Cowork-native equivalent - there are no user-facing controls to pick between coordination modes [raw/cowork--agents--support-get-started-cowork.md, raw/cowork--agents--code-claude-docs-run-agents-parallel.md]. The visible lifecycle is: analyze and plan, break into subtasks when needed, run code/shell in an isolated server-side environment, coordinate parallel workstreams if appropriate, deliver outputs. Deletion protection applies throughout: Claude requires explicit "Allow" permission before permanently deleting files [raw/cowork--agents--support-get-started-cowork.md].

**Gap:** no raw source gives a Cowork-native equivalent to `claude agents` (agent view), `/tasks`, `/workflows`, or cross-session teammate messaging.

---

## Portability table - which agent fields survive where

| Field | Claude Code (project/user) | Claude Code (plugin) | Cursor | Codex | Cowork (plugin) |
|---|---|---|---|---|---|
| `name` | Yes | Yes | Yes | n/a (config key, not a field) | Yes |
| `description` | Yes | Yes | Yes | Yes (`agents.<role>.description`) | Yes |
| `model` | Yes | Yes | Yes (bracket syntax for effort/context) | Yes (`default_subagent_model`) | Yes |
| `tools` / `disallowedTools` | Yes | Yes | not modeled the same way (`readonly` is the closest analog) | not modeled | Yes |
| `readonly` | n/a | n/a | Yes | n/a | n/a |
| `is_background` | n/a (`background` is the analog) | n/a | Yes | n/a | n/a |
| `permissionMode` | Yes | No (ignored) | n/a | n/a | No (ignored) |
| `mcpServers` | Yes | No (ignored) | n/a (cloud subagents use team config) | Yes (`agents/openai.yaml` dependency block) | No (ignored) |
| `hooks` | Yes | No (ignored) | n/a | n/a | No (ignored) |
| `memory` | Yes (`user`/`project`/`local`) | Yes (`local` unverified for plugins) | n/a | n/a | Yes (`local` unverified for plugins) |
| `isolation: worktree` | Yes | Yes | n/a (worktrees are a separate Agents Window feature) | n/a | Yes |
| `maxTurns` / `effort` | Yes | Yes | n/a | `agents.default_subagent_reasoning_effort` (session default, not per-role) | Yes |
| `color` | Yes | Unverified (absent from the documented plugin-agent list) | n/a | n/a | Unverified (absent from the documented plugin-agent list) |

Practical rule for authoring a Bee: write the file once using the plugin-agent field subset (`name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory` with `user` or `project` as the safe scopes, `background`, `isolation: worktree`). That same file drops into Claude Code (project or plugin), Cursor (as-is, with Cursor ignoring fields it doesn't recognize), and Cowork (inside a plugin package) without edits. Codex needs a translation step into `agents.<role>` TOML since it has no markdown agent format at all.
