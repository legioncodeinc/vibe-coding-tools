# 08 - Registering an MCP Server in Each of the Four Harnesses

New guide - the original Hivemind-only pair never covered this at all; it only described registering the "Hermes" harness, which is not part of The Hive's four supported harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork). Every fact below is reused from queen-bee-stinger's already-researched four-harness digest at `.claude/skills/queen-bee-stinger/references/research/distilled-research-articles.md` - this stinger does not re-research harness registration mechanics, only the protocol content that goes inside the registered server (guides 00-07).

---

## Claude Code: `.mcp.json`

MCP servers register in `.mcp.json` at the project root (or `~/.claude.json` for user-scope / per-project entries), a flat `mcpServers` map, following Claude Code's standard configuration precedence (Managed > command-line args > Local > Project > User) [queen-bee-stinger/distilled-research-articles.md]. Inside a plugin, `.mcp.json` lives at the **plugin root**, never nested inside `.claude-plugin/` - that's a documented common mistake for every plugin-bundled component, not specific to MCP - and can reference `${CLAUDE_PLUGIN_ROOT}`-style path variables for portability [queen-bee-stinger/distilled-research-articles.md].

Practical registration for a stdio server:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["dist/server.js"]
    }
  }
}
```

Audit point: confirm the `command`/`args` actually match the built artifact's real launch path, and that the server's stdio hygiene (`guides/01-transport.md`) holds - Claude Code spawns and owns the process exactly like any other stdio-consuming harness.

---

## Cursor: `mcp.json`

Cursor uses its own `mcp.json`, the same JSON `mcpServers`-map shape as Claude Code. Because the shape is nearly identical to Claude Code's, this is also where a builder is most likely to *correctly* reuse a config block across the two - unlike the Codex case below, where reusing the same JSON block silently breaks.

---

## ChatGPT Codex: TOML, not JSON - the documented trap

**Codex uses TOML for MCP config, not JSON, and pasting a Claude Code/Cursor-style `mcpServers` JSON block into it silently fails.** This is cited exactly as researched and archived by queen-bee-stinger: "Codex uses TOML, not JSON, for MCP config — pasting a Claude Code/Cursor-style `mcpServers` JSON block silently fails. Correct root key is `mcp_servers` (underscore), not `mcp.servers`/`mcp-servers`" [queen-bee-stinger/distilled-research-articles.md, citing raw/codex--plugins--mcp.md].

- **Config location:** `config.toml` (`~/.codex/config.toml`, or `.codex/config.toml` for trusted projects) - shared across the Codex CLI, IDE extension, and desktop app [queen-bee-stinger/distilled-research-articles.md].
- **Correct root key:** `[mcp_servers.<name>]` (underscore-separated, TOML table syntax), not a JSON `mcpServers` map and not `mcp.servers`/`mcp-servers`.
- **Stdio server example:**
  ```toml
  [mcp_servers.context7]
  command = "npx"
  args = ["-y", "@upstash/context7-mcp"]
  env_vars = ["LOCAL_TOKEN"]

  [mcp_servers.context7.env]
  MY_ENV_VAR = "MY_ENV_VALUE"
  ```
- **HTTP server example:**
  ```toml
  [mcp_servers.figma]
  url = "https://mcp.figma.com/mcp"
  bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
  ```
  [queen-bee-stinger/distilled-research-articles.md]
- **Key fields:** stdio uses `command` (required), `args`, `env`, `env_vars`, `cwd`; HTTP uses `url` (required), `auth` (`oauth` default or `chatgpt`), `bearer_token_env_var`, `http_headers`. Shared: `startup_timeout_sec` (default 10), `tool_timeout_sec` (default 60), `enabled`, `required` (fail startup if unreachable), `enabled_tools`/`disabled_tools`, `default_tools_approval_mode` [queen-bee-stinger/distilled-research-articles.md].
- **CLI path:** `codex mcp add <server-name> --env VAR1=VALUE1 -- <stdio server-command>`. There is no `enable`/`disable` CLI subcommand as of the researched date - toggle the `enabled` key by hand in `config.toml` [queen-bee-stinger/distilled-research-articles.md].
- **Codex cloud does not support MCP at all** as of the researched date (open feature request) - only the CLI, IDE extension, and desktop app read the shared local `config.toml` [queen-bee-stinger/distilled-research-articles.md]. If a registration target is Codex cloud specifically, escalate - there is no MCP path there yet.
- **Other documented Codex MCP gotchas:** transport is inferred implicitly (`command` present = stdio, `url` present = HTTP; both present is an error); `codex mcp add` cannot set `oauth_resource` (needs a manual TOML edit); a cold `npx` install can exceed the default 10s `startup_timeout_sec`; a missing bearer-token env var produces a `401`; some servers connect successfully but expose zero tools (a known handshake bug as of the researched date) [queen-bee-stinger/distilled-research-articles.md].

**Audit rule:** if you see a JSON `{ "mcpServers": { ... } }` block being handed to a Codex config file, or a `[mcp.servers.*]`/`[mcp-servers.*]` TOML table key, flag it immediately - it will silently fail to register anything, and the failure mode (nothing happens, no error surfaced) makes it easy to mistake for a different bug.

---

## Claude Cowork: public-reachability constraint on connectors

**Claude Cowork's connector model requires the MCP server to be reachable over the public internet, not localhost - this is a hard architectural constraint on what can be registered at all, not a configuration nuance to tune.** Cited exactly as researched: "In Cowork, connectors reach external services through Anthropic's cloud, not your local network — a custom connector must be reachable over the public internet from Anthropic's IP ranges" [queen-bee-stinger/distilled-research-articles.md, from the "What a plugin bundles (Cowork framing)" table].

Practical consequence: **a stdio-only server - one that only ever runs as a subprocess spawned locally by a client (the worked example's Hivemind server is exactly this shape) - cannot be registered as a Cowork connector at all**, no matter how the config is written, because there is no local process for Anthropic's cloud to reach. Registering such a server for Cowork requires first standing up an HTTP-reachable, publicly-addressable deployment of it (see `guides/01-transport.md` for the stdio-to-HTTP transport decision, and `guides/06-authentication.md` for what auth that deployment then needs). This is a deployment and architecture decision, not something to attempt silently mid-registration - escalate it.

Cowork plugin packaging otherwise reuses the same bundle shape as Claude Code: `.mcp.json` at the plugin root, "a plugin built for one works in the other" [queen-bee-stinger/distilled-research-articles.md] - the *packaging format* is shared; the *reachability requirement* is Cowork-specific and does not apply to Claude Code or Cursor, both of which spawn the server process locally.

**Audit rule:** before recommending or confirming a Cowork connector registration, verify the target server is (or will be) deployed as a publicly-reachable HTTP endpoint. If it's currently stdio-only, say so explicitly and treat the transport change as its own decision with its own auth implications, not a checkbox to tick.

---

## Cross-harness registration checklist

- [ ] Claude Code: `.mcp.json` at the correct scope (project root, or plugin root if plugin-bundled), `mcpServers` JSON map, `command`/`args` match the real build artifact.
- [ ] Cursor: `mcp.json`, same JSON shape as Claude Code - do not assume it's identical to Codex's format.
- [ ] Codex: `config.toml`, TOML syntax, `[mcp_servers.<name>]` root key (underscore) - not a pasted JSON block, not `mcp.servers`/`mcp-servers`. Confirm whether the target is CLI/IDE/desktop (supported) or Codex cloud (MCP unsupported as of the researched date).
- [ ] Cowork: server is confirmed HTTP-reachable over the public internet, not stdio-only, before attempting connector registration; auth model for that public endpoint is decided (`guides/06-authentication.md`).
- [ ] If the same logical server is registered in more than one harness, the tool names/schemas/behavior are identical across all of them - this is a contract-stability question, see `guides/09-hivemind-worked-example.md` for the worked multi-consumer version of this rule.

---

*Sources: `.claude/skills/queen-bee-stinger/references/research/distilled-research-articles.md` (four-harness registration facts, reused per this pair's scope - not re-researched here). See `research/distilled-mcp-protocol.md` for the consolidated citation trail.*
