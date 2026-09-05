# Vercel environments: preview vs production, and how promotion maps to branch/PR triggers

- URL: https://vercel.com/docs/deployments/environments ; https://vercel.com/docs/deployments/promoting-a-deployment ; https://vercel.com/docs/deployments/promote-preview-to-production ; https://vercel.com/docs/git
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Vercel environments / preview-production promotion / branch mapping

## Content

### The three default environments

Local, Preview, Production. Preview deploys happen when: a commit lands on any non-production branch, a pull request is opened on GitHub/GitLab/Bitbucket, or a CLI deploy runs without `--prod`. Production deploys happen when a commit lands on (or is merged into) the configured production branch, or `vercel --prod` runs explicitly. **Exception:** the very first deployment of a brand-new project is always a production deployment, even from a non-production branch or CLI without `--prod` - this exists so a new project has a production deployment and production domain immediately. All rules above apply only after that first production deployment.

### Production branch selection order

When a project is created from a Git repo, Vercel picks the production branch in this order: `main`, then `master` if `main` doesn't exist, then (Bitbucket only) the repo's own configured "production branch" setting, then the repo's default branch as a last resort. Any push to whichever branch is configured triggers a production deployment and updates the live production domain immediately on success.

### Preview URL shapes

Two kinds per preview deployment: a **branch-specific URL** (always points at the latest deploy for that branch) and a **commit-specific URL** (pins to one exact commit's deployment). PR comments and the dashboard surface both.

### Promotion mechanics (mapping onto a GitHub Actions trigger design)

- **Default flow:** merge to production branch -> Vercel auto-builds and auto-promotes -> production domain updates. This is the "no manual promotion step" path most teams should use unless they have a specific reason not to.
- **`vercel promote <deployment-url> --yes`** (CLI) explicitly promotes an existing READY deployment (typically one that was a preview) to production. This **triggers a full rebuild** using **production environment variables** - a deployment's own preview-time env values do not carry over to the promoted production deployment. This is the single most-cited gotcha in the promotion docs: if a variable differs between Preview and Production environments, the promoted deployment gets the Production value, which can differ from what was actually tested in preview.
- **Staged production build (no rebuild):** turn off "Auto-assign Custom Production Domains" in the project's Environments settings under Production -> Branch Tracking. With auto-assign off, a push to the production branch still creates a production-targeted deployment, but it sits in a **Staged** state without being aliased to the live domain. A team can then explicitly promote it later with `vercel promote` (or the dashboard's Promote action), which in this specific staged-build path does **not** trigger a rebuild - it's a pointer update, matching how Instant Rollback works. This is the correct mechanism for a manual "stage then promote" gate rather than relying on `vercel promote` from a pure preview deployment (which does rebuild).
- **Production deployment states:** `Staged` (built for production, not yet domain-assigned) -> can be promoted to `Current`. `Promoted` (already promoted once from staging; cannot be promoted again, only rolled back to). `Current` (the live, domain-aliased deployment).

### Mapping this to a GitHub Actions workflow's branch/PR triggers

For a repo using Vercel's native Git integration (the default, no-YAML path), GitHub Actions doesn't need to trigger deploys at all - it only needs to gate them via Deployment Checks (see the companion raw note on Vercel+Actions interaction). The trigger design in that case is: Actions workflows fire `on: pull_request` for preview-targeted checks (lint/typecheck/unit/e2e against the just-created preview URL via `deployment_status`) and `on: push: branches: [main]` for anything that should run only against the production branch (e.g. a stricter smoke test, a required-check that gates production promotion specifically).

For a repo deploying via the Actions CLI path (`vercel pull`/`build`/`deploy --prebuilt`) instead of the native integration, the two workflows documented in Vercel's own examples repo map directly onto this: a **Deploy-Preview** workflow triggered on any push to a non-production branch or a PR, using `--environment=preview` for `vercel pull` and no `--prod` flag on build/deploy; and a separate **Deploy-Production** workflow triggered `on: push: branches: [main]`, using `--environment=production` for `vercel pull` and `--prod` on both `vercel build` and `vercel deploy --prebuilt`.

### First-deployment caveat for a new repo's CI design

Because the very first deployment of a new Vercel project is always production regardless of branch or flags, a CI/CD design that assumes "PR branches always produce preview deployments" should account for the one-time exception on initial project setup - it resolves itself after the first production deployment exists, but is worth flagging explicitly the first time a team wires this up so nobody is confused why their first feature-branch push produced a production deployment.
