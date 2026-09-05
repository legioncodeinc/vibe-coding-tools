# Config basics – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/config-basic
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

Codex reads configuration details from more than one location. Your personal defaults live in `~/.codex/config.toml`, and you can add project overrides with `.codex/config.toml` files. For security, Codex loads project `.codex/` layers only when you trust the project.

## Codex configuration file

Codex stores user-level configuration at `~/.codex/config.toml`. To scope settings to a specific project or subfolder, add a `.codex/config.toml` file in your repo.

To open the configuration file from the Codex IDE extension, select the gear icon in the top-right corner, then select Codex Settings > Open config.toml.

The CLI and IDE extension share the same configuration layers. You can use them to:

- Set the default model and provider.
- Configure approval policies and sandbox settings.
- Configure MCP servers.

## Configuration precedence

Codex resolves values in this order (highest precedence first):

1. CLI flags and `--config` overrides
2. Project config files: `.codex/config.toml`, ordered from the project root down to your current working directory (closest wins; trusted projects only)
3. Profile files selected with `--profile profile-name` (`~/.codex/profile-name.config.toml`)
4. User config: `~/.codex/config.toml`
5. System config (if present): `/etc/codex/config.toml` on Unix
6. Built-in defaults

Use that precedence to set shared defaults in `config.toml` and keep profile files focused on the values that differ.

If you mark a project as untrusted, Codex skips project-scoped `.codex/` layers, including project-local config, hooks, and rules. User and system config still load, including user/global hooks and rules.

For one-off overrides via `-c`/`--config` (including TOML quoting rules), see Advanced Config.

On managed machines, your organization may also enforce constraints via `requirements.toml` (for example, disallowing `approval_policy = "never"` or `sandbox_mode = "danger-full-access"`). See Managed configuration and Admin-enforced requirements.

## Common configuration options

#### Default model

```toml
model = "gpt-5.6"
```

#### Approval prompts

```toml
approval_policy = "on-request"
```

For behavior differences between `untrusted`, `on-request`, and `never`, see Run without approval prompts and Common sandbox and approval combinations.

#### Sandbox level

```toml
sandbox_mode = "workspace-write"
```

#### Permission profiles

Codex also supports named permission profiles for reusable filesystem and network policies. Built-in profiles are `:read-only`, `:workspace`, and `:danger-full-access`. Custom profiles use `[permissions.<name>]` tables and a matching `default_permissions` value. See Permissions.

#### Windows sandbox mode

```toml
[windows]
sandbox = "elevated"   # Recommended
# sandbox = "unelevated" # Fallback if admin permissions/setup are unavailable
```

#### Web search mode

Codex enables web search by default for local chats and serves results from a web search cache (an OpenAI-maintained index). This reduces exposure to prompt injection from arbitrary live content, but web results should still be treated as untrusted. If using `--yolo` or another full-access sandbox setting, web search defaults to live results.

```toml
web_search = "cached"  # default; serves results from the web search cache
# web_search = "indexed" # gate external web access through the search index
# web_search = "live"  # fetch the most recent data from the web (same as --search)
# web_search = "disabled"
```

#### Reasoning effort

```toml
model_reasoning_effort = "high"
```

#### Communication style

```toml
personality = "friendly" # or "pragmatic" or "none"
```

Override later in an active session with `/personality` or per thread/turn using the app-server APIs.

#### TUI keymap

```toml
[tui.keymap.global]
open_transcript = "ctrl-t"

[tui.keymap.composer]
submit = ["enter", "ctrl-m"]

[tui.keymap.chat]
interrupt_turn = "f12"
```

#### Command environment

```toml
[shell_environment_policy]
include_only = ["PATH", "HOME"]
```

#### Log directory

```toml
log_dir = "/absolute/path/to/codex-logs"
```

For one-off runs:

```bash
codex -c log_dir=./.codex-log
```

## Feature flags

Use the `[features]` table in `config.toml` to toggle optional and experimental capabilities.

### Common feature flags

| Key | Default | Maturity | Description |
| --- | --- | --- | --- |
| `apps` | true | Stable | Enable app (connector) integrations |
| `goals` | true | Stable | Enable persisted goals and automatic continuation |
| `hooks` | true | Stable | Enable lifecycle hooks from `hooks.json` or inline `[hooks]` |
| `fast_mode` | true | Stable | Enable Fast mode selection and the `service_tier = "fast"` path |
| `memories` | false | Experimental | Enable Memories |
| `multi_agent` | true | Stable | Enable subagent collaboration tools |
| `personality` | true | Stable | Enable personality selection controls |
| `remote_plugin` | true | Stable | Enable the remote plugin catalog |
| `shell_snapshot` | true | Stable | Snapshot your shell environment to speed up repeated commands |
| `shell_tool` | true | Stable | Enable the default `shell` tool |
| `unified_exec` | true except Windows | Stable | Use the unified PTY-backed exec tool |
| `web_search` | true | Deprecated | Legacy toggle; prefer the top-level `web_search` setting |
| `web_search_cached` | false | Deprecated | Legacy toggle that maps to `web_search = "cached"` when unset |
| `web_search_request` | false | Deprecated | Legacy toggle that maps to `web_search = "live"` when unset |

This table lists common user-facing flags, not every internal or under-development feature.

### Enabling features

- In `config.toml`, add `feature_name = true` under `[features]`.
- From the CLI, run `codex --enable feature_name`.
- To enable more than one feature, run `codex --enable feature_a --enable feature_b`.
- To disable a feature, set the key to `false` in `config.toml`.
