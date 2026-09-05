# How to Test an MCP Server: 3 Layers That Actually Work (Autonoma AI)
- URL: https://getautonoma.com/blog/how-to-test-an-mcp-server
- Source type: blog (practitioner)
- Fetched: 2026-08-14
- Component: general MCP server testing approach

## Why this source

A concrete, runnable three-layer testing model for MCP servers that generalizes past any one server or SDK, with a named reason each layer exists and what class of bug it alone catches. Published 2026-07-22, so current as of this research window.

## Key facts

- **The core insight:** an MCP server has a testing boundary a normal API doesn't - before your code ever runs, an LLM has to read a natural-language request, pick a tool, and construct arguments. You can get the deterministic code 100% right and still ship a broken experience if tool selection is wrong, so "does the tool work" and "does the model pick the tool" are two different questions requiring two different testing techniques.
- **Layer 1 - Protocol & Handshake** (deterministic, no LLM): does the server complete `initialize`, respond to `tools/list` with well-formed schemas, and return valid JSON-RPC from `tools/call`. Tooling: the official MCP Inspector in CLI/headless mode (`npx @modelcontextprotocol/inspector --cli <cmd> -- <server>`, scriptable with `jq` assertions), which makes this layer runnable in CI without a browser.
- **Layer 2 - Deterministic unit tests** (no LLM, no protocol): the tool's underlying function, imported and called directly (pytest/Vitest/whatever), asserting on return values and error handling with exact-match assertions. The stated principle: keep tool logic in plain functions with zero MCP-framing dependency so this layer stays cheap and fast - the MCP wrapper is a thin adapter over code that should be testable on its own.
- **Layer 3 - Tool selection (probabilistic)**: given a natural-language prompt, does the model pick the right tool with the right arguments, run N times (10-20 as a floor) and assert on semantic/property conditions rather than exact-match, because a single run only proves the happy path is *possible*, not *reliable*. A test that asserts an exact arguments dict breaks the moment the model rephrases a field with no functional difference.
- **Transport-specific failure modes**, each needing its own test class:
  - *stdio*: process lifecycle - does it start, complete the handshake, exit cleanly on client disconnect (a zombie process leaks file descriptors in a long-running host).
  - *HTTP*: every request must independently prove authorization (stateless) - test no-header, expired-token, and under-scoped-token cases specifically, not just the happy authorized path.
  - *SSE*: incremental `data:` frame parsing as it arrives (not waiting for stream close) and reconnect/resume behavior after a dropped connection - the failure mode that "never shows up in local dev and always shows up in production behind a load balancer."
- **Authorization test triad** (distinct from transport tests): rejection (no/invalid credential refused *before* any tool logic runs, not caught downstream), scoping (two valid credentials with different permissions see different tool lists/results, not a client-side filter that a different request could bypass), and expiry/refresh (a token valid at connect-time that expires mid-session fails cleanly on the next call; a refreshed token is picked up without a full reconnect).

## Relevance to this stinger

Supplies the general (non-Hivemind, non-Vitest-only) testing framework this pair's testing guide should lead with: protocol/handshake, deterministic handler units, and probabilistic tool-selection evals as three genuinely different techniques, plus the transport- and auth-specific test classes the old guide never covered because Hivemind is stdio-only with no HTTP/SSE/OAuth surface.
