# Common Changelog

- **URL:** https://common-changelog.org/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (a competing specification, published as a spec)
- **Why archived:** It is a direct, published disagreement with parts of Keep a Changelog
  and with Conventional Commits. Archiving it prevents the skill from presenting Keep a
  Changelog as the uncontested standard, and it supplies the strongest published argument
  against generating a changelog from commit history, which is exactly the argument this
  skill has to answer.

## Its relationship to Keep a Changelog

Self-described as "adapted from and a stricter subset of Keep a Changelog." It keeps the
principle that changelogs are written by humans for humans and adds that "a clean
changelog starts with a clean git history."

## Where it differs

**Fewer categories.** "Common Changelog does not have `Deprecated` and `Security`
categories." It mandates exactly four groups, in this fixed order:

1. `Changed`
2. `Added`
3. `Removed`
4. `Fixed`

**No Unreleased section.** It removes `Unreleased`, calling the Keep a Changelog workflow
"an unproductive workflow." Three reasons given: maintainers end up adding references after
the fact, first-time contributors should not be asked to update the changelog, and writing
a good entry needs "a bird's-eye view of the project" that a single contributor does not
have at the time of their change.

## Required structure

- File named `CHANGELOG.md`, Markdown, starting with a first-level heading `# Changelog`.
- Each release is a second-level heading of the form `## VERSION - DATE`, date in ISO 8601
  `YYYY-MM-DD`.
- A release contains either change groups alone, or a notice followed by change groups.
  "No other content is permitted, because a changelog is not a blog or detailed upgrade
  guide."

## Writing rules

- **Imperative mood, present tense.** "Write a change using the imperative mood. It must
  start with a present-tense verb."
- **Self-describing entries.** "Each change must be self-describing, as if no category
  heading exists." So an entry under `Fixed` does not begin with the word "Fix".
- **References are mandatory.** "changes must reference relevant commits, and should
  reference tickets or pull requests when available."
- **Attribution format.** "Author names must be written after references, wrapped in
  parentheses and separated by commas."
- Entries should "communicate the impact of changes" rather than restate the diff.

## Its position on automation and on git log

- "Using `git log` as a changelog is a bad idea: it's full of noise."
- Against verbatim copying from pull requests, because that copies "content that was only
  meaningful to contributors to begin with."
- On Conventional Commits specifically: it argues the convention "adds cognitive overhead",
  and that effort is better spent "making changes descriptive and explaining *why* a change
  is made."
- From the FAQ: "Don't take the easy way out with full automation. This results in poor
  changelogs, defeating their purpose."

## Note on retrieval fidelity

Fetched through a summarizing reader. Quoted strings above are reported as verbatim by that
reader. The category list, ordering, and the four-versus-six category difference are
short enumerations and are high confidence.
