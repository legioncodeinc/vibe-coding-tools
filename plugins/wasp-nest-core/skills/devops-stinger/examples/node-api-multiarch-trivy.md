# Example: Node API with multi-arch (amd64 + arm64) + Trivy gate

A worked example for a Node API serving multi-arch consumers (Apple Silicon dev + Graviton prod). Source: `guides/02-multi-arch-builds.md`, `guides/04-image-scanning.md`.

---

## Stack

- Node 20 API (Fastify, no framework-specific Docker concerns).
- Consumers: Apple Silicon dev workstations + AWS Graviton (arm64) production fleet.
- GHCR for image registry.
- Depot for native multi-arch builds.
- Trivy CRITICAL/HIGH gate on PRs.

## Why multi-arch matters here

- Devs on M-series Macs running the image without QEMU = no slow emulation, no surprise native-module breakage.
- Production on Graviton = 20-40% cheaper than equivalent x86 EC2.

## Files produced

```
.
├── Dockerfile                      # multi-stage Node API per templates/Dockerfile.node-app
├── .dockerignore
├── docker-bake.hcl                 # multi-arch target
└── .github/workflows/
    ├── pr-build.yml                # builds amd64 only, scans with Trivy
    ├── main-deploy.yml             # builds amd64+arm64, pushes both, deploys to GHCR
    └── reusable-build.yml
```

## docker-bake.hcl excerpt

```hcl
target "api" {
  inherits = ["_base"]
  target   = "runtime"
  tags = [
    "ghcr.io/me/api:${TAG}",
    "ghcr.io/me/api:latest",
  ]
  platforms = ["linux/amd64", "linux/arm64"]
}
```

## PR build: amd64 only, Trivy gates

```yaml
name: PR build

on:
  pull_request:
    branches: [main]

concurrency:
  group: pr-build-${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions: {}

jobs:
  build:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      id-token: write
      security-events: write
    steps:
      - uses: actions/checkout@<sha>
      - uses: depot/setup-action@<sha>

      - name: Build (amd64 only on PRs, fast)
        uses: depot/build-push-action@<sha>
        with:
          project: ${{ vars.DEPOT_PROJECT_ID }}
          load: true                   # load locally for scan
          platforms: linux/amd64
          tags: api:scan

      - name: Trivy scan (CRITICAL,HIGH gate)
        uses: aquasecurity/trivy-action@<sha>
        with:
          image-ref: api:scan
          format: sarif
          output: trivy-results.sarif
          severity: CRITICAL,HIGH
          ignore-unfixed: true
          exit-code: 1

      - if: always()
        uses: github/codeql-action/upload-sarif@<sha>
        with:
          sarif_file: trivy-results.sarif

      - name: Smoke test
        run: |
          docker run -d --name api -p 3000:3000 api:scan
          timeout 30 bash -c 'until curl -fsS http://localhost:3000/health; do sleep 1; done'
          docker logs api
          docker stop api
```

## Main deploy: multi-arch push to GHCR

```yaml
name: Main deploy

on:
  push:
    branches: [main]

concurrency:
  group: main-deploy
  cancel-in-progress: false

permissions: {}

jobs:
  build-push:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      id-token: write
      packages: write    # GHCR push
    steps:
      - uses: actions/checkout@<sha>
      - uses: depot/setup-action@<sha>

      - name: Build + push multi-arch
        uses: depot/build-push-action@<sha>
        with:
          project: ${{ vars.DEPOT_PROJECT_ID }}
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            ghcr.io/me/api:main
            ghcr.io/me/api:sha-${{ github.sha }}

      - name: Trivy scan post-push (reporting only)
        uses: aquasecurity/trivy-action@<sha>
        with:
          image-ref: ghcr.io/me/api:sha-${{ github.sha }}
          severity: CRITICAL,HIGH
          ignore-unfixed: true
          exit-code: 0    # PR build is the gate; here we report
```

## Why amd64-only on PRs but multi-arch on main

- PR builds get reviewed and re-built on every push. Cutting arm64 (4-10x slower under QEMU on a free runner, without Depot, anyway) makes PRs faster. With Depot, both archs are native, so this is mostly habit.
- Main builds run once per merge and ship to production. arm64 must be built and pushed.

If your team is fully on Depot, building multi-arch on PRs is fine: both arches are native and fast.

## Local dev

```bash
# build for local arch only
make build TAG=local

# or via Bake
depot bake api

# multi-arch local (rare, for debugging arm64 from amd64 host)
docker buildx bake api-multiarch
```

## Outcomes

- PR build: ~70 sec warm (amd64-only), ~2.5 min cold.
- Main deploy: ~2 min build (multi-arch native via Depot), ~30 sec push.
- Trivy gate catches regressions; scheduled rescan picks up new CVEs.
- Devs on M-series pull the arm64 manifest: no QEMU, no surprises.

## See also

- `templates/Dockerfile.node-app`
- `guides/02-multi-arch-builds.md`
- `guides/04-image-scanning.md`
- `guides/07-depot-integration.md`
