# GitHub Actions OIDC: authenticating to cloud/service providers without long-lived secrets

- URL: https://docs.github.com/en/actions/concepts/security/openid-connect ; https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-cloud-providers ; https://docs.github.com/en/actions/reference/security/oidc ; https://github.com/aws-actions/configure-aws-credentials
- Fetched: 2026-08-14
- Source type: Official GitHub Actions docs + official AWS Actions repo
- Component: GitHub Actions OIDC / avoiding long-lived cloud credentials

## Content

### The core problem OIDC solves

Without OIDC, a workflow needing to reach a cloud provider stores that provider's credential as a long-lived GitHub secret and presents it on every run. Anyone with access to that secret (or a leak of it) has standing access until someone manually rotates it. With OIDC, the workflow requests a short-lived token from GitHub's own OIDC provider each run, presents it to the cloud provider, and the cloud provider - after validating the token's claims against a pre-configured trust policy - issues a cloud access token scoped to that single job run. No credential is duplicated into GitHub as a secret at all, and the issued token expires automatically (typically within the job's lifetime; GitHub's own OIDC token itself is time-boxed too, several sources note ~5 minutes for the raw GitHub-issued token before exchange).

### Two-part workflow change required, universally

1. **Grant the `id-token: write` permission.** Without it, a job cannot request an OIDC token at all.
   ```yaml
   permissions:
     id-token: write   # required to request the JWT
     contents: read    # required for actions/checkout
   ```
   This permission can be set at the workflow level or scoped down to a single job. It does **not** grant write access to any other resource - GitHub's docs are explicit that this only allows fetching/using an OIDC token, nothing else. For a reusable workflow called from outside its own org/enterprise, the permission must be granted explicitly at the *caller's* workflow or job level, not just the reusable workflow's own definition.
2. **Exchange the token via the provider's official login action** (preferred) or a manual `curl` against GitHub's OIDC endpoint using the automatically-injected `ACTIONS_ID_TOKEN_REQUEST_TOKEN` / `ACTIONS_ID_TOKEN_REQUEST_URL` environment variables, if no official action exists for that provider.

### The `sub` (subject) claim is the actual access-control lever

The OIDC token's claims include `aud` (audience, defaults to the repo owner's URL), `iss` (`https://token.actions.githubusercontent.com`), and critically `sub` - a structured string identifying exactly which workflow/repo/branch/environment is making the request, e.g. `repo:octo-org/octo-repo:ref:refs/heads/main` or, for a job running under a GitHub Environment, an added `environment:<name>` segment. The cloud provider's trust policy conditions its `AssumeRoleWithWebIdentity` (AWS) or equivalent grant on matching this `sub` string (often with `aud` also pinned), which is what prevents an unrelated repo or an untrusted branch from minting a cloud token even if it can request *some* OIDC token from GitHub.

**Currency note directly relevant to writing a trust policy today:** repositories created after **July 15, 2026** default to an **immutable subject claim format** that embeds both the owner's numeric ID and the repo's numeric ID in `sub` (e.g. `repo:<org>@<org_id>/<repo>@<repo_id>:ref:refs/heads/<branch>`), preventing a recycled org/repo *name* from silently inheriting an old trust policy's access after a rename or ownership transfer. Repositories created before that date keep the legacy name-only format unless explicitly opted in. This means a trust-policy example copied from an older tutorial (name-only `sub` format) may not match what a newly-created repo's token actually presents - check which format the target repo uses before writing the condition.

### AWS example (via `aws-actions/configure-aws-credentials`, the official action)

```yaml
permissions:
  id-token: write
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::<account-id>:role/<role-name>
      aws-region: us-east-1
```

Trust policy on the AWS side (IAM role, condition on the OIDC federated principal):

```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:<org>/<repo>:ref:refs/heads/<branch>"
    }
  }
}
```

The action's own README ranks OIDC as the "recommended" identity method ahead of four other supported (but discouraged) static-credential paths, explicitly advising: use temporary credentials when possible, and periodically rotate any long-lived credentials still in use where OIDC genuinely isn't an option.

### GCP example (via `google-github-actions/auth`, the official action)

Three modes, ranked by the action's own docs: (1) Direct Workload Identity Federation (preferred - no intermediate service account, but max token lifetime is only 10 minutes and not every GCP resource type supports the resulting `principalSet` identity type), (2) Workload Identity Federation through a Service Account (the GitHub OIDC token is exchanged for permission to impersonate a GCP service account, which then has the actual IAM grants - this is the more commonly viable path when a target resource doesn't support direct `principalSet` identities), (3) Service Account Key JSON (long-lived, explicitly flagged `[!CAUTION]` in the docs as a password-equivalent credential that "by default, never expires" - the fallback of last resort, not a recommended default).

### The general pattern this skill should apply beyond AWS/GCP specifically

Any provider offering an official GitHub OIDC integration (AWS, GCP, Azure, and - per the Doppler-specific raw note - Doppler's own Service Account Identity OIDC path) follows this same shape: grant `id-token: write`, use the provider's official exchange action if one exists, and scope the trust condition on `sub` (and usually `aud`) as tightly as the workflow's actual blast radius requires (down to a specific branch or GitHub Environment, not just the repo as a whole, wherever the provider's trust-policy syntax supports it).
