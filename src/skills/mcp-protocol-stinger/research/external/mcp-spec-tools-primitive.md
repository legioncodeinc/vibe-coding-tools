# Tools - Model Context Protocol Specification
- URL: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- Fetched: 2026-08-14
- Source type: official spec
- Component: tool/resource/prompt design, error semantics

## Why this source

The normative spec section for the `tools` primitive: capability declaration, the `tools/list` and `tools/call` messages, the `Tool` data type (`name`, `title`, `description`, `inputSchema`, `outputSchema`, `annotations`), tool result shapes (unstructured `content`, `structuredContent`, resource links, embedded resources), and the two-channel error model. This is the authority `mcp-protocol-stinger` audits tool design against, generalized beyond any one server.

## Key facts

- Servers that support tools **MUST** declare the `tools` capability: `{ "capabilities": { "tools": { "listChanged": true } } }`. `listChanged` says whether the server emits notifications when its tool list changes.
- Tools are **model-controlled**: the model discovers and invokes them based on context. The protocol does not mandate a UI pattern, but applications **SHOULD** keep a human in the loop able to deny invocations, show which tools are exposed, and confirm before sensitive operations.
- `tools/list` supports pagination via a `cursor` param and returns a `nextCursor`.
- `tools/call` request: `{ "name": "...", "arguments": {...} }`. Response: `{ "content": [...], "isError": false }`.
- **Tool data type fields:** `name` (unique identifier), `title` (optional human-readable display name), `description`, `inputSchema` (JSON Schema for params), `outputSchema` (optional JSON Schema for structured results), `annotations` (optional behavior hints - clients **MUST** treat annotations as untrusted unless from a trusted server).
- **Tool result content types:** `text`, `image` (base64 + mimeType), `audio` (base64 + mimeType), `resource_link` (a URI a tool points at without embedding, not guaranteed to appear in `resources/list`), and `resource` (an embedded resource inlined by URI scheme; servers using these **SHOULD** implement the `resources` capability). All content types support optional annotations (`audience`, `priority`, `lastModified`).
- **Structured content:** returned in a `structuredContent` field as a JSON object; for backwards compatibility a tool returning structured content **SHOULD** also serialize the same JSON into a `text` content block. `structuredContent` is server-produced result data, unrelated to LLM "structured outputs."
- **Output schema:** if a tool declares `outputSchema`, servers **MUST** provide `structuredContent` that conforms to it, and clients **SHOULD** validate it. This is the general spec-level version of the "the parseable output is a contract" principle.
- **Two-channel error model, spec language:**
  1. *Protocol Errors* - standard JSON-RPC errors for unknown tools, invalid arguments, or server errors (example: `-32602 "Unknown tool: invalid_tool_name"`).
  2. *Tool Execution Errors* - reported inside a normal tool result with `isError: true` (example: API failures, invalid input data, business logic errors, still returned as a `result`, not a JSON-RPC `error`).
- **Security considerations (spec-mandated):** servers **MUST** validate all tool inputs, implement access controls, rate-limit invocations, and sanitize outputs. Clients **SHOULD** prompt for confirmation on sensitive operations, show tool inputs to the user before calling (to prevent malicious/accidental data exfiltration), validate tool results before passing to the LLM, timeout tool calls, and log usage for audit.

## Relevance to this stinger

This is the general, server-agnostic version of what the old Hivemind-only guides described narrowly. `outputSchema` and `structuredContent` are new surface not covered by the prior guides at all (Hivemind's tools predate/skip output schemas) - worth a callout in the broadened tool-design guide as an option beyond plain text content.
