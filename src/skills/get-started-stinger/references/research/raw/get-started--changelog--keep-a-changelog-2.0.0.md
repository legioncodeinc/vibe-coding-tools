# Keep a Changelog 2.0.0
- URL: https://keepachangelog.com/en/2.0.0/
- Fetched: 2026-08-14
- Source type: official-spec
- Component: changelog

Version 2.0.0 published 2026-06-07 — first major revision since 1.0.0 (2017). Breaks guidance, not format: the six change types, ISO dates, and `Unreleased` section are unchanged; new material covers LLM-drafted changelogs, Conventional Commits, monorepos, and non-SemVer versioning.

## Guiding principles

Changelogs are for humans, not machines. Every version gets an entry. Group changes of the same type together. Make versions and sections linkable. List the latest version first. Show the release date of each version. Note which versioning scheme is used. Write plainly.

## The six change types (deliberately no more)

`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`. The spec explicitly refuses to add a seventh category, e.g. a "Dependencies" or "Performance" type — those fold into `Changed`/`Added`/`Fixed` as appropriate — "keeping to the six leaves every changelog readable the same way, and parseable by the same tools." Guidance for the three most-confused types: `Fixed` = behavior was wrong, now correct. `Changed` = behavior worked as intended, now works differently. `Security` = the change addresses a vulnerability (lead with the CVE identifier if there is one, e.g. `- CVE-2024-12345: out-of-bounds read...`).

## Breaking changes

Mark them clearly inside `Changed` or `Removed` with a `**Breaking:**` prefix, in place — don't collect them into a separate section:
```
- **Breaking:** parse() now returns a result object instead of raising.
```

## Structuring a release

- Keep an `Unreleased` section at the top; move its contents into a new dated version at release time, then start a fresh empty `Unreleased`.
- Version heading format: `## [1.0.0] - 2017-07-17` — ISO 8601 `YYYY-MM-DD`, no regional ambiguity.
- Version numbers in square brackets are Markdown reference links resolved at the bottom of the file to compare URLs:
```
[Unreleased]: https://github.com/org/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/org/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0
```
- SemVer is **not required** as of 2.0.0 — calendar versioning, a plain number, or a date all qualify, but the file must state which scheme it uses.

## File naming and header

Name the file `CHANGELOG.md` (not HISTORY/NEWS/RELEASES) for discoverability. Open with:
```
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
```

## Changelog vs release notes

Not the same thing. The changelog is the complete ongoing record kept in the repo, written plainly; release notes are a per-release announcement drawn from the changelog, often with a marketing voice, and typically live on a host's platform rather than travel with the repo. Keep `CHANGELOG.md` as canonical; generate release-note posts from it.

## What weakens a changelog

- **Commit-log diffs** are not a changelog — full of merge noise and internal detail written for the wrong audience.
- **Ignoring deprecations** — always mark `Deprecated` a release before `Removed`, stating which version will remove it.
- **Inconsistent recording** — a changelog that only records some changes misleads more than no changelog, because readers treat it as the full picture.

## Automation and LLMs (new in 2.0.0)

A model can draft a changelog entry from a diff, but "machines can draft, humans curate" — a model can't decide what's notable for the readers or say it plainly. If used for a first draft, brief it like a contributor: summarize notable user-facing changes, don't paste a git log, sort into one of the six types, mark breaking changes, remove anything not worth reading, then have a human read the result before anyone else does. Same caution applies to Conventional-Commits-driven tools (semantic-release, release-please, Changesets, git-cliff) — a commit message and a changelog entry serve different readers and don't convert cleanly. CI's role should stay mechanical: move `Unreleased` into a dated version at release time, verify formatting — never make a changelog edit a required check on every PR (that just fills the file with noise to pass the gate).

## Yanked releases and monorepos

Mark a pulled release with a trailing `[YANKED]` tag, don't hide it: `## [0.0.5] - 2014-12-13 [YANKED]`. For monorepos: unrelated projects sharing a repo each keep their own changelog; a single product split into components can keep per-component changelogs plus one central summary changelog readers don't have to hunt through all of them to understand a release.
