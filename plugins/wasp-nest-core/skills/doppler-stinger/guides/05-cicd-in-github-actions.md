# CI/CD in GitHub Actions

Grounded in `references/research/distilled-doppler.md` §9, citing [raw/doppler--github-actions--sync-fetch-action-oidc.md].

## Three methods - Doppler's own stated preference order

1. **Native Doppler <-> GitHub sync integration** (recommended default). Doppler pushes secrets into real GitHub Secrets whenever they change in Doppler; workflows then use plain `${{ secrets.NAME }}` with zero extra step wiring, and GitHub's own log masking applies automatically. Setup is dashboard-side (a dedicated Doppler `GitHub` environment, authorize the Doppler GitHub App, pick Actions/Codespaces/Dependabot as the target). Real limitation: Doppler cannot import existing GitHub secret values back out (GitHub's API doesn't expose them) - only new values pushed forward from Doppler.
2. **`dopplerhq/secrets-fetch-action`** (reliable alternative). An in-workflow step, auth via Service Token or OIDC Service Account Identity, exposes secrets as step outputs or injected env vars, auto-masks fetched values. Best fit when a workflow needs secrets from a config that isn't (or shouldn't be) synced wholesale into GitHub Secrets.
3. **Raw `doppler run --` in a step**. Does **not** auto-mask - the single biggest drawback per Doppler's own comparison. Reserve for a narrow, well-understood need, and hand-mask every sensitive value printed with `::add-mask::` if used.

Full copy-paste examples for methods 2 and 3: `references/github-actions-service-token-example.md`.

## OIDC - the preferred auth mechanism for CI, once available

Instead of storing a static `DOPPLER_TOKEN` repository secret, exchange GitHub's own OIDC token for Doppler access:

```yaml
permissions:
  id-token: write   # required to obtain the OIDC JWT from GitHub
steps:
  - uses: dopplerhq/secrets-fetch-action@v2.0.0
    with:
      auth-method: oidc
      doppler-identity-id: ${{ vars.DOPPLER_SERVICE_IDENTITY_ID }}
      doppler-project: myapp
      doppler-config: prd
```

Benefits stated directly in the research: no static token to store or rotate, and each run gets a unique short-lived token so per-token API rate limits that a shared Service Token could otherwise hit under high workflow frequency are sidestepped [raw/doppler--github-actions--sync-fetch-action-oidc.md].

## Importing existing GitHub Secrets into Doppler (the reverse direction)

Not directly possible via the integration (GitHub's API can't return secret values). The only supported path is a manually-triggered (`workflow_dispatch`) workflow run inside GitHub Actions itself, which has runtime access to the values, strips its own bootstrap secrets, uppercases key names (a Doppler requirement), and calls `doppler secrets upload`. Full workflow YAML: [raw/doppler--github-actions--sync-fetch-action-oidc.md].

## Scoping discipline for this stack

- One Service Token or Service Account Identity per Doppler config the workflow touches - never one token shared across `stg` and `prd` jobs.
- Gate any workflow step that can reach production secrets behind a GitHub Environment with required reviewers.
- Prefer the native sync integration for secrets a workflow uses constantly (build-time API keys); reserve the Fetch Action for secrets scoped to a single job that shouldn't live in general GitHub Secrets.

## Where to go next

- Token scoping mechanics: `guides/04-service-tokens-scoping-access-control.md`
- Copy-paste workflow YAML: `references/github-actions-service-token-example.md`
