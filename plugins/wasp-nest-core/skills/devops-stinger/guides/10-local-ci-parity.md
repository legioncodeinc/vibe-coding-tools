# 10: Local-CI parity

The only sustainable answer to "works on my machine" is "the same recipe runs locally and in CI". Source: `research/2026-04-25-docker-bake-hcl.md`.

---

## 1. Docker Bake (HCL): the shared definition

`docker-bake.hcl` defines build targets once. Both local devs and CI invoke the same targets:

```hcl
variable "TAG" {
  default = "dev"
}

variable "REGISTRY" {
  default = "ghcr.io/me"
}

group "default" {
  targets = ["app"]
}

group "all" {
  targets = ["app", "worker"]
}

target "app" {
  context    = "."
  dockerfile = "Dockerfile"
  target     = "runtime"
  tags       = ["${REGISTRY}/app:${TAG}"]
  platforms  = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=registry,ref=${REGISTRY}/app:buildcache"]
  cache-to   = ["type=registry,ref=${REGISTRY}/app:buildcache,mode=max"]
  args = {
    NODE_VERSION = "20.18.1"
  }
}

target "worker" {
  inherits = ["app"]
  target   = "worker-runtime"
  tags     = ["${REGISTRY}/worker:${TAG}"]
}
```

Local invocation:

```bash
TAG=local depot bake app
# or with vanilla buildx:
docker buildx bake app
```

CI invocation:

```yaml
- uses: depot/bake-action@<sha>
  with:
    project: ${{ vars.DEPOT_PROJECT_ID }}
    files: docker-bake.hcl
    targets: app
    set: |
      *.tags=ghcr.io/${{ github.repository }}:${{ github.sha }}
```

Same Bake file, same args, same cache strategy. Drift between local and CI becomes a *change to the Bake file*, which is reviewable.

See `templates/docker-bake.hcl` for the canonical version.

## 2. Make-target wrapper

A `Makefile` (or `taskfile.yml`) at repo root gives developers single-command access:

```makefile
.PHONY: build build-all test scan dev fmt

REGISTRY ?= ghcr.io/me
TAG ?= dev
export REGISTRY TAG

build:
	depot bake app

build-all:
	depot bake all

dev:
	docker compose --profile app up --watch

test:
	pnpm test

scan:
	docker buildx build --load -t scan-target .
	trivy image --severity CRITICAL,HIGH --exit-code 1 scan-target

fmt:
	hadolint Dockerfile
	pnpm format
```

Now `make build`, `make test`, `make scan` work locally. CI calls the same targets:

```yaml
- run: make build TAG=${{ github.sha }}
```

This pattern beats per-developer scripts (which always drift) and beats inline commands in CI (which diverge from what devs run).

## 3. The same `Dockerfile` for both

Avoid `Dockerfile.dev` vs. `Dockerfile.prod` divergence. Use multi-stage `target:` selection:

```dockerfile
FROM node:20-alpine AS deps
# ...

FROM node:20-alpine AS dev
# dev-only setup with watch tools
CMD ["pnpm", "dev"]

FROM node:20-alpine AS builder
# ...

FROM node:20-alpine AS runtime
# production runtime
USER node
CMD ["node", "dist/server.js"]
```

Build dev image: `docker build --target dev -t app:dev .`
Build prod image: `docker build --target runtime -t app:prod .` (default if no `--target`).

Bake's `target` field selects the stage explicitly per target.

## 4. Compose for local vs. registry-image for CI

Local devs use Compose to *build and run* the dev image (`docker compose --profile app up --watch`).

CI builds the production image via Bake/Depot, pushes, then deploys.

Both consume the same Dockerfile, the same `.dockerignore`, the same install scripts. The only difference is the `--target` stage and the orchestrator (Compose vs. K8s/Fargate/Fly).

## 5. Pre-commit hooks for parity

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/hadolint/hadolint
    rev: v2.12.0
    hooks:
      - id: hadolint-docker
  - repo: local
    hooks:
      - id: scripts-audit-workflow
        name: audit-workflow
        entry: bash scripts/audit-workflow.sh
        language: script
        files: \.github/workflows/.*\.yml$
```

Catches "Dockerfile lints fail" or "workflow has unpinned action" before push, not after the PR build fails.

## 6. The "make sure CI matches local" smoke test

Add a `make ci` target that runs the same checks CI runs:

```makefile
ci: fmt build test scan
	@echo "CI-equivalent checks passed"
```

A dev who runs `make ci` and gets green should expect a green PR build. If the PR build fails, the diff between `make ci` locally and CI is the bug: fix it in the Bake file, the Makefile, or the workflow.

## 7. Environment variables: `.env` discipline

Local: `.env` (gitignored) populates `process.env`.
CI: secrets injected via `env:` block on the step (mapped from OIDC or repo secrets).

The app reads `process.env.DATABASE_URL` either way. Document required env vars in `.env.example` (committed) so onboarding is "copy `.env.example` to `.env`, fill in".

For Compose, `.env` populates `${VAR}` interpolation. For Bake, `--set` or env vars override defaults.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| `Dockerfile.dev` and `Dockerfile.prod` separate files (drift) | Should-refactor | Single Dockerfile with `--target` stages |
| CI runs `docker build -t ... .` (no Bake), local devs run a Makefile | Should-refactor | Bake + Make wrapping Bake |
| No `.env.example`, onboarding requires asking around | Style | Commit `.env.example` |
| Per-developer scripts in `scripts/dev/` that aren't tested in CI | Should-refactor | Promote to `Makefile` targets, run `make ci` in CI |

## See also

- `guides/07-depot-integration.md`: Depot Bake integration.
- `guides/03-compose-for-dev.md`: Compose patterns.
- `templates/docker-bake.hcl`: canonical Bake file.
