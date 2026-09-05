# About code owners
- URL: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- Fetched: 2026-08-14
- Source type: official-docs
- Component: codeowners

## What CODEOWNERS does

Named individuals or teams (via `CODEOWNERS`) are automatically requested as reviewers when a PR touches code they own. They must have `write` access to the repository; if the owner is a team, the team itself must be visible and hold `write` access, even if every member already has access some other way. Draft PRs do not trigger review requests; marking a draft "ready for review" does.

## File location and precedence

Create `CODEOWNERS` in `.github/`, the repository root, or `docs/`. If more than one exists, GitHub uses the first found in that exact order (`.github/` > root > `docs/`). Each `CODEOWNERS` file governs a single branch — different branches can have different owners (e.g. a `gh-pages` branch with different owners than the default branch). For code owners to be requested, the file must exist on the pull request's **base** branch.

## Fork behavior

Review requests use the `CODEOWNERS` file from the PR's base branch. If the base branch lives upstream, the upstream file governs; if the base branch is inside the fork itself, code owners are only requested if they hold `write` access to the fork specifically.

## Size limit

`CODEOWNERS` files over 3 MB are not loaded at all — no code-owner data is shown and no reviewers are requested. Use wildcard patterns to consolidate entries instead of enumerating paths.

## Syntax

Patterns follow most `gitignore` pattern rules, followed by one or more `@username` or `@org/team-name` owners. Three `gitignore` behaviors explicitly **do not work** in `CODEOWNERS`:
- Escaping a leading `#` with `\` to treat it as a pattern rather than a comment.
- `!` negation.
- `[ ]` character-range definitions.

Multiple owners for one pattern must be on the same line, or only the last-mentioned owner is applied. Email addresses are accepted as an alternative to usernames (not for managed user accounts). Paths are case-sensitive because GitHub evaluates them on a case-sensitive backend, even from case-insensitive client filesystems like macOS. Invalid lines are skipped silently (surfaced as errors in the UI and via the REST "list CODEOWNERS errors" endpoint) — later matching patterns take precedence over earlier ones, same as `.gitignore`.

Example structure:

```text
# Global default owners
*       @global-owner1 @global-owner2

# Only @js-owner reviews .js changes (overrides the global default)
*.js    @js-owner #inline comment allowed

# Email works too
*.go docs@example.com

# Team ownership
*.txt @octo-org/octocats

# Directory ownership (with and without trailing slash — both recurse)
/build/logs/ @doctocat
apps/ @octocat

# Carve-out: /apps/github has no owner line of its own, so it falls back
# to "any repo collaborator with write access" instead of @octocat
/apps/ @octocat
/apps/github
```

## CODEOWNERS + branch protection

Enable "Require review from Code Owners" on a branch protection rule (or ruleset) to force code-owner review before merge. When multiple owners cover the same pattern, approval from **any one** of them satisfies the requirement — not all of them. To fully protect a repo against unauthorized changes to ownership itself, define an explicit owner for the `CODEOWNERS` file (or its whole directory) — most securely as `/.github/CODEOWNERS @owner_username` or `/.github/ @owner_username`.

Rulesets are called out as the modern alternative to classic branch protection rules: they support layering (multiple rulesets can target the same branch simultaneously, unlike branch protection rules) and don't require admin access to view.
