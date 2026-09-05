# 05. Commit and release hygiene

Conventional Commits, semantic versioning, Keep a Changelog, and the pre-commit hook layer that enforces the first of those automatically.

## Conventional Commits

`<type>[optional scope][!]: <description>`, then an optional body, then optional footers [raw/get-started--commits--conventional-commits-1.0.0-official.md]. The mapping that makes this worth adopting: `fix` -> SemVer PATCH, `feat` -> SemVer MINOR, a `!` before the colon or a `BREAKING CHANGE:` footer (on a commit of any type) -> SemVer MAJOR. Common types beyond `feat`/`fix`, from the Angular convention most tooling defaults to: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `revert`. `BREAKING CHANGE` as a footer token must stay uppercase; `BREAKING-CHANGE` is an accepted synonym. Teams using squash-merge don't need every contributor to follow the spec individually: the maintainer normalizes the final commit message at merge time.

`templates/CONTRIBUTING.md` documents this convention and the branch-naming pattern (`{branch_prefix}/{short-description}`) contributors should follow, per the plan-construction convention of branching off the default branch before any work starts.

## Semantic Versioning

MAJOR on incompatible API changes, MINOR on backward-compatible additions (also required when marking something deprecated), PATCH on backward-compatible bug fixes only [raw/get-started--versioning--semver-2.0.0-official.md]. `0.y.z` means initial development: nothing is considered stable yet, which is why `templates/CHANGELOG.md` seeds at `0.1.0` rather than `1.0.0`. Deprecation is a three-step procedure, not a single commit: (1) document the deprecation, (2) ship it as `Deprecated` in a minor release, (3) only `Removed` in a *later* major release: giving consumers at least one minor release of warning before anything breaks.

## Keep a Changelog

`templates/CHANGELOG.md` follows the 2.0.0 spec exactly: six change types only (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`): do not add a seventh even if a change feels like it deserves its own category [raw/get-started--changelog--keep-a-changelog-2.0.0.md]. An `Unreleased` section stays at the top always; at release time it gets renamed to a dated version (`## [x.y.z] - YYYY-MM-DD`, ISO 8601) and a fresh empty `Unreleased` is added above it. Version headings are Markdown reference links resolved at the bottom of the file to compare URLs: keep those in sync every release, or the links silently rot.

Two type-selection rules that resolve most ambiguity: if the old behavior was a bug, it's `Fixed`; if it was intentional and you're changing it, it's `Changed`. `Security` entries lead with the CVE identifier when one exists.

On automation: a language model can draft changelog entries from a diff, but "machines can draft, humans curate": never wire a changelog edit as a required CI check on every PR, since that just trains contributors to add a throwaway line to pass the gate rather than writing something a reader would actually want.

## Pre-commit hooks: husky vs lefthook

Ship husky + lint-staged as the default recommendation: it's the broadest-applicability, lowest-setup-cost combination for a JS/TS repo, and `npm install` auto-installs the hooks via husky's `prepare` script with zero onboarding friction [raw/get-started--git-hooks--husky-vs-lefthook-pkgpulse.md]. Wire it to lint and typecheck:

```bash
npm install -D husky lint-staged
npx husky init
```
```
# .husky/pre-commit
npx lint-staged
```
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

**TypeScript caveat**: do not scope `tsc --noEmit` to staged files the way lint-staged scopes ESLint: TypeScript's type graph spans the whole project, so checking only staged files produces misleading results (it misses errors from relationships between the changed file and unstaged files). Run the full-project typecheck in a `pre-push` hook instead of `pre-commit`, so contributors aren't paying full-project latency on every single commit while a push still gets blocked on real type errors.

Recommend lefthook instead when the repo is a monorepo, is polyglot (not JS/TS-only), or the team already has hook-speed complaints: it runs commands in parallel (`parallel: true`), has built-in staged-file filtering (no separate lint-staged dependency), and needs no Node.js runtime for contributors working in a different part of the repo.

## Conventional commits config

If the repo wants commit-message *enforcement*, not just convention, add `commitlint`:
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```
```js
// commitlint.config.js
export default { extends: ["@commitlint/config-conventional"] };
```
wired to a `commit-msg` hook (`npx --no -- commitlint --edit $1` under husky, or a `commitlint` command under lefthook's `commit-msg` stage). This is a recommendation to surface in the verification pass, not a file this skill ships in `templates/`, since it changes contributor workflow and should be an explicit decision rather than a silent addition.
