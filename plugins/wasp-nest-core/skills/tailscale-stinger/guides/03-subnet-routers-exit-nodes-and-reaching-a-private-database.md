# 03. Subnet routers, exit nodes, and reaching a private database

## Two different tools, don't confuse them

**Subnet routers** extend the tailnet to a specific private subnet (a VPC, an office LAN, a managed database's network) so tailnet devices can reach non-Tailscale endpoints in it. **Exit nodes** route a device's *entire* internet-bound traffic through another tailnet device, like a traditional VPN. They solve different problems and are not interchangeable - do not stand up an exit node to solve "I need to reach my database" [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].

Tailscale's own docs name the database use case directly: "securely connect to cloud-managed services like Amazon RDS or Google Cloud SQL without exposing them to the public internet" is a stated subnet-router use case [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].

## Setting one up

Full command sequence in `references/subnet-router-setup.md`. The shape: install Tailscale on the gateway device, enable IP forwarding, `tailscale set --advertise-routes=<CIDR>`, get an Admin to authorize the route (or configure `autoApprovers` for a fully automated pipeline), then write a grant so the right group/tag can actually reach that CIDR. Disable key expiry on the router itself once it's live - that's the documented use case for disabling expiry, not a default to apply everywhere [raw/tailscale--key-expiry-and-security-model--zero-trust.md].

The one grant mistake worth flagging explicitly for exit nodes specifically: granting access to a tag does not grant exit-node usage. Exit-node routing requires a grant whose `dst` is `autogroup:internet` - naming the exit-node device itself only permits connecting to that device (e.g. SSH), not routing traffic through it [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].

## Reaching Neon specifically - read this before assuming Neon has a Tailscale button

Neon's own private-connectivity feature is **Neon Private Networking**, built on AWS PrivateLink - there is no native Neon-Tailscale integration surfaced anywhere in this skill's research [raw/tailscale--neon-private-networking--reaching-the-database.md]. Neon Private Networking requires the *client application itself* to run inside a matching AWS VPC. A Vercel-hosted SvelteKit app does not run inside a customer-owned AWS VPC by default, so this path is very likely closed off for the app's own runtime traffic - flagged here as an inference from the mechanics, not a confirmed Neon/Vercel incompatibility statement, so re-verify against current docs before ruling it out for a specific deployment [raw/tailscale--neon-private-networking--reaching-the-database.md].

What this skill actually recommends instead: a small **Tailscale bastion host**, tagged (`tag:db-bastion`), forwarding to the Neon connection string, that developers and CI reach over the tailnet by MagicDNS name instead of each developer's raw IP needing to sit in Neon's allowlist. Full command sequence: `references/db-bastion-pattern.md`.

**Before reaching for this pattern at all**, check whether it's actually needed: Neon's own IP allowlist (Scale plan) plus its default enforced TLS may already fully cover a team with stable developer IPs, with zero Tailscale involved. This pattern earns its complexity when IPs are unstable (remote/travelling devs) or a shared bastion beats per-developer allowlisting operationally - not by default [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].

## What this does not replace

A tailnet ACL - or a bastion sitting behind one - governs which *machines* can reach the database's network path. It says nothing about which *application roles* can read or write which rows. Keep authorization logic in the app/ORM layer regardless of the network topology in front of it; "a database that trusts every tailnet connection has an authorization model exactly one stolen laptop wide" [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].

## Next

`04-ssh-via-tailscale.md` covers reaching the bastion or any other tagged server interactively without managing SSH keys.
