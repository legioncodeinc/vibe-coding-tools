# MCP SDK v1.17.5 Incompatible with Zod v4 - Breaking Changes (typescript-sdk#925)
- URL: https://github.com/modelcontextprotocol/typescript-sdk/issues/925
- Fetched: 2026-08-14
- Source type: GitHub issue (practitioner / upstream maintainer thread)
- Component: zod v3/v4 trap (ecosystem-wide, not Hivemind-specific)

## Why this source

Proves the zod v3-vs-v4 pin is not a Hivemind-only quirk this stinger invented - it is a documented, widely-hit ecosystem incompatibility between `@modelcontextprotocol/sdk` and zod v4, tracked upstream, that affected "all MCP servers using modern Zod versions" until the SDK added compatibility. Closed 2025-11-21 after ~2.5 months open, with dozens of downstream projects subscribing/referencing it.

## Key facts

- **Symptom:** with MCP SDK v1.17.5 + zod v4.1.5, tool calls fail at runtime with `w._parse is not a function` (minified internal-method error) and `tools/list` fails with `null is not an object (evaluating 'F._def')`.
- **Root cause:** the SDK had a hard dependency (`"zod": "^3.23.8"`) and called zod's *internal* API surface (`_def`, `_parse`) directly rather than its public API. Zod v4 restructured those internals (`_zod` property, top-level `z.parse()` instead of `schema.parse()`), so the SDK's internal calls broke silently at runtime, not at compile time - meaning `npm install` succeeds and the break only surfaces when a tool is actually invoked.
- **Suggested/adopted fix pattern:** detect the zod major version via `'_zod' in schema` and branch parsing accordingly (`z.parse(schema, data)` for v4 vs `schema.parse(data)` for v3) rather than assuming one API shape.
- **Interim workaround while unfixed:** pin `zod` to a v3.x release (`npm install zod@3.23.8`) - this is the general-audience version of the "the zod import at the SDK boundary must be a version the SDK actually supports" rule, independent of which specific server you're building.
- **Resolution:** SDK maintainer (felixweinberger) shipped a 1.23.0-beta.0 with "backwards compatible support for Zod v4," closing the issue on 2025-11-21 - roughly 2.5 months after the report. Referenced by follow-on issues in *other* unrelated projects ("Migrate Zod v3 to v4," a Japanese-language issue explicitly blocked on "waiting for the upstream MCP library"), confirming the blast radius extended well past any single server.

## Relevance to this stinger

This is the primary ecosystem-scope citation for the broadened zod guide: the v3/v4 trap is a documented `@modelcontextprotocol/sdk` compatibility class, not a Hivemind house rule, and it has a history (v1.17.5 broken -> 1.23.0-beta.0 partial fix -> still-ongoing edge cases, see the companion 2026 sources on issues #1987 and #2464). Anyone building a *new* MCP server on a recent SDK version needs to know which SDK version they're on and verify zod compatibility for that version specifically, not assume "v3 always, v4 never" is still literally true going forward.
