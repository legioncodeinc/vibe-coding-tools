# Contributing to {project_name}

Thanks for putting in the work to improve this project. This document covers what a contributor needs before opening a pull request.

## Before you start

- {If there's a CLA, contributor agreement, or issue-first policy, state it here. Delete this section if there's none.}
- Search open issues and pull requests before starting substantial work, so two people don't build the same thing.

## Development setup

```bash
git clone {repo_url}
cd {project_name}
{install_command}
```

See the [README](./README.md#development) for the full local dev setup.

## Branching and commits

- Branch off `{default_branch}` for every change. Name branches `{branch_prefix}/{short-description}` (e.g. `feat/add-search-filter`).
- Write commit messages in [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format: `<type>[optional scope]: <description>`. Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.
- Mark breaking changes with `!` before the colon (`feat!: ...`) or a `BREAKING CHANGE:` footer.
- Keep commits focused. If a commit conforms to more than one type, split it.

## Before opening a pull request

Run the full local gate:

```bash
{lint_command}
{typecheck_command}
{test_command}
```

All three must pass. The pull request template will ask you to confirm this.

## Pull requests

- Fill out every section of the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md).
- Keep pull requests small and single-purpose. A PR that does three unrelated things is three PRs.
- Link the issue it closes, if any.
- Expect review comments to land in the blocker / suggestion / nit taxonomy; only blockers must be resolved before merge.

## Code review

- CODEOWNERS are requested automatically for files they own; wait for their approval on those paths.
- Address review feedback with new commits rather than force-pushing over history mid-review, so reviewers can see what changed.

## Reporting bugs and requesting features

Use the [issue templates](./.github/ISSUE_TEMPLATE/). Do not report security vulnerabilities as public issues: see [SECURITY.md](./SECURITY.md).

## Release process

{Describe how a merged PR becomes a release: who cuts it, what triggers a version bump, where CHANGELOG.md gets updated. See CHANGELOG.md for the format.}

## Questions

{Where to ask: a Discussions tab, a chat channel, an email alias. Fill this in or delete the section.}
