# Worktree contract

One session, one checkout, one branch. Parallel work on a shared repository
happens in separate git worktrees, never in one shared checkout, and never
directly on main.

This rule binds every agent session in every harness. It fills the gap that
plan construction leaves open: a plan document forces worktree-first, but a
plain task prompt produces no plan, and that is exactly where sessions
collide.

## The contract

1. **Preflight.** Before editing files in a repository where another session,
   worker, or background agent may be active, run `git worktree list` and
   read it. Those are your siblings' claims. Note the paths and branches
   already taken.
2. **Claim.** Create your own worktree and branch, named after the task with
   a unique suffix so no sibling can collide by picking the same slug:
   `git worktree add -b feature/<slug>-<shortid> ../<slug>-<shortid> main`.
   The shortid comes from the task, sitting number, ticket, or a fresh
   4-character value. If the path or branch already exists in
   `git worktree list` or `git branch --list`, it is claimed: pick another.
3. **Stay inside.** Do all file work inside your worktree. A shared checkout
   on main is read-only reference material, not a workspace. Commits land on
   your branch only.
4. **Managed worktrees win.** If the harness already placed this session in
   a managed worktree (a T3 Code thread handoff, a spawned worker's assigned
   checkout), use that checkout as-is and create no second worktree. Run
   `git rev-parse --show-toplevel` if unsure where you already are; nesting
   your own worktree inside a managed one is always wrong.
5. **Respect siblings.** Never modify, delete, rename, prune, or "clean up"
   another session's worktree, branch, or scratch files. Stray-looking files
   are active work. Report them, leave them.
6. **Retire.** When the task ends, merge the branch or explicitly abandon
   it, then remove the worktree and delete unmerged branches you created:
   `git worktree remove ../<slug>-<shortid> && git branch -D feature/<slug>-<shortid>`.
   A clean exit leaves `git worktree list` with no orphans from your session.

## Examples

- BAD: Two herdr panes run in the same checkout of a repo on macdev; both
  edit `src/`, and the second commit stomps the first. (One checkout, two
  sessions.)
- GOOD: Each pane runs `git worktree list` first, then works in
  `../auth-7f3a` and `../auth-docs-c91d` on its own branch.
- BAD: An agent sees a stale-looking `../feature-x` directory and runs
  `git worktree remove` on it as cleanup. (It was another session's active
  work; see the respect agent work boundaries rule.)
- BAD: A T3 Code thread was handed off into a managed worktree, and the
  agent runs `git worktree add` inside it because a plan template said to.
  (Managed worktrees win; no nesting.)

## Notes

- The bare-hub pattern (a bare clone with worktrees only) suits always-on
  build machines with many parallel sessions; see the git stinger worktree
  guide.
- A preflight that shows only your own session's claims means a plain branch
  in the existing checkout is acceptable; the contract's naming, respect,
  and retirement rules still apply.
