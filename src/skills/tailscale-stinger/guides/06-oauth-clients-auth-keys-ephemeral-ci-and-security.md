# 06. OAuth clients, auth keys, ephemeral CI nodes, and the security/key-expiry model

## Auth keys vs. OAuth clients - pick the right one

An **auth key** registers a single device (or, if reusable, several) without an interactive login. It's simple but capped: 1-90 days of expiry, no way to get a "forever" key [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md]. An **OAuth client** is a longer-lived, scoped credential for calling the Tailscale API itself, and the documented pattern for indefinite automation access is an OAuth client with the `auth_keys` scope that **mints fresh auth keys on demand** rather than trying to keep one key alive forever [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md]. Default to an OAuth client, scoped to the minimum tags/scopes actually needed, for any CI or infrastructure-as-code use - not a raw long-lived auth key pasted into a secrets manager and forgotten about.

Whichever you use, **tag it**. An untagged auth key registers the device under the *generating person's* identity - never appropriate for a server or CI runner [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md].

## The tag-scoping rule that bites people

An OAuth client (or auth key) can only hand out tags it either exactly matches or owns via `tagOwners`. If a client holds `tag:admin-tooling` and needs to mint keys for `tag:ci` and `tag:db-bastion` individually (not both at once), each of those tags must list `tag:admin-tooling` as an owner in `tagOwners` - see the pattern in `references/example-acl-policy.md` [raw/tailscale--acls-and-tags--access-control.md, raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md].

## Ephemeral nodes for CI

Ephemeral nodes auto-remove 30-60 minutes after last activity, or immediately on `tailscale logout` inside the workload - the deterministic choice for a CI cleanup step. They can only be created via an ephemeral auth key or `tailscaled --state=mem:`, never through a normal login [raw/tailscale--ci-ephemeral-nodes--github-actions.md]. Full workflow example, including the federated-identity variant Tailscale itself recommends first: `references/github-actions-ephemeral-ci.md`.

One detail worth carrying into any CI review: a node that stays connected **4+ hours** stops being free ephemeral-minutes usage and starts counting as a standard tagged device - a red flag that a "CI runner" workflow is actually leaving something long-running rather than truly ephemeral [raw/tailscale--ci-ephemeral-nodes--github-actions.md].

## The security model has three separate clocks - don't conflate them

| Clock | Governs | Default |
| --- | --- | --- |
| Auth key expiry | Whether the key can still register a *new* device | 1-90 days |
| Node key expiry | Whether an *already-registered* device stays connected | 180 days for user devices; **disabled by default for tagged devices** |
| OAuth API token | Whether an API call succeeds | 1 hour, fixed, non-configurable |

[raw/tailscale--key-expiry-and-security-model--zero-trust.md, raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md]

The tagged-device default (key expiry off) is deliberate - a service account shouldn't silently stop working - but it means tagging a device is not a neutral action from a rotation-hygiene standpoint. Treat disabling expiry as a documented, per-device exception (a bastion, a subnet router, a genuinely hard-to-reach node), the same way the docs frame it for those specific cases, rather than an unexamined default just because it's what tagging does out of the box [raw/tailscale--key-expiry-and-security-model--zero-trust.md].

## Secret-value rotation is not this skill's job

Rotating an OAuth client secret or an auth key's *value* is a `doppler-stinger` concern. This skill owns what those credentials' tags and scopes actually grant network access to - the boundary matters because a rotated-but-still-overscoped credential is still a problem this skill's guides, not doppler's, are meant to catch.

## Is any of this actually needed - the honest check

Before building out tags, an OAuth client, and a CI ephemeral-node workflow for a two-person team with stable IPs, revisit whether the problem is real. Community consensus (weighted as opinion, not vendor doctrine) is that a solo developer or a couple of static-IP peers may be fully served by "one subnet router, one exit node, then stop," or even by plain WireGuard with no coordination plane at all [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md]. Reach for the full stack in this guide when IPs are unstable, a real private-network-shaped problem exists, or CI genuinely needs short-lived revocable access - not as a default "more secure" reflex.
