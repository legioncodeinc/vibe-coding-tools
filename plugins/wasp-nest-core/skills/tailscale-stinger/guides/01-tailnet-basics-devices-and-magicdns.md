# 01. Tailnet basics, devices, and MagicDNS

## What a tailnet actually is

A tailnet is formed the moment anyone first logs into Tailscale - there's no separate "create network" step. Every device that authenticates, whether as a user or under a tag, becomes a member. It's a private overlay: nothing about it is reachable from the public internet unless you deliberately expose something with Funnel [raw/tailscale--tailnet-devices-magicdns--overview.md].

Each tailnet gets a DNS name (`<name>.ts.net`) - either the auto-generated default or a personalized one set from the DNS page of the admin console. That name underpins MagicDNS, HTTPS certs, and Serve/Funnel URLs, so pick it deliberately for a team tailnet rather than leaving the random default [raw/tailscale--tailnet-devices-magicdns--overview.md].

Every device gets a private CGNAT-range IP (`100.x.y.z`). These are stable per-device but not guaranteed to survive a full re-auth - which is why MagicDNS names, not raw IPs, are what this skill's guides and references use for cross-device addressing (the bastion pattern in `references/db-bastion-pattern.md`, the CI ping check in `references/github-actions-ephemeral-ci.md`) [raw/tailscale--tailnet-devices-magicdns--overview.md].

## MagicDNS in practice

Once enabled (default on tailnets created after 2022-10-20), any device can reach another by short machine name: `ssh username@monitoring`, `ping monitoring`, or just typing `monitoring` in a browser. Under the hood this resolves to the full FQDN `monitoring.<tailnet>.ts.net`, and search domains make the short form work transparently [raw/tailscale--tailnet-devices-magicdns--overview.md].

Two gotchas worth flagging to a team new to this:
- Devices **shared with you** from outside your own tailnet only resolve by their **full FQDN**, never the short name [raw/tailscale--tailnet-devices-magicdns--overview.md].
- A few macOS CLI tools (`host`, `nslookup`) bypass system DNS resolution entirely and won't find MagicDNS names even though `ping`/`ssh` work fine - don't treat a failed `nslookup` as proof MagicDNS is broken [raw/tailscale--tailnet-devices-magicdns--overview.md].

## What to check before doing anything else with a tailnet

1. Confirm MagicDNS is on (DNS page of the admin console) - almost everything else in this skill assumes stable hostnames, not raw IPs.
2. Confirm the tailnet DNS name is what you want it to be before you start baking it into CI workflows, ACL comments, or Funnel URLs - changing it later means every reference needs updating.
3. Move on to `02-acls-and-tags-for-service-access.md` before adding a second human or any service device - the default policy is wide open [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].
