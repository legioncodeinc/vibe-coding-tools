# GitHub Actions: `GITHUB_TOKEN` permissions and hardening

**Source:** https://docs.github.com/en/actions/security-guides/automatic-token-authentication + https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions
**Retrieved:** 2026-04-25

## The default and why it's wrong

GitHub historically defaulted `GITHUB_TOKEN` permissions to "Read and write" (a.k.a. permissive). New repos (post-2023) default to read-only, but many existing repos still inherit the older permissive default.

A workflow without an explicit `permissions:` block inherits the repo default. If repo default is "Read and write", every job has full token write access, including `contents: write`, `packages: write`, `pull_requests: write`, etc. That's an enormous blast radius for a compromised action.

## The fix: two parts

### Part 1: Set the repo default to read-only

Settings → Actions → General → "Workflow permissions":

- ☑ Read repository contents and packages permissions
- ☐ Allow GitHub Actions to create and approve pull requests (typically off)

This makes the read-only default repo-wide.

### Part 2: Per-job minimum permissions

Each job declares only what it needs:

```yaml
jobs:
  build:
    permissions:
      contents: read
      id-token: write     # for OIDC
      packages: write     # only if pushing to GHCR
```

Top-level `permissions: {}` (empty) is also valid: it means "no permissions" globally, then each job declares its own.

## The full permission keys

| Key | Use cases |
|---|---|
| `actions: read/write` | Read/cancel workflow runs |
| `attestations: read/write` | Build provenance attestations |
| `checks: read/write` | Status checks on PRs |
| `contents: read/write` | Read code; push commits |
| `deployments: read/write` | Manage GitHub Environments |
| `id-token: write` | OIDC token for cloud federation |
| `issues: read/write` | Comment / close issues |
| `models: read` | Models in a repo (newer feature) |
| `packages: read/write` | GHCR push/pull |
| `pages: write` | GitHub Pages |
| `pull-requests: read/write` | Comment / close PRs |
| `repository-projects: read/write` | Projects |
| `security-events: write` | Upload SARIF for code scanning |
| `statuses: read/write` | Set commit statuses |

## Common patterns

| Job purpose | Permissions |
|---|---|
| Lint + test | `contents: read` |
| Build (no push) + Trivy SARIF upload | `contents: read`, `security-events: write` |
| Build + push to GHCR | `contents: read`, `packages: write` |
| Build + push via OIDC (Depot or cloud) | `contents: read`, `id-token: write` |
| Release with provenance | `contents: write`, `id-token: write`, `attestations: write` |
| Comment on PR | `pull-requests: write` |
| Auto-merge / auto-approve | `pull-requests: write`, `contents: write` |

## What `permissions: write-all` means

Equivalent to declaring every key as `write`. Always a Must-fix finding.

## What no `permissions:` block means

Inherits the repo default. If the repo is properly configured (Part 1 above), this is read-only. If the repo isn't configured, this could be permissive, so devops-stinger enforces explicit per-job blocks regardless.

## Relevance to this Stinger

- `guides/06-actions-security.md` §1, §3.
- `scripts/audit-workflow.sh`: flags `permissions: write-all` (Must-fix) and missing `permissions:` block (Must-fix).
- `templates/.github/workflows/*`: every workflow declares `permissions: {}` at top, then per-job blocks.
