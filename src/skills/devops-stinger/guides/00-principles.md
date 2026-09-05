# 00: Principles

The non-negotiables. Read on every invocation.

## The ten principles

### 1. Inventory the repo first, always

Before recommending *anything*, capture:

- `Dockerfile`(s) and `.dockerignore`: current base, stages, root user status, HEALTHCHECK presence.
- `docker-compose*.yml`: services, profiles, depends_on conditions, secrets blocks.
- `.github/workflows/*.yml`: actions used (and their pin form), `permissions:` blocks, OIDC vs. static creds, concurrency groups.
- `package.json`: Node version (engines.node), package manager, scripts.
- Existing Depot wiring (`uses: depot/...`), existing scan tooling (Trivy, Scout, Snyk), existing make targets / Bake files.

A recommendation written without reading the existing pipeline is wrong advice.

Source: `research/2026-04-25-research-plan.md` lists the canonical inventory checklist.

### 2. Least privilege everywhere

Three surfaces, one rule:

- **Containers.** Run as a non-root user (`USER node` / dedicated UID). Never `USER root` in the runtime stage. Source: OWASP Docker Cheatsheet and `research/2026-04-25-owasp-docker-cheatsheet.md`.
- **`GITHUB_TOKEN`.** Set repo default to "Read repository contents permission" in Settings → Actions → General. Each job declares an explicit `permissions:` block with only what it needs (`contents: read` for builds, `id-token: write` for OIDC, `packages: write` only for the publish job). Source: `research/2026-04-25-actions-permissions-hardening.md`.
- **Cloud auth.** OIDC federation, not long-lived keys. Source: `research/2026-04-25-oidc-cloud-federation.md`.

### 3. Cache is a first-class architectural concern

Every build defines its cache backend explicitly. The "cache is king" principle (see `research/2026-04-25-cache-is-king-gha.md`) is the basis for every "build is slow" finding:

- BuildKit named cache mounts for package managers (`--mount=type=cache,target=/root/.npm`).
- Layer cache backend chosen deliberately: Depot persistent NVMe (best), registry cache (good), GHA cache backend (acceptable, 10 GB cap), no cache (finding).
- Cache scope clear: per-branch, per-PR, shared across team; see `guides/08-caching-strategies.md`.

### 4. Parity beats convenience

A build that runs locally but not in CI (or vice versa) is a finding. Standardize:

- Docker Bake (HCL) defines build targets once. Both `make build` locally and `depot bake` in CI invoke the same targets.
- Compose files split: `docker-compose.dev.yml` for local, `docker-compose.prod.yml` for production-shape testing (when applicable).
- See `guides/10-local-ci-parity.md`.

### 5. Secrets never via `ARG` or `ENV`

`ARG SECRET=...` bakes the value into image history (`docker history` reveals it). `ENV SECRET=...` bakes it into the runtime image. Use:

- BuildKit: `RUN --mount=type=secret,id=npm_token cat /run/secrets/npm_token | npm login ...`
- Compose: `secrets:` block with file-based secrets, mounted as files at `/run/secrets/`.
- Actions: OIDC for cloud auth; for things that genuinely require static creds, scope tightly with environment-protected secrets.

Source: `research/2026-04-25-buildkit-secret-mounts.md`.

### 6. Multi-stage by default

Even for a "simple" Node app:

- **Builder stage** carries dev deps, runs `pnpm install`, produces the build artifact.
- **Runtime stage** copies only the artifact + production deps. Final image is up to 80% smaller (well-documented baseline).
- Source: `research/2026-04-25-multi-stage-size-reduction.md`.

### 7. Pin everything

- Base image: minor + patch tag minimum (`node:20.18.1-alpine3.20`). For compliance-critical builds, pin to digest (`@sha256:...`). Never `:latest`.
- Actions: commit SHA with version comment alongside (`uses: actions/checkout@<sha> # v4.2.2`). Tags can be retagged; SHAs are immutable.
- Source: `research/2026-04-25-actions-pin-to-sha.md`.

### 8. OIDC over long-lived cloud credentials

AWS, GCP, Azure, DigitalOcean, Cloudflare: all support OIDC federation from GitHub Actions. The Action requests a short-lived token via `id-token: write` permission; the cloud provider trusts the OIDC issuer. Repo secrets shrink from "long-lived AWS access keys" to nothing. Source: `research/2026-04-25-oidc-cloud-federation.md`.

### 9. Cite every finding

Two citations per finding:

- **Where in the user's repo**: `Dockerfile:14`, `.github/workflows/deploy.yml:31`, `docker-compose.yml:42`.
- **Why it's a finding**: guide section + research note (`guides/06-actions-security.md §3` + `research/2026-04-25-actions-permissions-hardening.md`) or external URL.

### 10. Severity discipline

Three levels only:

| Severity | Example | Blocks PR? |
|---|---|---|
| Must-fix | Secret in `ARG`, `permissions: write-all`, action pinned to `@main`, `pull_request_target` + checkout of `head.sha`, root user in production image, base image at `:latest` | Yes |
| Should-refactor | Missing concurrency group, missing HEALTHCHECK, no `.dockerignore`, no Trivy/Scout scan, no cache mount, GitHub-hosted runner used for ARM-only repeat builds | No, open follow-up |
| Style | Layer ordering nit, label format, naming | No, suggestion |

Calling a style nit "must-fix" destroys reviewer trust. Be disciplined.

---

## First-move checklist

Before writing findings, confirm:

- [ ] `Dockerfile`(s), `docker-compose*.yml`, `.github/workflows/*.yml` read.
- [ ] `package.json` Node version + package manager captured.
- [ ] Invocation classified (`dockerfile-author` / `compose-bootstrap` / `pipeline-design` / `pipeline-audit` / `depot-migration`).
- [ ] Relevant guide(s) identified from the routing table in `SKILL.md`.
- [ ] Severity rubric in mind.

## Cross-Bee boundaries

Below is what you *do not own*. Hand off if the question is primarily:

| Question type | Owner |
|---|---|
| CVE deep audit, secret-leak forensics, RBAC correctness | `security-worker-bee` |
| Database migration authorship, runtime DB readiness | `db-worker-bee` (devops-stinger wires the step in) |
| Pipeline PRD authoring | `library-worker-bee` (you provide rationale + acceptance criteria) |
| Post-implementation verification | `quality-worker-bee` |
| React app's Node version / workspace setup | confirm with `react-worker-bee` before locking base image |
| Cloud provisioning (creating the resource the pipeline deploys to) | cloud-platform Bee |

You *surface* concerns ("flagging this `ARG SECRET=` to security-worker-bee") but don't author the security audit yourself.

## Scope explicitly excluded (v1)

- **Kubernetes manifests / Helm charts.** devops-stinger stops at "image built and pushed". Cloud-platform Bees and `db-worker-bee` own runtime topology.
- **Dockerfile linting deep config.** Recommend Hadolint as a PR step; do not author a custom Hadolint ruleset.
- **Self-hosted runner provisioning.** Recommend Depot's managed runners; do not author EC2/Terraform for self-hosted runner farms.
- **Non-Buildx / pre-Docker-24 setups.** Assume Buildx-enabled Docker 24+ as the modern default since 2023.

## Example in action

`examples/nextjs-with-depot-oidc.md` shows these principles applied end-to-end on a Next.js + Depot + AWS-ECR pipeline with severity-labeled findings.
