# Conventional Commits 1.0.0
- URL: https://www.conventionalcommits.org/en/v1.0.0/
- Fetched: 2026-08-14
- Source type: official-spec
- Component: commits

## Summary

A lightweight convention on top of commit messages for an explicit, tool-friendly commit history. Dovetails with SemVer by describing features/fixes/breaking changes in the message itself.

## Message structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Structural elements

1. `fix:` — patches a bug (correlates with SemVer PATCH).
2. `feat:` — introduces a new feature (correlates with SemVer MINOR).
3. `BREAKING CHANGE:` footer, or a `!` right before the colon in the type/scope prefix — introduces a breaking API change (correlates with SemVer MAJOR); can attach to a commit of any type.
4. Other types are allowed and not mandated by the spec; `@commitlint/config-conventional` (Angular convention) recommends `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, and others.
5. A scope in parentheses adds context: `feat(parser): add ability to parse arrays`.

## Examples

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```
```
feat!: send an email to the customer when a product is shipped
```
```
feat(api)!: send an email to the customer when a product is shipped
```
```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Reviewed-by: Z
Refs: #123
```

## Full normative rules (RFC 2119 keywords)

1. Commits MUST be prefixed with a type (noun) + optional scope + optional `!` + required `: `.
2. `feat` MUST be used for a new feature.
3. `fix` MUST be used for a bug fix.
4. Scope MAY be provided, in parentheses, naming a codebase section.
5. Description MUST immediately follow `: `.
6. A longer body MAY follow, separated by one blank line.
7. Body is free-form, any number of paragraphs.
8. One or more footers MAY follow the body after one blank line; each footer is `token: value` or `token #value` (git trailer convention).
9. Footer tokens use `-` instead of whitespace (e.g. `Acked-by`), except `BREAKING CHANGE` which may keep its space.
10. A footer value MAY contain spaces/newlines; parsing terminates at the next valid token/separator pair.
11. Breaking changes MUST be indicated either in the type/scope prefix (`!`) or as a footer.
12. Footer form: `BREAKING CHANGE: <description>` (uppercase, mandatory casing).
13. Prefix form: `!` immediately before the colon; if used, the footer MAY be omitted and the description itself explains the break.
14. Types other than `feat`/`fix` MAY be used.
15. Type/scope/footer tokens are case-insensitive except `BREAKING CHANGE`, which MUST be uppercase.
16. `BREAKING-CHANGE` (hyphenated) MUST be treated as synonymous with `BREAKING CHANGE` as a footer token.

## Why use it

Automatic CHANGELOG generation; automatic semantic version bump determination from commit types landed since the last release; clearer communication of change nature to teammates/public/stakeholders; triggering build/publish automation; a more structured, explorable commit history for contributors.

## SemVer mapping (explicit FAQ answer)

`fix` type commits -> PATCH release. `feat` type commits -> MINOR release. Any commit carrying `BREAKING CHANGE` (regardless of its own type) -> MAJOR release.

## Team-adoption note

Contributors do not all need to follow the spec personally if the team uses a squash-merge workflow — the lead maintainer can normalize the squashed commit message at merge time, adding no burden to casual committers.
