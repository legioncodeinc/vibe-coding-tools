<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Daily task worktrees

- Start feature tasks with `npm run task:start -- --slug <safe-slug>`; use `--hotfix` only when the task
  must explicitly begin from `origin/main`. Worktree isolation covers files and Git state only, never shared
  staging databases, Redis, queues, service ports, provider accounts, or credentials.
- Do not copy `.env*`, ignored runtime state, browser profiles, production secrets, or provider configuration into
  another task directory. Set up task-local dependencies and approved configuration independently.
- `status`, `sync`, and `retire` preserve tracked, untracked, and ignored files. Sync refuses tracked/untracked
  state and allows ignored runtime files only after checking incoming-path collisions with Git's
  `--no-overwrite-ignore` guard; retirement remains fully clean-only. Do not use reset, clean, or force to work
  around a refusal. Resolve sync conflicts manually or use `git merge --abort` to restore pre-sync.
- `.release/release-freeze.json` is local advisory status only and may be stale. The release coordinator requires
  live GitHub branch-protection responses with `lock_branch.enabled=true` and `enforce_admins.enabled=true`.
  A ruleset alone is not accepted as substitute evidence, and required checks alone are not a freeze. The
  production coordinator validates the approved main SHA through external release bindings. Task tooling
  never changes either release branch or the freeze record.

## Environment notes (macdev agent plane)

- This machine has NO Docker, Colima, or Homebrew, by owner decision. Do not install them.
- Run the app and tests with npm scripts directly (Node 22 is installed).
- Never run brew install, colima, or docker commands here; they will be blocked and waste the session.

## Production shipping approvals (owner decision 2026-09-25)

An explicit owner instruction to deliver work to production main (for example "complete, merge, and push
to production main", "ship it", "deploy this") is the owner approval for the full default pipeline:
implementation -> staging PR and merge -> promote PR and merge into main -> production release dispatch.
No additional mid-pipeline human confirmation is required while that authorization is in force. Agents
acting under it must still: run the pipeline's required checks and treat their failure as a stop, honor an
active release freeze (live `lock_branch.enabled=true` plus `enforce_admins.enabled=true`) as a stop,
record the authorization on the shipping PR, and dismiss a reviewer-bot CHANGES_REQUESTED only after its
findings are triaged (fixed in the PR, fixed in an immediate follow-up, or assigned to the owning task).
The owner's instruction authorizes the pipeline, never a skip of its gates: an operator-action merge past
a base-branch posture (such as the prelaunch staging-only autonomous-merge rule) is exactly the
owner-authorized step, but required checks must be green first.

## Release-wait protocol (merge freeze, 2026-09-29)

When a merge into main is refused while `lock_branch.enabled=true` (live GitHub setting; the local
`.release/release-freeze.json` is advisory only), any agent session follows this protocol instead of
retrying or stalling:

1. Detect once: check `lock_branch.enabled` (or run `node scripts/release/wait-unlock.mjs main`). Record
   the block reason and the exact resume action in the task's ledger or PR body. Never retry the merge,
   force-push, or attempt an admin merge against a lock; the freeze is owner-controlled.
2. Park: append your own entry to `.release/merge-queue.json` (`{pr, branch, readyCommit, resumeAction,
   parkedAt, parkedBy, status: "waiting"}`). Edit only your own entry; never another session's.
3. Continue: proceed with any work in your task that does not depend on the merge. Set at most one
   low-frequency check (>= 120s interval) or rely on the `Merge Queue Notify` workflow, which comments
   on parked PRs when the lock lifts. The workflow notifies; it never merges. The owning session
   executes its own resume action.
4. Unblock: when the lock lifts, the owning session removes its queue entry after merging.
