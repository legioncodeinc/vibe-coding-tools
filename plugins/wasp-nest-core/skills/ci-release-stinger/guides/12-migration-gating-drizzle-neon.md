# 12 - Database migration gating in CI: Drizzle + Neon branches

Primary case. This skill owns the CI gating logic around when and how a Drizzle migration runs in a workflow. Drizzle migration mechanics themselves (schema design, `generate`/`migrate`/`push` semantics, RLS) belong to `neon-drizzle-stinger` - consult it, don't re-derive it here.

## The four official Neon GitHub Actions

`neondatabase/create-branch-action`, `delete-branch-action`, `reset-branch-action`, `schema-diff-action`. The Neon GitHub integration (set up once from the Neon console) auto-provisions a `NEON_API_KEY` repo secret (manages the Neon project: branch create/delete) and a `NEON_PROJECT_ID` repo variable. Keep this deliberately separate from the persistent-production `DATABASE_URL` secret, which is added manually and used **only** after a merge - never let the branch-management key and the production connection string share a code path. Source: `research/distilled-ci-release.md` §4.

## The canonical PR-lifecycle gating shape

Trigger: `on: pull_request: types: [opened, reopened, synchronize, closed]`, with a `concurrency:` block keyed on `${{ github.workflow }}-${{ github.ref }}` to prevent races from rapid successive pushes to the same PR.

**On open/reopen/synchronize:**
1. Create an ephemeral branch, named by convention `preview/pr-<number>-<branch-name>`.
2. Run `drizzle-kit generate` then `drizzle-kit migrate` against **that branch's own connection string** - never the shared production secret.
3. Post a schema-diff PR comment (`schema-diff-action`) comparing the new branch against its parent.
4. If the PR also needs e2e coverage, build and start the app against the branch's pooled connection string, then run Playwright against the live app pointed at the isolated branch (see `guides/09-github-actions-job-shapes-sveltekit.md` for the e2e job shape itself).

**On close:**
1. Delete the ephemeral branch unconditionally - cleanup happens whether the PR merged or was abandoned.
2. **Only if `github.event.pull_request.merged == true`:** re-run the same `generate`/`migrate` commands against the real production `DATABASE_URL` secret.

**The core gating principle:** the exact migration validated against a disposable clone of real schema/data is the one applied to production, and only after the PR that owns it has actually merged - never as a side effect of merely opening or updating a PR. A broken migration fails the PR before it ever touches anything real. Source: `research/distilled-ci-release.md` §4.

## A concrete gotcha: job-output scoping

`create-branch-action`'s connection-string output (`db_url`, `db_url_pooled`) is scoped to the job that created it and is marked as a secret - it does not automatically flow to a downstream job in the same workflow. Write the migration, build, and test steps that need the branch's URL inside the **same job** that created the branch, or build an explicit propagation mechanism (workflow artifact, re-derive via the Neon API) if a multi-job split is unavoidable. Source: `research/distilled-ci-release.md` §4.

## The Vercel-Managed shortcut

If the project uses the Vercel-Managed Neon integration, every Preview Deployment already gets a fresh Neon branch automatically with no custom Action required. `neon-drizzle-stinger`'s own research recommends the **Neon-Managed** integration by default instead (predictable git-branch-deletion cleanup vs Vercel-deployment-retention cleanup that can lag months) - if the team is on Neon-Managed, the explicit GitHub Actions workflow above is the mechanism, not a Vercel-side shortcut. Confirm which integration path is active before assuming migrations are already gated automatically.

## Severity framing for this skill's findings

- **Must-fix:** a migration running against the shared production database as part of a PR check (not gated to post-merge), or a migration step with no ephemeral-branch isolation at all.
- **Should-refactor:** an ephemeral branch created but never cleaned up on PR close (cost/clutter accumulation), a schema-diff step missing (reviewers can't see what a migration actually changes before approving).
- **Style:** branch naming convention drift, missing `concurrency:` block on a low-traffic repo.

## Cross-references

- `neon-drizzle-stinger` - Drizzle schema design, migration command semantics, RLS, the connection-pattern decision matrix. This guide assumes those decisions are already made; it only owns when/how the migration runs in CI.
- `guides/09-github-actions-job-shapes-sveltekit.md` - the e2e job shape a migration-gated branch feeds into.
- `doppler-stinger` / `guides/13-secrets-doppler-oidc.md` - if the production `DATABASE_URL` itself is Doppler-managed rather than a plain GitHub secret.
