# 05: API Changelog Discipline

Writing API changelogs that keep consumers informed. Read `research/external/bump-sh-changelog-breaking-changes.md` before running this guide.

## The [BREAKING] convention

Every change that can break an existing API consumer MUST be prefixed with `[BREAKING]`. No exceptions.

**Breaking changes include:**
- Removing a field from a response
- Renaming a path, method, or field
- Changing a field type (string → integer, optional → required)
- Removing an enum value
- Changing authentication scheme
- Removing an endpoint

**Non-breaking changes (no prefix needed):**
- Adding a new optional field to a response
- Adding a new endpoint
- Adding a new optional request parameter
- Deprecating a field (use `deprecated: true` in the spec + `[DEPRECATED]` in the changelog)

## Impact-first format

Each changelog entry follows this structure:

```markdown
## [1.2.0] — 2026-05-20

### [BREAKING] POST /users — `role` field is now required

**Who is affected:** Any client that creates users without specifying a `role`.
**Migration:** Add `"role": "viewer"` to all POST /users request bodies. `viewer` is the new default.
**Timeline:** The old behavior (defaulting to `viewer` when `role` is absent) will be supported until 2026-08-20.

### Added: GET /users/{id}/permissions

Returns the list of permissions for a specific user. No breaking changes.

### Deprecated: POST /users/invite (use POST /invitations instead)

`POST /users/invite` will be removed in v2.0.0. Migration guide: [link].
```

**Key rules:**
1. Start with impact: who is affected and what breaks.
2. Include migration steps: not just what changed, but how to fix it.
3. Include a timeline when deprecating; never silently remove without warning.

## Semantic versioning for APIs

| Change type | Version bump |
|---|---|
| Breaking change | MAJOR (1.x → 2.0) |
| New endpoint or non-breaking addition | MINOR (x.1 → x.2) |
| Bug fix, documentation, non-visible change | PATCH (x.x.1 → x.x.2) |

**Note:** Many REST APIs use date-based versioning (`/v1/`, `/2026-05-20/`) instead of semver. The `[BREAKING]` convention applies regardless of versioning scheme.

## Bump.sh CI gate

Bump.sh provides a GitHub Actions workflow that:
1. Compares the new spec against the deployed version.
2. Generates a human-readable diff.
3. Can block a PR if the diff contains breaking changes.

```yaml
# .github/workflows/api-diff.yml
name: API diff check
on: pull_request
jobs:
  diff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bump-sh/github-action@v1
        with:
          doc: YOUR_DOC_ID
          token: ${{ secrets.BUMP_TOKEN }}
          file: openapi.yaml
          command: diff
```

The diff appears as a PR comment. Configure `fail_on_breaking: true` to block merges on breaking changes.

## Changelog file placement

| Project type | Changelog location |
|---|---|
| Single-API repo | `CHANGELOG.md` in repo root |
| Monorepo with multiple APIs | `api/CHANGELOG.md` per service |
| Managed platform (Bump.sh, Mintlify) | Platform-native changelog; link from `CHANGELOG.md` |

*Source: `research/external/bump-sh-changelog-breaking-changes.md`*
