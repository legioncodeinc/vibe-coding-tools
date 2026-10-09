---
name: ci-overhaul-prd-pending
description: "PRD-038 SHIPPED (merged 2026-09-29 23:51 UTC); fast lane-smart CI live on main; AC-05 demo verified; next: PRD-039 authoring"
metadata:
  node_type: memory
  type: project
  originSessionId: b2db081b-6fe0-47a5-9586-d6186de54aa9
  modified: 2026-09-30T00:02:16.331Z
---

PRD-038 is SHIPPED: PR #909 merged into main 2026-09-29 23:51 UTC. New CI is live: sub-5-minute lanes (except Build ~5m12s, build-caching fast-follow), 6-shard vitest, coverage on nightly only, main validates its own tests (AC-05 demo proven: run 36647424549 went red on an intentionally broken test, aggregate gate behaved), release-wait protocol + merge-queue.json + merge-queue-notify.yml on main. PRD-036 CLOSED same day (superseded by #899, fixtures reconciled in #915, no product defect). #915 (fixtures+undici+repins) merged 23:47.

Environment facts that matter for every future session:
- main lock_branch is now OFF (owner authorized unlocking 2026-09-29 to ship 038). Re-locking is the release tooling's job; if a session finds it on, use the release-wait protocol, do not fight it. The protection API IS writable with owner token (gh api PUT branches/main/protection) - that was the unblock.
- lock_branch=true blocks admin merges absolutely; no workaround exists except turning it off.
- Batch-by-blast-radius rule for dispatches: any change touching package files, workflows, or shared scripts gets an "what contracts/pins/hashes reference this?" check FIRST (the reviewed-bytes repins in changed-files.mjs hash package files).
- PRD-039 brief is committed at .release/prd-039-brief.md (e2e delivery pipeline: knowledge map, deploy concurrency, Fly decommission, build caching, deploy verification) plus findings: advisory-drift audit policy, batch-by-blast-radius rule, nodemailer 9->10 decision, unmasked-regression class.

**Why:** PRD-038 took two days because latent breakage surfaced one at a time; the memory exists so PRD-039 batches instead of discovering.
**How to apply:** PRD-039 is also SHIPPED (PR #917 merged 2026-09-29 ~00:30 UTC): e2e delivery map at library/knowledge/private/infrastructure/delivery-pipeline.md, concurrency audits, Fly workflow removal, build caching, post-deploy smoke. Pending: AC-4/5/6 run-URL evidence from future CI (fly-io absent on fresh PRs, cache cold/warm timing, first production dispatch smoke). Owner decisions queued: delete FLY_API_TOKEN env secret + revoke at Fly; recover-*/release-runtime Fly path decommission (dead-in-practice, fails closed). Build-caching cold/warm timing closes PRD-038 AC-038-01.
