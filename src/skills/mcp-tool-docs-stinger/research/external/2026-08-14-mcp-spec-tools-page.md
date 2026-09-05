# Tools - Model Context Protocol Specification

- URL: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
- Fetched: 2026-08-14
- Source type: official docs (MCP specification)
- Component: honest MCP tool documentation - canonical spec

## Tool definition fields

A tool definition includes:

- `name` - unique identifier for the tool. Lowercase ASCII, up to 128 characters (spec-defined bound), case-sensitive.
- `title` - optional human-readable display name.
- `description` - human-readable description of functionality.
- `icons` - optional array of icons for UI display.
- `inputSchema` - JSON Schema defining expected parameters. Follows the JSON Schema usage guidelines; defaults to draft 2020-12 if no `$schema` field is present; MUST be a valid JSON Schema object (not `null`). For tools with no parameters, the recommended shape is `{ "type": "object", "additionalProperties": false }` (explicitly accepts only empty objects) rather than a bare `{ "type": "object" }` (accepts any object).
- `annotations` - optional properties describing tool behavior (see the tool-annotations source note). **Clients MUST consider tool annotations untrusted unless they come from trusted servers.**

## Tool results

Results may contain **structured** content or **unstructured** content. Unstructured content is returned in the `content` field and can hold multiple items of different types (text, image, audio, resource links, embedded resources); these support optional annotations describing audience, priority, and modification times - the same annotation format used by resources and prompts.

## Security considerations (spec-level requirements)

Servers **MUST**:

- Validate all tool inputs.
- Implement proper access controls.
- Rate limit tool invocations.
- Sanitize tool outputs.

Clients **SHOULD**:

- Prompt for user confirmation on sensitive operations.
- Show tool inputs to the user before calling the server (avoids malicious or accidental data exfiltration).
- Validate tool results before passing to the LLM.
- Implement timeouts for tool calls.
- Log tool usage for audit purposes.

## Applicability to this skill

This is the canonical, versioned definition of what a "tool" is in MCP - the source that any honest MCP tool doc should trace back to for field names (`name`, `title`, `description`, `inputSchema`, `annotations`) and for the security posture a documented tool should be checked against (input validation, output sanitization, rate limiting are server-side facts worth confirming, not assuming, when writing the side-effects section of a tool doc). The empty-input-schema recommendation (`additionalProperties: false`) is a concrete, checkable fact to verify against the real schema when transcribing it into a doc.
