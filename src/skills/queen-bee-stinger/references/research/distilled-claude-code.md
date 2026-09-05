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
