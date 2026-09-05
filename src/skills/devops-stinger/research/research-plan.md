# Research Plan: devops-stinger

**Bee:** devops-worker-bee
**Forged:** 2026-04-25
**Topics covered:** `docker` + `depot-actions` from `cursor-subagent-research-combined.md` (sections at lines 282 + 308).

## Open questions from the brief

1. Kubernetes manifests in scope? **Resolved: out of scope.** Cloud-platform Bees and `db-worker-bee` own runtime topology. devops-worker-bee stops at "image built and pushed".
2. Hadolint deep config? **Resolved: recommend with default config; don't author custom ruleset.**
3. Pre-Buildx Docker support? **Resolved: out of scope.** Assume Buildx + Docker 24+ as modern default since 2023.
4. Self-hosted runner provisioning? **Resolved: recommend Depot's managed runners; don't author EC2/Terraform for self-hosted runner farms.**

## Authoritative sources to consult

### Primary (must fetch directly)

- https://docs.docker.com/build/building/multi-stage/
- https://docs.docker.com/build/building/secrets/
- https://docs.docker.com/build/cache/optimize/
- https://docs.docker.com/build/building/multi-platform/
- https://docs.docker.com/build/bake/
- https://docs.docker.com/compose/how-tos/profiles/
- https://docs.docker.com/compose/how-tos/use-secrets/
- https://docs.docker.com/compose/how-tos/startup-order/
- https://docs.docker.com/compose/how-tos/file-watch/
- https://docs.docker.com/build/ci/github-actions/cache/

### OWASP

- https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html

### GitHub Actions

- https://docs.github.com/en/actions/security-guides/automatic-token-authentication
- https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions
- https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- https://docs.github.com/en/actions/using-workflows/reusable-workflows
- https://docs.github.com/en/actions/using-workflows/about-composite-actions

### Depot

- https://depot.dev/docs
- https://depot.dev/docs/github-actions/overview
- https://depot.dev/docs/container-builds/integrations/github-actions
- https://github.com/depot/build-push-action
- https://github.com/depot/setup-action
- https://github.com/depot/bake-action
- https://depot.dev/blog/docker-layer-caching-in-github-actions
- https://depot.dev/blog/docker-multi-stage-builds

### Image scanning

- https://docs.docker.com/scout/
- https://github.com/aquasecurity/trivy
- https://github.com/aquasecurity/trivy-action

### Production references

- https://github.com/veggiemonk/awesome-docker
- https://github.com/docker/awesome-compose
- https://www.blacksmith.sh/blog/cache-is-king-a-guide-for-docker-layer-caching-in-github-actions
- https://trainwithdocker.com/articles/docker-best-practices

## Search queries executed

1. "Dockerfile multi-stage Node.js Next.js production 2026 BuildKit cache mounts"
2. "OWASP Docker Security Cheat Sheet 2026 non-root distroless"
3. "GitHub Actions OIDC AWS GCP Azure cloud authentication 2026"
4. "GitHub Actions pin to SHA commit security hardening 2026 supply chain"
5. "Depot build-push-action drop-in replacement docker build-push-action 2026"
6. "Depot ARM ephemeral runners GitHub Actions cost comparison 2026"
7. "Docker layer caching GitHub Actions registry cache vs gha cache backend 2026"
8. "Docker Bake HCL local CI parity make targets 2026"
9. "Trivy vs Docker Scout severity gate CI 2026"
10. "Docker Compose profiles depends_on service_healthy watch hot reload 2026"
11. "GitHub Actions reusable workflows composite actions concurrency cancel-in-progress 2026"
12. "GitHub Actions pull_request_target danger fork code execution 2026"
13. "SBOM provenance attestation GitHub Actions release 2026"

## Inventory checklist (canonical first move on every invocation)

- [ ] `Dockerfile`: base image, stages, USER, HEALTHCHECK, ARG/ENV usage.
- [ ] `.dockerignore`: present? canonical?
- [ ] `docker-compose*.yml`: services, profiles, healthchecks, secrets blocks.
- [ ] `.github/workflows/*.yml`: actions used (and pin form), `permissions:` blocks, OIDC, concurrency.
- [ ] `package.json`: Node version, package manager, scripts.
- [ ] Existing Depot wiring (`uses: depot/...`).
- [ ] Existing scan tooling (Trivy, Scout, Snyk).
- [ ] Existing `Makefile` / `taskfile.yml` / `docker-bake.hcl`.

## Target output

- 7 dated research notes in `research/2026-04-25-<topic>.md` (this file plus 6).
- Source notes for every factual claim in the guides.
- `open-questions.md` if user-judgment calls remain.
