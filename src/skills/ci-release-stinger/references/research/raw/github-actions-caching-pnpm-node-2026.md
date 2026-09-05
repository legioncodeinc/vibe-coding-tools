# GitHub Actions caching in 2026: pnpm store, actions/setup-node built-in caching, restore-only caches

- URL: https://github.com/actions/setup-node/ ; https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md ; https://github.com/pnpm/action-setup ; https://pnpm.io/10.x/continuous-integration
- Fetched: 2026-08-14
- Source type: Official GitHub Actions repo (actions/setup-node) + official pnpm docs/action
- Component: Caching strategy in GitHub Actions / pnpm store caching

## Content

### `actions/setup-node`'s built-in cache input

`actions/setup-node` wraps `actions/cache` internally so a project doesn't need to hand-roll cache key logic for the common case:

```yaml
- uses: actions/checkout@v7
- uses: actions/setup-node@v7
  with:
    node-version: 24
    cache: 'pnpm'                      # also supports 'npm', 'yarn'
    cache-dependency-path: ''          # optional: needed when the lockfile isn't at repo root, supports globs/multiple paths
- run: pnpm install --frozen-lockfile
```

It searches for the dependency lockfile (`package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, or for pnpm, `pnpm-lock.yaml`) and hashes it as the cache key. It explicitly does **not** cache `node_modules` itself - it caches the package manager's global/store cache directory (e.g. pnpm's content-addressable store), so `pnpm install` on a cache hit still runs but resolves most packages from the local store instead of re-downloading from the registry.

**Automatic npm caching as of the current `setup-node` major:** if `package.json` sets `packageManager` (or `devEngines.packageManager`) to an npm value, caching for npm is now enabled *by default* even without an explicit `cache: npm` input - controlled by the `package-manager-cache` boolean input (default `true`). The docs recommend explicitly setting `package-manager-cache: false` for workflows handling elevated privileges or sensitive information, since automatic caching in that context is a secure-by-default tradeoff worth deliberately opting out of. This auto-caching behavior does **not** extend to yarn or pnpm - those remain opt-in only via the explicit `cache:` input.

### pnpm-specific: `pnpm/action-setup`'s own `cache` input, as an alternative to `setup-node`'s

`pnpm/action-setup` (which installs the pnpm binary itself, since `setup-node` doesn't) also exposes its own `cache: true` boolean, which is a **separate mechanism** from `setup-node`'s `cache: pnpm` input - only one is needed, using both would be redundant:

```yaml
- uses: pnpm/action-setup@v6
  with:
    version: 10
    cache: true
- run: pnpm install
```

Notable convenience: with `pnpm/action-setup`'s own caching, the action's post-step automatically runs `pnpm store prune` to keep the persisted cache from growing unbounded - "you don't need to run `pnpm store prune` at the end; post-action has already taken care of that," per the action's README.

### pnpm's own official position on whether to cache at all

Per `pnpm.io/10.x/continuous-integration` (fetched 2026-08-14, marked as the pnpm 10.x docs, current at time of fetch): caching the pnpm store "is not required, and it is not guaranteed that caching the store will make installation faster... feel free to not cache the pnpm store in your job." This is a materially different stance than the common assumption that dependency caching is an unconditional win - pnpm's content-addressable store plus a fast registry mirror can make a cold install fast enough that cache-restore overhead isn't worth the YAML complexity in every case. It's a "measure before you assume" framing, not a blanket recommendation either way.

**Security caveat directly from pnpm's own docs:** "Only cache pnpm's store and cache directories in locations writable by trusted jobs. Do not let untrusted CI jobs write to a store or metadata cache that trusted jobs later restore." This matters specifically for a workflow that runs against fork PRs (e.g. via `pull_request_target`) - an untrusted fork's job should never be allowed cache-write access to a store that a trusted, secret-bearing job later reads from, since a poisoned cache entry could inject malicious package content into a trusted job's install.

### Restore-only caching pattern (reduces cache writes/storage)

For read-heavy CI where a workflow doesn't need to *update* the cache on every run (e.g. many parallel PR-check jobs that all want to read a warm cache but shouldn't all race to write it), `actions/cache/restore@v5` alone (not the full `actions/cache` action) restores without saving a new entry:

```yaml
- name: Restore Node cache
  uses: actions/cache/restore@v5
  with:
    path: ${{ steps.cachepath.outputs.path }}
    key: node-cache-${{ runner.os }}-${{ env.ARCH }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

A separate, dedicated job (or a scheduled/main-branch-only job) typically owns the paired `actions/cache/save` write, so cache population happens once per lockfile change rather than redundantly across every parallel PR job.

### Monorepo cache-dependency-path

For a repo with multiple lockfiles or a non-root lockfile location, `cache-dependency-path` accepts a glob or a list of explicit file paths so the cache key correctly reflects every lockfile that affects install output, not just the one at repo root.

### Practical guidance this skill should give

Default: use `actions/setup-node`'s built-in `cache: pnpm` input, it's the lowest-maintenance path and is what the pnpm official CI doc itself demonstrates. Only reach for `pnpm/action-setup`'s own `cache: true` if a workflow already needs `pnpm/action-setup` for version pinning and wants its automatic `store prune` behavior. Skip caching entirely, or measure it, rather than assuming it's free wins, per pnpm's own stated position - especially for small projects where the cache-restore step's own overhead may rival a cold `pnpm install`.
