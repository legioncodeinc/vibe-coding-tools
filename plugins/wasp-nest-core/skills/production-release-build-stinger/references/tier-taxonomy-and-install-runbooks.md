# Tier taxonomy table with detection signals, and install runbooks per tier

Anchored on `references/research/distilled-ci-to-deploy-posture-and-tiers.md` (cites raw files there).

## Taxonomy table

| Tier | Mechanism | Detection signals (audit) | Install outline |
|---|---|---|---|
| 0: Push-to-main deploys | Platform auto-deploys every push to the production branch (Vercel default behavior on a connected Git repo) | Deploy platform integration configured; `.github/workflows/` absent or no deploy job; no branch protection on the production branch; deploys appear in platform dashboard without any repo-side workflow | Connect Git provider in the platform; confirm production branch; done. Nothing else to install |
| 1: Gated push-to-main | Tier 0 + required status checks and PR flow; deploy still fires on merge | Branch protection with `required_status_checks` present; PRs required; no manual promote step anywhere; `on: push: branches: [main]` deploy job possible | Add required checks to production-branch protection (`required_status_checks: {strict, checks:[{context}]}`); add a deploy workflow with `concurrency: <production group>` and `environment: production`; prefer an aggregate check when lanes skip jobs |
| 2: Staged/promoted deploys | Platform builds a candidate; a separate promote step makes it Current without a rebuild | Vercel: Auto-assign Custom Production Domains disabled; deployments in "Staged" state; a promote step (`vercel promote`) or dashboard promote in the flow; possibly `--skip-domain` in CI | Turn off Auto-assign Custom Production Domains (Settings > Environments > Production > Branch Tracking); CI deploys with `--skip-domain` or `--target` custom env; add promote step (`vercel promote <url> --timeout`); document Instant Rollback as the recovery path |
| 3: Freeze-gated owner dispatch | Owner-dispatched workflow bound to one exact main SHA; freeze vars; live branch locks; checks on the exact SHA; computed confirmation; serialized concurrency; verified smoke | `workflow_dispatch`-only deploy workflow; repo variables `RELEASE_FREEZE_*`; live `lock_branch.enabled` + `enforce_admins.enabled` on release branches; `release_confirmation`-style input; `concurrency` group with `cancel-in-progress: false`; post-deploy smoke job comparing a live release marker | Full runbook below |

## Detection signals, detail

Branch protection (read the CLASSIC endpoint; a ruleset alone has no lock_branch):
- `GET /repos/{owner}/{repo}/branches/<branch>/protection` -> `lock_branch.enabled`, `enforce_admins.enabled`, `required_status_checks.checks[].context`, `required_pull_request_reviews`.
- Rulesets: `enforcement` (disabled/active/evaluate), `bypass_actors`, `conditions.ref_name`, rule types including `merge_queue`, `required_status_checks`, `required_deployments`. No `lock_branch` rule type exists.
- Gotcha: referencing a nonexistent GitHub environment auto-creates it with NO protection rules; check the environment actually has its rules.
- Concurrency: workflows sharing an environment but omitting `concurrency` are not serialized by the environment.

Vercel:
- Default auto-promote on merge to production branch = Tier 0/1.
- Staged production builds (auto-assign off) + `vercel promote` = Tier 2.
- States to look for: Staged / Promoted / Current; Instant Rollback availability for previously Current deployments.
- Deployment policy (Pro/Enterprise) restricts which Git sources and mechanisms may deploy per environment.

## Install runbook: Tier 1 (gated push-to-main)

1. Inventory current checks. Adopt the principle: a required check must actually run at meaningful depth on the branch it protects (a skipped required check is a rubber stamp).
2. Add `required_status_checks` to the production branch via `PUT .../branches/<branch>/protection` (`strict` per team preference; `checks: [{context: "<check name>"}]`).
3. If deep jobs are lane-skipped, add one thin aggregate job that depends on all others and require only it.
4. Add the deploy workflow: `on: push: branches: [<prod>]`, `concurrency: <name>` with `cancel-in-progress: false`, job `environment: production`.
5. Verify: open a PR, watch required checks gate the merge; merge; confirm the deploy fires.

## Install runbook: Tier 2 (staged/promoted)

1. Preconditions: Tier 1 in place.
2. Vercel: Settings > Environments > Production > Branch Tracking > disable Auto-assign Custom Production Domains.
3. CI deploy step: `vercel --prod --skip-domain` (or `vercel build` + `vercel deploy --prebuilt`, noting System Environment Variables are absent at build time with --prebuilt).
4. Promote step (human or automation): `vercel promote <deployment-url> --timeout 5m`; `vercel promote status` to inspect pending promotions. Timeout does not cancel a promotion.
5. Recovery documentation: Instant Rollback to a past Current (no rebuild; env vars not rebuilt) for incidents; rebuild-promote otherwise.
6. Verify: merge; confirm the deployment lands in Staged; promote; confirm state Current and domain aliased.

## Install runbook: Tier 3 (freeze-gated owner dispatch)

Full worked example: Reachlynk `production-release.yml`. Port the PATTERN, not the project-specific script names (flagged gap: genericization is per-project work).

1. Preconditions: Tier 2 mechanics (staged candidate, promote-no-rebuild) on the deploy platform, plus Tier 1 required checks.
2. Freeze variables (repo variables, not a local file): `RELEASE_FREEZE_STATUS`, `RELEASE_FREEZE_SHA`, `RELEASE_FREEZE_ID`, `RELEASE_FROZEN_STAGING_SHA`. Vars persist after a release; every dispatch rebinds them.
3. Live locks: `lock_branch.enabled=true` + `enforce_admins.enabled=true` on main and staging via the classic protection endpoint (owner token). A ruleset is not substitute evidence.
4. Workflow shape: `workflow_dispatch` with exact 40-char SHA input, release ID, kind, operation, and a required computed confirmation input (absent input -> 422). `concurrency: {group: <single production group>, cancel-in-progress: false}`. Env pulls `vars` as data, never shell source; absent approval mode disables execution.
5. Preflight job: assert input/dispatch/workflow SHA all equal M; dispatch ref is main; required checks succeeded on M itself via check-runs (never merge-ref PR checks); policy file names the required checks; live lock reads; environment branch policy permits only main; actor identity check; reruns fail closed.
6. Execute job (environment-gated): migrations one transaction per file after claiming release ownership; candidate deploy; register protected callback if the stack has async workers; verify candidate READY + identity; recheck release controls; promote exactly the recorded candidate; verify canonical identity; resume queues. Upload receipts as artifacts with `if: always()`.
7. Post-deploy smoke job (normal path only): curl the live version/health endpoint, parse the release marker, fail loudly on mismatch. Runs after the release; never gates or retries it.
8. Supporting protocol: release-wait + merge-queue parking file + a notify workflow (10-min cron reading the lock, commenting on parked PRs, never merging). Publish the protocol in repo agent rules (AGENTS.md-style).
9. Documentation duties: required-check posture doc (which checks required where, and why); blast-radius inventory rule (pins/hashes referencing package files and the workflow itself); advisory-drift vs regression classification policy for dependency audits.

## Upgrade recommendation ladder

- 0 -> 1 when anyone but the author depends on the product (cost: one protection rule + one workflow).
- 1 -> 2 when a bad deploy must be recoverable as an artifact decision (staged candidates + promote; adds minutes per release, buys reviewability and rollback).
- 2 -> 3 when production carries money, auth, background queues, or migrations, or when more than one operator can trigger deploys (adds the dispatch gauntlet; each of its refusal codes exists because that failure mode occurred live).
