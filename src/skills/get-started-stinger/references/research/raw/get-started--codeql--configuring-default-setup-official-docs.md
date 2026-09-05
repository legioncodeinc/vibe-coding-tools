# Configuring default setup for code scanning
- URL: https://docs.github.com/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning
- Fetched: 2026-08-14
- Source type: official-docs
- Component: codeql

## Default setup vs advanced setup

GitHub recommends starting with **default setup**: the quickest, lowest-maintenance way to enable CodeQL code scanning — GitHub automatically chooses languages, query suite, and trigger events based on the repository's contents, with no workflow file to author or maintain. **Advanced setup** (a hand-authored workflow, typically based on the CodeQL analysis workflow template) is for cases default setup can't cover: custom build steps for compiled languages, matrix builds, or a custom analysis schedule.

## Eligibility

A repository is eligible for default setup if GitHub Actions is enabled, and the repo is either publicly visible or has GitHub Code Security enabled.

## Enabling (repository Settings flow)

Settings > Security > Advanced Security > "CodeQL analysis" > Set up > Default. This surfaces a "CodeQL default configuration" summary; optionally click Edit to add/remove analyzed languages or choose a query suite (`default` vs `security-extended`, the latter trading some precision for additional queries), then "Enable CodeQL" triggers a workflow run that tests the new auto-generated configuration.

If switching from advanced setup to default setup, GitHub warns that default setup overrides the existing configuration — it disables the existing workflow file and blocks further CodeQL API uploads from that workflow.

## Inactivity behavior

If a repository with default setup enabled has had no pushes or pull requests for 6 months, the weekly scan schedule is automatically disabled to save Actions minutes; org owners can turn on monthly scans for inactive repos at the organization level.

## Self-hosted / larger runners

Default setup can run on GitHub-hosted, self-hosted, or larger runners. Self-hosted runners need a `code-scanning` label (or a custom label configured via a security configuration) to be picked up; assigning/changing a runner after default setup is already enabled requires disabling and re-enabling default setup to pick up the new runner. A larger runner named exactly `code-scanning` is auto-labeled and becomes the one org-wide larger runner used for all code-scanning jobs within its runner group.

## Build-mode note (compiled languages)

Default setup uses `none` build mode for C/C++, C#, Java, and Rust, and `autobuild` for other compiled languages — self-hosted runners for C/C++, C#, and Swift analysis need to be able to run whatever build commands those languages require. JavaScript/TypeScript, Go, Ruby, Python, and Kotlin analysis needs no special build configuration.

## Relevance to the CI template

Default setup is a repository-Settings action, not something expressible purely as a checked-in workflow file — a `.github/workflows/codeql.yml` template (advanced setup, using the official `github/codeql-action` steps: `init` -> `autobuild`/manual build -> `analyze`) is the portable, copy-out-friendly equivalent for repos that want CodeQL wired via committed YAML rather than a Settings toggle, and it's what this skill ships in `templates/.github/workflows/codeql.yml`. The verification pass should still tell the user that enabling native "default setup" in Settings is the lower-maintenance alternative if they'd rather not maintain a workflow file for it.
