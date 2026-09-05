# GitHub Actions: service-token-scoped workflow step

Grounded in [raw/doppler--github-actions--sync-fetch-action-oidc.md], [raw/doppler--tokens--service-tokens-and-token-formats.md].

Three methods exist (see `references/research/distilled-doppler.md` §9 for the full comparison). Below are working examples for the two CI-relevant ones: the recommended Secrets Fetch Action (with OIDC, no static token) and a Service-Token-scoped fallback for repos/orgs that can't use OIDC yet.

## Preferred: Secrets Fetch Action with OIDC (no long-lived token stored in GitHub)

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # required to obtain the OIDC JWT from GitHub
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Fetch secrets from Doppler
        uses: dopplerhq/secrets-fetch-action@v2.0.0
        id: doppler
        with:
          auth-method: oidc
          doppler-identity-id: ${{ vars.DOPPLER_SERVICE_IDENTITY_ID }}
          doppler-project: myapp
          doppler-config: prd
          inject-env-vars: true   # secrets available as env vars in later steps

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        # DATABASE_URL, WORKOS_API_KEY, etc. are already in the environment
        # and automatically masked in the log by the action.
```

Setup once, outside the workflow file: create a Service Account Identity in the Doppler dashboard, scope it to the `myapp` / `prd` config, and store its UUID as a GitHub Actions **variable** (not a secret - it's an identifier, not a credential) named `DOPPLER_SERVICE_IDENTITY_ID`.

## Fallback: static Service Token (when OIDC isn't set up yet)

```yaml
name: Run tests with secrets

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v3

      - name: Run tests
        run: doppler run -- npm test
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

Setup once: generate a Service Token scoped to exactly the project+config this workflow needs (e.g. `myapp` / `stg` for a test job, never `prd`), store it as the repository secret `DOPPLER_TOKEN`.

**Manual masking is on you with this method** - `doppler run` does not auto-mask, unlike the Secrets Fetch Action or the native sync integration. If this workflow ever echoes an env var for debugging, first register it for masking:

```yaml
      - name: Fetch and mask a value manually if needed
        run: |
          VALUE=$(doppler secrets get SOME_SECRET --plain)
          echo "::add-mask::$VALUE"
```

## Which method to reach for

- Need the secret available as `${{ secrets.NAME }}` in many workflows with zero per-workflow wiring -> set up the native Doppler-to-GitHub sync integration instead (dashboard-configured, not a workflow step) [raw/doppler--github-actions--sync-fetch-action-oidc.md].
- Need it scoped precisely to one job, fetched fresh at run time, with automatic masking, and ideally no static token at all -> Secrets Fetch Action with OIDC (first example above).
- Stuck without OIDC support in this repo/org yet -> Secrets Fetch Action or raw `doppler run` with a narrowly-scoped Service Token (second example above), and plan to migrate to OIDC.

## Scoping discipline

Never reuse one Service Token across `stg` and `prd` jobs in the same workflow file. Generate one token per config, store each under a distinctly named repository or environment secret (e.g. `DOPPLER_TOKEN_STG`, `DOPPLER_TOKEN_PRD`), and gate the production one behind a GitHub Environment with required reviewers if the deploy job can reach production infrastructure [raw/doppler--tokens--service-tokens-and-token-formats.md].
