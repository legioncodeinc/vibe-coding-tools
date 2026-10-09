# Guide: recommend-upgrade

Grounded in `references/research/distilled-ci-to-deploy-posture-and-tiers.md` (raw citations there).

Turn an audit into an upgrade decision the owner can approve in one read.

1. **Start from the audit's tier and findings.** A recommendation without a fresh audit is a guess; run or read `audit-posture.md` output first.
2. **Apply the ladder trigger conditions** (one step at a time; never recommend skipping a tier):
   - **0 -> 1** when anyone besides the author depends on the product. Cost: one protection rule + one workflow. Buys: merges must prove themselves (the rubber-stamp lesson: a required check that silently skips on the branch it protects validated a knowingly broken test green).
   - **1 -> 2** when a bad deploy must be recoverable as an artifact decision: staged candidates + promote-no-rebuild give reviewability and a rollback path (Instant Rollback for previously-Current deployments; env vars are NOT rebuilt on rollback, a real caveat to state).
   - **2 -> 3** when production carries money, auth, background queues, or migrations, or when more than one operator can trigger deploys. Buys: exact-SHA binding, freeze + live locks, checks proven on the exact SHA, serialized production effects, verified-shipped smoke. Cost: the dispatch gauntlet; each of its refusal codes exists because that failure occurred live, so budget operator learning time.
3. **Write the recommendation memo:** current tier (with confidence and the two strongest signals), recommended tier, trigger condition met, what gets installed (point at the runbook section), blast radius of the install (which settings/workflows change), verification plan, and effort estimate. State explicitly what stays broken if the upgrade is declined (the audit findings remain).
4. **Stop at the memo.** Installing is a separate owner-approved action (`install-tier.md`). A recommendation is data for the owner's decision, not consent to change anything.
5. **Decline gracefully.** If the trigger condition is not met, say so plainly: the current tier is adequate; list the cheap hygiene fixes from the audit (unique check names, aggregate check, environment rules on auto-created environments) instead of a tier jump.
