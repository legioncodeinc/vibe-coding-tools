# git-cliff documentation

- **URL:** https://git-cliff.org/docs/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (tool's own documentation)
- **Why archived:** The reference implementation of the commit-to-changelog pipeline. It
  establishes what a changelog generated from git history can and cannot contain, which is
  the boundary this skill lives on: the tool covers everything that became a commit, and
  this skill covers what did not.

## What it does

Quoted: git-cliff "can generate changelog files from the Git history by utilizing
conventional commits as well as regex-powered custom parsers."

## How entries are derived

Commit messages are parsed against the Conventional Commits grammar. Commits are grouped by
type into changelog sections. The type-to-SemVer mapping the docs restate:

| Commit prefix | Meaning | SemVer |
|---|---|---|
| `fix:` | bug fix | PATCH |
| `feat:` | new feature | MINOR |
| `feat!:`, `fix!:` | breaking change | MAJOR |

Grouping is configurable through `commit_parsers`, which match a commit message against a
regex and assign it a group heading. The default configuration groups by type, for example
`feat`, `fix`, `docs`.

## Recommendations the docs give

- Use Conventional Commits formatting.
- Prefer a squash merge strategy, so one merged change is one parseable commit.

## Limits, and what the docs do not say

The documentation does not carry an explicit limitations section about non-conventional
commits or about work that never landed in a commit. What it does establish, structurally,
is that git-cliff "generates changelogs from commit messages", so its coverage is exactly
the set of commits and nothing else.

**This is the load-bearing observation for the skill.** Everything a commit-driven
generator produces is observed from the repository. Everything it omits (an investigation
that ended in a one-line fix, an approach that was tried and abandoned, a decision made in
a terminal or a chat) is invisible to it. That omitted set is what this skill reconstructs.

## Note on retrieval fidelity

Fetched through a summarizing reader. The reader confirmed the quoted description and the
type mappings, and explicitly reported that specific default group labels and a
limitations statement were not present in the content it saw. Whether Keep a Changelog
output is supported was not confirmed from this fetch and is recorded as unknown.
