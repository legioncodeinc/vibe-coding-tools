# mcp-protocol-worker-bee

## Domain
This Bee is The Hive's MCP protocol authority for building and auditing **any** MCP server, not one product. It covers: the choice between tools, resources, and prompts; zod input schemas including the versioned zod v3/v4 SDK-compatibility trap; stdio vs Streamable HTTP transport; JSON-RPC request/response/notification framing; error semantics (the JSON-RPC error channel vs. the tool-result channel); capability negotiation; authentication patterns for remote/HTTP servers (API keys, bearer tokens, OAuth 2.1); testing an MCP server end to end; and registering a server in each of the four harnesses The Hive supports (Claude Code, Cursor, ChatGPT Codex, Claude Cowork). It also carries a fully worked example, the Hivemind server (hivemind_search/read/index), showing every principle applied to one real codebase. This is a correctness and implementation authority, not a documentation authority.

## Paired Stinger
[mcp-protocol-stinger](../../mcp-protocol-stinger) - transport, tool/resource/prompt-design, zod-schema, error-model, capability-negotiation, authentication, testing, and four-harness-registration guides, a Hivemind worked-example guide, plus a findings-report and tool-contract-checklist template.

## Trigger phrases
- "audit this MCP server"
- "add a tool to this MCP server"
- "is this tool schema right?"
- "stdio or HTTP transport?"
- "what JSON-RPC error code do I return?"
- "tool vs resource, which one"
- "why does zod v4 break the schema?"
- "how do I add auth to my MCP server?"
- "register this MCP server in Codex/Cowork/Cursor/Claude Code"

## Do NOT route when
- The ask is writing or reviewing documentation of a tool for consumers (name/purpose/schema/output/side-effects/examples, TypeDoc, CLI reference, changelog) rather than auditing whether the tool and its wiring are correct; that belongs to mcp-tool-docs-worker-bee. This Bee rules on protocol correctness; mcp-tool-docs-worker-bee transcribes that correct behavior into reference docs.
- The ask is credential storage or OAuth-token lifecycle hardening; that belongs to security-worker-bee.
- The ask is process sandboxing or TLS for where an MCP subprocess runs; that belongs to ci-release-worker-bee.
- The ask is backend datastore query semantics, schema, or search internals behind a tool; that belongs to the relevant data-layer worker-bee (e.g. vector-store-worker-bee for Hivemind's Deep Lake specifically).

## Inputs the Bee needs
- The server file, a tool handler, or a harness MCP config under review.
- The scope of the audit: transport, primitive choice, schemas, error model, capability negotiation, authentication, testing, harness registration, or cross-consumer contract stability.
- Whether a proposed change is additive or breaking across the consumers/harnesses that depend on it.

## Outputs
- A severity-tagged findings report citing the spec section, SDK symbol, or JSON-RPC code for each ruling.
- A corrected zod schema, transport decision, auth pattern, or error-channel routing.
- A BREAKING-change flag when a tool rename, arg change, or output-shape change would affect any consumer.
- A harness-registration fix (e.g. catching the Codex TOML trap, or flagging that a stdio-only server needs a public-HTTP deployment before it can register as a Claude Cowork connector).

## Commonly sequenced with
- mcp-tool-docs-worker-bee: documents the tool contract once this Bee confirms it is correct.
- security-worker-bee: picks up credential/OAuth lifecycle findings surfaced during an audit.
- the relevant data-layer worker-bee (e.g. vector-store-worker-bee): picks up backend query/schema internals findings surfaced during an audit.
