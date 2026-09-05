---
name: "mcp-tool-docs-stinger"
description: "Documents MCP tools, TypeScript APIs, and CLIs honestly: schema, output, side effects, examples, doc-to-code sync. Use when writing or auditing tool/API/CLI docs."
---

# mcp-tool-docs-stinger

Procedural arsenal for `mcp-tool-docs-worker-bee`, the Hive's tool/API/CLI documentation specialist. This stinger encodes how to document any tool, API, and CLI surface honestly: schema-selected tools (MCP tools first and foremost - name, purpose, input schema, output shape, side effects, annotations, examples), the TypeScript public API rendered with a generator (TypeDoc, and API Extractor where a reviewable public-API contract is needed), a CLI's command surface, doc-to-code sync discipline, and changelog discipline tied to a released artifact's real version.

Hivemind (`@deeplake/hivemind`) - the MCP tools exposed by `src/mcp/server.ts` plus the OpenClaw goal/KPI contracts, its TypeScript public API, the `hivemind` CLI, and its `sync-versions`-driven changelog - remains fully covered throughout as a worked example. The guides teach the general practice first and point to the Hivemind case for a real, end-to-end illustration.

## When this stinger applies

Load this stinger when `mcp-tool-docs-worker-bee` is invoked. Typical triggers:

- "Document these MCP tools."
- "Is the description on this tool honest? Does it match the code?"
- "Write the input schema and output shape for this tool."
- "Generate the TypeScript API reference."
- "Document this CLI's command surface."
- "These docs drifted from the code - re-sync them."
- "Write a changelog entry for this release."
- "Audit the tool/API/CLI docs."
- "Document the Hivemind MCP tools / the hivemind CLI / Hivemind's TypeDoc setup." (the worked-example case)

Do NOT load it for:

- MCP protocol, transport, or handshake internals (route to `mcp-protocol-worker-bee`).
- Prose-quality review or ghostwriting - Diataxis mode, inverted-pyramid structure, voice/tone, "is this well-written" (route to `technical-writing-craft-worker-bee`). This Bee transcribes facts from source honestly; it does not review prose craft.
- OpenAPI/REST API documentation - Swagger UI / Redoc / Scalar / Mintlify renderer selection, OpenAPI spec example enrichment, REST SDK generation from an OpenAPI spec (route to `api-docs-worker-bee`).
- Docs-site platform and hosting - Docusaurus / Starlight / Mintlify / GitBook selection, docs-as-code CI for a whole site, search setup (route to `docs-site-worker-bee`).
- README authoring as a standalone deliverable (route to `readme-writing-worker-bee`).
- The `library/` knowledge convention or general knowledge capture docs (route to `library-worker-bee` / `knowledge-worker-bee`).
- Deeplake dataset schema design (route to `vector-store-worker-bee`).

## First action when this stinger is loaded

Read these in order before doing anything else:

1. **`guides/00-principles.md`** - doc honesty, the five quality gates, when to route elsewhere, and the core invariants (general, not product-specific).
2. **`guides/01-mcp-tool-docs.md`** - how to document any schema-selected tool from its real registration and handler. Read this before documenting any tool.
3. **`research/distilled-mcp-tool-docs.md`** - the current synthesis: honest MCP tool docs (including annotations), TypeScript API reference generation beyond TypeDoc, CLI documentation conventions, doc-to-code sync tooling, and changelog automation.

Then walk the remaining guides in task order. Each guide teaches the general practice first, then points to the matching `examples/*.md` file for a worked Hivemind case. Always read the real source before writing - these docs are honest about the code or they are wrong.

## Folder layout

```text
mcp-tool-docs-stinger/
├── SKILL.md                          (this file)
├── README.md                         (one-page human overview)
├── guides/
│   ├── 00-principles.md              (doc honesty, five quality gates, scope boundary, cross-links)
│   ├── 01-mcp-tool-docs.md           (documenting any schema-selected tool from its real schema + handler)
│   ├── 02-typedoc.md                 (TypeScript API reference generation: TypeDoc + API Extractor)
│   ├── 03-cli-docs.md                (documenting any CLI's command surface)
│   ├── 04-doc-sync.md                (keeping docs in sync with code; drift detection, hand-rolled or tooled)
│   ├── 05-changelog.md               (changelog discipline tied to a released artifact's version)
│   └── 06-done-checklist.md          (10-point validation before docs ship)
├── examples/                         (worked examples - all Hivemind-specific, clearly labeled)
│   ├── hivemind-search-tool-doc.md   (full worked doc for the hivemind_search MCP tool)
│   ├── hivemind-cli-reference.md     (CLI reference for install / status / login)
│   ├── typedoc-setup.md              (TypeDoc config + npm script for the TS public API)
│   └── changelog-entry.md            (worked changelog entry for a real version bump)
├── templates/
│   ├── mcp-tool-doc.md               (tool doc template: name/purpose/schema/output/side-effects/examples)
│   ├── cli-command-reference.md      (CLI command reference template)
│   ├── typedoc-json.md               (typedoc.json + package.json script template)
│   ├── docs-sync-workflow.yml        (CI workflow that fails when docs drift from code)
│   └── changelog-entry.md            (changelog entry template tied to a released version)
├── reports/
│   └── README.md                     (how past audit summaries accumulate)
└── research/
    ├── distilled-mcp-tool-docs.md    (current synthesis, 2026-08-14 - read this first)
    ├── research-plan.md              (original Hivemind-anchored plan, 2026-06-16 - DO NOT MODIFY)
    ├── research-summary.md           (original Hivemind-anchored summary, 2026-06-16 - DO NOT MODIFY)
    ├── index.md                      (index across both research passes)
    └── external/                     (source notes: 2 from 2026-06-16, 8 new from 2026-08-14)
```

## Surfaces to document

| Surface | Source of truth | How it's documented |
|---|---|---|
| **Schema-selected tools (MCP, etc.)** | the server's tool-registration code | Name, purpose, input schema, output shape, side effects, annotations (where the protocol defines them), examples |
| **TypeScript public API** | exported types + functions in source | TypeDoc (readable reference), API Extractor (reviewable public-API contract) - pick one or both per `guides/02-typedoc.md` |
| **CLI** | the CLI's dispatch/routing + its own usage/help text | Command reference: usage, flags, side effects, non-interactive path, disambiguation notes |
| **In-repo reference docs** | README, architecture/feature docs | Kept in sync with code; doc honesty enforced |
| **Changelog** | the artifact's single-sourced released version | Entry per released version, hand-written impact-first or generated from Conventional Commits |

**Worked example (Hivemind):** the MCP tools shipped today are `hivemind_search`, `hivemind_read`, and `hivemind_index` (stdio transport, read-only, auth via `~/.deeplake/credentials.json`); OpenClaw additionally contracts `hivemind_goal_add` and `hivemind_kpi_add` (write tools). The TS public API is rendered with TypeDoc from `src/index.ts`. The CLI (`hivemind install [--only <platforms>] [--skip-auth] [--token <value>]`, `hivemind <agent> install`, `hivemind uninstall`, `hivemind login`, `hivemind status`, `hivemind update [--dry-run]`, plus `goal`/`kpi`/`context`/`graph`/`dashboard`/`rules`/`skillify`/`embeddings <sub>`) is documented from `src/cli/index.ts` routing - never from memory. The changelog tracks `@deeplake/hivemind`, single-sourced via `scripts/sync-versions.mjs`. See `guides/01-mcp-tool-docs.md` through `guides/05-changelog.md` for the general procedure each of these demonstrates, and `examples/*.md` for the worked docs themselves.

## Cross-links (adjacent Bees - route there instead of duplicating)

This stinger owns the **source-derived reference-docs layer** for tool, API, and CLI surfaces. Three adjacent stingers own territory this one does not - cross-link rather than re-teaching their material:

- **`technical-writing-craft-stinger`** - the craft of writing well: Diataxis mode classification, inverted-pyramid structure, code-example discipline, voice/tone, ghostwriting, docs-as-code prose review. Use it when the question is "is this well-written," not "does this doc match the code."
- **`api-docs-stinger`** - OpenAPI/REST API documentation specifically: Swagger UI / Redoc / Scalar / Mintlify / Stoplight / Bump.sh tool selection, OpenAPI spec example enrichment, REST SDK generation (openapi-generator-cli, Fern, Speakeasy). Use it for a REST API's OpenAPI spec and its renderer; use this skill for the TypeScript SDK's exported symbols and any MCP/CLI surface.
- **`docs-site-stinger`** - documentation-site platform selection and hosting (Docusaurus, Starlight, Mintlify, GitBook, MkDocs Material, Nextra, Fern), docs-as-code CI for a whole site, search setup. This skill's generated API reference is often published *inside* one of those sites - picking and running the site itself belongs there.

## Critical directives (lifted from the Command Brief)

These are non-negotiables. Full justification in `guides/00-principles.md`.

- **Read the source before writing a single line.** A tool doc that does not match `src/mcp/server.ts` is a bug, not documentation.
- **Tool descriptions and schemas must match real behavior.** The zod `inputSchema`, the output `content` shape, and the side effects are facts, not prose. Honest or wrong, no middle.
- **Every MCP tool doc carries six parts:** name, purpose, input schema (from zod), output shape, side effects, and at least one example.
- **TypeDoc renders from the TS types, not hand-written prose.** Fix the doc comment in the source; never fork the truth into a separate file.
- **The changelog is tied to the npm version.** `scripts/sync-versions.mjs` single-sources the version; the changelog tracks `@deeplake/hivemind` releases, not arbitrary dates.
- **Do not scope-creep into protocol internals or README authoring.** Route to `mcp-protocol-worker-bee` / `readme-writing-worker-bee`.
- **This is a general documentation practice, not a single-product skill.** The Hivemind-specific facts above still hold exactly as written for Hivemind; when documenting any other project's tools, API, or CLI, apply the same shape (six-part tool docs, generated API references, source-derived CLI references, single-sourced changelog versions) to that project's real source instead.
- **Set and check MCP tool annotations, not just prose side effects.** Where a server defines `readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`, the tool doc records the real values and flags any contradiction with the prose side-effect claim; where none are set, say so and note the pessimistic default a client will assume.
- **Do not scope-creep into OpenAPI/REST docs, docs-site platform work, or prose-craft review.** Route to `api-docs-worker-bee`, `docs-site-worker-bee`, or `technical-writing-craft-worker-bee` respectively - see Cross-links above.

---

*Forged by `stinger-forge` from `mcp-tool-docs-worker-bee-command-brief.md` and `research/`. Broadened to general tool/API/CLI documentation practice 2026-08-14, Hivemind material preserved as worked examples. Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
