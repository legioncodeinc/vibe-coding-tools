# CI-to-deploy posture audit questionnaire

Work top to bottom; each answer either assigns a tier signal or is an audit finding. Record evidence (file path, API response field, dashboard state) per answer.

## A. Deploy trigger and mechanism

1. Is the repo connected to a deploy platform with automatic Git deploys (Vercel GitHub app, etc.)? Which environment does a push to the production branch reach?
2. Does any repo workflow deploy, or does the platform handle it? `workflow_dispatch`-only or event-triggered?
3. Is there a separate promote step between build and production traffic (staged production build, `vercel promote`, `--skip-domain`)? Or does the merge itself promote (Vercel default: merge to production branch auto-promotes)?
4. Can a deploy be triggered by more than one actor/mechanism? (workflow_dispatch + push + CLI = unserialized surface)

## B. Branch protection (read the classic protection endpoint, not just rulesets)

5. For each release branch: `lock_branch.enabled`? `enforce_admins.enabled`?
6. `required_status_checks.checks[]`: which contexts are required? Does each actually run at meaningful depth on this branch, or does it skip (rubber stamp)?
7. If lane-scoped skipping exists, is there an aggregate check that branch protection requires instead?
8. Are rulesets present? Note enforcement (active/evaluate/disabled) and bypass_actors. Remember: rulesets cannot express lock_branch.

## C. Environments (GitHub) / project settings (Vercel)

9. Which environment names do deploy jobs reference? Do those environments actually exist with rules (a referenced-but-uncreated environment auto-creates with NO rules)?
10. Required reviewers, wait timer, admin bypass toggle, deployment branch policy: which refs may deploy?
11. Concurrency: does every production-touching workflow declare a `concurrency` group? `cancel-in-progress` value and why? (For production releases: cancel-in-progress: false; cancellation can strand queues.)
12. Vercel-specific: Auto-assign Custom Production Domains on/off? Deployment states observed (Staged/Promoted/Current)? Is Instant Rollback usable (a past Current exists)?

## D. Checks integrity

13. Do main pushes re-run checks at full depth (main validates its own tests), or do push events inherit PR skips?
14. Are check display names unique per branch? (Duplicate names create a skipped duplicate that blocks mergeability.)
15. Are there third-party check suites that can sit QUEUED forever (vercel/coderabbitai apps on rewritten commits)? Are any falsely treated as blockers?
16. Dependency audit failures: is there a documented regression-vs-advisory-drift classification (byte-compare lockfile against last green run)?

## E. Release discipline (only if Tier 2+ signals present)

17. Are deploys bound to an exact immutable SHA, or to whatever HEAD is at deploy time?
18. Is there a freeze mechanism, and is it LIVE (repo vars + branch locks) or advisory (a local status file)?
19. Is any confirmation/acknowledgement computed from live state rather than hand-built?
20. Are required checks verified on the exact release SHA (check-runs API) rather than on PR merge refs (`gh pr checks` reports green earlier)?
21. Migrations: one transaction per file, gated behind release ownership? Queues/workers held during the switch?
22. Is "shipped" verified from the live system (post-deploy smoke comparing a release marker), or inferred from workflow success?
23. Is there a documented wait-protocol for merges refused under a freeze (park, notify, resume), or do sessions retry/stall?

## F. Scoring

- Count Tier signals from section A-C answers against the taxonomy table.
- Findings list: every "no"/"unknown" on B-E that the target tier requires.
- Upgrade recommendation: the ladder (0->1->2->3) with the trigger condition each upgrade answers.
