# Turborepo remote cache in GitHub Actions (if the repo becomes a monorepo)

- URL: https://turborepo.dev/docs/guides/ci-vendors/github-actions ; https://vercel.com/docs/monorepos/remote-caching/external-ci-cd ; https://turborepo.dev/docs/crafting-your-repository/constructing-ci
- Fetched: 2026-08-14
- Source type: Official Turborepo docs + official Vercel docs
- Component: Caching strategy / Turborepo remote cache in GitHub Actions

## Content

### Applicability note

Vibe Coding Tools is an asset-distribution repository, not a Turborepo application. This note is reference material for target repositories that do use Turborepo; it is not a description of this repository's current layout.

### Two authentication paths to Vercel's Remote Cache from GitHub Actions

**OIDC (recommended by Vercel's own docs).** No long-lived token stored in GitHub at all:

```yaml
jobs:
  build:
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/setup-turborepo-remote-cache-action@v1.0.0
        with:
          team: ${{ vars.TURBO_TEAM }}
      - run: turbo build lint test
```

`vercel/setup-turborepo-remote-cache-action` requests a GitHub-issued OIDC token, exchanges it for a short-lived Turborepo access token against a pre-configured OIDC policy on the Vercel team (created in Vercel dashboard: Settings -> add a Turborepo CLI OIDC policy, optionally restricted to a specific repo/workflow/branch), and sets `TURBO_TOKEN`/`TURBO_TEAM` env vars for later `turbo` invocations automatically. `TURBO_TEAM` is deliberately stored as a plain repo **variable**, not a secret - the docs note this specifically so GitHub doesn't censor the team slug in log output the way it would a secret value.

**Personal Access Token (fallback when OIDC isn't viable).** A long-lived PAT scoped to the specific Vercel team (never broader than necessary), stored as the `TURBO_TOKEN` secret, with `TURBO_TEAM` still as a plain variable:

```yaml
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

### Mechanics: what remote cache actually shares

Vercel's own Vercel-hosted CI/CD is auto-connected to remote cache with zero config; only *external* CI (GitHub Actions, CircleCI, etc.) needs the manual OIDC/PAT wiring above. Once connected, a local `turbo build` run's output artifacts upload to the remote cache automatically; a subsequent `turbo build` anywhere else (a teammate's machine, or CI) hashes its task inputs, checks the remote cache for a matching hash, and **downloads the prior output instead of rebuilding** on a hit - demonstrated in Vercel's own walkthrough going from a 2m45s cold build to an 18s cache-hit build for an unchanged workspace. Only **task outputs** are cached remotely, never source code.

### The sharp edge already flagged in this skill's cross-reference to vercel-stinger (repeated here for the CI-side framing)

Per Turborepo's own CI-construction doc: if an environment variable affects a task's build output but isn't declared in that task's `env`/`globalEnv` keys in `turbo.json`, Turborepo's cache hash won't account for it - a cache hit can silently replay output built under a *different* environment's variable values (e.g. serving a staging config in what's supposed to be a production build). The fix is declaring env vars at the specific task level (e.g. `web#build`) rather than only globally, which also improves cache hit rates by not invalidating every task's cache when an unrelated task's env var changes.

### `--affected` for PR-scoped CI runs

Turborepo auto-detects it's running inside GitHub Actions (via `GITHUB_BASE_REF` on `pull_request`/`pull_request_target` events, falling back to `GITHUB_EVENT_PATH`-derived base-branch detection on plain `push` events) and can run `turbo build lint test --filter=[origin/main]` (or the `--affected` flag) to execute tasks only for packages actually changed relative to the PR's base branch, rather than the whole workspace - this is the monorepo-scale equivalent of this skill's job-splitting guidance for a single-app repo, applied at the package-graph level instead of the job-graph level.

### `actions/cache` as a local, non-shared fallback

Where remote cache isn't set up, `.turbo/` (the local cache directory) can be cached via plain `actions/cache@v4` keyed on `${{ runner.os }}-turbo-${{ github.sha }}` with a `restore-keys` prefix fallback - explicitly weaker than remote cache: branch-scoped, not shared with local developer machines, and PRs only restore from whatever the base branch happened to cache. Turborepo's own skill reference (`vercel/turbo` repo) frames this plainly as a fallback, not a recommended default when remote cache is available.
