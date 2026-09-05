# Open questions: devops-stinger

Items that needed user judgment or could not be definitively resolved at forge time (2026-04-25).

## Resolved at forge time

- **Kubernetes manifests / Helm charts in scope?** Resolved: out of scope. devops-worker-bee stops at "image built and pushed". Cloud-platform Bees (DOKS, Fly, etc.) and `db-worker-bee` own runtime topology.
- **Hadolint deep config?** Resolved: recommend with default ruleset; don't author custom Hadolint config.
- **Pre-Buildx / Docker < 24 support?** Resolved: out of scope. Assume Buildx-enabled Docker 24+ as modern default since 2023.
- **Self-hosted runner provisioning?** Resolved: recommend Depot's managed runners; don't author EC2/Terraform for self-hosted runner farms. Self-hosted runners have a real security model (anyone with workflow access can run code on your hardware): out of scope for this Stinger.
- **Catalog opinionation level?** Resolved: opinionated. "Use BuildKit cache mounts, not COPY-the-cache hacks": first-person, sourced.

## Open / deferred

1. **GitLab CI / Bitbucket Pipelines coverage?** This Stinger is GitHub Actions-specific. If a team is on GitLab/Bitbucket, the principles transfer (least privilege, OIDC, pinning, caching) but the syntax and tooling differ. Worth a separate Bee if the user base demands it.
2. **Bazel / Turborepo build orchestration?** Larger monorepos use Bazel or Turborepo as the orchestration layer above Docker. devops-stinger's Bake patterns work alongside but don't deeply integrate. Open question whether to add a `12-monorepo-build-orchestration.md` guide.
3. **Cosign / Sigstore signing depth?** SBOM + provenance via `depot/build-push-action` is wired in; full Cosign keyless signing flow isn't. May warrant an extension if the team's compliance requires verifiable signatures.
4. **Native ARM PR-build cost-benefit at small scale?** For very small teams with low Actions minutes spend, GitHub-hosted amd64-only is probably cheapest even with the QEMU multi-arch penalty. The cost line where Depot pays for itself depends on team size, build frequency, and cache hit rate. The brief acknowledges this; the guide gives heuristics rather than firm numbers (which would go stale fast).

## Currency notes

- Depot pricing and feature set (especially "Depot Runners") evolves. The 2025-2026 baseline is captured in `2026-04-25-depot-build-push-action.md` and `2026-04-25-depot-vs-github-runners.md`-equivalents (referenced in guides). When the Stinger is re-forged, refresh these against `https://depot.dev/pricing`.
- GitHub Actions defaults for `GITHUB_TOKEN` shifted to read-only for new repos in 2023; older repos still need manual configuration. The audit script flags missing `permissions:` regardless to be safe.
- Buildx is now the default builder in Docker 24+. The Stinger assumes Buildx-enabled Docker; pre-Buildx setups are out of scope.

## When to refresh this Stinger

- Depot ships a new product (e.g., new caching layer, new runner SKU): update `07-depot-integration.md` and the Depot research note.
- A major Action gets compromised → update the supply-chain narrative in `06-actions-security.md`.
- Docker / BuildKit ships a new caching directive or syntax → update `08-caching-strategies.md`.
- Compose ships a new top-level construct (like `develop` in 2.22) → update `03-compose-for-dev.md`.
