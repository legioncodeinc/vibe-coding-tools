# Dispatch preflight checklist (the 7 steps as an executable sequence)

Derived from `references/research/distilled-production-release-execution.md`; every step cites its raw source there. Run these IN ORDER; a failure at any step is a stop, not a retry loop (each dispatch cycle cost ~15 min at the 2026-09-29 incident).

## Preconditions

- An explicit owner instruction to ship is on record for this task; it authorizes the pipeline, never a skip of its gates.
- The promote PR is merged into main and the merge commit M is known (exact 40-char SHA).

## Step 1: Verify tree equality

- [ ] Compare main and staging tree IDs. Equal -> proceed. Mismatch (`main_staging_tree_mismatch`) -> sync whichever branch lacks the other's content via PR, then re-verify.

## Step 2: Bind freeze variables on GitHub (not the local file)

- [ ] `RELEASE_FREEZE_STATUS=active`
- [ ] `RELEASE_FREEZE_SHA=<main sha M>`
- [ ] `RELEASE_FREEZE_ID=<release id>`
- [ ] `RELEASE_FROZEN_STAGING_SHA=<staging sha>`
- [ ] Note: these are left bound to the LAST release after it completes; rebind every dispatch. The local `.release/release-freeze.json` is advisory only.

## Step 3: Lock both branches (live, not ruleset)

- [ ] Main branch protection: `lock_branch.enabled=true` AND `enforce_admins.enabled=true`
- [ ] Staging branch protection: same
- [ ] Post-merge chore-sync PRs unlock staging; re-check before dispatch. A ruleset is not substitute evidence; read the classic protection endpoint.

## Step 4: Compute the confirmation string

- [ ] Run the project's confirmation generator against the LIVE variable values (Reachlynk: `scripts/release/release-contract.mjs releaseConfirmation()`; `npm run release:plan -- --repository <repo> --release-id <id> --main-sha <sha> --staging-sha <staging-sha> --approval-mode owner-dispatch`, which also prints requiredRemoteState).
- [ ] sourceSha comes from `RELEASE_FROZEN_STAGING_SHA` at runtime, not from the pre-sync plan output. Never hand-build the string.

## Step 5: Confirm required checks green on the exact SHA

- [ ] Every required check `completed` + `success` on M ITSELF via the check-runs API (Quality Gates, Dependency Audit, Sandbox MVP Regression, Release and Worktree Contracts on Reachlynk; names come from `.release/release-policy.json` plus main's required checks).
- [ ] Do NOT trust `gh pr checks`: those are merge-ref runs and report green earlier (a false green misled a promote flow).
- [ ] Wait for the main push-run to complete first (full-depth run; Quality Gates alone ran ~26 min serially in the incident era).

## Step 6: Dispatch

- [ ] `gh workflow run <production-release workflow> --field release_sha=<M> --field release_id=<id> --field release_kind=normal --field release_operation=release --field release_confirmation="<token>"`
- [ ] Missing `release_confirmation` -> HTTP 422.
- [ ] The workflow is serialized (one concurrency group, no cancellation); concurrent dispatches queue.

## Step 7: After success: thaw, update advisory, verify

- [ ] Set freeze variables to inactive; clear SHA and ID values.
- [ ] Update the local advisory file (`.release/release-freeze.json`).
- [ ] Re-lock both branches per protocol.
- [ ] Verify the post-deploy-smoke log shows the live deployment serving `releaseSha == M`. A green workflow alone is not evidence of shipped.
- [ ] Record run URLs as evidence (no estimates).
