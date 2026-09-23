# 06: GitHub Actions security

The hardening checklist. Every workflow goes through this. Source: `research/2026-04-25-actions-permissions-hardening.md`, `research/2026-04-25-actions-pin-to-sha.md`, `research/2026-04-25-oidc-cloud-federation.md`.

---

## 1. Default `GITHUB_TOKEN` to read-only at the repo level

Settings → Actions → General → "Workflow permissions" → **Read repository contents and packages permissions**.

Then each job opts back in to writes it specifically needs:

```yaml
jobs:
  build:
    permissions:
      contents: read
      id-token: write     # for OIDC to cloud
      packages: write     # for pushing to GHCR
    runs-on: ubuntu-24.04
    steps: ...
```

A workflow without an explicit `permissions:` block inherits the repo default. If the repo default is "Read and write" (the GitHub default until you change it), every job gets full write: a Must-fix finding.

Set repo to read-only default + explicit per-job opt-in. Source: GitHub Actions security hardening docs.

## 2. Pin actions to commit SHA: never `@main`, prefer SHA over `@v4`

Tags are mutable. A repo owner can retag `v4` to point at malicious code. The Tj-actions/changed-files supply-chain attack (March 2025) demonstrated exactly this.

**Wrong:**

```yaml
- uses: actions/checkout@v4
- uses: docker/build-push-action@main
```

**Right:**

```yaml
- uses: actions/checkout@<40-char-SHA> # v4.2.2
- uses: docker/build-push-action@<40-char-SHA> # v6.10.0
```

The version comment alongside is for human readers and Dependabot. Dependabot can auto-update SHA pins (pin-by-SHA workflow updates) when configured.

A workflow with unpinned `@v4` / `@main` references is a Must-fix finding for production-affecting workflows; Should-refactor for non-deploy workflows.

`scripts/pin-actions-to-sha.sh` rewrites tags to SHAs.

Source: `research/2026-04-25-actions-pin-to-sha.md`.

## 3. `permissions:` block per job

Default is read-only at repo level (Section 1); each job grants only what it needs:

| Job purpose | Permissions |
|---|---|
| PR build (no push) | `contents: read` |
| PR build with code scanning upload | `contents: read`, `security-events: write` |
| Build + push to GHCR | `contents: read`, `packages: write` |
| Build + push to ECR via OIDC | `contents: read`, `id-token: write` |
| Release with provenance | `contents: write`, `id-token: write`, `attestations: write` |
| Comment on PR | `pull-requests: write` |
| Update issue / project | `issues: write` |

Never use `permissions: write-all`. Never omit `permissions:` in a job that mutates state. Source: `research/2026-04-25-actions-permissions-hardening.md`.

## 4. OIDC for cloud: not long-lived credentials

Static cloud credentials in repo secrets:

- Survive secret rotations badly (everyone forgets).
- Leak in logs if accidentally `echo`ed.
- Can be exfiltrated by any compromised action.
- Stay valid until manually revoked.

OIDC federation:

- Workflow requests a short-lived token via `id-token: write`.
- The cloud provider (AWS, GCP, Azure, DO, Cloudflare) verifies the OIDC issuer and the token claims (repo, branch, environment).
- The token is valid for the duration of the job (typically 1 hour).
- Trust is configured once on the cloud side (IAM role + trust policy with `token.actions.githubusercontent.com` as issuer and the repo claim filter).

**AWS example:**

```yaml
- uses: aws-actions/configure-aws-credentials@<sha> # v4.x
  with:
    role-to-assume: arn:aws:iam::123456789012:role/github-actions-deploy
    aws-region: us-east-1
- run: aws ecr describe-repositories
```

**GCP example:**

```yaml
- uses: google-github-actions/auth@<sha>
  with:
    workload_identity_provider: projects/123/locations/global/workloadIdentityPools/github/providers/github
    service_account: deployer@project.iam.gserviceaccount.com
```

A pipeline that has OIDC available but uses static cloud credentials is a Must-fix finding. Source: `research/2026-04-25-oidc-cloud-federation.md`.

## 5. Fork PR safety: `pull_request` vs `pull_request_target`

| Trigger | Code that runs | Secrets accessible |
|---|---|---|
| `pull_request` | The PR's code (forked or not) | None, secrets unavailable to fork PRs |
| `pull_request_target` | The base branch's code | All secrets, runs in the trusted context |

`pull_request_target` is for jobs that label/comment on a PR without running its code. **The danger:** a workflow that uses `pull_request_target` and then `actions/checkout` with `ref: ${{ github.event.pull_request.head.sha }}` runs the fork's code with the trusted secrets. That is **arbitrary code execution from any fork**, on any open PR. Multiple high-profile compromises have happened this way.

**Must-fix:**

```yaml
on: pull_request_target
jobs:
  evil:
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}   # DANGER
      - run: pnpm install
      - run: pnpm build
```

**Right:** use `pull_request` for code-running, `pull_request_target` only for labels/comments without code. Source: GitHub Actions security hardening docs.

## 6. Forbid third-party action ingestion without review

Settings → Actions → General → "Allow specific actions and reusable workflows":

- Allow actions created by GitHub.
- Allow actions by `verified` creators.
- Allowlist specific patterns: `aws-actions/*`, `docker/*`, `depot/*`, `aquasecurity/*`.

A repo where any random `xyz/whatever-action@v1` can be added is over-trusting. The allowlist is cheap; maintain it.

## 7. Secret scope: environment-protected

For secrets that *must* be static (rare), put them behind environment protection:

```yaml
jobs:
  deploy:
    environment: production
    runs-on: ubuntu-24.04
    steps:
      - run: echo "Deploying with $PROD_TOKEN"
        env:
          PROD_TOKEN: ${{ secrets.PROD_TOKEN }}
```

GitHub Environments can require:

- Required reviewers (manual approval before the job runs).
- Wait timer.
- Deployment branch / tag restriction (only `main` can target `production`).

Repo-level secrets are world-readable to any workflow on any branch. Environment-protected secrets are scoped, use them.

## 8. Logs and `set-output` / `add-mask`

Mask any secret-derived value before echoing:

```yaml
- run: |
    TOKEN=$(curl -s ${API}/token | jq -r .token)
    echo "::add-mask::$TOKEN"
    echo "TOKEN=$TOKEN" >> $GITHUB_ENV
```

Never `echo $SECRET`. Never write secrets to step outputs without masking: they appear in logs.

## 9. Audit script

`scripts/audit-workflow.sh` checks:

- Every workflow declares `permissions:` (per-job or top-level).
- No `permissions: write-all`.
- No `pull_request_target` + `head.sha` checkout pattern.
- All `uses:` reference a 40-char SHA, not a tag.
- OIDC permission (`id-token: write`) only declared by jobs that use it.

Run as a PR check.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| `permissions: write-all` | Must-fix | Per-job minimum permissions |
| No `permissions:` block + repo default is "Read and write" | Must-fix | Set repo default read-only, declare per-job |
| `uses: actions/checkout@v4` (tag, not SHA) | Must-fix for prod workflows | Pin to SHA + version comment |
| `pull_request_target` + `actions/checkout` of `head.sha` | Must-fix | Use `pull_request` for code-running |
| Static cloud credentials when OIDC is supported | Must-fix | OIDC federation |
| `production` deploy uses repo-level secrets without env protection | Must-fix | Environment with required reviewers |
| `echo $SECRET` in `run:` step | Must-fix | Use `::add-mask::` and avoid echoing |
| Third-party action `xyz/something@v1` not allowlisted | Should-refactor | Repo allowlist + SHA pin |

## See also

- `guides/05-actions-architecture.md`: concurrency, reusable, matrix.
- `guides/07-depot-integration.md`: Depot OIDC.
- `scripts/audit-workflow.sh`: automated check.
- `scripts/pin-actions-to-sha.sh`: tag → SHA rewriter.
