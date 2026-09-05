# OIDC federation from GitHub Actions to cloud providers

**Source:** https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect + per-cloud docs
**Retrieved:** 2026-04-25

## What OIDC solves

The classic pattern: store long-lived AWS access keys (or GCP service account JSON, or Azure SP credentials) as repo secrets. Workflow reads them, calls the cloud SDK, deploys.

Problems:

- Static credentials live forever until manually rotated. Most teams forget.
- Secrets can be exfiltrated by any compromised step. The credential is then valid until rotated.
- Repo-level secrets are world-readable to any branch, a fork PR can't read them, but any push to `main` or any branch with a workflow that uses them can.

OIDC federation solves all of this.

## How it works

1. The workflow declares `permissions: id-token: write`.
2. GitHub Actions issues a short-lived OIDC token signed by GitHub's identity provider, with claims like `repo:owner/repo:ref:refs/heads/main`.
3. The cloud action (e.g., `aws-actions/configure-aws-credentials`) presents this token to the cloud's STS / federation endpoint.
4. The cloud verifies the token (issuer, audience, claims) and exchanges it for short-lived credentials (typically 1 hour).
5. The workflow uses those credentials. They expire when the job ends.

No long-lived credentials in repo secrets.

## AWS setup

1. IAM → Identity providers → Add provider:
   - Type: OpenID Connect
   - URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. Create IAM role with trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:<org>/<repo>:ref:refs/heads/main"
      }
    }
  }]
}
```

3. In workflow:

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@<sha>
    with:
      role-to-assume: arn:aws:iam::<account>:role/<role>
      aws-region: us-east-1
```

## GCP setup

Workload Identity Federation:

1. Create workload identity pool + provider with GitHub OIDC issuer.
2. Bind a service account to the pool.
3. In workflow:

```yaml
- uses: google-github-actions/auth@<sha>
  with:
    workload_identity_provider: projects/123/locations/global/workloadIdentityPools/github/providers/github
    service_account: deployer@project.iam.gserviceaccount.com
```

## Azure setup

```yaml
- uses: azure/login@<sha>
  with:
    client-id: ${{ vars.AZURE_CLIENT_ID }}
    tenant-id: ${{ vars.AZURE_TENANT_ID }}
    subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}
```

(With OIDC trust configured on the Azure side via federated credentials on the App Registration.)

## DigitalOcean / Cloudflare / Vercel

All support OIDC federation. Pattern is similar: vendor's GitHub Action presents the OIDC token, the vendor exchanges for short-lived API access.

## Subject claim filtering: narrow as possible

The `sub` claim in the OIDC token is structured as:

- `repo:<org>/<repo>:ref:refs/heads/main`: workflow on main
- `repo:<org>/<repo>:ref:refs/tags/v1.2.3`: workflow on a tag
- `repo:<org>/<repo>:environment:production`: job using the `production` environment
- `repo:<org>/<repo>:pull_request`: workflow on a pull_request

Trust policies should match the *narrowest* claim that satisfies the use case:

- Production deploys: `repo:org/repo:environment:production` (combined with environment-protected approval).
- Release builds: `repo:org/repo:ref:refs/tags/v*`.
- Avoid `repo:org/repo:*` (matches all events including fork PRs).

## Why repo secrets persist for some cases

- Slack webhooks, Sentry DSN, third-party SaaS without OIDC support → repo secrets, scoped per environment.
- Database URLs (when not fetched from cloud secret manager via OIDC) → repo secrets, behind environment protection.

The principle: OIDC where supported; repo secrets only for SaaS without OIDC; environment-protected secrets for production-grade.

## Relevance to this Stinger

- `guides/06-actions-security.md` §4.
- `guides/07-depot-integration.md` §2 (Depot OIDC).
- `templates/.github/workflows/main-deploy.yml`: uses OIDC.
- `examples/nextjs-with-depot-oidc.md`: full worked migration.
- A pipeline using static cloud credentials when OIDC is supported is a Must-fix finding.
