# Ephemeral nodes and the Tailscale GitHub Action for CI/CD

- URL: https://tailscale.com/kb/1111/ephemeral-nodes ; https://tailscale.com/kb/1276/tailscale-github-action
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Ephemeral nodes / CI integration

## Content

### Ephemeral nodes

Purpose-built for short-lived infrastructure - containers, cloud functions, CI/CD runners - that would otherwise clutter the tailnet's device list forever.

- **Auto-removal**: an ephemeral node is removed from the tailnet after a period of inactivity, normally **30 to 60 minutes** after last activity (subject to change per Tailscale). Running `tailscale logout` inside the workload removes it **immediately** - the recommended pattern for a deterministic CI cleanup step.
- **Free minutes**: ephemeral node usage is free up to a monthly per-plan minute allowance. **If an ephemeral node stays connected 4+ hours, it stops counting against the ephemeral-minutes balance and instead counts as a standard tagged device** - relevant if a "CI runner" is actually long-lived (e.g. a persistent self-hosted runner) rather than truly ephemeral.
- Ephemeral nodes **can only** be created via an **ephemeral auth key** or by running `tailscaled` with `--state=mem:` (v1.22+); there is no regular-login path to ephemeral status.
- Best practice: pair ephemeral status with a **tagged** auth key (not a user identity) so access-control policy - not netmap propagation to every device - governs what the transient node can reach; use a **reusable** key if spinning up multiple instances of the same container rather than baking a single-use node key into the image (baking a static key causes duplicate-device/IP collisions).

### Tailscale GitHub Action (`tailscale/github-action@v4`)

Lets a GitHub Actions workflow join the tailnet for the duration of a job, then auto-cleans up.

Three supported auth mechanisms, in Tailscale's own preference order:
1. **Federated identity (workload identity federation)** - recommended. Uses a GitHub-issued OIDC JWT plus a Tailscale federated identity Client ID + Audience; requires the workflow to request `id-token: write` permission. No long-lived secret material sits in GitHub at all beyond the client ID/audience pairing.
2. **OAuth client** (Client ID + Client secret stored as GitHub encrypted secrets `TS_OAUTH_CLIENT_ID` / `TS_OAUTH_SECRET`).
3. **Auth key** (`TAILSCALE_AUTHKEY` secret) - should be reusable, ephemeral, tagged, and (if device approval is on) pre-approved.

Prerequisites regardless of method: Owner/Admin/Network admin permissions to set up, at least one tag already defined in the tailnet policy file for the runner identity, and a GitHub Actions runner image >= 2.237.1 (Node.js 24 support).

Workflow shape (OAuth client variant):

```yaml
permissions:
  id-token: write   # only required for the federated-identity variant

jobs:
  deploy:
    steps:
      - name: Tailscale
        uses: tailscale/github-action@v4
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
          tags: tag:ci
          ping: 100.x.y.z,db-bastion.my-tailnet.ts.net
```

- `tags` is a comma-separated list; every tag listed **must already exist** in the tailnet policy file before the workflow runs.
- The action creates an ephemeral node scoped to that tag's access-control grants, and **logs it out immediately when the job finishes** - the control server then removes it. Each run gets a fresh node/IP.
- Any ephemeral node created via **federated identity specifically** is automatically **pre-approved** even on tailnets with device approval enabled - a meaningful operational detail if device approval is otherwise mandatory.
- **`ping` parameter**: because new-device netmap propagation takes a few seconds across the tailnet, Tailscale recommends explicitly `ping`-ing the intended target IP(s)/hostname(s) in the action call (waits up to 3 minutes for direct or relayed connectivity) rather than assuming the very next workflow step can reach the peer instantly.
- Caching of the Tailscale binary is **on by default** (`use-cache: 'false'` to opt out); the action's default client version is pinned and does not silently track every new Tailscale release - override with `version: latest`, `version: unstable`, or an explicit version string if a specific behavior is needed.

Practical CI pattern for this stack: a GitHub Actions job that needs to run a migration against a Neon database reachable only through a Tailscale-fronted bastion/subnet router would use the OAuth-client or federated-identity method with `tag:ci`, granted access to `tag:db-bastion` (or the relevant subnet CIDR) in the tailnet policy file - never a long-lived personal auth key baked into repo secrets.
