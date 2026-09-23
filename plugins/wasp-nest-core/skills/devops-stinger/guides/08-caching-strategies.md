# 08: Caching strategies

Cache is king. Source: `research/2026-04-25-cache-is-king-gha.md`, `research/2026-04-25-buildkit-cache-mounts.md`.

---

## 1. Three layers of cache, each independent

| Cache layer | What it caches | Where it lives |
|---|---|---|
| **BuildKit named cache mount** | Package manager state during `RUN` (`/root/.npm`, `/pnpm/store`) | Inside a single build's BuildKit graph; persisted only if the cache backend persists |
| **Docker layer cache** | Each `RUN`/`COPY` layer's output | Backed by GHA cache, registry cache, Depot persistent NVMe, or local Docker |
| **Action workspace cache** (`actions/cache`) | `node_modules/`, `.next/cache/`, `.turbo/`, etc., anything outside the Docker build | GHA-managed, 10 GB cap |

You typically use 1 + 2 together (BuildKit mount inside `RUN`, layer cache for the layer itself). Layer 3 is for non-Docker steps (running tests on the host runner, not inside an image).

## 2. BuildKit named cache mounts (Layer 1)

Mount a persistent cache directory into a `RUN` step:

```dockerfile
# pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# npm
RUN --mount=type=cache,id=npm,target=/root/.npm,sharing=locked \
    npm ci

# Next.js build cache
RUN --mount=type=cache,id=next,target=/app/.next/cache \
    pnpm build
```

The cache survives across builds (when the cache backend persists). Result: `pnpm install` becomes near-instant on warm builds.

**Sharing modes:**

- `sharing=shared` (default): multiple builds can read concurrently.
- `sharing=locked`: exclusive lock, slower but safer for caches that don't tolerate concurrent writes (npm's cache).
- `sharing=private`: per-build, never shared.

Source: `research/2026-04-25-buildkit-cache-mounts.md`.

## 3. Docker layer cache backends (Layer 2)

Pick one based on environment:

### A. Depot persistent NVMe (best when wired in)

Automatic with `depot/build-push-action`. Persistent across builds, shared across team + CI. Nothing to configure beyond the `project:` field. See `guides/07-depot-integration.md`.

### B. GitHub Actions cache backend (free, capped)

```yaml
- uses: docker/build-push-action@<sha>
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**Caveats:**

- 10 GB cap per repo (LRU eviction beyond).
- Cache scope per branch: feature branches restore from `main` if no cache yet.
- `mode=max` exports all stages; `mode=min` exports only final stage (smaller, less reuse).
- Network round-trip for restore on every build.

For repos where Depot isn't yet wired, this is the next best free option.

### C. Registry cache (decoupled, costs pull bandwidth)

```yaml
- uses: docker/build-push-action@<sha>
  with:
    cache-from: type=registry,ref=ghcr.io/${{ github.repository }}:buildcache
    cache-to: type=registry,ref=ghcr.io/${{ github.repository }}:buildcache,mode=max
```

The cache is stored as a separate image tag. Not capped by GHA's 10 GB. Costs registry storage + pull bandwidth.

Good for: very large monorepos that overflow GHA cache.

### D. Inline cache (in-image, smallest gains)

```yaml
- uses: docker/build-push-action@<sha>
  with:
    cache-from: type=inline
    cache-to: type=inline
```

Cache metadata is embedded in the pushed image. Restore requires pulling the previous image. Limited to the final stage. Useful only when other backends aren't available.

## 4. The cache hit hierarchy (Linus-style: what hits first)

For a "small change to source" build, in priority order:

1. **Base image already pulled**: instant.
2. **`COPY package.json` layer**: hits if lockfile unchanged.
3. **`RUN pnpm install` layer**: hits if `package.json` + lockfile + base layer unchanged.
4. **BuildKit cache mount for `/pnpm/store`**: hits if any prior build populated it.
5. **`COPY . .` layer**: invalidated by any source change. Re-runs.
6. **`RUN pnpm build` layer**: re-runs.
7. **BuildKit cache mount for `/app/.next/cache`**: hits and dramatically speeds the `next build` step.

A well-tuned pipeline keeps 1-4 cached >95% of the time. The build is dominated by 5+6 (which is mostly Webpack/SWC work, accelerated by Layer 1 cache mounts).

## 5. Cache invalidation: when and how

A change to:

- `package.json` or lockfile → invalidates `RUN install` layer; cache mount still holds package downloads.
- `Dockerfile` itself → invalidates from the changed line down.
- Base image tag (or its digest) → invalidates everything below.
- `--build-arg` value → invalidates the `ARG` line and below.

Force-invalidate (escape hatch, rare):

```bash
docker buildx build --no-cache .
# or
depot build --no-cache .
```

Or cache-bust just one layer with a `RUN echo "$(date +%s)"` line: a sledgehammer; prefer pinning what changed.

## 6. `actions/cache` for non-Docker workspaces (Layer 3)

When tests run on the runner, not inside an image:

```yaml
- uses: actions/cache@<sha>
  with:
    path: |
      ~/.pnpm-store
      .next/cache
      node_modules/.cache/turbo
    key: ${{ runner.os }}-deps-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-deps-
```

`key` includes a hash of the lockfile: exact match on cache hit. `restore-keys` provides fallback prefixes when the exact key misses.

## 7. Cache scope across PRs

GitHub Actions cache is scoped per-branch. A new PR branch can read from its base branch (commonly `main`) but cannot read from sibling PR branches. This means the *first* PR build is cold (fills from `main`'s cache); subsequent pushes to that PR are warm.

With Depot, cache is project-scoped: every PR shares the same cache. This is materially better for "multiple PRs in flight" workflows.

## 8. The "build is slow" diagnostic order

When asked "why is our build slow", check in this order:

1. Is there a layer cache backend at all? (Many repos have none. Massive low-hanging fruit.)
2. Are package-manager cache mounts in place? (Saves 30-90 sec per cold install.)
3. Is the layer order cache-friendly? (Lockfile + install before source COPY.)
4. Is the base image stable / pinned? (Floating tags re-pull and re-build everything.)
5. Are there layers being invalidated by trivial changes (e.g., `COPY .` before `COPY package.json`, anything changes, install reruns)?
6. Is multi-arch happening on QEMU? (10x slower than native.)
7. Is the runner itself slow? (GitHub-hosted free is shared compute; Depot runners are 30% faster.)

Each step has a specific fix. Cite numbers from the build log when filing the finding.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| No layer cache backend | Should-refactor | Add `cache-to: type=gha,mode=max` (or wire Depot) |
| `cache-from: type=gha` but no `cache-to` (read-only cache) | Should-refactor | Add `cache-to` |
| `cache-to` with `mode=min` when cache budget allows `mode=max` | Style | `mode=max` for better intermediate reuse |
| `RUN pnpm install` without `--mount=type=cache` | Should-refactor | Add cache mount |
| `actions/cache` with key `${{ runner.os }}-deps` (no hash), never invalidates | Must-fix | Include `hashFiles('pnpm-lock.yaml')` in key |
| `COPY . .` before `COPY package.json` (every source change re-installs) | Should-refactor | Reorder |

## See also

- `guides/01-dockerfile-patterns.md` §6: BuildKit cache mounts in detail.
- `guides/07-depot-integration.md`: Depot persistent cache.
- `guides/11-common-failure-modes.md`: "cache miss every build" diagnosis.
