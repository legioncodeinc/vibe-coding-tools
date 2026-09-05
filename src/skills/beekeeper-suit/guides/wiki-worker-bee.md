# wiki-worker-bee

## Domain
Owns per-repo entity cartography: extracting code entities (functions, classes, modules, services, endpoints, env vars, config keys, data models, components, SQL tables, queues, cron jobs, feature flags) and architectural concepts from source plus git context, filing them as atomic markdown pages with `[[backlinks]]` into `library/knowledge/private/wiki/`, inferring ADRs from commit messages that clearly encode decisions, and running an active four-artifact contradiction protocol whenever an entity contract changes. It is read-only against source code and against the wiki's global state files, writing per-page content only.

## Paired Stinger
[wiki-stinger](../../wiki-stinger) - the 15 non-negotiable principles, canonical vs. direct invocation, the six-phase extraction procedure, the entity-extraction catalog, atomic page rule, ADR detection, and the contradiction protocol.

## Trigger phrases
- "document this module's entities in the wiki"
- "scan this directory and file wiki pages"
- "update the wiki after this refactor"
- "@wiki-worker-bee extract entities from this file"
- "lint the wiki pages in this chunk"
- "did this commit encode an architectural decision"

## Do NOT route when
- The ask is module narrative authorship (prose describing what a module does and why): route to library-worker-bee.
- The ask is a QA report: route to quality-worker-bee.
- The ask involves writing or reconciling `index.md`, `<type>/_index.md`, `log.md`, `hot.md`, or `.legion/file-hashes.json`: these are owned exclusively by The Hive VS Code extension's TypeScript driver, this Bee never touches them.
- The invocation is a vague `@`-mention with unclear scope: the Bee must ask one clarifying question and get explicit confirmation before writing anything, not proceed on an inferred scope.
- A commit message's architectural signal is low-confidence: file a `questions/` page rather than promoting it to a `decisions/` ADR page.

## Inputs the Bee needs
- The invocation path: canonical (TS driver structured payload with pre-computed git context) or direct `@`-mention (self-discovered chunk, requires user confirmation).
- The mode: `document`, `update`, `scan-directory`, or `lint`.
- Prior state for `update` mode, to detect contract changes and trigger the contradiction protocol.

## Outputs
- 8-15 atomic entity/concept pages per chunk, each ≤300 lines, with `last_commit_hash` in frontmatter.
- `decisions/` pages for high-confidence ADR signals, `questions/` pages for low-confidence ones or unresolved gaps.
- On any contract change: a `[!stale]` callout, a `[!contradiction]` callout, a `meta/<date>-contradiction-report.md` entry, and a `notification_flag`, all four every time.
- A structured response payload (`pages_created`, `pages_updated`, `decisions_filed`, `contradictions_flagged`, `gaps`, `lint_findings`, `partial_scan`, etc.).

## Commonly sequenced with
- library-worker-bee: the sibling Bee for per-module narrative documentation, as opposed to this Bee's atomic entity pages.
- quality-worker-bee: for QA reports that reference entities this Bee has documented.
- The Hive VS Code extension's TypeScript driver: for global-state reconciliation after this Bee's per-page writes, especially after a `partial_scan: true` direct invocation.
