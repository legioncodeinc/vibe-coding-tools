# Guide: audit-posture

Grounded in `references/research/distilled-ci-to-deploy-posture-and-tiers.md` (raw citations there); the instrument is `../references/audit-questionnaire.md`, the scoring frame is `../references/tier-taxonomy-and-install-runbooks.md`.

Audit a project's CI-to-deploy posture and assign it a tier, with evidence.

1. **Scope the repo.** Identify the production branch, the deploy platform (Vercel/GH Pages/other), and all deploy-relevant workflows (`.github/workflows/` or equivalent).
2. **Read the live signals, not the docs.** Docs and local status files are advisory (Reachlynk's `.release/release-freeze.json` may be stale; the live signal is the protection endpoint). Run the questionnaire (section A-F) with an evidence path per answer:
   - Deploy triggers and mechanism (workflow files, platform integration).
   - Classic branch-protection endpoint per release branch: `lock_branch.enabled`, `enforce_admins.enabled`, `required_status_checks.checks[]`.
   - Rulesets separately: `enforcement`, `bypass_actors` (and remember rulesets cannot express lock_branch).
   - Environments actually exist WITH rules (referencing a nonexistent environment auto-creates it with none).
   - Concurrency groups on production-touching workflows; `cancel-in-progress` values.
   - Vercel: Auto-assign Custom Production Domains state, Staged/Promoted/Current observations, promotion path.
3. **Test check integrity.** For each required check, confirm it actually runs at meaningful depth on the branch it protects (push events inheriting PR skips is the PR #872 rubber-stamp failure). Look for duplicate check display names, and for zombie third-party suites (vercel/coderabbitai) that sit QUEUED on rewritten commits without blocking anything.
4. **Classify the tier.** Match the signals to the taxonomy table (0-3). Mixed signals: record them; do not average them away.
5. **List findings.** Every requirement of the assigned tier that is missing or unverifiable becomes a finding, each with evidence and severity. Dependency-audit failures get classified regression vs advisory-drift if applicable.
6. **Deliver the audit report:** assigned tier + confidence, findings table, and (if the audit was requested with an upgrade in mind) the recommendation ladder entry, per `recommend-upgrade.md`. The audit never changes anything; installs are a separate explicitly-requested action (`install-tier.md`).
