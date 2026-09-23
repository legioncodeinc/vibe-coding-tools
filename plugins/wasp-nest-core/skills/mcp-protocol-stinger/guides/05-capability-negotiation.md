# 05 - Capability Negotiation and Lifecycle

The MCP handshake, what capabilities a server declares, and what the SDK does for you, for any MCP server.

---

## The lifecycle, in order

Every MCP session follows this sequence over the chosen transport:

1. **`initialize` (request, client -> server).** The client sends its protocol version and its capabilities.
2. **`initialize` result (server -> client).** The server replies with the protocol version it agrees to, its `serverInfo` (name + version), and the set of capabilities it supports.
3. **`notifications/initialized` (notification, client -> server).** The client confirms it is ready. No response - notifications never get one.
4. **Normal operation.** `tools/list`, `tools/call`, and (if declared) `resources/*`, `prompts/*` flow.
5. **Shutdown.** For stdio, the client closes stdin and the process exits - there is no in-protocol "shutdown" RPC. For HTTP, session lifecycle is managed at the transport layer.

Some newer SDK/spec revisions use a stateless, `_meta`-carried discovery model instead (a `server/discover` request, per-request `protocolVersion`/`clientInfo`/`clientCapabilities`, cacheable responses with `ttlMs`/`cacheScope`) rather than a stateful `initialize` handshake [external/mcp-spec-architecture.md]. **Check which lifecycle shape the installed SDK actually implements before assuming the classic handshake universally applies** - this is the same "verify against the installed version" discipline as the zod trap in `guides/03-zod-schemas.md`.

---

## Capabilities are a contract, not decoration

The server declares which primitive groups it supports during initialization. A client must not call into a group the server did not declare. Common server capabilities:

- `tools` - the server exposes callable tools (optionally with `listChanged` if the tool set can change at runtime).
- `resources` - readable resources (optionally `subscribe`, `listChanged`).
- `prompts` - prompt templates (optionally `listChanged`).
- `logging` - the server can emit log notifications to the client (deprecated as of protocol version 2026-07-28 - prefer stderr/OpenTelemetry for new servers, see below).

**Declaring a capability you do not implement is a contract lie** that produces `-32601` (method not found) the first time a client acts on the declaration in good faith. If a server only registers tools, it should declare `tools` only - not `resources`/`prompts` "just in case."

### Deprecated client primitives

Sampling (`sampling/createMessage`, server asks the client's LLM for a completion) and Logging (server pushes log notifications to the client) are **deprecated as of protocol version 2026-07-28** [external/mcp-spec-architecture.md]. New implementations should integrate directly with an LLM provider's API instead of sampling, and log to stderr (stdio) or OpenTelemetry instead of the logging primitive. If auditing an older server that implements either, flag it as using a deprecated primitive worth migrating off, not as an active defect to rip out immediately - check what the currently-installed SDK version still supports before recommending removal.

---

## What the SDK handles

The server-construction call (`new McpServer({ name, version })` or equivalent) and each tool/resource/prompt registration call perform the handshake bookkeeping for you:

- `name` and `version` populate `serverInfo` in the `initialize` result (or the equivalent discovery response). Keep `version` synced to the real build/package version rather than hard-coded, so it's meaningful for debugging.
- Each registration call adds to the relevant capability (`tools`, `resources`, `prompts`) and its `*/list` response. The SDK derives the capability declaration from what was actually registered - you do not hand-write a capabilities object for the common case.
- Protocol-version negotiation, the `initialized` notification (or discovery response), and `*/list` are SDK-internal.

This means most capability-negotiation defects are *omissions or mismatches*, not handshake bugs:
- Wrong or stale `version` (fix the version sync, not the handshake).
- A misleading or colliding `name` when multiple servers share one harness config.
- Manually declaring `resources`/`prompts` capability while registering none (see above).

---

## Audit checklist (capabilities + lifecycle)

- [ ] `serverInfo.name` is stable and unique across the harness's configured server set.
- [ ] `serverInfo.version` reflects the real build version (synced, not hard-coded).
- [ ] Declared capabilities match implemented primitives - no phantom `resources`/`prompts`/`logging` capability with nothing registered behind it.
- [ ] No client-side calls into undeclared capability groups.
- [ ] `connect(transport)` (or equivalent) is called exactly once; the handshake mechanics are left to the SDK.
- [ ] Notifications (e.g. `initialized`, list-changed events) are not awaited for a response.
- [ ] Sampling/logging primitives, if implemented, are flagged as deprecated (protocol version 2026-07-28+) rather than treated as current best practice.

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-mcp-spec-lifecycle.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/external/mcp-spec-architecture.md`*
