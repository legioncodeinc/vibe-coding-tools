# Keep a Changelog, version 1.1.0

- **URL:** https://keepachangelog.com/en/1.1.0/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (the specification itself, not a summary of it)
- **Why archived:** This is the format the skill's changelog block must emit. Archiving the
  spec rather than a blog post about it means the category names, the ordering rules, and
  the date format in the skill are the spec's, not a paraphrase.

## Current version

**1.1.0.** The site presents 1.1.0 as the current specification. Earlier versions 1.0.0,
0.3.0, 0.2.0, 0.1.0 remain published at their own paths. The change from 1.0.0 to 1.1.0 is
described as refinement of the existing principles plus expanded translation coverage
rather than a change to the category set.

## Guiding principles, as stated

- "Changelogs are *for humans*, not machines."
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.
- Mention whether you follow Semantic Versioning.

## The six change types

The spec defines exactly six group headings:

| Heading | Meaning as given |
|---|---|
| `Added` | for new features |
| `Changed` | for changes in existing functionality |
| `Deprecated` | for soon to be removed features |
| `Removed` | for now removed features |
| `Fixed` | for any bug fixes |
| `Security` | in case of vulnerabilities |

## The Unreleased section

Keep an `Unreleased` section at the top of the file. Two stated reasons:

1. People can see what changes they might expect in upcoming releases.
2. At release time, the contents of `Unreleased` are moved into a new version section,
   which makes cutting a release cheap.

## Dates and versions

- Dates use ISO 8601, `YYYY-MM-DD`. The reason given is that other formats are
  regionally ambiguous, so a reader cannot tell month from day.
- Adherence to Semantic Versioning is recommended and should be stated in the file.

## Bad practices the spec names

**Commit log diffs.** Using a raw `git log` dump as a changelog is called out as a bad
practice. The stated reason is noise: merge commits, commits with unclear titles,
documentation changes, and other traffic that is not a user-visible change.

**Ignoring deprecations.** When moving between versions, a reader should be able to find
out what was deprecated so they can migrate incrementally rather than hitting a wall at
the next major version.

**Confusing dates.** Regional date formats are ambiguous. ISO 8601 removes the ambiguity.

**Inconsistent changes.** Selective documentation, where some changes get an entry and
some do not, destroys the changelog's status as the authoritative record of what changed.

## Structural shape of a file

```
# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog,
and this project adheres to Semantic Versioning.

## [Unreleased]

## [1.1.0] - 2026-08-17

### Added

- A thing that is new.

### Fixed

- A thing that was broken.
```

## Note on retrieval fidelity

Fetched through a summarizing reader. The category names, the principle list, the ISO 8601
rule, the Unreleased rule, and the four named bad practices are recorded above with high
confidence because they are short enumerations. Longer verbatim passages from the spec
body were not preserved in full and are not quoted here as verbatim beyond the short
phrases shown in quotation marks.
