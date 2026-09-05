# Scripts

Three deterministic helpers for devops-worker-bee. Each runs in CI or locally.

## `audit-dockerfile.sh`

Static Dockerfile audit. Catches `:latest`, `ARG SECRET=`, missing `USER`, missing `HEALTHCHECK`, single-stage builds, missing cache mounts, missing `.dockerignore`.

```bash
bash scripts/audit-dockerfile.sh                 # audits ./Dockerfile
bash scripts/audit-dockerfile.sh path/to/Dockerfile
```

Exit 0 = clean. Exit 1 = must-fix findings.

Reference: `guides/01-dockerfile-patterns.md`.

## `audit-workflow.sh`

Static GitHub Actions audit. Catches `permissions: write-all`, missing `permissions:` block, actions pinned to tags instead of SHAs, `pull_request_target` + `head.sha` checkout, secrets echoed in logs, `cancel-in-progress: true` on deploy workflows, missing concurrency on PR builds.

```bash
bash scripts/audit-workflow.sh                   # audits .github/workflows/
bash scripts/audit-workflow.sh path/to/dir
```

Exit 0 = clean. Exit 1 = must-fix findings.

Reference: `guides/06-actions-security.md`.

## `pin-actions-to-sha.sh`

Rewrites `uses: owner/repo@<tag>` to `uses: owner/repo@<sha>  # <tag>` across a workflow directory. Requires `gh` CLI authenticated and `jq`.

```bash
bash scripts/pin-actions-to-sha.sh               # rewrites .github/workflows/*.yml
bash scripts/pin-actions-to-sha.sh path/to/dir
```

Idempotent, already-SHA-pinned references are skipped. Review the diff with `git diff` before committing.

Reference: `guides/06-actions-security.md` §2.

## CI integration

All three scripts are intended to run in CI as fast pre-checks:

```yaml
- name: Audit Dockerfile
  run: bash scripts/audit-dockerfile.sh

- name: Audit workflows
  run: bash scripts/audit-workflow.sh
```

Run them in `.github/workflows/pr-build.yml` as a `lint` job before the build job to fail fast.
