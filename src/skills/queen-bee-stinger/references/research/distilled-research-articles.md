# Distilled Research Articles: Project Hive

Four-harness research digest for queen-bee-stinger. Every fact cites a raw source in `raw/`. Fetched 2026-08-14, research window 2026-02-14 to 2026-08-14.

Harness order: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.

---

# Claude Code: distilled research (fetched 2026-08-14)

Sources are the raw files in `raw/claude-code--*.md`. Every claim below cites the file it came from. Several raw fetches were truncated mid-document by the collection process itself (not by this distillation); those cutoffs are called out explicitly so a template author knows where the primary source runs dry.

---

## Rules

"Rules" covers `settings.json`, `CLAUDE.md` / `.claude/rules/`, hooks, and the permission system. These are the enforcement and always-loaded-context layer, distinct from skills (loaded on demand).

### Configuration scopes

Four scopes, evaluated in this precedence order (highest wins, permission rules merge instead of override): **Managed > command-line args > Local > Project > User** [raw/claude-code--rules--settings-official-docs.md].

| Scope | Location | Shared with team? |
|---|---|---|
| Managed | `managed-settings.json` (system dirs), plist/registry, or server-delivered | Yes (IT-deployed) |
| User | `~/.claude/` | No |
| Project | `.claude/` in repo | Yes (committed) |
| Local | `.claude/settings.local.json` at repo root | No (gitignored) |
[raw/claude-code--rules--settings-official-docs.md]

On Windows, `~/.claude` resolves to `%USERPROFILE%\.claude` [raw/claude-code--rules--settings-official-docs.md].

Per-feature file locations:

| Feature | User | Project | Local |
|---|---|---|---|
| Settings | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| Subagents | `~/.claude/agents/` | `.claude/agents/` | none |
| MCP servers | `~/.claude.json` | `.mcp.json` | `~/.claude.json` (per-project) |
| Plugins | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| CLAUDE.md | `~/.claude/CLAUDE.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md` |
[raw/claude-code--rules--settings-official-docs.md]

`.claude/settings.local.json` is resolved through worktrees to the main checkout, so one file covers the whole repo regardless of subdirectory or worktree (behavior since v2.1.211; earlier versions kept it in the starting directory) [raw/claude-code--rules--settings-official-docs.md]. This is also where Claude Code saves permanent "don't ask again" Bash approvals [raw/claude-code--rules--settings-official-docs.md].

Managed settings file-delivery paths: macOS `/Library/Application Support/ClaudeCode/`, Linux/WSL `/etc/claude-code/`, Windows `C:\Program Files\ClaudeCode\` (legacy `C:\ProgramData\ClaudeCode\managed-settings.json` unsupported since v2.1.75) [raw/claude-code--rules--settings-official-docs.md]. A `managed-settings.d/` drop-in directory merges alphabetically on top of the base file, systemd-style; scalars are overridden, arrays concatenated+deduped, objects deep-merged [raw/claude-code--rules--settings-official-docs.md].

### settings.json example (complete, working)

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf"
  },
  "companyAnnouncements": [
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com"
  ]
}
```
[raw/claude-code--rules--settings-official-docs.md]

Most settings hot-reload (`permissions`, `hooks`, `apiKeyHelper`); `model` and `outputStyle` apply only on next restart or `/clear`/`/model` [raw/claude-code--rules--settings-official-docs.md]. Managed settings parse tolerantly: an invalid entry is stripped with a warning rather than rejecting the whole file (requires v2.1.169+); user/project/local files are strict and a bad file is rejected wholesale [raw/claude-code--rules--settings-official-docs.md]. Run `claude doctor` to see stripped entries and their source/field [raw/claude-code--rules--settings-official-docs.md].

Notable `settings.json` keys captured before truncation: `advisorModel`, `agent` (run main thread as a named subagent), `agentPushNotifEnabled`, `allowedChannelPlugins`, `allowedHttpHookUrls`, `allowedMcpServers`, `allowManagedHooksOnly`, `alwaysThinkingEnabled`, `apiKeyHelper`, `askUserQuestionTimeout`, `attribution`, `autoCompactEnabled`, `autoCompactWindow` [raw/claude-code--rules--settings-official-docs.md]. **Gap**: raw file cuts off mid-row on `autoCompactWindow`: the rest of the (clearly much longer) key table wasn't captured.

### CLAUDE.md and `.claude/rules/`

Two memory mechanisms, both loaded at session start, both *context* (not enforced config: use a `PreToolUse` hook to actually block something) [raw/claude-code--rules--memory-official-docs.md]:

| | CLAUDE.md | Auto memory |
|---|---|---|
| Who writes it | You | Claude |
| Contains | Instructions/rules | Learnings/patterns |
| Loaded into | Every session | Every session (first 200 lines / 25KB) |
[raw/claude-code--rules--memory-official-docs.md]

CLAUDE.md file locations, in load order broadest→narrowest (so project instructions appear in context *after* user instructions, i.e. read last / weighted more recent):

| Scope | Location |
|---|---|
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL `/etc/claude-code/CLAUDE.md`; Windows `C:\Program Files\ClaudeCode\CLAUDE.md` |
| User | `~/.claude/CLAUDE.md` |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` |
| Local | `./CLAUDE.local.md` (gitignore it) |
[raw/claude-code--rules--memory-official-docs.md]

Claude Code walks up the directory tree from cwd loading `CLAUDE.md`/`CLAUDE.local.md` at each level; files are **concatenated**, not override-replaced, ordered root→cwd, with `CLAUDE.local.md` appended after `CLAUDE.md` at each level [raw/claude-code--rules--memory-official-docs.md]. Subdirectory CLAUDE.md files load lazily when Claude reads files there, not at launch [raw/claude-code--rules--memory-official-docs.md]. Target **under 200 lines** per CLAUDE.md file: longer files reduce adherence [raw/claude-code--rules--memory-official-docs.md].

Imports use `@path/to/import` syntax (both relative (resolved relative to the *containing file*, not cwd) and absolute paths; max recursion depth 4; skipped inside code spans/fences; wrap in backticks to cite a path without importing it) [raw/claude-code--rules--memory-official-docs.md]. External imports (resolving outside the working directory) trigger a one-time approval dialog in project-scope files; user-scope imports (`~/.claude/CLAUDE.md`, `~/.claude/rules/`) load without the dialog [raw/claude-code--rules--memory-official-docs.md].

**Claude Code reads `CLAUDE.md`, not `AGENTS.md`.** To share instructions with other agents, either symlink (`ln -s AGENTS.md CLAUDE.md`: requires admin/dev-mode on Windows, so use `@AGENTS.md` import there instead) or import it at the top of CLAUDE.md and append Claude-specific content below [raw/claude-code--rules--memory-official-docs.md]:

```markdown
@AGENTS.md

## Claude Code

Use plan mode for changes under `src/billing/`.
```

`/init` (run with `CLAUDE_CODE_NEW_INIT=1` for the interactive multi-phase flow) reads Cursor rules (`.cursor/rules/` or `.cursorrules`) and Copilot rules (`.github/copilot-instructions.md`) and folds relevant parts into the generated CLAUDE.md; with the env var it also reads `AGENTS.md`, `.devin/rules/`, `.windsurf/rules/`/`.windsurfrules`, `.clinerules` [raw/claude-code--rules--memory-official-docs.md]. `/import` (v2.1.213+) brings a supported coding agent's config into Claude Code wholesale, including MCP servers, commands, subagents, skills [raw/claude-code--rules--memory-official-docs.md].

**`.claude/rules/`** organizes instructions into topic files, discovered recursively, `.md` extension:

```text
your-project/
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
│       ├── code-style.md
│       ├── testing.md
│       └── security.md
```
[raw/claude-code--rules--memory-official-docs.md]

Rules without `paths` frontmatter load unconditionally, same priority as `.claude/CLAUDE.md`. Path-scoped rules use YAML frontmatter and only enter context when Claude reads/edits a matching file:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
```
[raw/claude-code--rules--memory-official-docs.md]

Brace expansion is supported (`src/**/*.{ts,tsx}`); the whole `paths` list shares a budget of 1,000 expanded patterns and 4 MiB (v2.1.217+ fix for a prior stall/crash bug); an unreadable bracket expression like `photos [2024/**` matches nothing rather than erroring the whole rule (fixed in v2.1.207; before that one bad pattern broke the Read tool for every file the rule touched) [raw/claude-code--rules--memory-official-docs.md]. `.claude/rules/` supports symlinks for sharing across projects, including circular-symlink detection [raw/claude-code--rules--memory-official-docs.md]. User-level rules (`~/.claude/rules/`) load before project rules, so project rules take higher priority [raw/claude-code--rules--memory-official-docs.md].

Managed CLAUDE.md content can be embedded directly via the `claudeMd` key in `managed-settings.json` instead of a separate file; this key has no effect in user/project/local settings [raw/claude-code--rules--memory-official-docs.md]. `claudeMdExcludes` (any settings layer, arrays merge) skips ancestor CLAUDE.md files by glob in monorepos; managed-policy CLAUDE.md files can never be excluded [raw/claude-code--rules--memory-official-docs.md].

### Auto memory

On by default; toggle via `/memory` (writes `autoMemoryEnabled` to `~/.claude/settings.json`) or per-project `"autoMemoryEnabled": false`; env var `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` also disables it [raw/claude-code--rules--memory-official-docs.md]. Storage: `~/.claude/projects/<project-hash>/memory/` (derived from the git repo so all worktrees share one directory), containing a `MEMORY.md` entrypoint plus optional topic files; relocate with `autoMemoryDirectory` (absolute path or `~/`-prefixed) [raw/claude-code--rules--memory-official-docs.md].

### Hooks

Hooks are shell commands, HTTP endpoints, MCP tool calls, or LLM prompts firing at lifecycle events. Config nests three levels: **event → matcher group → handler(s)** [raw/claude-code--rules--hooks-official-docs.md].

Full config example (PreToolUse blocking `rm -rf`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

```bash
#!/bin/bash
# .claude/hooks/block-rm.sh
COMMAND=$(jq -r '.tool_input.command')
if echo "$COMMAND" | grep -q 'rm -rf'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Destructive command blocked by hook"
    }
  }'
else
  exit 0
fi
```
[raw/claude-code--rules--hooks-official-docs.md]

Exit code 0 with no stdout = no decision, normal permission flow continues; a hook can deny but staying silent never approves [raw/claude-code--rules--hooks-official-docs.md]. `jq` must be installed and on `PATH` for these bash examples [raw/claude-code--rules--hooks-official-docs.md].

Hook events (full list) and when they fire:

| Event | Fires |
|---|---|
| `SessionStart` / `SessionEnd` | session begin/resume / terminate |
| `Setup` | `--init-only`, or `--init`/`--maintenance` in `-p` mode |
| `UserPromptSubmit` | prompt submitted, before Claude processes |
| `UserPromptExpansion` | a typed command expands into a prompt (blockable) |
| `PreToolUse` / `PostToolUse` / `PostToolUseFailure` | before/after a tool call (before is blockable) |
| `PermissionRequest` / `PermissionDenied` | permission decision needed / auto-denied |
| `PostToolBatch` | after a parallel batch resolves |
| `Notification`, `MessageDisplay` | notifications / message text display |
| `SubagentStart` / `SubagentStop` | subagent spawned/finished |
| `TaskCreated` / `TaskCompleted` | task list events |
| `Stop` / `StopFailure` | turn ends normally / on API error |
| `TeammateIdle` | agent-team teammate about to idle |
| `InstructionsLoaded` | CLAUDE.md or `.claude/rules/*.md` loaded |
| `ConfigChange` | a config file changes mid-session |
| `CwdChanged`, `DirectoryAdded` | `cd`, `/add-dir` |
| `FileChanged` | a watched file changes on disk |
| `WorktreeCreate` / `WorktreeRemove` | worktree lifecycle |
| `PreCompact` / `PostCompact` | around context compaction |
| `Elicitation` / `ElicitationResult` | MCP server requests user input |
[raw/claude-code--rules--hooks-official-docs.md]

Hook locations by scope: `~/.claude/settings.json` (all projects, not shareable), `.claude/settings.json` (project, shareable), `.claude/settings.local.json` (project, not shareable), managed policy settings (org-wide), plugin `hooks/hooks.json` (while plugin enabled), and skill/agent frontmatter (while component active) [raw/claude-code--rules--hooks-official-docs.md]. Hooks run inside subagents too, carrying `agent_id`/`agent_type` in the input [raw/claude-code--rules--hooks-official-docs.md]. Hook entries **merge** across settings levels rather than replacing [raw/claude-code--rules--hooks-official-docs.md].

Matcher evaluation depends on characters used:

| Matcher | Evaluated as |
|---|---|
| `"*"`, `""`, omitted | match all |
| letters/digits/`_`/`-`/spaces/`,`/`\|` only | exact string or `\|`/`,`-separated list |
| anything else | unanchored JS regex |
[raw/claude-code--rules--hooks-official-docs.md]

Hyphens require v2.1.195+ to be treated as exact-match (before that, hyphenated names like `code-reviewer` were unanchored regex and also matched `senior-code-reviewer`) [raw/claude-code--rules--hooks-official-docs.md]. `FileChanged` and `StopFailure` use a narrower exact-match charset (letters/digits/`_`/`|` only) [raw/claude-code--rules--hooks-official-docs.md].

MCP tool matching: `mcp__<server>__<tool>`, e.g. `mcp__memory__create_entities`. Use `mcp__memory__.*` to match every tool from a server: `.*` is required, a bare `mcp__memory` is treated as an exact string and matches nothing [raw/claude-code--rules--hooks-official-docs.md]. Plugin-bundled MCP servers use `mcp__plugin_<plugin>_<server>__<tool>`: matchers against the bare server key never fire [raw/claude-code--rules--hooks-official-docs.md].

Five handler `type`s: `command` (stdin JSON, exit code + stdout), `http` (POST, same JSON output format in response body), `mcp_tool` (call a connected MCP server tool), `prompt` (single-turn LLM yes/no), `agent` (experimental: subagent with tools for verification) [raw/claude-code--rules--hooks-official-docs.md]. All matching hooks in a group run in parallel; the same handler defined in two settings files runs once, but a plugin/skill copy stays separate [raw/claude-code--rules--hooks-official-docs.md].

Bare `EndConversation` cannot be removed by a bare-name or glob deny rule while any other tool remains, and ask rules never prompt for it [raw/claude-code--rules--hooks-official-docs.md, raw/claude-code--rules--permissions-official-docs.md].

### Permissions

Tiered approval: read-only tools (no prompt in working/additional dirs), Bash (prompt except a built-in read-only allowlist; "don't ask again" saves permanently per-repo+command), file modification (prompt; "don't ask again" lasts until session end only, not saved to disk) [raw/claude-code--rules--permissions-official-docs.md].

Permission modes (`defaultMode` in settings):

| Mode | Behavior |
|---|---|
| `default` (alias `manual`) | prompts on first use of each tool |
| `acceptEdits` | auto-accepts file edits + common fs commands (`mkdir`, `touch`, `mv`, `cp`) in working/additional dirs |
| `plan` | read-only exploration; with auto mode, classifier-approved commands also run |
| `auto` | auto-approves with background safety classifier |
| `dontAsk` | auto-denies unless pre-approved |
| `bypassPermissions` | skips prompts except explicit `ask` rules and a root/home-delete circuit breaker |
[raw/claude-code--rules--permissions-official-docs.md]

Rule evaluation order: **deny → ask → allow**, first match wins regardless of specificity: a broad deny beats a narrow allow [raw/claude-code--rules--permissions-official-docs.md]. A bare tool name in a deny rule (e.g. `Bash`) removes the tool from Claude's context entirely (except `EndConversation`, which can't be fully removed); a scoped rule (`Bash(rm *)`) leaves the tool available and blocks matching calls [raw/claude-code--rules--permissions-official-docs.md]. **Permission rules are enforced by Claude Code, not the model**: CLAUDE.md/prompt instructions don't change what's allowed [raw/claude-code--rules--permissions-official-docs.md].

Rule syntax: `Tool` or `Tool(specifier)`. `Bash(*)` ≡ `Bash`. Parameter matching: `Tool(param:value)` for deny/ask rules only, matches a top-level scalar input field, `*` wildcard supported, can't match a tool's primary content field (`command` for Bash, `file_path` for Read/Edit/Write, `path` for Grep/Glob, `url` for WebFetch: `Bash(command:rm *)` is rejected with a startup warning; use `Bash(rm *)`) [raw/claude-code--rules--permissions-official-docs.md].

Bash wildcards: `*` matches any sequence including spaces; `Bash(ls *)` (space before `*`) enforces a word boundary so it matches `ls -la` but not `lsof`, while `Bash(ls*)` (no space) matches both [raw/claude-code--rules--permissions-official-docs.md]. `:*` suffix ≡ trailing `*` [raw/claude-code--rules--permissions-official-docs.md]. Example config:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)",
      "Bash(git * main)",
      "Bash(* --version)",
      "Bash(* --help *)"
    ],
    "deny": ["Bash(git push *)"]
  }
}
```
[raw/claude-code--rules--permissions-official-docs.md]

Compound-command awareness: separators `&&`, `||`, `;`, `|`, `|&`, `&`, newlines: a rule must match each subcommand independently, so `Bash(safe-cmd *)` does not authorize `safe-cmd && other-cmd` [raw/claude-code--rules--permissions-official-docs.md]. Approving a compound command with "don't ask again" saves a separate rule per subcommand (up to 5) [raw/claude-code--rules--permissions-official-docs.md]. Wrapper stripping before matching: `timeout`, `time`, `nice`, `nohup`, `stdbuf`, `command`, `builtin`, zsh `noglob`, and bare `xargs` (only when flag-free), so `Bash(npm test *)` also matches `timeout 30 npm test`; this list is built-in and not configurable, and explicitly does **not** cover `direnv exec`, `devbox run`, `mise exec`, `npx`, `docker exec` [raw/claude-code--rules--permissions-official-docs.md].

Deny/ask rules accept tool-name globs (`"mcp__*"` matches every MCP tool); allow rules only accept globs after a literal `mcp__<server>__` prefix (`mcp__puppeteer__*`): an unanchored allow glob is skipped with a warning [raw/claude-code--rules--permissions-official-docs.md].

---

## Plugins

A plugin is a self-contained directory (skills, agents, hooks, MCP/LSP servers, monitors, themes), optionally with a `.claude-plugin/plugin.json` manifest, distributed via a marketplace [raw/claude-code--plugins--plugins-official-docs.md, raw/claude-code--plugins--plugins-reference-official-docs.md].

### plugin.json manifest

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
| `description` | Shown in plugin manager |
| `version` | Optional; if set, users only get updates on version bump (except `command` sources); else falls back per version-management rules |
| `author` | Optional, attribution |
[raw/claude-code--plugins--plugins-official-docs.md]

**Common mistake**: only `plugin.json` goes inside `.claude-plugin/`; `commands/`, `agents/`, `skills/`, `hooks/` all live at the plugin root, never nested inside `.claude-plugin/` [raw/claude-code--plugins--plugins-official-docs.md].

### Plugin directory structure

| Directory | Purpose |
|---|---|
| `.claude-plugin/` | `plugin.json` manifest |
| `skills/` | `<name>/SKILL.md` directories (preferred) |
| `commands/` | flat `.md` skill files (legacy; use `skills/` for new plugins) |
| `agents/` | subagent definitions |
| `hooks/` | `hooks.json` |
| `.mcp.json` | MCP server configs |
| `.lsp.json` | LSP server configs |
| `monitors/` | `monitors.json` background monitors |
| `bin/` | executables added to Bash tool's `PATH` while enabled |
| `settings.json` | default settings applied when plugin enabled (`agent`, `subagentStatusLine` keys only) |
[raw/claude-code--plugins--plugins-official-docs.md, raw/claude-code--plugins--plugins-reference-official-docs.md]

A plugin shipping exactly one skill can put `SKILL.md` at the plugin root (set frontmatter `name` explicitly, or the invocation name falls back to the install directory name, which is an unstable version string for marketplace installs) [raw/claude-code--plugins--plugins-reference-official-docs.md].

### Plugin agents (subagent frontmatter subset)

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

Supported fields: `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation` (only valid value `"worktree"`). **Not supported for plugin agents**: `hooks`, `mcpServers`, `permissionMode` (security reasons: copy the file into `.claude/agents/` if you need them) [raw/claude-code--plugins--plugins-reference-official-docs.md, raw/claude-code--agents--sub-agents-official-docs.md].

### Plugin hooks

`hooks/hooks.json` at plugin root, same event set as user hooks (see Rules section above). Example:

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

Plugin hooks targeting the plugin's own bundled MCP server must use scoped names: `mcp__plugin_<plugin>_<server>__<tool>` for matcher/`if`, `plugin:<plugin>:<server>` for an `mcp_tool` hook's `server` field [raw/claude-code--plugins--plugins-reference-official-docs.md].

### Plugin MCP servers

`.mcp.json` at plugin root, standard MCP config, path vars like `${CLAUDE_PLUGIN_ROOT}` supported:

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": { "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data" }
    }
  }
}
```

Starts automatically when plugin enabled; `/reload-plugins` keeps live connections for unchanged server configs [raw/claude-code--plugins--plugins-reference-official-docs.md].

### LSP servers

`.lsp.json` at plugin root or inline `lspServers` in `plugin.json`. Required: `command`, `extensionToLanguage`. Optional: `args`, `transport` (`stdio` default; Claude Code runs all servers over stdio regardless), `env`, `initializationOptions`, `settings`, `workspaceFolder`, `startupTimeout`, `shutdownTimeout`, `restartOnCrash` (default `true`), `maxRestarts`, `diagnostics` (default `true`) [raw/claude-code--plugins--plugins-reference-official-docs.md]. **Gotcha**: `restartOnCrash`/`shutdownTimeout` require v2.1.205+; before that, setting either caused the whole server to be silently skipped at startup [raw/claude-code--plugins--plugins-reference-official-docs.md]. stdout is protocol-only (max 64 KiB header / 32 MiB body): send logs to stderr or Claude Code disconnects the server and counts it as a crash [raw/claude-code--plugins--plugins-reference-official-docs.md]. When two servers claim the same file extension, the first-registered wins and the rest never start [raw/claude-code--plugins--plugins-reference-official-docs.md].

### Monitors (experimental)

`monitors/monitors.json`, array of `{name, command, description, when}`; `when: "always"` (default) or `"on-skill-invoke:<skill>"`. Delivers each stdout line as a notification. Runs only in interactive CLI sessions, unsandboxed at hook trust level. Cannot reference `${user_config.*}` (rejected with an error since it runs through a shell) [raw/claude-code--plugins--plugins-reference-official-docs.md].

### marketplace.json

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

Required top-level fields: `name` (kebab-case, one registration per name), `owner` (`name` required; `email`/`url` optional), `plugins` [raw/claude-code--plugins--plugin-marketplaces-official-docs.md]. Optional: `$schema`, `description`, `version`, `metadata.pluginRoot`, `allowCrossMarketplaceDependenciesOn`, `renames` (map old→new name or `null` for removed, v2.1.193+) [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

Reserved marketplace names, blocked for third parties (16 total, includes `claude-code-marketplace`, `claude-plugins-official`, `claude-plugins-community`, `anthropic-marketplace`, `agent-skills`, `healthcare`, and Anthropic-vertical names like `claude-for-legal`): re-checked on **every load**, not just at add time, so a marketplace can start failing later if a name becomes reserved [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

Plugin entry required fields: `name`, `source`. Optional metadata: `displayName`, `description`, `version`, `author`, `homepage`, `repository`, `license`, `keywords`, `metadata` (free-form, ignored by Claude Code), `category`, `tags`, `strict` (default `true`), `relevance`, `defaultEnabled` (default `true`) [raw/claude-code--plugins--plugin-marketplaces-official-docs.md]. Optional component-path overrides: `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers` (string or array of custom paths) [raw/claude-code--plugins--plugin-marketplaces-official-docs.md].

Plugin source types:

| Source | Fields | Notes |
|---|---|---|
| relative path | `"./my-plugin"` | must start with `./`, resolved from marketplace root (dir containing `.claude-plugin/`), no `../` |
| `github` | `repo`, `ref?`, `sha?` | `owner/repo` |
| `url` | `url`, `ref?`, `sha?` | full git URL, `.git` optional |
| `git-subdir` | `url`, `path`, `ref?`, `sha?` | sparse clone of a monorepo subdir |
| `npm` | `package`, `version?`, `registry?` | `npm install` |
| `archive` | `url`, `sha256?` | zip over HTTPS, no git/npm needed (v2.1.224+) |
| `command` | `command`, `timeout?`, `mode?` | local command produces plugin dir, re-run per session (v2.1.229+) |
[raw/claude-code--plugins--plugin-marketplaces-official-docs.md]

When both `ref` and `sha` are set on a git-based source, `sha` is the effective pin [raw/claude-code--plugins--plugin-marketplaces-official-docs.md]. Marketplace source (where `marketplace.json` itself comes from) and plugin source (where each listed plugin comes from) are independent and pinned separately [raw/claude-code--plugins--plugin-marketplaces-official-docs.md]. Installed plugins are copied into `~/.claude/plugins/cache` except `command` sources in link mode, which are used in place: copied plugins can't reference files outside their own directory via `../`; use symlinks to share files across plugins [raw/claude-code--plugins--plugin-marketplaces-official-docs.md, raw/claude-code--plugins--plugins-official-docs.md]. **Gap**: the raw fetch of plugin-marketplaces cuts off right at the start of the "### Zip archives" subsection (line ~443), so archive-source field details beyond the summary table above weren't captured.

### Test and install workflow

```bash
claude --plugin-dir ./my-plugin          # local dev, repeatable
claude --plugin-dir ./my-plugin.zip      # also accepts a zip
claude --plugin-url https://example.com/my-plugin.zip   # remote zip, session-only
```

`/reload-plugins` picks up changes without restart (skills, agents, hooks, plugin MCP/LSP servers) [raw/claude-code--plugins--plugins-official-docs.md]. `claude plugin init my-tool` scaffolds a plugin directly in `~/.claude/skills/my-tool/`, auto-loaded next session as `my-tool@skills-dir`, no marketplace step [raw/claude-code--plugins--plugins-official-docs.md]. `claude plugin validate ./your-plugin` runs the same check used by the community-marketplace review pipeline; `--strict` turns warnings into failures [raw/claude-code--plugins--plugins-official-docs.md].

Local marketplace walkthrough: full working example:

```text
my-marketplace/.claude-plugin/marketplace.json
my-marketplace/plugins/quality-review-plugin/.claude-plugin/plugin.json
my-marketplace/plugins/quality-review-plugin/skills/quality-review/SKILL.md
```

```bash
/plugin marketplace add ./my-marketplace
/plugin install quality-review-plugin@my-plugins
/reload-plugins   # if install summary says so
/quality-review-plugin:quality-review
```
[raw/claude-code--plugins--plugin-marketplaces-official-docs.md]

### Standalone vs. plugin

| | Standalone (`.claude/`) | Plugin |
|---|---|---|
| Skill name | `/hello` | `/plugin-name:hello` |
| Best for | personal/project-specific, quick iteration | sharing, versioned releases, reuse |
| Hooks location | `settings.json` | `hooks/hooks.json` |
| Sharing | manual copy | `/plugin install` |
[raw/claude-code--plugins--plugins-official-docs.md]

After migrating standalone `.claude/agents/` to a plugin, remove the originals: project/user agent definitions **override** same-named plugin agents, so the plugin copy is inert until you delete the standalone one. Plugin skills, by contrast, are namespaced (`/plugin-name:skill-name`), so the original and plugin copies coexist rather than conflict [raw/claude-code--plugins--plugins-official-docs.md].

---

## Commands

**Commands have been merged into skills.** `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and behave the same; existing `.claude/commands/` files keep working, but skills are the modern path (support supporting-file directories, invocation-control frontmatter, auto-invocation) [raw/claude-code--skills--skills-official-docs.md]. The official `/docs/en/slash-commands` URL now redirects to the skills page for this reason [raw/claude-code--commands--slash-commands-official-docs.md]. If a skill and a `.claude/commands/` file share a name, the **skill wins** [raw/claude-code--skills--skills-official-docs.md].

A command/skill invocation is only recognized at the **start** of a message; trailing text becomes its arguments. As of v2.1.199, skills are an exception: chaining like `/skill-a /skill-b do XYZ` loads every named skill (up to 6) and passes the trailing text to each [raw/claude-code--commands--commands-reference-official-docs.md].

Legacy model (community explainer, consistent with the official merge note): commands lived at `.claude/commands/<name>.md`, purely reactive: no description, Claude can't auto-invoke, one markdown file per command, no metadata [raw/claude-code--commands--slash-commands-official-docs.md]. That's now just the "no frontmatter beyond the basics" case of a skill.

Two special categories in the built-in reference table: **Skill**: a bundled skill, a prompt Claude can also auto-invoke (`/code-review`, `/debug`, `/batch`, `/dataviz`, `/claude-api`); **Workflow**: a bundled dynamic workflow fanning out across background subagents (`/deep-research`) [raw/claude-code--commands--commands-reference-official-docs.md].

Selected built-ins captured before truncation: `/add-dir`, `/advisor`, `/agents` (v2.1.198+: just prints a reminder to ask Claude or edit `.claude/agents/` (wizard removed), `/autocompact`, `/autofix-pr`, `/background` (alias `/bg`), `/batch` (Skill) decomposes large changes into 5-30 units, one background subagent per unit in an isolated worktree, each opens a PR), `/branch`, `/btw`, `/bug` (alias `/share`), `/cd`, `/chrome`, `/claude-api`, `/clear` (aliases `/reset`, `/new`), `/code-review` (alias `/review`; effort levels `low|medium|high|xhigh|max|ultra`; flags `--fix`, `--comment`, `ultra --post`), `/color`, `/compact`, `/config` (alias `/settings`; `key=value` form since v2.1.181), `/context`, `/copy`, `/cost` (alias for `/usage`), `/dataviz`, `/debug`, `/deep-research` (Workflow), `/design-login`, `/design-sync`, `/desktop` (alias `/app`), `/diff` [raw/claude-code--commands--commands-reference-official-docs.md].

**Gap**: `commands-reference-official-docs.md` is contaminated and cut off right after `/diff`: the collection process appended unrelated agentskills.io homepage carousel content and the file ends there. The rest of the command table (`/doctor` through at least `/usage`) was not captured; don't assume the list above is complete.

---

## Agents

"Agents" here means Claude Code **subagents** (in-session delegated workers) and the experimental **agent teams** feature (multi-session coordination). Distinct from Cowork's `subagent_type` launcher used elsewhere in this environment, though the underlying frontmatter model is the same family.

### Built-in subagents

| Agent | Model | Tools | Purpose |
|---|---|---|---|
| Explore | inherits main conversation, capped at Opus on the Claude API (v2.1.198+; was fixed Haiku before) | read-only (no Write/Edit) | file discovery, code search |
| Plan | inherits | read-only | codebase research during plan mode |
| general-purpose | inherits | every subagent-available tool | complex multi-step research + modification |
| claude | inherits | every subagent-available tool | catch-all; default agent for dispatched background sessions |
| statusline-setup | Sonnet | - | `/statusline` configuration |
| claude-code-guide | Haiku | - | questions about Claude Code itself |
[raw/claude-code--agents--sub-agents-official-docs.md]

A user/project subagent named `Explore` overrides the built-in one and keeps its own `model` field, so you can pin it to `haiku` for cost control [raw/claude-code--agents--sub-agents-official-docs.md]. `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` removes just Explore/Plan (v2.1.198+); `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` removes all built-ins in non-interactive/SDK mode [raw/claude-code--agents--sub-agents-official-docs.md]. Explore and Plan skip CLAUDE.md and parent git status for speed; every other subagent (built-in or custom) loads both [raw/claude-code--agents--sub-agents-official-docs.md].

### Subagent scope & precedence

| Location | Priority | Notes |
|---|---|---|
| Managed settings `.claude/agents/` | 1 (highest) | org-wide |
| `--agents` CLI flag (JSON) | 2 | session-only, not saved to disk |
| `.claude/agents/` | 3 | project; discovered walking up to repo root; closest-to-cwd wins on name collision (v2.1.178+) |
| `~/.claude/agents/` | 4 | user, all projects |
| Plugin `agents/` | 5 (lowest) | scoped identifier `plugin-name:agent-name`, or `plugin-name:folder:agent-name` for subfolders |
[raw/claude-code--agents--sub-agents-official-docs.md]

Duplicate `name` within the same directory tree: Claude Code loads only one, chosen by filesystem read order (undocumented): `/doctor` flags duplicates [raw/claude-code--agents--sub-agents-official-docs.md].

### Subagent file format

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

Only `name` and `description` are required. Full frontmatter field table:

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | lowercase + hyphens, unique; can't contain `:` (reserved for plugin scoping); filename need not match |
| `description` | Yes | when Claude should delegate here |
| `tools` | No | inherits all subagent-available tools if omitted; use `skills` (not `Skill` in `tools`) to preload skills |
| `disallowedTools` | No | removes from inherited/specified list |
| `model` | No | `sonnet`, `opus`, `haiku`, `fable`, full model ID, or `inherit` (default) |
| `permissionMode` | No | `default`/`manual` (v2.1.200+ alias), `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`; ignored for plugin agents |
| `maxTurns` | No | cap on agentic turns |
| `skills` | No | preloads full skill content (not just description) at startup |
| `mcpServers` | No | server name ref or inline config; ignored for plugin agents |
| `hooks` | No | scoped to this subagent; ignored for plugin agents |
| `memory` | No | `user`, `project`, or `local`: persistent cross-session learning |
| `background` | No | force background even if Claude requests foreground |
| `effort` | No | `low`/`medium`/`high`/`xhigh`/`max`, overrides session effort |
| `isolation` | No | `worktree`: isolated git worktree, auto-cleaned if no changes made |
| `color` | No | `red`/`blue`/`green`/`yellow`/`purple`/`orange`/`pink`/`cyan` |
| `initialPrompt` | No | (raw fetch cuts off mid-definition: value/behavior not captured) |
[raw/claude-code--agents--sub-agents-official-docs.md]

**Gap**: the frontmatter table is cut off mid-row at `initialProm...` (line ~302, end of file at 303 lines): the `initialPrompt` field's exact behavior, and any fields alphabetically after it, were not captured in the raw research.

`--agents` CLI JSON accepts the same fields plus `prompt` (equivalent to the markdown body): `description`, `prompt`, `tools`, `disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `skills`, `initialPrompt`, `memory`, `effort`, `background`, `isolation`, `color` [raw/claude-code--agents--sub-agents-official-docs.md]:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

A subagent's `cd` doesn't persist across tool calls and doesn't affect the parent's cwd; `isolation: worktree` runs Bash/PowerShell inside the worktree and Claude Code actively blocks commands that redirect git into the main checkout or whose shape can't be verified to stay inside the worktree (v2.1.203+ tightened this; v2.1.210+ extended the check to cover the whole containing repo, not just the launch directory) [raw/claude-code--agents--sub-agents-official-docs.md].

### Agent teams (experimental)

Disabled by default. Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (settings.json `env` or shell) [raw/claude-code--agents--agent-teams-orchestration-official-docs.md]:

```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

One session is team lead; teammates run fully independent sessions with their own context windows and message each other directly (not just report to the lead) [raw/claude-code--agents--agent-teams-orchestration-official-docs.md].

| | Subagents | Agent teams |
|---|---|---|
| Context | own window, results return to caller | own window, fully independent |
| Communication | report to main agent only | teammates message each other |
| Coordination | main agent manages all work | shared task list, self-coordination |
| Token cost | lower | higher (each teammate is a full Claude instance) |
[raw/claude-code--agents--agent-teams-orchestration-official-docs.md]

Display modes: `in-process` (default since v2.1.179; before that `auto`), `auto` (tmux/iTerm2 if already running in one), `tmux`, `iterm2` (v2.1.186+, needs `it2` CLI); set via `teammateMode` in `~/.claude/settings.json` or `--teammate-mode` flag [raw/claude-code--agents--agent-teams-orchestration-official-docs.md]. Teammates don't inherit the lead's `/model` by default: set "Default teammate model" in `/config` [raw/claude-code--agents--agent-teams-orchestration-official-docs.md]. Shared task list has three states (pending/in-progress/completed) plus dependency blocking; claiming uses file locking to prevent races [raw/claude-code--agents--agent-teams-orchestration-official-docs.md]. Quality-gate hooks: `TeammateIdle` (exit 2 to keep working with feedback), `TaskCreated` (exit 2 to block creation) [raw/claude-code--agents--agent-teams-orchestration-official-docs.md]. As of v2.1.178, teammates spawn without a setup step and clean up automatically at session exit; the old `TeamCreate`/`TeamDelete` tools no longer exist [raw/claude-code--agents--agent-teams-orchestration-official-docs.md].

Subagent definitions from any scope are reusable as team members: spawning a teammate can reference a subagent `type`, inheriting its `tools`/`model` with the body appended as extra system-prompt instructions [raw/claude-code--agents--sub-agents-official-docs.md].

---

## Skills

Skills are the current, recommended extension mechanism, superseding the standalone commands model. Claude Code implements the **Agent Skills** open standard (agentskills.io), used across many other tools (Cursor, Gemini CLI, GitHub Copilot, VS Code, ChatGPT/Codex, and dozens more), plus Claude Code:specific extensions (invocation control, subagent execution, dynamic context injection) [raw/claude-code--skills--skills-official-docs.md, raw/claude-code--skills--agentskills-io-spec.md].

### Directory format

```text
my-skill/
├── SKILL.md           # required entrypoint
├── template.md         # optional
├── examples/
│   └── sample.md
└── scripts/
    └── validate.sh
```
[raw/claude-code--skills--skills-official-docs.md]

Locations by scope:

| Location | Path | Applies to |
|---|---|---|
| Enterprise | via managed settings | all org users |
| Personal | `~/.claude/skills/<name>/SKILL.md` | all your projects |
| Project | `.claude/skills/<name>/SKILL.md` | this project |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | where plugin enabled |
[raw/claude-code--skills--skills-official-docs.md]

Name-conflict resolution: enterprise > personal > project; any of these overrides a same-named **bundled** skill; plugin skills are always namespaced (`plugin-name:skill-name`) so they never conflict; a skill beats a `.claude/commands/` file of the same name; any local/plugin skill or command beats a **synced** claude.ai skill of the same name [raw/claude-code--skills--skills-official-docs.md]. Nested `.claude/skills/` in subdirectories load lazily (first file read/edit in that subdir) and register as directory-qualified (`apps/web:deploy`) alongside the root skill of the same name: both stay available, and invoking the unqualified name still appends an instruction to also invoke matching nested variants [raw/claude-code--skills--skills-official-docs.md]. The folder name `synced` is reserved (used for claude.ai account-synced skills) [raw/claude-code--skills--skills-official-docs.md]. A skill folder can itself be a plugin: add `.claude-plugin/plugin.json` inside it and it loads as `<name>@skills-dir` [raw/claude-code--skills--skills-official-docs.md]. `--add-dir` directories' `.claude/skills/` load automatically (an explicit exception, most other `.claude/` config from `--add-dir` does *not* auto-load) [raw/claude-code--skills--skills-official-docs.md].

Live change detection: edits under watched skill directories apply within the current session, no restart, **except** a brand-new top-level skills directory that didn't exist at session start (needs restart) [raw/claude-code--skills--skills-official-docs.md]. For a skill folder that's also a plugin, changes to `hooks/`, `.mcp.json`, `agents/`, `output-styles/` need `/reload-plugins` [raw/claude-code--skills--skills-official-docs.md].

Cowork/cloud sessions do **not** read `~/.claude/skills/` on your machine: they load skills enabled for your claude.ai account (synced at session start) plus project skills committed to the cloned repo; a personal-only skill must be enabled on claude.ai, committed to the repo, or shipped via a plugin declared in the repo's `.claude/settings.json` (repo-declared plugins install at session start; user-settings-only plugins do not transfer) [raw/claude-code--skills--skills-official-docs.md].

### SKILL.md format and frontmatter

```yaml
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points...
```
[raw/claude-code--skills--skills-official-docs.md]

`` !`command` `` lines are dynamic context injection: Claude Code runs the shell command and substitutes its output before Claude ever sees the skill body [raw/claude-code--skills--skills-official-docs.md].

Only `description` is officially recommended/required by Claude Code (so Claude knows when to auto-invoke); everything else is optional [raw/claude-code--skills--skills-official-docs.md]. Fields confirmed present in the raw research:

| Field | Effect |
|---|---|
| `name` | explicit invocation name (optional in Claude Code; falls back to directory name) |
| `description` | when/why to use: this is the auto-invocation trigger text |
| `disable-model-invocation` | `true` prevents Claude from auto-triggering; invoke only via `/name` |
| `allowed-tools` | space-delimited tool pre-authorization list, reduces prompt friction |
| `context: fork` | runs the skill in its own subagent context instead of inline |
| `argument-hint`, `model` | named by Claude Code docs as additional optional frontmatter extensions, but their exact syntax/effect was not captured before the raw fetch truncated |
[raw/claude-code--skills--skills-official-docs.md, raw/claude-code--skills--agentskills-io-production-guide.md]

Boolean frontmatter fields (e.g. `disable-model-invocation`) accept `yes`/`no`/`on`/`off`/`1`/`0` in any letter case, in addition to `true`/`false` (this also applies to plugin skills/commands as of v2.1.218+; before that only `true`/`false` worked) [raw/claude-code--skills--skills-official-docs.md, raw/claude-code--plugins--plugins-reference-official-docs.md]. **Gap**: the raw fetch of `skills-official-docs.md` is truncated mid-sentence right after this boolean-values note (line 324/325): the actual frontmatter reference table promised by the section header ("Frontmatter reference") was never captured. The two-column list above is reconstructed from surrounding prose and examples elsewhere in the same file, not from the missing table itself.

Task-content example (invoke-only, subagent-isolated):

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

Keep skill bodies concise: once loaded, content **stays in context across turns**, so every line is a recurring token cost; state what to do, not how/why [raw/claude-code--skills--skills-official-docs.md].

### Bundled skills

Claude Code ships prompt-based bundled skills (`/doctor`, `/code-review`, `/batch`, `/debug`, `/loop`, `/claude-api`, etc.) available in every session unless `disableBundledSkills` is set (which disables all but `/doctor`) [raw/claude-code--skills--skills-official-docs.md]. `/run`, `/verify`, `/run-skill-generator` work together: `/run-skill-generator` records a per-project launch recipe at `.claude/skills/run-<project>/`, and `/verify` (v2.1.200+) can write its own recorded recipe to `.claude/skills/verify/SKILL.md`, which then replaces the bundled `/verify` at the repo root [raw/claude-code--skills--skills-official-docs.md].

### Community cross-check / conflict note

**CONFLICT**: a community explainer (agentskills.io spec breakdown) claims **five non-negotiable frontmatter fields**: `name` (≤64 chars, kebab-case, must match folder name), `description` (≤1024 chars, an agent-routing trigger phrase, not human prose), `version` (semver), `author`, `triggers` (array, currently only `slash_command` type) [raw/claude-code--skills--agentskills-io-production-guide.md]. This conflicts with Claude Code's own docs, where the only required field is `description` and `name`/`allowed-tools`/`argument-hint`/`model` are optional extensions: the raw file itself flags the discrepancy and says to treat the community summary as describing the general agentskills.io spec, not Claude Code's minimum. **Prefer the official-docs source** [raw/claude-code--skills--agentskills-io-production-guide.md, raw/claude-code--skills--skills-official-docs.md]. Same community source's other advice: no XML tags in skill YAML (breaks parsing), two-space indentation, never hardcode paths (use an env var like `CLAUDE_SKILL_DIR`, differs from Claude Code's own `${CLAUDE_PLUGIN_ROOT}` convention for plugin-shipped skills), scripts should emit JSON not ASCII tables, and implement a "wizard" decision-tree pattern for failure recovery rather than assuming success [raw/claude-code--skills--agentskills-io-production-guide.md].

### Cross-harness portability and plugin skills

Skills are a **cross-tool open standard**: agentskills.io lists Claude Code, Claude (claude.ai), Cursor, Gemini CLI, GitHub Copilot, VS Code, ChatGPT & Codex, JetBrains Junie, OpenCode, OpenHands, Amp, Goose, Roo Code, Factory, Kiro, and ~15 more as consumers of the same `SKILL.md` format [raw/claude-code--skills--agentskills-io-spec.md]. A skill using only the lowest-common-denominator shape (`description` frontmatter + plain markdown body, no `context: fork`/`!` injection/`${CLAUDE_PLUGIN_ROOT}`) should in principle load elsewhere, but the raw sources don't verify field-by-field compatibility for any specific non-Claude-Code tool: treat portability as untested per-tool.

Plugins add skills via `skills/<name>/SKILL.md` (preferred) or flat `commands/<name>.md` (legacy); both auto-discovered on install, namespaced `/plugin-name:skill-name` [raw/claude-code--plugins--plugins-official-docs.md]. `$ARGUMENTS` captures trailing user text passed into the skill body, e.g. `Greet the user named "$ARGUMENTS" warmly` [raw/claude-code--plugins--plugins-official-docs.md].

---

## SUPPLEMENT: gap fixes from full refetch (2026-08-14)

The original raw fetches of the skills and sub-agents pages were truncated. Full refetches are archived at [raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md] and [raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md]. Corrections and completions below override anything conflicting above.

### Complete SKILL.md frontmatter field list (Claude Code)
ALL fields optional; only `description` is recommended. Fields: `name` (display name, defaults to directory name; for plugin skills sets last command segment), `description` (combined with when_to_use, truncated at 1,536 chars in listing), `when_to_use`, `argument-hint`, `arguments` (named positional args for $name substitution), `disable-model-invocation` (bool), `user-invocable` (bool, default true), `allowed-tools` (space/comma/YAML list; pre-approved for the invoking turn only), `disallowed-tools`, `model` (aliases sonnet/opus/haiku/fable, full ID, or inherit), `effort` (low|medium|high|xhigh|max), `context` (`fork` = run in subagent), `agent` (subagent type when context: fork), `background` (bool, with fork; default true), `hooks`, `paths` (glob activation scoping), `shell` (bash|powershell), `metadata` (free-form YAML map), `license`, `compatibility` (string <=500 chars). [raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md]

### Portability-critical rule
Outside Claude Code (claude.ai uploads, Skills API, package_skill.py packaging, and therefore Cowork account-synced skills), ONLY the six Agent Skills spec fields are allowed: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other field causes a HARD ERROR on packaging/upload: "Unexpected key(s) in SKILL.md frontmatter". Claude Code accepts all six spec fields, so spec-compliant frontmatter loads everywhere. [raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md]

### String substitutions available in skill bodies
`$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `$name` (declared via `arguments`), `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_PLUGIN_ROOT}` (plugin skills only), `${CLAUDE_PLUGIN_DATA}` (plugin skills only). `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PROJECT_DIR}` substitute in both markdown content AND Bash rules in `allowed-tools`. [raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md]

### Skill locations and precedence (complete)
Enterprise > personal (~/.claude/skills/) > project (.claude/skills/) > bundled; plugin skills namespaced plugin-name:skill-name; skill beats same-name .claude/commands file; any local level beats claude.ai-synced skill. Nested .claude/skills/ in subdirectories load lazily on first file touch, get directory-qualified names (apps/web:deploy). `synced` is a reserved folder name. Live change detection watches skill dirs within a session (SKILL.md text only). Cowork and cloud sessions do NOT read ~/.claude/skills/; they load skills enabled on the claude.ai account, synced at session start. In Cowork, every !` command line in a skill body is replaced with the disableSkillShellExecution placeholder. [raw/claude-code--skills--skills-official-docs-SUPPLEMENT-full.md]

### Complete subagent frontmatter field list (Claude Code)
Required: `name` (lowercase+hyphens, no `:`), `description`. Optional: `tools` (allowlist; also Agent(type) restriction syntax for --agent main threads), `disallowedTools` (denylist, applied before tools), `model` (sonnet|opus|haiku|fable|full-ID|inherit, default inherit), `permissionMode` (default|acceptEdits|auto|dontAsk|bypassPermissions|plan|manual), `maxTurns`, `skills` (preload full skill content at startup; cannot preload disable-model-invocation skills), `mcpServers` (inline defs or name references; scoped to subagent), `hooks` (lifecycle hooks scoped to subagent), `memory` (user|project|local persistent memory dirs under .claude/agent-memory/), `background` (bool), `effort`, `isolation` (`worktree` = temp git worktree), `color`, `initialPrompt`. Plugin subagents IGNORE `hooks`, `mcpServers`, `permissionMode` for security. Subagent locations/priority: managed settings (1) > --agents CLI JSON (2) > .claude/agents/ project (3) > ~/.claude/agents/ user (4) > plugin agents/ (5). Scanned recursively; plugin subfolder paths become scoped IDs (my-plugin:review:security). Subagents receive ONLY their system prompt body + basic env, not the full Claude Code system prompt. /agents wizard removed in v2.1.198+ (edit files directly). [raw/claude-code--agents--sub-agents-official-docs-SUPPLEMENT-full.md]

---

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

---

# ChatGPT Codex: distilled research (fetched 2026-08-14)

Sources are 15 raw files under `raw/codex--*.md`. Every claim below cites its source file. Conflicts between sources are called out explicitly rather than silently resolved.

## Rules

Codex's "rules" layer is three separate systems: `AGENTS.md` (project guidance), `config.toml` (settings/precedence), and sandbox/approvals/permissions (security).

### AGENTS.md: format and locations

Plain Markdown. No YAML frontmatter, no required fields, no `@import` syntax in the base spec [raw/codex--rules--agents-md-standard.md]. Filename must be exact uppercase `AGENTS.md` [raw/codex--rules--agents-md-hierarchy-community.md].

| Scope | Path |
| --- | --- |
| Global | `~/.codex/AGENTS.md` |
| Project root | `./AGENTS.md` |
| Nested/directory | `<dir>/AGENTS.md` (any subdirectory) |
| Personal override | `AGENTS.override.md` (same directory; if present, the sibling `AGENTS.md` in that directory is skipped entirely) |

[raw/codex--rules--agents-md-hierarchy-community.md]

Codex supports fallback filenames via `project_doc_fallback_filenames` (checked only when no `AGENTS.md`/`AGENTS.override.md` is found), and a max size via `project_doc_max_bytes`. **Conflict:** agentconfig.ing states the default is 64KB; ccmd.dev states the base-spec cap is 32 KiB: unresolved in the raw research [raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--agents-md-standard.md].

### Merge behavior: closest-wins vs. concatenation discrepancy

This is the highest-impact gotcha in the Codex rules surface, and it's an **open, unresolved discrepancy** between the base AGENTS.md standard and OpenAI's own Codex docs:

- **agents.md site FAQ (base spec):** "The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything." Framed as single-file selection, no merge [raw/codex--rules--agents-md-standard.md].
- **Codex CLI docs (per community quotation):** "Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt." [raw/codex--rules--agents-md-standard.md, raw/codex--rules--agents-md-hierarchy-community.md]

Mechanics (community-sourced, cross-checked across two write-ups): Codex CLI walks from Git root to cwd and concatenates **all** `AGENTS.md` files found along the path, joined by blank lines; each file is injected as its own user-role message headed `# AGENTS.md instructions for <path>`; precedence comes from *prompt order* (later = wins), not file selection; token cost scales with directory depth [raw/codex--rules--agents-md-hierarchy-community.md].

**Cross-harness contrast:** GitHub Copilot uses nearest-ancestor-only resolution (walks up, uses only the first file found, ignores parents): the opposite of Codex. Cursor and Claude Code implement neither Codex's nested concatenation nor Copilot's ancestor walk in this way; a subdirectory-only `AGENTS.md` is invisible to them. Flagged as "the most common drift" when teams assume uniform behavior [raw/codex--rules--agents-md-hierarchy-community.md].

The open GitHub issue (agentsmd/agents.md#53) lists three possible readings: Codex is out of spec; concatenation is intentional and the base spec needs updating; concatenation is optional/configurable, with no resolution recorded in the raw research [raw/codex--rules--agents-md-hierarchy-community.md].

**Portability:** AGENTS.md is an open standard (Agentic AI Foundation / Linux Foundation) adopted by Codex, GitHub Copilot, Amp, Jules, Cursor, Factory, UiPath, 60,000+ repos. Aider reads it via `.aider.conf.yml` (`read: AGENTS.md`); Gemini CLI via `.gemini/settings.json` (`{"context": {"fileName": "AGENTS.md"}}`) [raw/codex--rules--agents-md-standard.md].

### AGENTS.md content conventions

Popular sections (none required): Project overview, Build/test commands, Code style, Testing instructions, Security considerations, PR instructions [raw/codex--rules--agents-md-standard.md].

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

For GitHub PR review, add a `## Code Review Rules` section (use `###` subheadings per check group). Root-wide rules go in root `AGENTS.md`; service-specific rules go in a nested file (e.g. `services/experiment_reporting/AGENTS.md`); Codex applies root plus the closest more-specific file per changed file [raw/codex--agents--github-code-review.md]:

```md
## Code Review Rules
### Experiment cohorts
- Do not filter treatment comparisons on post-exposure behavior, including conversion or retention.
  Safe path: build cohorts from assignment or exposure; report conversion as an outcome.
```
[raw/codex--agents--github-code-review.md]

Migration shim: `mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md` [raw/codex--rules--agents-md-standard.md].

### config.toml: locations and precedence

| Location | Scope |
| --- | --- |
| `~/.codex/config.toml` | User-level defaults |
| `.codex/config.toml` (repo) | Project override, loaded **only when trusted** |
| `$CODEX_HOME/profile-name.config.toml` | Named profile (`--profile profile-name`) |
| `/etc/codex/config.toml` (Unix) | System config |

[raw/codex--rules--config-basic.md, raw/codex--rules--config-reference.md]

**Precedence, highest to lowest:** (1) CLI flags / `--config`/`-c`; (2) project `.codex/config.toml`, root→cwd, closest wins, trusted only; (3) profile files; (4) user config; (5) system config; (6) built-in defaults [raw/codex--rules--config-basic.md].

If a project is untrusted, Codex skips **all** project `.codex/` layers (config, hooks, rules together); user/system config still loads [raw/codex--rules--config-basic.md].

**Gotcha:** project-local `.codex/config.toml` cannot override machine-local/auth/telemetry keys: Codex silently ignores these if set there: `openai_base_url`, `chatgpt_base_url`, `apps_mcp_product_sku`, `model_provider`, `model_providers`, `notify`, `profile`, `profiles`, `experimental_realtime_ws_base_url`, `otel`. Put those in user-level config [raw/codex--rules--config-reference.md]. Enterprises can further constrain via `requirements.toml` (e.g. disallow `approval_policy = "never"`) [raw/codex--rules--config-basic.md].

### config.toml: selected key reference

| Key | Type | Notes |
| --- | --- | --- |
| `model` | string | e.g. `"gpt-5.6"` |
| `approval_policy` | string | `untrusted` \| `on-request` \| `never` \| `{ granular = {...} }` |
| `sandbox_mode` | string | `read-only` \| `workspace-write` \| `danger-full-access` |
| `web_search` | string | `cached` (default) \| `indexed` \| `live` \| `disabled` |
| `model_reasoning_effort` | string | e.g. `"high"` |
| `personality` | string | `none` \| `friendly` \| `pragmatic` |
| `log_dir` | path | defaults to `$CODEX_HOME/log` |
| `sqlite_home` | path | SQLite state DB directory |
| `model_instructions_file` | path | replaces built-in instructions instead of `AGENTS.md` |
| `default_permissions` | string | names a `[permissions.<name>]` profile (beta) |
| `sandbox_workspace_write.network_access` | bool | allow network in workspace-write |
| `sandbox_workspace_write.writable_roots` | array | extra writable roots |
| `[shell_environment_policy].include_only` | array | e.g. `["PATH", "HOME"]` |
| `skills.config[].path` / `.enabled` | path/bool | per-skill enable overrides |
| `apps.<id>.enabled` | bool | per-connector enable |
| `mcp_servers.<name>.*` | table | see Plugins section |
| `agents.<role>.description` / `.config_file` | string/path | custom subagent roles |
| `hooks.<Event>` | array | inline hook config |
| `otel.exporter` | string | `none` \| `otlp-http` \| `otlp-grpc` |

[raw/codex--rules--config-basic.md, raw/codex--rules--config-reference.md]: reference file notes it captures "the majority" of a 150+ key live page, truncated for length [raw/codex--rules--config-reference.md].

### Feature flags (`[features]`)

| Key | Default | Maturity |
| --- | --- | --- |
| `apps`, `goals`, `hooks`, `fast_mode`, `multi_agent`, `personality`, `remote_plugin`, `shell_snapshot`, `shell_tool` | true | Stable |
| `unified_exec` | true (not Windows) | Stable |
| `memories` | false | Experimental |
| `web_search` | true | **Deprecated**: prefer top-level `web_search` |
| `web_search_cached` / `web_search_request` | false | **Deprecated** legacy toggles |
| `network_proxy` | - | table/bool, see Network access |

`hooks` canonical key; `codex_hooks` deprecated alias. Enable: `feature_name = true` under `[features]`, or `codex --enable feature_name` (repeatable) [raw/codex--rules--config-basic.md].

### Sandbox and approvals

Two independent layers: **sandbox mode** (what Codex can do: write scope, network) and **approval policy** (when it must stop and ask). Cloud runs in isolated containers, two-phase (setup has network, agent phase offline by default); CLI/IDE use OS sandboxing (Seatbelt/macOS, bwrap+seccomp or Landlock/Linux, native or WSL2-inherited/Windows) [raw/codex--rules--agent-approvals-security.md].

| Preset | Flags | Effect |
| --- | --- | --- |
| Auto (default) | `--sandbox workspace-write --ask-for-approval on-request` | Read/edit/run in workspace; asks for outside-workspace edits or network |
| Safe read-only | `--sandbox read-only --ask-for-approval on-request` | Read only; asks before edits/commands/network |
| CI read-only | `--sandbox read-only --ask-for-approval never` | Read only, never asks |
| Auto-edit | `--sandbox workspace-write --ask-for-approval untrusted` | Reads/edits automatically; asks before untrusted commands |
| Auto-review | `... on-request -c approvals_reviewer=auto_review` | Same boundary as on-request; reviewer agent (not user) evaluates eligible approvals |
| Full danger | `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) | No sandbox, no approvals |

[raw/codex--rules--agent-approvals-security.md]

```toml
approval_policy = "untrusted"
sandbox_mode    = "read-only"
allow_login_shell = false

[sandbox_workspace_write]
network_access = true

# approval_policy = { granular = { sandbox_approval = true, rules = true,
#   mcp_elicitations = true, request_permissions = false, skill_approval = false } }
```
Granular categories: `sandbox_approval`, `rules` (execpolicy prompts), `mcp_elicitations`, `request_permissions`, `skill_approval` [raw/codex--rules--agent-approvals-security.md].

**Protected paths inside a writable root** (enforced even under `workspace-write`): `<root>/.git` (read-only, recursive, resolved through `gitdir:` pointers), `<root>/.agents` (read-only if a directory), `<root>/.codex` (read-only if a directory) [raw/codex--rules--agent-approvals-security.md].

**Network access** is off by default in `workspace-write`; enabling it doesn't restrict destinations unless `features.network_proxy` is also on:
```toml
[sandbox_workspace_write]
network_access = true
[features.network_proxy]
enabled = true
domains = { "api.openai.com" = "allow", "example.com" = "deny" }
```
Semantics: exact host matches only itself; `*.example.com` = subdomains only; `**.example.com` = apex + subdomains; global `*` valid only as allow; `deny` always wins. Local/private destinations blocked by default (`allow_local_binding = false`); DNS rebinding mitigated via resolve-then-classify (failed/timed-out lookups and non-public resolutions are blocked) [raw/codex--rules--agent-approvals-security.md].

### Permission profiles (beta): two mutually exclusive permission systems

Permission profiles (`default_permissions` + `[permissions.*]`) do **not** compose with the older `sandbox_mode`/`sandbox_workspace_write`: configure one or the other. If `sandbox_mode` appears in *any* loaded layer, via `--sandbox`, or via the active `--profile`, Codex uses the older sandbox system even if a permission profile is also set. Only managed `allowed_permission_profiles` forces the new system on [raw/codex--rules--permissions.md].

Built-ins: `:read-only`, `:workspace` (writes inside workspace roots + system temp), `:danger-full-access`. Custom profile example:
```toml
default_permissions = "project-edit"

[permissions.project-edit.workspace_roots]
"~/code/app" = true

[permissions.project-edit.filesystem]
":minimal" = "read"

[permissions.project-edit.filesystem.":workspace_roots"]
"." = "write"
"**/*.env" = "deny"

[permissions.project-edit.network]
enabled = true

[permissions.project-edit.network.domains]
"api.openai.com" = "allow"
"*.github.com" = "allow"
```
[raw/codex--rules--permissions.md]

Filesystem precedence: more specific path wins; same-path conflict `deny` > `write` > `read`. Path tokens: `:root`, `:minimal`, `:workspace_roots`, `:tmpdir`, `:slash_tmp`, plus absolute/`~` paths. A profile can `extends` `:read-only`, `:workspace`, or another named profile: **not** `:danger-full-access`; cycles/unknown parents rejected [raw/codex--rules--permissions.md].

### Monitoring

OpenTelemetry opt-in, off by default:
```toml
[otel]
environment = "staging"
exporter = "none"          # none | otlp-http | otlp-grpc
log_user_prompt = false
```
Keep `log_user_prompt = false` unless policy explicitly allows storing prompt text [raw/codex--rules--agent-approvals-security.md].

## Plugins

### Skills vs. plugins

Skills are the **authoring format**; plugins are the **installable distribution unit**. Iterate locally as a skill folder; package as a plugin to share across teams, bundle MCP config, ship lifecycle hooks, or publish a stable version [raw/codex--plugins--build-plugins.md, raw/codex--multiple--customization-overview.md].

### Scaffolding with `@plugin-creator`

Built-in `@plugin-creator` scaffolds `.codex-plugin/plugin.json` and can generate a local marketplace entry. For MCP-backed dev-mode ChatGPT apps: enable Developer mode, create the app, copy its ID (`plugin_asdk_app...`), then prompt `@plugin-creator create a Codex plugin for my ChatGPT app. Use plugin_asdk_app_... and name it Acme Support. Include a personal marketplace entry so I can test it locally.` [raw/codex--plugins--build-plugins.md]

### Manual plugin structure

```bash
mkdir -p my-first-plugin/.codex-plugin
```
`my-first-plugin/.codex-plugin/plugin.json` (minimal):
```json
{ "name": "my-first-plugin", "version": "1.0.0", "description": "Reusable greeting workflow", "skills": "./skills/" }
```
`my-first-plugin/skills/hello/SKILL.md`:
```md
---
name: hello
description: Greet the user with a friendly message.
---
Greet the user warmly and ask how you can help.
```
[raw/codex--plugins--build-plugins.md]

### Manifest field reference (`.codex-plugin/plugin.json`)

| Field | Purpose |
| --- | --- |
| `name` (kebab-case) | Plugin identifier / namespace |
| `version`, `description` | Basic identity |
| `author.{name,email,url}`, `homepage`, `repository`, `license`, `keywords` | Publisher/discovery metadata |
| `skills` | Path to skills dir, `./`-prefixed |
| `mcpServers` | Path to `.mcp.json` bundle |
| `apps` | Path to `.app.json` connector references |
| `hooks` | Path(s) or inline object(s); default `./hooks/hooks.json` auto-detected |
| `interface.*` | `displayName`, `shortDescription`, `longDescription`, `developerName`, `category`, `capabilities`, URLs, `defaultPrompt` (array), `brandColor`, `composerIcon`, `logo`, `screenshots` |

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

### Marketplaces

| Marketplace | Path | Plugins live under |
| --- | --- | --- |
| Repo | `$REPO_ROOT/.agents/plugins/marketplace.json` | `$REPO_ROOT/plugins/` |
| Personal | `~/.agents/plugins/marketplace.json` | `~/.codex/plugins/` |
| Legacy-compatible | `$REPO_ROOT/.claude-plugin/marketplace.json` | (also read by ChatGPT desktop app) |

[raw/codex--plugins--build-plugins.md]

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
Rules: top-level `name` identifies the marketplace; `interface.displayName` is the shown title; `source.path` relative, `./`-prefixed; local `source` can be a plain string; always set `policy.installation` (`AVAILABLE`|`INSTALLED_BY_DEFAULT`|`NOT_AVAILABLE`), `policy.authentication`, `category` [raw/codex--plugins--build-plugins.md].

Other source types: `"source": "git-subdir"` (`url`, `path`, `ref`/`sha`) for a plugin in a subdirectory of a git repo, `"url"` for one at repo root; `"source": "npm"` (`package` required, `version` optional range/tag, `registry` optional HTTPS): no lifecycle scripts run, requires local `npm` [raw/codex--plugins--build-plugins.md].

```bash
codex plugin marketplace add owner/repo [--ref main]
codex plugin marketplace add https://github.com/example/plugins.git --sparse .agents/plugins
codex plugin marketplace add ./local-marketplace-root
codex plugin marketplace list | upgrade [name] | remove name
```
Installed plugin cache: `~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/` (`local` for local plugins); enable/disable state lives in `~/.codex/config.toml`. Admins can disable sharing: `requirements.toml` → `features.plugin_sharing = false` [raw/codex--plugins--build-plugins.md].

### Bundled MCP servers inside a plugin

`.mcp.json` accepts a flat map (`{ "docs": {...} }`) or wrapped `{ "mcp_servers": {...} }`. Users tune on/off state and approval policy without editing the plugin:
```toml
[plugins."my-plugin".mcp_servers.docs]
enabled = true
default_tools_approval_mode = "prompt"
enabled_tools = ["search"]

[plugins."my-plugin".mcp_servers.docs.tools.search]
approval_mode = "approve"
```
[raw/codex--plugins--build-plugins.md, raw/codex--plugins--mcp.md]

### MCP: config location and structure

MCP config lives in `config.toml` (`~/.codex/config.toml`, or `.codex/config.toml` for trusted projects); the ChatGPT desktop app, Codex CLI, and IDE extension **share** it [raw/codex--plugins--mcp.md].

**TOML trap.** Codex uses TOML, not JSON, for MCP config: pasting a Claude Code/Cursor-style `mcpServers` JSON block silently fails. Correct root key is `mcp_servers` (underscore), not `mcp.servers`/`mcp-servers` [raw/codex--plugins--mcp.md].

```bash
codex mcp add <server-name> --env VAR1=VALUE1 -- <stdio server-command>
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp list
codex mcp login <server>
```
No `enable`/`disable` CLI subcommand as of research date: toggle `enabled` by hand. `/mcp` in the TUI shows active servers [raw/codex--plugins--mcp.md].

STDIO keys: `command` (required), `args`, `env`, `env_vars` (plain names or `{ name = "REMOTE_TOKEN", source = "remote" }`), `cwd`, `experimental_environment` (`remote`). HTTP keys: `url` (required), `auth` (`oauth` default | `chatgpt`), `bearer_token_env_var`, `http_headers`, `env_http_headers`. Shared: `startup_timeout_sec` (default 10), `tool_timeout_sec` (default 60), `enabled`, `required` (fail startup if unreachable: `codex exec` exits with an error), `enabled_tools`/`disabled_tools` (deny applied after allow), `default_tools_approval_mode` (`auto`|`prompt`|`writes`|`approve`), `tools.<tool>.approval_mode` [raw/codex--plugins--mcp.md, raw/codex--agents--noninteractive-exec.md].

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
env_vars = ["LOCAL_TOKEN"]

[mcp_servers.context7.env]
MY_ENV_VAR = "MY_ENV_VALUE"

[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"

[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
enabled_tools = ["open", "screenshot"]
default_tools_approval_mode = "prompt"
startup_timeout_sec = 20

[mcp_servers.chrome_devtools.tools.open]
approval_mode = "approve"
```
[raw/codex--plugins--mcp.md]

**Cloud has no MCP.** MCP does not work in Codex cloud as of the research date (open feature request): only CLI, IDE extension, and desktop app read the shared local `config.toml` [raw/codex--plugins--mcp.md]. Other gotchas: transport inferred implicitly (`command`=stdio, `url`=HTTP; both present is an error); `codex mcp add` can't set `oauth_resource` (manual TOML edit needed); cold `npx` installs can exceed the 10s startup timeout; missing bearer-token env var → 401; some servers connect but expose zero tools (known handshake bug) [raw/codex--plugins--mcp.md].

### Hooks

| When | Events |
| --- | --- |
| During a turn | `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop` |
| Session/subagent start | `SessionStart`, `SubagentStart` |
| Main thread ends | `SessionEnd` (never fires for subagents) |

[raw/codex--plugins--hooks.md]

Discovery locations: `~/.codex/hooks.json`, `~/.codex/config.toml` (`[hooks]`), `<project>/.codex/hooks.json`, `<project>/.codex/config.toml`. All matching hooks from all sources run: higher layers add, they don't replace. One layer with both `hooks.json` and inline `[hooks]` gets merged with a startup warning. Project-local hooks load only in trusted projects; untrusted projects still get user/system hooks [raw/codex--plugins--hooks.md].

**Trust model:** non-managed command hooks require explicit review/trust (`/hooks` in CLI), keyed to the hook's hash: edits re-trigger review. Managed hooks (system/MDM/cloud/`requirements.toml`) are auto-trusted, can't be user-disabled. One-off bypass: `--dangerously-bypass-hook-trust` [raw/codex--plugins--hooks.md].

Shape: event → matcher group → handlers:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py\"", "statusMessage": "Checking Bash command" }]
    }]
  }
}
```
Equivalent inline TOML uses `[[hooks.PreToolUse]]` / `matcher = "^Bash$"` / `[[hooks.PreToolUse.hooks]]` / `type = "command"` blocks [raw/codex--plugins--hooks.md].

Handler fields: `timeout` (seconds; default 600, `SessionEnd` default 1/max 3), `statusMessage`, `commandWindows` (Windows override, TOML alias `command_windows`), `async` (parsed, not yet functional). Only `type: "command"` executes; `prompt`/`agent` types parsed but skipped [raw/codex--plugins--hooks.md].

Matcher (regex; `"*"`/`""`/omission = match all):

| Event | Matcher filters |
| --- | --- |
| `PreToolUse` / `PermissionRequest` / `PostToolUse` | tool name: `Bash`, `apply_patch` (aliases `Edit`/`Write`), MCP names e.g. `mcp__filesystem__read_file` |
| `PreCompact` / `PostCompact` | `manual` or `auto` |
| `SessionStart` | `startup`, `resume`, `clear`, `compact` |
| `SubagentStart` / `SubagentStop` | subagent type |
| `SessionEnd` | end reason (currently always `other`) |
| `UserPromptSubmit` / `Stop` | not supported |

Shell commands and unified exec both match as `Bash`; hosted tools (e.g. `WebSearch`) are **not** covered by `PreToolUse`/`PostToolUse` [raw/codex--plugins--hooks.md].

Disable: `[features] hooks = false` (`codex_hooks` deprecated alias). Enterprise-managed hooks via `requirements.toml`:
```toml
allow_managed_hooks_only = true
[features]
hooks = true
[hooks]
managed_dir = "/enterprise/hooks"
windows_managed_dir = 'C:\enterprise\hooks'
[[hooks.PreToolUse]]
matcher = "^Bash$"
[[hooks.PreToolUse.hooks]]
type = "command"
command = "python3 /enterprise/hooks/pre_tool_use_policy.py"
```
`allow_managed_hooks_only = true` ignores user/project/session/plugin hooks entirely, keeping only admin-managed ones [raw/codex--plugins--hooks.md].

Plugin-bundled hooks default to `hooks/hooks.json` in the plugin root; a manifest `hooks` entry overrides. Commands receive `PLUGIN_ROOT`/`PLUGIN_DATA` plus `CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA` for cross-compat. **Installing a plugin does not auto-trust its hooks** [raw/codex--plugins--hooks.md, raw/codex--plugins--build-plugins.md].

I/O: every command hook gets JSON stdin with `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `model` (+`turn_id`, `permission_mode` for most events). Output: `{ "continue": true, "stopReason": "...", "systemMessage": "...", "suppressOutput": false }`. Exit 0 + no output = success. `PreToolUse`/`PermissionRequest` only honor `systemMessage`; `PostToolUse` honors `systemMessage`, `continue: false`, `stopReason`. Output over ~2,500 tokens is written to `<temp_dir>/hook_outputs/<session_id>/<hook>.txt` with a head/tail preview: avoid secrets in hook output [raw/codex--plugins--hooks.md].

**Gap:** per-event field tables for `PostToolUse`, `PreCompact`/`PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop`, and the full wire schema were on the live page but not captured in this fetch [raw/codex--plugins--hooks.md].

## Commands

**Custom prompts are deprecated.** Official guidance: "Use skills for reusable instructions that Codex can invoke explicitly or implicitly" [raw/codex--commands--custom-prompts.md]. Maintainer confirmation on GitHub issue #7047: "We have decided to deprecate support for custom prompts. We recommend switching to skills, which provide all of the functionality of custom prompts and more." [raw/codex--commands--custom-prompts.md]

Documented here for migration/portability only: new work should use Skills.

### Format (while still supported)

Location: `$CODEX_HOME/prompts` (default `~/.codex/prompts`). Only top-level `.md` files load (case-insensitive); subdirectories not scanned. Filename (minus `.md`) becomes the command name, invoked `/prompts:<name>` [raw/codex--commands--custom-prompts.md].

`~/.codex/prompts/draftpr.md`:
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
Invoke: `/prompts:draftpr FILES="src/pages/index.astro" PR_TITLE="Add hero animation"`. Restart Codex after editing prompt files [raw/codex--commands--custom-prompts.md].

### Frontmatter and argument syntax

`description` (shown in the popup), `argument-hint` (documents `KEY=<value>` params). Two mutually exclusive, auto-detected argument styles:

1. **Named** (recommended): `$NAME` where `NAME` matches `[A-Z][A-Z0-9_]*`; invoke `key=value` (shlex-parsed, quote values with spaces). Missing required named args → composer errors instead of submitting.
2. **Positional**: `$1`-`$9`, `$ARGUMENTS` (all joined by space). Presence of any numeric placeholder triggers positional-mode detection.

`$$` emits a literal `$`. Parsing lives in `codex-rs/tui/src/bottom_pane/prompt_args.rs`: `parse_slash_name`, `expand_custom_prompt`, `parse_prompt_inputs`, `parse_positional_args` [raw/codex--commands--custom-prompts.md].

### Known bugs

Issue #7047: `$ARGUMENTS` fails to resolve when a pasted argument collapses into a `[Pasted Content N chars]` composer indicator: the command stays literal text. Issue #15941 (secondhand): prompts in `~/.codex/prompts` reportedly not appearing after some CLI updates [raw/codex--commands--custom-prompts.md].

### Portability

The `$1`-`$9`/`$ARGUMENTS`/`$NAME`/`$$` convention is the same family as Claude Code's slash-command variables (`$ARGUMENTS`, `$1`): cross-tool command authoring is conceptually portable even though the Codex mechanism itself is being phased out [raw/codex--commands--custom-prompts.md].

## Agents

Spans four raw files: delegation model, cloud environments, GitHub code review, non-interactive `codex exec`.

### Delegation model

Codex customization is five complementary layers: `AGENTS.md` (persistent instructions), Memories (context learned from prior work), Skills (reusable workflows), MCP (external tools), Subagents (delegation) [raw/codex--multiple--customization-overview.md].

Recommended build order: (1) `AGENTS.md` + pre-commit hooks/linters, (2) install a plugin if one exists, else author a skill and package it later, (3) MCP once workflows need external systems, (4) subagents once ready to delegate noisy/specialized tasks [raw/codex--multiple--customization-overview.md].

"You can create different agents with different roles and prompt them to use tools differently... Each subagent stays focused and uses the right tools for its job" [raw/codex--multiple--customization-overview.md]. Config surface: `agents.enabled`, `agents.max_concurrent_threads_per_session` (legacy alias `agents.max_threads`), `agents.default_subagent_model`/`.default_subagent_reasoning_effort`, `agents.interrupt_message`, per-role `agents.<role>.description`/`.config_file` (relative paths resolve from the declaring config file) [raw/codex--rules--config-reference.md]. MCP-backed skill dependencies are declared in `agents/openai.yaml` for auto-install/wiring [raw/codex--multiple--customization-overview.md].

Three delegation mechanisms: `codex exec` (non-interactive scripting), in-session subagents, `codex cloud` (remote OpenAI-managed environment, browsable from the terminal). All three CLI/IDE/web surfaces share one agent and the same Codex Cloud [raw/codex--agents--noninteractive-exec.md].

### Non-interactive mode (`codex exec`)

Use cases: CI pipelines, pre-merge checks, scheduled jobs, piping output into other tools [raw/codex--agents--noninteractive-exec.md].

```bash
codex exec "summarize the repository structure and list the top 5 risky areas"
codex exec --ephemeral "triage this repository"          # don't persist rollout files
codex exec --json "summarize the repo structure" | jq    # JSONL event stream
codex exec -o ./project-metadata.json --output-schema ./schema.json "Extract project metadata"
codex exec resume --last "fix the race conditions you found"
```
Defaults to a **read-only sandbox**; automation should set explicit least privilege: `codex exec --sandbox workspace-write "<prompt>"` or `--sandbox danger-full-access` (isolated runner only). `codex exec --full-auto` is **deprecated**: prefer explicit `--sandbox workspace-write` [raw/codex--agents--noninteractive-exec.md].

Other flags: `--ignore-user-config` (skip `$CODEX_HOME/config.toml`), `--ignore-rules` (skip execpolicy `.rules`), `--skip-git-repo-check` (Codex normally requires a git repo to prevent destructive changes) [raw/codex--agents--noninteractive-exec.md].

`--json` emits JSONL: event types `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, `item.*`, `error`; item types include agent messages, reasoning, command executions, file changes, MCP tool calls, web searches, plan updates [raw/codex--agents--noninteractive-exec.md]:
```jsonl
{"type":"thread.started","thread_id":"0199a213-81c0-7800-8aa1-bbab2a035a53"}
{"type":"item.completed","item":{"id":"item_3","type":"agent_message","text":"Repo contains docs, sdk, and examples directories."}}
{"type":"turn.completed","usage":{"input_tokens":24763,"cached_input_tokens":24448,"output_tokens":122}}
```

Auth: `codex exec` reuses saved CLI auth. For GitHub Actions, use `openai/codex-action` rather than hand-rolling install+auth (starts a Responses API proxy, reduces key exposure). **Never** set `OPENAI_API_KEY`/`CODEX_API_KEY` as a job-level env var in workflows that run repo-controlled code: scope it to the single invocation instead: `CODEX_API_KEY=<key> codex exec --json "..."`. `CODEX_API_KEY` is only honored by `codex exec` [raw/codex--agents--noninteractive-exec.md].

If an enabled MCP server has `required = true` and fails to init, `codex exec` exits with an error rather than continuing [raw/codex--agents--noninteractive-exec.md].

Working GitHub Actions pattern (full YAML in the raw file): trigger on `workflow_run` failure; checkout the failing SHA with `persist-credentials: false`; run `openai/codex-action@v1` with a scoped prompt ("reproduce via `npm test`, implement the minimal fix, don't refactor unrelated files"); diff to a patch artifact; a second job applies the patch and opens the PR via `gh pr create` [raw/codex--agents--noninteractive-exec.md].

Stdin piping: prompt-plus-stdin (`npm test 2>&1 | codex exec "summarize..." | tee out.md`) vs. `codex exec -` (stdin *is* the prompt, forced explicitly) [raw/codex--agents--noninteractive-exec.md].

### Cloud environments

Lifecycle: (1) create container, checkout branch/SHA; (2) run setup script + optional maintenance script on cache resume; (3) apply internet-access settings (setup has internet; agent phase offline by default); (4) agent loop edits/runs/validates using `AGENTS.md` for lint/test commands; (5) show diff, offer PR [raw/codex--agents--cloud-environments.md].

Env vars persist for the whole chat; setup scripts run in a **separate Bash session** from the agent phase, so `export` there does **not** persist: use `~/.bashrc` or environment settings instead [raw/codex--agents--cloud-environments.md].

Default image `universal` (see `openai/codex-universal`). Example setup script:
```bash
pip install pyright
poetry install --with test
pnpm install
```
Secrets differ from env vars: extra encryption, **only available to setup scripts**, removed before the agent phase [raw/codex--agents--cloud-environments.md].

Caching: cached up to 12 hours; invalidates automatically on setup/maintenance script, env var, or secret changes (manual "Reset cache" available); for Business/Enterprise, caches are **shared across all users** with environment access: invalidation affects everyone [raw/codex--agents--cloud-environments.md].

Community synthesis, local vs. cloud: local = instant feedback, full visibility, repo stays local; cloud = durable/scalable/collaborative/isolated for long or batch jobs; both share context. Best practice: default local for routine work, escalate to cloud for scale, scope auth tightly (repo-level not org-wide), never paste secrets into prompts, review every diff regardless of mode [raw/codex--agents--cloud-environments.md].

### GitHub code review agent

Setup: enable Codex cloud for the repo, turn on "Code review" in Codex settings, optionally add `AGENTS.md` review rules. Trigger: `@codex review` in a PR comment: Codex reacts 👀 then posts a standard GitHub review restricted to **P0/P1 issues only**. "Automatic reviews" runs this on every new PR without the manual mention [raw/codex--agents--github-code-review.md].

`@codex fix the P1 issue` starts a cloud chat with the PR as context and can push a fix if permitted. Any other `@codex <task>` mention starts a general cloud chat using the PR as context. One-off focus: `@codex review for security regressions`. Review rules guide Codex but explicitly **do not replace** tests, branch protections, or required approvals [raw/codex--agents--github-code-review.md].

Troubleshooting if Codex doesn't react: confirm Code review is on for the repo, confirm Codex cloud is set up for that repo, use the exact trigger `@codex review`, and for automatic reviews confirm the setting is on and the PR event matches the trigger config [raw/codex--agents--github-code-review.md].

## Skills

### Format

A skill is a directory with a `SKILL.md` file (must include `name` and `description` frontmatter) plus optional scripts/references. Builds on the open Agent Skills standard: "write once, use everywhere" [raw/codex--skills--build-skills.md].

```md
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---
Skill instructions for Codex to follow.
```

Real example (a "commit" skill, from the customization overview):
```md
---
name: commit
description: Stage and commit changes in semantic groups. Use when the user wants to commit, organize commits, or clean up a branch before pushing.
---
1. Do not run `git add .`. Stage files in logical groups by purpose.
2. Group into separate commits: feat → test → docs → refactor → chore.
3. Write concise commit messages that match the change scope.
4. Keep each commit focused and reviewable.
```
[raw/codex--skills--build-skills.md, raw/codex--multiple--customization-overview.md]

### Progressive disclosure

Codex loads only `name`+`description`+file path for every discoverable skill up front, capped at **2% of the model's context window, or 8,000 characters when the context window is unknown**. If many skills are installed, Codex shortens descriptions first, then may omit skills entirely (with a warning). Full `SKILL.md` loads only when a skill is selected; scripts/references load only when actually used [raw/codex--skills--build-skills.md].

### Invocation

Explicit: `/skills` to browse, or `$skill-name` to mention directly (e.g. `$skill-creator`). Implicit: Codex matches the task against `description` and can auto-select. Because implicit matching depends entirely on `description`, front-load the key use case and trigger words so matching still works if descriptions get shortened under the context budget [raw/codex--skills--build-skills.md].

### Locations: REPO / USER / ADMIN / SYSTEM

| Scope | Location | Suggested use |
| --- | --- | --- |
| `REPO` | `$CWD/.agents/skills` | Working-folder-scoped skills (e.g. one microservice) |
| `REPO` | `$CWD/../.agents/skills` | Shared parent area, inside a Git repo |
| `REPO` | `$REPO_ROOT/.agents/skills` | Root skills, available repo-wide |
| `USER` | `$HOME/.agents/skills` | Cross-repo personal skills |
| `ADMIN` | `/etc/codex/skills` | Machine-wide admin-provisioned skills |
| `SYSTEM` | Bundled with Codex by OpenAI | e.g. `skill-creator`, plan skills: available at startup |

Codex scans `.agents/skills` in **every directory** from cwd up to the repo root (not just root+cwd). Same-`name` skills in different locations are **not merged**: both appear in selectors. Symlinked skill folders are followed [raw/codex--skills--build-skills.md].

**Migration:** repo-scoped skills moved from `.codex/skills/` to `.agents/skills/` (PR #10317) "to align with the shared cross-vendor `.agents/` convention." The old path still loads but is deprecated and slated for removal; applies to REPO scope only [raw/codex--skills--build-skills.md].

### Creating and managing skills

Record & Replay (Codex records a live demo and drafts a skill from it), built-in creator (`$skill-creator`: asks what/when/scripts-or-not, instruction-only is the default), or manual folder+file creation. Codex detects changes automatically; restart if an update doesn't show [raw/codex--skills--build-skills.md].

Enable/disable per skill (restart after editing):
```toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

Optional `agents/openai.yaml` configures desktop-app UI metadata, invocation policy, and MCP tool dependencies:
```yaml
interface:
  display_name: "Optional user-facing name"
  short_description: "Optional user-facing description"
  brand_color: "#3B82F6"
  default_prompt: "Optional surrounding prompt to use the skill with"
policy:
  allow_implicit_invocation: false
dependencies:
  tools:
    - type: "mcp"
      value: "openaiDeveloperDocs"
      transport: "streamable_http"
      url: "https://developers.openai.com/mcp"
```
`allow_implicit_invocation` defaults `true`; `false` disables auto-selection while explicit `$skill` invocation still works [raw/codex--skills--build-skills.md].

Install curated skills: `$skill-installer linear` (also installable from other repos on request; local setup only, prefer plugins for distributing your own) [raw/codex--skills--build-skills.md].

### Best practices

Keep each skill focused on one job; prefer instructions over scripts unless deterministic behavior/external tooling is required; write imperative steps with explicit inputs/outputs; test prompts against the `description` to confirm trigger behavior [raw/codex--skills--build-skills.md].

### Deprecation/provenance

`openai/skills` (original examples repo) is **deprecated**; current examples live in `openai/plugins`, and adding your own skills should follow the Build Plugins guide (including a skill-only plugin path) [raw/codex--skills--build-skills.md]. Adoption timeline: community requests (issue #5291) asked OpenAI to adopt Anthropic's SKILL.md progressive-disclosure model; pre-launch workarounds included `klaudworks/universal-skills` (MCP-based clone), `numman-ali/openskills`, `jixoai/ccski` (unified manager for Claude Code + Codex). Official launch shipped as PR #7412, documented at `docs/skills.md` in `openai/codex` [raw/codex--skills--build-skills.md].

Distinct surface: the OpenAI **API** also has Agent Skills for hosted/local shell environments (`POST /v1/skills`), same open standard but different constraints: case-insensitive `SKILL.md` matching, exactly one manifest per bundle, max 50MB zip, 500 files, 25MB per uncompressed file; attached via `tools[].environment.skills` (`skill_reference` by id/version, or `inline` base64 zip). Don't conflate this with the CLI/IDE/desktop skill-folder model above [raw/codex--skills--build-skills.md].

## Gaps in the raw research

- Full 150+ key `config.toml` reference was truncated in the source fetch; only the "majority" of documented keys was captured [raw/codex--rules--config-reference.md].
- Hooks per-event field tables for `PostToolUse`, `PreCompact`/`PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop`, and the full wire-format schema were not captured in this fetch pass [raw/codex--plugins--hooks.md].
- `AGENTS.md` max file size conflicts directly between sources (64KB vs. 32 KiB), unresolved in the raw research [raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--agents-md-standard.md].
- The AGENTS.md closest-wins-vs-concatenation discrepancy is flagged as unresolved even in upstream discussion (agentsmd/agents.md#53): no raw file records an official resolution [raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--agents-md-standard.md].

---

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
