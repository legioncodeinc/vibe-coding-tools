# GitHub required status checks and branch protection / rulesets (current docs)

- URL: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets ; https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches ; https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks ; https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- Fetched: 2026-08-14
- Source type: Official GitHub docs
- Component: Required status checks / branch protection rulesets

## Content

### Rulesets vs classic branch protection rules: current recommended path

GitHub now documents two mechanisms that can both apply to the same branch simultaneously: classic **branch protection rules** (only one can apply to a given branch at a time) and the newer **rulesets** (multiple rulesets can target the same branch concurrently, and they layer with each other and with any classic protection rule - where the same rule is defined differently across layered sources, **the most restrictive version wins**). Rulesets add: changeable enforcement status without deleting the ruleset (`Active` vs `Disabled`, plus an `Evaluate` mode that runs a check without blocking merges yet, useful for dry-running a new required check before it becomes blocking), and read visibility for anyone with repo read access (not just admins) so contributors can see what's required without needing elevated permissions. GitHub's own migration path (`Converting branch protections to rulesets`) exists for repos still on the classic mechanism.

### Required status checks: the core mechanics

A required status check must complete with a `success`, `skipped`, or `neutral` outcome before a PR can merge into the protected branch/tag - `skipped` and `neutral` both count as passing, which is a common source of confusion when a workflow is conditionally skipped but still shown as satisfying a requirement.

**Strict vs loose vs disabled** (the exact three states, verbatim distinction from the docs):

| Type | Setting | Merge requirement | Tradeoff |
|---|---|---|---|
| Strict | "Require branches to be up to date before merging" checked | Branch **must** be up to date with base before merge | More required rebuilds (must re-run checks after base branch moves), but guarantees the checked commit reflects the actual merge result |
| Loose | Same checkbox unchecked | Branch does **not** need to be up to date | Fewer required builds, but status checks can fail post-merge if the merge combination wasn't itself tested |
| Disabled | "Require status checks to pass before merging" unchecked entirely | No merge restriction | Fastest but no CI gate at all |

### Check name format for required status checks (the thing that silently breaks required-check config)

Per GitHub's troubleshooting doc, the exact string a ruleset/protection rule must reference depends on check type: a plain **workflow**'s check name is just the job name; a **reusable workflow**'s is `<workflow-name> / <job-name>`; other check types use their own reported name. Job names must be **unique across all workflows** in the repo, or ambiguous status-check results can block merging even when the intended check passed - this is explicitly flagged with a `[!TIP]` callout in the docs as a common source of "required check never satisfies" bugs.

### Skipped-but-required is a real trap, with three documented causes

Per the troubleshooting doc's table:
1. A workflow skipped by path-filtering (`paths-ignore`), branch-filtering (`branches-ignore`), or a skip-ci commit message keyword: the associated check stays **Pending forever** and blocks merge, because the required check literally never ran to report a `skipped`/`success`/`neutral` status on that PR. Mitigation stated plainly: "Avoid requiring workflows that can be skipped."
2. A job that `needs:` a failed job is itself skipped, and depending on configuration may not correctly block merging - the fix is using `always()` combined with `needs` for any required check job that has upstream dependencies, so it explicitly reports failure rather than silently skipping.
3. A PR that doesn't touch any file matching a workflow's `paths:` trigger filter never runs that workflow at all - if that workflow's job is marked required, the PR is stuck "Waiting for status to be reported" indefinitely.

### Merge queues need an explicit trigger addition

If a repo uses required status checks together with GitHub's **merge queue**, workflows performing the required checks must add the `merge_group` event as an *additional* trigger alongside `pull_request`/`push` - the docs are explicit that without this, checks never fire when a PR enters the merge queue, and the queued merge fails because the required status was never reported for that specific queue-generated check context. `merge_group` is documented as a genuinely separate event type from `pull_request` and `push`, not a variant of either.

### Restricting which source can set a given check

A required status check can optionally be scoped to only accept a report from a specific GitHub App (rather than "any source" with write access). This closes a gap where any integration or user with write permission could otherwise set an arbitrary status with the same name as a required check and satisfy the requirement without the real check having run.

### Practical framing for this skill

When authoring a `required status checks` recommendation, name the exact job-name-as-it-will-appear (not just the workflow file name), confirm the workflow's trigger (`on:`) actually fires for the PR shape being gated (including `paths:` filters), and if the repo uses a merge queue, confirm `merge_group` is added to every required workflow's trigger list - these three checks catch the majority of "required check never satisfies" failures documented above.
