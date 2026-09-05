# How to Test and Debug MCP Servers (veprompts.com)
- URL: https://veprompts.com/guides/mcp/testing-and-debugging/
- Source type: blog (practitioner)
- Fetched: 2026-08-14
- Component: general MCP server testing approach, stdio hygiene, CI checklist

## Why this source

A four-layer testing taxonomy (schema / handler / transport / end-to-end) plus a concrete CI checklist and a set of debugging patterns for the failure modes that show up specifically in MCP servers (stdout pollution, schema drift, environment differences between a terminal and a GUI client). Published 2026-06-12, updated 2026-06-17.

## Key facts

- **Four layers:** schema (do the Zod/JSON schemas match what the client expects, are tool names/descriptions/types stable), handler (do the pure functions accept args, call APIs, return valid MCP content), transport (do stdio/SSE/HTTP connections stay open, parse line-delimited JSON, recover from errors), end-to-end (do real clients like Claude Desktop/Cursor/Claude Code invoke tools correctly through natural language). Concrete example of why all four matter: a handler can pass every unit test yet fail in a real client because the JSON schema marks a parameter `required` when the handler actually treats it as optional - the client refuses to call the tool before the handler code ever runs, so only schema-level testing catches it.
- **stdout hygiene, restated as a debugging rule, not just a design rule:** "MCP uses stdout for protocol messages, so logging to stdout will corrupt the connection. Always log to stderr." Recommends structured JSON-per-line stderr logs with `level`, `tool`, `requestId`, `durationMs` fields, and warns that many hosting/process-manager setups merge stdout+stderr by default, silently breaking this.
- **Schema-as-single-source-of-truth:** export the same Zod schema object into both the tool registration and the unit tests, so the schema the client sees and the schema the tests validate against can never drift apart. Bump a version marker or publish a migration note on any optional-to-required parameter change, because every client with a cached old schema will break silently.
- **Transport-specific test checklist:** initialize handshake completes and announces the supported protocol version; `tools/list` returns the expected tool set and schemas; `tools/call` with valid input returns correctly-shaped content; malformed input produces a JSON-RPC error (not a transport crash); server restart or network blip recovers without a manual client reload; authentication failures return 401-equivalent *before* reaching tool logic.
- **Environment-mismatch debugging pattern specific to MCP clients:** GUI clients (Claude Desktop, Cursor) frequently do not inherit shell environment variables (`PATH`, API keys) the way a terminal session does - a server that "works when I run it by hand" and fails when the client launches it is very often this, not a code bug. Fix: launch the client from the terminal where the vars are set, or move config into a file the client reads directly.
- **CI checklist for MCP servers:** type-check + lint every PR; run unit tests per handler; run the Inspector in headless mode to verify tool discovery; confirm the built artifact launches with the documented command; check no secrets are logged to stderr; validate tool output against the MCP content schema; run transport tests for whichever of stdio/SSE/HTTP the server ships; run one smoke test against a real client config before releasing.

## Relevance to this stinger

Supplies the stdio-hygiene-as-debugging-checklist material (useful for the broadened transport guide, generalized past "Hivemind's fatal handler writes to stderr") and the environment-mismatch failure mode, which is a real, common bug class in MCP servers generally that the Hivemind-only guides never had reason to mention because Hivemind ships as a bundled subprocess with a fixed launch command.
