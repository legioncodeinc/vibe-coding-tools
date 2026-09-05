# Configuration Reference – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/config-reference
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

Use this page as a searchable reference for Codex configuration files. For conceptual guidance and examples, start with Config basics and Advanced Config.

## `config.toml`

User-level configuration lives in `~/.codex/config.toml`. You can also add project-scoped overrides in `.codex/config.toml` files. Codex loads project-scoped config files only when you trust the project.

Project-scoped config can't override machine-local provider, auth, host-owned app request metadata, notification, configuration profile selection, or telemetry routing keys. Codex ignores `openai_base_url`, `chatgpt_base_url`, `apps_mcp_product_sku`, `model_provider`, `model_providers`, `notify`, `profile`, `profiles`, `experimental_realtime_ws_base_url`, and `otel` when they appear in a project-local `.codex/config.toml`; put provider, notification, and telemetry keys in user-level config instead. Config profile files live next to `config.toml` as `$CODEX_HOME/profile-name.config.toml`; select one with `--profile profile-name`.

For sandbox and approval keys (`approval_policy`, `sandbox_mode`, and `sandbox_workspace_write.*`), pair this reference with Sandbox and approvals, Protected paths in writable roots, and Network access. For beta permission profiles, see Permissions.

### Selected key reference (partial; full table is very large)

- `sandbox_workspace_write.writable_roots` (array): Additional writable roots when `sandbox_mode = "workspace-write"`.
- `sandbox_workspace_write.network_access` (boolean): Allow outbound network access inside the workspace-write sandbox.
- `sandbox_workspace_write.exclude_tmpdir_env_var` (boolean): Exclude `$TMPDIR` from writable roots in workspace-write mode.
- `sandbox_workspace_write.exclude_slash_tmp` (boolean): Exclude `/tmp` from writable roots in workspace-write mode.
- `windows.sandbox` (`unelevated | elevated`): Windows-only native sandbox mode when running Codex natively on Windows.
- `windows.sandbox_private_desktop` (boolean): Run the final sandboxed child process on a private desktop by default on native Windows. Set `false` only for compatibility with the older `Winsta0\Default` behavior.
- `computer_use.windows.always_allowed_app_ids` (array): Windows app identifiers that Computer Use can open without prompting.
- `notify` (array): Command invoked for notifications; receives a JSON payload from Codex.
- `check_for_update_on_startup` (boolean): Check for Codex updates on startup.
- `feedback.enabled` (boolean): Enable feedback submission via `/feedback` across local clients (default: true).
- `analytics.enabled` (boolean): Enable or disable analytics for this machine/profile.
- `instructions` (string): Reserved for future use; prefer `model_instructions_file` or `AGENTS.md`.
- `developer_instructions` (string): Additional developer instructions injected into the session (optional).
- `log_dir` (string, path): Directory where Codex writes log files; defaults to `$CODEX_HOME/log`. Setting this explicitly also enables the opt-in plaintext TUI log, `codex-tui.log`, in that directory.
- `sqlite_home` (string, path): Directory where Codex stores the SQLite-backed state DB used by agent jobs and other resumable runtime state.
- `compact_prompt` (string): Inline override for the history compaction prompt.
- `model_instructions_file` (string, path): Replacement for built-in instructions instead of `AGENTS.md`.
- `personality` (`none | friendly | pragmatic`): Default communication style for models that advertise `supportsPersonality`; can be overridden per thread/turn or via `/personality`.
- `service_tier` (string): Preferred service tier for new turns. Use `fast` or another tier advertised by the active model; `fast` maps to the request value `priority`.
- `experimental_compact_prompt_file` (string, path): Load the compaction prompt override from a file (experimental).
- `skills.config` (array): Per-skill enablement overrides stored in config.toml.
- `skills.config[].path` (string, path): Path to a skill folder containing `SKILL.md`.
- `skills.config[].enabled` (boolean): Enable or disable the referenced skill.
- `apps.<id>.enabled` (boolean): Enable or disable a specific app/connector by id (default: true).
- `apps._default.enabled` (boolean): Default app enabled state for all apps unless overridden per app.
- `apps._default.destructive_enabled` (boolean): Default allow/deny for app tools with `destructive_hint = true`.
- `apps._default.open_world_enabled` (boolean): Default allow/deny for app tools with `open_world_hint = true`.
- `apps._default.approvals_reviewer` (`user | auto_review`): Default reviewer for app tool approval prompts unless overridden per app.
- `apps._default.default_tools_approval_mode` (`auto | prompt | writes | approve`): Default approval behavior for app tools without per-app or per-tool overrides.
- `apps.<id>.destructive_enabled` / `apps.<id>.open_world_enabled` / `apps.<id>.default_tools_enabled` / `apps.<id>.approvals_reviewer` / `apps.<id>.default_tools_approval_mode`: per-app overrides.
- `apps.<id>.tools.<tool>.enabled` / `apps.<id>.tools.<tool>.approval_mode`: per-tool overrides for an app tool (for example `repos/list`).
- `tool_suggest.discoverables` (array): Allow tool suggestions for additional discoverable connectors or plugins. Each entry uses `type = "connector"` or `"plugin"` and an `id`.
- `tool_suggest.disabled_tools` (array): Disable suggestions for specific discoverable connectors or plugins.
- `features.apps` (boolean): Enable app (connector) integrations (stable; on by default).
- `features.hooks` (boolean): Enable lifecycle hooks loaded from `hooks.json` or inline `[hooks]` config. `features.codex_hooks` is a deprecated alias.
- `features.code_mode.enabled` (boolean): Enable code mode feature configuration (under development, off by default).
- `features.code_mode.excluded_tool_namespaces` / `features.code_mode.direct_only_tool_namespaces` (array): Tool namespace exclusions for code mode.
- `features.rollout_budget.enabled` (boolean), `.limit_tokens` (integer), `.reminder_interval_tokens` (integer), `.sampling_token_weight` (number), `.prefill_token_weight` (number): rollout budget tracking (under development, off by default).
- `hooks` (table): Lifecycle hooks configured inline in `config.toml`. Uses the same event schema as `hooks.json`.
- `hooks.<Event>` (array): Matcher groups for hook events such as `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `SessionStart`, `SubagentStart`, `SubagentStop`, `UserPromptSubmit`, or `Stop`.
- `hooks.<Event>[].hooks` (array): Hook handlers for a matcher group. Command hooks are currently supported; prompt and agent hook handlers are parsed but skipped.
- `hooks.<Event>[].hooks[].commandWindows` (string): Windows-only command override for command hooks. TOML alias `command_windows` is also accepted.
- `features.memories` (boolean): Enable Memories (off by default).
- `mcp_servers.<name>.command` / `.args` / `.env` / `.env_vars` / `.cwd`: STDIO MCP server launch config.
- `mcp_servers.<name>.url` / `.auth` (`oauth | chatgpt`) / `.bearer_token_env_var` / `.http_headers` / `.env_http_headers`: Streamable HTTP MCP server config.
- `mcp_servers.<name>.enabled` (boolean): Disable an MCP server without removing its configuration.
- `mcp_servers.<name>.required` (boolean): When true, fail startup/resume if this enabled MCP server cannot initialize.
- `mcp_servers.<name>.startup_timeout_sec` / `startup_timeout_ms`: Override the default 10s startup timeout.
- `mcp_servers.<name>.tool_timeout_sec`: Override the default 60s per-tool timeout.
- `mcp_servers.<name>.enabled_tools` / `.disabled_tools`: allow/deny list of tool names.
- `mcp_servers.<name>.default_tools_approval_mode` / `.tools.<tool>.approval_mode`: approval behavior.
- `mcp_servers.<name>.scopes` (array): OAuth scopes to request when authenticating to that MCP server.
- `mcp_servers.<name>.oauth_resource` (string): Optional RFC 8707 OAuth resource parameter to include during MCP login.
- `mcp_servers.<name>.experimental_environment` (`local | remote`): Experimental placement for an MCP server.
- `agents` (table): Multi-agent settings and custom role declarations. Scalar setting names are reserved and can't be used as custom role names.
- `agents.enabled` (boolean): Enable or disable multi-agent tools (default: true).
- `agents.max_concurrent_threads_per_session` / `agents.max_threads` (legacy alias): Maximum number of spawned-agent threads open concurrently.
- `agents.default_subagent_model` / `agents.default_subagent_reasoning_effort`: Defaults for spawned agents.
- `agents.interrupt_message` (boolean): Record a model-visible message when an agent turn is interrupted (default: true).
- `agents.<role>.description` (string): Role guidance shown to Codex when choosing and spawning that agent type.
- `agents.<role>.config_file` (string, path): Path to a TOML config layer for that role; relative paths resolve from the config file that declares the role.
- `memories.generate_memories` / `memories.use_memories` / `memories.disable_on_external_context` / `memories.max_raw_memories_for_consolidation` / `memories.max_unused_days` / `memories.max_rollout_age_days` / `memories.max_rollouts_per_startup` / `memories.min_rollout_idle_hours` / `memories.min_rate_limit_remaining_percent` / `memories.extract_model` / `memories.consolidation_model`: Memories feature tuning.
- `features.unified_exec` / `features.shell_snapshot` / `features.multi_agent` / `features.goals` / `features.remote_plugin` / `features.personality` (booleans, mostly stable/on by default).
- `features.network_proxy` (boolean | table): Enable sandboxed networking. See Network access documentation for the full `domains`/`unix_sockets`/`allow_local_binding`/`enable_socks5*` sub-keys.
- `features.web_search` / `features.web_search_cached` / `features.web_search_request`: Deprecated legacy toggles; prefer top-level `web_search`.
- `features.shell_tool` / `features.enable_request_compression` / `features.skill_mcp_dependency_install` / `features.fast_mode` / `features.prevent_idle_sleep`: additional feature flags.
- `suppress_unstable_features_warning` (boolean): Suppress the warning that appears when under-development feature flags are enabled.
- `model_providers.<id>.*`: Custom provider definitions (name, base_url, env_key, wire_api, query_params, http_headers, retries, timeouts, auth command, etc). Built-in provider IDs (`openai`, `ollama`, `lmstudio`) are reserved.

For the full (150+ key) reference, consult the live page; this snapshot captures the majority of documented keys as fetched on 2026-08-14, truncated for length.
