# Distilled: CI-to-deploy posture audit and the release-tier taxonomy (0-3)

Every claim cites a raw file in this component's `references/research/raw/` (shared with the production-release component). The Reachlynk corpus is the single worked Tier 3 example; GitHub and Vercel official docs supply the general mechanics for lower tiers.

## The tier taxonomy (anchor)

Four tiers of release flow, from the simplest live pattern documented in Vercel's official docs to the Reachlynk Tier 3 worked example. Decision criteria follow the table.

| Tier | Name | Mechanism | Evidence of presence |
|---|---|---|---|
| 0 | Push-to-main deploys | Connecting the Git repo to the deploy platform auto-deploys every push to the production branch. Vercel: "By default, when you merge to or make commits to your production branch (often `main`), Vercel will automatically promote the changes to Production." [raw/vercel--promoting-deployments.md] | Vercel/Git integration present, no deploy workflow, no branch protection beyond defaults |
| 1 | Gated push-to-main | Tier 0 plus branch protection with required status checks and PR review; deploys still fire automatically on merge. GitHub canonical simple pattern: `concurrency: production`, `on: push: branches: [main]`, job with `environment: production` [raw/github--actions--deploying-with-actions.md]; required checks enforce PR lanes [raw/reachlynk--docs--ci-required-checks.md] | required checks on the production branch; PRs enforced; still no manual promote step |
| 2 | Staged/promoted deploys | Deploy platform builds a candidate (staged production build with Auto-assign Custom Production Domains disabled, or a preview deployment) and a human/automation promotes it without a rebuild. Vercel: Staged -> Promoted -> Current states; "turn off the auto-assignment of domains... you must manually promote"; CLI `vercel promote [id-or-url]`, `--skip-domain` at deploy time [raw/vercel--promoting-deployments.md, raw/vercel--cli-deploy.md] | production deploys in "Staged" state; a promote step in the workflow; auto-assign disabled in settings |
| 3 | Freeze-gated owner dispatch | Explicit owner-dispatched release workflow bound to one exact immutable main SHA, with freeze variables, live branch locks (`lock_branch` + `enforce_admins`), required checks on the exact SHA, computed acknowledgement, serialized concurrency, migrations with queue holds, and a verified post-deploy smoke. Full worked example: Reachlynk `production-release.yml` [raw/reachlynk--workflow--production-release.yml.md, raw/reachlynk--knowledge--delivery-pipeline.md, raw/reachlynk--docs--ci-required-checks.md] | workflow_dispatch-only deploy workflow; freeze vars in repo variables; lock_branch live; release confirmation input |

Decision criteria (when to build which tier):
- Tier 0 fits prototypes and personal projects: any push is acceptable as a production change. No blast radius worth gating.
- Tier 1 when others depend on the product: required checks make merges prove themselves (the rubber-stamp lesson of PR #872: a required check that silently skips on the branch it protects is a rubber stamp [raw/reachlynk--docs--ci-required-checks.md]).
- Tier 2 when deploys must be reviewable as artifacts: promote-no-rebuild gives a rollback-able, inspectable candidate; Vercel documents Instant Rollback as a distinct recovery path for previously-served deployments [raw/vercel--promoting-deployments.md].
- Tier 3 when production carries money, auth, queues, or migrations: the dispatch gauntlet (every refusal code hit live across five failed attempts) exists because each failure mode actually occurred [raw/reachlynk--memory--rel-20260930-production-release.md, raw/reachlynk--memory--release-pipeline-gotchas.md]. The concurrency rule ("single serialized production surface", cancel-in-progress: false) prevents interleaved production effects and stranded queues [raw/reachlynk--workflow--production-release.yml.md].

## Detection signals (audit layer)

GitHub Actions posture:
- Deployment triggers: push/pull_request/workflow_dispatch; environment-referencing jobs wait for protection rules before running and before secret access [raw/github--actions--deploying-with-actions.md].
- Environments: required reviewers (max 6, one approval suffices, optional Prevent self-review), wait timer, admin bypass toggle, custom deployment protection rules; deployment branch/tag policies per ref type; env secrets/vars scoped to environment jobs; referencing a nonexistent environment AUTO-CREATES it with no rules (a common silent gap) [raw/github--environents--deployment-environments.md].
- Concurrency: string group, one running + one pending, cancel-in-progress optional, not tied to environment names; workflows sharing an environment but omitting concurrency are unrestricted [raw/github--actions--deploying-with-actions.md].

Branch protection vs rulesets:
- Branch protection REST: `PUT /repos/{owner}/{repo}/branches/{branch}/protection`; `lock_branch` boolean ("set the branch as read-only... users will not be able to push to the branch"), response `lock_branch.enabled`; `enforce_admins` required boolean-or-null, response `enforce_admins.enabled`; `required_status_checks` `{strict, contexts(deprecated)|checks:[{context, app_id?}]}` [raw/github--rest--branch-protection.md].
- Rulesets REST: `enforcement` (disabled/active/evaluate), `bypass_actors`, `conditions.ref_name`, many rule types (merge_queue, required_deployments, pull_request, required_status_checks...) but NO `lock_branch` anywhere [raw/github--rulesets-rest.md].
- Corroboration: Reachlynk's rule "a ruleset alone is not accepted as substitute evidence" for a freeze [raw/reachlynk--AGENTS.md] matches the API surface exactly: lock-branch exists only on classic branch protection. An audit must read the classic protection endpoint, not only rulesets.

Vercel posture:
- Deployment sources: Git auto-deploy (most common), CLI, Deploy Hooks, REST API [raw/vercel--deployments-overview.md].
- Environments: Local/Preview/Production; custom environments (e.g. `--target=staging`) [raw/vercel--cli-deploy.md].
- Promotion paths: auto on merge to production branch (default); Promote preview -> production (rebuild); Promote staged production build (no rebuild, requires Auto-assign Custom Production Domains OFF); Instant Rollback (domains to a past Current, no rebuild; environment variables not rebuilt) [raw/vercel--promoting-deployments.md].
- CLI: `vercel --prod`, `--skip-domain`, `--prebuilt` (System Env Vars missing at build time), `vercel promote` with `--timeout` (default 3m; timeout does not cancel the promotion), `vercel promote status` [raw/vercel--cli-deploy.md, raw/vercel--promoting-deployments.md].
- Pro/Enterprise deployment policy can restrict which Git sources and mechanisms deploy to each environment [raw/vercel--deployments-overview.md].

Required-check posture (Tier 3 depth, generalizes):
- Three layers: PR lanes at lane depth (scoped lanes legitimately skip deep jobs with visible skip summaries), main pushes always full depth (main validates its own tests), release preflight re-verifies the exact SHA plus freeze and identity [raw/reachlynk--docs--ci-required-checks.md].
- Aggregate-check recommendation for scoped lanes: one thin aggregate job that depends on all others; branch protection requires exactly one check [raw/reachlynk--docs--ci-required-checks.md].
- Zombie third-party check suites (vercel, coderabbitai apps) can sit QUEUED forever on rewritten commits; not required checks, never block mergeability alone [raw/reachlynk--knowledge--delivery-pipeline.md].
- Advisory-drift audit policy: classify Dependency Audit failures as regression (lockfile bytes changed; fix in the same PR) vs advisory drift (bytes identical, world changed; byte-compare against last green run; still triage every advisory individually) [raw/reachlynk--knowledge--delivery-pipeline.md].
- Batch-by-blast-radius: inventory contracts/pins/hashes referencing any shared surface before editing it; unique check names required (duplicate display names block mergeability via a skipped duplicate) [raw/reachlynk--knowledge--delivery-pipeline.md].

## Install runbook anchors (per tier)

- Tier 0: connect Git repo to Vercel; confirm production branch setting (default main; can be changed, and Vercel documents non-default production branches [raw/vercel--promoting-deployments.md]).
- Tier 1: add required checks via branch protection `required_status_checks` [raw/github--rest--branch-protection.md]; adopt the canonical concurrency+environment pattern [raw/github--actions--deploying-with-actions.md]; prefer the aggregate-check form for lane-skipping jobs [raw/reachlynk--docs--ci-required-checks.md].
- Tier 2: disable Auto-assign Custom Production Domains; deploy with `--skip-domain` or staged production builds; promote with `vercel promote`; document the Staged/Promoted/Current states and Instant Rollback as recovery [raw/vercel--promoting-deployments.md, raw/vercel--cli-deploy.md].
- Tier 3: owner-dispatch workflow with exact-SHA inputs, freeze variables, live lock_branch+enforce_admins on both branches, computed confirmation, checks verified on the exact SHA via check-runs API (never `gh pr checks`), serialized concurrency with cancel-in-progress: false, migrations one-transaction-per-file with queue holds, and a post-deploy smoke verifying the live release marker. Every element traces to the Reachlynk worked example [raw/reachlynk--workflow--production-release.yml.md, raw/reachlynk--memory--rel-20260930-production-release.md, raw/reachlynk--memory--release-pipeline-gotchas.md]. Supporting protocol: release-wait + merge-queue + notify workflow [raw/reachlynk--AGENTS.md, raw/reachlynk--workflow--merge-queue-notify.yml.md].

## Conflicts and gaps

- **lock_branch via rulesets.** Community material sometimes implies parity between rulesets and classic protection; the official rulesets REST reference has no lock_branch field [raw/github--rulesets-rest.md]. Preferred reading: lock-branch is classic-protection-only; a Tier 3 install must use the classic protection endpoint.
- **Gap: tiers are an inference.** Tiers 0-2 are assembled from official mechanics (each step documented), but the 0-3 taxonomy itself is a Reachlynk-derived frame, not a vendor taxonomy. Present it as this system's decision ladder, not as an industry standard.
- **Gap: hotfix path thinness.** The hotfix kind (`release_kind=hotfix`, `hotfix_sha`) exists in the workflow inputs [raw/reachlynk--workflow--production-release.yml.md] but the corpus contains no worked hotfix run; runbook content stays at input-definition depth.
- **Gap: recovery operations dead in practice.** recover-candidate/previous/successor remain dispatchable but fail closed on a missing Fly secret pending owner decision [raw/reachlynk--workflow--production-release.yml.md, raw/reachlynk--memory--ci-overhaul-prd-pending.md]. Do not install or document recover-* as a working path without the project's own secrets inventory.
