# Architecture overview - Model Context Protocol
- URL: https://modelcontextprotocol.io/docs/learn/architecture.md
- Fetched: 2026-08-14
- Source type: official docs
- Component: primitives overview, transport layer, capability negotiation

## Why this source

The official conceptual map of MCP: participants (host/client/server), the two-layer model (data layer + transport layer), the three server primitives (tools/resources/prompts) plus client primitives (elicitation; sampling and logging both deprecated as of protocol version 2026-07-28), and a full worked discovery -> list -> call example with JSON-RPC payloads.

## Key facts

- **Participants:** MCP Host (the AI application, e.g. an IDE) creates one MCP Client per MCP Server it connects to. Local (stdio) servers typically serve a single client; remote (Streamable HTTP) servers typically serve many clients concurrently.
- **Two layers:**
  - *Data layer* - JSON-RPC 2.0 message structure and semantics: discovery, server features (tools/resources/prompts), client features (elicitation), utility features (notifications, progress).
  - *Transport layer* - connection establishment, message framing, and **authorization**, i.e. auth is explicitly a transport-layer concern, not a data-layer one.
- **Transport mechanisms, spec-level framing:**
  - *Stdio transport* - stdin/stdout, direct process communication, local-only, no network overhead.
  - *Streamable HTTP transport* - HTTP POST for client-to-server, optional SSE for server-to-client streaming; enables remote servers; supports standard HTTP auth (bearer tokens, API keys, custom headers); "MCP recommends using OAuth to obtain authentication tokens."
- **Three server primitives**, repeated verbatim as the canonical definition:
  - Tools - executable functions the AI invokes to perform actions.
  - Resources - data sources providing contextual information (file contents, DB records, API responses).
  - Prompts - reusable templates that structure interactions (system prompts, few-shot examples).
  - Each has `*/list` (discovery), `*/get` or `*/read` (retrieval), and tools additionally have `tools/call` (execution).
- **Client primitives:** Elicitation (server asks the user/client for more input, `elicitation/create`) is current. Sampling (`sampling/createMessage`, server asks the client's LLM for a completion) and Logging (server pushes log notifications) are **deprecated** as of protocol version 2026-07-28 - new implementations should integrate directly with LLM provider APIs and log to stderr/OpenTelemetry instead.
- **Statelessness:** MCP is a stateless protocol; every request carries protocol version and capabilities in a `_meta` field so the server can process each request independently. Discovery via `server/discover` is optional but conventional; a cacheable response includes `ttlMs` and `cacheScope` hints.
- **Notifications:** JSON-RPC notifications (no response expected) carry list-changed events (e.g. `notifications/tools/list_changed`); change notifications are opt-in via a `subscriptions/listen` stream naming the wanted types.

## Relevance to this stinger

Confirms the general tools/resources/prompts framing already in `00-principles.md` and `02-tool-design.md` (previously Hivemind-scoped) is spec-accurate and generalizable. The explicit statement that "MCP recommends using OAuth to obtain authentication tokens" for HTTP grounds the new authentication guide. The sampling/logging deprecation is worth a one-line callout so a builder doesn't reach for a deprecated client primitive.
