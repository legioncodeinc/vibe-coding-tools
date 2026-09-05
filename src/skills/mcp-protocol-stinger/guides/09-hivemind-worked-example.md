# 09 - Worked Example: The Hivemind MCP Server

**This guide is a worked example, not general guidance.** Guides 00-08 are the general MCP-server-building and auditing playbook - they apply to any server. This guide shows every one of those general principles applied concretely to one real server: Hivemind, an npm-distributed agent-memory MCP server that predates The Hive and is not one of its four target harnesses' own tooling. It is kept, in full, as a grounded example of what "correct" looks like in a real, shipped stdio server - not deleted when this pair was broadened to cover MCP servers generally. If you are building or auditing a *different* MCP server, start at `guides/00-principles.md`; come back here when you want to see the general rules exercised end to end on a concrete codebase.

---

## Ground truth

- **Server:** `src/mcp/server.ts`, stdio transport (see `guides/01-transport.md` for why stdio was the correct choice here), built to `mcp/bundle/`. Constructs `McpServer({ name: "hivemind", version: getVersion() })`.
- **Tools:** `hivemind_search { query, limit? }`, `hivemind_read { path }`, `hivemind_index { prefix?, limit? }` - all read-only (see `guides/00-principles.md`'s idempotency framing and `guides/02-tool-resource-prompt-design.md`'s primitive-choice discussion for why this server is tools-only, not tools-plus-resources).
- **Auth:** loads `~/.deeplake/credentials.json` from the local home directory; missing credentials short-circuit to "Not authenticated. Run `hivemind login`..." before any backend call. This is the stdio-transport auth pattern the MCP Authorization spec itself sanctions - see `guides/01-transport.md` and `guides/06-authentication.md` for why "read credentials from the environment, skip the OAuth flow" is the *correct* choice for a stdio server, not a shortcut this server happened to take.
- **Schemas:** authored with `import * as z from "zod/v3"`, deliberately, even though `package.json` depends on zod ^4 - the concrete instance of the general zod v3/v4 compatibility check described in `guides/03-zod-schemas.md`. Raw-shape `inputSchema`, each field carries `.describe(...)`.
- **Error model:** domain outcomes via a shared `errorResult(text)` helper (see `guides/04-error-model.md`); a fresh-org missing-TABLE 400 is classified into an empty-memory hint (issue #252) rather than leaked raw; non-`Error` rejections are coerced via `String(err)`.
- **Tests:** `tests/claude-code/mcp-server.test.ts` (Vitest ^4) - the boundary-mock pattern described generally in `guides/07-testing-mcp.md`, applied here with a registration-shape contract guard and real SQL-escaping helpers kept un-mocked for fidelity.

---

## Anatomy of a Hivemind tool

```typescript
server.registerTool(
  "hivemind_search",
  {
    description: "Search Hivemind shared memory (summaries + raw sessions) by keyword or multi-word phrase. Returns matching paths and snippets. Use this first when the user asks about prior work. Different paths under /summaries/<username>/ are different users - do not merge them.",
    inputSchema: {
      query: z.string().describe("Keyword or multi-word phrase to search for (literal substring match)."),
      limit: z.number().int().min(1).max(50).optional().describe("Maximum hits to return (default 10)."),
    },
  },
  async ({ query, limit }: { query: string; limit?: number }) => { /* ... */ },
);
```

Every design rule in `guides/02-tool-resource-prompt-design.md` is exercised here: the `hivemind_<verb>` prefix (namespacing), a description that says *when* to use the tool plus a correctness caveat (per-user isolation), a raw-shape `inputSchema` (not a wrapped `z.object`), an `.optional()` `limit` with the default (`?? 10`) applied in the handler rather than the schema, and a handler that returns the shared MCP content shape via `errorResult`.

---

## Error handling, concretely

Hivemind's tools return domain outcomes as ordinary results via the shared `errorResult` helper described generally in `guides/04-error-model.md`:

- **Not authenticated** => `"Not authenticated. Run \`hivemind login\` to sign in to Deeplake."` - the credentials file is missing; a user-fixable state, not a protocol fault. Short-circuits before any query.
- **Config invalid** => `"Hivemind config could not be loaded - credentials present but invalid."`
- **No results** => `"No matches for \"<query>\"."` / `"No content found at <path>."` / `"No summaries found."` - empty results are not faults.
- **Backend failure** => `"Search failed: <msg>"` / `"Read failed: <msg>"` / `"Index failed: <msg>"`, coercing non-`Error` rejections through `err instanceof Error ? err.message : String(err)`.

### The fresh-org classification (issue #252)

A naive handler would let the backend's "table does not exist" 400 surface raw. Hivemind classifies it instead:

```typescript
if (isMissingTableError(msg)) return errorResult(`No matches for "${query}". ${FRESH_ORG_HINT}`);
```

`FRESH_ORG_HINT` = `"Hivemind memory is empty - tables are created when the first agent session starts, and entries appear after it ends."`

This is the concrete instance of `guides/04-error-model.md`'s "classify raw backend errors instead of leaking them" rule: the agent reads tool output verbatim into its recall context, so an unclassified `Index failed: 400: {"error":"Table does not exist..."}` would poison that context with a backend implementation detail. The honest result is "memory is empty" - and only when the missing thing is a TABLE; a missing COLUMN still surfaces as a raw `Index failed:` because that's a real defect, not a fresh org, and over-classifying would hide genuine bugs.

---

## Multi-consumer contract stability

Hivemind's memory is reached through more than one surface, and the tool names + argument shapes are a public contract across all of them - the concrete case study for "treat tool names/shapes/output as a cross-consumer contract," the general version of which belongs in whatever guide covers the specific harnesses a server you're auditing actually targets (for The Hive's four harnesses specifically, see `guides/08-harness-registration.md`).

| Consumer | How it reaches the tools | Tool set it depends on |
|---|---|---|
| **Hermes harness** (a prior product, not part of The Hive) | Registered the MCP server under `mcp_servers.hivemind` in `~/.hermes/config.yaml`; spawned `node .../.hermes/hivemind/bundle/...`. Direct `tools/call`. | `hivemind_search`, `hivemind_read`, `hivemind_index` |
| **OpenClaw** (a prior product, not part of The Hive) | Plugin declared contracted tools. | `hivemind_search`, `hivemind_read`, `hivemind_index`, plus `goal_add`, `kpi_add` |
| **pi** (a prior product, not part of The Hive) | Extension (`harnesses/pi/extension-source/hivemind.ts`) registered tools via `pi.registerTool({ name: "hivemind_search", ... })`. | `hivemind_search`, `hivemind_read`, `hivemind_index` |
| **Claude Code, Codex, Cursor** | Consumed the same memory surface through installers/bundles. | the `hivemind_*` recall tools |

Note on scope: Hermes, OpenClaw, and pi were consumers of the original Hivemind product and are **not** part of The Hive's four supported harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork). They're kept in this table because they're historically accurate for what shipped, not because they're targets for new work under this pair. For The Hive's own four-harness registration, see `guides/08-harness-registration.md`.

**What "stable contract" means in practice**, the concrete version of the additive-vs-breaking distinction:

- **Safe (additive):** a brand-new tool with a new name; an `.optional()` parameter with a handler default; widening a numeric bound; improving a description without changing behavior.
- **Breaking (coordinate across every consumer, escalate):** renaming a tool (`hivemind_search` -> `hivemind_query` breaks every harness that hard-codes the old name); renaming/removing/making-required a previously-optional parameter; tightening a bound so previously-valid calls now fail `-32602`; reshaping parsed output (the tab-separated `path\tlast_updated\tproject\tdescription` format `hivemind_index` returns is parsed downstream); removing a tool or changing which error channel a failure uses.

**Cross-surface consistency rules:** the MCP server (`src/mcp/server.ts`) is the source of truth for the three recall tools - if the pi extension's schema drifted from it, that was a defect even though both "worked," because the agent's mental model of a tool must be identical wherever it runs. Descriptions should agree across surfaces. Version reporting (`serverInfo.version` and bundle versions) was kept synced by `scripts/sync-versions.mjs`. The output format is part of the contract - `hivemind_index`'s header line plus tab-separated rows with `?`/empty placeholders for null fields (never the literal strings `"null"`/`"undefined"`) is something downstream code parses.

---

## Testing, concretely

`tests/claude-code/mcp-server.test.ts` applies the boundary-mock pattern from `guides/07-testing-mcp.md`: stub `McpServer`/`StdioServerTransport`, capture registered handlers into a `Map`, invoke them directly. Mock the *external* dependencies (auth, config, the backend API, version) but keep security-critical helpers (`sqlStr`/`sqlLike`) real via `importOriginal`, so the suite asserts the actual injection guard rather than a mock of it:

```typescript
expect(sql).toMatch(/WHERE path LIKE '\/summaries\/alice\/.*%' ESCAPE '\\'/);
```

Coverage per tool, the concrete instance of `guides/07-testing-mcp.md`'s general checklist: registration shape (`expect(Array.from(registeredTools.keys()).sort()).toEqual(["hivemind_index", "hivemind_read", "hivemind_search"])`), the unauthenticated branch (`expect(queryMock).not.toHaveBeenCalled()`), the invalid-config branch, the empty-result branch, the happy path, defaults/bounds (`limit` defaults to 10), the failure branch including the non-`Error` rejection path, the fresh-org classification (issue #252), output-format guarantees (tab-separated rows, `?`/empty placeholders), and input guards (`hivemind_read` rejects a path not starting with `/`; the wildcard-injection test proves `ESCAPE` + escaped wildcards are present).

```bash
npm test            # vitest run (whole suite)
npx vitest run tests/claude-code/mcp-server.test.ts
npm run typecheck   # tsc --noEmit
```

`npm run ci` runs `typecheck` + duplication check + the full suite.

---

## Boundary with peer Bees, for this specific server

- Deeplake credential/OAuth lifecycle hardening -> `security-worker-bee` (not this pair).
- Process sandboxing / TLS for where the stdio subprocess runs -> `ci-release-worker-bee` (not this pair).
- Deeplake query semantics, table schema, vector search internals -> `vector-store-worker-bee` (the current name for the data-layer Bee that previously covered Deeplake specifically; not this pair).

---

*This guide preserves, relabeled as a worked example, the ground truth and multi-harness contract material that was previously this pair's entire scope. Nothing here was deleted when the pair was broadened - see `research/2026-06-16-*.md` for the original dated research this material traces to, and `guides/00-08` for the general principles it exercises.*
