# Developer-machine-to-private-database pattern: Neon + Tailscale bastion

Grounded in [raw/tailscale--neon-private-networking--reaching-the-database.md, raw/tailscale--subnet-routers-exit-nodes--private-network-access.md, raw/tailscale--funnel-and-serve--exposing-local-services.md]. Read `guides/03-subnet-routers-exit-nodes-and-reaching-a-private-database.md` first for the reasoning behind this pattern - this file is the command sequence only.

## Which pattern applies

- **Neon Private Networking (AWS PrivateLink)** is the native Neon answer, but it requires the *client application* to run inside a matching AWS VPC. A Vercel-hosted SvelteKit app does not run inside a customer-owned AWS VPC, so this path is very likely not usable for the app itself - re-verify against current Neon/Vercel docs before ruling it out entirely, since this is an inference, not a confirmed incompatibility [raw/tailscale--neon-private-networking--reaching-the-database.md].
- **This bastion pattern** is what this skill actually recommends for two concrete needs: (1) a developer's laptop reaching the database for local dev / one-off admin work without opening Neon's IP allowlist to every changing developer IP, and (2) CI reaching the database for migrations (see `github-actions-ephemeral-ci.md`).
- **Neon's own IP allowlist** (Scale plan) plus enforced TLS may already fully cover a team with stable IPs - don't reach for this pattern by default; reach for it when IPs are unstable or a shared bastion is preferred over per-developer allowlisting [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].

## Bastion setup

Provision one small VM (any cloud, or a spare always-on machine) that has network-level reachability to the Neon connection string - i.e. it just needs outbound HTTPS/Postgres-wire-protocol access to Neon's public endpoint, since Neon's proxy authenticates the connection regardless of the caller's network path. If you additionally restrict the Neon project to specific IPs (Scale-plan allowlist), allowlist the bastion's own static/outbound IP - not each developer's.

```bash
# On the bastion VM:
# 1. Install Tailscale, then tag it (see example-acl-policy.md for tagOwners).
sudo tailscale up --auth-key=<tagged-reusable-auth-key> --advertise-tags=tag:db-bastion

# 2. Forward the Postgres port over the tailnet only (never Funnel this).
tailscale serve --bg --tcp=5432 tcp://localhost:5432
```

Wait - the bastion itself has no local Postgres; it needs to proxy to Neon's real endpoint. Use a lightweight TCP forwarder (e.g. `socat`) so `localhost:5432` on the bastion actually reaches Neon:

```bash
# Forward local port 5432 on the bastion to Neon's real host:port.
sudo apt-get install -y socat
socat TCP-LISTEN:5432,fork TCP:<your-project>.<region>.aws.neon.tech:5432 &

# Then tailscale serve as above, forwarding the tailnet-facing port to that
# local socat listener.
tailscale serve --bg --tcp=5432 tcp://localhost:5432
```

Disable key expiry on the bastion (Machines page) since it's a trusted, hard-to-reach service node [raw/tailscale--key-expiry-and-security-model--zero-trust.md].

## Developer connection

```bash
# Any developer on the tailnet, once granted access to tag:db-bastion in the
# tailnet policy file (see example-acl-policy.md):
psql "postgresql://appuser:<password>@db-bastion.your-tailnet.ts.net:5432/appdb?sslmode=require"
```

MagicDNS resolves `db-bastion` (or the full FQDN if it's a shared/cross-tailnet device) without needing to track the bastion's CGNAT IP by hand [raw/tailscale--tailnet-devices-magicdns--overview.md]. Keep `sslmode=require` (or `verify-full`) on the connection string regardless of the private network path - Tailscale governs *which machines* can reach the bastion, not the database's own TLS/auth posture, and Neon enforces TLS by default anyway [raw/tailscale--neon-private-networking--reaching-the-database.md].

## What this pattern does NOT replace

Application-level authorization. The bastion (and the tailnet ACL gating it) controls which *machines* can reach port 5432 - it says nothing about which *application roles* can read or write which rows once a query lands. Keep that logic in the app/ORM layer regardless of network topology [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].
