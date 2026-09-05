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
