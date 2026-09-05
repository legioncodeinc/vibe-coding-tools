# GitHub Repo Health Audit Report

**Repository:** `legioncodeinc/vibe-coding-tools`
**Audit date:** 2026-09-05
**Data collection mode:** Local clone plus GitHub CLI REST API
**Coverage gaps:** GitHub reports no branch-protection rule for `main`; no secret-scanning alerts can be queried because secret scanning is disabled.
**Audited by:** github-repo-health-worker-bee

## Overall Score: 18/100

| # | Dimension | Raw Score | Weight | Weighted |
|---|---|---:|---:|---:|
| 1 | Branch protection / rulesets | 0/10 | 20% | 0.0 |
| 2 | Commit quality | 2/10 | 15% | 3.0 |
| 3 | CODEOWNERS coverage | 0/10 | 15% | 0.0 |
| 4 | CI workflow density | 0/10 | 15% | 0.0 |
| 5 | Docs presence | 5/10 | 10% | 5.0 |
| 6 | Repository settings | 5/10 | 10% | 5.0 |
| 7 | Issue and PR templates | 0/10 | 8% | 0.0 |
| 8 | `.gitignore` coverage | 7/10 | 7% | 4.9 |
| | **Total** | | | **17.9** |

The score is displayed as **18/100** after rounding the evidence-backed configuration profile. It is an audit result, not a block on this documentation-only pull request. The named configuration gaps remain open for a repository administrator to decide and apply.

## Branching Strategy

**Observed strategy:** Ad-hoc GitHub Flow with merge commits.
**Documented:** No `CONTRIBUTING.md` was found.
**Branch inventory:** Four local worktrees, including the active integration branch and preserved historical worktrees. Open remote pull requests: none at audit time.
**Assessment:** Use feature branches and pull requests consistently, but protect `main` and document the merge policy before relying on the process for delivery assurance.

## Branch Protection / Rulesets (Score: 0/10)

**Enforcement mechanism:** None observed. GitHub returned `404 Branch not protected` for `main` and no repository rulesets.

| Rule | Status | Notes |
|---|---|---|
| `required_pull_request` | ❌ Disabled | No `main` protection rule exists. |
| `required_status_checks` | ❌ Disabled | No required checks can apply without protection. |
| `non_fast_forward` | ❌ Unknown | Not enforced by a reported ruleset. |
| `dismiss_stale_reviews` | ❌ Unknown | Not enforced by a reported ruleset. |
| `required_linear_history` | ❌ Disabled | Merge commits are enabled. |
| `required_signatures` | ⚠️ Unknown | Not surfaced by current API state. |

## Commit Quality (Score: 2/10)

| Metric | Value |
|---|---|
| CC-adherent commits in sampled history | 3/42 (7%) |
| Average subject line length | Not calculated because historical merge and prose commits dominate the small sample. |
| Generic/noise commits | Present, for example `God.`, `Hive image`, and `Updated README.md`. |
| Breaking changes documented | None detected in the sampled subjects. |
| `commitlint` in CI | No CI workflow exists. |

## CODEOWNERS (Score: 0/10)

**Location:** Not present.
**Syntax errors:** Not applicable.
**Coverage:** 0% by file ownership rule.
**Ownership type:** Not configured.

## CI Workflow Density (Score: 0/10)

No `.github/workflows/` files are present. Consequently, no automated lint, test, build, security, or timeout policy is available as a required check.

## Docs Presence (Score: 5/10)

| File | Present | Notes |
|---|---|---|
| README.md | ✅ | Substantive onboarding and harness documentation. |
| LICENSE | ❌ | No root license file found. |
| CONTRIBUTING.md | ❌ | No contributor or merge policy found. |
| SECURITY.md | ❌ | No public disclosure policy found. |
| CODE_OF_CONDUCT.md | ❌ | No community conduct file found. |

## Repository Settings (Score: 5/10)

| Setting | Status |
|---|---|
| Auto-delete head branches | ✅ | Enabled. |
| Allow merge commits | ✅ | Enabled. |
| Allow squash merging | ✅ | Enabled. |
| Allow rebase merging | ✅ | Enabled. |
| Secret scanning | ❌ | Disabled. |
| Push protection | ❌ | Disabled. |
| Dependabot alerts | ❌ | Security updates disabled. |

## Issue and PR Templates (Score: 0/10)

| Item | Present | Substantive? |
|---|---|---|
| Bug report template | ❌ | ❌ |
| Feature request template | ❌ | ❌ |
| PR template | ❌ | ❌ |

## `.gitignore` Coverage (Score: 7/10)

**Detected stack:** Markdown, Python, Node, generated harness assets, and archive tooling.
**Secret patterns:** ⚠️ `.env` and `.env.test` are ignored, but a broad `.env.*` rule is absent.
**Build artifacts:** ✅ Node, coverage, Python cache, and common build outputs are covered.
**Accidentally tracked files:** None detected in the scoped review.

## Prioritized Remediation Plan

| Priority | Finding | Impact | Effort | Action |
|---|---|---:|---:|---|
| 1 | `main` is unprotected and has no required checks | 5 | 2 | Create a GitHub ruleset requiring pull requests and status checks for `main`. |
| 2 | Secret scanning, push protection, and Dependabot security updates are disabled | 5 | 1 | Enable these repository security settings in GitHub Security and analysis. |
| 3 | No CI workflows exist | 4 | 3 | Ask `ci-release-worker-bee` to add a focused validation workflow for generator and validator passes. |
| 4 | Missing CODEOWNERS and contribution policy | 3 | 2 | Add CODEOWNERS and CONTRIBUTING.md with review and branch expectations. |
| 5 | Commit convention is inconsistent | 2 | 2 | Adopt a small Conventional Commits policy and enforce it in CI. |

**Handoffs to other Bees:**

- `ci-release-worker-bee`: add a minimal CI validation pipeline once the repository owner approves the desired checks.
- `security-worker-bee`: enable secret scanning and push protection, then assess any newly surfaced historical alerts.
- `readme-writing-worker-bee`: no README rewrite needed for this feature.

## Re-evaluation after Quality

The repository-health data was re-read after the final Quality report. `main` remains unprotected, secret scanning and push protection remain disabled, and no open pull request existed before this delivery pull request was created. No code-level change was made by this audit.

## Gate result

Repository health audit completed after Security and Quality. The audit produced no code-level remediation for this branch. The repository configuration debt above is external to this documentation and generator change, remains visible for the CODEOWNER, and does not alter the completed implementation evidence.
