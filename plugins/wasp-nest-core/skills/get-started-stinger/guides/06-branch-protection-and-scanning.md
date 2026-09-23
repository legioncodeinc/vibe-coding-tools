# 06. Branch protection and scanning

Everything in this guide is a GitHub Settings action requiring admin access: none of it is a file this skill can copy into place. Its job here is to hand the user a precise, prioritized checklist, grounded in the research, for the verification pass to surface.

## Branch protection: rulesets vs classic rules

Recommend rulesets over classic branch protection rules for new setups: they support multiple simultaneous rulesets per branch (classic allows only one active rule), can be toggled Active/Disabled without deletion, are visible to any read-access collaborator (classic needs admin to even view), and can govern commit metadata like message format [raw/get-started--branch-protection--about-rulesets-official-docs.md]. If classic rules already exist, they don't need to be torn out: rulesets layer with them, and where the same rule is expressed differently across sources, the most restrictive version wins automatically.

Minimum recommended ruleset for the default branch:
- Require a pull request before merging (no direct pushes).
- Require the CI workflow's status checks to pass (`lint`, `typecheck`, `test` from `templates/.github/workflows/ci.yml`).
- Require review from Code Owners (activates the CODEOWNERS file from guide `02`).
- Require branches to be up to date before merging.
- Block force pushes.

## CODEOWNERS activation

CODEOWNERS does nothing on its own: "Require review from Code Owners" must be turned on in the branch protection rule or ruleset for it to gate merges [raw/get-started--codeowners--about-code-owners-official-docs.md]. This is the single most common reason a freshly copied CODEOWNERS file has zero effect: the file exists, but nothing references it.

## Secret scanning and push protection

Covered in depth in guide `04`; the verification-pass action items are: enable GitHub Secret Protection, then enable Push Protection, both under Settings > Advanced Security (requires admin/owner/security-manager). Note in the report whether the `.gitignore`'s `.env.*` exclusion (the file-level layer) is already in place: a repo with both layers is meaningfully safer than one with either alone.

## CodeQL / code scanning

Two paths, name both in the verification report and let the user pick:
- **Native default setup** (recommended by GitHub itself): Settings > Advanced Security > CodeQL analysis > Set up > Default. Zero-maintenance, GitHub auto-selects languages and query suite, needs no workflow file [raw/get-started--codeql--configuring-default-setup-official-docs.md].
- **Advanced setup via the committed workflow**: `templates/.github/workflows/codeql.yml`, already copied out in stage 02 if the user asked for it. Necessary when a plan/visibility combination doesn't support default setup, or the team wants the scan configuration versioned and reviewable as code.

If both exist on a repo simultaneously, note that switching *to* default setup from an existing advanced-setup workflow disables the old workflow file automatically: flag this rather than letting a user discover it after enabling default setup and wondering why their workflow stopped running.

## Repository visibility and community profile

The GitHub community profile checklist (`GET /repos/{owner}/{repo}/community/profile`) is a mechanical, API-verifiable score of exactly the files this skill copies: README, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, issue templates, PR template [raw/get-started--repo-health--community-profiles-official-docs.md]. This skill does not ship a `CODE_OF_CONDUCT.md` template (out of the explicit template list for this skill): note its absence in the verification pass as a gap the user can close with GitHub's own "Add" flow on the community profile page, or hand off to a project that wants one.
