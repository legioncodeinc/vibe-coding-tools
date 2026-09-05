# 00 - Principles

Core reasoning model for building and auditing any MCP server: the protocol spec, the JSON-RPC wire contract, and the SDK you're building against, in that order of authority. Applies to any server you build or review with this stinger; the worked Hivemind example (`guides/09-hivemind-worked-example.md`) shows the pattern applied to one concrete stdio server.

---

## SDK-first reasoning, spec-first authority

MCP semantics are defined by the protocol spec and implemented by the SDK, not by framework convention. Before ruling on any MCP concern, ask: "What does the spec / `@modelcontextprotocol/sdk` say?" The hierarchy is:

1. **MCP specification (modelcontextprotocol.io)** - the normative source for the lifecycle (initialize / discovery, capability negotiation), the three server primitives (tools, resources, prompts), the client primitives (elicitation; sampling and logging are deprecated as of protocol version 2026-07-28), and the JSON-RPC 2.0 message shapes [external/mcp-spec-architecture.md].
2. **JSON-RPC 2.0** - the wire contract underneath every MCP message: request, response, notification framing, and the error object (`code` + `message` + optional `data`).
3. **`@modelcontextprotocol/sdk`, the version actually installed** - the registration surface (`McpServer.registerTool(name, config, handler)` or equivalent) and transport classes (`StdioServerTransport`, the HTTP transport) are binding for whatever repo you're in. **Check the installed SDK version before citing an SDK behavior** - registration APIs, zod compatibility, and lifecycle details have all changed release to release (see `guides/03-zod-schemas.md`).
4. **zod, at whatever version the installed SDK actually supports** - do not assume "always v3" or "v4 is fine now" without checking; this is a versioned compatibility boundary, not a fixed rule (see `guides/03-zod-schemas.md`).
5. **This specific server's concrete contract** - its actual tool/resource/prompt names, auth model, and build output. This is the layer the worked example (`guides/09-hivemind-worked-example.md`) documents for Hivemind; every server you build or audit has its own version of this layer.

**Cite the spec section or the SDK symbol, not just "MCP says so."** "The SDK's `registerTool` config takes `inputSchema` as a raw zod shape" is auditable; "the protocol requires it" is not.

---

## Tool idempotency and side-effect declaration

(Transferable from HTTP idempotency, reframed for MCP.)

A tool's idempotency is not enforced by the protocol - it is a property of the handler you write, and consumers reason about it. State it explicitly.

| Property | Definition | Example |
|---|---|---|
| **Read-only** | The tool causes no state change. Safe to call repeatedly, safe to retry on transport error. | A search/lookup/list tool with no write path. |
| **Idempotent** | Calling N times produces the same backend state as calling once. | An upsert keyed on a stable content hash or client-supplied ID. |
| **Side-effecting / non-idempotent** | Each call can change state differently (append, increment, send). | A `create_ticket` or `send_email` tool - calling it twice creates two tickets/emails. |

Implications:
- Read-only tools should say so in their `description` so the model (and any harness retry logic) can call them freely.
- A side-effecting tool that might get retried on a transport hiccup needs an idempotency strategy (client-supplied key, dedupe on content) or an explicit "this writes; do not blind-retry" note.
- The MCP tool-annotation surface (`readOnlyHint`, `destructiveHint`, `idempotentHint`) is the structured, spec-level way to declare this - clients **MUST** treat annotations as untrusted unless they come from a trusted server, so annotations are a hint, not a substitute for an honest description [external/mcp-spec-tools-primitive.md].

---

## Tools vs resources vs prompts (the MCP uniform interface)

MCP exposes three server primitives [external/mcp-spec-architecture.md]. Choosing the wrong one is the MCP analog of putting a verb in a REST URL.

1. **Tools** - executable functions with a JSON Schema input. The model decides to invoke them and supplies the arguments. Use for actions and parameterized queries.
2. **Resources** - readable, addressable content identified by a URI, enumerated (`resources/list`) and fetched (`resources/read`) by the client without model-supplied arguments. Use for stable, enumerable context the client pulls deterministically (e.g. at session start) rather than hoping the model decides to call a tool for it.
3. **Prompts** - reusable, parameterized message templates the user selects (`prompts/list`, `prompts/get`).

Rule of thumb: **if the model must decide arguments and trigger a side effect or a search, it is a tool. If the client should be able to enumerate and pull addressable content directly, without the model needing to decide anything, it is a resource. If it is a canned interaction the user picks, it is a prompt.** See `guides/02-tool-resource-prompt-design.md` for the full design guide, including when an all-tools design (like Hivemind's) is a legitimate choice rather than a missed resource.

---

## JSON-RPC error-code honesty

The MCP analog of the "200 with error body" anti-pattern is **returning a successful tool result whose text says "error" instead of signaling the failure through the right channel** - or the reverse, throwing a protocol error for an ordinary domain outcome.

Two distinct failure channels exist, and conflating them is the core defect, restated at the spec level as *Protocol Errors* vs *Tool Execution Errors* [external/mcp-spec-tools-primitive.md]:

1. **Protocol-level JSON-RPC errors** - malformed request, unknown method, invalid params. These travel as a JSON-RPC `error` object with a numeric `code` (e.g. `-32602` Invalid params, `-32601` Method not found, `-32700` Parse error) and a `message`. The SDK raises these for you on schema-validation failure.
2. **Tool-execution results** - a tool that ran but produced a domain outcome (no matches, not authenticated, backend down). MCP models these as a normal tool result, with `isError: true` in the content, so the model sees the failure in-band.

Honesty rules (see `guides/04-error-model.md` for the full model):
- **Do not throw a JSON-RPC error for a normal domain outcome.** "No matches" is not a protocol fault.
- **Do not bury a real protocol fault inside a success result.** If params fail schema validation, let the SDK reject with `-32602`; do not catch it and hand back a cheerful "ok."
- **Never leak a raw backend error string as if it were a clean result.** Classify it into an honest, actionable message - the agent reads tool output verbatim into its context, so an unclassified stack trace or raw HTTP error body poisons that context.
- **`message` must be honest and actionable** - tell the caller exactly what to do next.

---

## Boundary with peer Bees

This pair (`mcp-protocol-stinger` / `mcp-protocol-worker-bee`) owns MCP protocol correctness: tool/resource/prompt contract shape, JSON-RPC framing, zod input schemas, the two-channel error model, capability negotiation, transport choice, authentication patterns, testing, and per-harness registration. It does **not** own:

| Concern | Owner |
|---|---|
| Credential/token storage hardening, OAuth flow implementation details beyond MCP's own spec | `security-worker-bee` |
| TLS termination / process sandboxing / where a server process actually runs in production | `ci-release-worker-bee` |
| Injection-safe query building inside a tool handler (OWASP-level) | `security-worker-bee` (flag here; hand off) |
| Backend datastore query semantics, schema, or search internals behind a tool | the domain-specific data-layer Bee for that backend (e.g. a vector-store or database worker-bee) |
| Documenting a confirmed-correct tool contract for consumers (reference docs, changelogs) | `mcp-tool-docs-worker-bee` |

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-mcp-spec-lifecycle.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/2026-06-16-jsonrpc-error-model.md`, `research/external/mcp-spec-architecture.md`, `research/external/mcp-spec-tools-primitive.md`*
