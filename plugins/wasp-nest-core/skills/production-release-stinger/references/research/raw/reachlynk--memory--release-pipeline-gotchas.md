---
name: reachlynk-release-pipeline-gotchas
description: "Exact failure signatures and preflight requirements of the reachlynk Production Release workflow, learned across 4 failed dispatches 2026-09-29"
metadata:
  node_type: memory
  type: project
  originSessionId: f26be330-9e8a-490d-a172-112cae7c81ff
  modified: 2026-09-29T05:07:00.661Z
---

Reachlynk `Production Release` workflow dispatch (learned 2026-09-29 across failed runs 36521395230, 36521617217, 36521751442, success 36523233623). Preflight gates, each with a distinct failure signature surfaced in the `preflight` job log:

1. `inngest_normal_release_failed (external_release_freeze_not_active,external_freeze_sha_mismatch,external_freeze_id_mismatch)`: repo variables `RELEASE_FREEZE_STATUS/SHA/ID` must be `active` and bound to the exact dispatch SHA and release ID. They are left bound to the LAST release after it completes; set all three before a new dispatch.
2. `staging_branch_not_locked`: requires `staging` branch protection `lock_branch=true`. Post-merge chore-sync PRs (e.g. release-sync PRs) unlock it; re-lock before dispatching.
3. `required_release_check_not_successful`: requires every required check `completed`+`success` on the EXACT main merge SHA via push-run check-runs. PR checks (`gh pr checks`) are merge-ref runs and report green earlier; wait for the main push-run CI (Quality Gates alone runs ~26 min serially).
4. First dispatch without `release_confirmation` 422s. Generate the exact token with `npm run release:plan -- --repository chrisl10/reachlynk --release-id <id> --main-sha <sha> --staging-sha <staging-sha> --approval-mode owner-dispatch`; it also prints requiredRemoteState.
5. Also required: `main` `lock_branch=true` (I had to lock it, it was false), main/staging tree IDs equal, `Production` environment has exactly one branch policy `main`.
6. Working dispatch command: `gh workflow run "Production Release" --field release_sha=<sha> --field release_id=<id> --field release_kind=normal --field release_operation=release --field release_confirmation="<token>"`.

**Why:** the preflight error strings are terse and each cycle cost ~15 min; the checks-on-M vs PR-checks gap produced a false green that misled the promote flow.

**How to apply:** before any release dispatch, assert all of: freeze vars bound, both branches locked, required checks green on the merge SHA itself (check-runs API, not `gh pr checks`), confirmation token from release:plan. CI-overhaul PRD candidates from this incident: post-sync re-assertion of lock/freeze state, faster parallel CI lanes, preflight error naming the missing check. Related: [[unipile-fix-incident-20260928]], [[ci-overhaul-prd-pending]].
