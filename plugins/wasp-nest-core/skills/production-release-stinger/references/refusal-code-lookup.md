# Refusal-code -> fix lookup

Every code below was hit live. Source: `references/research/distilled-production-release-execution.md` (raw: the two Reachlynk memory files).

| Refusal code / signature | Where it surfaces | Root cause | Fix |
|---|---|---|---|
| `main_staging_tree_mismatch` | preflight | main and staging tree IDs differ | Sync whichever branch lacks the other's content via PR; re-run Step 1 |
| `external_release_freeze_not_active` | preflight | `RELEASE_FREEZE_STATUS` not `active`; vars still bound to the last completed release | Set all four freeze variables for THIS release (Step 2) |
| `external_freeze_sha_mismatch` | preflight | `RELEASE_FREEZE_SHA` not the exact dispatch SHA | Rebind `RELEASE_FREEZE_SHA` to M |
| `external_freeze_id_mismatch` | preflight | `RELEASE_FREEZE_ID` not this release's ID | Rebind `RELEASE_FREEZE_ID` |
| `main_branch_not_locked` | preflight | main protection missing `lock_branch=true` (+ `enforce_admins=true`) | Lock main via the classic protection endpoint (owner token) |
| `staging_branch_not_locked` | preflight | staging protection missing the lock; post-merge chore-sync PRs unlock it | Re-lock staging before dispatch |
| `required_release_check_not_successful` | preflight | a required check not `completed`+`success` on the EXACT main merge SHA; often a false green from trusting `gh pr checks` (merge-ref runs) | Wait for the main push-run check-runs on M; fix the failing check if genuinely red |
| `owner_dispatch_confirmation_mismatch` | preflight | hand-built confirmation string, or computed against stale plan output instead of live vars | Recompute with `release-contract.mjs releaseConfirmation()` against LIVE variable values |
| HTTP 422 on `gh workflow run` | dispatch | `release_confirmation` input missing | Generate the token with `release:plan ... --approval-mode owner-dispatch` and pass it |
| Post-deploy smoke marker mismatch | post-deploy-smoke job | live `releaseSha` != expected SHA | The release already ran; this fails loudly for humans to act on. Investigate the deployment; do not re-dispatch blind |
| Merge refused mid-pipeline | git | `lock_branch.enabled=true` (active freeze) | Do NOT retry/force/admin-merge. Follow the release-wait protocol: park in `.release/merge-queue.json`, continue independent work, wait for Merge Queue Notify |
