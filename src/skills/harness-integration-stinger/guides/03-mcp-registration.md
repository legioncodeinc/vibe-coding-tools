# Guide 03: MCP Server Registration, Per Harness

**Sources:** `research/distilled-harness-integration.md` §3; queen-bee-stinger distilled-research-articles.md, Claude Code §Plugins→Plugin MCP servers; Cursor §Plugins→MCP inside a plugin vs. standalone `mcp.json`; ChatGPT Codex §Plugins→MCP config location and structure; Claude Cowork §Plugins ("What a plugin bundles" and security gotcha); `research/external/2026-08-14-mcp-capability-negotiation.md`

---

## When MCP is the right mechanism

Reach for MCP when the capability needs to call out to an external service or expose a stable, typed tool surface the model can invoke directly - as opposed to reacting to a lifecycle event (hooks, `guides/02-hook-lifecycle.md`) or needing a dedicated UI surface (native extension). All four Hive harnesses can act as an MCP host, but the registration syntax, transport assumptions, and reachability model differ enough that no config block copies cleanly between them.

## Registration, per harness

| Harness | Config location | Format | Notes |
|---|---|---|---|
| Claude Code | `~/.claude.json` (user), `.mcp.json` (project), plugin `.mcp.json` at plugin root | JSON, `mcpServers` key | Path vars like `${CLAUDE_PLUGIN_ROOT}` resolve inside plugin-bundled servers; `/reload-plugins` keeps live connections for unchanged configs |
| Cursor | `.cursor/mcp.json` (project), `~/.cursor/mcp.json` (global), or plugin `mcp.json` at plugin root | JSON, `mcpServers` key (standalone) - Agent Plugin form declares `type: stdio/http` explicitly; Cursor Plugin form infers transport from `command`/`url` | Supports `${env:NAME}`, `${userHome}`, `${workspaceFolder}` interpolation; Enterprise MCP Allowlist restricts by command/URL pattern |
| Codex | `~/.codex/config.toml` (user) or `.codex/config.toml` (trusted project only) | **TOML**, root key `mcp_servers` (underscore) - a pasted JSON `mcpServers` block silently fails | Shared by ChatGPT desktop app, Codex CLI, IDE extension; `codex mcp add/list/login`; **cloud has no MCP** - only CLI/IDE/desktop read the shared local config |
| Cowork | App-managed "connectors," installed via plugin or Customize > Connectors | Same underlying `.mcp.json` package format as Claude Code plugins | **Connectors reach external services through Anthropic's cloud, not the local network** - a custom connector must be reachable over the public internet from Anthropic's IP ranges; local MCP servers bundled in a plugin only work through the desktop app |

## The single highest-impact gotcha

**Codex uses TOML with an underscored root key (`mcp_servers`), not the JSON `mcpServers` shape every other harness uses.** A config block copy-pasted from a Claude Code or Cursor project silently fails on Codex rather than erroring loudly - there is no parse error, the server simply never registers. Any cross-harness MCP-registration template or worked example must show the Codex TOML form as its own case, not a JSON-to-TOML mechanical translation left as an exercise for the reader.

```toml
[mcp_servers.example]
command = "npx"
args = ["-y", "@example/mcp-server"]

[mcp_servers.example.env]
API_KEY_ENV_VAR = "value"
```

versus the JSON shape every other harness expects:

```json
{
  "mcpServers": {
    "example": {
      "command": "npx",
      "args": ["-y", "@example/mcp-server"],
      "env": { "API_KEY_ENV_VAR": "value" }
    }
  }
}
```

## Cowork's reachability constraint is a real architectural difference, not a config detail

Every other harness's MCP client runs on the user's machine (or a CI runner under the user's control) and can reach `localhost` and the private network. Cowork's connectors run through Anthropic's cloud infrastructure: "a custom connector must be reachable over the public internet from Anthropic's IP ranges." A capability that assumes it can register a `localhost`-bound MCP server and have every harness reach it will work on Claude Code, Cursor, and Codex CLI/IDE - and silently fail to connect from a Cowork session. If a capability needs to work in Cowork, its MCP server needs a publicly reachable endpoint, not just a stdio/local-HTTP process.

## Capability negotiation is the protocol mechanism underneath registration

Per the official MCP specification (`research/external/2026-08-14-mcp-capability-negotiation.md`): "clients and servers explicitly declare their supported features during initialization... capabilities determine which protocol features and primitives are available during a session." Registering a server identically in two harnesses does not guarantee identical behavior, because the *harness* is the MCP host/client and it is what negotiates which protocol features (resource subscriptions, sampling, elicitation) are actually in play for that session. When a registered server behaves inconsistently across harnesses, check what the harness declared as a client before assuming the server itself is broken.

A newer draft `server/discover` operation lets a client query a server's supported protocol versions and capabilities before any other request - an explicit pattern for probing cheaply before committing to a transport or feature assumption. Apply the same discipline one level up when deciding how to register a server across harnesses: detect what each harness's MCP client actually supports (transport types, OAuth flows, elicitation) rather than assuming the newest or richest harness's behavior is the floor.

## When MCP isn't the right call

If the capability only needs to react to lifecycle events, a hook is lighter weight and doesn't require standing up a server process - see `guides/02-hook-lifecycle.md`. If the capability needs a dedicated UI surface, MCP alone won't provide one - see `guides/00-decision-framework.md`'s decision matrix. MCP is the right call specifically when the model needs to call a tool with a stable, typed contract, potentially from multiple harnesses reading the same underlying service.

---

*See also:* `examples/register-mcp-in-hermes.md` for a fully worked historical registration flow, and `examples/case-study-hivemind-six-host-installer.md` §6 for the shared-helper pattern (`ensureMcpServerInstalled`) used to keep MCP-registration logic in one place across multiple MCP-capable hosts.
