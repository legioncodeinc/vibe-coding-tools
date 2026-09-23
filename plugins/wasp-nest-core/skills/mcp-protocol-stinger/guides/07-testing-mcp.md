# 07 - Testing an MCP Server

A layered testing model for any MCP server, converged on independently by multiple 2026 practitioner sources [external/mcp-testing-three-layers-autonoma.md, external/mcp-server-testing-production-guide-yaw.md, external/mcp-testing-debugging-veprompts.md], plus the boundary-mock Vitest pattern for layer 2. The worked example (`guides/09-hivemind-worked-example.md`) shows this pattern applied concretely to one stdio server's test suite.

---

## The layers

1. **Protocol / handshake layer** - no LLM involved. Does `initialize` (or the newer `server/discover`) complete, does `tools/list` return well-formed schemas, does `tools/call` return valid JSON-RPC. Tooling: the official MCP Inspector's CLI/headless mode (`npx @modelcontextprotocol/inspector --cli <cmd> -- <server-entry>`), scriptable in CI with `jq` assertions on the JSON-RPC shape [external/mcp-testing-three-layers-autonoma.md].
2. **Deterministic handler/unit layer** - the tool's underlying function, imported and called directly, with zero MCP framing in the loop (no transport, no SDK plumbing, no LLM). Fast, exact-match, the bulk of the test suite. Keep handler logic in plain functions with no transport dependency specifically so this layer is cheap.
3. **Integration layer** - a real (or in-memory-transport) MCP client connected to the real server, calling `tools/list` then `tools/call` with a *known* argument shape, asserting protocol-level behavior: correct tool list, correct parameter validation, correct response format. Catches schema mistakes invisible to layer 2 - e.g. a schema marks a param `required` while the handler treats it as optional, so the client refuses to call the tool before the handler code ever runs [external/mcp-testing-debugging-veprompts.md].
4. **Tool-selection / end-to-end layer** - probabilistic, not deterministic. Given a natural-language prompt, does a real model pick the right tool with the right arguments. Run N times (10-20 as a floor) and assert on semantic/property conditions, not exact-match - a single run only proves the happy path is *possible*, not that it's reliable [external/mcp-testing-three-layers-autonoma.md]. **The harness pattern** fixes the most common brittleness here: instead of asserting the exact tool call the model made, assert the eventual system state (did the expected side effect actually happen), since the model can take multiple valid paths to the same correct outcome [external/mcp-server-testing-production-guide-yaw.md]:
   ```typescript
   test("creates a customer when asked", async () => {
     await modelChat("Make a customer for jeff@example.com");
     const customer = await fixture.findCustomer("jeff@example.com");
     expect(customer).toBeDefined(); // don't care whether it called create_customer or create_user
   });
   ```
   Run E2E suites on a schedule, not every push (slow, non-deterministic - the wrong gate for "did my change build"); score success rate across many runs and track the trend (95% -> 70% is signal, one failed run is noise); include negative prompts that should produce a graceful refusal rather than a hallucinated success [external/mcp-server-testing-production-guide-yaw.md].
5. **Transport-specific tests** - one class per transport actually shipped:
   - *stdio*: process lifecycle - starts, completes the handshake, exits cleanly on client disconnect (a leaked zombie process exhausts file descriptors in a long-running host).
   - *HTTP*: every request independently proves authorization (stateless) - test the no-header, expired-token, and under-scoped-token cases specifically, not just the happy authorized path (see `guides/06-authentication.md`).
   - *SSE*: incremental `data:` frame parsing as it arrives (not waiting for stream close), and reconnect/resume after a dropped connection - "the failure mode that never shows up in local development and always shows up in production behind a load balancer" [external/mcp-testing-three-layers-autonoma.md].

---

## The boundary-mock pattern (layer 2, worked in Vitest)

You cannot easily drive a real stdio handshake in a unit test, and you should not need to - the tool *handlers* are the logic worth testing directly; the transport and SDK plumbing are the SDK's job to have already tested. Capture the handler callbacks at registration time by stubbing the server class, then invoke each handler directly:

```typescript
const registeredTools = new Map<string, { config: any; handler: (args: any) => Promise<unknown> }>();

vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: class {
    constructor(_meta: unknown) {}
    registerTool(name: string, config: unknown, handler: (args: unknown) => Promise<unknown>) {
      registeredTools.set(name, { config: config as any, handler: handler as any });
    }
    async connect(_transport: unknown) {}
  },
}));
vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: class {},
}));
```

Now a test can do `registeredTools.get("<tool_name>")!.handler({ ... })` and assert on the result directly. The transport never opens; the SDK is a stub. Mock at the *boundary* - external dependencies (auth, config, the backend API, version) - but keep security-critical or load-bearing helpers (e.g. an injection-escaping helper) real, so tests assert the actual protection rather than testing a mock of it.

For layer 3 (integration), the SDK's in-memory transport pair is the lighter-weight alternative to spawning a real subprocess: `InMemoryTransport.createLinkedPair()` gives a real `Client`/`Server` connection with no stdio and no network, so `client.listTools()` / `client.callTool(...)` exercise the actual protocol path fast and deterministically.

---

## What every tool's tests should cover (general checklist, not one server's)

1. **Registration shape.** Exactly the expected tools register, each with a non-trivial description.
2. **The unauthenticated/unauthorized branch**, if the server has one. Missing or invalid credentials short-circuit to an honest message *before* any backend call.
3. **The invalid-config branch**, if applicable. Credentials present but config malformed returns a clear error.
4. **The empty-result branch.** Zero results returns honest text ("no matches") - a domain outcome, not a thrown error (see `guides/04-error-model.md`).
5. **The happy path.** Hits return the expected content shape; the handler called the backend with the right arguments.
6. **Defaults and bounds.** Optional params default correctly when omitted; explicit values are respected and bound-checked.
7. **The failure branch.** A rejected backend call becomes an honest `"<Op> failed: <msg>"`, including the **non-Error rejection** path (`String(err)`), proving the handler never returns `[object Object]`.
8. **Domain-specific error classification**, if the server has any (see `guides/04-error-model.md`) - prove the classified case produces the friendly message and an unclassified/unexpected case still surfaces distinctly (not silently swallowed into the same message).
9. **Output-format guarantees**, if the tool returns a structured or delimited format other tooling parses - null/missing fields render as documented placeholders, never literal `"null"`/`"undefined"` strings, since this output can feed an agent verbatim.
10. **Input guards.** Malformed or malicious input (e.g. a path outside an expected prefix, unescaped wildcards reaching a query) is rejected or safely escaped - assert the actual escaping, not just that "no error was thrown."
11. **Auth-specific tests**, if the server has an auth boundary: no-credential, invalid-credential, expired-token, under-scoped-token (`guides/06-authentication.md`).

---

## Audit checklist (testing)

- [ ] Tool handlers are captured via a stubbed server class or `InMemoryTransport` and invoked directly for the deterministic layer.
- [ ] The real transport (stdio subprocess or HTTP listener) is stubbed for unit tests; a real handshake is only exercised in a dedicated integration/smoke test.
- [ ] External deps are mocked; security-critical helpers (escaping, validation) are kept real.
- [ ] Every tool has unauth (if applicable), empty, happy, and failure-branch tests.
- [ ] Non-Error rejection path is exercised.
- [ ] Output-format and input-guard invariants are asserted, not just "didn't throw."
- [ ] Registration-shape test pins the exact tool set and names (catches accidental rename/removal = contract drift - see the worked example's multi-consumer contract discussion in `guides/09-hivemind-worked-example.md`).
- [ ] If the server has an auth boundary, the four auth-specific tests exist.
- [ ] If the server ships HTTP or SSE, transport-specific tests exist for that transport, not just stdio.

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-vitest-mcp-testing.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/external/mcp-testing-three-layers-autonoma.md`, `research/external/mcp-server-testing-production-guide-yaw.md`, `research/external/mcp-testing-debugging-veprompts.md`*
