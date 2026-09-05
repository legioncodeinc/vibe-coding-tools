# 02: Multi-arch builds

When to ship `linux/amd64` + `linux/arm64`, when not to, and how to make it cheap. Source: `research/2026-04-25-multi-arch-build-cost.md`.

---

## When multi-arch matters

| Consumer | Architecture |
|---|---|
| AWS Graviton (EC2, Fargate, Lambda Container) | arm64 |
| Apple Silicon dev machines (M1/M2/M3/M4) | arm64 |
| Raspberry Pi, edge devices | arm64 (or armv7) |
| Standard x86 EC2, GCE, Azure VMs | amd64 |
| DigitalOcean Droplets (default) | amd64 |
| GitHub-hosted standard runners | amd64 |
| GitHub-hosted larger runners (some) | amd64 or arm64 |

**Default:** if your team uses Apple Silicon for dev *and* deploys to amd64 cloud, ship multi-arch. Building only amd64 forces M-series users into emulation, which is slow and occasionally broken.

**Default:** if you deploy to AWS Graviton (commonly 20-40% cheaper than x86 equivalents), ship arm64 for production and you save real money.

## When to skip multi-arch

- Single-arch fleet, no Apple Silicon dev machines, no Graviton plans → amd64 only.
- arm64 build cost (without Depot or native runners) > savings → revisit when Depot is wired in (`guides/07-depot-integration.md`).

## Three ways to build multi-arch

### A. QEMU emulation on a single runner (slow, free)

```yaml
- uses: docker/setup-qemu-action@<sha> # v3.x
- uses: docker/setup-buildx-action@<sha> # v3.x
- uses: docker/build-push-action@<sha> # v6.x
  with:
    platforms: linux/amd64,linux/arm64
    push: true
```

**Cost:** the arm64 build runs in QEMU emulation on amd64 silicon. For a Node app, expect 3-8x slower arm64 builds. For native deps (bcrypt, sharp), expect 10x or build failures.

### B. Native runners (fast, paid)

GitHub-hosted larger arm64 runners exist. Matrix-build per arch on native silicon, then merge:

```yaml
strategy:
  matrix:
    include:
      - arch: amd64
        runs-on: ubuntu-24.04
      - arch: arm64
        runs-on: ubuntu-24.04-arm64
runs-on: ${{ matrix.runs-on }}
```

Then a final job uses `docker buildx imagetools create` to merge the per-arch tags into a manifest.

### C. Depot: best (both arches, native, persistent cache)

```yaml
- uses: depot/setup-action@<sha>
- uses: depot/build-push-action@<sha>
  with:
    project: <depot-project-id>
    platforms: linux/amd64,linux/arm64
    push: true
```

Depot runs each arch on native silicon (Intel + Graviton) with persistent NVMe layer cache shared across builds. No QEMU. No matrix gymnastics. Source: `research/2026-04-25-depot-build-push-action.md`.

## Build-cost math

| Strategy | Cold build (Node app, 200 deps) | Warm build (small change) | Setup complexity |
|---|---|---|---|
| QEMU multi-arch on free runner | 8-12 min | 4-6 min | Low |
| Native matrix on GH-hosted | 3-4 min per arch (parallel) | 1-2 min per arch | Medium (manifest merge) |
| Depot multi-arch | 1-3 min | 20-60 sec | Low (drop-in) |

For >5 builds/day with arm64 in scope, Depot's drop-in pays for itself. Source: `research/2026-04-25-depot-vs-github-runners.md`.

## Compose for multi-arch

For local dev, Compose only builds the host arch by default. To force a specific arch (debugging arm64 on an amd64 machine, or vice versa):

```yaml
services:
  app:
    build:
      context: .
      platforms:
        - linux/arm64
```

But this triggers QEMU and is slow. Prefer per-host builds.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| Multi-arch enabled but consumer is amd64-only | Should-refactor | Drop arm64; halve build time |
| Single-arch (amd64) but team uses Apple Silicon | Should-refactor | Add arm64; stop forcing devs into emulation |
| QEMU multi-arch on every PR build | Should-refactor | Native matrix or Depot |
| Different code paths per arch (with `--platform` overrides) without manifest merge | Must-fix | Single manifest; runtime selects correct arch |

## See also

- `guides/07-depot-integration.md`: Depot drop-in for native multi-arch.
- `guides/08-caching-strategies.md`: cache scope across architectures.
- `templates/.github/workflows/main-deploy.yml`: multi-arch via Depot.
