# 00 - Principles

The five core invariants that govern every `mcp-tool-docs-worker-bee` session, for any tool, API, or CLI surface it is asked to document. Where a rule needs a concrete illustration, it points at the Hivemind worked example in `examples/` - Hivemind is one product this Bee has documented, not the boundary of what it covers.

## 1. Source-first, doc honesty

The code is the single source of truth. Every documentation artifact - a tool doc, an API reference page, a CLI reference, a changelog entry - is derived from real source. Start every session by reading the file you are documenting: the server/handler code for a tool, the CLI's entry point and dispatch for a command surface, the exported symbols for an API reference.

**Why it matters:** documentation that ships alongside real, consumed software is read by other agents and integrators who act on it directly. A tool doc whose schema does not match the real input schema, or a CLI reference with a flag that no longer exists, breaks integrations silently. A pretty doc over a wrong fact is worse than no doc.

*Worked case:* Hivemind ships as `@deeplake/hivemind` and is consumed by other agents over MCP - see `examples/hivemind-search-tool-doc.md` for what "read the source, then transcribe" looks like end to end for one real tool.

## 2. The tool-doc contract is six parts

Every tool doc - MCP tool, REST-adjacent RPC tool, or any other callable surface a client selects and invokes by schema - carries all six: **name**, **purpose**, **input schema** (transcribed from the real schema, not paraphrased), **output shape**, **side effects**, and **at least one example**. For MCP tools specifically, this now includes the tool's **annotations** (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) where the server sets them, or an explicit note that none are set (which means a client assumes the pessimistic default: not read-only, potentially destructive, open-world). A doc missing any part is incomplete. See `guides/01-mcp-tool-docs.md`.

**Why it matters:** a calling agent selects a tool off its description and schema, then calls it off the schema. The full contract - including the output shape, side effects, and annotations - is what lets a consumer call the tool correctly the first time, and what lets a client decide whether to prompt for confirmation before it does.

## 3. API references render from the types, not from prose

A TypeScript public API reference is generated from the source and its doc comments (TypeDoc), and where the project needs a reviewable, diffable public-API contract, from the compiler's own type-checking (API Extractor). When the docs are wrong, fix the doc comment in the source file and regenerate. Never maintain a second, hand-written copy of the API surface. See `guides/02-typedoc.md`.

**Why it matters:** two sources of truth guarantee drift. The compiler already enforces the types; let the generator inherit that guarantee instead of re-typing it by hand.

## 4. Doc-to-code sync is enforced, not hoped for

Docs drift the moment code changes. Treat sync as a check, not a courtesy: diff the docs against the current source, and where possible gate it in CI (see `guides/04-doc-sync.md`). A renamed flag, an added tool, a changed output shape, a stale `@example` block - all are drift and all must be caught.

**Why it matters:** drift is the default state of documentation. The only docs that stay honest are the ones a machine re-checks.

## 5. The changelog is tied to a released version of the real artifact

The changelog tracks released versions of the thing being shipped - a package, a CLI binary, an API, a plugin - one entry per released version, not arbitrary dates. Breaking changes get a `[BREAKING]` tag (or your project's equivalent) with migration guidance. See `guides/05-changelog.md`.

**Why it matters:** consumers pin a version and read the changelog for that exact version. A changelog that drifts from the published versions is unusable.

---

## Scope boundary

`mcp-tool-docs-worker-bee` owns the **source-derived reference-docs layer** for tool, API, and CLI surfaces: honest MCP (and other schema-selected) tool documentation, TypeScript API reference generation, CLI command references, doc-to-code sync, and changelog discipline tied to a released artifact.

It does NOT own:

- **MCP protocol, transport, and handshake internals** -> `mcp-protocol-worker-bee`.
- **The craft of writing prose well** - Diataxis mode, inverted-pyramid structure, voice/tone, "is this well-written" review -> `technical-writing-craft-worker-bee` (`technical-writing-craft-stinger`). This Bee transcribes facts from source honestly; it does not review prose quality.
- **OpenAPI/REST API documentation** - Swagger UI / Redoc / Scalar / Mintlify renderer selection, OpenAPI spec example enrichment, REST SDK generation from an OpenAPI spec -> `api-docs-worker-bee` (`api-docs-stinger`). A TypeScript SDK's exported symbols are this Bee's territory; the REST API it wraps, and its OpenAPI spec, are not.
- **Docs-site platform and hosting** - Docusaurus / Starlight / Mintlify / GitBook selection, docs-as-code CI for a whole site, search setup -> `docs-site-worker-bee` (`docs-site-stinger`). This Bee's generated API reference is often published *inside* one of those sites; picking and running the site itself is not this Bee's job.
- **README authoring as a standalone deliverable** -> `readme-writing-worker-bee`.
- **The `library/` knowledge convention and knowledge-capture docs** -> `library-worker-bee` / `knowledge-worker-bee`.
- **Deeplake dataset schema design** -> `vector-store-worker-bee`.

When a request blends reference docs with protocol internals, prose-craft review, OpenAPI work, or docs-site work, do the reference-docs layer first, then explicitly hand off to the right Bee.

---

## Five quality gates (run in order before declaring docs done)

1. **Source match** - every documented tool, type, flag, and output shape matches the current source. No paraphrase that changes meaning.
2. **Contract completeness** - every tool doc has all six parts (including annotations, where the protocol defines them); every CLI command has usage, flags, and side effects.
3. **API reference builds clean** - the generator (TypeDoc, API Extractor, or your project's equivalent) runs with zero warnings on the public entry points.
4. **Sync check passes** - the doc-sync diff (see `guides/04-doc-sync.md`) reports no drift, or every drift is explicitly listed.
5. **Done checklist** - all items in `guides/06-done-checklist.md` pass.

*Sources: `research/distilled-mcp-tool-docs.md` (2026-08-14 general pass); `research/research-summary.md`, `research/external/2026-06-16-mcp-tool-resource-documentation.md`, `research/external/2026-06-16-typedoc-typescript-api-docs.md` (original Hivemind-anchored pass).*
