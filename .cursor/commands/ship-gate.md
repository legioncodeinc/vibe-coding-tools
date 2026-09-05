---
description: Run the Ship Gate on demand against the current diff, security-stinger first, then quality-stinger, then a hard reminder to load github-repo-health-stinger. Trigger with "run the ship gate", "gate this before I commit", "security and quality pass on this branch", "is this safe to push", "check my diff before I ship it".
---

# /ship-gate - On-Demand Ship Gate

Nothing ships around the Ship Gate. This command runs it standalone, against whatever is sitting in the working tree right now, no PRD or Bee dispatch required to trigger it.

## Mandatory process

1. Load `.cursor/skills/beekeeper-suit/SKILL.md` (the roster) and consult it before any routing decision. This is the first step, always, no exceptions.
2. Establish scope. Run `git status` and `git diff` (add `--staged` too if anything is staged) and state plainly, in your first line back to the user, exactly what you audited: which files changed, roughly how much, and whether the diff sits on a clean `main` or on top of other unmerged work. An empty diff means there is nothing to gate; say so and stop.
3. Dispatch `security-worker-bee`, armed with `security-stinger` per the arming contract in `beekeeper-suit/SKILL.md`, scoped to exactly the diff from step 2. Write its findings to `library/requirements/reports/<YYYY-MM-DD>-security-audit.md`, or the matching PRD or issue `qa/` subfolder if the diff maps to one already in progress.
4. Resolve every medium-or-above finding from step 3, then re-run `security-worker-bee` in full against the updated diff. Do not move on to quality while a medium-or-above finding is still open.
5. Dispatch `quality-worker-bee`, armed with `quality-stinger`, only after step 4 comes back clean. Write its findings to `library/requirements/reports/<domain>/<YYYY-MM-DD>-qa-report.md`, or the matching PRD or issue `reports/` path. Never run this before security; if quality already ran out of order this cycle, flag the ordering violation instead of trusting the result.
6. Resolve every medium-or-above finding from step 5, then re-run `quality-worker-bee` in full.
7. Tell the orchestrating agent directly, in plain words, to load `github-repo-health-stinger` itself now, before anything is committed or pushed. This command does not run that gate on the orchestrator's behalf; the check only counts if the orchestrator does it.
8. Report to the user: what was audited, both report file paths, every medium-or-above finding and how it was closed, and that the diff is now waiting on their review and explicit approval before anything is committed or pushed.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
