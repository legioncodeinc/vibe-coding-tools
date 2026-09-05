# 04 - Error Model: JSON-RPC codes + tool-result errors

The two failure channels, the standard JSON-RPC codes, and how to keep error output honest, for any MCP server.

---

## Two channels, never confused

MCP has two ways a call can fail. Routing a failure to the wrong channel is the central error-model defect, restated at the spec level as *Protocol Errors* vs *Tool Execution Errors* [external/mcp-spec-tools-primitive.md].

### Channel 1 - JSON-RPC protocol error

A structured error object on the response. The request never reached a clean tool execution: it was malformed, the method does not exist, or the params failed validation.

```json
{ "jsonrpc": "2.0", "id": 7, "error": { "code": -32602, "message": "Invalid params", "data": { ... } } }
```

Standard codes (JSON-RPC 2.0):

| Code | Meaning | When |
|---|---|---|
| `-32700` | Parse error | Invalid JSON received |
| `-32600` | Invalid Request | Not a valid JSON-RPC object |
| `-32601` | Method not found | Unknown method / unknown tool |
| `-32602` | Invalid params | Params failed the input schema (SDK raises this) |
| `-32603` | Internal error | Unexpected server fault |
| `-32000` to `-32099` | Server error (implementation-defined) | Reserve for your own protocol-level faults |

The SDK raises `-32602` for you when params violate the `inputSchema`. You rarely throw these by hand.

### Channel 2 - Tool-execution result

The tool ran. The outcome is a domain result - success or a domain failure (no matches, not authenticated, backend down). These travel as a normal tool result:

```json
{ "content": [{ "type": "text", "text": "..." }], "isError": true }
```

Set `isError: true` when the result represents a failure the model should treat as such, while still keeping it in-band so the model can read and react to it. Both channels' example payloads are drawn directly from the spec's own error-handling section [external/mcp-spec-tools-primitive.md]: an unknown-tool call gets `-32602` "Unknown tool: invalid_tool_name" (protocol error, channel 1); an API failure inside a running tool gets `isError: true` with a text explanation (execution error, channel 2).

---

## The rule

- **Protocol fault => Channel 1 (JSON-RPC error code).** Malformed request, bad params, unknown tool.
- **Domain outcome => Channel 2 (tool result).** "Nothing found," "not logged in," "backend empty," "rate limited," any business-logic failure.

The MCP analog of HTTP's "200 with error body" anti-pattern is **dressing a Channel-1 fault as a Channel-2 success**, or vice versa. Both directions are wrong.

---

## Building an honest error path

A single helper that every failure branch funnels through keeps the shape consistent:

```typescript
function errorResult(text: string): { content: Array<{ type: "text"; text: string }>; isError: true } {
  return { content: [{ type: "text", text }], isError: true };
}
```

Domain outcomes belong in Channel 2, always:
- **Not authenticated / not authorized** - a clear, actionable message ("Not authenticated. Run `<tool> login`..." / "Missing API key: set `<ENV_VAR>`"). Short-circuit before any backend call.
- **Config invalid** - credentials present but malformed or incomplete.
- **No results** - empty results are not faults; say so plainly ("No matches for \"...\"").
- **Backend failure** - `"<Operation> failed: <msg>"`, coercing non-`Error` rejections through `err instanceof Error ? err.message : String(err)` so a handler never returns `[object Object]`.

### Classify raw backend errors instead of leaking them

A naive handler lets a raw backend error (an HTTP status, a driver exception, a stack trace) surface verbatim. That is almost always wrong: the agent reads tool output **verbatim** into its context, so an unclassified `Operation failed: 400: {"error": "relation does not exist"}` poisons that context with an implementation detail the model has no use for. Classify known error shapes into an honest, actionable domain message instead - e.g. a missing-table/missing-collection error on a fresh deployment becomes "this data source is empty, nothing to search yet" rather than a raw driver exception. The worked example (`guides/09-hivemind-worked-example.md`) documents Hivemind's own version of this classification (its "fresh-org" hint for a missing-TABLE error, issue #252) as a concrete instance of the general pattern - not a one-off. Reserve raw-error passthrough for genuinely unexpected faults where no better classification exists yet, and flag those for follow-up classification rather than shipping them as permanent unclassified noise.

---

## Audit checklist (errors)

- [ ] Param-validation failures go through the SDK as `-32602`, not caught and re-dressed as success.
- [ ] Domain outcomes (empty, unauthenticated, backend down, rate limited) return as tool results, not thrown JSON-RPC errors.
- [ ] Failure results are marked (`isError: true`) so the model treats them as failures.
- [ ] Raw backend error strings are classified into actionable messages, never leaked verbatim by default.
- [ ] Non-Error rejections are coerced (`String(err)`) so a handler never returns `[object Object]`.
- [ ] Auth/credential failures short-circuit before any backend call.
- [ ] If the server declares an `outputSchema`, a failure path never ships `structuredContent` that fails to match it - failures should stay in plain `content`/`isError`, not try to force-fit the success schema.

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-jsonrpc-error-model.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/external/mcp-spec-tools-primitive.md`. Worked example: `guides/09-hivemind-worked-example.md`.*
