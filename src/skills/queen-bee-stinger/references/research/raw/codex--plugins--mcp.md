# Model Context Protocol – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/mcp
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins

Model Context Protocol (MCP) connects models to tools and context. Use it to give ChatGPT or Codex access to third-party documentation, or to let it interact with developer tools like your browser or Figma.

ChatGPT web can use remote MCP-backed tools supplied by plugins. Local Codex clients can also connect directly to MCP servers and share their configuration.

The ChatGPT desktop app, Codex CLI, and IDE extension support MCP servers and share MCP configuration for the same Codex host.

The supported server features below apply to MCP servers configured on a Codex host. Hosted plugin tools can have different capabilities.

## Supported MCP features

- STDIO servers: Servers that run as a local process (started by a command). Environment variables.
- Streamable HTTP servers: Servers that you access at an address. Bearer token authentication, OAuth authentication, ChatGPT session authentication for trusted first-party servers.
- Server instructions: Codex reads the MCP `instructions` field returned during initialization and uses it as server-wide guidance alongside the server's tools.

If you build or maintain an MCP server for Codex, use `instructions` for cross-tool workflows, constraints, and rate limits that apply across the server. Keep the first 512 characters self-contained so the most important guidance is available when Codex is deciding how to use the server.

## Connect Codex to an MCP server

Codex stores MCP configuration in `config.toml` alongside other Codex configuration settings. By default this is `~/.codex/config.toml`, but you can also scope MCP servers to a project with `.codex/config.toml` (trusted projects only).

The ChatGPT desktop app, Codex CLI, and IDE extension share this configuration. Once you configure your MCP servers, you can switch among those clients without redoing setup.

### Configure with the CLI

```bash
codex mcp add <server-name> --env VAR1=VALUE1 --env VAR2=VALUE2 -- <stdio server-command>
```

Example, adding Context7:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

Other CLI commands: `codex mcp list` (see configured servers), `codex mcp --help`, `codex mcp login <server>` (for OAuth-capable servers).

In the `codex` TUI, use `/mcp` to see active MCP servers.

### Configure with config.toml

Configure each MCP server with a `[mcp_servers.<name>]` table.

#### STDIO servers

- `command` (required): The command that starts the server.
- `args` (optional): Arguments to pass to the server.
- `env` (optional): Environment variables to set for the server.
- `env_vars` (optional): Environment variables to allow and forward.
- `cwd` (optional): Working directory to start the server from.
- `experimental_environment` (optional): Set to `remote` to start the stdio server through a remote executor environment when one is available.

`env_vars` can contain plain variable names or objects with a source:

```toml
env_vars = ["LOCAL_TOKEN", { name = "REMOTE_TOKEN", source = "remote" }]
```

String entries and `source = "local"` read from Codex's local environment. `source = "remote"` reads from the remote executor environment and requires remote MCP stdio.

#### Streamable HTTP servers

- `url` (required): The server address.
- `auth` (optional): Authentication to try after configured bearer tokens and authorization headers. Use `oauth` (the default) for stored MCP OAuth credentials. Use `chatgpt` to use the current ChatGPT session for the trusted first-party ChatGPT origin, with stored OAuth as a fallback.
- `bearer_token_env_var` (optional): Environment variable name for a bearer token to send in `Authorization`.
- `http_headers` (optional): Map of header names to static values.
- `env_http_headers` (optional): Map of header names to environment variable names.

If no credential source resolves, Codex can connect to the server without authentication. Run `codex mcp login <server>` separately to start an MCP OAuth login.

#### Other configuration options

- `startup_timeout_sec` (optional, default `10`)
- `tool_timeout_sec` (optional, default `60`)
- `enabled` (optional): Set `false` to disable a server without deleting it.
- `required` (optional): Set `true` to make startup fail if this enabled server can't initialize.
- `enabled_tools` (optional): Tool allow list.
- `disabled_tools` (optional): Tool deny list (applied after `enabled_tools`).
- `default_tools_approval_mode` (optional): `auto`, `prompt`, `writes`, `approve`. `writes` prompts for tools that aren't marked read-only.
- `tools.<tool>.approval_mode` (optional): Per-tool approval behavior override.

`mcp_oauth_callback_port` and `mcp_oauth_callback_url` (top-level config.toml) control OAuth callback binding for `codex mcp login`. If the MCP server advertises `scopes_supported`, Codex prefers those server-advertised scopes; otherwise it falls back to configured scopes.

#### config.toml examples

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
env_vars = ["LOCAL_TOKEN"]

[mcp_servers.context7.env]
MY_ENV_VAR = "MY_ENV_VALUE"
```

```toml
# Optional MCP OAuth callback overrides (used by `codex mcp login`)
mcp_oauth_callback_port = 5555
mcp_oauth_callback_url = "https://devbox.example.internal/callback"
```

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
http_headers = { "X-Figma-Region" = "us-east-1" }
```

```toml
[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
enabled_tools = ["open", "screenshot"]
disabled_tools = ["screenshot"] # applied after enabled_tools
default_tools_approval_mode = "prompt"
startup_timeout_sec = 20
tool_timeout_sec = 45
enabled = true

[mcp_servers.chrome_devtools.tools.open]
approval_mode = "approve"
```

### Plugin-provided MCP servers

Installed plugins can bundle MCP servers in their plugin manifest. Those servers are launched from the plugin, so user config doesn't set their transport command. User config can still control on/off state and tool policy under `plugins.<plugin-id>.mcp_servers.<name>`.

```toml
[plugins."sample@test".mcp_servers.sample]
enabled = true
default_tools_approval_mode = "prompt"
enabled_tools = ["read", "search"]

[plugins."sample@test".mcp_servers.sample.tools.search]
approval_mode = "approve"
```

## Examples of useful MCP servers

- OpenAI Docs MCP: Search and read OpenAI developer docs.
- Context7: Connect to up-to-date developer documentation.
- Figma Local and Remote: Access your Figma designs.
- Playwright: Control and inspect a browser using Playwright.
- Chrome Developer Tools: Control and inspect Chrome.
- Sentry: Access Sentry logs.
- GitHub: Manage GitHub beyond what `git` supports (pull requests, issues).

---

## Practitioner supplement: Codex MCP config gotchas (community sources cross-checked against the above)

- TOML, not JSON. Codex is one of the few major agent CLIs using TOML instead of JSON for MCP config — pasting a Claude Code/Cursor-style `mcpServers` JSON block will silently fail.
- Correct root key is `mcp_servers` (underscore), not `mcp.servers` or `mcp-servers`.
- Transport is inferred implicitly: a `command` key means stdio; a `url` key means streamable HTTP. Supplying both is a configuration error.
- No `enable`/`disable` CLI subcommand as of research date — toggle the `enabled` key by hand in config.toml.
- `codex mcp add` cannot set an `oauth_resource` indicator for enterprise-gated servers; that still requires a manual TOML edit.
- MCP does **not** work in Codex cloud as of research date (it's an open feature request) — MCP works in the CLI, IDE extension, and desktop app, all of which read the local config.toml.
- Common failure modes: JSON instead of TOML; wrong table key; cold `npx` install exceeding the 10s `startup_timeout_sec`; missing bearer-token env var (401); server connects but exposes no tools (known handshake bug in some servers).
