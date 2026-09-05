# Tool Annotations as Risk Vocabulary: What Hints Can and Can't Do

- URL: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
- Fetched: 2026-08-14
- Source type: official blog (Model Context Protocol maintainers)
- Component: honest MCP tool documentation - annotations

## What tool annotations are

MCP tool annotations shipped in the `2025-03-26` spec revision. The current `ToolAnnotations` interface:

```ts
interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;      // default: false
  destructiveHint?: boolean;   // default: true
  idempotentHint?: boolean;    // default: false
  openWorldHint?: boolean;     // default: true
}
```

Every property is a **hint**, not a guarantee. The spec is explicit: annotations are not guaranteed to faithfully describe tool behavior, and clients must treat them as untrusted unless they come from a trusted server.

- `readOnlyHint` - does the tool modify its environment?
- `destructiveHint` - if it does modify things, is the change destructive (vs. additive)?
- `idempotentHint` - safe to call again with the same arguments?
- `openWorldHint` - does the tool interact with an open world of external entities, or a closed domain?

## The pessimistic default posture

A tool with no annotations is assumed: not read-only, potentially destructive, non-idempotent, and open-world. The spec assumes the worst until told otherwise. This is deliberate - a low barrier to entry for server authors means coverage is uneven, so clients default to maximum caution.

## What annotations are actually good for

1. **Drive confirmation prompts** - `destructiveHint: true` gets a confirmation dialog before executing; `readOnlyHint: true` from a trusted server can auto-approve.
2. **Enable graduated trust** - internal, authenticated MCP servers can be trusted more than a random server off the internet (mostly a design opportunity today, not widely shipped).
3. **Improve UX** - `title` gives a display name; largely unexploited today (no client filters tools by annotation value).
4. **Feed policy engines** - annotations as one input among several into rules like "no destructive tools without approval."

## What annotations cannot do

- They do not make the model resist prompt injection - nothing in an annotation tells the model to ignore malicious instructions read from untrusted content.
- An untrusted server can lie - it can claim `readOnlyHint: true` and delete files anyway. Clients must treat annotations from untrusted servers as untrusted.
- They are not enforcement. A guarantee that a tool can't exfiltrate data is a job for network controls or sandboxing, not a boolean hint.
- A tool's risk depends on session context (what other tools are loaded), which a single tool's annotations can't express.

## Where the field is heading (2026)

At least five Specification Enhancement Proposals (SEPs) are extending the annotation vocabulary, driven by the "lethal trifecta" framing (a session that combines private-data access + untrusted-content processing + external communication is the dangerous combination):

- `sensitiveHint` - the tool accesses/returns sensitive data (credentials, PII, financial records).
- `egressHint` - the tool can transmit data outside the system boundary (splits `openWorldHint` into "reads untrusted input" vs. "exfiltrates data").
- `reversibleHint` - orthogonal to `destructiveHint`: can the effect be undone (move to trash) or not (permanent delete)?

## Practical guidance for documenting/authoring tools

- Set `readOnlyHint: true` on read-only tools, `destructiveHint: false` on additive operations, `openWorldHint: false` on closed-domain tools. This costs nothing and immediately benefits any client that reads annotations.
- Document annotations as part of the honest tool-doc contract alongside name/purpose/schema/output/side-effects/examples - they are a structured, machine-readable expression of the same "side effects" fact a tool doc already states in prose.
- Don't rely on an annotation as a safety guarantee in the doc's language - state the real behavior in prose too, since annotations from untrusted servers are informational only.

## Applicability to this skill

This is directly relevant to the "side effects" section of the honest MCP tool-doc shape: a tool doc should state both the prose side-effect claim (read-only vs. writes) *and*, where the server sets them, the matching annotation values. A tool doc that says "read-only" but ships `destructiveHint: true` (or omits it, which defaults to destructive) is an internal contradiction worth flagging.
