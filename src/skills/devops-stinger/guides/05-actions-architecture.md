# 05: GitHub Actions architecture

How to shape workflows so they scale beyond a single `.github/workflows/ci.yml`. Source: `research/2026-04-25-actions-reusable-workflows.md`.

---

## 1. Reusable workflows (`workflow_call`)

DRY for entire workflows. Define once, call from PR, main, release, scheduled:

```yaml
# .github/workflows/reusable-build.yml
name: Reusable build
on:
  workflow_call:
    inputs:
      push:
        type: boolean
        default: false
      platforms:
        type: string
        default: linux/amd64
      tags:
        type: string
        required: true
    secrets:
      DEPOT_TOKEN:
        required: false   # OIDC preferred; secret only as fallback

jobs:
  build:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      id-token: write       # for Depot OIDC
      packages: write       # only if pushing to GHCR
    steps:
      - uses: actions/checkout@<sha>
      - uses: depot/setup-action@<sha>
      - uses: depot/build-push-action@<sha>
        with:
          project: ${{ vars.DEPOT_PROJECT_ID }}
          push: ${{ inputs.push }}
          platforms: ${{ inputs.platforms }}
          tags: ${{ inputs.tags }}
```

Caller:

```yaml
# .github/workflows/pr-build.yml
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      push: false
      tags: app:pr-${{ github.event.pull_request.number }}
```

**Key rule:** the reusable workflow file lives in the same repo (`./.github/...`) or a separately versioned repo. Cross-org reusable workflows require explicit allowlists; see `guides/06-actions-security.md`.

## 2. Composite actions

DRY for shared *steps* (not entire workflows). Example: a "setup project" action that handles checkout, Node, pnpm, and dep install:

```yaml
# .github/actions/setup/action.yml
name: Setup
description: Checkout, Node, pnpm, install
runs:
  using: composite
  steps:
    - uses: actions/checkout@<sha>
    - uses: actions/setup-node@<sha>
      with:
        node-version-file: .nvmrc
    - uses: pnpm/action-setup@<sha>
      with:
        run_install: false
    - run: pnpm install --frozen-lockfile
      shell: bash
```

Use:

```yaml
- uses: ./.github/actions/setup
```

When to choose composite vs. reusable workflow:

- **Composite action** = shared steps within a job. Lightweight.
- **Reusable workflow** = shared *job(s)*. Heavier; required when the shared logic includes runner selection, permissions, or its own job graph.

## 3. Concurrency groups

Without a concurrency group, every PR push spawns a new build that races the previous one. Cost: real money in Actions minutes; signal: confusing because builds finish out of order.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

- **PR builds:** `cancel-in-progress: true`. Each push cancels the previous build for that PR.
- **Main / release builds:** `cancel-in-progress: false`. Never cancel a build that might be deploying.

A PR-build workflow without a concurrency group is a Should-refactor finding: measurable Actions-minutes waste.

## 4. Matrix strategies

Matrix runs the same job across N variations:

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [20, 22]
        os: [ubuntu-24.04, macos-14]
        include:
          - node: 22
            os: ubuntu-24.04
            coverage: true
      fail-fast: false
    runs-on: ${{ matrix.os }}
    steps:
      - uses: ./.github/actions/setup
      - run: pnpm test ${{ matrix.coverage && '--coverage' || '' }}
```

Use for:

- Multi-version Node testing (LTS support).
- Multi-OS testing (when truly relevant, most webapps don't need Windows runners).
- Multi-arch builds (see `guides/02-multi-arch-builds.md`).

`fail-fast: false` lets all matrix legs finish even if one fails. Default is `true`; flip to `false` when you want to see the full failure surface.

## 5. Conditional jobs

```yaml
jobs:
  build:
    if: github.event_name == 'pull_request' || github.ref == 'refs/heads/main'
    ...

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    ...

  preview-deploy:
    needs: build
    if: github.event_name == 'pull_request'
    environment:
      name: pr-${{ github.event.pull_request.number }}
      url: ${{ steps.deploy.outputs.url }}
```

The `environment:` block ties a job to a GitHub Environment, which can require manual approval, restrict secrets, and post a deployment status. Use for production deploys.

## 6. Runner selection

| Runner | When |
|---|---|
| `ubuntu-24.04` (or `-latest`) | Default for most jobs |
| `ubuntu-24.04-arm64` (or larger arm64) | arm64 native build leg |
| `depot-ubuntu-24.04` (Depot managed) | When you want Depot's runner improvements (10x cache, 30% faster CPU, sub-5s cold start) |
| `self-hosted` | Avoid unless you have a real reason: you own the security model |

Source: `research/2026-04-25-depot-vs-github-runners.md`.

## 7. Workflow file split

| File | Trigger |
|---|---|
| `.github/workflows/pr-build.yml` | `pull_request`: build, test, scan, no push |
| `.github/workflows/main-deploy.yml` | `push: branches: [main]`: build, push to registry, deploy |
| `.github/workflows/release.yml` | `push: tags: ['v*.*.*']`: build, push, SBOM, provenance, release notes |
| `.github/workflows/reusable-build.yml` | `workflow_call`: shared by the above |
| `.github/workflows/scheduled-rescan.yml` | `schedule: cron`: daily image rescan |

Splitting prevents the "one ci.yml does everything via if-conditions" mess.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| Every workflow inlines the same steps | Should-refactor | Extract to reusable workflow or composite action |
| No concurrency group on PR build | Should-refactor | Add `concurrency: ... cancel-in-progress: true` |
| `cancel-in-progress: true` on main/release builds | Must-fix | Set to `false` for main/release; deploys can mid-cancel |
| One workflow file with 200 lines of `if:` conditions | Should-refactor | Split per trigger |
| Matrix with no `fail-fast: false` when fanning matters | Style | Add `fail-fast: false` |
| Cross-org reusable workflow without explicit allowlist | Must-fix | Allowlist via Settings → Actions → General |

## See also

- `guides/06-actions-security.md`: `permissions:`, OIDC, fork PRs.
- `guides/07-depot-integration.md`: Depot setup-action + build-push-action.
- `templates/.github/workflows/reusable-build.yml`: canonical reusable build.
- `templates/.github/workflows/pr-build.yml`: PR build calling reusable.
- `templates/.github/workflows/main-deploy.yml`: main deploy calling reusable.
