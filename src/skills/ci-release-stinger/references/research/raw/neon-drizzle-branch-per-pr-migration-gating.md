# Neon branch-per-PR CI: ephemeral database branches, Drizzle migration gating, teardown

- URL: https://neon.com/docs/guides/branching-github-actions ; https://neon.com/guides/neon-github-actions-authomated-branching ; https://neon.com/guides/e2e-playwright-tests-with-neon-branching ; https://neon.com/faqs/postgres-providers-developer-experience-gitops-database-workflows
- Fetched: 2026-08-14
- Source type: Official Neon docs and guides
- Component: CI database migration gating / Neon branch-per-PR / Drizzle

## Content

### The four official Neon GitHub Actions

Neon publishes four composable Actions for CI branch lifecycle, listed on `neon.com/docs/guides/branching-github-actions`:

- `neondatabase/create-branch-action` - creates a new branch (copy-on-write clone, inherits parent schema + data instantly). Outputs a connection string (`db_url`, and `db_url_pooled` for the pooled variant) usable in later steps of the **same job** only - the docs explicitly warn these step outputs are scoped to the job that created them and are marked as secrets, so a multi-job workflow needing the branch URL across jobs needs its own mechanism (e.g. workflow artifacts or re-deriving via the API) rather than assuming outputs propagate.
- `neondatabase/delete-branch-action` - deletes a named branch, used for cleanup once a PR closes.
- `neondatabase/reset-branch-action` - resets a branch back to its parent's current state, useful for refreshing a long-lived staging branch rather than a strictly ephemeral PR branch.
- `neondatabase/schema-diff-action` - diffs two branches' schemas and posts the result as a PR comment.

Authentication: the **Neon GitHub integration** (connect a Neon project to a GitHub repo from the Neon console) auto-provisions a `NEON_API_KEY` repo secret and a `NEON_PROJECT_ID` repo variable - this is the fast path and skips manual secret setup. `NEON_API_KEY` is scoped to managing the Neon project (branch create/delete); it is explicitly **not** the same secret as a `DATABASE_URL` pointed at the persistent production branch, which must be added separately and is used only after a merge, keeping ephemeral-branch credentials and production credentials on separate, non-overlapping paths.

### The canonical PR-branch-lifecycle workflow shape

Triggered `on: pull_request: types: [opened, reopened, synchronize, closed]`, with a `concurrency: group: ${{ github.workflow }}-${{ github.ref }}` block to prevent race conditions from rapid successive pushes to the same PR.

**On open/reopen/synchronize** (one job):
1. Create a branch named by convention `preview/pr-<number>-<branch-name>` (via `tj-actions/branch-names` to resolve the branch name cleanly first).
2. Run migrations against that branch's connection string: `npm run db:generate && npm run db:migrate` (Drizzle Kit), with `DATABASE_URL` set to the just-created branch's output, not the shared production secret.
3. Post a schema-diff PR comment comparing the new branch against its parent.
4. (Optional, e2e variant) Build and start the app against the branch's pooled connection string, install Playwright browsers, run the full e2e suite against the live app pointed at the isolated branch, then upload the Playwright report as an artifact.

**On close** (a second job, gated `if: github.event.action == 'closed'`):
1. Delete the ephemeral branch unconditionally (cleanup happens whether the PR merged or was abandoned).
2. **Only if `github.event.pull_request.merged == true`:** re-run `db:generate` + `db:migrate` against the real production `DATABASE_URL` secret, applying the same migrations that were validated on the ephemeral branch now to the persistent database.

This ordering is the core migration-gating pattern: **migrations run against an isolated, disposable clone first as a CI gate; the exact same migration only touches production after the PR that owns it has actually merged**, never as a side effect of opening or updating a PR.

### Vercel-specific shortcut

Per the Neon FAQ entry on GitOps database workflows: "If you're on Vercel, the Vercel-Managed Integration wires the same flow up without a custom GitHub Action. Every Preview Deployment gets a fresh branch automatically." (Cross-reference: this is the Neon-integration behavior covered in vercel-stinger's own Neon integration research; this skill's job is the GitHub-Actions-side gating logic when the migration step needs to run and be reported on independent of, or in addition to, Vercel's own automatic per-preview branch.) For teams NOT relying on the Vercel-Managed path (e.g. using Neon-Managed integration, which `neon-drizzle-stinger` recommends by default per that skill's own research), the explicit GitHub Actions workflow above is the mechanism.

### Cost/lifecycle note relevant to a gating decision

Per the Neon FAQ: preview branches don't receive production data by default in some documented patterns; they are seeded from `seed.sql` in others - the exact default depends on whether the branch is created as a full copy-on-write clone (inherits parent data instantly, the behavior `create-branch-action` documents) versus a schema-only seed path. A Neon branch's compute is a separate add-on billed from a low hourly rate and scales to zero when the preview deployment goes idle, which is why per-PR branches are cost-viable at PR-lifecycle timescales rather than requiring a shared staging database.

### Failure-mode framing for CI gating

Per the Neon guide's own framing (`scriptly.store` blog, secondary source, directional not authoritative): "If the migrations run successfully, the PR passes. If they fail, the PR fails, protecting your production database." This is the entire point of branch-per-PR migration gating as a CI concept: a broken migration is caught against a disposable copy of real schema/data *before* merge, not discovered against production after merge.
