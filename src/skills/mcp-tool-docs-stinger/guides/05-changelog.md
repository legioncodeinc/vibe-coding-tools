# 05 - Changelog Discipline (tied to a released artifact)

Writing or reviewing a changelog for any released artifact - a package, a CLI binary, an API, a plugin - that consumers can pin against. The changelog tracks real releases of that artifact, one entry per published version, not arbitrary dates. Read `research/distilled-mcp-tool-docs.md` (section 5) before running this guide - it covers the Keep a Changelog format convention and the Conventional-Commits-driven automation layer, neither of which the original pass had.

## The version must be single-sourced

Every released artifact needs exactly one place its version is truly defined, and every manifest, changelog heading, and build artifact must trace back to it. However the project achieves that (a version-sync script, a monorepo release tool, a single `package.json` read at build time), the implication for the changelog is the same: **the version at the top of the changelog must equal the artifact's real, single-sourced version.** Never write a changelog version that does not correspond to a real release.

## Two ways to produce the changelog: hand-written or generated

**Hand-written, impact-first** (this skill's default template): a maintainer writes each entry, leading with who is affected and what to do about it. Best when the audience needs migration guidance a bare commit message won't carry.

**Generated from Conventional Commits**: for a team that already enforces commit-message discipline, the changelog (and the version bump) can be derived mechanically:

- **Conventional Commits** is the convention the tooling depends on: `fix:` -> patch, `feat:` -> minor, a `!` after the type/scope or a `BREAKING CHANGE:` footer -> major.
- **semantic-release** fully automates the release: determines the next version, generates release notes, and publishes from commit history - no human sets the version number.
- **release-please** takes a lighter touch: it opens a release PR with the changelog and version bump pre-filled from commit history, for a human to review and merge.
- **conventional-changelog** is the underlying library both build on, and can be run standalone to regenerate a `CHANGELOG.md` from git history against a chosen preset.

Choose generated changelogs when commit hygiene is already enforced (e.g., via commitlint) and the team wants low-effort releases; choose hand-written, impact-first entries when the audience needs more migration context than a commit message alone provides. A generated changelog is still only as good as the commit messages behind it - a `!`/`BREAKING CHANGE:` commit still needs real migration guidance in its body for the generated notes to be useful, which is the same discipline the impact-first template below enforces by hand.

## The [BREAKING] convention

Any change that breaks a consumer MUST be prefixed `[BREAKING]` (or your project's chosen equivalent - a Conventional-Commits-driven changelog typically renders this from a `!`/`BREAKING CHANGE:` commit instead). The consumer-facing surfaces to watch: tools, the public API, and the CLI.

**Breaking changes include:**

- Removing or renaming a tool, or changing its input schema (a new required field, a removed field, a tightened constraint).
- Changing a tool's output shape that consumers parse.
- Removing or renaming an exported symbol, or changing a public signature.
- Removing or renaming a CLI command or flag, or changing a flag's meaning.

**Non-breaking changes (no prefix):**

- Adding a new tool.
- Adding a new optional schema field.
- Adding a new exported symbol or a new CLI command/flag.
- Bug fixes that restore documented behavior.

Use `@deprecated` in source (and a `[DEPRECATED]` changelog note) for symbols that still work but will be removed.

## Impact-first format (Keep a Changelog-compatible)

```markdown
## [0.9.0] - 2026-06-16

### [BREAKING] search - `limit` max lowered from 100 to 50

**Who is affected:** Callers passing `limit > 50`.
**Migration:** Cap `limit` at 50; the server now rejects higher values.
**Why:** Backend page-size guardrail.

### Added: `index` `prefix` filter

Optional `prefix` narrows results. No migration needed.

### Fixed: fresh-org reads no longer surface raw backend errors

A missing-table error on a fresh org is now reported as a plain "empty" message (issue #252).
```

This follows the Keep a Changelog convention: group by change type (Added, Changed, Deprecated, Removed, Fixed, Security), newest version first, one entry per released version, state whether the project follows semver, and keep an `Unreleased` section at the top for changes not yet cut into a version. Its central argument: **changelogs are for humans, not machines** - raw commit history is noisy (merge commits, doc-only commits, obscure titles), and a changelog's job is to surface the *noteworthy* difference, often spanning several commits, clearly to the people consuming the release. GitHub Releases are not a substitute for a versioned `CHANGELOG.md` - they're non-portable and less discoverable than a top-level file next to `README`/`CONTRIBUTING`.

**Rules:**

1. Lead with impact: who is affected and what breaks.
2. Include migration steps for every `[BREAKING]` entry.
3. Group by surface (tools / API / CLI) when an entry spans several.
4. Newest version at the top.

## Semantic versioning

| Change type | Version bump |
|---|---|
| Breaking change to a tool, public type, or CLI command | MAJOR |
| New tool, new optional field, new command, non-breaking addition | MINOR |
| Bug fix, doc-only, internal-only change | PATCH |

Bump the version at its single source, run whatever propagates it to every manifest, and add the matching changelog entry in the same change (or let the generator do both, if the project has adopted that path).

## Changelog placement

A `CHANGELOG.md` at the repo root (or one per package in a monorepo), one section per released version. The top heading must match the artifact's real version. See `templates/changelog-entry.md` and `examples/changelog-entry.md`.

---

## Worked example: a Hivemind version bump

`examples/changelog-entry.md` is a complete, worked changelog entry tied to a real `@deeplake/hivemind` version bump, including a before/after showing why "Updated search and index tools / Bug fixes" fails every rule above (no version, no `[BREAKING]` tag, no migration guidance, unparseable). It also walks the Hivemind-specific version chain: bump `package.json`, let the `prebuild` hook run `scripts/sync-versions.mjs` to propagate the version to every manifest, and set the changelog's top heading to match. Read it for the hand-written, impact-first path applied end to end; adopt the Conventional-Commits-driven automation path instead if the project already enforces commit-message discipline.

*Source: `research/distilled-mcp-tool-docs.md` (section 5); `research/external/2026-08-14-keep-a-changelog.md`.*
