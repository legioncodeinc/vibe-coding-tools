# Guide: execute-release

Grounded in `references/research/distilled-production-release-execution.md` (raw sources cited there).

Execute the complete production release for a project, at its tier, from authorization to verified-shipped. This guide covers the full pipeline; `adapt-to-tier.md` decides which parts apply.

1. **Confirm authorization.** An explicit owner instruction for THIS task must be on record. It authorizes the default pipeline (implementation -> staging PR and merge -> promote PR and merge into main -> dispatch); it never skips gates. Record the authorization reference in the report.
2. **Complete the pipeline to M.** Staging PR, required checks green, staging merge, promote PR into main, merge. If a merge is refused under `lock_branch.enabled=true`, STOP merging: run the release-wait protocol (park one entry of your own in `.release/merge-queue.json`, record block reason and resume action, continue independent work, wait for the notify workflow). Never retry, force-push, or admin-merge against a lock.
3. **Wait for main's own push-run.** Main validates its own tests at full depth. Do not proceed to preflight until the push-run checks on the exact merge SHA M are complete.
4. **Run the 7-step dispatch preflight** (`../references/dispatch-preflight-checklist.md`), in order, with no skips. On any refusal code, resolve via `../references/refusal-code-lookup.md`, then resume from the failed step. Try the same failed approach at most twice; a third failure means an unknown root cause: stop and report.
5. **Dispatch** exactly as the checklist specifies: exact 40-char SHA, fresh release ID, kind, operation, and the computed confirmation string. Missing confirmation -> HTTP 422.
6. **Watch the run.** Preflight (gates), execute (migrations, candidate, promote, canonical verify, queues), post-deploy smoke (live marker match). Production effects are serialized; concurrent dispatches queue. Do not attempt to cancel an in-flight release.
7. **Thaw and re-lock** (checklist step 7): freeze vars to inactive and cleared, local advisory updated, both branches re-locked.
8. **Write the run-watch report** (`../references/run-watch-report-template.md`) with real run URLs as evidence. Shipped means verified-shipped: a live releaseSha match, not a green workflow.

Rules that always hold:
- Freeze and approval state are read LIVE from GitHub (protection endpoint, repo variables). The local `.release/` advisory file is never evidence.
- Checks are trusted only from the check-runs API on the exact SHA, never `gh pr checks`.
- Every refusal is a stop-and-fix, never a retry loop; each failed cycle historically cost ~15 minutes.
