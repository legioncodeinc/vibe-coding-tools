# Guide 08: Stub Pages for Non-TS/JS Files

v1 entity extraction is TS/JS-first via `ts-morph`. Files in other languages (`.go`, `.py`, `.rs`, `.java`, `.sql`-other-than-DDL, `.yml`, etc.) get **filename-only stub pages** so the wiki acknowledges their existence and v2 multi-language extraction can find and upgrade them in place.

## When to write a stub

In Phase 1 (Parse the chunk), for each file in the chunk whose extension is NOT in `{.ts, .tsx, .js, .jsx}`, and is also NOT a known special case handled elsewhere (`.sql` DDL goes to `sql-table`; `.prisma` / `schema.ts` go to `data-model`):

1. Detect the language from the extension.
2. Write a stub entity page per the rules below.
3. Skip ALL further phases for that file: no concept extraction, no contradiction check, no ADR detection from its commit history (commits are still scanned for ADR signals at the chunk level, just not per-file).

## Stub filename pattern

Per user decision 2026-04-29: **basename only, source extension recorded in frontmatter.**

```
Source file:           src/auth/middleware.go
Stub wiki page:        entities/middleware.md
```

NOT `entities/middleware.go.md`. The basename is the wiki name; the original extension lives in `source_extension:` frontmatter.

This keeps wiki names stable when v2 upgrades the stub: `entities/middleware.md` becomes a real entity page with full extraction, but the filename and any wikilinks pointing at it remain valid.

## Stub frontmatter (template)

```yaml
---
type: entity
title: "middleware"
entity_type: module               # default for stubs; v2 may re-classify
status: stub                      # tells lint mode this is awaiting v2 upgrade
created: "2026-04-29"
updated: "2026-04-29"
path: "src/auth/middleware.go"    # full source path, repo-relative
language: go                       # from extension detection
source_extension: ".go"           # original extension preserved
last_commit_hash: "abc123"
depends_on: []
used_by: []
tags:
  - entity
  - stub
related: []
sources: []
---

# middleware

> [!gap]
> This file is in a language outside the v1 ts-morph extraction scope (`go`).
> A stub page has been filed so the wiki acknowledges its existence and incoming wikilinks remain valid.
> v2 multi-language extraction (via Tree-sitter) will upgrade this page in place.

## Source

`src/auth/middleware.go` — last touched in commit `abc123` ({author}, {date}).
```

That's it. No body extraction. No connections. No history beyond the last_commit fact.

## Filename collision handling

If two files in different folders share a basename (`src/auth/middleware.go` and `src/billing/middleware.go`), the basename-only convention collides. Resolution:

1. First file processed wins the bare name: `entities/middleware.md`.
2. Subsequent files get a path-disambiguated suffix: `entities/middleware-billing.md`, `entities/middleware-auth.md` (suffix is the parent directory name).
3. The collision is also flagged in the response payload's `gaps:` array as `{entity: "middleware", referenced_in: "<second-file-path>", reason: "basename collision with <first-file-path>"}` so the user can decide whether to rename or accept the disambiguation.

This collision logic only applies to stubs. TS/JS entities are uniquely named by their export name, so basename collisions are a stub-specific problem.

## What the stub page implies for lint mode

[`guides/09-lint-mode.md`](09-lint-mode.md) treats `status: stub` as a known incomplete state. A stub is NOT an orphan even if no other page links to it: its presence is the marker, and v2 upgrade will populate `used_by:` from real extraction.

Lint mode does flag a stub if:
- `last_commit_hash` is older than the source file's actual last commit (the stub is stale and needs a refresh).
- The `source_extension` field is missing or empty.

## Why not just skip non-JS files

Three reasons:

1. **Wikilink integrity.** If a TS file imports a Go binary's CLI output via a comment reference (`// see: src/auth/middleware.go`), the agent might wikilink to it. Without a stub page, the link is dead.
2. **Coverage visibility.** When the user runs Initialize on a polyglot repo, the wiki should reflect that polyglot reality even if v1 can't do deep extraction yet.
3. **v2 upgrade path.** Tree-sitter extraction in v2 walks `entities/*.md` looking for `status: stub`, identifies the source file via `path:`, and upgrades in place. Without stubs, v2 has no anchor.

## What's NOT a stub

These special cases get full entity treatment in v1, NOT stubs:

- `.sql` files containing `CREATE TABLE` → `sql-table` per [`guides/04-entity-extraction-by-type.md`](04-entity-extraction-by-type.md).
- `.prisma` schema files → `data-model` entities (one per `model` declaration).
- `schema.ts` Drizzle files → `data-model` entities.
- `.json` config files → may yield `config-key` entities if read at runtime by a known config loader.
- `.yml` files for cron-job definitions (e.g., GitHub Actions cron): file as `cron-job` if the structure is recognizable.

Everything else outside `.ts/.tsx/.js/.jsx` and the special cases above → stub.

## Source

User decision 2026-04-29 on stub filename pattern. v2 upgrade path is informed by `research/2026-04-29-synthesis.md` (Tree-sitter deferred-to-v2 note).
