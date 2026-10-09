# Distilled: production release execution (dispatch procedure, refusal codes, verification)

Every claim cites a raw file in this component's `references/research/raw/` (shared with the production-release-build component). Where sources disagree, both readings are stated.

## The seven-step dispatch procedure (verbatim-faithful to the memory)

Learned across five failed dispatch attempts; every refusal code was hit live. [raw/reachlynk--memory--rel-20260930-production-release.md]

1. **Trees must match.** Main and staging tree IDs must be identical; a mismatch produces `main_staging_tree_mismatch`. Sync whichever branch lacks the other's content via PR.
2. **Freeze variables on GitHub** (NOT the local `.release/release-freeze.json` file, which is advisory only and may be stale [raw/reachlynk--AGENTS.md, raw/reachlynk--knowledge--delivery-pipeline.md]): `RELEASE_FREEZE_STATUS=active`, `RELEASE_FREEZE_SHA=<main sha>`, `RELEASE_FREEZE_ID=<id>`, `RELEASE_FROZEN_STAGING_SHA=<staging sha>`. Mismatches produce `external_freeze_*` refusal codes.
3. **Both branches locked**: `lock_branch=true` plus `enforce_admins=true` on main and staging branch protection. Failures surface as `main_branch_not_locked` / `staging_branch_not_locked`.
4. **Confirmation string must be computed**, not hand-built: `scripts/release/release-contract.mjs releaseConfirmation()` against the LIVE variable values (sourceSha comes from `RELEASE_FROZEN_STAGING_SHA` at runtime, not from the pre-sync plan output). Hand-built strings produce `owner_dispatch_confirmation_mismatch`.
5. **The target main SHA's own required checks must be SUCCESS** before dispatch: Quality Gates, Dependency Audit, Sandbox MVP Regression, Release and Worktree Contracts. Failures surface as `required_release_check_not_successful`. After merging to main, WAIT for the main push-run to complete first. PR checks (`gh pr checks`) are merge-ref runs and report green earlier; a false green misled a promote flow [raw/reachlynk--memory--release-pipeline-gotchas.md]. Use the check-runs API on the exact merge SHA, not PR checks.
6. **Dispatch**: `gh workflow run production-release.yml` with `release_sha`, `release_id`, `release_kind=normal`, `release_operation=release`, `release_confirmation`. The workflow requires `release_confirmation` as an input (422 without it).
7. **After success: thaw and verify.** Set freeze variables to inactive and clear SHA/ID, update the local advisory file, verify the post-deploy-smoke log shows a live `releaseSha` match.

## Refusal-code lookup

| Code / signature | Meaning | Fix |
|---|---|---|
| `main_staging_tree_mismatch` | main and staging tree IDs differ | Sync via PR [raw/reachlynk--memory--rel-20260930-production-release.md] |
| `external_release_freeze_not_active` | `RELEASE_FREEZE_STATUS` not `active`; vars are left bound to the LAST release after it completes; rebind before each dispatch [raw/reachlynk--memory--release-pipeline-gotchas.md] | Set freeze vars step 2 |
| `external_freeze_sha_mismatch` / `external_freeze_id_mismatch` | freeze vars not bound to the exact dispatch SHA and release ID [raw/reachlynk--memory--release-pipeline-gotchas.md] | Rebind `RELEASE_FREEZE_SHA`/`RELEASE_FREEZE_ID` |
| `main_branch_not_locked` / `staging_branch_not_locked` | branch protection missing `lock_branch=true` (+`enforce_admins=true`); post-merge chore-sync PRs unlock staging; re-lock before dispatch | Lock both branches [both memories] |
| `required_release_check_not_successful` | a required check not `completed`+`success` on the EXACT main merge SHA (push-run check-runs, not merge-ref PR checks) [both memories] | Wait for main push-run CI (Quality Gates ran ~26 min serially at the 2026-09-29 incident) |
| `owner_dispatch_confirmation_mismatch` | hand-built confirmation string | Compute via `release-contract.mjs releaseConfirmation()` against live vars [raw/reachlynk--memory--rel-20260930-production-release.md] |
| HTTP 422 on dispatch | missing `release_confirmation` input [raw/reachlynk--memory--release-pipeline-gotchas.md] | Generate token with `npm run release:plan -- --repository <repo> --release-id <id> --main-sha <sha> --staging-sha <staging-sha> --approval-mode owner-dispatch`; it also prints requiredRemoteState |

## Workflow mechanics (Tier 3 live example)

[raw/reachlynk--workflow--production-release.yml.md]

- Owner-dispatched `workflow_dispatch` only; inputs bind the release to an exact 40-char main SHA, a fresh release ID, release kind (`normal`/`hotfix`), operation (`release`, `recover-candidate`, `recover-previous`, `recover-successor`), and the acknowledgement string.
- `concurrency: {group: production-release, cancel-in-progress: false}`: the single serialized production surface. Cancellation would strand production queues; do not add cancel-in-progress.
- Workflow env pulls `vars.RELEASE_*` (freeze vars, approval mode, owner actor IDs) plus the dispatch inputs. "These are data, never shell source. An absent approval mode disables execution."
- Jobs: `preflight` (runs the release runtime `--preflight`), `execute` (needs preflight; `environment: Production`; applies reviewed migrations one transaction per file, then `--execute`: Vercel candidate, Inngest callback registration, evidence checks, promote exactly the recorded candidate, verify canonical identity, admit the new Inngest generation, resume queues), recovery receipts uploaded as artifacts regardless of outcome, `post-deploy-smoke` (normal-release path only; hits `${PRODUCTION_URL%/}/api/version`, parses `releaseSha`, fails loudly on mismatch with the expected SHA; runs after the owner-authorized release and neither gates, retries, nor reorders it).

Preflight requirements (the release half of the required-check posture) [raw/reachlynk--docs--ci-required-checks.md, raw/reachlynk--knowledge--delivery-pipeline.md]:
- Input SHA, dispatch SHA, and workflow SHA all equal M; dispatch ref is main.
- Required Actions checks succeeded on M itself, not a merge ref or staging head.
- `.release/release-policy.json` names (Quality Gates, Dependency Audit, Sandbox MVP Regression, Release and Worktree Contracts) green on M, on top of main's own required checks.
- Live branch protection shows `lock_branch.enabled=true` and `enforce_admins.enabled=true` on main. A ruleset alone is not accepted, and the rulesets REST API indeed has no `lock_branch` field at all [raw/github--rulesets-rest.md].
- `Production` environment permits only the `main` branch.
- Actor identity must match the owner (numeric actor ID equality on personal repos; owner-managed allowlist on organizations); reruns fail closed rather than inheriting a previous dispatch's approval.

## Three-layered posture

[raw/reachlynk--docs--ci-required-checks.md] PR lanes prove the changeset at lane depth (scoped lanes legitimately skip deep jobs with visible skip summaries); main pushes always run full depth (the PR #872 lesson: a required check that silently skips on the branch it protects is a rubber stamp; main validates its own tests); the release preflight re-verifies the exact release SHA's checks plus freeze and identity before any production effect.

## Freeze semantics and the release-wait protocol

- `lock_branch` is an owner-only toggle; it is the LIVE freeze signal. The local `.release/release-freeze.json` is advisory only and never freeze evidence. Required checks alone are not a freeze. [raw/reachlynk--AGENTS.md, raw/reachlynk--knowledge--delivery-pipeline.md]
- `lock_branch=true` blocks admin merges absolutely; no workaround exists except turning it off. The protection API is writable with an owner token (`gh api PUT branches/main/protection`). [raw/reachlynk--memory--ci-overhaul-prd-pending.md]
- When a merge is refused under the lock: detect once, park one entry of your own in `.release/merge-queue.json` (`{pr, branch, readyCommit, resumeAction, parkedAt, parkedBy, status: "waiting"}`; edit only your own entry), continue unrelated work, set at most one low-frequency check (>= 120s) or rely on the Merge Queue Notify workflow, and remove your entry after merging. Never retry the merge, force-push, or attempt an admin merge against a lock. [raw/reachlynk--AGENTS.md]
- `merge-queue-notify.yml` polls main's protection endpoint every 10 minutes (off-peak cron `7,17,27,37,47,57 * * * *`); when the lock lifts it comments on every parked PR with queue position and resume action. It notifies; it never merges. [raw/reachlynk--workflow--merge-queue-notify.yml.md]
- Merges into staging are not freeze-gated the same way; the freeze protects main, the release boundary. [raw/reachlynk--knowledge--delivery-pipeline.md]

## Approval semantics

An explicit owner instruction to deliver work to production main authorizes the full default pipeline (implementation -> staging PR and merge -> promote PR and merge into main -> production release dispatch) with no additional mid-pipeline human confirmation, while still requiring: run required checks and treat failure as a stop, honor an active freeze as a stop, record authorization on the shipping PR, and dismiss a reviewer-bot CHANGES_REQUESTED only after triage. The instruction authorizes the pipeline, never a skip of its gates. [raw/reachlynk--AGENTS.md]

## Verified-shipped standard

"Shipped means verified-shipped": workflow success alone is not evidence. Verification is layered (candidate READY + identity check before promotion, canonical check after promotion, plus a post-deploy smoke confirming the release marker on the live URL). Every stage cites real Actions run URLs, no estimates. [raw/reachlynk--knowledge--delivery-pipeline.md]

## Blast-radius discipline

Any change touching package files, workflows, or shared scripts must first inventory what contracts, pins, or hashes reference them: `changed-files.mjs` reviewed-bytes pins SHA-256-hash `package.json`, `package-lock.json`, and this workflow itself; a dependency bump silently breaks pins until repinned. Two check runs sharing one display name on the same branch create a skipped duplicate that blocks mergeability; check names must be unique. [raw/reachlynk--knowledge--delivery-pipeline.md]

## Conflicts and gaps

- **Legacy vs Inngest runtime.** The workflow runs `inngest-release-runtime.mjs` for normal release and `release-runtime.mjs` for recovery; recover-* operations are "DEAD IN PRACTICE" (missing FLY_API_TOKEN fails closed) pending an owner decommission decision [raw/reachlynk--workflow--production-release.yml.md, raw/reachlynk--memory--ci-overhaul-prd-pending.md]. Both readings preserved; the drone should treat recover-* as dispatchable-but-failing-closed, not as a working recovery path.
- **Gap: generic projects.** The procedure names Reachlynk-specific scripts (`release:plan`, `release-contract.mjs`). Everything above that layer (tree equality, freeze vars, live locks, checks on exact SHA, computed confirmation, verified smoke) generalizes; the specific script names do not. The drone adapts the pattern, not the script names, when a project's tooling differs. Flagged as thin rather than smoothed over.
