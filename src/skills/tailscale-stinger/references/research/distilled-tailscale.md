# Distilled Tailscale research

Dense, cited reference distilled from `raw/`. Every claim ends with `[raw/<file>]`. Research window: sources fetched/searched 2026-08-14; official docs undated per-page but Tailscale marks each with a "Last validated" date (all within Dec 2025 to Jun 2026 at fetch time); community posts dated 2026-03 to 2026-06. Stack context: SvelteKit (Svelte 5) on Vercel, Neon Postgres.

## 1. Tailnet, devices, MagicDNS

| Concept | Detail |
| --- | --- |
| Tailnet | Private network formed on first login; every authenticated device (user or tag identity) joins it [raw/tailscale--tailnet-devices-magicdns--overview.md] |
| Tailnet DNS name | `<name>.ts.net`, default or personalized, used by MagicDNS/HTTPS/sharing [raw/tailscale--tailnet-devices-magicdns--overview.md] |
| Device IP | Private CGNAT-range `100.x.y.z` address per device [raw/tailscale--tailnet-devices-magicdns--overview.md] |
| MagicDNS | Auto-registers `<machine-name>.<tailnet-name>.ts.net`; short machine name resolves via search domains; enabled by default on tailnets created after 2022-10-20 [raw/tailscale--tailnet-devices-magicdns--overview.md] |
| Cross-tailnet sharing | Shared devices resolve only by **full FQDN**, not short name, and need Tailscale v1.4+ [raw/tailscale--tailnet-devices-magicdns--overview.md] |

## 2. ACLs, grants, and tags

| Concept | Detail |
| --- | --- |
| Tailnet policy file | Declarative huJSON; holds `acls`, `grants`, `tagOwners`, `nodeAttrs`, `tests`, etc. [raw/tailscale--acls-and-tags--access-control.md] |
| Default with no `acls` section | **Allow-all** - a real footgun before a team writes its first policy [raw/tailscale--acls-and-tags--access-control.md] |
| ACLs vs. grants | ACLs = traditional src/dst/port; grants = newer, more expressive selector syntax; both deny-by-default once present [raw/tailscale--acls-and-tags--access-control.md] |
| Tags | Non-user, service-account identities for servers/CI/bastions; a device's identity is the **union** of its tags; tagging **removes** any user identity and vice versa [raw/tailscale--acls-and-tags--access-control.md] |
| Tag ownership | Defined in `tagOwners`; only owners (or Owner/Admin/Network admin) can apply a tag; tags can own other tags (hierarchies) [raw/tailscale--acls-and-tags--access-control.md] |
| Tag + OAuth/auth-key subset rule | Requested tags must exactly match the authenticating tag set, **or** each requested tag must list the authenticating tag as an owner in `tagOwners` [raw/tailscale--acls-and-tags--access-control.md, raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| Tagged-device SSH restriction | Tagged devices can only SSH to other tagged devices, never to user-identity devices [raw/tailscale--acls-and-tags--access-control.md] |
| Free tag allowance | 50 tagged devices on all plans [raw/tailscale--acls-and-tags--access-control.md] |

Example ACL/grant patterns and full copy-paste policy: `references/example-acl-policy.md`.

## 3. Tailscale SSH

| Concept | Detail |
| --- | --- |
| What it replaces | Public-key distribution for tailnet-originated SSH only; local `sshd_config`/`authorized_keys` untouched, non-tailnet SSH still works [raw/tailscale--ssh--tailscale-ssh.md] |
| Auth mechanism | WireGuard node-key auth; SSH protocol auth phase skipped (`none` type) since Tailscale already knows the peer [raw/tailscale--ssh--tailscale-ssh.md] |
| Server platform support | Linux, and macOS **open-source `tailscaled` variant only** [raw/tailscale--ssh--tailscale-ssh.md] |
| Enable on host | `tailscale set --ssh` (warning: hangs any existing SSH session over the Tailscale IP - do not run it over the session you're modifying) [raw/tailscale--ssh--tailscale-ssh.md] |
| Policy requirement | Needs both a general network-access rule **and** an SSH-specific rule (`action`, `src`, `dst`, `users`) src->dst; default policy (unmodified) permits SSH from everyone to everyone [raw/tailscale--ssh--tailscale-ssh.md] |
| Check mode | `action: "check"` forces IdP re-auth every `checkPeriod` (default 12h) for high-risk users/connections (e.g. `root`) [raw/tailscale--ssh--tailscale-ssh.md] |
| Revocation | Editing the ACL revokes access within seconds and can kill live sessions - no key purge needed [raw/tailscale--ssh--tailscale-ssh.md] |

## 4. Subnet routers and exit nodes

| Concept | Subnet router | Exit node |
| --- | --- | --- |
| Solves | Reaching a **specific private subnet** (VPC, office LAN, managed DB) from the tailnet [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] | Routing a device's **entire internet-bound traffic** (default route) through another tailnet device [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] |
| Setup command | `tailscale set --advertise-routes=<CIDR>,<CIDR>` after enabling IP forwarding [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] | `tailscale set --advertise-exit-node` after enabling IP forwarding [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] |
| Approval | Admin approves advertised routes on the Machines page, unless the advertising user is in `autoApprovers` [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] | Admin approves the exit-node device from the Machines page, unless in `autoApprovers` [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] |
| Access grant gotcha | Grant `dst` targets the subnet CIDR itself [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] | Grant `dst` must be `autogroup:internet`, **not** the exit-node device - naming the device only permits connecting to it, not routing through it [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] |
| Explicit official use case | "Securely connect to cloud-managed services like Amazon RDS or Google Cloud SQL without exposing them to the public internet" - directly analogous to a private database [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] | Untrusted wifi, geo-restricted access, compliance-mandated VPN routing [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] |
| Device-count impact | Devices behind a subnet router don't count against the plan's device limit [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md] | N/A |

Full command sequence: `references/subnet-router-setup.md`. Do not reach for an exit node to solve database reachability - that's a subnet-router (or Neon-native) problem [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].

## 5. Reaching a private Neon database - CONFLICT/GAP resolved

**Does Neon have a native Tailscale integration? No.** Neon's private-connectivity answer is **Neon Private Networking**, built on **AWS PrivateLink**, entirely independent of Tailscale [raw/tailscale--neon-private-networking--reaching-the-database.md]. No source in this sweep found a Neon-Tailscale first-party integration - stated as a gap, not inferred as absent from silence alone, since the Neon security-overview and Private-Networking docs pages were both fetched directly and neither mentions Tailscale [raw/tailscale--neon-private-networking--reaching-the-database.md].

| Neon Private Networking fact | Detail |
| --- | --- |
| Mechanism | AWS PrivateLink; Neon runs an endpoint service, customer creates a matching VPC endpoint in their own VPC [raw/tailscale--neon-private-networking--reaching-the-database.md] |
| Plan gate | Scale plan (Neon's blog announcement says "Business and Enterprise" - sources differ slightly on naming; verify live pricing before quoting a plan name) [raw/tailscale--neon-private-networking--reaching-the-database.md] |
| Region requirement | Client app and Neon DB must be in the **same AWS region** [raw/tailscale--neon-private-networking--reaching-the-database.md] |
| Cloud scope | AWS only, per the fetched sources [raw/tailscale--neon-private-networking--reaching-the-database.md] |
| App code changes | None - only the network path changes once DNS + endpoint restriction are configured [raw/tailscale--neon-private-networking--reaching-the-database.md] |

**Judgment call, flagged as inference not vendor claim**: because Neon Private Networking requires the *client application* to run inside a matching AWS VPC, and Vercel-hosted SvelteKit functions do not run inside a customer-controlled AWS VPC, **Neon Private Networking is not reachable from a standard Vercel deployment** [raw/tailscale--neon-private-networking--reaching-the-database.md]. This should be re-verified against current Neon/Vercel docs before treating it as permanent.

Given that gap, this skill's default pattern is a **Tailscale bastion host**: one tagged (`tag:db-bastion`), key-expiry-disabled node with reachability to the database, which developers and CI reach over the tailnet instead of per-IP-allowlisting every developer's changing IP in Neon [raw/tailscale--neon-private-networking--reaching-the-database.md, raw/tailscale--subnet-routers-exit-nodes--private-network-access.md]. Neon's own IP allowlist (Scale plan) plus enforced TLS may fully cover a team with stable IPs without introducing Tailscale at all - see §9 [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md]. Full bastion command sequence: `references/db-bastion-pattern.md`.

## 6. Ephemeral nodes and CI (GitHub Actions)

| Concept | Detail |
| --- | --- |
| Ephemeral node | Auto-removed **30-60 min** after last activity, or immediately on `tailscale logout` inside the workload [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |
| 4-hour rule | A node connected 4+ hours stops counting as ephemeral-minutes and counts as a standard tagged device instead [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |
| Creation path | Only via an **ephemeral auth key**, or `tailscaled --state=mem:` (v1.22+) - no interactive-login path [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |
| `tailscale/github-action@v4` auth methods, in Tailscale's preference order | 1. Federated identity (OIDC, `id-token: write`) - recommended, no long-lived secret. 2. OAuth client (`TS_OAUTH_CLIENT_ID`/`TS_OAUTH_SECRET`). 3. Auth key (`TAILSCALE_AUTHKEY`, must be reusable+ephemeral+tagged+pre-approved) [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |
| Federated-identity bonus | Ephemeral nodes it creates are auto-pre-approved even with device approval enabled tailnet-wide [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |
| `ping` parameter | Recommended in the action call to wait (up to 3 min) for netmap propagation before the next workflow step assumes connectivity [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |
| Prerequisite | At least one tag must already exist in the tailnet policy file before the workflow runs [raw/tailscale--ci-ephemeral-nodes--github-actions.md] |

Full workflow example: `references/github-actions-ephemeral-ci.md`.

## 7. Funnel and Serve

| | Serve | Funnel |
| --- | --- | --- |
| Visibility | Tailnet-only [raw/tailscale--funnel-and-serve--exposing-local-services.md] | Public internet, via `.ts.net` HTTPS URL [raw/tailscale--funnel-and-serve--exposing-local-services.md] |
| Port constraint | Any port | Only 443, 8443, 10000 [raw/tailscale--funnel-and-serve--exposing-local-services.md] |
| Domain | Any | `.ts.net` only, no custom domains [raw/tailscale--funnel-and-serve--exposing-local-services.md] |
| Bandwidth | Not documented as capped | Non-configurable bandwidth limits apply [raw/tailscale--funnel-and-serve--exposing-local-services.md] |
| Status | GA-equivalent (no beta note) | Explicitly **in beta** per Tailscale's own docs [raw/tailscale--funnel-and-serve--exposing-local-services.md] |
| Same port, both modes | Not possible - whichever command (`serve` or `funnel`) ran most recently on a port wins entirely [raw/tailscale--funnel-and-serve--exposing-local-services.md] |

Content modes for `serve`: reverse proxy (`http://127.0.0.1` targets only), file/directory server, static text, raw or TLS-terminated TCP forwarder (usable for non-HTTP protocols, e.g. a DB wire protocol or SSH) [raw/tailscale--funnel-and-serve--exposing-local-services.md]. Neither is positioned as a production ingress replacement for a real Vercel deployment - Funnel especially, given its beta status and bandwidth caps [raw/tailscale--funnel-and-serve--exposing-local-services.md]. Copy-paste commands: `references/serve-and-funnel-commands.md`.

## 8. Auth keys and OAuth clients

| Concept | Detail |
| --- | --- |
| Auth key identity | Untagged key = registers device as the generating user; tagged key = device takes the tag identity instead [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| Auth key expiry | 1-90 days, default 90 if unspecified; **independent** of the resulting device's node-key expiry [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| No long-lived auth keys | 90-day hard cap; the documented workaround is an **OAuth client with `auth_keys` scope** that mints fresh keys on demand via the API [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| OAuth API token | Exactly 1 hour, non-configurable [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| OAuth client ownership | Belongs to the tailnet, not the creating user - keeps working even if that user loses tailnet access [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| Direct registration shortcut | `tailscale up --auth-key=<oauth-secret> --advertise-tags=tag:ci` treats the OAuth secret as a one-shot auth key; `ephemeral` defaults **true**, `preauthorized` defaults **false** in this path [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |
| OAuth-minted devices | Always tag-owned, never user-identity [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md] |

Default recommendation for this stack's CI/automation: an OAuth client scoped to the minimum tags/scopes needed, not a raw long-lived auth key [raw/tailscale--auth-keys-and-oauth-clients--automation-credentials.md]. OAuth client **secret rotation** itself is a `doppler-stinger` concern, not this skill's - this skill owns what the resulting tags/scopes grant network access to.

## 9. Security model, key expiry, and the "is this overkill" judgment call

| Clock | Governs | Default |
| --- | --- | --- |
| Auth key expiry | Whether the key can still *register a new device* | 1-90 days, 90 if unset [raw/tailscale--key-expiry-and-security-model--zero-trust.md] |
| Node key expiry | Whether an *already-registered* device stays connected | 180 days for user-identity devices; **disabled by default** for tagged devices [raw/tailscale--key-expiry-and-security-model--zero-trust.md] |
| OAuth API token | Whether an API call using it succeeds | 1 hour, fixed [raw/tailscale--key-expiry-and-security-model--zero-trust.md] |

Node key expiry can be set tailnet-wide (1-180 days, applies only to future logins) or disabled per-device (documented use case: trusted servers, subnet routers, hard-to-reach remote/IoT nodes) [raw/tailscale--key-expiry-and-security-model--zero-trust.md]. A locked-out Tailscale-only device can be recovered via a 30-minute "Temporarily extend key" admin action [raw/tailscale--key-expiry-and-security-model--zero-trust.md]. **Inference, flagged as such**: disabling key expiry should be a deliberate, per-device documented exception (bastion, subnet router), not an unexamined default just because tagging disables it automatically - the docs don't say this in so many words, but it follows directly from combining the tag-default behavior with the least-privilege/zero-trust framing on the ACLs page [raw/tailscale--key-expiry-and-security-model--zero-trust.md, raw/tailscale--acls-and-tags--access-control.md].

**When a small team actually needs Tailscale** (synthesized from five independent community/technical posts, none official - weight accordingly) [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md]:
- Justified: developers on unstable/varying IPs needing reliable private-resource access; a real private-network-shaped problem (DB, internal dashboard, staging box) that doesn't scale with per-IP allowlisting; CI needing short-lived, revocable, auditable access to a private resource.
- Overkill: a solo developer or two static-IP peers - plain WireGuard or nothing may fully suffice; the docs' own honest floor is "one subnet router + one exit node, then stop" even within Tailscale's feature surface.
- **Non-negotiable warning repeated across sources**: the default ACL is wide-open (any device reaches any device on any port) and is explicitly called "a trap for a team" - write an explicit ACL before inviting anyone else into a shared tailnet.
- **Network access is not application authorization.** Putting a database behind a tailnet does not replace the app's own auth/RBAC layer - "a database that trusts every tailnet connection has an authorization model exactly one stolen laptop wide."

## Gaps and open questions (state plainly, do not guess)

1. **No confirmed Neon-Tailscale native integration** - Neon's own private-connectivity story is AWS PrivateLink, unrelated to Tailscale. If a future Neon feature changes this, re-verify before advising a customer [raw/tailscale--neon-private-networking--reaching-the-database.md].
2. **Whether Neon Private Networking is reachable from a Vercel-hosted SvelteKit app is an inference, not a confirmed fact** - it follows from "the VPC endpoint must sit in the same VPC as the client app," and Vercel functions don't run in a customer-owned AWS VPC by default, but no source directly states "Vercel cannot use Neon Private Networking." Re-verify against current docs [raw/tailscale--neon-private-networking--reaching-the-database.md].
3. **Small-team fit guidance (§9) is entirely community-sourced**, not official Tailscale doctrine - treat the specific pricing figures quoted in those posts as illustrative and unverified against Tailscale's live pricing page [raw/tailscale--small-team-fit--when-to-use-vs-overkill.md].
4. **No dedicated cryptographic/protocol-level security whitepaper was fetched** - claims deeper than key-expiry/ACL mechanics (e.g. WireGuard handshake specifics, DERP relay trust boundaries) are out of scope for this archive [raw/tailscale--key-expiry-and-security-model--zero-trust.md].
5. **Tailscale SSH raw capture was truncated mid-page** by the fetch tool on the `dst` field description - the captured content (action/src/users/checkPeriod/acceptEnv, the accept-vs-check semantics, and the full comparison table) is sufficient for this skill's guides, but a deeper SSH policy-syntax question should re-fetch the live page rather than assume completeness [raw/tailscale--ssh--tailscale-ssh.md].
