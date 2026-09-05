# Tailnet concepts, devices, and MagicDNS

- URL: https://tailscale.com/kb/1136/tailnet ; https://tailscale.com/kb/1081/magicdns
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Tailnet / MagicDNS

## Content

### What is a tailnet

A tailnet is a private, secure network formed the moment you first log into Tailscale on any device. Every device that authenticates (via a user account or a tag) joins the tailnet. It is inaccessible from the public internet - "a secure conference room where only invited participants can enter."

Each tailnet has a **tailnet DNS name**, either a default (`tailfe8c.ts.net`) or a personalized one (`yak-bebop.ts.net`), used for MagicDNS, HTTPS, and sharing without revealing the organization's identity.

Every device gets a private Tailscale IP in the CGNAT range (`100.x.y.z`), letting devices reach each other directly regardless of physical location.

Higher pricing plans extend tailnets to integrate with identity providers (Microsoft Entra ID, Google Workspace, GitHub orgs, Okta) for org-wide device/user management.

Tailnet-wide capabilities managed from the admin console: access control policies, DNS settings, authentication settings, subnet routers, exit nodes, app connectors, high availability, grants-based access policies, Tailnet Lock, logging/streaming/events, sharing/invites, Serve, and Funnel.

### MagicDNS

MagicDNS automatically registers DNS names for every device in the tailnet, so `ssh username@monitoring` or `ping monitoring` works without needing the device's raw Tailscale IP.

- Tailnets created on or after **October 20, 2022** have MagicDNS enabled by default; otherwise enable it on the DNS page of the admin console.
- MagicDNS does not require a separate DNS nameserver on Tailscale v1.20+; earlier versions need at least one nameserver configured.
- Each device gets a **fully qualified domain name (FQDN)**: `<machine-name>.<tailnet-name>.ts.net`. Search domains let you type just the machine name.
- Devices **shared with you** (cross-tailnet sharing) are only reachable via MagicDNS using the **full FQDN**, not the short machine name, and require Tailscale v1.4+.
- Some macOS CLI tools (`host`, `nslookup`) bypass system DNS and won't resolve MagicDNS names even though `ping`/`ssh` will.
- The legacy `*.beta.tailscale.net` nameserver's support ended **September 13, 2024**; tailnets should be fully migrated to the `.ts.net` format.
- MagicDNS can be disabled tailnet-wide (DNS page toggle) or per-device (`tailscale set --accept-dns=false` on Linux; menu toggles on macOS/Windows).

Practical implication for this skill's stack (SvelteKit on Vercel, Neon Postgres): MagicDNS names are what a developer machine or a bastion host would use to address a subnet router or database-adjacent node by a stable, human-readable name instead of a CGNAT IP that could change across re-auth.
