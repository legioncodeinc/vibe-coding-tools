# Cache is king: Docker layer caching in GitHub Actions

**Source:** https://www.blacksmith.sh/blog/cache-is-king-a-guide-for-docker-layer-caching-in-github-actions + https://docs.docker.com/build/ci/github-actions/cache/ + https://depot.dev/blog/docker-layer-caching-in-github-actions
**Retrieved:** 2026-04-25

## The thesis

The single biggest factor in CI build time for Dockerized Node/Next.js apps is layer cache hit rate. A repo without a configured layer cache rebuilds everything from scratch on every CI run: typically 3-10x slower than a cache-warm build.

The Blacksmith blog post (cited by the brief and by depot.dev) frames this as "cache is king": every other optimization (parallel jobs, faster runners, smaller images) is dwarfed by the impact of cache hit rate.

## The four cache backends ranked

### 1. Depot persistent NVMe (best)

- Cache lives on Depot's infrastructure, NVMe-backed, project-scoped.
- Restore is local I/O on the build runner: sub-second for typical layer sizes.
- Shared across team + CI + local.
- No cap.
- Setup: zero, using `depot/build-push-action` is enough.

### 2. Registry cache (`type=registry`)

```yaml
cache-from: type=registry,ref=ghcr.io/me/app:buildcache
cache-to:   type=registry,ref=ghcr.io/me/app:buildcache,mode=max
```

- Cache stored as a separate image manifest in the registry.
- Restore = registry pull (network, but parallel-pulls).
- No 10 GB cap (registry-billed).
- Cross-branch friendly.
- Setup: one workflow change + registry write permission.

### 3. GitHub Actions cache backend (`type=gha`)

```yaml
cache-from: type=gha
cache-to:   type=gha,mode=max
```

- Cache stored in GitHub's per-repo Actions cache (10 GB cap, LRU eviction).
- Restore is a separate API call to GitHub's cache service, typically slower than registry for large layers.
- Per-branch scope: PR branches restore from `main`'s cache by default but can't share with sibling PRs.
- Free.
- Setup: one workflow change.

### 4. Inline cache (`type=inline`)

```yaml
cache-from: type=inline
cache-to:   type=inline
```

- Cache metadata embedded in the pushed image.
- Restore requires pulling the previous image first.
- Limited to the final stage (no intermediate layer reuse).
- Free if you're already pushing.
- Most useful as a "last resort" cache when nothing else is available.

## The cost-of-no-cache

A typical Next.js app build, on free GitHub-hosted runner:

| Scenario | Cold | Warm |
|---|---|---|
| No cache | 6-9 min | 6-9 min |
| `type=gha` mode=max | 6-9 min | 1.5-3 min |
| `type=registry` mode=max | 6-9 min | 1.5-3 min |
| Depot persistent | 4-6 min (cold = filling cache) | 30-90 sec |

Source: composite of Depot blog + Blacksmith blog measurements.

## `mode=min` vs `mode=max`

- `mode=min` exports only the final stage's cache. Smaller cache footprint but less reuse: deps install layer doesn't get cached.
- `mode=max` exports all stages. Bigger cache (matters under GHA's 10 GB cap), but every intermediate layer is reusable.

Default to `mode=max` unless you're hitting the GHA cap. Then move to registry cache or Depot.

## Common cache-miss reasons

1. `COPY . .` before `COPY package.json`: every source change invalidates `RUN install`.
2. No `cache-to` set (only `cache-from`): read-only cache, never warms.
3. `cache-from: type=gha` on a feature branch with no main-branch warmup.
4. `--no-cache` accidentally passed.
5. Floating base image tag (e.g., `node:20`) re-pulling and invalidating everything below.

## Relevance to this Stinger

- `guides/08-caching-strategies.md`: primary guide, walking the 4 backends.
- `guides/01-dockerfile-patterns.md` §6: BuildKit named cache mounts (Layer 1, separate from layer cache).
- `guides/11-common-failure-modes.md` §1: "cache misses every build" diagnosis.
- `guides/07-depot-integration.md`: Depot persistent cache.
