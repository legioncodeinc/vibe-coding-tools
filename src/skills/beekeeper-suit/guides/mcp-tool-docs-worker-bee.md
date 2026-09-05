# mcp-tool-docs-worker-bee

## Domain
This Bee owns the tool, API, and CLI documentation surface for any project: turning real source into a usable, honest reference. It covers schema-selected tool documentation (name, purpose, input schema, output shape, side effects, annotations where the protocol defines them, examples - MCP tools first and foremost), the TypeScript public API rendered via TypeDoc (and API Extractor where a reviewable public-API contract is needed), a CLI's command reference, doc-to-code drift detection, and changelog discipline tied to a released artifact's version. This is a documentation authority, not a protocol-correctness authority: it transcribes real behavior, it does not judge whether that behavior is right.

Hivemind's MCP tools, TypeScript public API, and `hivemind` CLI remain fully documented as a worked example (`examples/*.md` in the paired stinger) - the Bee's domain is general, Hivemind is its best-documented instance, not its boundary.

## Paired Stinger
[mcp-tool-docs-stinger](../../mcp-tool-docs-stinger) - general tool-doc, TypeScript API-reference, CLI-doc, doc-sync, and changelog guides, worked Hivemind examples, templates, and a 10-point done checklist.

## Trigger phrases
- "document the MCP tools"
- "write docs for this tool"
- "is this tool description honest?"
- "generate a TypeScript API reference"
- "document this CLI"
- "keep docs in sync with code"
- "write a changelog entry"

## Do NOT route when
- The ask is auditing whether a tool's schema, transport, or error handling is protocol-correct rather than documenting it; that belongs to mcp-protocol-worker-bee. This Bee documents what the code does; mcp-protocol-worker-bee rules on whether what the code does is right.
- The ask is prose-quality review or ghostwriting (Diataxis mode, inverted pyramid, voice/tone, "is this well-written"); that belongs to technical-writing-craft-worker-bee.
- The ask is OpenAPI/REST API documentation or SDK generation (Swagger UI/Redoc/Scalar selection, OpenAPI example enrichment, openapi-generator-cli/Fern/Speakeasy); that belongs to api-docs-worker-bee.
- The ask is docs-site platform selection or hosting (Docusaurus/Starlight/Mintlify/GitBook, docs-as-code CI for a whole site, search setup); that belongs to docs-site-worker-bee.
- The ask is standalone README authoring; that belongs to readme-writing-worker-bee.
- The ask is the library/ knowledge-base convention or narrative knowledge-capture docs; those belong to library-worker-bee or knowledge-worker-bee.
- The ask is Deeplake dataset schema design; that belongs to vector-store-worker-bee.

## Inputs the Bee needs
- The actual source file for the surface being documented: the tool-registration code for schema-selected tools (`src/mcp/server.ts` for Hivemind), the CLI's dispatch/routing for a command surface (`src/cli/index.ts` and `src/commands/*` for Hivemind), or the exported TS types for an API reference.
- Whether the request is new documentation, a drift check against existing docs, or a changelog entry tied to a version bump.
- Which product is being documented - apply the general guides to that product's real source; reach for the Hivemind worked examples only when Hivemind itself is the target.

## Outputs
- A tool doc with all six required parts: name, purpose, input schema, output shape, side effects (including annotation values where the protocol defines them), and at least one example.
- A generated API reference (TypeDoc, and an API Extractor report where a reviewable contract is needed) - never a hand-forked copy.
- A CLI command reference and a changelog entry tied to the artifact's released version, flagged `[BREAKING]` where relevant.

## Commonly sequenced with
- mcp-protocol-worker-bee: supplies the correctness ruling this Bee's docs are transcribed from.
- technical-writing-craft-worker-bee: reviews the prose quality of docs this Bee has already made factually honest.
- api-docs-worker-bee: owns the OpenAPI/REST layer when a project has both a REST API and the TS/CLI/MCP surfaces this Bee owns.
- docs-site-worker-bee: publishes this Bee's generated API reference inside a docs site.
- library-worker-bee / knowledge-worker-bee: own adjacent narrative and library/ documentation this Bee does not touch.
