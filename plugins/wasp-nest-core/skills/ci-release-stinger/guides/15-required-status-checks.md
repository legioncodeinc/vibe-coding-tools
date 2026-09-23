# 15 - Required status checks and how to make them actually satisfiable

Primary case. `github-repo-health-stinger` owns branch protection/ruleset **configuration** and the repo-settings audit; this guide owns the CI-authoring side, making sure a workflow's checks can actually be required without falling into one of the documented traps below. Consult `github-repo-health-stinger/guides/02-branch-protection.md` for the settings-side scoring rubric rather than duplicating it here.

## The mechanics that matter for a workflow author

A required status check must report `success`, `skipped`, or `neutral` to satisfy the requirement - both `skipped` and `neutral` count as passing, a common source of confusion. **Strict** mode ("require branches to be up to date before merging") re-tests the actual merge result but costs more required rebuilds; **loose** mode is cheaper but can let an untested merge combination through. Rulesets can layer with classic branch protection on the same branch; where the same rule is defined differently across layers, the **most restrictive** version wins. Source: `research/distilled-ci-release.md` §7.

## Three documented "skipped-but-required" traps - check all three before declaring a required check correctly wired

1. **Path/branch filtering leaves a check Pending forever.** A workflow skipped by `paths-ignore`, `branches-ignore`, or a skip-ci commit-message keyword never reports a status at all for that PR - if it's marked required, the PR is permanently blocked, not passed. Avoid requiring workflows that can be conditionally skipped.
2. **A dependent job silently skips on upstream failure.** A job that `needs:` a failed job is itself skipped by default and may not correctly report failure for a required-check purpose. Use `always()` combined with `needs` for any required-check job with upstream dependencies, so it explicitly reports failure rather than silently skipping.
3. **`paths:` filtering leaves a PR with no matching trigger.** A PR that doesn't touch any file matching a workflow's `paths:` filter never runs that workflow - if it's required, the PR is stuck "Waiting for status to be reported" indefinitely.

Source: `research/distilled-ci-release.md` §7.

## Job naming under a matrix (Playwright sharding, Node version matrix, etc.)

Required-check naming depends on check type: a plain workflow's check name is the job name; a reusable workflow's is `<workflow-name> / <job-name>`. **Job names must be unique across all workflows in the repo** - the same job name in two workflows causes ambiguous status-check results that can block merging even when the intended check actually passed. This matters directly for this skill's sharded Playwright job shape (`guides/09-github-actions-job-shapes-sveltekit.md`): a matrix job's reported check name includes the matrix values (e.g. `test (shard 2/4)`), so requiring "all shards" as a single required check needs either the merge job (which runs after all shards) as the required check, not the individual shard jobs, or explicit enumeration of every shard's generated name.

## Merge queue gotcha

If the repo uses a merge queue, every required-check workflow must add `merge_group` as an additional trigger alongside `pull_request`/`push`, or the check never fires when a PR enters the queue - `merge_group` is a genuinely separate event, not a variant of the other two. A queued merge fails when a required status was simply never reported for that queue-generated check context. Source: `research/distilled-ci-release.md` §7.

## Severity framing

- **Must-fix:** a required check that can be conditionally skipped by path/branch filtering (permanent block risk); a merge-queue-enabled repo whose required workflows lack `merge_group` in their trigger list.
- **Should-refactor:** a required-check job name that collides with another workflow's job name; a dependent job missing `always()` where upstream failure should still report.
- **Style:** loose-vs-strict mode choice without a documented rationale.

## Cross-references

- `github-repo-health-stinger` - branch protection/ruleset settings configuration and the repo-hygiene scoring rubric. This is also part of the Ship Gate close-out (see `SKILL.md`).
- `guides/09-github-actions-job-shapes-sveltekit.md` - the job shapes whose names this guide's naming-collision rule applies to.
