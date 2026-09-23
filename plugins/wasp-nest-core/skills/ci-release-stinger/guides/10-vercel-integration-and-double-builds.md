# 10 - How Vercel's own build/deploy interacts with GitHub Actions

Primary case. Vercel's own Git integration already builds and deploys on every push, before any GitHub Actions workflow this skill authors even starts. Get this wrong and CI duplicates work, or two systems fight over the same deploy.

## What Vercel does with zero YAML

Preview deployment on every push (any branch) and every PR; production deployment on a push/merge to the production branch. Framework detection, immutable indefinitely-retained deployments, Instant Rollback as a pointer update. If Vercel is already building a commit on a branch and a newer commit lands, the in-flight build finishes, the newest commit queues, anything queued in between is cancelled. Source: `research/distilled-ci-release.md` §2.

## What GitHub Actions should add on top - and only this

Tests, security scans, performance budgets, approval gates. **These are the four things Vercel's own pipeline does not run.** If a proposed workflow step isn't one of these four, question whether it needs to exist in Actions at all rather than defaulting to "add a CI job" - this is this skill's own bias to push back against per the research: "adding GitHub Actions on top of Vercel makes your pipeline worse" when it isn't doing one of these four things, because the two systems now both think they own the build. Source: `research/distilled-ci-release.md` §2.

## The duplicate-build failure mode

A workflow that lints/typechecks/builds a SvelteKit app and then triggers a Vercel deploy **without `--prebuilt`** makes Vercel rebuild the same artifact a second time. Two builds per commit, doubled CI minutes, slower feedback, for zero correctness benefit. **This is a Must-fix finding whenever the repo runs both a Git-integration deploy and an Actions-driven deploy on the same push.**

Fix, if the deploy runs through Actions at all (most repos on Vercel's native Git integration don't need to - see below):

```bash
npm install --global vercel@latest
vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
vercel build --token=${{ secrets.VERCEL_TOKEN }}
vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

`--prebuilt` decouples where the build runs (the Actions runner) from where the deployment is hosted (Vercel's edge network) - only the compiled `.vercel/output/` folder uploads, Vercel does not rebuild it. Production variant uses `--environment=production` on `vercel pull` and `--prod` on both `vercel build` and `vercel deploy --prebuilt`. Source: `research/distilled-ci-release.md` §2.

**If Actions owns the deploy, the native Git integration's auto-deploy must be explicitly disabled** or both systems deploy on the same push:

```json
{ "git": { "deploymentEnabled": false } }
```

## Which model this repo should default to

Default: **keep Vercel's native Git integration as the deploy mechanism, use GitHub Actions only for checks.** This is the lower-maintenance path and matches "most teams need no pipeline at all" for the deploy step itself. Only move to the CLI/`--prebuilt` path in Actions if there's a specific reason the native integration can't satisfy: GitHub Enterprise Server (whose docs explicitly require the Actions/CLI path since GHES can't use Vercel's built-in Git app), a need to gate the build itself (not just the deploy) on a check result before Vercel ever sees it, or a need to keep source code out of Vercel's build environment entirely.

## Gating production promotion on Actions checks (the recommended default for this repo)

Rather than moving the whole deploy into Actions, use Vercel's **Deployment Checks**: link the project's GitHub repo, enable automatic aliasing in production environment settings, then in the project's Deployment Checks settings choose **Add Checks -> GitHub** and select which workflows must pass before a deployment promotes to production. Vercel builds and hosts; GitHub Actions runs the checks Vercel doesn't; production promotion waits on those checks. No duplicate build. Source: `research/distilled-ci-release.md` §2.

Vercel can also trigger Actions in the reverse direction via `repository_dispatch` (`vercel.deployment.ready`/`vercel.deployment.error`) or the native `deployment_status` event - letting an e2e job run against a confirmed-live preview URL with no polling loop, instead of guessing when the deploy is ready.

## Known limitation as of this research window (2026-08-14)

No OIDC for the GitHub-Actions-to-Vercel deploy-auth step itself - a static `VERCEL_TOKEN` secret is still required for any Actions-driven `vercel` CLI call. Re-verify this before telling a user OIDC eliminates the token requirement; it's the kind of gap that closes quietly.

## Cross-references

- `vercel-stinger` - owns adapter-vercel config, runtime choice, ISR/caching, images, firewall, cost control, Neon integration. This skill does not re-explain any of that; it owns the GitHub Actions side and the two systems' interaction only.
- `guides/11-environment-promotion.md` - the preview-vs-production trigger mapping this interaction feeds into.
