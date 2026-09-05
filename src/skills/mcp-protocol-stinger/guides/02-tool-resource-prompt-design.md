# 02 - Tool, Resource, and Prompt Design

How to decide which MCP primitive to expose, and how to shape a well-formed tool (or resource, or prompt), for any MCP server.

---

## Pick the primitive

| Primitive | The model... | The client... | Pick it when |
|---|---|---|---|
| **Tool** | decides arguments and triggers execution | lists via `tools/list`, calls via `tools/call` | the work is an action or a parameterized query (search, write, compute). |
| **Resource** | references a URI | enumerates via `resources/list`, fetches via `resources/read` | content is addressable, enumerable, and pulled without model-supplied arguments. |
| **Prompt** | fills template slots | lists via `prompts/list`, invokes via `prompts/get` | it is a canned, user-selected interaction. |

[external/mcp-spec-architecture.md]

**An all-tools design is a legitimate choice, not automatically a missed resource.** If every consumer drives access through model-initiated calls and there is no client-side enumeration loop that would ever call `resources/list`, exposing everything as tools is correct - a resource nobody's client ever fetches is a primitive nobody calls. The worked example (`guides/09-hivemind-worked-example.md`) shows a server that chose tools-only for exactly this reason, and the specific resource it would add if a consumer ever needed deterministic pull-without-a-tool-call access.

The case *for* adding a resource: something addressable, stable, and worth fetching without the model deciding to - e.g. a fixed index/manifest document a client could pull once at session start. That's a legitimate design upgrade when a consumer will actually do that pull; it is not a defect in a tools-only server that no consumer enumerates resources against.

---

## Anatomy of a well-formed tool

Spec-level `Tool` shape [external/mcp-spec-tools-primitive.md]: `name` (unique, namespaced identifier), `title` (optional human-readable display name), `description` (the model's *only* routing signal - see below), `inputSchema` (JSON Schema, typically generated from a zod shape - see `guides/03-zod-schemas.md`), `outputSchema` (optional JSON Schema for structured results), `annotations` (optional behavior hints, e.g. `readOnlyHint`/`destructiveHint`/`idempotentHint` - clients **MUST** treat these as untrusted unless the server is trusted).

```typescript
server.registerTool(
  "search_widgets",
  {
    description: "Search the widget catalog by keyword. Returns matching widget IDs and short descriptions. Use this first when the user asks to find or list widgets by name or attribute.",
    inputSchema: {
      query: z.string().describe("Keyword or phrase to search for (literal substring match)."),
      limit: z.number().int().min(1).max(50).optional().describe("Maximum hits to return (default 10)."),
    },
  },
  async ({ query, limit }: { query: string; limit?: number }) => { /* ... */ },
);
```

Design rules drawn from this shape:

1. **Name is prefixed and stable, snake_case, lowercase.** A namespace prefix (`<domain>_<verb>`) avoids collision with other servers' tools registered in the same harness and makes the tool's owner obvious at a glance.
2. **Description is a contract, not a label.** It tells the model *when* to reach for the tool, what it returns, and any critical correctness caveat. The model only sees the description and schema at decision time - everything it must know to route correctly lives there. A noun-phrase description ("Widget search") gives the model nothing to route on; a description that only says what the tool *is* without saying *when to use it* is incomplete.
3. **`inputSchema` is a raw zod (or equivalent) shape object**, not a pre-wrapped `z.object(...)` - the SDK wraps it itself (see `guides/03-zod-schemas.md`).
4. **Optional params have defaults applied in the handler, not the schema.** The schema states the bound (`.optional()`, `min`/`max`); the default value lives where it's used, in the handler.
5. **The handler returns the MCP content shape**: `{ content: [{ type: "text", text }], isError?: boolean }` for unstructured results, or additionally `structuredContent` matching a declared `outputSchema` for structured ones [external/mcp-spec-tools-primitive.md]. Centralize the failure-result shape in one helper so every failure returns the same structure - see `guides/04-error-model.md`.

### Beyond plain text: content types and structured output

Tool results are not limited to a single text block. The spec supports `text`, `image` (base64 + `mimeType`), `audio` (base64 + `mimeType`), `resource_link` (a URI the tool points at without embedding, not guaranteed to appear in a later `resources/list`), and embedded `resource` blocks [external/mcp-spec-tools-primitive.md]. If a tool's natural output is structured data rather than prose, declare an `outputSchema` and return `structuredContent` matching it - the server **MUST** conform to the schema it advertises, and for backwards compatibility should also serialize the same JSON into a `text` block [external/mcp-spec-tools-primitive.md]. Most simple servers only need `text` content; know the richer shapes exist before assuming a workaround (e.g. manually JSON-stringifying into a text block) is the only option.

---

## Tool description checklist

- [ ] Name is prefixed and stable, snake_case.
- [ ] Description says *when to use it*, not just what it is.
- [ ] Description states the return shape and any correctness caveat (e.g. isolation boundaries, staleness, side effects).
- [ ] Read-only vs side-effecting is stated (or annotated) so retries are safe or explicitly guarded (see `guides/00-principles.md`).
- [ ] Every input field has a description.
- [ ] Bounds (`min`/`max`, enums) are in the schema; defaults are in the handler.
- [ ] If the tool declares an `outputSchema`, every returned `structuredContent` actually conforms to it.

---

## Trust & safety, spec-mandated

Servers **MUST** validate all tool inputs, implement access controls, rate-limit invocations, and sanitize outputs. Clients **SHOULD** keep a human in the loop able to deny tool invocations, show which tools are exposed and when they're invoked, prompt for confirmation on sensitive operations, validate tool results before passing them to the model, timeout tool calls, and log usage for audit [external/mcp-spec-tools-primitive.md]. When auditing a server, check that destructive or sensitive tools are annotated or described clearly enough for a host to build that confirmation UI - a tool that silently deletes data with a name like `cleanup` and no `destructiveHint`/warning in its description is a design defect independent of whether the code itself is correct.

---

## Anti-patterns to flag

- A verb-in-name that is really three tools bundled together (`do_everything`). Split by action.
- A tool whose description is a noun phrase - the model cannot route on that.
- Returning structured failure as a success result without `isError` (see `guides/04-error-model.md`).
- Re-deriving the same context/connection object inside every handler instead of one shared helper.
- Declaring an `outputSchema` and then returning `structuredContent` that doesn't match it (breaks any client doing schema validation on the response - see `guides/07-testing-mcp.md`).
- Adding a `resources` capability with nothing registered "just in case" - see `guides/05-capability-negotiation.md` for why that's a contract lie, not a harmless default.

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/2026-06-16-mcp-spec-lifecycle.md`, `research/external/mcp-spec-tools-primitive.md`, `research/external/mcp-spec-architecture.md`. Worked example: `guides/09-hivemind-worked-example.md`.*
