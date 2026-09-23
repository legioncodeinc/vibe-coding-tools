# 11 - Environment promotion: preview vs production, mapped to Actions triggers

Primary case. How Vercel's preview/production model maps onto a GitHub Actions workflow's `on:` triggers.

## Vercel's own environment rules

Preview deploys: any push to a non-production branch, any PR, or a CLI deploy without `--prod`. Production deploys: a push/merge to the configured production branch, or explicit `vercel --prod`. **Exception:** a brand-new project's first deployment is always production, regardless of branch or flags - this resolves itself after that first production deployment exists, but flag it explicitly the first time a team stands up a new repo so nobody is confused why the first feature-branch push produced a production deployment. Source: `research/distilled-ci-release.md` §3.

## The promotion gotcha that breaks CI assumptions

`vercel promote <deployment-url>` triggers a **full rebuild using production environment variables** - the deployment's preview-time env values do not carry over. If a workflow's mental model is "promote = ship exactly what was tested in preview," that model is wrong whenever preview and production env vars differ (which per `vercel-stinger`'s own research is the single most common cause of "preview works, prod doesn't"). The only promotion path that does **not** rebuild is a **staged production build** (disable "Auto-assign Custom Production Domains" under the project's Environments -> Production -> Branch Tracking settings) - a push to the production branch still builds and targets production, but doesn't auto-alias the domain, so a later `vercel promote` is a pointer update, not a rebuild. Use this path when a genuine "build once, promote unchanged" guarantee matters. Source: `research/distilled-ci-release.md` §3.

## Mapping onto GitHub Actions `on:` triggers

**If Vercel's native Git integration owns the deploy** (the recommended default per `guides/10-vercel-integration-and-double-builds.md`), Actions workflows only need to gate, not deploy:

```yaml
# Preview-targeted checks - run against every PR
on:
  pull_request:

# Production-only checks (e.g. a stricter smoke test, a required check
# that specifically gates production promotion via Deployment Checks)
on:
  push:
    branches: [main]
```

A preview-targeted check can trigger on the native `deployment_status` event to run against the just-created, confirmed-live preview URL rather than guessing when the build finished.

**If Actions owns the deploy via the CLI/`--prebuilt` path**, use two separate workflows matching Vercel's own official example pattern:

```yaml
# Deploy-Preview.yml
on:
  push:
    branches-ignore: [main]
  pull_request:
# vercel pull --environment=preview, vercel build (no --prod),
# vercel deploy --prebuilt (no --prod)

# Deploy-Production.yml
on:
  push:
    branches: [main]
# vercel pull --environment=production, vercel build --prod,
# vercel deploy --prebuilt --prod
```

Source: `research/distilled-ci-release.md` §3.

## Environment variable audit before any promotion-gating change

Before wiring a required check around promotion, confirm the env vars a promoted build will actually use are the Production-scoped values, not whatever the preview build happened to have. This is `vercel-stinger`'s territory (`vercel-stinger/guides/03-environment-variables-and-secrets.md`) - consult it, don't re-derive the env var audit sequence here.

## Cross-references

- `guides/10-vercel-integration-and-double-builds.md` - the division of labor this promotion mapping assumes.
- `vercel-stinger` - environment variables per environment, the deploys/domains/rollback guide this promotion logic sits alongside.
