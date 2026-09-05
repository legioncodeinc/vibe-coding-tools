# 06 - Done Checklist

Run this checklist before declaring tool/API/CLI documentation complete, for any project this Bee documents. All 10 items must pass or be explicitly acknowledged.

| # | Check | Pass criteria |
|---|---|---|
| 1 | **Source read** | The actual source for every documented surface was read this session (tool registrations, CLI dispatch, exported types) |
| 2 | **Tool name + purpose match** | Every tool's documented name and purpose match its real registration and description |
| 3 | **Input schemas match** | Every tool's schema table matches the real input schema field-for-field (type, required, constraints, default, description text) |
| 4 | **Output shapes documented** | Every tool doc states the full output, including empty-result and error outputs |
| 5 | **Side effects honest** | Read-only tools say read-only; writing tools say what they write. Where the protocol defines annotations (MCP's `readOnlyHint`/`destructiveHint`/`idempotentHint`/`openWorldHint`), the documented values match what the server actually sets - or their absence is noted explicitly. No doc claims a side effect the code lacks |
| 6 | **Tool examples present** | Every tool doc has at least one realistic call + response |
| 7 | **API reference builds clean** | The TypeScript API generator (TypeDoc, and API Extractor if the project uses it) runs with zero warnings on the public entry points |
| 8 | **CLI reference matches dispatch** | Every command/flag in the docs is parsed by the CLI, and every parsed flag is documented; every default is stated explicitly, not implied |
| 9 | **Sync check passes** | The doc-sync diff reports no drift, or every drift is explicitly listed (see `guides/04-doc-sync.md`) |
| 10 | **Changelog tied to a real version** | If this is a version bump or consumer-visible change, a changelog entry exists, its top version equals the artifact's real released version, and breaking changes carry `[BREAKING]` (or the project's equivalent tag) |

## Fast-path for "good enough"

For an internal-only change with no external consumers, items 6 and 7 may be deferred if:

- The change is internal-only (no public tool, type, or CLI surface touched).
- There is a ticket to backfill the deferred items.
- The deferred items are explicitly listed in the session output.

Never defer items 1, 2, 3, 5, 8, 10 for any change that touches a consumer-facing surface.

## How to emit the checklist

At the end of every `mcp-tool-docs-worker-bee` session, emit the checklist as a markdown table with `pass` / `warn` / `fail` in a "Result" column, plus a brief note for any non-passing item.

---

## Worked example: the Hivemind instance of this checklist

Applied to Hivemind specifically: item 1 means re-reading `src/mcp/server.ts`, `src/cli/index.ts`, `src/commands/*`, and the exported TS types each session; item 7 means `npm run docs:api` (TypeDoc); item 10 means the changelog's top version matches `package.json` as single-sourced by `scripts/sync-versions.mjs`. See `guides/00-principles.md` through `guides/05-changelog.md` for the general form of each item and the Hivemind worked examples they each point to.
