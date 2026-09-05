# 01 - Transport: stdio vs HTTP

When to use stdio versus Streamable HTTP (+ optional SSE) for an MCP server, general-purpose, plus the stdio-hygiene defects to audit for regardless of which server you're looking at.

---

## The two transports

MCP is transport-agnostic JSON-RPC 2.0. The transport layer is explicitly responsible for connection establishment, message framing, *and authorization* [external/mcp-spec-architecture.md]. Two transports are standardized:

| Transport | Shape | Lifecycle | Use when |
|---|---|---|---|
| **stdio** | Server is a child process; JSON-RPC messages flow over stdin/stdout, one JSON object per line. stderr is for logs only. | The client spawns and owns the process; closing stdin ends the session. Typically serves a single MCP client. | Local, single-client, per-user tools. The server runs on the same machine as the agent, credentials come from the environment. |
| **Streamable HTTP** (with optional SSE for server-to-client streaming) | Server is a long-lived HTTP endpoint; client POSTs JSON-RPC, server replies and can stream notifications over SSE. | Server runs independently; typically serves many clients over the network. | Remote / multi-tenant / shared servers, or when the server must outlive any single client. Supports standard HTTP auth (bearer tokens, API keys, custom headers) - see `guides/06-authentication.md`. |

[external/mcp-spec-architecture.md]

The deciding question is almost always: **who owns the process, and how many clients share it?** One user, one machine, client-spawned -> stdio. Shared, remote, network-addressable -> HTTP. This is also the transport decision Claude Cowork forces on you for connectors specifically - see `guides/08-harness-registration.md` for why a stdio-only server cannot be registered as a Cowork connector at all.

---

## Choosing stdio

A stdio server is correct when:
- **Credentials are per-user and local.** The server reads a local env var or credentials file; each user's client spawns its own server instance with its own identity. There is no shared multi-tenant endpoint to authenticate against.
- **The client owns the lifecycle.** The harness spawns the server as a subprocess (`command: node .../server.js`, `command: python .../server.py`, etc.). No port, no network listener, no separate deployment to operate.
- **stdio's spec-sanctioned auth shortcut applies.** The MCP Authorization spec explicitly says STDIO transport implementations **SHOULD NOT** follow the HTTP OAuth flow at all, and should instead retrieve credentials from the environment [external/mcp-spec-authorization.md]. This is not a workaround - it's the documented, correct pattern for local servers.

**stdio hygiene (audit for this on every stdio server, not just one specific one):**
- **Nothing writes to stdout except the transport.** stdout is reserved for the JSON-RPC frame stream; a stray `console.log`/`print` corrupts every message after it. This is the single most common stdio defect.
- **All logs and fatal output go to stderr**, ideally structured (one JSON object per line with fields like `level`, `tool`, `requestId`, `durationMs`) so operators can query them [external/mcp-testing-debugging-veprompts.md].
- **Process managers and containers frequently merge stdout+stderr by default**, silently breaking the above - verify the *actual deployment*, not just a local `node server.js` run [external/mcp-testing-debugging-veprompts.md].
- **The uncaught/fatal path exits non-zero and logs to stderr** so the client sees the process die rather than hang on a dead pipe.
- **The server connects exactly once** (`await server.connect(transport)`); no double-connect.
- **No port is opened, no network dependency is introduced** for a pure stdio server.
- **Environment-mismatch trap:** GUI clients (Claude Desktop, Cursor, etc.) frequently do **not** inherit shell environment variables the way a terminal does. A server that "works when I run it by hand" and can't find its credentials when the client launches it is very often this mismatch, not a code defect - fix by launching the client from a terminal with the vars set, or moving config into a file the client reads directly [external/mcp-testing-debugging-veprompts.md].

---

## Choosing HTTP

An HTTP (Streamable HTTP, optionally with SSE) server is correct when any of these are true:
- The server must be shared by multiple users behind one network endpoint - credentials move from a local file to per-request auth (bearer token, API key, or full OAuth 2.1 - see `guides/06-authentication.md`), which is a genuinely different security model, not just a transport swap.
- The server must stream long-running progress notifications to a remote client.
- A harness can only reach tools over a network endpoint and cannot spawn subprocesses at all - this is Claude Cowork's situation for connectors: a stdio-only server simply cannot be registered there (see `guides/08-harness-registration.md`).

**HTTP hygiene to audit for:**
- Per-request authentication - HTTP is stateless, so every single request must independently prove it's authorized, not rely on a prior handshake [external/mcp-testing-three-layers-autonoma.md].
- SSE used only for server-to-client streaming notifications; request/response traffic stays on POST.
- Session lifecycle handled explicitly - the server can outlive any one client, so reconnects and clean teardown matter.
- Transport-specific failure classes get their own tests: for HTTP, the no-header / expired-token / under-scoped-token cases; for SSE, incremental frame parsing as data arrives and reconnect/resume after a dropped connection (the failure mode that "never shows up in local development and always shows up in production behind a load balancer") [external/mcp-testing-three-layers-autonoma.md]. See `guides/07-testing-mcp.md`.

---

## Switching transports is a security-model decision, not a config edit

Flag a transport-change proposal (escalate, do not silently implement) whenever it moves a server from stdio to HTTP or vice versa - it always drags a second decision behind it: how credentials work. Moving stdio -> HTTP means moving from "read from the environment" to "validate a bearer token or OAuth flow on every request" (`security-worker-bee` territory for the credential-storage/OAuth-implementation half; `guides/06-authentication.md` for the MCP-side protocol half).

---

## Audit checklist (transport)

- [ ] Transport matches deployment: local + per-user => stdio; remote + shared => HTTP.
- [ ] Nothing writes to stdout except the transport. All logs go to stderr.
- [ ] The fatal/uncaught path exits non-zero and logs to stderr (so the client sees the process die rather than a hung pipe).
- [ ] The server connects exactly once (`await server.connect(transport)`); no double-connect.
- [ ] For stdio, no port is opened and no network dependency is introduced; credentials come from the environment per the MCP Authorization spec's stdio carve-out.
- [ ] For HTTP, every request independently proves authorization; tokens never appear in the URL query string.
- [ ] If a Cowork registration is the goal, the server is (or will be) HTTP-reachable over the public internet - stdio cannot satisfy Cowork's connector model at all (`guides/08-harness-registration.md`).

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-mcp-spec-lifecycle.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/external/mcp-spec-architecture.md`, `research/external/mcp-spec-authorization.md`, `research/external/mcp-testing-debugging-veprompts.md`, `research/external/mcp-testing-three-layers-autonoma.md`*
