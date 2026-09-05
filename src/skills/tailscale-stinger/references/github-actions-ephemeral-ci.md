# GitHub Actions CI step: ephemeral node + OAuth client reaching a private resource

Grounded in [raw/tailscale--ci-ephemeral-nodes--github-actions.md, raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md]. Use this for a migration job, a smoke test against staging, or anything that needs to reach a tailnet-only resource (e.g. the `tag:db-bastion` node from `example-acl-policy.md`) from CI.

## Prerequisite

`tag:ci` must already exist in the tailnet policy file (see `example-acl-policy.md`) with a grant to whatever it needs to reach - the workflow cannot create the tag itself [raw/tailscale--ci-ephemeral-nodes--github-actions.md].

## OAuth client setup (one-time, in the Tailscale admin console)

1. Trust credentials page > Generate credential > OAuth.
2. Grant the minimum scope needed - for provisioning ephemeral CI nodes, that's `auth_keys` (write), scoped to `tag:ci`.
3. Store the resulting Client ID and Client secret as GitHub repository secrets: `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET`.

## Workflow

```yaml
name: migrate-against-staging-db

on:
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Connect to tailnet
        uses: tailscale/github-action@v4
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
          tags: tag:ci
          # Wait for netmap propagation before assuming the bastion is reachable.
          ping: db-bastion.your-tailnet.ts.net

      - name: Run migration through the DB bastion
        run: |
          # The bastion forwards Postgres over `tailscale serve --tcp=5432` (see
          # serve-and-funnel-commands.md), so this hits it as if it were local.
          psql "postgresql://migrator@db-bastion.your-tailnet.ts.net:5432/appdb" \
            -f migrations/latest.sql
```

## Federated identity variant (recommended over OAuth client where available)

Trades the long-lived OAuth client secret for a short-lived GitHub OIDC token - nothing but a Client ID and an Audience value need to sit in GitHub secrets [raw/tailscale--ci-ephemeral-nodes--github-actions.md].

```yaml
permissions:
  id-token: write   # required for the Tailscale action to request a GitHub JWT

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Connect to tailnet
        uses: tailscale/github-action@v4
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}   # federated identity client ID
          audience: ${{ secrets.TS_AUDIENCE }}
          tags: tag:ci
          ping: db-bastion.your-tailnet.ts.net
```

## What this buys you

- The node created by this action is **ephemeral**: it logs itself out and disappears from the tailnet the moment the job finishes, so CI runs never accumulate stale devices in the Machines list [raw/tailscale--ci-ephemeral-nodes--github-actions.md].
- Scoped by `tag:ci`'s grants alone, per `example-acl-policy.md` - a compromised workflow can reach exactly the DB bastion on port 5432, nothing else.
- No long-lived Tailscale secret sits in the repo at all if using the federated-identity variant; the OAuth-client variant's secret is still bounded by whatever scope you granted it, and rotating that secret is a `doppler-stinger` concern, not this skill's.
