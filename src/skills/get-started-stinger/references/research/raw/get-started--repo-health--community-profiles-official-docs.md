# About community profiles for public repositories
- URL: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories
- Fetched: 2026-08-14
- Source type: official-docs
- Component: repo-health

GitHub's community profile checklist checks whether a public repository includes the recommended community health files: README, CODE_OF_CONDUCT, LICENSE, CONTRIBUTING, plus issue/PR templates and a security policy. Maintainers see an "Added" (green check) or "Not added yet" (orange circle) badge per file, with an **Add** button to draft a missing one directly from the checklist UI. Contributors see the same checklist with a **Propose** button.

## Supported file locations

Files are recognized in the `.github/` folder, the repository root, or the `docs/` folder, in that search order — except issue templates and their `config.yml`, which must live specifically in `.github/ISSUE_TEMPLATE/`.

## Issue template validity

To count as "Added" in the checklist, issue templates must sit in `.github/ISSUE_TEMPLATE/` and declare valid frontmatter:
- Markdown-based templates (`.md`): valid `name:` and `about:` keys.
- YAML issue forms (`.yml`): valid `name:` and `description:` keys.

## Security policy

A `SECURITY.md` counts toward the community profile and is added the same way as other health files — see "Adding a security policy to your repository."

## REST API: community profile metrics

`GET /repos/{owner}/{repo}/community/profile` returns a `health_percentage` (percentage of recommended files present), plus booleans/objects for `code_of_conduct`, `contributing`, `readme`, `issue_template`, `pull_request_template`, `license`, and `description`/`documentation` presence. `content_reports_enabled` is organization-repo-only. This is the mechanical definition of "repo health" GitHub itself scores against, and is a useful verification target for an initialization skill: after copying files out, the community profile score should visibly improve.

## Related: default community health files

An account or organization can define default health files (e.g. CONTRIBUTING.md, CODE_OF_CONDUCT.md) in a public repository named `.github`, owned by that account. GitHub falls back to those defaults for any owned repository that lacks its own copy of that file type, checked in the same location order (`.github` repo's own `.github/` folder, then its root, then its `docs/` folder). This is an org-wide alternative to copying files into every repo individually, but a per-repo copy always takes precedence when present.
