# Distilled research: get-started-stinger

Dense reference for repository initialization and hardening. Every claim cites its raw source in `raw/`. Fetched 2026-08-14, research window: last 6 months preferred, official specs/docs any date.

---

## 1. GitHub Actions CI security

Default `GITHUB_TOKEN` permissions are broad (often read-write) unless overridden; any user with write access can read every repo secret, so the whole security model rests on scoping tokens down [raw/get-started--ci-security--actions-secure-use-official-docs.md]. Practical baseline: declare `permissions: read-all` (or `{}`) at the workflow level, then grant each job only what it needs: start at `{}` and add scopes until the job passes [raw/get-started--ci-security--secure-pipelines-cheat-sheet.md]. Repo owners should also flip Settings > Actions > General > Workflow permissions to "Read repository contents and packages permissions" so any workflow omitting a `permissions:` block still defaults to read-only [raw/get-started--ci-security--secure-pipelines-cheat-sheet.md].

**Action pinning**: tags are mutable Git refs and can be force-moved by a compromised maintainer; pin third-party actions to a full 40-character commit SHA with a trailing version comment (`uses: owner/action@<sha> # v4.1.1`). This is the only immutable reference. Dependabot's `github-actions` ecosystem understands SHA pins and proposes both the SHA and the comment update in one PR [raw/get-started--ci-security--actions-secure-use-official-docs.md; raw/get-started--ci-security--secure-pipelines-cheat-sheet.md].

**OIDC**: exchange a short-lived `id-token: write` JWT for cloud credentials instead of storing static cloud secrets; narrow the cloud-side trust policy to the exact repo/branch/environment [raw/get-started--ci-security--secure-pipelines-cheat-sheet.md; raw/get-started--ci-security--actions-secure-use-official-docs.md].

**Script injection**: never interpolate untrusted context values (PR titles, issue bodies) directly into `run:` shell blocks. Route them through an `env:` variable or pass them as an action `with:` input instead [raw/get-started--ci-security--actions-secure-use-official-docs.md; raw/get-started--ci-security--secure-pipelines-cheat-sheet.md].

**Untrusted checkout**: avoid `pull_request_target`/`workflow_run` combined with checking out fork content: this is the "pwn request" repository-takeover vector; prefer `workflow_run` over `pull_request_target` when privilege separation is needed at all [raw/get-started--ci-security--actions-secure-use-official-docs.md].

## 2. Repository health / community standards

GitHub's community profile checklist mechanically scores a repo's `health_percentage` against presence of: README, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY.md, issue templates, PR template: recognized in `.github/`, repo root, or `docs/` (issue templates only in `.github/ISSUE_TEMPLATE/`, checked via `name:`+`about:`/`description:` frontmatter) [raw/get-started--repo-health--community-profiles-official-docs.md]. This is the concrete, API-verifiable definition of "healthy baseline" this skill targets: `GET /repos/{owner}/{repo}/community/profile` is the verification endpoint.

## 3. CODEOWNERS

File lives in `.github/`, root, or `docs/`, in that search-and-use-first-found order; owners must hold `write` access. Pattern syntax mirrors `.gitignore` **except**: `\#` comment-escaping, `!` negation, and `[ ]` character ranges do not work in CODEOWNERS [raw/get-started--codeowners--about-code-owners-official-docs.md]. Multiple owners for one pattern must share a line or only the last owner applies; later patterns override earlier ones (last-match-wins). Files over 3 MB are silently not loaded: use wildcards to consolidate. To fully lock down ownership changes themselves, explicitly own the CODEOWNERS file: `/.github/CODEOWNERS @owner` or `/.github/ @owner` [raw/get-started--codeowners--about-code-owners-official-docs.md].

## 4. Branch protection: rulesets vs classic rules

Rulesets are the modern mechanism and layer with (don't replace) classic branch protection rules: when both target a branch, all rules from every source aggregate, and where the same rule differs across sources, the **most restrictive version wins** [raw/get-started--branch-protection--about-rulesets-official-docs.md]. Rulesets add: multiple simultaneous rulesets per branch (classic allows only one), toggleable enforcement without deletion, visibility to any read-access collaborator (classic requires admin), and control over commit metadata (message format, author email pattern). Push rulesets (separate from branch/tag rulesets) block pushes repo-wide by file path/extension/size and propagate through the entire fork network. Enabling rulesets/branch protection is a Settings action requiring admin access: out of scope for a file-copy skill; the skill's job is to *recommend* the configuration (PR review required, status checks required, CODEOWNERS review required) as a human-decision step [raw/get-started--branch-protection--about-rulesets-official-docs.md].

## 5. Dependabot vs Renovate

| Dimension | Dependabot | Renovate |
|---|---|---|
| Config | `.github/dependabot.yml` only | `renovate.json`/`.json5`/`.renovaterc`, shareable presets via `extends` |
| Setup | File presence enables it | Requires the Mend GitHub App (or self-host) + config |
| Package managers | ~30 | 90+ |
| Grouping | Per-ecosystem `groups` (patterns/dependency-type/update-types) | `packageRules`, cross-ecosystem, far more granular |
| Scheduling | `interval` keyword + day/time | Cron-like natural-language DSL, timezone-aware, separate `automergeSchedule` |
| Monorepo | `directories` array (2024+), no workspace awareness | Workspace-aware (npm/pnpm/yarn) |
| Automerge | None native, wire via Actions + `dependabot/fetch-metadata` | Built in (`automerge: true`) |
| Security updates | Built-in "Dependabot Security Updates," separate from version updates, GitHub Advisories only, ignores schedule/limits | `vulnerabilityAlerts`, reads GH Advisories + OSV |
[raw/get-started--dependency-updates--dependabot-vs-renovate-jsonic.md]

Running both as general updaters on one repo causes duplicate PRs and lockfile conflicts; the one supported hybrid is Dependabot Security Updates only + Renovate for routine bumps [raw/get-started--dependency-updates--dependabot-vs-renovate-jsonic.md]. **Decision for this skill's template**: ship `dependabot.yml` as the default (zero external app install, GitHub-native, matches "minimum decisions to reach a healthy baseline"); document Renovate as the swap-in for monorepos/multi-platform needs in the guide rather than shipping both configs.

## 6. Secret scanning and push protection

Push protection blocks a push containing a detected secret *before* it lands, across CLI, UI commits, uploads, REST API, and the GitHub MCP server (public repos) [raw/get-started--secret-scanning--push-protection-official-docs.md]. Two independent layers exist: push protection *for repositories* (opt-in, requires Secret Protection enabled, needs admin/security-manager/owner to turn on) and push protection *for users* (on by default GitHub-account-wide, public repos only, silent unless repo-level protection is also on). Bypass requires a stated reason (`used in tests` / `false positive` / `I'll fix it later`), each with different alert-closing behavior, and every bypass writes to the audit log and emails watchers [raw/get-started--secret-scanning--push-protection-official-docs.md]. Enabling this is a Settings action, not file-copyable: the skill documents it as a required human step alongside `.gitignore`'s `.env*` exclusion, which is the file-level first layer of the same defense.

## 7. CodeQL / code scanning

**Default setup** (Settings-driven, zero workflow file, GitHub auto-selects languages/query-suite/triggers) is GitHub's own recommended starting point over **advanced setup** (hand-authored workflow) [raw/get-started--codeql--configuring-default-setup-official-docs.md]. Eligibility: Actions enabled, and repo is public or has GitHub Code Security enabled. Query suites: `default` (precision-tuned) vs `security-extended` (more queries, some precision cost). Because default setup is a Settings toggle and this skill's payload is committed files, the template ships an advanced-setup-style `codeql.yml` workflow (using `github/codeql-action`'s `init`/`autobuild`/`analyze` steps) as the portable equivalent, while the guide tells the user that native default setup is the lower-maintenance alternative if they'd rather not maintain the YAML.

## 8. Keep a Changelog 2.0.0

Six change types only, deliberately no more: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`: the spec explicitly refuses a seventh category (e.g. no separate "Dependencies"/"Performance" type) [raw/get-started--changelog--keep-a-changelog-2.0.0.md]. `Fixed` = behavior was wrong and is now correct; `Changed` = behavior was intentional and now differs; `Security` entries lead with a CVE id when one exists. Keep an `Unreleased` section at the top always; at release time rename it to a dated version (`## [1.0.0] - 2017-07-17`, ISO 8601) and start a fresh empty `Unreleased`. Version headings are Markdown reference links resolved at the file's bottom to compare URLs. SemVer is *not* mandatory as of 2.0.0 (calendar versioning etc. also qualify) but the file must state which scheme is used. Mark breaking changes in place inside `Changed`/`Removed` with a `**Breaking:**` prefix rather than a separate section. 2.0.0's new guidance on LLM-drafted entries: "machines can draft, humans curate": never let a changelog edit become a required CI check on every PR, since that just fills the file with noise to pass the gate [raw/get-started--changelog--keep-a-changelog-2.0.0.md].

## 9. Semantic Versioning 2.0.0

`MAJOR.MINOR.PATCH`: MAJOR on incompatible API changes, MINOR on backward-compatible additions (also required when deprecating something), PATCH on backward-compatible bug fixes only. `0.y.z` is initial development, API not considered stable, anything may change. Deprecation procedure: (1) document it, (2) ship it as `Deprecated` in a minor release, (3) `Removed` no earlier than the next major: giving consumers at least one minor release of warning [raw/get-started--versioning--semver-2.0.0-official.md]. Once released, a version's contents must never change; a mistaken breaking change shipped as minor gets fixed forward with a new minor release restoring compatibility, never a retroactive edit.

## 10. Conventional Commits 1.0.0

`<type>[optional scope][!]: <description>` then optional body then optional footers. `fix` -> SemVer PATCH, `feat` -> SemVer MINOR, `BREAKING CHANGE:` footer or `!` before the colon -> SemVer MAJOR (can attach to any type) [raw/get-started--commits--conventional-commits-1.0.0-official.md]. `@commitlint/config-conventional` (Angular convention) types beyond `feat`/`fix`: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `revert`. `BREAKING CHANGE` (footer token) must stay uppercase; `BREAKING-CHANGE` is a synonym. Squash-merge workflows let a lead maintainer normalize the final commit message, so contributors don't individually need to follow the spec.

## 11. Husky vs lefthook

husky (~5M weekly downloads) + lint-staged (~8M) is the current industry-standard combo for JS/TS-only repos: simple `.husky/` shell scripts, `prepare` script auto-installs hooks on `npm install`, sequential execution [raw/get-started--git-hooks--husky-vs-lefthook-pkgpulse.md]. lefthook (~400K weekly downloads, Go binary, no Node runtime) runs hook commands in parallel (`parallel: true`), has built-in staged-file filtering (`{staged_files}` + `glob:`, no separate lint-staged needed), and first-class monorepo scoping (`root:`). Cross-source consensus: TypeScript type-checking cannot be scoped to staged files the way ESLint can (the type graph spans the whole project), so `tsc --noEmit` should run on the full project, ideally in a pre-push hook rather than pre-commit, to avoid paying full-project latency on every commit. **Decision for this skill**: ship husky + lint-staged as the default template (broadest applicability, matches "minimum decisions"), name lefthook in the guide as the swap for monorepos/polyglot repos/perf-sensitive teams.

## 12. `.gitignore` for TypeScript/Node

`github/gitignore`'s own `Node.gitignore` is the canonical root template: logs, `node_modules/`, coverage output, `.npm`/`.eslintcache` caches, `.env` and its `.local`/`.development.local`/`.test.local`/`.production.local` variants, framework build dirs (`.next`, `.nuxt`, `.cache`, `.parcel-cache`, `.serverless/`), and yarn v2 state (`.yarn/cache`, `.pnp.*`) [raw/get-started--gitignore--github-gitignore-node-template.md]. TypeScript adds `*.tsbuildinfo` (machine-specific incremental-build cache) and compiled output dirs (`dist/`, `build/`, `out/`), which are fully reproducible from source and should never be committed. `.gitignore` itself must be committed so every collaborator shares the same rules; it does not retroactively untrack an already-committed file (`git rm --cached` is required for that). This skill's template negates `.env.example` explicitly (`!.env.example`) since that file is meant to be committed as documentation, while every other `.env*` variant stays ignored.

## 13. README structure

Canonical, decreasing-urgency order: project name + one-sentence description, visual/demo, why/features, installation (exact copy-paste command, prerequisites stated immediately above it, tested on a clean machine), quick-start usage (smallest working example, time-to-first-success in seconds), deeper usage/configuration, contributing, license, acknowledgements/support [raw/get-started--readme--how-to-write-a-github-readme-repoclip.md]. Badge discipline: 3-5 meaningful badges (build, version, license, coverage/downloads), never a wall of them: a badge that's always green or always broken conveys nothing. A missing/ambiguous license legally defaults to "all rights reserved," blocking corporate adoption. Five named failure modes: burying the value prop under a TOC/badge wall, text-only with no visual, an install command that fails on clean state, describing rather than showing features, and a README that drifted from the shipped version.

## 14. SECURITY.md and disclosure policy

GitHub checks `SECURITY.md` (root), `docs/SECURITY.md`, `.github/SECURITY.md` in that order, with an org-level `.github`-repo fallback [raw/get-started--security-policy--effective-security-policy-tenthirtyam.md]. A good policy answers five questions: which versions are supported, how to report privately, what the report should contain, what to expect after reporting, and which channels are explicitly wrong (public issues/PRs). It is explicitly scoped as an intake/expectation document, not a full incident-response plan. Baseline shape: supported-versions table, then a reporting section stating one primary private channel (GitHub Private Vulnerability Reporting is preferred when the repo already uses GitHub security tooling) with at most one monitored fallback (a security email alias), required report contents, a response-time commitment (e.g. 3 business days to acknowledge), and a short disclosure-approach paragraph (GHSA publication, coordinated timing). If the policy names GitHub's private reporting flow, that feature must actually be enabled on the repo before publishing the file.

## 15. Cross-cutting synthesis for the templates

- **Copy-out idempotency** (guides §01) follows directly from the community-profile scoring model (§2): the skill's job is to raise `health_percentage`-equivalent coverage without silently overwriting a maintainer's existing customized file.
- **CI template** ships least-privilege permissions blocks, SHA-pin comments as a convention (actual SHAs must be resolved per-repo since they're commit-specific and this template can't call the GitHub API), and a CodeQL advanced-setup workflow as the portable equivalent to Settings-driven default setup.
- **Dependency automation, commit hygiene, and git hooks** all default to the lower-setup-cost option (Dependabot, Conventional Commits + commitlint, husky + lint-staged) with the higher-configurability alternative (Renovate, lefthook) named in guides rather than shipped twice.
- **Everything requiring GitHub Settings/admin access** (push protection, secret scanning, branch protection/rulesets, CodeQL default setup, repository visibility) is out of file-copy scope by definition and belongs in the verification pass as a "still needs a human decision" item, not a template file.
