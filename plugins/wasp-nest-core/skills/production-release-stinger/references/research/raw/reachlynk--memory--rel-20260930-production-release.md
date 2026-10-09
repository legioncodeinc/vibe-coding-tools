---
name: rel-20260930-production-release
description: "REL-20260930-PRD038039 shipped + verified; exact dispatch procedure learned across 5 attempts; production-release drone spec"
metadata:
  node_type: memory
  type: project
  originSessionId: b2db081b-6fe0-47a5-9586-d6186de54aa9
  modified: 2026-09-30T04:43:36.487Z
---

REL-20260930-PRD038039 is LIVE on production (dispatch run 36669299706, success 2026-09-30 ~04:39 UTC). Post-deploy smoke passed on first live run: production serves releaseSha=def1725a (PRD-038, PRD-039, nodemailer 10, all of REL-20260929). Freeze variables thawed (status inactive), both branches re-locked per protocol.

The dispatch procedure, learned across 5 failed attempts, in exact order:
1. Trees must match: main and staging tree IDs identical (main_staging_tree_mismatch). Sync whichever lacks the other's content via PR.
2. Freeze variables on GitHub (NOT the local .release file - that is advisory only): RELEASE_FREEZE_STATUS=active, RELEASE_FREEZE_SHA=<main sha>, RELEASE_FREEZE_ID=<id>, RELEASE_FROZEN_STAGING_SHA=<staging sha>. Mismatches produce external_freeze_* refusal codes.
3. Both branches lock_branch=true + enforce_admins=true (main_branch_not_locked / staging_branch_not_locked).
4. Confirmation string MUST be computed with scripts/release/release-contract.mjs releaseConfirmation() against the LIVE variable values (sourceSha comes from RELEASE_FROZEN_STAGING_SHA at runtime, not from the pre-sync plan output). Hand-built strings produce owner_dispatch_confirmation_mismatch.
5. The target main SHA's own required checks (Quality Gates, Dependency Audit, Sandbox MVP Regression, Release and Worktree Contracts) must be SUCCESS before dispatch (required_release_check_not_successful). After merging to main, WAIT for the push-run to complete first.
6. Dispatch: gh workflow run production-release.yml with release_sha, release_id, release_kind=normal, release_operation=release, release_confirmation. The workflow requires release_confirmation as an input (422 without it).
7. After success: thaw variables (status inactive, clear SHA/ID), update local advisory, verify post-deploy-smoke log shows live releaseSha match.

**Why:** the dispatch gauntlet is the last unautomated segment; every refusal code above was hit live.
**How to apply:** forge the production-release drone using this memory + the delivery-pipeline.md knowledge doc as research corpus. The drone runs steps 1-7 as preflight-before-dispatch, replacing 5 attempts with 1. Related: [[ci-overhaul-prd-pending]], [[fly-decommission-task]] (FLY_API_TOKEN secret deletion + recover-* decommission still queued owner decisions).
