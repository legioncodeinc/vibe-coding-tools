# 03 - Zod Input Schemas, and the v3/v4 Trap

How to author MCP tool input schemas with zod, and the version-compatibility trap between zod and `@modelcontextprotocol/sdk` that recurs across SDK releases - this is an ecosystem-wide issue, not a house rule invented for one server.

---

## inputSchema is a raw shape, not z.object

The SDK's tool-registration config wants a plain object whose values are zod types, not a wrapped object:

```typescript
inputSchema: {
  query: z.string().describe("Keyword or multi-word phrase to search for (literal substring match)."),
  limit: z.number().int().min(1).max(50).optional().describe("Maximum hits to return (default 10)."),
}
```

Not `inputSchema: z.object({ ... })`. The SDK wraps it. Passing a pre-wrapped `z.object` is a common mistake that breaks schema generation.

---

## Field authoring rules

1. **Every field gets a `.describe(...)`.** The description becomes the JSON Schema `description` the model reads to understand the parameter - this is user-facing documentation, not a code comment.
2. **Encode bounds in the type.** `z.number().int().min(1).max(50)` - integer, ranged. The SDK rejects out-of-range params with a JSON-RPC `-32602` before your handler ever runs.
3. **`.optional()` for optional params; default in the handler.** Keep the schema describing the *shape*, not the policy - the schema states what's optional, the handler decides what happens when it's omitted.
4. **Prefer narrow types over a bare string when the value is constrained.** A path that must start with `/`, an enum of known modes, a UUID - either validate in-schema (schema rejection gives a clean `-32602`) or in the handler (handler rejection gives a readable in-band result). Either is defensible; decide deliberately and be consistent within one server.
5. **Do not over-constrain free-text input.** A literal search query should stay a bare `z.string()` - constraining it risks rejecting valid searches.
6. **If declaring an `outputSchema`, keep it honest about what the handler actually ships.** A field with `.default(...)` in an output schema is easy to accidentally advertise as `required` when the raw handler-returned object omits it - see the zod v4 output-schema pitfalls below.

The two-field example above generates roughly this JSON Schema, which is the contract every consuming harness sees in `tools/list`:

```json
{
  "type": "object",
  "properties": {
    "query": { "type": "string", "description": "Keyword or multi-word phrase..." },
    "limit": { "type": "integer", "minimum": 1, "maximum": 50, "description": "Maximum hits to return (default 10)." }
  },
  "required": ["query"]
}
```

---

## The zod v3/v4 trap is an ecosystem issue, not a one-server house rule

`@modelcontextprotocol/sdk` has had a versioned, recurring compatibility boundary with zod's major versions. This is documented across multiple upstream issues, not a single project's quirk:

- **Runtime break (older SDKs vs zod v4).** Older SDK releases called zod's *internal* API surface (`_def`, `_parse`) directly. Zod v4 restructured those internals, so pairing an SDK built against zod-v3 internals with an installed zod v4 produced runtime failures like `w._parse is not a function` on `tools/call`, and a broken `tools/list` - a failure that only shows up when a tool is actually invoked, not at install or compile time. This affected, per the tracking issue, "all MCP servers using modern Zod versions," and stayed open roughly 2.5 months before the SDK shipped backwards-compatible v4 support [external/zod-v4-sdk-breaking-changes-issue-925.md].
- **Compile-time break, even after that fix (version-skew within v4).** SDK `1.29.0` with zod `4.4.x` produces a *TypeScript* type error (`ZodString` not assignable to `AnySchema`) even though the code runs fine - a module-identity problem where a package manager installs two separate zod copies (one nested inside the SDK's own dependencies, one at the project's top level) that TypeScript won't structurally unify [external/zod-v4-4-registertool-issue-1987.md].
- **Output-schema conversion pitfalls (zod v4 specifically).** Zod v4's `toJSONSchema` defaults can produce an advertised schema that doesn't match what the server actually ships: `z.date()` fields can throw during `tools/list` generation entirely; `.default(...)`-carrying output fields can get listed as `required` even though the raw handler return value omits them; plain `z.object()` outputs can advertise `additionalProperties: false` even though the server tolerates and returns extra keys. Each of these makes a spec-compliant validating client reject an otherwise-correct response. If a server declares `outputSchema` on a zod-v4 codebase, verify the generated JSON Schema actually matches what handlers return, don't assume the conversion is wire-truthful by default.

**The durable rule, for any new server on any SDK version:** verify zod compatibility for the *exact* installed `@modelcontextprotocol/sdk` version before shipping. Do not copy a hardcoded "always import `zod/v3`" rule from an older codebase without checking whether the current SDK version already supports v4 correctly - the compatibility boundary has moved multiple times and will likely move again. Symptoms to recognize:
- A runtime `_parse is not a function` / `_def` error on tool calls -> SDK-internal-API-vs-zod-major-version mismatch.
- A compile-time `AnySchema`/`$ZodType` structural-match error -> likely two zod instances in the dependency tree; force deduplication (`overrides`/`resolutions` in `package.json`).
- An empty or wrong `inputSchema` in `tools/list` -> the zod-to-JSON-Schema conversion path picked the wrong parser branch for the installed zod major version; check the SDK's changelog for the zod compatibility note at your installed version.
- A client rejecting an otherwise-correct structured result -> check the `outputSchema` conversion against what the handler actually returns, especially around `.default(...)` fields and `z.date()`.

If you're auditing a server that pins a specific zod import path at the SDK boundary (e.g. `import * as z from "zod/v3"`), treat that pin as the answer this server's authors got when they ran this check at a specific point in the SDK's compatibility history - not a universal constant to copy into a new server without re-verifying against the new server's own SDK version. `guides/09-hivemind-worked-example.md` shows exactly this: Hivemind's `zod/v3` pin, and why it was correct for that server's SDK version.

---

## Audit checklist (schemas)

- [ ] The installed `@modelcontextprotocol/sdk` version's zod compatibility has been verified (check the SDK's own documentation/changelog for that version), not assumed from an older project.
- [ ] `inputSchema` is a raw shape object, not `z.object(...)`.
- [ ] Every field has a description.
- [ ] Numeric/string bounds and enums are in the schema.
- [ ] Required vs optional is correct (no accidental `.optional()` on a mandatory field).
- [ ] Defaults live in the handler, not duplicated into the schema.
- [ ] If `outputSchema` is declared, the generated JSON Schema has been checked against what handlers actually return (watch `.default(...)` fields and `z.date()` under zod v4).
- [ ] The dependency tree does not silently contain two zod instances (check with a lockfile inspection if a compile-time type error shows up that doesn't reproduce with a clean install).

---

*Sources: `research/distilled-mcp-protocol.md`, `research/2026-06-16-mcp-sdk-typescript.md`, `research/2026-06-16-zod-v3-mcp-pin.md`, `research/external/zod-v4-sdk-breaking-changes-issue-925.md`, `research/external/zod-v4-4-registertool-issue-1987.md`*
