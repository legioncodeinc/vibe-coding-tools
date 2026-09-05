# MCP Tool Schema Design: Descriptions AI Agents Understand

- URL: https://gingerlabs.ai/blog/mcp-tool-schema-design
- Fetched: 2026-08-14
- Source type: blog (practitioner guide)
- Component: honest MCP tool documentation - writing descriptions and schemas

## Core claim

A tool's description and schema are the only instruction manual an agent gets when deciding whether and how to call it. Vague descriptions cause wrong tool selection, malformed inputs, and wasted tokens on retries.

## Seven rules for descriptions agents actually understand

1. **Name tools with verb + object**, and namespace related tools (`create_invoice`, not `invoice`). Fastest win for correct tool selection.
2. **Write descriptions in three parts, in order**: what it does (one sentence, action-first) -> when to use it (context that prevents wrong selection) -> what it returns.
3. **Put constraints in the schema, not in prose.** `pattern`, `enum`, `minLength`, `maximum` are enforced at validation time; a prose constraint ("must be between 1 and 50") is only a suggestion the agent may ignore.
4. **Always include an example value.**
5. **Always define what the tool returns**, not just what it accepts.
6. **Keep tools focused - one job per tool.** Mega-tools with 14 parameters and internal jargon field names produce guesswork and retries.
7. **Use `additionalProperties: false`** to close the schema and prevent the agent from hallucinating extra fields.

## Annotations as the fifth documented component

The article frames the 2025 annotation fields (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) as a checklist item most production servers still skip. Practical rule: set `destructiveHint` accurately on any tool that deletes or permanently modifies data, since an agent that knows a tool is destructive can request confirmation, and one that knows a tool is idempotent can safely retry.

## Quick-reference checklist (condensed)

- Tool name uses verb + object.
- Description answers: what it does, when to use it, what it returns - in plain language, no unexplained jargon.
- Constraints use schema keywords, not prose.
- `additionalProperties: false` set.
- All four 2025 annotations set where applicable.
- Description is tight (roughly 2-4 sentences / 40-80 words) - every word costs tokens across every call.

## Applicability to this skill

This gives a concrete, checkable rubric for the "purpose" and "input schema" sections of the six-part tool-doc shape: a documented tool's description should already satisfy the three-part structure (what/when/returns), and any prose-only constraint found during transcription is a signal to flag ("this constraint lives in prose but not in the schema - is that intentional or a gap?"). It also reinforces that annotations are now an expected, checkable part of an honest tool doc's side-effects claim, not an optional extra.
