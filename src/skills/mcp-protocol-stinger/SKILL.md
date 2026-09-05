---
name: "mcp-protocol-stinger"
description: "MCP protocol authority for The Hive - builds and audits MCP servers and tool contracts against the Model Context Protocol spec and @modelcontextprotocol/sdk. Covers tool vs resource vs prompt design, zod input schemas (incl. the zod v3/v4 SDK trap), stdio vs HTTP transport, JSON-RPC framing and error semantics, capability negotiation, auth for remote/HTTP servers (API keys, bearer, OAuth 2.1), testing, and registering a server in Claude Code, Cursor, Codex, and Cowork. Includes a worked example (the Hivemind server). Activate for \\\\\\\"audit this MCP server\\\\\\\", \\\\\\\"add a tool\\\\\\\", \\\\\\\"is this schema right?\\\\\\\", \\\\\\\"stdio or HTTP?\\\\\\\", \\\\\\\"JSON-RPC error code?\\\\\\\", \\\\\\\"tool vs resource\\\\\\\", \\\\\\\"why does zod v4 break the schema?\\\\\\\", \\\\\\\"add auth to my MCP server\\\\\\\", \\\\\\\"register this in Claude Code/Cursor/Codex/Cowork\\\\\\\". Do NOT activate for credential/OAuth storage (security-worker-bee), process sandboxing/TLS (ci-release-worker-bee), or backend datastore internals (the relevant data-layer worker-bee)."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Any MCP server built with @modelcontextprotocol/sdk (or an equivalent SDK in another language) over stdio or Streamable HTTP transport.
metadata:
  hive-tier: worker
  paired-bee: mcp-protocol-worker-bee
  research-window: 2026-06-16 (original Hivemind-era research, kept) plus 2026-08-14 (four-harness reuse + general MCP broadening pass)
---

# mcp-protocol Stinger

Procedural arsenal for `mcp-protocol-worker-bee`, the MCP protocol authority for The Hive.

This stinger encodes the reference material needed to build and audit **any** MCP server's protocol correctness and tool contract against the MCP specification, `@modelcontextprotocol/sdk` (or an equivalent), and JSON-RPC 2.0 - plus how to register a server in each of the four harnesses The Hive supports. It is organized around general, server-agnostic guides (00-08), a fully worked example applied to one real server (09, the Hivemind agent-memory server this pair originally shipped for), templates for common deliverables, and worked examples for frequent tasks.

**Paired Bee:** `../../agents/mcp-protocol-worker-bee.md`

---

## First action when this stinger is loaded

Read these in order before doing anything:

1. **`guides/00-principles.md`** - spec-first reasoning; tool idempotency + side-effect declaration; tools vs resources vs prompts; JSON-RPC error-code honesty. This is the foundation every other guide builds on.
2. The guide most relevant to the current task (see index below).

Then pick the appropriate template from `templates/` for the deliverable the Bee is producing. If the server under review is Hivemind specifically, also read `guides/09-hivemind-worked-example.md` for the concrete, ground-truthed version of every rule.

---

## Guide index

| Guide | Topic | When to open |
|---|---|---|
| `guides/00-principles.md` | Spec-first reasoning; idempotency; tools vs resources vs prompts; error-code honesty | Every invocation |
| `guides/01-transport.md` | stdio vs Streamable HTTP; stdio hygiene; when a transport change is really an auth-model change | Transport-choice questions; "stdio or HTTP?" |
| `guides/02-tool-resource-prompt-design.md` | Tool vs resource vs prompt; anatomy of a well-formed tool; content types and output schemas | Designing or auditing a tool; "tool or resource?" |
| `guides/03-zod-schemas.md` | zod input schemas; the versioned zod v3/v4 SDK-compatibility trap | Schema authoring; "why is the schema empty?"; "why does zod v4 break the schema?" |
| `guides/04-error-model.md` | Two failure channels; JSON-RPC codes; classifying raw backend errors | Error reviews; "what code do I return?" |
| `guides/05-capability-negotiation.md` | initialize/discovery lifecycle; capabilities as a contract; deprecated primitives | Handshake questions; capability mismatches |
| `guides/06-authentication.md` | Auth patterns for remote/HTTP servers: API keys, bearer tokens, OAuth 2.1 | "How do I add auth to my MCP server?"; auditing a remote server's auth boundary |
| `guides/07-testing-mcp.md` | Layered testing model (protocol, unit, integration, tool-selection, transport); the boundary-mock pattern | Writing or auditing MCP tests |
| `guides/08-harness-registration.md` | Registering a server in Claude Code, Cursor, Codex, and Cowork; the Codex TOML trap; Cowork's public-reachability constraint | "Register this MCP server in \<harness\>" |
| `guides/09-hivemind-worked-example.md` | Every principle above, applied concretely to the Hivemind server | Auditing Hivemind specifically; wanting a full worked example |

---

## Template index

| Template | Use when |
|---|---|
| `templates/findings-report.md` | Producing the MCP server / tool audit findings report |
| `templates/tool-contract-checklist.md` | Evaluating whether a tool is well-formed and contract-stable |
| `templates/error-channel-matrix.md` | Routing a failure to the correct channel (JSON-RPC error vs tool result) |
| `templates/transport-decision.md` | Choosing stdio vs HTTP, or diagnosing stdio hygiene |

---

## Example index

| Example | Shows |
|---|---|
| `examples/add-hivemind-tool.md` | Add a new `hivemind_*` tool with a zod/v3 schema, matching the Hivemind worked example's contract |
| `examples/expose-a-resource.md` | Expose a stable document as an MCP resource (the tool-vs-resource decision) |
| `examples/test-mcp-tool.md` | Test an MCP tool with the Vitest boundary-mock pattern |

These worked examples are grounded in the Hivemind codebase (see `guides/09-hivemind-worked-example.md`); the design decisions they walk through generalize per `guides/00-08`.

---

## Critical directives (lifted from Command Brief)

- **Cite the spec section or SDK symbol for every ruling.** Why: it is the only way the developer can verify the ruling and learn the principle, not just take the Bee's word.
- **Never conflate the JSON-RPC error channel with the tool-result channel.** Why: dressing a protocol fault as a success (or vice versa) is the MCP analog of HTTP "200 with error body" and poisons the agent's context.
- **The zod import at the SDK boundary MUST be `zod/v3`.** Why: the SDK generates tool JSON Schemas against v3 internals; v4 produces a wrong/empty schema and breaks param validation.
- **Treat tool names + arg shapes + parseable output as a cross-harness contract.** Why: Hermes, OpenClaw, pi, Claude Code, Codex, and Cursor all depend on them; a rename is breaking, not a refactor.
- **Do not audit Deeplake credential/OAuth lifecycle** - hand off to `security-worker-bee`. **Do not audit Deeplake query/schema internals** - hand off to `vector-store-worker-bee`.

---

## Scope note: general MCP work vs the Hivemind worked example

This pair originally shipped scoped to one product (Hivemind, an npm-distributed agent-memory MCP server: tools `hivemind_search`/`hivemind_read`/`hivemind_index`, Deep Lake credentials, a `mcp/bundle` build output). It has been broadened to cover building and auditing MCP servers **generally** - any tool/resource/prompt design question, any zod schema question, any transport or auth or testing or harness-registration question applies to any MCP server, not just Hivemind's. The Hivemind material was not deleted: it is preserved in full as `guides/09-hivemind-worked-example.md`, a clearly labeled worked example showing every general principle applied to one real, shipped server. Use guides 00-08 for anything general; use guide 09 when the server actually under review is Hivemind, or when you want to see the general rules exercised end to end.

---

## Folder layout

```
mcp-protocol-stinger/
+- SKILL.md                                  (this file - master index)
+- README.md                                 (one-page human overview)
+- guides/
|  +- 00-principles.md                       (spec-first reasoning; idempotency; primitives; error honesty)
|  +- 01-transport.md                        (stdio vs HTTP, general; stdio hygiene)
|  +- 02-tool-resource-prompt-design.md      (tool vs resource vs prompt; anatomy of a well-formed tool)
|  +- 03-zod-schemas.md                      (zod input schemas; the versioned v3/v4 SDK trap)
|  +- 04-error-model.md                      (two channels; JSON-RPC codes; classifying raw errors)
|  +- 05-capability-negotiation.md           (initialize/discovery lifecycle; capabilities; deprecated primitives)
|  +- 06-authentication.md                   (auth patterns for remote/HTTP servers: API keys, bearer, OAuth 2.1)
|  +- 07-testing-mcp.md                      (layered testing model; boundary-mock Vitest pattern)
|  +- 08-harness-registration.md             (Claude Code / Cursor / Codex / Cowork registration; the Codex TOML trap; Cowork public-reachability)
|  +- 09-hivemind-worked-example.md          (every principle above, applied to the Hivemind server - WORKED EXAMPLE, not general guidance)
+- examples/
|  +- add-hivemind-tool.md                   (new hivemind_* tool with a zod/v3 schema)
|  +- expose-a-resource.md                   (expose a document as an MCP resource)
|  +- test-mcp-tool.md                       (test an MCP tool with Vitest)
+- templates/
|  +- findings-report.md                     (audit output template)
|  +- tool-contract-checklist.md             (tool well-formedness + contract stability)
|  +- error-channel-matrix.md                (JSON-RPC error vs tool-result routing)
|  +- transport-decision.md                  (stdio vs HTTP + stdio hygiene)
+- reports/
|  +- README.md                              (how audit findings accumulate)
+- research/
   +- distilled-mcp-protocol.md              (NEW - the general MCP distillation: tool/resource/prompt design, zod v3/v4 trap, transport, JSON-RPC, capabilities, auth, testing, four-harness registration)
   +- research-plan.md, research-summary.md, index.md   (original Hivemind-era research trail, kept)
   +- 2026-06-16-*.md                        (6 files, original Hivemind-era MCP SDK + protocol notes, kept)
   +- external/                              (NEW - 8 general-purpose sources archived 2026-08-14: MCP spec pages, zod v3/v4 ecosystem issues, MCP server testing guides)
```

---

*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
