# Distilled research: CI and release engineering for a SvelteKit app on Vercel

Research window: single sweep, 2026-08-14. Stack context: SvelteKit (Svelte 5), Payload CMS, Vercel hosting, Neon Postgres with Drizzle ORM, WorkOS auth, Stripe, Doppler for secrets, PostHog, Sentry, GitHub Actions for CI. Every claim below cites its raw source in `raw/`. This distillation covers the PRIMARY case (a continuously-deployed app on Vercel). The SECONDARY case (npm package publishing, the original Hivemind scope this skill was forged for) is covered by the pre-existing `research/2026-06-16-*.md` flat archive, which stays in place unchanged and is not re-derived here.

## 1. GitHub Actions job shapes for a SvelteKit app

The current recommended pattern for the pnpm/Node setup boilerplate every job needs:

```yaml
- uses: actions/checkout@v6
- uses: pnpm/action-setup@v6
- uses: actions/setup-node@v6
  with:
    node-version: 24
    cache: pnpm
- run: pnpm install --frozen-lockfile
```

`--frozen-lockfile` is required in CI: it fails the install if `pnpm-lock.yaml` doesn't match `package.json`, catching an uncommitted lockfile drift. `[raw/sveltekit-ci-github-actions-job-shapes.md]`

Job-splitting pattern from a real SvelteKit + Drizzle/Neon app: four parallel-where-possible jobs, `lint-typecheck` (ESLint, then `svelte-check`, then a Drizzle schema check), `unit-tests` (needs Chromium installed for server-module load side effects), `e2e-tests` (`needs: [lint-typecheck]`, builds against a real ephemeral database, runs Playwright), and a standalone `build` smoke job (`needs: [lint-typecheck]`). Gating the expensive e2e/build jobs behind the cheap lint/typecheck job is a deliberate cost control, not accidental. `[raw/sveltekit-ci-github-actions-job-shapes.md]`

**Real gotcha:** if `check`, `test`, and `build` targets all independently invoke `svelte-kit sync` in parallel, they can race-write `.svelte-kit/types/` and produce intermittent `ENOENT`. Run those as sequential steps, not a single parallelized multi-target invocation, when they share a working directory. `[raw/sveltekit-ci-github-actions-job-shapes.md]`

Node 24 is confirmed current (SvelteKit's own CI and Svelte core's own CI both use it as of this fetch), not a stale pin. `[raw/sveltekit-ci-github-actions-job-shapes.md]`

## 2. Vercel's own build/deploy model vs GitHub Actions: division of labor

| Vercel's Git integration does, with zero YAML | GitHub Actions should add only |
|---|---|
| Preview deployment on every push/PR, prod deployment on production-branch push | Tests |
| Framework detection, no build config file needed | Security scans |
| Immutable, indefinitely-retained deployments | Performance budgets |
| Instant Rollback (pointer update, no rebuild) | Approval gates |

`[raw/vercel-github-actions-interaction-avoid-double-builds.md]`

"If a workflow isn't running tests, scanning for vulnerabilities, enforcing a performance budget, or holding a deploy for human approval, you don't need GitHub Actions on top of Vercel, and adding it makes your pipeline worse." The reason given is structural: two systems both trying to own the build have to be kept in agreement. `[raw/vercel-github-actions-interaction-avoid-double-builds.md]`

**The duplicate-build failure mode and its fix:** a workflow that lints/type-checks/builds and then triggers a Vercel deploy without `--prebuilt` makes Vercel rebuild the same artifact a second time, doubling CI minutes. `vercel build` (in Actions) + `vercel deploy --prebuilt` (uploads only `.vercel/output/`, Vercel doesn't rebuild) is the fix. If a project deploys via this Actions/CLI path, the native Git integration auto-deploy must be explicitly disabled (`"git": { "deploymentEnabled": false }` in `vercel.json`) or both systems deploy on the same push. `[raw/vercel-github-actions-interaction-avoid-double-builds.md]`

**Reverse integration:** Vercel can trigger GitHub Actions via `repository_dispatch` (`vercel.deployment.ready`/`vercel.deployment.error`) or the native `deployment_status` event, carrying the live preview URL - letting e2e tests run against a confirmed-live deployment with no polling. Vercel's **Deployment Checks** can hold production promotion until named GitHub Actions workflows pass, configured in the project's Deployment Checks settings. `[raw/vercel-github-actions-interaction-avoid-double-builds.md]`

**Known limitation, as of this fetch:** no OIDC for the GitHub-Actions-to-Vercel deploy-auth step itself (unlike Vercel Functions authenticating outbound to AWS/GCP, which does support OIDC). Deploy auth is still a static `VERCEL_TOKEN` secret. `[raw/vercel-github-actions-interaction-avoid-double-builds.md]`

## 3. Environment promotion: preview vs production

Three default environments: Local, Preview, Production. Preview triggers on any non-production-branch push, any PR, or a CLI deploy without `--prod`. Production triggers on a push/merge to the configured production branch, or explicit `vercel --prod`. Exception: a brand-new project's very first deployment is always production, regardless of branch. `[raw/vercel-environments-preview-production-promotion.md]`

**The most-cited promotion gotcha:** `vercel promote <url>` triggers a **full rebuild using production environment variables** - a deployment's preview-time env values do not carry over. A **staged production build** (disable "Auto-assign Custom Production Domains" under Environments -> Production -> Branch Tracking) is the only promotion path that does NOT rebuild - it's a pointer update, matching Instant Rollback mechanics. `[raw/vercel-environments-preview-production-promotion.md]`

Mapping onto GitHub Actions triggers: for the native Git-integration path, Actions doesn't need to trigger deploys at all, only gate them (`on: pull_request` for preview-targeted checks via `deployment_status`, `on: push: branches: [main]` for production-only checks). For the CLI/`--prebuilt` path, two separate workflows: `Deploy-Preview` (`--environment=preview`, no `--prod`) and `Deploy-Production` (`on: push: branches: [main]`, `--environment=production`, `--prod` on both build and deploy). `[raw/vercel-environments-preview-production-promotion.md]`

## 4. Database migration gating in CI: Drizzle + Neon branches

Four official Neon GitHub Actions: `create-branch-action`, `delete-branch-action`, `reset-branch-action`, `schema-diff-action`. The Neon GitHub integration auto-provisions `NEON_API_KEY` (repo secret, manages the Neon project) and `NEON_PROJECT_ID` (repo variable) - kept deliberately separate from the persistent-production `DATABASE_URL` secret, which is added manually and used only post-merge. `[raw/neon-drizzle-branch-per-pr-migration-gating.md]`

**Canonical PR-lifecycle shape**, triggered on `[opened, reopened, synchronize, closed]`:
- **Open/sync:** create branch `preview/pr-<number>-<branch-name>` -> run `drizzle-kit generate` + `migrate` against the branch's own connection string (never the shared production secret) -> post a schema-diff PR comment -> (optionally) build, start the app, run Playwright against the isolated branch.
- **Close:** delete the ephemeral branch unconditionally; **only if merged**, re-run the same migration against the real production `DATABASE_URL`.

The core principle: **the exact migration validated on a disposable clone is the one applied to production, and only after merge** - never as a side effect of opening or updating a PR. `[raw/neon-drizzle-branch-per-pr-migration-gating.md]`

**Vercel shortcut:** the Vercel-Managed Neon integration gives every Preview Deployment a fresh branch automatically with no custom Action - relevant when the team hasn't opted for the Neon-Managed integration path that `neon-drizzle-stinger` recommends by default. **Cross-reference:** this skill owns the CI gating logic (when/how migrations run and get reported on in a workflow); Drizzle migration mechanics themselves and the Vercel-Neon integration choice belong to `neon-drizzle-stinger`. `[raw/neon-drizzle-branch-per-pr-migration-gating.md]`

**Job-output scoping gotcha:** `create-branch-action`'s connection-string output is scoped to the job that created it (marked as a secret) - a multi-job workflow needing the branch URL across jobs needs its own propagation mechanism, it does not just flow to a downstream job. `[raw/neon-drizzle-branch-per-pr-migration-gating.md]`

## 5. Secret handling in GitHub Actions: Doppler and OIDC

**Two Doppler integration paths.** Native GitHub App sync (single repo-to-single-config, zero workflow YAML, instant propagation on every Doppler secret change) vs `dopplerhq/secrets-fetch-action` (needed when one workflow needs secrets from multiple different Doppler configs, e.g. a monorepo). `[raw/doppler-github-actions-secrets-fetch-oidc.md]`

Three Secrets Fetch Action auth methods, ranked: **Service Account Identity via OIDC** (recommended, no static token stored anywhere, requires `permissions: id-token: write`), Service Account Token (static, Team/Enterprise plan), Service Token (static, single-config read-only, stored as `DOPPLER_TOKEN`). Fetched secrets are auto-masked in logs except Doppler's own meta vars and anything explicitly marked `unmasked`. The raw-CLI OIDC pattern (`doppler oidc login` with the manually-exchanged token) does **not** get this automatic masking - a real reason to prefer the Action over the raw CLI path when both are viable. `[raw/doppler-github-actions-secrets-fetch-oidc.md]`

**General GitHub Actions OIDC pattern** (applies beyond Doppler - AWS, GCP, any provider with an OIDC integration): grant `id-token: write`, exchange via the provider's official login action, and scope the trust condition on the token's `sub` claim (which encodes org/repo/branch/environment). **Currency note:** repos created after 2026-07-15 default to an immutable `sub` format embedding numeric owner/repo IDs, not just names - a trust-policy example copied from an older tutorial may not match what a new repo's token presents. `[raw/github-actions-oidc-cloud-providers.md]`

**This skill's cross-reference:** secret handling in Actions is this skill's territory; `doppler-stinger` owns the deeper Doppler platform mechanics (project/config model, rotation, Vercel sync) - link to its `guides/05-cicd-in-github-actions.md` rather than re-deriving Doppler's own CI guide. `[raw/doppler-github-actions-secrets-fetch-oidc.md]`

## 6. Caching strategy in GitHub Actions (2026)

| Layer | Current guidance | Source |
|---|---|---|
| pnpm store | `actions/setup-node`'s built-in `cache: pnpm` is lowest-maintenance default; pnpm's own docs say caching "is not required" and to measure rather than assume it helps | `[raw/github-actions-caching-pnpm-node-2026.md]` |
| Playwright browsers | Official docs lean against caching (restore time ≈ download time, OS deps aren't cacheable); independent 2026 sources present caching as standard practice anyway, keyed on Playwright version, always pairing a cache hit with `playwright install-deps` | `[raw/playwright-ci-sharding-caching-retries-trace.md]` |
| Turborepo (if the repo becomes a monorepo) | Vercel Remote Cache via OIDC (`vercel/setup-turborepo-remote-cache-action`) is the recommended path over a static PAT; only task outputs are cached, never source | `[raw/turborepo-remote-cache-github-actions.md]` |

**Conflict flagged explicitly:** Playwright's own official docs (`playwright.dev/docs/ci`) recommend against browser-binary caching; three independent 2026 sources (qaskills.sh, web-automations.com, currents.dev) treat it as standard practice. This skill defaults to the community pattern (cache keyed on Playwright version, `install-deps` on hit) because the aggregate real-world CI-minute savings reported are substantial, but flags the official docs' contrary position rather than hiding it. `[raw/playwright-ci-sharding-caching-retries-trace.md]`

**Security caveat carried over from pnpm's own docs:** never let an untrusted job (e.g. one running against fork-PR code) write to a cache a trusted, secret-bearing job later restores from - a poisoned cache entry is a supply-chain vector. `[raw/github-actions-caching-pnpm-node-2026.md]`

**GitHub's 10GB per-repo cache limit** (independent source, currents.dev) can cause LRU eviction of an active feature branch's cache, or even the default branch's, when many short-lived branches each cache slightly different Playwright versions. Mitigation: share a common fallback cache key across branches. `[raw/playwright-ci-sharding-caching-retries-trace.md]`

## 7. Required status checks / branch protection

Rulesets (newer) can layer with each other and with classic branch protection on the same branch - where the same rule is defined differently across layers, **the most restrictive wins**. A required check must report `success`, `skipped`, or `neutral` to satisfy the requirement. Strict mode ("require branches up to date") re-tests the actual merge result but costs more rebuilds; loose mode is cheaper but can let an untested merge combination through. `[raw/github-required-status-checks-branch-protection.md]`

**Three documented "skipped-but-required" traps**, all worth checking before declaring a required-check setup correct: (1) a workflow skipped by `paths-ignore`/`branches-ignore`/a skip-ci commit keyword leaves its check **Pending forever**, blocking merge; (2) a job skipped because it `needs:` a failed job may not correctly report failure unless it uses `always()`; (3) a PR that doesn't touch any path matching a workflow's `paths:` filter never runs that workflow at all, so a required check on it blocks indefinitely. `[raw/github-required-status-checks-branch-protection.md]`

**Merge queue gotcha:** any required-check workflow must add `merge_group` as an additional trigger alongside `pull_request`/`push`, or the check never fires when a PR enters the queue and the queued merge fails on a missing status. `[raw/github-required-status-checks-branch-protection.md]`

**This skill's cross-reference:** `github-repo-health-stinger` owns branch protection/ruleset configuration itself and repo settings audits generally; this skill's angle is specifically the CI-authoring side of making a required check actually satisfiable (correct job naming, trigger coverage, `merge_group` wiring) - link to that skill for the settings-side audit rather than duplicating its scoring rubric. `[raw/github-required-status-checks-branch-protection.md]`

## 8. Release automation: changesets vs semantic-release vs no versioning

| | Changesets | semantic-release |
|---|---|---|
| Source of truth | Markdown files in `.changeset/` | Conventional Commit messages |
| Monorepo support | First-class | Possible, more setup |
| Release flow | Reviewable release PR | Fully automatic on push |
| Runtime version access | Trivial (`package.json`) | Documented as awkward |

`[raw/changesets-vs-semantic-release-app-vs-package-versioning.md]`

Changesets officially supports versioning **non-npm-published applications** (`docs/versioning-apps.md` names NuGet, gems, Docker images as examples) via `privatePackages: { version: true, tag: true }` in config - the only requirement is a `package.json` for bookkeeping, even with nothing ever published. `[raw/changesets-vs-semantic-release-app-vs-package-versioning.md]`

**The framing this skill applies, stated plainly (a judgment call, not a single official source's verdict - both official Changesets docs and two independent comparison sources inform it):** a published npm package has an external semver contract (consumers pin ranges); a continuously-deployed Vercel app does not. Default recommendation for **this repo's actual shape** is **no semver tool required at all** on the app surface - a build number, git SHA, or date-stamped tag serves internal correlation/rollback purposes without the process overhead. If an internal, human-curated changelog is wanted anyway, Changesets in its app-versioning mode (private, `tag` optional) fits better than semantic-release specifically because of its reviewable-PR property, not because either tool is "more correct." Reserve full-npm-mode Changesets or semantic-release for the case a package genuinely gets extracted and published - which is exactly the legacy Hivemind case this skill's guides 01-08 already cover. `[raw/changesets-vs-semantic-release-app-vs-package-versioning.md]`

## Gaps and conflicts carried forward (do not fill from training data)

1. **Playwright browser-caching conflict** (section 6 above): official docs vs community practice disagree; this skill picked a side and said so.
2. **No source in this pass confirms Doppler's exact SvelteKit-native quickstart** beyond the framework-agnostic GitHub Actions integration covered here - `doppler-stinger`'s own research archive is the place to verify SvelteKit-specific Doppler wiring, not this skill's archive.
3. **Neon's exact default for whether a fresh preview branch receives production data vs a seed script** was described two different ways across sources in the same research pass (copy-on-write clone with parent data vs `seed.sql`) - verify the specific behavior against current Neon docs before stating it as a hard fact in an audit.
4. **Vercel OIDC for the deploy-auth step itself** does not exist as of this fetch (2026-08-14) - re-verify before telling a user OIDC eliminates their `VERCEL_TOKEN` secret entirely, since this is exactly the kind of gap that closes without much announcement.
5. **Turborepo/monorepo material is archived for future use** - this repo is a single SvelteKit app today, not a monorepo; do not present the Turborepo guidance as an immediate requirement.
