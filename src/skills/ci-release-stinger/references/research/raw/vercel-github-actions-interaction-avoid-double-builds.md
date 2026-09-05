# Vercel's Git integration vs GitHub Actions: division of labor, and how to avoid double-building

- URL: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel ; https://vercel.com/docs/git/vercel-for-github ; https://github.com/vercel/examples/tree/main/ci-cd/github-actions
- Fetched: 2026-08-14
- Source type: Official Vercel docs + knowledge-base guide + official Vercel examples repo
- Component: Vercel + GitHub Actions interaction / avoiding duplicate builds

## Content

### What Vercel's own Git integration already does, with zero YAML

Per `vercel.com/docs/git/vercel-for-github`: Vercel deploys every push by default, on every branch, including pull request branches. If Vercel is already building a commit on a branch and a new commit lands on the same branch, the in-flight build finishes, the newest commit gets queued, and any commits queued in between are cancelled, so the branch always converges on the latest commit's deployment without a pileup.

Per the Vercel knowledge-base guide (`vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel`, fetched 2026-07-23): "most teams need no pipeline at all" once the Git integration is connected - every PR gets a preview URL with zero configuration, framework detection picks build settings without a YAML file, every deployment is immutable and retained indefinitely, and Instant Rollback is a pointer update, not a rebuild.

**The explicit guidance on when GitHub Actions belongs at all:** add it only for tests, security scans, performance budgets, or approval gates - "the four things Vercel does not run." If a workflow isn't doing one of those four things, adding GitHub Actions on top of Vercel's own Git integration "makes your pipeline worse," because it creates a second system that also thinks it owns the build, and the two now have to be kept in agreement.

### The mechanical cause of a duplicate build, and the fix

If a GitHub Actions workflow lints, type-checks, and builds a SvelteKit app, then triggers a Vercel deployment (via the CLI or by simply having the Git integration also enabled on the same push), Vercel runs the build a **second time** unless told not to. This doubles CI minutes and slows feedback for no correctness benefit, per the KB guide's explicit framing of this as the most common integration mistake.

The fix is the `--prebuilt` flag, via the three-command Vercel CLI pattern documented in both the KB guide and the official `vercel/examples` repo:

```bash
npm install --global vercel@latest
vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
vercel build --token=${{ secrets.VERCEL_TOKEN }}
vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

For production: `vercel pull --yes --environment=production ...`, `vercel build --prod ...`, `vercel deploy --prebuilt --prod ...`. `--prebuilt` decouples where the build runs (the GitHub Actions runner) from where the deployment is hosted (Vercel's edge network): the build runs in Actions, only the compiled `.vercel/output/` folder uploads to Vercel, and Vercel serves it without rebuilding. This buys two things beyond avoiding the double build: source-code privacy (only build output ships, not source), and the ability to gate a deploy on test results, since build and deploy are now two discrete steps a check can sit between.

**If a project runs GitHub Actions as its deploy mechanism, the native Git integration must be explicitly disabled or both systems will deploy on the same push.** Set in `vercel.json`:

```json
{ "git": { "deploymentEnabled": false } }
```

Without this, both the built-in Git integration and an Actions-based deploy workflow fire independently on the same commit - two deployments per push, not one.

### The reverse direction: Vercel triggering GitHub Actions

Vercel can send `repository_dispatch` events (`vercel.deployment.ready`, `vercel.deployment.error`) to the connected GitHub repo as deployment status changes, carrying the preview URL, environment, and status as JSON payload (`github.event.client_payload.url` etc. inside the triggered workflow). GitHub Actions can also trigger directly on the native `deployment_status` event. This lets end-to-end tests run against a real, already-live preview URL with no polling, no `sleep`, and no scraping a PR comment for the URL.

**Deployment Checks** hold a deployment back from promoting to production until selected checks pass, sourced from three places: Vercel's own native Deployment Checks (script-based lint/typecheck from `package.json`), GitHub Checks (reading commit statuses and Actions check-run results), and Marketplace Integration Checks (third-party testing/monitoring/observability tools). To wire GitHub Actions in as a gate: link the project to the GitHub repo, enable automatic aliasing on the production environment, then in the project's Deployment Checks settings choose **Add Checks -> GitHub** and select which workflows must pass before promotion.

The clean division this produces: **Vercel builds and hosts the preview/production deployment; GitHub Actions runs the checks Vercel doesn't (tests, security scans, performance budgets, approvals); production promotion waits on those checks.** No duplicate build, no wasted CI minutes rebuilding an artifact that already exists.

### Known limitations of the `--prebuilt` / Actions-driven path

- CLI-driven deployments don't carry the same `gitSource` metadata a native Git-integration deployment does - branch/commit info still shows in the dashboard, but branch-specific preview URLs are not generated the same way.
- Vercel's System Environment Variables (the ones Vercel injects automatically at build time, e.g. `VERCEL_GIT_COMMIT_SHA`) are not available during a `--prebuilt` build, because the build runs outside Vercel's own build environment. A framework relying on them at build time needs those values set manually in the Actions environment instead.
- As of this fetch, Vercel does not support OIDC for authenticating the GitHub Actions **deployment** itself (distinct from Vercel Functions authenticating outbound to AWS/GCP via OIDC, which does work). Deploy auth from Actions to Vercel is still a static `VERCEL_TOKEN` secret; a community feature request for token-less deploy auth exists but hadn't shipped as of this fetch.
