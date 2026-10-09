# Guide: adapt-to-tier (detect the project's tier at runtime)

Grounded in `references/research/distilled-production-release-execution.md` and the shared raw archive (see the production-release-build component's `references/tier-taxonomy-and-install-runbooks.md` for the full detection table; the taxonomy raw citations live in `../../../production-release/command/references/research/raw/`).

Detect BEFORE executing; the tier decides which parts of execute-release apply.

## Detection procedure (read-only, ~5 checks)

1. **Deploy workflow scan.** List deploy-relevant workflows. A `workflow_dispatch`-only deploy workflow with a SHA-binding input and a confirmation-style input is a Tier 3 signature. `on: push: branches: [main]` with a deploy step is Tier 1. No repo-side deploy workflow at all is Tier 0 (platform auto-deploy) or 2.
2. **Platform integration.** Is the repo connected to the deploy platform (Vercel GitHub app)? On Vercel, is Auto-assign Custom Production Domains disabled (Settings > Environments > Production > Branch Tracking)? Disabled + a promote step = Tier 2. Default auto-promote on merge = Tier 0/1.
3. **Branch protection (classic endpoint).** `GET /repos/{owner}/{repo}/branches/<prod>/protection`. `required_status_checks` present -> Tier 1+. `lock_branch.enabled=true` reachable/settable and part of the release protocol -> Tier 3. Never accept a ruleset as lock evidence (the rulesets API has no lock_branch).
4. **Repo variables.** Freeze-style variables (`RELEASE_FREEZE_STATUS/SHA/ID`, staging SHA, owner actor IDs, approval mode) -> Tier 3 machinery present. Note whether the values are currently bound to a PAST release (they persist; rebind per dispatch).
5. **Post-deploy smoke.** A job or script that hits the live health/version endpoint and compares a release marker -> Tier 3 verification leg.

## Execution by tier

- **Tier 0 (push-to-main deploys):** the release IS the merge. Verify: merge to the production branch, watch the platform deploy, check the live URL. No preflight gauntlet exists to run; do not invent one, but do confirm the deploy actually reached production (verified-shipped still applies).
- **Tier 1 (gated push-to-main):** required checks gate the merge; the merge triggers the deploy. Wait for main's push-run checks, merge, watch the deploy, verify live. No freeze/confirmation steps unless present in variables.
- **Tier 2 (staged/promoted):** after merge, a candidate is built but NOT serving. Find the promote step (CI or manual `vercel promote`), execute or await it, then verify Current state and live URL. If the project expects a human promotion decision, surface it and wait; do not promote on the release executor's own initiative unless the owner instruction covers it.
- **Tier 3 (freeze-gated owner dispatch):** run the full 7-step preflight + dispatch + thaw (execute-release guide). This is the only tier with freeze variables, computed confirmations, and check-runs-on-exact-SHA requirements.
- **Mixed/ambiguous:** when signals conflict (e.g., workflow_dispatch workflow but no freeze vars), report the ambiguity and ask; do not guess a tier and skip gates. Missing machinery that the project's own docs require is an audit finding for production-release-build, not a silent downgrade.

## Adapting script names

Reachlynk procedure names specific scripts (`release:plan`, `release-contract.mjs`). For another project, substitute its equivalents; if a step has no local tooling (e.g., no confirmation generator exists), flag it and execute the underlying check manually (compare live variable values yourself), recording the manual verification in the report. Never skip a step because its tool is absent.
