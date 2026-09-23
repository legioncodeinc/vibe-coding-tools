# 04: Image scanning

How to gate on CVE scan results in CI. Source: `research/2026-04-25-trivy-vs-scout.md`.

---

## 1. Pick one scanner: Trivy or Docker Scout

| Scanner | Strengths | Trade-offs |
|---|---|---|
| **Trivy** (Aqua) | Open source, CLI + GitHub Action, scans images + filesystem + repos + IaC, SARIF output for GitHub code scanning | More config knobs to learn |
| **Docker Scout** | Built into Docker Hub / Desktop, smooth UX, policy-as-code | Free tier capped; full features paid; less flexible than Trivy in CI |

**Default:** Trivy. Open source, no account dependency, integrates cleanly into GitHub code scanning via SARIF. Docker Scout is great for teams already deep in Docker Hub and willing to pay.

## 2. Baseline scan in CI

```yaml
- name: Build image (load locally)
  uses: depot/build-push-action@<sha> # v1.x
  with:
    project: ${{ vars.DEPOT_PROJECT_ID }}
    load: true
    tags: app:scan

- name: Trivy scan
  uses: aquasecurity/trivy-action@<sha> # 0.x.x
  with:
    image-ref: app:scan
    format: sarif
    output: trivy-results.sarif
    severity: CRITICAL,HIGH
    exit-code: 1            # fail the job on CRITICAL or HIGH
    ignore-unfixed: true    # don't fail on findings with no fix yet

- name: Upload SARIF to code scanning
  if: always()
  uses: github/codeql-action/upload-sarif@<sha>
  with:
    sarif_file: trivy-results.sarif
```

**`exit-code: 1`** is the gate. **`ignore-unfixed: true`** keeps the gate sane: failing on a CRITICAL with no upstream fix yet just blocks shipping without a path to green.

## 3. Severity policy

| Finding | CI behavior |
|---|---|
| CRITICAL with fix available | Fail, must update base image or patch |
| HIGH with fix available | Fail, must update base image or patch |
| CRITICAL/HIGH unfixed | Pass with warning; track upstream |
| MEDIUM/LOW | Report only; do not gate |

This is the conservative starting policy. Loosen for a fast-moving startup; tighten for regulated workloads (HIPAA, PCI). Document the policy in-repo (`SECURITY.md` or `library/knowledge/private/architecture/devops-scan-policy.md`).

## 4. Where to run the scan

Two choices:

### A. PR build: scan before merge

Add the Trivy step to `.github/workflows/pr-build.yml`. Builds the image, scans, fails the PR on CRITICAL/HIGH. Catches regressions before merge.

### B. Scheduled rebuild: catch new CVEs in unchanged images

```yaml
on:
  schedule:
    - cron: "17 8 * * *"   # 8:17 UTC daily
  workflow_dispatch:

jobs:
  rescan:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@<sha>
      - uses: aquasecurity/trivy-action@<sha>
        with:
          image-ref: ghcr.io/${{ github.repository }}:latest
          severity: CRITICAL,HIGH
          exit-code: 1
```

A CVE published yesterday on a Postgres or Node base image affects every image you've already shipped. Daily rescan catches it without waiting for the next code change.

**Both** is the right answer. PR build catches regressions; scheduled scan catches drift.

## 5. SBOM + provenance (release builds)

Release builds (tagged versions) should ship an SBOM (Software Bill of Materials) and provenance attestation. With Depot:

```yaml
- uses: depot/build-push-action@<sha>
  with:
    project: ${{ vars.DEPOT_PROJECT_ID }}
    sbom: true
    provenance: mode=max
    push: true
    tags: ghcr.io/${{ github.repository }}:${{ github.ref_name }}
```

With `docker/build-push-action`:

```yaml
- uses: docker/build-push-action@<sha>
  with:
    sbom: true
    provenance: mode=max
    push: true
```

Consumers (security scanners, supply chain tooling) can verify what's in the image and how it was built. Source: `research/2026-04-25-sbom-provenance-attestation.md`.

## 6. Dockerfile linting: Hadolint

Catch many of these issues at lint time, before scan:

```yaml
- uses: hadolint/hadolint-action@<sha> # v3.x
  with:
    dockerfile: Dockerfile
    failure-threshold: warning
```

Hadolint catches `FROM:latest`, missing `USER`, missing version pins. Cheap; run on every PR. Recommend over a custom ruleset.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| No image scan in CI | Should-refactor | Add Trivy step with `severity: CRITICAL,HIGH`, `exit-code: 1` |
| Scan runs but `exit-code: 0` (no gate) | Should-refactor | Add `exit-code: 1` |
| Scan gates on MEDIUM/LOW (false-positive treadmill) | Style | Limit to CRITICAL,HIGH initially |
| `ignore-unfixed: false` blocking on CVEs with no fix | Should-refactor | `ignore-unfixed: true` |
| Scheduled rescan absent | Should-refactor | Add daily cron rescan |
| No SBOM on release builds | Should-refactor | Add `sbom: true` + `provenance: mode=max` |

## See also

- `guides/06-actions-security.md`: broader workflow-security context.
- `templates/.github/workflows/pr-build.yml`: Trivy step wired in.
- `examples/node-api-multiarch-trivy.md`: full worked example.
