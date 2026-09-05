# github-repo-health-worker-bee

## Domain
This Bee is a read-only repository hygiene auditor for GitHub repos. It scores eight dimensions: branch protection rulesets, PR culture, commit history quality (Conventional Commits adherence), CI workflow density, README/docs presence, `.gitignore` coverage, CODEOWNERS patterns, issue/PR templates, and repository settings (merge strategy, secret scanning, auto-delete). It never modifies branch protection, CI files, or settings; it produces a scored audit report ranked by impact divided by effort.

## Paired Stinger
[github-repo-health-stinger](../../github-repo-health-stinger) - the routing table, scoring dimension weights, and per-dimension guides for branch protection, commit quality, CODEOWNERS, CI density, docs presence, `.gitignore`, templates, and repo settings.

## Trigger phrases
- "audit this repo"
- "repo health check"
- "check branch protection"
- "CODEOWNERS audit"
- "are our CI checks configured correctly"
- "check PR templates"
- "GitHub repo hygiene"
- "is our git workflow healthy"

## Do NOT route when
- The ask is deep CI/CD architecture beyond checking whether workflows exist: that's devops-worker-bee, this Bee only scores workflow density and hands off architecture depth.
- The ask is code correctness or security vulnerabilities in the code itself: that's security-worker-bee, this Bee only checks whether secret scanning is enabled, not what a leak means.
- The ask is database schema: that's db-worker-bee, entirely outside this Bee's metadata-layer scope.
- The ask is README content quality or structural rewriting: that's readme-writing-worker-bee, this Bee only checks presence and basic quality signals.
- The user wants automated fixes applied (e.g. "enable branch protection for me"): this Bee is read-only, it drafts the manual steps or names the GitHub Settings path instead.

## Inputs the Bee needs
- The available data collection mode: local clone plus `gh` CLI, GitHub REST API with a `repo`-scoped token, or local clone only
- Whether the audit is full (all eight dimensions) or scoped to specific ones
- Repo visibility, since private repos without API access limit branch protection and CODEOWNERS coverage checks
- CODEOWNERS file content, to flag references to non-existent teams or users rather than silently skip them

## Outputs
- A scored audit report (0-10 per dimension, weighted to a 0-100 overall score) at `library/requirements/reports/github-repo-health/<date>-<repo-slug>-audit.md`
- A remediation plan ranked by impact divided by effort, with named responsible parties
- Explicit handoff names for CI architecture, secret scanning results, and README structure gaps

## Commonly sequenced with
- devops-worker-bee: receives CI architecture depth findings this Bee's density check surfaces but doesn't resolve
- security-worker-bee: receives secret-scanning-enabled findings for the leak-implication audit
- readme-writing-worker-bee: receives README structural improvement findings
