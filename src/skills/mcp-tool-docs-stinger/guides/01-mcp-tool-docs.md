# 01 - Documenting MCP Tools (and other schema-selected tools)

How to document any tool a client selects and calls by name, description, and input schema - MCP tools first and foremost, since that is the protocol this Hive integrates with most, but the same six-part shape applies to any tool surface picked off a schema. Read `research/distilled-mcp-tool-docs.md` (section 1) before running this guide; it covers what changed since the original 2026-06-16 pass, chiefly tool annotations.

## The six required parts

Every tool doc carries all six. They are facts, not prose - transcribe them from the source.

### 1. Name

The exact string the server registers the tool under. Case and underscores/hyphens matter - transcribe verbatim, do not "clean up" the name.

### 2. Purpose

What the tool does and when a caller should reach for it. The source already carries a `description` field for the tool - start from that string verbatim, then confirm it matches behavior. Do not improve the wording into something the code does not do. A well-formed description, per current MCP tool-schema practice, answers three questions in order:

1. What does it do? (one action-first sentence)
2. When should the caller use it? (context that prevents the wrong tool firing)
3. What does it return?

### 3. Input schema (transcribed from the real schema)

Transcribe the schema field by field. For each field record: name, type, required vs. optional, constraints, default, and the description text attached to that field in the schema. Read the schema itself, not a paraphrase of it - the exact JSON Schema a server emits (for example, from a zod schema in the TypeScript SDK) can carry constraints prose forgets (integer-ness, bounds, enum values).

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `query` | string | yes | - | Keyword or multi-word phrase to search for (literal substring match). |
| `limit` | number (int) | no | 1-50, default 10 | Maximum hits to return. |

Put constraints in the schema-derived table, not only in the purpose prose - a constraint that lives only in prose is a suggestion a calling agent may not follow; a constraint expressed as a schema keyword (`pattern`, `enum`, `minLength`, `maximum`) is enforced at validation time. If you find a constraint documented only in prose with no matching schema keyword, flag it - that's either a doc gap or a schema gap.

For a tool with no parameters, the current MCP spec recommends `{ "type": "object", "additionalProperties": false }` over a bare `{ "type": "object" }`, since the former explicitly accepts only empty objects. Note which shape the real schema uses.

### 4. Output shape

What the handler actually returns, in every branch - not just the happy path. Record:

- The success shape and what its content actually contains.
- The empty-result output (what a caller sees on zero matches / an empty collection).
- Error outputs: auth failures, validation failures, "not found," and any other branch the handler has. These are real outputs a caller will see - document them as carefully as the success case.

### 5. Side effects

State them honestly, in two layers:

1. **Prose.** Does the tool read only, or does it write/create/delete something? Say which, specifically - "installs the package" is not a side-effect statement; "copies bundle files into `<dir>` and patches `<config file>`" is.
2. **Annotations, for MCP tools.** If the server sets `ToolAnnotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), record the actual values and confirm they agree with the prose claim - a tool documented as "read-only" that ships `destructiveHint: true` (or ships no annotations, which defaults to non-read-only/potentially-destructive/open-world) is an internal contradiction; surface it rather than silently picking one version to believe. If the server sets no annotations at all, say so explicitly and note that a client will assume the pessimistic default (not read-only, potentially destructive, non-idempotent, open-world) - don't let the absence go unremarked.

Annotations are hints, not guarantees, even when they're accurate - the spec is explicit that a client must treat annotations from an untrusted server as untrusted. Document what the server *claims* and, separately, what you *verified* by reading the handler; note if they diverge.

### 6. Examples

At least one realistic call and its response. Use real shapes the tool would actually see or return - not `{"string": "string"}` placeholders.

## Reading a tool registration

Most MCP servers register a tool as one call carrying `(name, { description, inputSchema, annotations? }, handler)`. To document a tool:

1. Copy the **name** (first arg / the registration key).
2. Copy the **description** (start of purpose).
3. Copy the **annotations** object if present; note its absence if not.
4. Walk **`inputSchema`** field by field into the schema table.
5. Read the **handler** to find the real output branches and any side effects (writes, external calls, file changes).
6. Note every error branch as an output, not just the success path.

## Minimum viable tool-doc set

For every tool, provide:

1. Name + one-line purpose (what/when/returns).
2. The full input-schema table.
3. The output shape, including empty-result and error outputs.
4. The side-effect statement: prose + annotations (where the protocol has them).
5. One worked example call + response.

Use the template at `templates/mcp-tool-doc.md`.

---

## Worked example: the Hivemind MCP tools

`examples/hivemind-search-tool-doc.md` is a complete, worked application of the six-part shape above to a real product: Hivemind's MCP server (`src/mcp/server.ts`), which runs over stdio, is read-only, and authenticates from `~/.deeplake/credentials.json`. The tools shipped there are `hivemind_search`, `hivemind_read`, and `hivemind_index`, plus two write-capable tools contracted by OpenClaw (`hivemind_goal_add`, `hivemind_kpi_add` - see `harnesses/openclaw/skills/hivemind-goals/SKILL.md` and `harnesses/openclaw/src/index.ts`). Read the worked example to see the six parts filled in end to end for a real tool, including the read-only-vs-writes distinction that made annotations matter for that server. If you are documenting Hivemind specifically, start from `examples/hivemind-search-tool-doc.md` and the source paths above rather than rediscovering the pattern from scratch.

*Source: `research/distilled-mcp-tool-docs.md` (section 1); `research/external/2026-06-16-mcp-tool-resource-documentation.md`; `research/external/2026-08-14-mcp-tool-annotations-risk-vocabulary.md`; `research/external/2026-08-14-mcp-spec-tools-page.md`; `research/external/2026-08-14-mcp-tool-schema-design.md`.*
