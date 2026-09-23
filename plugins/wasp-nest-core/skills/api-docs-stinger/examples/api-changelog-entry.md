# Example: API Changelog Entry

Before/after example for a breaking endpoint rename.

**Demonstrates:** `guides/05-changelog.md` (impact-first format, [BREAKING] convention)

---

## Scenario

The team is renaming `POST /users/invite` to `POST /invitations` in API v1.3.0 and removing the old path in v2.0.0.

## Bad changelog entry (before)

```markdown
## [1.3.0] — 2026-05-20

### Changed

- Renamed invite endpoint
- Updated user object to include `invited_at` field
```

**Problems with this entry:**
- No `[BREAKING]` tag on the rename.
- No migration guidance.
- No deprecation timeline.
- "Updated user object" is vague: is `invited_at` new (non-breaking) or replacing something?

## Good changelog entry (after)

```markdown
## [1.3.0] — 2026-05-20

### [BREAKING] POST /users/invite — Renamed to POST /invitations

**Who is affected:** Any client calling `POST /users/invite` directly.
**Migration:** Replace `POST /users/invite` with `POST /invitations`. The request body shape is identical. Update any hardcoded path strings.
**Timeline:** `POST /users/invite` will return 410 Gone after 2026-08-20 (3-month deprecation window).

### Added: `invited_at` field on User object

The `User` response object now includes an optional `invited_at: string` (ISO 8601 timestamp) when the user was created via invitation. Clients that do not use this field require no changes.

### Deprecated: POST /users/invite

See above. Use `POST /invitations` from now on.
```

## CHANGELOG.md placement

```markdown
# CHANGELOG

All notable changes to this API are documented here.
Format: [https://keepachangelog.com/en/1.0.0/]
Semantic versioning: MAJOR.MINOR.PATCH

## [Unreleased]

## [1.3.0] — 2026-05-20

### [BREAKING] POST /users/invite — Renamed to POST /invitations
...

## [1.2.1] — 2026-05-01
...
```

## Bump.sh CI comment on the PR

When configured (see `guides/05-changelog.md`), Bump.sh posts a diff comment on the PR:

```
🔴 BREAKING CHANGES detected in openapi.yaml:

  - Path removed: POST /users/invite
  + Path added: POST /invitations (identical schema)

Review the API diff: https://bump.sh/org/repo/changes/abc123
```

*References: `guides/05-changelog.md`, `research/external/bump-sh-changelog-breaking-changes.md`*
