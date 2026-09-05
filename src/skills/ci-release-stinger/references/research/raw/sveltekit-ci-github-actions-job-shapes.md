# GitHub Actions job shapes for a SvelteKit app: pnpm install, typecheck, lint, unit test, e2e, build

- URL: https://github.com/sveltejs/kit/blob/main/.github/workflows/ci.yml ; https://pnpm.io/10.x/continuous-integration ; https://github.com/billyribeiro-ux/lumen/blob/main/.github/workflows/ci.yml
- Fetched: 2026-08-14
- Source type: Official repo (sveltejs/kit) + official pnpm docs + community SvelteKit/Drizzle/Neon app repo (illustrative, not authoritative)
- Component: GitHub Actions / SvelteKit CI job shapes

## Content

### The current pnpm + Node setup pattern (from sveltejs/kit's own CI, and pnpm's official CI doc)

The canonical step order for any job that needs the JS toolchain:

```yaml
- uses: actions/checkout@v6
- uses: pnpm/action-setup@v5   # installs pnpm itself; does NOT run install by default
- uses: actions/setup-node@v6
  with:
    node-version: 24
    cache: pnpm               # setup-node shells out to `pnpm store path` to locate the cache dir
- run: pnpm install --frozen-lockfile
```

`pnpm/action-setup` installs the pnpm binary (version pinned or read from `packageManager` in `package.json` - do not set both `version:` and rely on `packageManager`, that combination errors `ERR_PNPM_BAD_PM_VERSION`). `actions/setup-node`'s `cache: pnpm` input then handles cache restore/save keyed on the lockfile hash automatically, wrapping `actions/cache` internally, no manual `pnpm store path` shell-out required. `--frozen-lockfile` is required in CI: it fails the install if `pnpm-lock.yaml` doesn't match `package.json`, catching an un-committed lockfile change.

Per pnpm's own CI doc (pnpm.io/10.x/continuous-integration): caching the pnpm store is optional and not guaranteed to make install faster; it's a "feel free to skip it" framing from the maintainers, not a hard requirement. Where a store cache is used, only cache it in trusted jobs, an untrusted job (e.g. one running on `pull_request_target` against fork code) must not be allowed to write to a cache that a trusted job later restores from.

### Splitting checks into separate jobs vs one job

Real-world SvelteKit + Drizzle/Neon app CI (illustrative example, not an official source) splits into four parallel jobs sharing the identical pnpm/Node setup boilerplate:

- **`lint-typecheck`** - `pnpm ci:lint` (ESLint) then `pnpm check` (svelte-check, which needs `$env/static/private` vars like `DATABASE_URL` resolved at `svelte-kit sync` time - the job sets dummy env values so type generation succeeds without touching a real database) then a Drizzle schema check.
- **`unit-tests`** - `pnpm install`, install Playwright's Chromium binary (`pnpm exec playwright install chromium --with-deps`) because server-side unit tests importing `src/lib/server/**` need it for module-load side effects, then `pnpm test:unit --run`.
- **`e2e-tests`** (needs: `[lint-typecheck]`) - installs Playwright Chromium, runs `pnpm build` against a real ephemeral database URL (from a secret, e.g. a Neon preview branch), then `pnpm test:e2e`.
- **`build`** ("Production build smoke", needs: `[lint-typecheck]`) - a plain `pnpm build` with dummy env values, exists purely to prove the production build succeeds independent of the e2e job's build.

A different pattern (sveltejs/kit's own CI, and the Svelte compiler's own CI) instead uses one job per concern with no `needs:` graph at all, letting them run fully in parallel: `lint-all` (lint + typecheck + generated-types-are-up-to-date check), `test-kit` (the actual Playwright-backed test suite across an OS/Node/browser matrix), and separate build-check jobs. GitHub Actions runs these in parallel by default since none declares `needs:`; adding `needs: [lint-typecheck]` to a job (as the illustrative Drizzle example does for `e2e-tests` and `build`) intentionally serializes it after a cheaper gate so an expensive Playwright run doesn't start on code that fails typecheck.

### Job shape for a "build" job specifically

Minimal canonical shape, cache-aware:

```yaml
build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6
    - uses: pnpm/action-setup@v6
    - uses: actions/setup-node@v6
      with:
        node-version: '24'
        cache: pnpm
    - run: pnpm install --frozen-lockfile
    - run: pnpm build
```

For a SvelteKit app that reads env vars via `$env/static/private` or `$env/static/public` at build time (both resolved at `svelte-kit sync`, which itself runs as part of `vite build`), any job invoking `svelte-kit sync`, `svelte-check`, `vite build`, or `vite dev` needs those env vars present, even if only as CI-safe dummy values for jobs that don't touch a real database.

### svelte-kit sync race condition (a real gotcha, from the Nx-based reborn-task/reborn-notes CI example)

When `check` (svelte-check), `test`, and `build` targets each independently invoke `svelte-kit sync` (directly or via the Vite plugin) and all three run in parallel against the same working directory, they can race writing to `.svelte-kit/types/`, producing intermittent `ENOENT` errors. The documented fix in that example is to run those targets as separate sequential steps rather than a single parallelized `-t check test build` invocation, specifically to avoid concurrent writes to the same generated-types directory.

### Node version currency

sveltejs/kit's own CI as of this fetch runs its full matrix on Node 18/20/22/24, with 24 as the primary version used for lint and type-check jobs; Svelte core's CI runs Node 20/22/24. This confirms Node 24 is a live, current LTS-track choice for a 2026 SvelteKit CI pin, not a stale one.
