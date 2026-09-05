# GitHub Repository Health Audit Report: PR #9 merge gate

**Repository:** `legioncodeinc/vibe-coding-tools`
**Audit date:** 2026-09-03
**Data collection mode:** Local clone plus authenticated `gh` CLI and GitHub REST API with `repo`, `workflow`, and `read:org` scopes
**Coverage gaps:** None for the eight scored dimensions. GitHub returned current repository settings, rulesets, branch protection, and security configuration.
**Audited by:** Codex orchestrator using `github-repo-health-stinger`

## Gate disposition

**PASS WITH REPOSITORY BASELINE FINDINGS.** PR #9 completed Security and independent Quality before this audit. Its prospective tree has no unresolved conflict, unstaged file, untracked file, or whitespace error. The findings below are existing repository-governance gaps rather than regressions introduced by the Rust and Beekeeper work. The user explicitly authorized the merge after the gates complete.

## Overall score: 17/100

| # | Dimension | Raw score | Weight | Weighted points |
|---|---|---|---|---|
| 1 | Branch protection and rulesets | 2/10 | 20% | 4.0 |
| 2 | Commit quality | 0/10 | 15% | 0.0 |
| 3 | CODEOWNERS coverage | 0/10 | 15% | 0.0 |
| 4 | CI workflow density | 0/10 | 15% | 0.0 |
| 5 | Docs presence | 4/10 | 10% | 4.0 |
| 6 | Repository settings | 5/10 | 10% | 5.0 |
| 7 | Issue and pull request templates | 0/10 | 8% | 0.0 |
| 8 | `.gitignore` coverage | 6/10 | 7% | 4.2 |
| | **Total** | | | **17.2, rounded to 17** |

## Branching strategy

**Observed strategy:** GitHub Flow. Feature branches target `main` through pull requests, and there is no `develop`, `release`, or `hotfix` branch family.

**Documented strategy:** No `CONTRIBUTING.md` or branching guide exists.

**Branch inventory:** The repository has two branches, `main` and `legion/restore-brand-and-codex-skills`. The secondary branch was last updated on 2026-08-14, fewer than 30 days before this audit. PR #9 is the only open pull request and was opened on 2026-08-17.

**Assessment:** The observed flow is simple and appropriate for the repository, but it is not documented or enforced.

## Branch protection and rulesets: 2/10

GitHub returned no repository rulesets, no active rules for `main`, and `404 Branch not protected` for the legacy protection endpoint.

| Rule | Status |
|---|---|
| Pull request required | Disabled |
| Required status checks | Disabled |
| Force push blocked | Disabled |
| Stale reviews dismissed | Disabled |
| Linear history required | Disabled |
| Signed commits required | Disabled |

Recommendation: create an active `main` ruleset in [Settings, Rules, Rulesets](https://github.com/legioncodeinc/vibe-coding-tools/settings/rules). Require pull requests and at least one review immediately. Add required status checks after CI exists, and block force pushes and branch deletion.

## Commit quality: 0/10

| Metric | Value |
|---|---|
| Sample | All 34 commits reachable from `origin/main` |
| Conventional Commit subjects | 2 of 34, 5.9% |
| Average subject length | 61.2 characters |
| Exact one-word generic subjects | 0 |
| Commit linting | Not configured |

Recommendation: document Conventional Commits in a contribution guide and validate pull request titles. Do not rewrite the existing public history.

## CODEOWNERS: 0/10

No `CODEOWNERS`, `.github/CODEOWNERS`, or `docs/CODEOWNERS` file exists, so coverage is 0%.

Recommendation: add `.github/CODEOWNERS` with durable organization or team ownership for the default catch-all and explicit coverage for `.claude/`, `.agents/`, `.codex/`, `.cursor/`, `learn/scripts/`, `learn/packages/`, and `.github/`.

## CI workflow density: 0/10

No `.github/workflows/` directory exists. Pull requests have no repository-owned link, component, plugin, generated-parity, package, or secret-scanning check. PR #9's only displayed external status is CodeRabbit, whose review was skipped because the pull request exceeded its file limit.

Handoff: `ci-release-worker-bee` should design a pull request workflow around the repository's existing deterministic validators. The workflow should become a required check in the future `main` ruleset.

## Docs presence: 4/10

| File | Present | Notes |
|---|---|---|
| `README.md` | Yes | Includes value, setup, harness usage, and learning links |
| `LICENSE.md` | Yes | MIT text; GitHub API currently reports `NOASSERTION` |
| `CONTRIBUTING.md` | No | Missing |
| `SECURITY.md` | No | Missing responsible-disclosure instructions |
| `CODE_OF_CONDUCT.md` | No | Missing |
| `SUPPORT.md` | No | Missing |
| `CHANGELOG.md` | No | Missing |

Recommendation: add community-health files under `.github/` so the repository can preserve its intentionally small set of human-facing root documents.

## Repository settings: 5/10

| Setting | Status |
|---|---|
| Delete head branches after merge | Enabled |
| Merge commits | Enabled |
| Squash merge | Enabled |
| Rebase merge | Enabled |
| Auto-merge | Enabled |
| Always suggest updating branches | Disabled |
| Secret scanning | Disabled |
| Push protection | Disabled |
| Secret validity checks | Disabled |
| Dependabot alerts | Enabled |
| Dependabot security updates | Disabled |

Recommendation: enable secret scanning, push protection, validity checks, and Dependabot security updates in [Code security settings](https://github.com/legioncodeinc/vibe-coding-tools/settings/security_analysis). Enable branch-update suggestions in [General settings](https://github.com/legioncodeinc/vibe-coding-tools/settings). Keeping merge commits enabled is consistent with this repository's current pull request history, but the team should document that choice.

## Issue and pull request templates: 0/10

There is no `.github/ISSUE_TEMPLATE/`, issue form, or pull request template.

Recommendation: add a bug form, feature request form, template configuration, and substantive pull request template under `.github/`. The pull request template should require testing, documentation, Security, Quality, breaking-change, and acceptance-evidence notes.

## `.gitignore` coverage: 6/10

The root `.gitignore` covers Node logs and dependencies, coverage output, common framework caches, TypeScript cache files, Python bytecode, and exact `.env` and `.env.test` files. No ignored build or credential artifact is added by PR #9.

Coverage gaps include `.env.*` with explicit example exceptions, `.venv/`, `dist/`, private key and credentials-file patterns, `.DS_Store`, `Thumbs.db`, and common IDE metadata.

Recommendation: extend `.gitignore` in a separate reviewed change. Confirm intentional tracked examples before adding broad secret or IDE patterns.

## Prioritized remediation plan

| Priority | Finding | Impact | Effort | Priority score | Action |
|---|---|---:|---:|---:|---|
| 1 | Secret scanning and push protection disabled | 5 | 1 | 5.0 | Enable both in repository code-security settings |
| 2 | No branch protection or ruleset | 5 | 1 | 5.0 | Protect `main` now; add required checks after CI exists |
| 3 | No CODEOWNERS | 4 | 1 | 4.0 | Add team-based ownership for distribution and automation paths |
| 4 | No pull request template | 3 | 1 | 3.0 | Add a Ship Gate-aware template under `.github/` |
| 5 | Missing security and contribution docs | 3 | 1 | 3.0 | Add `.github/SECURITY.md` and `.github/CONTRIBUTING.md` |
| 6 | `.gitignore` gaps | 3 | 1 | 3.0 | Add reviewed secret, Python environment, build, OS, and IDE patterns |
| 7 | No CI | 5 | 2 | 2.5 | Hand workflow architecture to `ci-release-worker-bee` |
| 8 | No issue forms | 3 | 2 | 1.5 | Add bug and feature forms plus `config.yml` |
| 9 | Conventional Commit adherence below 10% | 3 | 2 | 1.5 | Document the convention and validate pull request titles |

## Handoffs

- `ci-release-worker-bee`: create CI and required-check architecture.
- `security-worker-bee`: verify repository secret-scanning settings after an administrator enables them.
- `github-repo-health-worker-bee`: re-audit after governance changes.
- Repository administrator: create the ruleset and change GitHub security settings.

This audit made no GitHub setting, ruleset, workflow, branch, or pull request change.
