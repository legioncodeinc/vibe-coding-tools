# 04 - Doc-to-Code Sync

Keeping any tool/API/CLI documentation honest as the code changes. Drift is the default state of documentation; the only docs that stay true are the ones a machine re-checks. Read `research/distilled-mcp-tool-docs.md` (section 4) for what's new here - a category of purpose-built drift-detection tooling now exists, worth naming alongside the hand-rolled CI gate this guide already teaches.

## What drifts

| Surface | Drift symptom | Source of truth |
|---|---|---|
| Tool (MCP or otherwise) | Description or schema no longer matches the real input schema; annotations claim a posture the handler doesn't have; a tool added/removed from the registration | the server's tool-registration code |
| TS public API | A hand-written or stale-generated API page contradicts the exported types | exported symbols + the generator (TypeDoc / API Extractor) |
| CLI | A flag renamed/removed in the dispatch but still in the docs (or vice versa); a documented default that no longer matches the parser | the CLI's dispatch + its own usage/help text |
| Narrative/in-repo docs | Architecture or feature docs describe behavior the code no longer has | the relevant source modules |
| Changelog | A released version with no changelog entry | the artifact's real version field |

## Manual sync pass

Run this before any docs-touching PR merges:

1. **Tools.** For each tool registration, confirm the doc's name, description, schema table, output shape, side-effect statement, and annotations (where the protocol defines them) match. Confirm no tool was added or removed without a doc update.
2. **CLI.** Walk the dispatch. Every routed command and flag must appear in the reference; every documented flag must be parsed.
3. **TS API.** Regenerate the API reference and diff against the committed one, or rely on CI to fail on a new undocumented export.
4. **Narrative docs.** Spot-check claims against the modules they describe.
5. **Changelog.** Confirm the top of the changelog matches the artifact's real released version.

Emit a drift table:

| Surface | Item | Doc says | Code says | Action |
|---|---|---|---|---|
| MCP tool | `search.limit` | max 100 | max 50 | Fix doc |
| CLI | `--token` | (missing) | parsed | Add to doc |

## CI gate: hand-rolled or off-the-shelf

**Hand-rolled** (what `templates/docs-sync-workflow.yml` provides): a CI workflow that (1) runs the API-reference generator and fails on warnings, (2) checks the changelog's top version against the artifact's real version, and (3) greps the tool-registration source for the set of registered tool names and fails if the documented tool list doesn't match. Proportionate for a small surface (a handful of tools, a CLI with one dispatch file) with no new dependency.

**Off-the-shelf drift-detection tooling** now exists specifically for TypeScript packages with a real exported API surface: tools in this category extract the current API via AST/type analysis, then diff documentation (doc comments and markdown) against it, flagging structural drift (a signature no longer matching its doc), semantic drift (deprecation/visibility mismatches, broken cross-references), example drift (an `@example` block that no longer runs), and prose drift (markdown referencing an export that no longer exists) - each finding with a file/line location for a fast fix. The adoption shape: scan locally, set a coverage/quality baseline, gate CI on that baseline so new drift fails the build. Recommend this category for a TypeScript package with a real public API and multiple contributors, where a hand-rolled grep-based gate would miss anything beyond "was the tool name grepped."

Either way, the point is not perfection - it is that a renamed flag or an added tool produces a red build, not a stale doc.

## Sync after a refactor

When a PR touches a tool's registration, the CLI dispatch, or an exported type:

1. Re-read the changed file.
2. Update the affected tool doc / CLI reference / doc comment **in the same PR**.
3. Regenerate the API reference if a public symbol changed.
4. Add a changelog entry if the change is consumer-visible.

Docs land with the code that changes them. A docs-only catch-up PR is a sign the gate failed.

---

## Worked example: Hivemind's sync gate

`templates/docs-sync-workflow.yml` is the Hivemind-flavored instance of the hand-rolled CI gate above: it runs `npm run docs:api` (TypeDoc, `treatWarningsAsErrors` set in `typedoc.json`), checks `CHANGELOG.md`'s top version against `package.json` (single-sourced by `scripts/sync-versions.mjs`), and greps `src/mcp/server.ts` for `registerTool(...)` names against `docs/mcp-tools.md`. Adjust the `DOCS_GLOB` and tool-name pattern for a different project's layout, or replace step 3 with a drift-detection tool if the project's TypeScript surface has grown past what a grep-based check can reliably catch.

*Source: `research/distilled-mcp-tool-docs.md` (section 4); `research/external/2026-08-14-typescript-docs-drift-detection.md`.*
