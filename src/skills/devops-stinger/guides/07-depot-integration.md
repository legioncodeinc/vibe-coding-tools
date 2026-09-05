# 07: Depot integration

Depot is the fastest path to fast Docker builds without managing your own BuildKit infrastructure. Drop-in for `docker/build-push-action`, persistent NVMe layer cache shared across team + local + CI, native Intel + ARM builders, OIDC auth, and now also GitHub Actions runners. Source: `research/2026-04-25-depot-build-push-action.md`, `research/2026-04-25-depot-vs-github-runners.md`.

---

## 1. The drop-in story

Existing workflow:

```yaml
- uses: docker/setup-buildx-action@<sha>
- uses: docker/build-push-action@<sha>
  with:
    context: .
    push: true
    tags: ghcr.io/me/app:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

Depot version:

```yaml
- uses: depot/setup-action@<sha>
- uses: depot/build-push-action@<sha>
  with:
    project: ${{ vars.DEPOT_PROJECT_ID }}
    context: .
    push: true
    tags: ghcr.io/me/app:latest
```

**That's the migration.** Drop `docker/setup-buildx-action`, swap `docker/build-push-action` to `depot/build-push-action`, add `project: <id>`. Cache becomes Depot's persistent NVMe (no `cache-from`/`cache-to` needed, Depot handles it).

5-line diff per workflow. Source: `research/2026-04-25-depot-build-push-action.md`.

## 2. OIDC auth: no static tokens

Depot supports OIDC from GitHub Actions. Configure once in Depot project settings (the GitHub repo + branch claims), then the workflow declares:

```yaml
permissions:
  contents: read
  id-token: write    # required for OIDC

steps:
  - uses: depot/setup-action@<sha>
  - uses: depot/build-push-action@<sha>
    with:
      project: ${{ vars.DEPOT_PROJECT_ID }}
```

No `DEPOT_TOKEN` secret. No long-lived credential to leak.

## 3. Multi-arch with Depot

```yaml
- uses: depot/build-push-action@<sha>
  with:
    project: ${{ vars.DEPOT_PROJECT_ID }}
    platforms: linux/amd64,linux/arm64
    push: true
    tags: ghcr.io/me/app:latest
```

Each arch builds on its native silicon (Intel for amd64, Graviton for arm64). No QEMU. No matrix gymnastics. Persistent cache per-arch. Result: arm64 builds at native amd64 speed, often 4-10x faster than QEMU on a free runner.

## 4. Bake: for complex multi-target builds

When you have multiple images (app, worker, migrator) or multi-target patterns, Docker Bake (HCL) defines them once. `depot/bake-action` is the drop-in for `docker/bake-action`:

```yaml
- uses: depot/setup-action@<sha>
- uses: depot/bake-action@<sha>
  with:
    project: ${{ vars.DEPOT_PROJECT_ID }}
    files: |
      docker-bake.hcl
    targets: |
      app
      worker
    push: true
```

See `templates/docker-bake.hcl` for a canonical multi-target Bake file. See `guides/10-local-ci-parity.md` for how Bake bridges local and CI.

## 5. Shared cache: team + local + CI

Depot's persistent NVMe cache is keyed per-project, not per-runner. That means:

- A developer running `depot build .` locally hits the same cache as CI builds.
- Two CI runs on the same project share cache without `cache-from`/`cache-to` plumbing.
- Cache is shared across branches; Depot handles invalidation per-layer.

This is materially different from GHA cache (10 GB cap, scoped per-repo, restored at start of run) or registry cache (pull cost on every layer miss).

## 6. Depot Runners: the cost story

Depot also offers GitHub Actions Runners as a drop-in for GitHub-hosted:

```yaml
runs-on: depot-ubuntu-24.04
```

Claims:

- 10x faster cache (NVMe vs. networked).
- 30% faster CPUs (recent generations).
- Sub-5-second cold start.
- Half the cost of GitHub-hosted runners.
- Ephemeral ARM runners (Graviton).

Source: `research/2026-04-25-depot-vs-github-runners.md`.

**When to migrate:**

- High Actions-minutes spend (>$200/month).
- Slow cold starts on PR builds.
- ARM builds in scope.
- Team large enough that the cache hit rate matters.

**When to skip:**

- Low spend. GitHub-hosted is fine.
- Strict data-residency requirements not yet supported.

## 7. Depot in Compose / local dev

```bash
# install Depot CLI
curl -L https://depot.dev/install-cli.sh | sh

# log in (browser)
depot login

# build using the same project as CI
depot build -t app:dev .

# or via Bake
depot bake app
```

The CLI uses the same persistent cache as CI. A `make build` target wrapping `depot bake app` gives developers the CI-equivalent build at one command, hitting the shared cache.

See `guides/10-local-ci-parity.md`.

## 8. Migration checklist

When migrating an existing pipeline to Depot:

- [ ] Create a Depot project (web UI or `depot project create`).
- [ ] Configure OIDC trust in Depot project settings (allow your GitHub repo + branches).
- [ ] Set `DEPOT_PROJECT_ID` as a repo variable (not secret, non-sensitive).
- [ ] Add `permissions: id-token: write` to the build job.
- [ ] Replace `docker/setup-buildx-action` with `depot/setup-action`.
- [ ] Replace `docker/build-push-action` with `depot/build-push-action`.
- [ ] Add `project: ${{ vars.DEPOT_PROJECT_ID }}` to build-push step.
- [ ] Remove `cache-from` / `cache-to` (Depot handles cache).
- [ ] If multi-arch, set `platforms: linux/amd64,linux/arm64` (native, no QEMU).
- [ ] Verify the first PR build hits cache on the second push (logs show "from cache").
- [ ] Optional: migrate `runs-on: ubuntu-24.04` → `depot-ubuntu-24.04`.

`examples/nextjs-with-depot-oidc.md` walks the full migration end-to-end.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| Depot wired in but still using `cache-from: type=gha,...` | Should-refactor | Remove cache-from/to; Depot handles |
| `DEPOT_TOKEN` repo secret instead of OIDC | Must-fix | Configure OIDC trust in Depot, drop the secret |
| Multi-arch via QEMU when Depot is available | Should-refactor | Use Depot native multi-arch |
| Running `depot build` locally without `depot login` (cache miss) | Style | Document `depot login` in onboarding |
| Bake config in `docker-bake.json` instead of `.hcl` (less expressive) | Style | Prefer `.hcl` for variables and matrix expansion |

## See also

- `guides/02-multi-arch-builds.md`: multi-arch context.
- `guides/08-caching-strategies.md`: cache backend trade-offs.
- `guides/10-local-ci-parity.md`: Docker Bake pattern.
- `templates/.github/workflows/main-deploy.yml`: Depot wired in.
- `examples/nextjs-with-depot-oidc.md`: full worked migration.
