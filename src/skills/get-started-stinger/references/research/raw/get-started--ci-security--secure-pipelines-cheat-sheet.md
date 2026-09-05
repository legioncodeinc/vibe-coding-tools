# GitHub Actions Security Cheat Sheet: Permissions, Pinning, Secrets & OIDC
- URL: https://secure-pipelines.com/ci-cd-security/github-actions-security-cheat-sheet/
- Fetched: 2026-08-14
- Source type: community-blog
- Component: ci

Published 2026-03-24, author Said OULMAKHZOUNE. Practitioner cheat sheet that operationalizes the official GitHub guidance with copy-paste YAML.

## Permissions — principle of least privilege

Default `GITHUB_TOKEN` is read-write on most scopes unless overridden. Put a workflow-level default at the top of every workflow:

```yaml
name: CI
on: [push, pull_request]
permissions: read-all
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

For jobs that never touch GitHub APIs or the repo, use empty permissions:

```yaml
jobs:
  build:
    permissions: {}
    steps:
      - uses: actions/checkout@v4
```

`actions/checkout` falls back to an anonymous clone for public repos, so `permissions: {}` is safe for checkout there; private repos need `contents: read` explicitly. Rule of thumb: start every job at `permissions: {}` and add scopes one at a time until the job passes — never leave the default read-write in place. Repo owners should also change Settings > Actions > General > Workflow permissions to "Read repository contents and packages permissions" so any workflow that omits a `permissions:` block gets read-only by default.

## Action pinning — stop using tags

```yaml
# DANGEROUS — tag can be moved to any commit
- uses: actions/checkout@v4

# SAFE — immutable commit reference
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

Find the SHA for a tag:

```bash
git ls-remote --tags https://github.com/actions/checkout.git v4.1.1
# or
gh api repos/actions/checkout/git/ref/tags/v4.1.1 --jq '.object.sha'
```

Automate the churn with Dependabot's `github-actions` ecosystem — it understands SHA pins and updates both the SHA and the version-tag comment in one PR.

## Secret scopes

GitHub offers three secret scopes (repository, environment, organization); pick the narrowest one that covers the consumer to minimize blast radius.

## OIDC / workload identity federation

Stop storing long-lived cloud credentials as secrets; exchange a short-lived OIDC JWT for cloud credentials instead.

```yaml
permissions:
  id-token: write   # Required to request the OIDC JWT
  contents: read    # Required for actions/checkout
```

AWS example uses `aws-actions/configure-aws-credentials` pinned to a SHA with `role-to-assume` and `aws-region`; GCP example uses Workload Identity Federation with `workload_identity_provider` and `service_account`. Key benefit: no static credentials stored anywhere, tokens expire in minutes, and the cloud-side trust policy restricts which repos/branches/environments may assume the role.

## Third-party action safety checklist

Before adopting any third-party action, verify: publisher (verified creator or known org such as `actions/*`, `aws-actions/*`), source code (read `action.yml` and the entrypoint), requested permissions, usage/stars, maintenance cadence, and whether it pulls a large `node_modules` tree.

## Quick reference card

| Practice | One-liner |
| --- | --- |
| Default permissions | `permissions: read-all` at workflow top, or `{}` plus per-job grants |
| Pin actions | Full 40-char SHA + version comment |
| Auto-update pins | Dependabot with `github-actions` ecosystem |
| Cloud auth | OIDC federation, never static keys |
| Protect secrets | Environment scopes + protection rules |
| Prevent injection | Always route user-controlled values through `env:` |
| Review workflows | CODEOWNERS on `.github/workflows/` |
| Fork risky triggers | Avoid `pull_request_target` + untrusted checkout |

Start with permissions and pinning (five minutes, eliminates entire attack classes), then layer OIDC federation and injection prevention.
