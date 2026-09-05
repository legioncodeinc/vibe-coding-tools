# Claude Code settings
- URL: https://code.claude.com/docs/en/settings
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

# Claude Code settings

> Configure Claude Code with global and project-level settings, and environment variables.

Claude Code offers a variety of settings to configure its behavior to meet your needs. You can configure Claude Code by running the `/config` command in an interactive session, which opens a tabbed Settings interface where you can view status information and modify configuration options. From v2.1.181, you can change a single option without opening the interface by passing `key=value` to `/config`, for example `/config verbose=true`.

## Configuration scopes

Claude Code uses a scope system to determine where configurations apply and who they're shared with. Understanding scopes helps you decide how to configure Claude Code for personal use, team collaboration, or enterprise deployment.

### Available scopes

| Scope | Location | Who it affects | Shared with team? |
| :---------- | :--------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| **Managed** | Server-managed settings, plist / registry, or system-level `managed-settings.json` | All organization members for server-managed delivery; all users on the machine for plist, HKLM registry, and file delivery; the current user for HKCU registry delivery | Yes (deployed by IT) |
| **User** | `~/.claude/` directory | You, across all projects | No |
| **Project** | `.claude/` in repository | All collaborators on this repository | Yes (committed to git) |
| **Local** | `.claude/settings.local.json` at the repository root | You, in this repository only | No (gitignored when Claude Code saves a setting to it) |

### When to use each scope

**Managed scope** is for:

* Security policies that must be enforced organization-wide
* Compliance requirements that can't be overridden
* Standardized configurations deployed by IT/DevOps

**User scope** is best for:

* Personal preferences you want everywhere (themes, editor settings)
* Tools and plugins you use across all projects
* API keys and authentication (stored securely)

**Project scope** is best for:

* Team-shared settings (permissions, hooks, MCP servers)
* Plugins the whole team should have
* Standardizing tooling across collaborators

**Local scope** is best for:

* Personal overrides for a specific project
* Testing configurations before sharing with the team
* Machine-specific settings that won't work for others

### How scopes interact

When the same setting appears in multiple scopes, Claude Code applies them in priority order:

1. **Managed** (highest): can't be overridden by any other scope, apart from the [exceptions to managed settings precedence](#exceptions-to-managed-settings-precedence)
2. **Command line arguments**: temporary session overrides
3. **Local**: overrides project and user settings
4. **Project**: overrides user settings
5. **User** (lowest): applies when nothing else specifies the setting

For example, if your user settings set `spinnerTipsEnabled` to `true` and project settings set it to `false`, the project value applies. Permission rules merge across scopes instead, and a few security-sensitive keys are exceptions. See [Settings precedence](#settings-precedence).

### What uses scopes

Scopes apply to many Claude Code features:

| Feature | User location | Project location | Local location |
| :-------------- | :------------------------ | :--------------------------------- | :----------------------------- |
| **Settings** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **Subagents** | `~/.claude/agents/` | `.claude/agents/` | None |
| **MCP servers** | `~/.claude.json` | `.mcp.json` | `~/.claude.json` (per-project) |
| **Plugins** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md` |

On Windows, paths shown as `~/.claude` resolve to `%USERPROFILE%\.claude`.

***

## Settings files

The `settings.json` file is the official mechanism for configuring Claude
Code through hierarchical settings:

* **User settings** are defined in `~/.claude/settings.json` and apply to all
 projects.
* **Project settings** are saved in your project directory:
 * `.claude/settings.json` for settings that are checked into source control and shared with your team
 * `.claude/settings.local.json` for settings that are not checked in, useful for personal preferences and experimentation. When Claude Code saves a setting to this file in a repository that doesn't already ignore it, Claude Code adds `**/.claude/settings.local.json` to your global git excludes file. That excludes file is `core.excludesFile` from your global git config when it's set to an absolute or `~`-prefixed path, otherwise `$XDG_CONFIG_HOME/git/ignore`, or `~/.config/git/ignore`. If you create the file by hand or have Claude write it with the Write tool, add it to your gitignore yourself.

 Claude Code reads and writes this file at the root of the git repository, resolved through [worktrees](/docs/en/worktrees) to the main checkout, so one file covers sessions started in any subdirectory or worktree of the repository. The file stays in the directory you start Claude Code from in three cases: outside a git repository, when the repository root is your home directory, and in [Agent SDK](/docs/en/agent-sdk/claude-code-features#control-filesystem-settings-with-settingsources) sessions.

 Before v2.1.211, the file always lived in the starting directory. Claude Code still reads a `.claude/settings.local.json` that an earlier version left there. When both files set the same key, the repository root's value wins, except that permission rules from both files stay in effect.

 Claude Code also saves permanent "don't ask again" [permission approvals](/docs/en/permissions#permission-system), such as Bash command approvals, to this file.

 Because this file is yours rather than the repository's, its permission `allow` rules take effect without the [workspace trust](/docs/en/permissions#project-allow-rules-and-workspace-trust) step that `.claude/settings.json` allow rules require. If the repository supplies the file, for example by committing it, workspace trust still applies.
* **Managed settings**: For organizations that need centralized control, Claude Code supports multiple delivery mechanisms for managed settings. All use the same JSON format and cannot be overridden by user or project settings:

 * **Server-managed settings**: delivered remotely at sign-in, either from Anthropic's servers via the claude.ai admin console or from a self-hosted [Claude apps gateway](/docs/en/claude-apps-gateway). See [server-managed settings](/docs/en/server-managed-settings).
 * **MDM/OS-level policies**: delivered through native device management on macOS and Windows:
 * macOS: `com.anthropic.claudecode` managed preferences domain. The plist's top-level keys mirror `managed-settings.json`, with nested settings as dictionaries and arrays as plist arrays. Deploy via configuration profiles in Jamf, Iru (Kandji), or similar MDM tools.
 * Windows: `HKLM\SOFTWARE\Policies\ClaudeCode` registry key with a `Settings` value (REG\_SZ or REG\_EXPAND\_SZ) containing JSON (deployed via Group Policy or Intune)
 * Windows (user-level): `HKCU\SOFTWARE\Policies\ClaudeCode` (lowest policy priority, only used when no admin-level source exists)
 * **File-based**: `managed-settings.json` and `managed-mcp.json` deployed to system directories:

 * macOS: `/Library/Application Support/ClaudeCode/`
 * Linux and WSL: `/etc/claude-code/`
 * Windows: `C:\Program Files\ClaudeCode\`


 The legacy Windows path `C:\ProgramData\ClaudeCode\managed-settings.json` is no longer supported as of v2.1.75. Administrators who deployed settings to that location must migrate files to `C:\Program Files\ClaudeCode\managed-settings.json`.


 File-based managed settings also support a drop-in directory at `managed-settings.d/` in the same system directory alongside `managed-settings.json`. This lets separate teams deploy independent policy fragments without coordinating edits to a single file.

 Following the systemd convention, Claude Code merges `managed-settings.json` first as the base, then sorts all `*.json` files in the drop-in directory alphabetically and merges them on top. For scalar values, Claude Code lets later files override earlier ones; it concatenates and de-duplicates arrays and deep-merges objects. A later file's `fallbackModel` chain replaces an earlier one instead of merging with it, and a later file's [`extraKnownMarketplaces`](#extraknownmarketplaces) entry replaces an earlier file's same-name entry whole. Claude Code ignores hidden files starting with `.`.

 Use numeric prefixes to control merge order, for example `10-telemetry.json` and `20-security.json`.

 See [managed settings](/docs/en/permissions#managed-only-settings) and [Managed MCP configuration](/docs/en/managed-mcp) for details.

 This [repository](https://github.com/anthropics/claude-code/tree/main/examples/mdm) includes starter deployment templates for Jamf, Iru (Kandji), Intune, and Group Policy. Use these as starting points and adjust them to fit your needs.


 Managed deployments can also restrict **plugin marketplace additions** using
 `strictKnownMarketplaces`. For more information, see [Managed marketplace restrictions](/docs/en/plugin-marketplaces#managed-marketplace-restrictions).

* **Other configuration** is stored in `~/.claude.json`. This file contains your OAuth session, [MCP server](/docs/en/mcp) configurations for user and local scopes, per-project state (allowed tools, trust settings), and various caches. Project-scoped MCP servers are stored separately in `.mcp.json`.


 Claude Code automatically creates timestamped backups of configuration files and retains the five most recent backups to prevent data loss.


The following example works in any of the settings file locations above. Where you save the file determines where it applies:

* To apply it to all of your projects, save it as `~/.claude/settings.json`. This file lives in your home directory rather than in any project, so Claude Code reads it in every session regardless of which project you open.
* To share it with collaborators on one project, save it as `.claude/settings.json` in that project. Claude Code reads this file from the directory the session runs in, so it applies only to that project, and checking it into source control gives every collaborator the same settings.

```JSON Example settings.json theme={null}
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
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com",
    "Reminder: Code reviews required for all PRs",
    "New security policy in effect"
  ]
}
```

The `$schema` line in the example above points to the [official JSON schema](https://json.schemastore.org/claude-code-settings.json) for Claude Code settings. Adding it to your `settings.json` enables autocomplete and inline validation in VS Code, Cursor, and any other editor that supports JSON schema validation.

The published schema is updated periodically and may not include settings added in the most recent CLI releases, so a validation warning on a recently documented field does not necessarily mean your configuration is invalid.


 After you edit a settings file, run `/status` inside Claude Code to confirm it was loaded. The `Setting sources` line lists each settings source loaded for the current session; a source appears once it loads with at least one setting, so a file with broken JSON doesn't appear even if it contains settings. See [Verify active settings](#verify-active-settings).


### When edits take effect

Claude Code watches your settings files and reloads them when they change, so edits to most keys apply to the running session without a restart. This includes `permissions`, `hooks`, and credential helpers like `apiKeyHelper`. The reload covers user, project, local, and managed settings, and the [`ConfigChange` hook](/docs/en/hooks#configchange) fires for each detected change.

A few keys are read once at session start and apply on the next restart instead:

* `model`: use [`/model`](/docs/en/model-config#setting-your-model) to switch mid-session
* [`outputStyle`](/docs/en/output-styles): part of the system prompt, which is rebuilt on `/clear` or restart

### Invalid entries in managed settings

Managed settings parse tolerantly. When a managed configuration contains an entry that fails schema validation, Claude Code strips that entry, records a warning, and enforces every remaining valid policy. A single typo cannot disable the rest of your organization's policy. Run [`/doctor`](/docs/en/debug-your-config#check-resolved-settings) to list stripped entries with their source file and field.

This behavior is consistent across all three delivery mechanisms: [server-managed settings](/docs/en/server-managed-settings), plist and registry policies deployed through MDM, and `managed-settings.json` files. Requires Claude Code v2.1.169 or later.

Security-enforcement fields are handled per field instead of being stripped wholesale when they are present but invalid:

| Field | Behavior when present but invalid |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedMcpServers` | Enforced as an empty allowlist, so no MCP servers are admitted until the value is fixed. An individual invalid entry is stripped and the valid subset is enforced. |
| `allowManagedHooksOnly` | Treated as `true`, so the [hook restrictions](#hook-configuration) apply until the value is fixed and, unless `disableCommandPluginSources` is explicitly `false`, command-sourced plugins are disabled. Applies in v2.1.229 and later. |
| `allowManagedMcpServersOnly` | Treated as `true`. |
| `disableCommandPluginSources` | Treated as `true`, so command-sourced plugins stay disabled until the value is fixed. Applies in v2.1.229 and later. |
| `availableModels` | Enforced as an empty allowlist, so only the Default model is available until the value is fixed. An individual non-string entry is stripped and the valid subset is enforced. Applies in v2.1.175 and later. |
| `enforceAvailableModels` | Treated as `true`. Applies in v2.1.175 and later. |
| `forceLoginOrgUUID` | No organization is permitted to log in until the value is fixed. |
| `deniedMcpServers` | An individual invalid entry is stripped and the valid subset is enforced. A wholly invalid value is dropped with a warning, since denying every server would block servers the policy never named. |
| `sandbox.credentials` | An invalid entry in `files` or `envVars` that still has a valid `path` or `name` and a `mode` of `mask` or `deny`, such as one whose `extract` pattern has no capturing group, is degraded to `mode: "deny"` with a warning, so the credential stays blocked, not masked, until you fix the entry. A degraded `files` entry pins [`filesystem.disabled`](/docs/en/sandboxing#disable-filesystem-isolation) like an explicit `deny` entry, and the warning notes that its read block isn't enforced if managed settings turn filesystem isolation off. An entry with an unknown `mode` or an invalid `path` or `name` is stripped. Each case warns; whether an entry is degraded or stripped, the remaining valid entries are still enforced, and a wholly invalid `credentials` value is dropped while the rest of `sandbox` still applies. Applies in v2.1.191 and later; before v2.1.221, every invalid entry was stripped. |

`requiredMinimumVersion` and `requiredMaximumVersion` fail open by design: an invalid value is stripped rather than enforced, so a bad policy push cannot prevent Claude Code from starting.

Validation errors surface in three places:

* Interactive sessions show a dialog at startup listing the invalid entries.
* Headless runs with `-p` print a summary to stderr.
* [`claude doctor`](/docs/en/debug-your-config) lists each invalid entry with its source and field.

Validate policy changes by running `claude doctor` on a test machine before deploying them fleet-wide.

This tolerance applies only to managed settings. User, project, and local settings files remain strict: a file that fails validation is rejected as a whole and reported.

### Available settings

`settings.json` supports a number of options:

| Key | Description | Example |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `advisorModel` | Model for the server-side [advisor tool](/docs/en/advisor). Accepts the model aliases `"fable"`, `"opus"`, and `"sonnet"`, or a full model ID. `"fable"` requires [Fable 5 access](/docs/en/advisor#choose-an-advisor-model). Written automatically when you run `/advisor`. Unset to disable the advisor. | `"opus"` |
| `agent` | Run the main thread as a named subagent, and set the default agent for sessions dispatched from `claude agents`. Applies that subagent's system prompt, tool restrictions, and model. See [Invoke subagents explicitly](/docs/en/sub-agents#invoke-subagents-explicitly) | `"code-reviewer"` |
| `agentPushNotifEnabled` | **Default**: `false`. When [Remote Control](/docs/en/remote-control) is connected, allow Claude to send proactive push notifications to your phone, for example when a long task finishes. Appears in `/config` as **Push when Claude decides**. See [Mobile push notifications](/docs/en/remote-control#mobile-push-notifications) | `true` |
| `allowAllClaudeAiMcps` | (Managed settings only) Load the claude.ai connectors Claude Code fetches itself alongside a deployed `managed-mcp.json`, which otherwise takes exclusive control and suppresses them. Connectors delivered to cloud sessions stay suppressed. See [Managed MCP configuration](/docs/en/managed-mcp#allow-claude-ai-connectors-alongside-the-managed-set) | `true` |
| `allowedChannelPlugins` | (Managed settings only) Allowlist of channel plugins that may push messages. Replaces the default Anthropic allowlist when set. Undefined = fall back to the default, empty array = block all channel plugins. Requires `channelsEnabled: true`. See [Restrict which channel plugins can run](/docs/en/channels#restrict-which-channel-plugins-can-run) | `[{ "marketplace": "claude-plugins-official", "plugin": "telegram" }]` |
| `allowedHttpHookUrls` | Allowlist of URL patterns that HTTP hooks may target. Supports `*` as a wildcard. When set, hooks with non-matching URLs are blocked. Undefined = no restrictions, empty array = block all HTTP hooks. Arrays merge across settings sources. See [Hook configuration](#hook-configuration) | `["https://hooks.example.com/*"]` |
| `allowedMcpServers` | When set in managed-settings.json, allowlist of MCP servers users can configure. Undefined = no restrictions, empty array = lockdown. Applies to all scopes. Denylist takes precedence. See [Managed MCP configuration](/docs/en/managed-mcp) | `[{ "serverName": "github" }]` |
| `allowManagedHooksOnly` | (Managed settings only) Restrict which hooks run; see [Hook configuration](#hook-configuration) for the full effect list | `true` |
| `allowManagedMcpServersOnly` | (Managed settings only) Only `allowedMcpServers` from managed settings are respected. `deniedMcpServers` still merges from all sources. Users can still add MCP servers, but only the admin-defined allowlist applies. See [Managed MCP configuration](/docs/en/managed-mcp) | `true` |
| `allowManagedPermissionRulesOnly` | (Managed settings only) Prevent user and project settings from defining `allow`, `ask`, or `deny` permission rules. Only rules in managed settings apply. See [Managed-only settings](/docs/en/permissions#managed-only-settings) | `true` |
| `alwaysThinkingEnabled` | Enable [extended thinking](/docs/en/model-config#extended-thinking) by default for all sessions. Typically configured via the `/config` command rather than editing directly. To force thinking off regardless of this setting, set [`MAX_THINKING_TOKENS=0`](/docs/en/env-vars) in `env`, which disables thinking on the Anthropic API except on Fable 5, which cannot have thinking turned off. On [third-party providers](/docs/en/third-party-integrations) this omits the `thinking` parameter instead, and adaptive-reasoning models may still think | `true` |
| `apiKeyHelper` | Custom command, run through the system shell (`/bin/sh` on macOS and Linux, `cmd` on Windows), to generate an auth value. This value will be sent as `X-Api-Key` and `Authorization: Bearer` headers for model requests. Set the refresh interval with [`CLAUDE_CODE_API_KEY_HELPER_TTL_MS`](/docs/en/env-vars) | `/bin/generate_temp_api_key.sh` |
| `askUserQuestionTimeout` | **Default**: `"never"`. Idle time before an unanswered [`AskUserQuestion`](/docs/en/tools-reference) dialog auto-continues with whatever options you'd already selected. Accepts `"60s"`, `"5m"`, `"10m"`, or `"never"`. With the default, questions wait until you answer them. Appears in `/config` as **Question auto-continue timeout**, which writes this key to user settings. Not read from project or local settings. Requires Claude Code v2.1.200 or later | `"5m"` |
| `attribution` | Customize attribution for git commits and pull requests. See [Attribution settings](#attribution-settings) | `{"commit": "🤖 Generated with Claude Code", "pr": ""}` |
| `autoCompactEnabled` | **Default**: `true`. Automatically compact the conversation when context approaches the limit. Appears in `/config` as **Auto-compact**. To disable via environment variable, set [`DISABLE_AUTO_COMPACT`](/docs/en/env-vars) in `env` | `false` |
| `autoCompactWindow` | How full the context window gets before Claude Code [compacts automatically](/docs/en/context-window#when-your-context-fills-up), in tokens from `100000` to `1000000`. When unset, Claude Code uses a window tuned for your model. Set it with the [`/autocompact`](/docs/en/commands#all-commands) command, which writes this key to user settings; the [`--autocompact`](/docs/en/cli-reference#cli-flags
