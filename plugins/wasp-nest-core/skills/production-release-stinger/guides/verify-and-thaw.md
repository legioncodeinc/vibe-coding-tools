# Guide: verify-and-thaw

Grounded in `references/research/distilled-production-release-execution.md` (raw sources cited there).

Post-dispatch closure: prove the release is live, then restore the repo to its resting state.

## Verify (shipped means verified-shipped)

1. **Workflow conclusions.** Preflight, execute, post-deploy-smoke jobs all concluded. Get real run URLs for the report. A failed execute job with uploaded recovery receipts is an incident, not a thaw candidate: report the artifact URL and stop.
2. **Live release marker.** Fetch the production health/version endpoint (Reachlynk pattern: `${PRODUCTION_URL%/}/api/version`, with the protection-bypass header if the project uses deployment protection) and parse the release marker. The observed SHA must equal the dispatched M. A green workflow with a mismatched marker is NOT shipped; the smoke job fails loudly for humans to act on (the release already ran; it is neither gated nor retried by the smoke).
3. **Layered identity checks (Tier 3).** Where the runtime performs them, confirm from logs: candidate verified READY with identity (project, SHA, environment) before promotion; canonical deployment verified after promotion; queues/workers resumed (no stuck holds).
4. **Evidence.** Record run URLs, observed live SHA, and durations. No estimates.

## Thaw

1. **Freeze variables to resting state:** `RELEASE_FREEZE_STATUS=inactive`, clear `RELEASE_FREEZE_SHA`, `RELEASE_FREEZE_ID` (and the staging SHA). Vars are left bound to the just-finished release otherwise, which will fail the NEXT dispatch's preflight with `external_release_freeze_not_active`/mismatch codes.
2. **Update the local advisory file** (`.release/release-freeze.json` on Reachlynk-pattern repos). It is advisory only; updating it is hygiene, never the freeze action itself.
3. **Re-lock both branches** per protocol: `lock_branch.enabled=true` + `enforce_admins.enabled=true` on main and staging, via the classic protection endpoint with an owner token. Post-release sync PRs tend to leave staging unlocked; check it.
4. **Notify parked sessions.** If `.release/merge-queue.json` has waiting entries, the notify workflow will comment when the lock state settles; confirm the queue file reflects reality (your own entries removed after merge; never edit another session's entry).

## Verification of the thaw itself

- Read back the variables (status inactive, values cleared) and both protection endpoints (`lock_branch.enabled=true`, `enforce_admins.enabled=true`). Live reads only; the local advisory file proves nothing.
- Only after verify + thaw + read-backs pass does the run-watch report get the PASS verdict.
