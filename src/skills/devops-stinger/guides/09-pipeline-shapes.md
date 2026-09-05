# 09: Pipeline shapes

The four canonical pipelines every Node/Next.js repo needs. Source: `research/2026-04-25-pipeline-shapes-pr-main-release.md`.

---

## 1. PR build + smoke test

**Trigger:** `pull_request` against `main`.

**Goals:** fail fast on regressions before merge. Fast (target < 5 min cold, < 90 sec warm). Cheap (no push to registry).

**Stages:**

1. Checkout (no token escalation).
2. Setup (Node, pnpm, deps).
3. Lint + typecheck.
4. Unit + integration tests.
5. Build container (no push, just verify it builds).
6. Trivy scan (CRITICAL/HIGH gate).
7. Optional: smoke-test the built image (`docker run` + curl `/health`).

**Permissions:** `contents: read` only. Plus `security-events: write` if uploading SARIF.

**Concurrency:** `cancel-in-progress: true`: cancel previous build on new push to same PR.

See `templates/.github/workflows/pr-build.yml`.

## 2. Main branch full build + push

**Trigger:** `push: branches: [main]`.

**Goals:** every merge to main produces a published image. Tag with `:main`, `:sha-<short>`, and optionally `:latest`.

**Stages:**

1. Checkout.
2. OIDC auth to registry (ECR, GAR, ACR, GHCR).
3. Build multi-arch via Depot.
4. Push all tags.
5. Trivy scan + SARIF upload.
6. Trigger deploy (or signal a downstream workflow / release tag).

**Permissions:** `contents: read`, `id-token: write`, `packages: write` (for GHCR).

**Concurrency:** `cancel-in-progress: false`: never cancel a deploy.

See `templates/.github/workflows/main-deploy.yml`.

## 3. Release pipeline with provenance + SBOM

**Trigger:** `push: tags: ['v*.*.*']`.

**Goals:** signed, attested release. The image carries:

- SBOM (`sbom: true`): what's inside.
- Provenance (`provenance: mode=max`): how it was built, what source, what runner.
- Signed via cosign / GitHub OIDC keyless signing (optional).
- Tagged `:v1.2.3`, `:1.2`, `:1`, and `:latest` (carefully, `:latest` is opinionated).

**Stages:**

1. Checkout (full history for changelog generation).
2. Determine version from tag.
3. Build multi-arch with SBOM + provenance.
4. Push.
5. Generate changelog (e.g., from conventional commits).
6. Create GitHub Release with artifacts.
7. Trigger production deploy (often via separate workflow with environment protection + approval).

**Permissions:** `contents: write`, `id-token: write`, `packages: write`, `attestations: write`.

**Concurrency:** `cancel-in-progress: false`.

See `examples/nextjs-with-depot-oidc.md` for the full release wiring.

## 4. Scheduled rebuild / rescan

**Trigger:** `schedule: cron: "17 8 * * *"` (daily) + `workflow_dispatch:`.

**Goals:** catch CVEs that appear in unchanged base images. Optionally rebuild + republish if base image has updates.

**Stages:**

1. Checkout `main`.
2. Pull current `:latest` image.
3. Trivy scan.
4. If CRITICAL/HIGH found AND fix available: rebuild + push as `:latest` (re-pulls upstream Node image, gets the fix).
5. If CRITICAL/HIGH found AND no fix: file an issue.
6. Otherwise: pass silently.

**Permissions:** `contents: read`, `issues: write`, `packages: write` (if republishing).

See `templates/.github/workflows/main-deploy.yml` for deploy patterns this borrows.

## 5. The deploy step: handed to `db-worker-bee` for migrations, cloud-platform Bee for runtime

The image is pushed; what runs it is downstream. This Bee typically wires:

```yaml
deploy:
  needs: build
  if: github.ref == 'refs/heads/main'
  environment: production
  runs-on: ubuntu-24.04
  permissions:
    contents: read
    id-token: write
  steps:
    - uses: aws-actions/configure-aws-credentials@<sha>
      with:
        role-to-assume: ${{ vars.AWS_DEPLOY_ROLE }}
    - name: Run DB migrations
      run: ./scripts/run-migrations.sh
      # ↑ owned by db-worker-bee; devops-worker-bee wires it in
    - name: Deploy to Fargate / ECS
      run: aws ecs update-service ...
```

The migration step is `db-worker-bee`'s domain: its content (SQL, ORM commands, runtime checks) is theirs. `devops-worker-bee` ensures:

- The step runs **before** the new image is rolled out (or atomically, depending on strategy).
- Secrets reach it via OIDC, not static creds.
- A migration failure halts the deploy.

## 6. Smoke test patterns

After `docker build`, run:

```yaml
- name: Smoke test
  run: |
    docker run -d --name app -p 3000:3000 \
      -e NODE_ENV=production \
      -e DATABASE_URL=postgres://test \
      app:smoke
    timeout 30 bash -c 'until curl -fsS http://localhost:3000/health; do sleep 1; done'
    docker logs app
    docker stop app
```

A 30-second smoke catches "the image starts but immediately crashes" failures that pure unit tests miss.

## 7. The "what runs where" map

| Workflow | Runner | Builds via | Pushes? | Scans? | Deploys? |
|---|---|---|---|---|---|
| `pr-build.yml` | `ubuntu-24.04` (or `depot-ubuntu-24.04`) | Depot or `docker/build-push-action` | No | Yes (gate) | No |
| `main-deploy.yml` | `ubuntu-24.04` (or `depot-ubuntu-24.04`) | Depot multi-arch | Yes | Yes | Yes (via env) |
| `release.yml` | `ubuntu-24.04` | Depot + SBOM + provenance | Yes | Yes | Yes (via env approval) |
| `scheduled-rescan.yml` | `ubuntu-24.04` | Pull, scan, optional rebuild | Conditional | Yes | No |

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| One `ci.yml` does PR + main + release via `if:` | Should-refactor | Split per trigger |
| No smoke test (image builds but crashes on start) | Should-refactor | Add 30-sec health-check smoke |
| Migration step inside the running container's entrypoint (race conditions) | Must-fix | Separate migration job; deploy depends on success |
| Production deploy without environment protection / approval | Must-fix for prod | Use `environment: production` with required reviewers |
| `:latest` tag used as deploy reference (re-pulls drift) | Must-fix | Use `:sha-<short>` or `:vN.N.N` |
| No SBOM/provenance on release builds | Should-refactor | Add `sbom: true`, `provenance: mode=max` |

## See also

- `templates/.github/workflows/pr-build.yml`
- `templates/.github/workflows/main-deploy.yml`
- `templates/.github/workflows/reusable-build.yml`
- `examples/nextjs-with-depot-oidc.md`: full release flow.
- `examples/node-api-multiarch-trivy.md`: multi-arch + Trivy gate.
