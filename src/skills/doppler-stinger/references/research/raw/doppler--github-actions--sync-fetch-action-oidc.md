# GitHub Actions: native sync integration, Secrets Fetch Action, doppler run, and OIDC

- URL: https://docs.doppler.com/docs/github-actions ; https://docs.doppler.com/docs/github-oidc-examples ; https://github.com/DopplerHQ/secrets-fetch-action ; https://www.doppler.com/blog/remove-hardcoded-secrets-github-actions
- Fetched: 2026-08-14
- Source type: Official docs + official GitHub Action README + official blog (docs.doppler.com, github.com/DopplerHQ, doppler.com/blog)
- Component: GitHub Actions / CI-CD

## Content

Doppler documents (and its own blog explicitly compares) **three** distinct ways to get secrets into a GitHub Actions workflow. They are not interchangeable defaults - each has a real trade-off.

### Method 1: Doppler <-> GitHub sync integration (push secrets into native GitHub Secrets)

Setup: create a dedicated **GitHub** environment in the Doppler project (GitHub doesn't map cleanly to Development/Staging/Production), authorize the **Doppler GitHub Application**, choose the target (Actions, Codespaces, or Dependabot secrets; for an org connection, Repository or Organization scope), and the Doppler config to sync from. On completion, Doppler syncs all secrets in that config into native GitHub Secrets and creates three `DOPPLER`-prefixed meta secrets automatically. From then on, any add/update/remove **in Doppler** instantly reflects in GitHub Secrets.

Constraints:
- Doppler **cannot** import existing GitHub secrets (GitHub's API doesn't expose secret values) - the only path is a manual export workflow run from inside GitHub Actions (see "Importing Secrets from GitHub Actions" below).
- All secret changes must be made in Doppler going forward, to avoid the two systems disagreeing about source of truth.
- Public repos can target a specific GitHub **Environment**'s secrets instead of repository-level secrets; multiple GitHub Environments each need their own separate Doppler sync.
- Org-connected accounts can sync to Organization Secrets instead of a single repo, with scope **All Repositories** or **Private Repositories only**.
- "Sync unmasked secrets as variables" - secrets flagged unmasked-visibility in Doppler sync as GitHub Actions *variables* instead of *secrets*, since GitHub automatically masks secret values in log output (useful for non-sensitive values like a port number that you actually want visible in logs).
- Benefit called out directly by Doppler's own blog: values synced this way are **native GitHub Secrets**, so GitHub's automatic log-masking applies with zero extra workflow code.

### Method 2: Doppler Secrets Fetch Action (`dopplerhq/secrets-fetch-action`)

A GitHub Marketplace Action that runs as an in-workflow step, authenticates to Doppler (Service Token or Service Account Identity via OIDC), fetches secrets for a given project+config, and exposes them as step `outputs` (default) or as injected environment variables (opt-in, `inject-env-vars: true`).

OIDC variant (no static long-lived token stored in GitHub Secrets at all):
```yaml
jobs:
  your-example-job:
    permissions:
      id-token: write # required to obtain the OIDC JWT from GitHub
    steps:
      - uses: dopplerhq/secrets-fetch-action@v2.0.0
        id: doppler
        with:
          auth-method: oidc
          doppler-identity-id: <your-service-account-identity-uuid>
          doppler-project: auth-api
          doppler-config: ci-cd
```

Static Service Account Token variant:
```yaml
- uses: dopplerhq/secrets-fetch-action@v2.0.0
  id: doppler
  with:
    doppler-token: ${{ secrets.DOPPLER_TOKEN }}
    doppler-project: auth-api
    doppler-config: ci-cd
```

Access a fetched secret via step output: `${{ steps.doppler.outputs.API_KEY }}` (masked automatically). The action **automatically registers fetched secrets for masking** in the workflow log, which the raw `doppler run` CLI method (below) does not do for you.

Trade-offs stated by Doppler's own blog comparison: makes an API call to Doppler during the workflow run (potential rate-limit exposure on very high-frequency workflows); slightly more workflow complexity (referencing `steps.<id>.outputs.*` vs. plain `${{ secrets.NAME }}`) compared to the sync method. OIDC auth specifically avoids storing/rotating a static `DOPPLER_TOKEN` at all, and - because each run gets a unique short-lived token - sidesteps per-static-token rate limits that a shared Service Token could otherwise hit under high workflow frequency.

### Method 3: raw `doppler run` inside a workflow step

```yaml
- name: Install Doppler CLI
  uses: dopplerhq/cli-action@v3
- name: Run with secrets
  run: doppler run -- your-command-here
  env:
    DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

Doppler's own blog states the **biggest drawback plainly**: `doppler run` does **not** automatically mask the secrets it injects. If a wrapped command echoes or logs a secret value (even by accident), it appears in plaintext in the GitHub Actions log unless every sensitive value is manually registered with GitHub's `::add-mask::` command before it could possibly be printed. Also makes live API calls to Doppler during the run (same rate-limit consideration as Method 2), and requires an explicit CLI-install step.

Doppler's own recommendation, stated directly: prefer Method 1 (sync) for robustness and automatic masking, or Method 2 (Secrets Fetch Action) as the reliable alternative that also handles masking; reserve Method 3 for a specific, well-understood niche need where you will rigorously hand-mask every sensitive value.

### Importing existing GitHub Secrets INTO Doppler (the reverse direction)

Because GitHub's API cannot return existing secret values, the only supported path is a manually-triggered (`workflow_dispatch`) workflow that runs *inside* GitHub Actions (where the runtime, not the API, has access to the secret values), strips out its own bootstrap secrets (`github_token`, `DOPPLER_TOKEN`, target project/config), uppercases remaining key names (a Doppler requirement), and uploads them with `doppler secrets upload --silent <(...)`.

### OIDC login via the CLI directly (no marketplace action)

For workflows that want CLI-native control rather than the packaged action, GitHub's built-in OIDC token endpoint (`ACTIONS_ID_TOKEN_REQUEST_TOKEN` / `ACTIONS_ID_TOKEN_REQUEST_URL`, requires `permissions: id-token: write`) can be exchanged for a GitHub OIDC JWT, then handed to `doppler oidc login --scope=. --identity=<service-account-identity-id> --token=$OIDC_TOKEN`, after which normal `doppler run`/`doppler secrets` calls work for the rest of the job. Doppler's docs note this method's secrets are **not** automatically masked either (same caveat as Method 3) - manual masking is the caller's responsibility if using the raw CLI path instead of the Secrets Fetch Action.
