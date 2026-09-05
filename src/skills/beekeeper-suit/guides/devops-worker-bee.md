# devops-worker-bee

## Domain
This Bee owns container build and CI/CD pipeline architecture for Node/Next.js/TypeScript stacks: Dockerfile hygiene (multi-stage, BuildKit secret and cache mounts, non-root, HEALTHCHECK, `.dockerignore`), Docker Compose for dev (profiles, healthchecked `depends_on`, secrets, watch), GitHub Actions architecture (reusable workflows, composite actions, concurrency, OIDC, least-privilege `GITHUB_TOKEN`, SHA pinning), Depot build acceleration, image scanning (Trivy, Scout), and local-CI parity via Docker Bake.

## Paired Stinger
[devops-stinger](../../devops-stinger) - Dockerfile patterns, Actions security, Depot integration, caching strategy, pipeline shapes, and local-CI parity guides, plus deterministic audit scripts.

## Trigger phrases
- "review my Dockerfile"
- "design our CI pipeline"
- "audit our workflow security"
- "migrate to Depot"
- "this build is slow"
- "add a healthcheck to compose"
- "we leaked a secret in CI"
- "unpinned GitHub Action"

## Do NOT route when
- The ask is cloud infrastructure provisioning: that's the relevant cloud-platform Bee, this Bee wires pipeline steps but doesn't provision cloud resources.
- The ask is DB schema or migration authorship: db-worker-bee owns that content, this Bee only wires the migration step into the pipeline.
- The ask is a CVE deep audit or secret-leak forensics: security-worker-bee owns that, this Bee surfaces the concern (e.g. `ARG` mounting a secret) and hands off.
- The ask is Kubernetes manifests or Helm charts: out of scope entirely, hand to a cloud-platform Bee.
- The ask is Doppler-specific secret management (project/config model, service tokens, rotation): that's doppler-worker-bee, this Bee only owns the CI step that consumes the secret.

## Inputs the Bee needs
- `Dockerfile`(s), `.dockerignore`, `docker-compose*.yml`
- `.github/workflows/*.yml` and any `Makefile` / `taskfile.yml` / `docker-bake.hcl`
- `package.json` for Node version and package manager
- Existing Depot wiring and scan tooling, if any

## Outputs
- A Dockerfile diff, Compose scaffold, or GitHub Actions workflow file
- An audit report at `library/requirements/reports/devops/<date>-<scope>-audit.md` with severity-classified findings
- A Depot migration plan or CI/CD architecture ADR

## Commonly sequenced with
- security-worker-bee: takes the CVE or secret-leak forensics this Bee surfaces but doesn't itself audit
- db-worker-bee: supplies migration content that this Bee wires into the pipeline's migration step
- doppler-worker-bee: manages the secrets this Bee's pipeline steps consume via OIDC or a fetch action
