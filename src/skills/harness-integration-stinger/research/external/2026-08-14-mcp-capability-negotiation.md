# Model Context Protocol - Architecture and Capability Negotiation
- URL: https://modelcontextprotocol.io/specification/2025-11-25/architecture
- Fetched: 2026-08-14
- Source type: official docs (Model Context Protocol specification)
- Component: MCP server registration / capability negotiation, all four harnesses

## Client-host-server architecture

MCP follows a client-host-server architecture where each host (the harness: Claude Code, Cursor, Codex, Cowork) can run multiple client instances. Built on JSON-RPC, MCP is a stateful session protocol focused on context exchange and sampling coordination between clients and servers.

- **Host**: the container/coordinator. Creates and manages multiple client instances, controls connection permissions and lifecycle, enforces security policy and consent, coordinates AI/LLM integration and sampling, aggregates context across clients.
- **Clients**: created by the host, each maintains one isolated stateful session per server. Handles protocol negotiation and capability exchange, routes protocol messages bidirectionally, manages subscriptions/notifications, maintains security boundaries between servers.
- **Servers**: expose resources, tools, and prompts via MCP primitives. Operate independently with focused responsibilities, can request sampling through the client, must respect security constraints, can be local processes or remote services.

This maps directly onto how each harness in The Hive wires an MCP server: the harness (Claude Code, Cursor, Codex, Cowork) is the host; each registered server config (`.mcp.json`, `mcp.json`, `[mcp_servers.<name>]`, or a Cowork connector) spins up one client-to-server session.

## Capability negotiation (the general mechanism every harness's MCP registration rides on)

"The Model Context Protocol uses a capability-based negotiation system where clients and servers explicitly declare their supported features during initialization. Capabilities determine which protocol features and primitives are available during a session."

- Servers declare capabilities like resource subscriptions, tool support, and prompt templates.
- Clients declare capabilities like sampling support and notification handling.
- Both parties must respect declared capabilities throughout the session.
- Additional capabilities can be negotiated through protocol extensions.

Negotiation sequence: `Host` initializes a `Client`, the `Client` initializes a session with the `Server` by sending its capabilities, and the `Server` responds with its own supported capabilities. From that point the session runs with the negotiated feature set until the host terminates it.

"Each capability unlocks specific protocol features for use during the session" - e.g. a server must advertise tool support before tool invocation is legal; a client must declare sampling support before a server can request sampling through it. "This capability negotiation ensures clients and servers have a clear understanding of supported functionality while maintaining protocol extensibility."

## Why this matters for cross-harness integration

MCP's own capability negotiation is the canonical example of graceful degradation baked into a protocol: a server never assumes a client can do X, it advertises and the client advertises back, and only the intersection of declared capabilities is used. When wiring an MCP server into multiple harnesses (Claude Code `.mcp.json`, Cursor `mcp.json`, Codex `[mcp_servers.<name>]` TOML, Cowork connectors), the same discipline applies one level up: don't assume a harness supports a given transport, tool-approval mode, or elicitation flow - detect/declare and degrade per harness rather than hardcoding one harness's behavior as the baseline.

A newer `server/discover` operation (draft spec) lets a client query supported protocol versions, capabilities, and identity from a server before sending any other request - explicitly built for "stdio backward-compatibility": a client that supports both modern and legacy servers should call `server/discover` first and fall back if the server doesn't answer it. This is a direct pattern for the "capability detection and graceful degradation" section: probe cheaply, then choose the wiring mechanism the target actually supports rather than assuming the newest one.
