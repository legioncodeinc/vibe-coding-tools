# Conventional Commits, version 1.0.0

- **URL:** https://www.conventionalcommits.org/en/v1.0.0/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (the specification itself)
- **Why archived:** This is the published mapping from a commit message to a changelog
  entry and to a version bump. The skill needs it to convert observed work into commit-
  shaped and changelog-shaped output without inventing a convention.

## Current version

**1.0.0.** Licensed CC BY 3.0.

## Message structure

```
type[optional scope]: description

[optional body]

[optional footer(s)]
```

## Types

Two types are defined by the specification itself:

| Type | Meaning | SemVer effect |
|---|---|---|
| `feat` | introduces a new feature to the codebase | MINOR |
| `fix` | patches a bug in the codebase | PATCH |

Other types are permitted but are not part of the spec. The spec points at the Angular
convention as the common source of the additional set: `build`, `chore`, `ci`, `docs`,
`style`, `refactor`, `perf`, `test`.

## Scope

"A scope MAY be provided after a type. A scope MUST consist of a noun describing a section
of the codebase surrounded by parenthesis, e.g., `fix(parser):`"

## Breaking changes

A breaking change correlates with MAJOR in SemVer and is signalled either way:

1. A `!` immediately before the colon: `feat!:` or `feat(scope)!:`
2. A footer `BREAKING CHANGE: description`. `BREAKING CHANGE` must be uppercase.

## Specification rules

The spec is a numbered list of 16 requirements using RFC 2119 keywords. The substance:
commits MUST be prefixed with a type, optionally a scope, optionally `!`, then a colon and
space, then a description. A body MAY follow one blank line after the description. Footers
follow the body, one blank line after it, in a `token: value` or `token #value` form, with
hyphens replacing spaces in multi-word tokens. `BREAKING CHANGE` is the one token allowed
to contain a space, and it must be uppercase.

## Stated benefits

The spec lists these as what the convention buys:

- Automatically generating CHANGELOGs.
- Automatically determining a semantic version bump, based on the types of commits landed.
- Communicating the nature of changes to teammates, the public, and other stakeholders.
- Triggering build and publish processes.
- Making it easier for people to contribute to projects, by letting them explore a more
  structured commit history.

## What this source does not say

It does not claim that a changelog generated this way is a good changelog, and it does not
address work that never became a commit. Both gaps are relevant to this skill and are
picked up by the Common Changelog source.

## Note on retrieval fidelity

Fetched through a summarizing reader. The message grammar, the two spec-defined types,
both breaking-change signals, the scope rule, and the benefit list are high confidence. The
16 numbered rules were returned compressed rather than verbatim, so they are paraphrased
above and are not quoted.
