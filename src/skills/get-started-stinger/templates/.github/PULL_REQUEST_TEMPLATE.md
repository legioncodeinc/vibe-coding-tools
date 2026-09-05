<!--
Fill every section. Delete this comment block before opening the PR.
Reference: raw/get-started--repo-health--community-profiles-official-docs.md,
raw/get-started--commits--conventional-commits-1.0.0-official.md
-->

## What

{One or two sentences describing the change. Not the how, the what.}

## Why

{The problem this solves or the request it satisfies. Link the issue: Closes #{issue_number}}

## How

{Notable implementation decisions a reviewer needs to know before reading the diff. Skip this section if the diff speaks for itself.}

## Type of change

- [ ] `feat`: new feature
- [ ] `fix`: bug fix
- [ ] `docs`: documentation only
- [ ] `refactor`: no behavior change
- [ ] `test`: test-only change
- [ ] `chore` / `ci`: tooling, build, or CI change
- [ ] Breaking change (see Conventional Commits `!` / `BREAKING CHANGE:` footer)

## Testing

{How this was verified: commands run, scenarios covered, screenshots for UI changes.}

## Checklist

- [ ] I ran the lint, typecheck, and test commands locally and they pass
- [ ] I updated `CHANGELOG.md` under `Unreleased` if this is a notable change
- [ ] I updated documentation (README, guides) if behavior or setup changed
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [ ] No secrets, credentials, or `.env` values are included in this diff
